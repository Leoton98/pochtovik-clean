# Скрипт для запуска Cloudflare Tunnel к Name Server
# Запускает туннель к локальному серверу на порту 3001

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Cloudflare Tunnel для Почтовик" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Проверяем наличие cloudflared.exe в текущей директории
if (Test-Path ".\cloudflared.exe") {
    Write-Host "[OK] Cloudflared найден в текущей директории" -ForegroundColor Green
    $cloudflaredPath = ".\cloudflared.exe"
} 
# Проверяем в PATH
elseif (Get-Command cloudflared -ErrorAction SilentlyContinue) {
    Write-Host "[OK] Cloudflared найден в PATH" -ForegroundColor Green
    $cloudflaredPath = "cloudflared"
}
# Если не найден, скачиваем
else {
    Write-Host "[INFO] Cloudflared не найден. Скачиваем..." -ForegroundColor Yellow
    
    try {
        $url = "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe"
        $output = "$PSScriptRoot\cloudflared.exe"
        
        Write-Host "Загрузка из: $url" -ForegroundColor Gray
        Invoke-WebRequest -Uri $url -OutFile $output -UseBasicParsing
        
        Write-Host "[OK] Cloudflared успешно скачан!" -ForegroundColor Green
        $cloudflaredPath = $output
    }
    catch {
        Write-Host "[ERROR] Не удалось скачать cloudflared!" -ForegroundColor Red
        Write-Host "Ошибка: $_" -ForegroundColor Red
        Write-Host ""
        Write-Host "Вы можете скачать вручную:" -ForegroundColor Yellow
        Write-Host "1. Перейдите на https://github.com/cloudflare/cloudflared/releases" -ForegroundColor Yellow
        Write-Host "2. Скачайте cloudflared-windows-amd64.exe" -ForegroundColor Yellow
        Write-Host "3. Положите в эту же директорию" -ForegroundColor Yellow
        Read-Host "Нажмите Enter для выхода"
        exit 1
    }
}

Write-Host ""
Write-Host "Запуск Cloudflare Tunnel..." -ForegroundColor Green
Write-Host "Цель: http://localhost:3001" -ForegroundColor Green
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  ВАЖНО: Не закрывайте это окно!" -ForegroundColor Red
Write-Host "  После появления URL скопируйте его" -ForegroundColor Red
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Запускаем туннель
& $cloudflaredPath tunnel --url http://localhost:3001
