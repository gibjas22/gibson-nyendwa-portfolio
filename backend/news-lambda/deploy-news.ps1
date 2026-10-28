# deploy-news.ps1 - deploys the Birmingham news feed (Lambda + HTTP API) and switches the panel on.
# Run from the project folder, signed in as gibson-admin:
#   powershell -ExecutionPolicy Bypass -File .\backend\news-lambda\deploy-news.ps1
# Safe to run again: it reuses what already exists and updates the code.
# Creates: IAM role portfolio-news-role, Lambda portfolio-news, HTTP API portfolio-news-api (eu-west-2).

$ErrorActionPreference = "Stop"
$env:AWS_PAGER = ""
$AwsProfile = "gibson-portfolio"
$Region     = "eu-west-2"
$FeedUrl    = "https://www.birminghammail.co.uk/news/?service=rss"
$LinkHost   = "www.birminghammail.co.uk"
$Source     = "Birmingham Live"
$Origin     = "https://main.dbthjbi29n1oo.amplifyapp.com"
$Fn         = "portfolio-news"
$RoleName   = "portfolio-news-role"
$ApiName    = "portfolio-news-api"
$Here       = Split-Path -Parent $MyInvocation.MyCommand.Path
$Project    = Resolve-Path (Join-Path $Here "..\..")
$Tmp        = Join-Path $env:TEMP "portfolio-news"
New-Item -ItemType Directory -Force -Path $Tmp | Out-Null

function Step($t) { Write-Host ""; Write-Host "== $t ==" -ForegroundColor Cyan }
function Ok($t)   { Write-Host "   OK  $t" -ForegroundColor Green }
function Stop-With($t) { Write-Host "   STOP  $t" -ForegroundColor Red; exit 1 }
# Helpers call aws.exe explicitly; stderr is captured as text rather than raised as a PowerShell error.
function Run-Aws { $ErrorActionPreference = "Continue"; $out = & aws.exe @args --profile $AwsProfile --region $Region 2>&1; if ($LASTEXITCODE -ne 0) { throw ($out | Out-String) }; return ($out | Out-String) }
function Try-Aws { $ErrorActionPreference = "Continue"; $out = & aws.exe @args --profile $AwsProfile --region $Region 2>&1; return @{ ok = ($LASTEXITCODE -eq 0); text = ($out | Out-String) } }
function WriteAscii($path, $text) { [IO.File]::WriteAllText($path, $text, (New-Object Text.ASCIIEncoding)) }

Step "1. Check who is signed in"
$id = (Run-Aws sts get-caller-identity --output json) | ConvertFrom-Json
if ($id.Arn -notlike "*:user/gibson-admin") { Stop-With "Signed in as $($id.Arn). Run: aws login --region eu-west-2 --profile $AwsProfile (as gibson-admin)" }
$Account = $id.Account
Ok ("gibson-admin, account ********" + $Account.Substring(8))

Step "2. Check the feed works before creating anything"
try {
  $feed = Invoke-WebRequest -Uri $FeedUrl -UseBasicParsing -TimeoutSec 20 -Headers @{ "User-Agent" = "GibsonNyendwaPortfolio/1.0" }
  $items = ([regex]::Matches($feed.Content, "<item[\s>]")).Count
} catch { Stop-With "Could not read $FeedUrl : $($_.Exception.Message)" }
if ($items -lt 1) { Stop-With "The address answered but contains no RSS items. Check the feed URL." }
Ok "$items stories in the Birmingham Live feed"

Step "3. Execution role (CloudWatch Logs only)"
$role = Try-Aws iam get-role --role-name $RoleName --output json
if ($role.ok) { $RoleArn = ($role.text | ConvertFrom-Json).Role.Arn; Ok "Reusing $RoleName" }
else {
  $trust = Join-Path $Tmp "trust.json"
  WriteAscii $trust '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"Service":"lambda.amazonaws.com"},"Action":"sts:AssumeRole"}]}'
  $RoleArn = ((Run-Aws iam create-role --role-name $RoleName --assume-role-policy-document "file://$trust" --output json) | ConvertFrom-Json).Role.Arn
  Run-Aws iam attach-role-policy --role-name $RoleName --policy-arn "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole" | Out-Null
  Ok "Created $RoleName; waiting 12 seconds for IAM to propagate"
  Start-Sleep -Seconds 12
}

Step "4. Lambda function"
$zip = Join-Path $Tmp "news.zip"
if (Test-Path $zip) { Remove-Item $zip }
Compress-Archive -Path (Join-Path $Here "index.mjs") -DestinationPath $zip
$envFile = Join-Path $Tmp "env.json"
$envJson = @{ Variables = @{ FEED_URL = $FeedUrl; SOURCE_NAME = $Source; LINK_HOST = $LinkHost; MAX_ITEMS = "6" } } | ConvertTo-Json -Compress
WriteAscii $envFile $envJson
$fnCheck = Try-Aws lambda get-function --function-name $Fn --output json
if ($fnCheck.ok) {
  Run-Aws lambda update-function-code --function-name $Fn --zip-file "fileb://$zip" | Out-Null
  Run-Aws lambda wait function-updated-v2 --function-name $Fn
  Run-Aws lambda update-function-configuration --function-name $Fn --environment "file://$envFile" --timeout 10 --memory-size 128 | Out-Null
  Run-Aws lambda wait function-updated-v2 --function-name $Fn
  Ok "Updated $Fn"
} else {
  $created = $false
  for ($i = 1; $i -le 4 -and -not $created; $i++) {
    $r = Try-Aws lambda create-function --function-name $Fn --runtime nodejs20.x --architectures arm64 --handler index.handler --role $RoleArn --zip-file "fileb://$zip" --timeout 10 --memory-size 128 --environment "file://$envFile" --output json
    if ($r.ok) { $created = $true } elseif ($r.text -match "cannot be assumed") { Write-Host "   waiting for the role..."; Start-Sleep -Seconds 8 } else { throw $r.text }
  }
  if (-not $created) { Stop-With "Lambda could not be created (role not ready). Run the script again in a minute." }
  Run-Aws lambda wait function-active-v2 --function-name $Fn
  Ok "Created $Fn (Node.js 20, arm64, 128 MB, 10 s)"
}
$FnArn = ((Run-Aws lambda get-function --function-name $Fn --output json) | ConvertFrom-Json).Configuration.FunctionArn

Step "5. Test the function directly"
$out = Join-Path $Tmp "out.json"
Run-Aws lambda invoke --function-name $Fn $out | Out-Null
$resp = Get-Content $out -Raw | ConvertFrom-Json
if ($resp.statusCode -ne 200) { Stop-With "Function returned $($resp.statusCode): $($resp.body)" }
$body = $resp.body | ConvertFrom-Json
Ok "$($body.items.Count) headlines returned"

Step "6. HTTP API with CORS and throttling"
$apis = (Run-Aws apigatewayv2 get-apis --output json | ConvertFrom-Json).Items | Where-Object { $_.Name -eq $ApiName }
$cors = Join-Path $Tmp "cors.json"
WriteAscii $cors ('{"AllowOrigins":["' + $Origin + '"],"AllowMethods":["GET"],"MaxAge":3600}')
if ($apis) {
  $ApiId = $apis[0].ApiId
  Run-Aws apigatewayv2 update-api --api-id $ApiId --cors-configuration "file://$cors" | Out-Null
  Ok "Reusing $ApiName ($ApiId)"
} else {
  $ApiId = ((Run-Aws apigatewayv2 create-api --name $ApiName --protocol-type HTTP --cors-configuration "file://$cors" --output json) | ConvertFrom-Json).ApiId
  Ok "Created $ApiName ($ApiId)"
}
$integ = (Run-Aws apigatewayv2 get-integrations --api-id $ApiId --output json | ConvertFrom-Json).Items | Where-Object { $_.IntegrationUri -eq $FnArn }
if ($integ) { $IntegId = $integ[0].IntegrationId } else {
  $IntegId = ((Run-Aws apigatewayv2 create-integration --api-id $ApiId --integration-type AWS_PROXY --integration-uri $FnArn --payload-format-version 2.0 --output json) | ConvertFrom-Json).IntegrationId
}
$route = (Run-Aws apigatewayv2 get-routes --api-id $ApiId --output json | ConvertFrom-Json).Items | Where-Object { $_.RouteKey -eq "GET /news" }
if (-not $route) { Run-Aws apigatewayv2 create-route --api-id $ApiId --route-key "GET /news" --target "integrations/$IntegId" | Out-Null }
$stage = Try-Aws apigatewayv2 get-stage --api-id $ApiId --stage-name '$default'
if ($stage.ok) {
  Run-Aws apigatewayv2 update-stage --api-id $ApiId --stage-name '$default' --default-route-settings "ThrottlingBurstLimit=10,ThrottlingRateLimit=5" | Out-Null
} else {
  Run-Aws apigatewayv2 create-stage --api-id $ApiId --stage-name '$default' --auto-deploy --default-route-settings "ThrottlingBurstLimit=10,ThrottlingRateLimit=5" | Out-Null
}
$perm = Try-Aws lambda add-permission --function-name $Fn --statement-id apigw-news-get --action lambda:InvokeFunction --principal apigateway.amazonaws.com --source-arn "arn:aws:execute-api:${Region}:${Account}:${ApiId}/*/GET/news"
if (-not $perm.ok -and $perm.text -notmatch "already exists") { throw $perm.text }
$Endpoint = "https://$ApiId.execute-api.$Region.amazonaws.com/news"
Ok "Route GET /news, CORS for $Origin, throttling 10 burst / 5 per second"

Step "7. Test the public endpoint"
Start-Sleep -Seconds 3
$live = $null
for ($i = 1; $i -le 5 -and -not $live; $i++) {
  try { $live = Invoke-RestMethod -Uri $Endpoint -Headers @{ Origin = $Origin } -TimeoutSec 15 } catch { Start-Sleep -Seconds 4 }
}
if (-not $live) { Stop-With "Endpoint did not answer yet: $Endpoint . Wait a minute and open it in a browser." }
Ok "$($live.items.Count) headlines from $Endpoint"
$live.items | Select-Object -First 3 | ForEach-Object { Write-Host ("      - " + $_.title) }

Step "8. Switch the panel on in js/news.js"
$newsJs = Join-Path $Project "js\news.js"
$code = Get-Content $newsJs -Raw
$code = [regex]::Replace($code, 'const NEWS_ENDPOINT = "[^"]*";', ('const NEWS_ENDPOINT = "' + $Endpoint + '";'))
[IO.File]::WriteAllText($newsJs, $code, (New-Object Text.UTF8Encoding $false))
Ok "NEWS_ENDPOINT set"

Write-Host ""
Write-Host "DONE. Endpoint: $Endpoint" -ForegroundColor Green
Write-Host "Now publish it:  git add -A ; git commit -m 'Switch on Birmingham news panel' ; git push" -ForegroundColor Green
