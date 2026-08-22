<#
    Silicious — anteprima locale del sito
    -------------------------------------
    Avvia un piccolo server web sul tuo computer per vedere il sito
    esattamente come apparirà online, senza dover installare nulla.

    COME SI USA
    1. Tasto destro su questo file  ->  "Esegui con PowerShell"
       (oppure, da PowerShell:  powershell -ExecutionPolicy Bypass -File serve.ps1 )
    2. Apri il browser su  http://localhost:8080
    3. Per fermarlo: torna sulla finestra nera e premi CTRL + C
#>

param([int]$Port = 8080)

$radice = Split-Path -Parent $MyInvocation.MyCommand.Path
$prefix = "http://localhost:$Port/"

$tipi = @{
  ".html" = "text/html; charset=utf-8"
  ".css"  = "text/css; charset=utf-8"
  ".js"   = "application/javascript; charset=utf-8"
  ".json" = "application/json; charset=utf-8"
  ".svg"  = "image/svg+xml"
  ".png"  = "image/png"
  ".jpg"  = "image/jpeg"
  ".jpeg" = "image/jpeg"
  ".webp" = "image/webp"
  ".ico"  = "image/x-icon"
  ".pdf"  = "application/pdf"
  ".txt"  = "text/plain; charset=utf-8"
  ".xml"  = "application/xml; charset=utf-8"
  ".woff2"= "font/woff2"
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)
try { $listener.Start() } catch {
  Write-Host "Impossibile avviare il server sulla porta $Port." -ForegroundColor Red
  Write-Host "Prova con un'altra porta:  .\serve.ps1 -Port 8090" -ForegroundColor Yellow
  exit 1
}

Write-Host ""
Write-Host "  Silicious - anteprima locale attiva" -ForegroundColor Green
Write-Host "  Apri il browser su:  $prefix" -ForegroundColor Cyan
Write-Host "  Cartella servita:    $radice"
Write-Host "  Premi CTRL+C per fermare."
Write-Host ""

while ($listener.IsListening) {
  try {
    $ctx = $listener.GetContext()
  } catch { break }

  $percorso = [System.Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath)
  if ($percorso.EndsWith("/")) { $percorso += "index.html" }
  $file = Join-Path $radice ($percorso.TrimStart("/") -replace "/", "\")

  # Non uscire mai dalla cartella del sito
  $pieno = [System.IO.Path]::GetFullPath($file)
  if (-not $pieno.StartsWith([System.IO.Path]::GetFullPath($radice))) {
    $ctx.Response.StatusCode = 403; $ctx.Response.Close(); continue
  }

  if (Test-Path $pieno -PathType Leaf) {
    $ext = [System.IO.Path]::GetExtension($pieno).ToLower()
    $ctx.Response.ContentType = $(if ($tipi.ContainsKey($ext)) { $tipi[$ext] } else { "application/octet-stream" })
    $bytes = [System.IO.File]::ReadAllBytes($pieno)
    $ctx.Response.ContentLength64 = $bytes.Length
    $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    Write-Host ("  200  " + $percorso)
  } else {
    $ctx.Response.StatusCode = 404
    $errore = Join-Path $radice "404.html"
    if (Test-Path $errore) {
      $bytes = [System.IO.File]::ReadAllBytes($errore)
      $ctx.Response.ContentType = "text/html; charset=utf-8"
      $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    }
    Write-Host ("  404  " + $percorso) -ForegroundColor DarkYellow
  }
  $ctx.Response.Close()
}

$listener.Stop()
