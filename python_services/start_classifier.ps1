# Document Classifier Quick Start Script

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "SynapseAI Document Classifier Setup" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Check if Python is installed
Write-Host "Checking Python installation..." -ForegroundColor Yellow
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✓ Python found: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Python not found. Please install Python 3.8+ first." -ForegroundColor Red
    exit 1
}

# Navigate to python_services
Write-Host ""
Write-Host "Setting up Python environment..." -ForegroundColor Yellow
Set-Location python_services

# Create virtual environment
if (!(Test-Path "venv")) {
    Write-Host "Creating virtual environment..." -ForegroundColor Yellow
    python -m venv venv
    Write-Host "✓ Virtual environment created" -ForegroundColor Green
} else {
    Write-Host "✓ Virtual environment already exists" -ForegroundColor Green
}

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Yellow
& .\venv\Scripts\Activate.ps1

# Install requirements
Write-Host ""
Write-Host "Installing Python dependencies..." -ForegroundColor Yellow
pip install -r requirements.txt --quiet

Write-Host "✓ Dependencies installed" -ForegroundColor Green

# Check if model exists
Write-Host ""
Write-Host "Checking for model file..." -ForegroundColor Yellow
if (Test-Path "..\doc_classifier.pkl") {
    Write-Host "✓ Model file found: doc_classifier.pkl" -ForegroundColor Green
} else {
    Write-Host "✗ Model file not found: doc_classifier.pkl" -ForegroundColor Red
    Write-Host "  Please place your trained model in the project root" -ForegroundColor Yellow
    exit 1
}

# Start the service
Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Starting Classifier Service..." -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Service will run on: http://localhost:5000" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the service" -ForegroundColor Yellow
Write-Host ""

python classifier_service.py
