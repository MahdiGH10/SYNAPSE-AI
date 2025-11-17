# Quick Start - Run Both Services

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Starting SynapseAI Services" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Start Python classifier service in background
Write-Host "1. Starting Python Classifier Service..." -ForegroundColor Yellow
$classifierJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    & .\python_services\start_classifier.ps1
}

Write-Host "   ✓ Classifier service starting (Job ID: $($classifierJob.Id))" -ForegroundColor Green

# Wait a bit for Python service to start
Start-Sleep -Seconds 3

# Start Next.js dev server
Write-Host ""
Write-Host "2. Starting Next.js Development Server..." -ForegroundColor Yellow
Write-Host ""

npm run dev

# Cleanup
Write-Host ""
Write-Host "Stopping background services..." -ForegroundColor Yellow
Stop-Job $classifierJob
Remove-Job $classifierJob
Write-Host "Services stopped." -ForegroundColor Green
