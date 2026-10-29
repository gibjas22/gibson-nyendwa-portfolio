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

Head "7. Amazon CloudWatch Logs and metrics"
$lgName = "/aws/lambda/$Fn"
$lg = (Q logs describe-log-groups --log-group-name-prefix $lgName).logGroups | Where-Object { $_.logGroupName -eq $lgName }
if ($lg) {
  Say "Log group $lgName | retention $(if ($lg.retentionInDays) { "$($lg.retentionInDays) days" } else { 'never expires' }) | stored $([math]::Round($lg.storedBytes/1KB,1)) KB"
  $streams = (Q logs describe-log-streams --log-group-name $lgName --order-by LastEventTime --descending --max-items 3).logStreams
  $streams | ForEach-Object { Say ("Latest stream (name truncated): " + $_.logStreamName.Substring(0, [Math]::Min(18, $_.logStreamName.Length)) + "... | last event " + [DateTimeOffset]::FromUnixTimeMilliseconds($_.lastEventTimestamp).UtcDateTime.ToString("yyyy-MM-dd HH:mm:ss 'UTC'")) }
} else { Say "No log group named $lgName in $Region" "Yellow" }

# Harmless test request: one public GET, then look for the matching Lambda run in the logs.
if ($api -and $lg) {
  $t0 = [DateTimeOffset]::UtcNow
  try { $tr = Invoke-RestMethod -Uri "$($api.ApiEndpoint)/news?section=music" -Headers @{ Origin = $Site } -TimeoutSec 15; Say ("Test request at " + $t0.UtcDateTime.ToString("HH:mm:ss 'UTC'") + ": GET /news?section=music -> $($tr.items.Count) items") }
  catch { Say "Test request failed: $($_.Exception.Message)" "Yellow" }
  $found = $null
  for ($i = 0; $i -lt 6 -and -not $found; $i++) {
    Start-Sleep -Seconds 10
    $ev = Q logs filter-log-events --log-group-name $lgName --start-time ($t0.ToUnixTimeMilliseconds() - 5000) --filter-pattern '"REPORT RequestId"'
    if ($ev -and $ev.events.Count) { $found = $ev.events | Select-Object -Last 1 }
  }
  if ($found) {
    $line = [regex]::Replace($found.message.Trim(), 'RequestId: ([0-9a-f]{8})[0-9a-f-]+', 'RequestId: $1...')
    Say ("Matching log entry at " + [DateTimeOffset]::FromUnixTimeMilliseconds($found.timestamp).UtcDateTime.ToString("HH:mm:ss 'UTC'") + ": " + ($line -replace '\s+', ' '))
    Say "Note: a 15-minute cache can answer repeat requests inside the same Lambda instance; the REPORT line still records every run."
  } else { Say "No REPORT line found within 60 s of the test request (log delivery can lag; run the script again)" "Yellow" }
}

$start = (Get-Date).ToUniversalTime().AddDays(-1).ToString("yyyy-MM-ddTHH:mm:ssZ"); $end = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
foreach ($m in "Invocations", "Errors", "Throttles") {
  $d = Q cloudwatch get-metric-statistics --namespace AWS/Lambda --metric-name $m --dimensions "Name=FunctionName,Value=$Fn" --start-time $start --end-time $end --period 86400 --statistics Sum
  Say ("Lambda $m (24 h): " + $(if ($d -and $d.Datapoints) { ($d.Datapoints | Measure-Object Sum -Sum).Sum } else { 0 }))
}
if ($lg) {
  $f = Q logs filter-log-events --log-group-name $lgName --start-time ([DateTimeOffset]::UtcNow.AddDays(-1).ToUnixTimeMilliseconds()) --filter-pattern '"news fetch failed"'
  Say ("Feed failures logged (24 h): " + $(if ($f) { $f.events.Count } else { "could not read" }))
}

Head "8. AWS Budgets (read-only; no test notification is sent)"
function MaskMail($a) { if ($a -match '^(.)[^@]*@(.+)$') { return "$($Matches[1])***@$($Matches[2])" } else { return "(hidden)" } }
$b = Q budgets describe-budgets --account-id $id.Account
if ($b -and $b.Budgets) {
  foreach ($bd in $b.Budgets) {
    Say "Budget: $($bd.BudgetName) | type $($bd.BudgetType) | period $($bd.TimeUnit) | limit $($bd.BudgetLimit.Amount) $($bd.BudgetLimit.Unit)"
    if ($bd.CalculatedSpend.ActualSpend) { Say "  Actual spend this period: $($bd.CalculatedSpend.ActualSpend.Amount) $($bd.CalculatedSpend.ActualSpend.Unit)" }
    $n = Q budgets describe-notifications-for-budget --account-id $id.Account --budget-name $bd.BudgetName
    if ($n -and $n.Notifications) {
      foreach ($no in $n.Notifications) {
        $subs = Q budgets describe-subscribers-for-notification --account-id $id.Account --budget-name $bd.BudgetName --notification ("NotificationType=$($no.NotificationType),ComparisonOperator=$($no.ComparisonOperator),Threshold=$($no.Threshold),ThresholdType=$(if ($no.ThresholdType) { $no.ThresholdType } else { 'PERCENTAGE' })")
        $who = if ($subs -and $subs.Subscribers) { ($subs.Subscribers | ForEach-Object { "$($_.SubscriptionType) " + $(if ($_.SubscriptionType -eq 'EMAIL') { MaskMail $_.Address } else { '(topic)' }) }) -join ", " } else { "no subscribers found" }
        Say "  Alert: $($no.NotificationType) $($no.ComparisonOperator) $($no.Threshold)$(if ($no.ThresholdType -eq 'ABSOLUTE_VALUE') { '' } else { '%' }) | state $($no.NotificationState) | to: $who"
      }
    } else { Say "  No alerts configured on this budget" "Yellow" }
  }
  Say "Budgets send alerts only; they do not stop spending or switch services off."
} else { Say "No budgets found, or no permission to read them" "Yellow" }

Head "9. Planned services (expected to be absent until deployed)"
$c = Q lambda get-function-configuration --function-name portfolio-contact
Say ("Contact form Lambda: " + $(if ($c) { "exists" } else { "not deployed (planned)" }))
$ses = Q sesv2 get-account
Say ("Amazon SES: " + $(if ($ses) { "production access $($ses.ProductionAccessEnabled), sending enabled $($ses.SendingEnabled)" } else { "not set up or not readable" }))

$script:lines | Set-Content -Path $Out -Encoding UTF8
$Pub = Join-Path $Project ("docs\evidence\aws-evidence-" + (Get-Date -Format "yyyy-MM-dd") + ".txt")
$script:lines | Set-Content -Path $Pub -Encoding UTF8
Write-Host ""; Write-Host "Saved: $Out (private) and $Pub (masked copy for the repo; read it before committing)" -ForegroundColor Green
