# Скрипт для очистки кэша Electron и данных пользователя
# Используйте если приложение использует старые данные

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Очистка кэша Почтовик" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Пути к данным Electron
$appData = [Environment]::GetFolderPath("ApplicationData")
$electronPath = Join-Path $appData "pochtovik"
$localAppData = [Environment]::GetFolderPath("LocalApplicationData")
$electronCachePath = Join-Path $localAppData "pochtovik"

Write-Host "Путь к данным: $electronPath" -ForegroundColor Gray
Write-Host ""

if (Test-Path $electronPath) {
    Write-Host "[OK] Конфигурация найдена: $electronPath" -ForegroundColor Green
    Remove-Item -Path $electronPath -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "  - Удалена конфигурация" -ForegroundColor Gray
}
else {
    Write-Host "[INFO] Конфигурация не найдена" -ForegroundColor Yellow
}

if (Test-Path $electronCachePath) {
    Write-Host "[OK] Кэш найден: $electronCachePath" -ForegroundColor Green
    Remove-Item -Path $electronCachePath -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "  - Удален кэш" -ForegroundColor Gray
}
else {
    Write-Host "[INFO] Кэш не найден" -ForegroundColor Yellow
}

Write-Host ""
Read-Host "Press Enter to exit"
