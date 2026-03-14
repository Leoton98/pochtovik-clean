# Secure Messenger Installation Script for Windows
# Run this script in PowerShell

Write-Host "🔐 Secure Messenger - Installation Script" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Check if npm is available
Write-Host "Checking npm installation..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "✅ npm found: v$npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm is not available!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Installing dependencies..." -ForegroundColor Cyan
Write-Host ""

# Install root dependencies
Write-Host "Step 1/3: Installing root dependencies..." -ForegroundColor Yellow
try {
    npm install
    Write-Host "✅ Root dependencies installed" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to install root dependencies" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Install client dependencies
Write-Host "Step 2/3: Installing client dependencies..." -ForegroundColor Yellow
Set-Location client
try {
    npm install
    Write-Host "✅ Client dependencies installed" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to install client dependencies" -ForegroundColor Red
    Set-Location ..
    exit 1
}
Set-Location ..

Write-Host ""

# Install name server dependencies
Write-Host "Step 3/3: Installing name server dependencies..." -ForegroundColor Yellow
Set-Location name-server
try {
    npm install
    Write-Host "✅ Name server dependencies installed" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to install name server dependencies" -ForegroundColor Red
    Set-Location ..
    exit 1
}
Set-Location ..

Write-Host ""
Write-Host "=========================================" -ForegroundColor Green
Write-Host "✅ Installation completed successfully!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Start the name server: npm run dev:server" -ForegroundColor White
Write-Host "2. Start the desktop client: npm run dev:client" -ForegroundColor White
Write-Host ""
Write-Host "Or use the quick start commands:" -ForegroundColor White
Write-Host "  npm run dev:server   # Terminal 1" -ForegroundColor Gray
Write-Host "  npm run dev:client   # Terminal 2" -ForegroundColor Gray
Write-Host ""
Write-Host "For more information, see QUICKSTART.md" -ForegroundColor Yellow
Write-Host ""
