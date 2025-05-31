# Script PowerShell pour démarrer l'application CampusConnect
# Ce script démarre le backend et le frontend sans utiliser d'environnement virtuel

# Fonction pour vérifier si un processus est en cours d'exécution sur un port spécifique
function Test-PortInUse {
    param(
        [int]$Port
    )
    
    $connections = netstat -ano | findstr ":$Port"
    return $connections.Length -gt 0
}

# Vérifier si les ports sont déjà utilisés
if (Test-PortInUse -Port 5000) {
    Write-Host "Le port 5000 est déjà utilisé. Arrêt du processus..." -ForegroundColor Yellow
    $process = Get-Process -Name "python" -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*run.py*" }
    if ($process) {
        $process | Stop-Process -Force
        Write-Host "Processus Python arrêté." -ForegroundColor Green
    }
}

if (Test-PortInUse -Port 3002) {
    Write-Host "Le port 3002 est déjà utilisé. Arrêt du processus..." -ForegroundColor Yellow
    $process = Get-Process -Name "node" -ErrorAction SilentlyContinue
    if ($process) {
        $process | Stop-Process -Force
        Write-Host "Processus Node arrêté." -ForegroundColor Green
    }
}

# Créer un fichier .env minimal si nécessaire
$envPath = Join-Path $PSScriptRoot ".env"
if (-not (Test-Path $envPath)) {
    Write-Host "Création d'un fichier .env minimal..." -ForegroundColor Yellow
    @"
FLASK_APP=run.py
FLASK_ENV=development
SECRET_KEY=dev-key-for-testing-only
JWT_SECRET_KEY=jwt-dev-key-for-testing-only
"@ | Out-File -FilePath $envPath -Encoding utf8
    Write-Host "Fichier .env créé." -ForegroundColor Green
}

# Démarrer le backend Flask dans un nouveau processus
Write-Host "Démarrage du backend Flask..." -ForegroundColor Green
Start-Process -FilePath "python" -ArgumentList "run.py" -WorkingDirectory $PSScriptRoot -NoNewWindow

# Attendre que le serveur Flask démarre et soit accessible
Write-Host "Attente du démarrage du serveur Flask..." -ForegroundColor Yellow

$flaskReady = $false
$maxAttempts = 30
$attempt = 0

while (-not $flaskReady -and $attempt -lt $maxAttempts) {
    $attempt++
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:5000/api/health" -Method GET -UseBasicParsing -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            $flaskReady = $true
            Write-Host "Serveur Flask démarré avec succès après $attempt tentatives." -ForegroundColor Green
        }
    } catch {
        Write-Host "Tentative $attempt : Serveur Flask pas encore prêt..." -ForegroundColor Yellow
        Start-Sleep -Seconds 2
    }
}

if (-not $flaskReady) {
    Write-Host "AVERTISSEMENT: Le serveur Flask ne semble pas répondre après $maxAttempts tentatives." -ForegroundColor Red
    Write-Host "Le frontend sera quand même démarré, mais des problèmes de connexion peuvent survenir." -ForegroundColor Red
}

# Démarrer le frontend React dans un nouveau processus
Write-Host "Démarrage du frontend React..." -ForegroundColor Green
$frontendDir = Join-Path $PSScriptRoot "frontend"
Start-Process -FilePath "npm" -ArgumentList "start" -WorkingDirectory $frontendDir -NoNewWindow

Write-Host "Application démarrée !" -ForegroundColor Cyan
Write-Host "Backend: http://localhost:5000" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3002" -ForegroundColor Cyan
Write-Host "Appuyez sur Ctrl+C pour arrêter les serveurs." -ForegroundColor Cyan

# Garder le script en cours d'exécution
try {
    while ($true) {
        Start-Sleep -Seconds 1
    }
} finally {
    # Nettoyage lors de l'arrêt du script
    Write-Host "Arrêt des serveurs..." -ForegroundColor Yellow
    
    # Trouver et arrêter les processus Flask et React
    $flaskProcess = Get-Process -Name "python" -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*run.py*" }
    if ($flaskProcess) {
        $flaskProcess | Stop-Process -Force
        Write-Host "Serveur Flask arrêté." -ForegroundColor Green
    }
    
    $nodeProcess = Get-Process -Name "node" -ErrorAction SilentlyContinue
    if ($nodeProcess) {
        $nodeProcess | Stop-Process -Force
        Write-Host "Serveur React arrêté." -ForegroundColor Green
    }
}
