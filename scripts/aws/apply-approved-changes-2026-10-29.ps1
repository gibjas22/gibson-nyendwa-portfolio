# apply-approved-changes-2026-10-29.ps1
# Applies the two AWS changes Gibson approved on 29 October 2026, and nothing else:
#   A. CloudWatch Logs: 30-day retention on /aws/lambda/portfolio-news (eu-west-2) only.
#   B. Amplify: unknown URLs show /404.html with HTTP status 404 (app dbthjbi29n1oo).
# Run from the project folder, signed in as gibson-admin, AFTER the commit containing the
# root-relative 404.html has been pushed and deployed:
#   powershell -ExecutionPolicy Bypass -File .\scripts\aws\apply-approved-changes-2026-10-29.ps1
# It prints before and after values, keeps a backup of the Amplify rules in scratch\ (git-ignored),
# and writes a masked record to docs\evidence\aws-changes-2026-10-29.txt.

$ErrorActionPreference = "Stop"
$env:AWS_PAGER = ""
$AwsProfile = "gibson-portfolio"; $Region = "eu-west-2"
$AppId = "dbthjbi29n1oo"; $Site = "https://main.dbthjbi29n1oo.amplifyapp.com"
$LogGroup = "/aws/lambda/portfolio-news"; $Days = 30
$Here = Split-Path -Parent $MyInvocation.MyCommand.Path
$Project = Resolve-Path (Join-Path $Here "..\..")
$Scratch = Join-Path $Project "scratch"; New-Item -ItemType Directory -Force -Path $Scratch | Out-Null
$Stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$script:lines = New-Object System.Collections.Generic.List[string]

function Mask($t) { return ([regex]::Replace([string]$t, '\b\d{8}(\d{4})\b', '********$1')) }
function Say($t, $c = "Gray") { $m = Mask $t; Write-Host $m -ForegroundColor $c; $script:lines.Add($m) }
function Head($t) { Say ""; Say "== $t ==" "Cyan" }
function Stop-With($t) { Say "STOP: $t" "Red"; exit 1 }
function Run { $ErrorActionPreference = "Continue"; $o = & aws.exe @args --profile $AwsProfile --region $Region --output json 2>&1; if ($LASTEXITCODE -ne 0) { throw ($o | Out-String) }; $t = ($o | Out-String).Trim(); if ($t) { return ($t | ConvertFrom-Json) } }
function WriteAscii($path, $text) { [IO.File]::WriteAllText($path, $text, (New-Object Text.ASCIIEncoding)) }
function Status($path) {
  try { $r = Invoke-WebRequest -Uri ($Site + $path) -UseBasicParsing -TimeoutSec 20 -MaximumRedirection 0; return @{ code = [int]$r.StatusCode; body = $r.Content } }
  catch {
    $resp = $_.Exception.Response
    if (-not $resp) { return @{ code = 0; body = $_.Exception.Message } }
    $body = ""
    if ($_.ErrorDetails -and $_.ErrorDetails.Message) { $body = $_.ErrorDetails.Message }
    elseif ($resp.PSObject.Methods.Name -contains "GetResponseStream") { $body = (New-Object IO.StreamReader($resp.GetResponseStream())).ReadToEnd() }
    return @{ code = [int]$resp.StatusCode; body = $body }
  }
}

Say ("Run started " + (Get-Date -Format "dd MMMM yyyy HH:mm:ss") + " (Europe/London), region $Region")

Head "1. Who is signed in"
$id = Run sts get-caller-identity
if ($id.Arn -notlike "*:user/gibson-admin") { Stop-With "Signed in as $($id.Arn). Run: aws login --region $Region --profile $AwsProfile" }
Say "Signed in as $($id.Arn)"

Head "A. CloudWatch Logs retention"
$lg = (Run logs describe-log-groups --log-group-name-prefix $LogGroup).logGroups | Where-Object { $_.logGroupName -eq $LogGroup }
if (-not $lg) { Stop-With "Log group $LogGroup not found in $Region. Nothing changed." }
$before = if ($lg.retentionInDays) { "$($lg.retentionInDays) days" } else { "never expires" }
Say "Log group: $LogGroup ($Region) | stored $([math]::Round($lg.storedBytes/1KB,1)) KB | retention before: $before"
if ($lg.retentionInDays -eq $Days) { Say "Already $Days days; no change made." "Green" }
else {
  Run logs put-retention-policy --log-group-name $LogGroup --retention-in-days $Days | Out-Null
  $after = ((Run logs describe-log-groups --log-group-name-prefix $LogGroup).logGroups | Where-Object { $_.logGroupName -eq $LogGroup }).retentionInDays
  if ($after -ne $Days) { Stop-With "Retention reads back as '$after', expected $Days." }
  Say ("Retention after: $after days (set " + (Get-Date -Format "HH:mm:ss") + "). Log events older than $Days days will now expire.") "Green"
}
Say "Rollback: aws logs delete-retention-policy --log-group-name $LogGroup --region $Region --profile $AwsProfile   (back to never expires)"

Head "B. Amplify custom 404 page"
$check = Status "/404.html"
if ($check.code -ne 200 -or $check.body -notmatch 'href="/css/styles.css"') { Stop-With "The updated 404.html is not live yet (push the commit and wait for the Amplify build). Nothing changed in Amplify." }
Say "Live /404.html is the updated version (root-relative links): OK"
$app = (Run amplify get-app --app-id $AppId).app
$rules = @($app.customRules | Where-Object { $_ })
# The first run keeps the original rules; later runs never overwrite that file, so rollback always restores the original.
$backup = Join-Path $Scratch "amplify-custom-rules-original-2026-10-29.json"
if (-not (Test-Path $backup)) { WriteAscii $backup (ConvertTo-Json -InputObject $rules -Depth 6); $note = "original rules saved to" } else { $note = "original rules already saved in" }
Say "Rules before ($($rules.Count)); $note scratch\$(Split-Path $backup -Leaf):"
$rules | ForEach-Object { Say ("  source '" + $_.source + "' -> target '" + $_.target + "' | status " + $_.status + $(if ($_.condition) { " | condition " + $_.condition } else { "" })) }

$catch = $rules | Where-Object { $_.source -eq "/<*>" -and ($_.status -eq "404" -or $_.status -eq "404-200") }
$new = @()
if ($catch) {
  foreach ($r in $rules) {
    if ($r.source -eq "/<*>" -and ($r.status -eq "404" -or $r.status -eq "404-200")) {
      $o = [ordered]@{ source = "/<*>"; target = "/404.html"; status = "404" }; if ($r.condition) { $o.condition = $r.condition }; $new += [pscustomobject]$o
    } else { $new += $r }
  }
  Say "Change: the existing catch-all rule now points at /404.html with status 404. Other rules unchanged."
} else {
  $new = $rules + @([pscustomobject][ordered]@{ source = "/<*>"; target = "/404.html"; status = "404" })
  Say "Change: no catch-all rule existed; added '/<*>' -> '/404.html' (404) after the existing rules."
}
$rulesFile = Join-Path $Scratch "amplify-custom-rules-new-$Stamp.json"
WriteAscii $rulesFile (ConvertTo-Json -InputObject @($new) -Depth 6)
Run amplify update-app --app-id $AppId --custom-rules "file://$rulesFile" | Out-Null
$afterRules = @((Run amplify get-app --app-id $AppId).app.customRules)
Say "Rules after ($($afterRules.Count)):"
$afterRules | ForEach-Object { Say ("  source '" + $_.source + "' -> target '" + $_.target + "' | status " + $_.status) }
Say "Rollback: aws amplify update-app --app-id $AppId --custom-rules file://scratch/$(Split-Path $backup -Leaf) --region $Region --profile $AwsProfile"

Head "C. Live checks (rules can take a minute to apply)"
Start-Sleep -Seconds 20
$tests = @(
  @{ p = "/"; want = 200; page = $false }, @{ p = "/index.html"; want = 200; page = $false }, @{ p = "/insights/"; want = 200; page = $false },
  @{ p = "/insights/article.html?slug=whats-on-in-birmingham-guide"; want = 200; page = $false }, @{ p = "/css/styles.css"; want = 200; page = $false },
  @{ p = "/assets/audio/classroom.mp3"; want = 200; page = $false },
  @{ p = "/no-such-page"; want = 404; page = $true }, @{ p = "/insights/missing-article.html"; want = 404; page = $true }, @{ p = "/a/b/c"; want = 404; page = $true }
)
$fails = 0
foreach ($t in $tests) {
  $r = Status $t.p
  $isPage = $r.body -match "That page is not here"
  $ok = ($r.code -eq $t.want) -and ($isPage -eq $t.page)
  if (-not $ok) { $fails++ }
  Say ("{0,-58} {1} {2}{3}" -f $t.p, $r.code, $(if ($isPage) { "custom 404 page" } else { "normal content" }), $(if ($ok) { "  OK" } else { "  UNEXPECTED (wanted $($t.want))" })) $(if ($ok) { "Gray" } else { "Yellow" })
}
try { $api = Invoke-RestMethod -Uri "https://776bh82jm8.execute-api.eu-west-2.amazonaws.com/news" -TimeoutSec 15; Say "What's On API: 200, $($api.items.Count) items (separate domain, unaffected)" } catch { Say "What's On API check failed: $($_.Exception.Message)" "Yellow" }
if ($fails) { Say "$fails check(s) unexpected. If the rule has only just been saved, wait a minute and re-run this script (it is safe to run again)." "Yellow" }
else { Say "All checks passed." "Green" }

$out = Join-Path $Project "docs\evidence\aws-changes-2026-10-29.txt"
$script:lines | Set-Content -Path $out -Encoding UTF8
Write-Host ""; Write-Host "Saved masked record: $out" -ForegroundColor Green
