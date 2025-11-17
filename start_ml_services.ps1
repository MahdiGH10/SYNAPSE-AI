# SynapseAI - Start ML Services
Write-Host "================================" -ForegroundColor Cyan
Write-Host "  SynapseAI ML Services Startup" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Stop any existing services
Write-Host "🧹 Cleaning up old processes..." -ForegroundColor Yellow
Get-Job -Name "Classifier","RAG" -ErrorAction SilentlyContinue | Stop-Job
Get-Job -Name "Classifier","RAG" -ErrorAction SilentlyContinue | Remove-Job

# Start Classifier Service (port 5000)
Write-Host "🚀 Starting Classifier Service (port 5000)..." -ForegroundColor Cyan
Start-Job -Name "Classifier" -ScriptBlock {
    Set-Location "C:\Users\Xbet\Desktop\SynapseAI\python_services"
    $env:PYTHONDONTWRITEBYTECODE = "1"
    .\venv\Scripts\python.exe classifier_service.py
} | Out-Null

Start-Sleep -Seconds 4

# Start RAG Service (port 5001)
Write-Host "🧠 Starting RAG Service (port 5001)..." -ForegroundColor Cyan
Start-Job -Name "RAG" -ScriptBlock {
    Set-Location "C:\Users\Xbet\Desktop\SynapseAI\python_services"
    $env:PYTHONDONTWRITEBYTECODE = "1"
    .\venv\Scripts\python.exe rag_service.py
} | Out-Null

Start-Sleep -Seconds 4

# Check if services are running
Write-Host ""
Write-Host "📊 Service Status:" -ForegroundColor Green
$jobs = Get-Job -Name "Classifier","RAG"
foreach ($job in $jobs) {
    $status = if ($job.State -eq "Running") { "✅ Running" } else { "❌ Failed" }
    Write-Host "  $($job.Name): $status" -ForegroundColor $(if ($job.State -eq "Running") { "Green" } else { "Red" })
}

Write-Host ""
Write-Host "🌐 Services:" -ForegroundColor Yellow
Write-Host "  📊 Classifier API: http://localhost:5000" -ForegroundColor White
Write-Host "  🧠 RAG API: http://localhost:5001" -ForegroundColor White
Write-Host ""
Write-Host "📝 Management Commands:" -ForegroundColor Gray
Write-Host "  Check status: Get-Job" -ForegroundColor Gray
Write-Host "  View logs: Receive-Job -Name Classifier -Keep" -ForegroundColor Gray
Write-Host "  Stop services: Stop-Job -Name Classifier,RAG; Remove-Job -Name Classifier,RAG" -ForegroundColor Gray
Write-Host ""
Write-Host "✨ Ready! Now run: npm run dev" -ForegroundColor Green
