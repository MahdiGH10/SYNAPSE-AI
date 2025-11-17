# SynapseAI - Complete Startup Script
Write-Host "================================" -ForegroundColor Cyan
Write-Host "     SynapseAI Full Startup" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Navigate to project directory
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location -Path $projectRoot

# Clean up old jobs
Write-Host "Cleaning up old processes..." -ForegroundColor Yellow
Get-Job -ErrorAction SilentlyContinue | Stop-Job
Get-Job -ErrorAction SilentlyContinue | Remove-Job

# Start Classifier Service (port 5000)
Write-Host ""
Write-Host "Starting Classifier Service (port 5000)..." -ForegroundColor Cyan
Start-Job -Name "Classifier" -ScriptBlock {
    Set-Location "C:\Users\Xbet\Desktop\SynapseAI\python_services"
    $env:PYTHONDONTWRITEBYTECODE = "1"
    .\venv\Scripts\python.exe classifier_service.py
} | Out-Null

Start-Sleep -Seconds 4

# Start RAG Service (port 5001)
Write-Host "Starting RAG Service (port 5001)..." -ForegroundColor Cyan
Start-Job -Name "RAG" -ScriptBlock {
    Set-Location "C:\Users\Xbet\Desktop\SynapseAI\python_services"
    $env:PYTHONDONTWRITEBYTECODE = "1"
    .\venv\Scripts\python.exe rag_service.py
} | Out-Null

Start-Sleep -Seconds 4

# Check ML services status
Write-Host ""
Write-Host "ML Services Status:" -ForegroundColor Green
$jobs = Get-Job -Name "Classifier","RAG"
$allRunning = $true
foreach ($job in $jobs) {
    if ($job.State -eq "Running") {
        Write-Host "  $($job.Name): Running" -ForegroundColor Green
    } else {
        Write-Host "  $($job.Name): Failed" -ForegroundColor Red
        $allRunning = $false
    }
}

if (-not $allRunning) {
    Write-Host ""
    Write-Host "Some ML services failed to start. Check logs with:" -ForegroundColor Red
    Write-Host "   Receive-Job -Name Classifier" -ForegroundColor Gray
    Write-Host "   Receive-Job -Name RAG" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Press any key to exit..." -ForegroundColor Gray
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit 1
}

# Start Next.js
Write-Host ""
Write-Host "Starting Next.js Application (port 3000)..." -ForegroundColor Cyan
Write-Host ""
Write-Host "================================" -ForegroundColor Green
Write-Host "  All Services Started!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""
Write-Host "Application: http://localhost:3000/chat" -ForegroundColor Yellow
Write-Host "Classifier API: http://localhost:5000" -ForegroundColor Yellow
Write-Host "RAG API: http://localhost:5001" -ForegroundColor Yellow
Write-Host ""
Write-Host "Features:" -ForegroundColor Cyan
Write-Host "  - Upload documents in /chat page" -ForegroundColor White
Write-Host "  - Auto-classification with ML model" -ForegroundColor White
Write-Host "  - RAG-powered document Q&A" -ForegroundColor White
Write-Host "  - Source citations for answers" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop all services" -ForegroundColor Gray
Write-Host ""

# Start Next.js (this will block)
try {
    npm run dev
} finally {
    Write-Host ""
    Write-Host "Stopping ML services..." -ForegroundColor Yellow
    Stop-Job -Name "Classifier","RAG" -ErrorAction SilentlyContinue
    Remove-Job -Name "Classifier","RAG" -ErrorAction SilentlyContinue
    Write-Host "All services stopped" -ForegroundColor Green
}
