# collect-aws-evidence.ps1 - READ-ONLY evidence for docs/AWS-SERVICES.md.
# Makes no changes to AWS. Masks the account ID. Prints no secrets or environment variable values.
# Run from the project folder, signed in as gibson-admin (aws login --region eu-west-2 --profile gibson-portfolio):
#   powershell -ExecutionPolicy Bypass -File .\docs\evidence\collect-aws-evidence.ps1
# Output: on screen and in scratch\aws-evidence-<date>.txt (scratch\ is git-ignored). Check it before sharing.

$env:AWS_PAGER = ""
$AwsProfile = "gibson-portfolio"; $Region = "eu-west-2"
$AppId = "dbthjbi29n1oo"; $Site = "https://main.dbthjbi29n1oo.amplifyapp.com"
$Fn = "portfolio-news"; $Role = "portfolio-news-role"; $ApiName = "portfolio-news-api"
$Here = Split-Path -Parent $MyInvocation.MyCommand.Path
$Project = Resolve-Path (Join-Path $Here "..\..")
$OutDir = Join-Path $Project "scratch"; New-Item -ItemType Directory -Force -Path $OutDir | Out-Null
$Out = Join-Path $OutDir ("aws-evidence-" + (Get-Date -Format "yyyy-MM-dd-HHmm") + ".txt")
$script:lines = New-Object System.Collections.Generic.List[string]

function Mask($t) { return ([regex]::Replace([string]$t, '\b\d{8}(\d{4})\b', '********$1')) }
function Say($t, $c = "Gray") { $m = Mask $t; Write-Host $m -ForegroundColor $c; $script:lines.Add($m) }
function Head($t) { Say ""; Say "== $t ==" "Cyan" }
function Q { $ErrorActionPreference = "Continue"; $o = & aws.exe @args --profile $AwsProfile --region $Region --output json 2>&1; if ($LASTEXITCODE -ne 0) { return $null }; try { return (($o | Out-String) | ConvertFrom-Json) } catch { return $null } }

Say ("Evidence run: " + (Get-Date -Format "dd MMMM yyyy HH:mm") + ", region $Region (read-only)")

Head "1. Identity (IAM user, never root)"
$id = Q sts get-caller-identity
if ($id) { Say "Signed in as: $($id.Arn)" } else { Say "Not signed in. Run: aws login --region eu-west-2 --profile $AwsProfile" "Red"; exit 1 }
$mfa = Q iam list-mfa-devices --user-name gibson-admin
Say ("MFA devices on gibson-admin: " + $(if ($mfa) { $mfa.MFADevices.Count } else { "could not read" }))

Head "2. AWS Amplify Hosting"
$app = Q amplify get-app --app-id $AppId
if ($app) {
  Say "App: $($app.app.name) | platform $($app.app.platform) | domain $($app.app.defaultDomain)"
  Say "Repository: $($app.app.repository)"
  Say ("Custom headers configured: " + $(if ($app.app.customHeaders) { "yes" } else { "none in app settings (customHttp.yml in the repo is used instead)" }))
}
$jobs = Q amplify list-jobs --app-id $AppId --branch-name main --max-results 5
if ($jobs) { $jobs.jobSummaries | ForEach-Object { Say ("Deploy job $($_.jobId): $($_.status) | $(("" + $_.commitId).PadRight(7).Substring(0,7)) | $($_.startTime)") } }

Head "3. Security headers on the live site"
try {
  $r = Invoke-WebRequest -Uri $Site -UseBasicParsing -Method Head -TimeoutSec 20
  foreach ($h in "Content-Security-Policy", "Strict-Transport-Security", "X-Content-Type-Options", "Referrer-Policy", "Permissions-Policy", "X-Frame-Options") {
    Say ("{0,-26} {1}" -f $h, $(if ($r.Headers[$h]) { "present" } else { "MISSING" }))
  }
} catch { Say "Could not reach $Site : $($_.Exception.Message)" "Yellow" }

Head "4. AWS Lambda ($Fn)"
$cfg = Q lambda get-function-configuration --function-name $Fn
if ($cfg) {
  Say "Runtime $($cfg.Runtime) | $($cfg.Architectures -join ',') | $($cfg.MemorySize) MB | timeout $($cfg.Timeout) s | last modified $($cfg.LastModified)"
  Say ("Environment variable names (values not shown): " + (($cfg.Environment.Variables.PSObject.Properties.Name) -join ", "))
  Say ("Execution role: " + ($cfg.Role -replace '^.*:role/', ''))
} else { Say "Function not found" "Yellow" }

Head "5. IAM execution role ($Role): permissions"
$pol = Q iam list-attached-role-policies --role-name $Role
if ($pol) { $pol.AttachedPolicies | ForEach-Object { Say "Attached: $($_.PolicyName)" } }
$inl = Q iam list-role-policies --role-name $Role
if ($inl) { Say ("Inline policies: " + $(if ($inl.PolicyNames.Count) { $inl.PolicyNames -join ", " } else { "none" })) }

Head "6. Amazon API Gateway (HTTP API)"
$api = (Q apigatewayv2 get-apis).Items | Where-Object { $_.Name -eq $ApiName } | Select-Object -First 1
if ($api) {
  Say "API $($api.Name) ($($api.ApiId)) | protocol $($api.ProtocolType) | endpoint $($api.ApiEndpoint)"
  Say ("CORS origins: " + ($api.CorsConfiguration.AllowOrigins -join ", ") + " | methods: " + ($api.CorsConfiguration.AllowMethods -join ", "))
  (Q apigatewayv2 get-routes --api-id $api.ApiId).Items | ForEach-Object { Say "Route: $($_.RouteKey)" }
  $st = Q apigatewayv2 get-stage --api-id $api.ApiId --stage-name '$default'
  if ($st) { Say "Stage `$default | auto-deploy $($st.AutoDeploy) | burst $($st.DefaultRouteSettings.ThrottlingBurstLimit) | rate $($st.DefaultRouteSettings.ThrottlingRateLimit)/s" }
  $ep = "$($api.ApiEndpoint)/news"
  foreach ($s in "", "food-drink", "family", "music", "news", "business") {
    $u = if ($s) { "$($ep)?section=$s" } else { $ep }
    try {
      $j = Invoke-RestMethod -Uri $u -Headers @{ Origin = $Site } -TimeoutSec 15
      $paths = ($j.items | ForEach-Object { ([uri]$_.link).AbsolutePath.Split('/')[1] } | Sort-Object -Unique) -join ","
      Say ("GET /news" + $(if ($s) { "?section=$s" } else { " (default)" }) + " -> 200 | section $($j.section) | $($j.items.Count) items | link paths: $paths")
    } catch { Say ("GET /news?section=$s -> " + $_.Exception.Message) "Yellow" }
  }
} else { Say "API not found" "Yellow" }

Head "7. Amazon CloudWatch (logs and metrics, last 24 hours)"
$lg = (Q logs describe-log-groups --log-group-name-prefix "/aws/lambda/$Fn").logGroups
if ($lg) { $lg | ForEach-Object { Say "Log group $($_.logGroupName) | retention $(if ($_.retentionInDays) { "$($_.retentionInDays) days" } else { 'never expires' }) | stored $([math]::Round($_.storedBytes/1KB,1)) KB" } }
else { Say "No log group yet for $Fn" "Yellow" }
$start = (Get-Date).ToUniversalTime().AddDays(-1).ToString("yyyy-MM-ddTHH:mm:ssZ"); $end = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
foreach ($m in "Invocations", "Errors", "Throttles") {
  $d = Q cloudwatch get-metric-statistics --namespace AWS/Lambda --metric-name $m --dimensions "Name=FunctionName,Value=$Fn" --start-time $start --end-time $end --period 86400 --statistics Sum
  Say ("Lambda $m (24 h): " + $(if ($d -and $d.Datapoints) { ($d.Datapoints | Measure-Object Sum -Sum).Sum } else { 0 }))
}
if ($lg) {
  $f = Q logs filter-log-events --log-group-name "/aws/lambda/$Fn" --start-time ([DateTimeOffset]::UtcNow.AddDays(-1).ToUnixTimeMilliseconds()) --filter-pattern '"news fetch failed"'
  Say ("Feed failures logged (24 h): " + $(if ($f) { $f.events.Count } else { "could not read" }))
}

Head "8. AWS Budgets"
$b = Q budgets describe-budgets --account-id $id.Account
if ($b -and $b.Budgets) { $b.Budgets | ForEach-Object { Say "Budget $($_.BudgetName) | limit $($_.BudgetLimit.Amount) $($_.BudgetLimit.Unit) per $($_.TimeUnit.ToLower())" } } else { Say "No budgets found or no permission" "Yellow" }

Head "9. Planned services (expected to be absent until deployed)"
$c = Q lambda get-function-configuration --function-name portfolio-contact
Say ("Contact form Lambda: " + $(if ($c) { "exists" } else { "not deployed (planned)" }))
$ses = Q sesv2 get-account
Say ("Amazon SES: " + $(if ($ses) { "production access $($ses.ProductionAccessEnabled), sending enabled $($ses.SendingEnabled)" } else { "not set up or not readable" }))

$script:lines | Set-Content -Path $Out -Encoding UTF8
Write-Host ""; Write-Host "Saved: $Out (check it, then share or screenshot)" -ForegroundColor Green
