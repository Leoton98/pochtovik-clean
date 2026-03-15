# 🚀 Быстрый старт

## Установка и запуск

### 1. Установка зависимостей
```powershell
npm install
cd client && npm install
cd ../name-server-v2 && npm install
```

### 2. Запуск сервера (Терминал 1)
```powershell
cd name-server-v2
node server.js
```

Сервер запустится на `http://localhost:3001`

### 3. Запуск клиента (Терминал 2)
```powershell
cd client
npm start
```

Или сборка без Electron:
```powershell
cd client
npx react-scripts build
serve -s build
```

## Проверка работы

### Health check
```powershell
curl http://localhost:3001/health
```

### Регистрация пользователя
```powershell
$body = @{
    userId='alice'
    password='password123'
    publicKey='test-key'
    displayName='Alice'
} | ConvertTo-Json

Invoke-RestMethod -Uri 'http://localhost:3001/register' -Method POST -Body $body -ContentType 'application/json'
```

### Вход
```powershell
$body = @{
    userId='alice'
    password='password123'
} | ConvertTo-Json

Invoke-RestMethod -Uri 'http://localhost:3001/login' -Method POST -Body $body -ContentType 'application/json'
```

## Production сервер

Сервер развёрнут на Render: `https://pochtovik-name-server.onrender.com`

Клиент автоматически подключается к production серверу.

## Функции

✅ Регистрация/Вход с паролем  
✅ RSA-2048 + AES-256 шифрование  
✅ Мульти-девайс поддержка  
✅ Push уведомления (Firebase)  
✅ WebSocket для real-time сообщений  
✅ Статус онлайн/офлайн  

## Структура проекта

```
Pochtovik/
├── client/              # React + Electron приложение
│   ├── src/
│   │   ├── components/  # UI компоненты
│   │   ├── services/    # API, Push, Realtime
│   │   ├── crypto/      # CryptoManager
│   │   └── cloud/       # YandexCloudClient
│   └── public/
├── name-server-v2/      # Сервер (Render)
│   ├── server.js
│   └── db.json
├── install.ps1          # Скрипт установки
└── start-tunnel.ps1     # Cloudflare tunnel
```
