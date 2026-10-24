$ErrorActionPreference = 'Stop'
$node = Get-Command node -ErrorAction SilentlyContinue
if (-not $node) { throw 'Node.js 20 or newer is required. Install it from https://nodejs.org/ and reopen PowerShell.' }
$serverPath = Join-Path $PSScriptRoot 'server.mjs'
$job = Start-Job -ScriptBlock { param($scriptPath) node $scriptPath } -ArgumentList $serverPath
try {
  $ready = $false
  for ($attempt = 0; $attempt -lt 30; $attempt++) {
    Start-Sleep -Milliseconds 250
    $client = [System.Net.Sockets.TcpClient]::new()
    try { $client.Connect('127.0.0.1', 4173); $ready = $true; break } catch {} finally { $client.Dispose() }
  }
  if (-not $ready) { throw 'LifeQuest did not start on port 4173.' }
  Start-Process 'http://localhost:4173'
  Write-Host 'LifeQuest is running. Press Enter here to stop the local server.'
  [void](Read-Host)
} finally {
  Stop-Job $job -ErrorAction SilentlyContinue
  Remove-Job $job -Force -ErrorAction SilentlyContinue
}
