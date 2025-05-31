# Script PowerShell pour démarrer l'application Flask et React en même temps avec des ports alternatifs

# Fonction pour vérifier si un processus est en cours d'exécution sur un port spécifique
function Test-PortInUse {
    param(
        [int]$Port
    )
    
    $connections = netstat -ano | findstr ":$Port"
    return $connections.Length -gt 0
}

# Vérifier si les ports sont déjà utilisés
if (Test-PortInUse -Port 5001) {
    Write-Host "Le port 5001 est déjà utilisé. Veuillez arrêter le processus qui l'utilise." -ForegroundColor Red
    exit 1
}

if (Test-PortInUse -Port 3002) {
    Write-Host "Le port 3002 est déjà utilisé. Veuillez arrêter le processus qui l'utilise." -ForegroundColor Red
    exit 1
}

# Démarrer le backend Flask dans un nouveau processus
Write-Host "Démarrage du backend Flask sur le port 5001..." -ForegroundColor Green
Start-Process -FilePath "powershell" -ArgumentList "-Command", "cd '$PSScriptRoot'; python run.py --port 5001" -NoNewWindow

# Attendre que le serveur Flask démarre
Write-Host "Attente du démarrage du serveur Flask..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# Démarrer le frontend React dans un nouveau processus
Write-Host "Démarrage du frontend React sur le port 3002..." -ForegroundColor Green
Start-Process -FilePath "powershell" -ArgumentList "-Command", "cd '$PSScriptRoot\frontend'; set PORT=3002 && npm start" -NoNewWindow

Write-Host "Application démarrée !" -ForegroundColor Cyan
Write-Host "Backend: http://localhost:5001" -ForegroundColor Cyan
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
