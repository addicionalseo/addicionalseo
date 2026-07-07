#Requires -Version 5.1
# _deploy/deploy.ps1
# Deploy d'Addicionalseo via FTP
# Us: .\deploy.ps1                  (deploy complet)
#     .\deploy.ps1 -DryRun           (simula sense pujar res)
#     .\deploy.ps1 -Only styles.css  (puja un sol fitxer)

param(
    [switch]$DryRun,
    [string]$Only = ""
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# ── Paths ────────────────────────────────────────────────────────────────────
$DeployDir  = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $DeployDir
$EnvFile    = Join-Path $DeployDir ".env.deploy"

# ── 1. Comprovació de directori ───────────────────────────────────────────────
if ((Split-Path -Leaf $ProjectRoot) -ne "Addicionalseo") {
    Write-Host "ERROR: aquest script s'ha d'executar des de C:\Projectes\Addicionalseo\_deploy\" -ForegroundColor Red
    exit 1
}

# ── 2. Carrega credencials ────────────────────────────────────────────────────
if (-not (Test-Path $EnvFile)) {
    Write-Host ""
    Write-Host "ERROR: no es troba _deploy\.env.deploy" -ForegroundColor Red
    Write-Host "Copia _deploy\.env.deploy.example a _deploy\.env.deploy i omple les credencials." -ForegroundColor Yellow
    Write-Host ""
    exit 1
}

$FTP_HOST   = ""
$FTP_USER   = ""
$FTP_PASS   = ""
$FTP_REMOTE = "/public_html"

Get-Content $EnvFile | ForEach-Object {
    if ($_ -match '^([A-Z_]+)=(.*)$') {
        Set-Variable -Name $Matches[1] -Value $Matches[2].Trim()
    }
}

if (-not $FTP_HOST -or -not $FTP_USER -or -not $FTP_PASS) {
    Write-Host "ERROR: FTP_HOST, FTP_USER i FTP_PASS han d'estar omplerts a .env.deploy" -ForegroundColor Red
    exit 1
}

$FTP_REMOTE = $FTP_REMOTE.TrimEnd("/")

# ── 3. Comprovació fitxers essencials ─────────────────────────────────────────
$required = @("index.html", "styles.css", "script.js", "assets", "public")
foreach ($r in $required) {
    if (-not (Test-Path (Join-Path $ProjectRoot $r))) {
        Write-Host "ERROR: falta $r al projecte" -ForegroundColor Red
        exit 1
    }
}

# ── 4. Git status ─────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "══════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  Addicionalseo — Deploy FTP" -ForegroundColor Cyan
Write-Host "  Host:   $FTP_HOST" -ForegroundColor Cyan
Write-Host "  Ruta:   $FTP_REMOTE" -ForegroundColor Cyan
if ($DryRun) {
    Write-Host "  Mode:   DRY RUN (no es pujará res)" -ForegroundColor Yellow
}
Write-Host "══════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

Push-Location $ProjectRoot
$gitStatus = & git status --short 2>&1
if ($gitStatus) {
    Write-Host "AVÍS: hi ha canvis sense commitejar:" -ForegroundColor Yellow
    $gitStatus | ForEach-Object { Write-Host "  $_" -ForegroundColor Yellow }
    Write-Host ""
}
$gitBranch = & git rev-parse --abbrev-ref HEAD 2>&1
$gitCommit = & git log -1 --format="%h %s" 2>&1
Write-Host "Branca: $gitBranch" -ForegroundColor Gray
Write-Host "Commit: $gitCommit" -ForegroundColor Gray
Write-Host ""
Pop-Location

# ── 5. Confirmació ────────────────────────────────────────────────────────────
$confirm = Read-Host "Confirmes el deploy a https://addicionalseo.com/? [s/N]"
if ($confirm -notin @("s", "S", "si", "Si", "SI")) {
    Write-Host "Deploy cancel·lat." -ForegroundColor Yellow
    exit 0
}
Write-Host ""

# ── 6. Recull fitxers ─────────────────────────────────────────────────────────
$EXCLUDE_DIRS = @(
    ".git", "node_modules", "dist", ".vercel", ".playwright-mcp",
    "_deploy", "references", "docs",
    "addicionalseo-mainframe-polished-v2",
    "addicionalseo-mainframe-porting-FINAL",
    ".agents", ".claude", ".impeccable"
)
$EXCLUDE_DIR_PATTERNS = @("backup*", "_backup*", "backup-*")
$EXCLUDE_EXTENSIONS  = @(".zip", ".bak", ".old", ".log", ".tmp", ".ps1", ".py", ".sql")
$EXCLUDE_ROOT_FILES  = @(
    "vite.config.js", "package.json", "package-lock.json",
    "vercel.json", ".cpanel.yml", ".gitignore",
    "CLAUDE_CONTEXT.md", "skills-lock.json",
    "cpanel_cookies.txt", "cpanel_upload_test.txt"
)
# Imatges temporals a l'arrel (captures de pantalla, etc.)
$ROOT_IMAGE_EXCLUDE_PATTERN = @("*.png", "*.jpg", "*.jpeg", "*.webp")

function ShouldExclude([System.IO.FileInfo]$file) {
    $rel = $file.FullName.Substring($ProjectRoot.Length + 1)
    $parts = $rel.Split([IO.Path]::DirectorySeparatorChar)

    # Exclou si qualsevol directori pare és a la llista
    foreach ($part in $parts[0..($parts.Count - 2)]) {
        if ($EXCLUDE_DIRS -contains $part) { return $true }
        foreach ($pat in $EXCLUDE_DIR_PATTERNS) {
            if ($part -like $pat) { return $true }
        }
    }

    # Exclou per extensió
    if ($EXCLUDE_EXTENSIONS -contains $file.Extension.ToLower()) { return $true }

    # Exclou fitxers de l'arrel que no s'han de desplegar
    if ($parts.Count -eq 1) {
        if ($EXCLUDE_ROOT_FILES -contains $file.Name) { return $true }
        # Imatges a l'arrel (captures temporals) — exclou tot excepte favicons
        if ($file.Name -notmatch '^(favicon|apple-touch)') {
            foreach ($imgpat in $ROOT_IMAGE_EXCLUDE_PATTERN) {
                if ($file.Name -like $imgpat) { return $true }
            }
        }
        # Fitxers zip de deploy antics
        if ($file.Name -match 'addicionalseo-.*deploy.*\.zip') { return $true }
    }

    return $false
}

if ($Only) {
    $target = Join-Path $ProjectRoot $Only
    if (-not (Test-Path $target)) {
        Write-Host "ERROR: no existeix $Only" -ForegroundColor Red; exit 1
    }
    $files = @(Get-Item $target)
} else {
    $files = Get-ChildItem -Path $ProjectRoot -Recurse -File |
             Where-Object { -not (ShouldExclude $_) }
}

Write-Host "$($files.Count) fitxers a pujar..." -ForegroundColor Cyan
Write-Host ""

# ── 7. Upload FTP ─────────────────────────────────────────────────────────────
$uploaded = 0
$errors   = 0

foreach ($file in $files) {
    $rel = $file.FullName.Substring($ProjectRoot.Length + 1).Replace("\", "/")
    $remoteUrl = "ftp://$FTP_HOST$FTP_REMOTE/$rel"

    if ($DryRun) {
        Write-Host "  [DRY] $rel" -ForegroundColor DarkGray
        $uploaded++
        continue
    }

    $result = & curl.exe -s --ftp-create-dirs -T $file.FullName $remoteUrl `
              --user "${FTP_USER}:${FTP_PASS}" --max-time 60 2>&1

    if ($LASTEXITCODE -eq 0) {
        Write-Host "  OK  $rel" -ForegroundColor Green
        $uploaded++
    } else {
        Write-Host "  ERR $rel — $result" -ForegroundColor Red
        $errors++
    }
}

# ── 8. Resultat ───────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "══════════════════════════════════════════════" -ForegroundColor Cyan
if ($DryRun) {
    Write-Host "  DRY RUN completat: $uploaded fitxers (res s'ha pujat)" -ForegroundColor Yellow
} elseif ($errors -eq 0) {
    Write-Host "  Deploy completat: $uploaded fitxers pujats" -ForegroundColor Green
    Write-Host ""
    Write-Host "  https://addicionalseo.com/" -ForegroundColor White
    Write-Host "  https://addicionalseo.com/es/" -ForegroundColor White
    Write-Host ""
    Write-Host "  Fes Ctrl+F5 al navegador per veure els canvis." -ForegroundColor Gray
} else {
    Write-Host "  Deploy amb errors: $uploaded OK, $errors errors" -ForegroundColor Red
    Write-Host "  Revisa els errors i torna a executar." -ForegroundColor Yellow
}
Write-Host "══════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
