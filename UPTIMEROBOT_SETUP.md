# 🔧 Настройка UptimeRobot Keep-Alive для Render

## 📋 Что делаем:

1. Настраиваем UptimeRobot для ping каждые 5 минут
2. Обновляем сервер на Render до новой версии (name-server-v2)
3. Проверяем что WebSocket и Push работают

---

## 🤖 Шаг 1: Настройка UptimeRobot

### 1.1 Создайте новый монитор

**В UptimeRobot Dashboard:**

1. Зайдите на https://dashboard.uptimerobot.com/monitors
2. Нажмите **"Add New Monitor"**
3. Заполните:

```
Monitor Type: HTTP(s)
Friendly Name: Pochtovik Server Keep-Alive
URL or IP: https://pochtovik-name-server.onrender.com/health
Monitoring Interval: 5 minutes
```

### 1.2 Дополнительные настройки

**Нажмите "Advanced Settings":**

```
✅ Set Custom HTTP Headers (если нужно)
✅ Timeout: 30 seconds
✅ Retry Interval: 1 minute (для быстрого восстановления)
```

### 1.3 Настройте уведомления

**Вкладка "Alert Contacts":**

```
Email: ваш_email@example.com ✅
SMS: (опционально)
Push: (опционально через приложение)
```

### 1.4 Сохраните

**Нажмите:** `Create Monitor`

---

## 🎯 Шаг 2: Проверка работы

### 2.1 Проверьте в браузере

Откройте: https://pochtovik-name-server.onrender.com/health

**Должно вернуться:**
```json
{
  "status": "ok",
  "timestamp": 1234567890,
  "websocket": "connected",
  "onlineUsers": 0
}
```

### 2.2 Проверьте UptimeRobot

Через 5-10 минут:

- Статус должен стать **"Up"**
- Response time должен быть < 1000ms
- Last check: только что

---

## 🚀 Шаг 3: Обновление сервера на Render

### Вариант A: Через GitHub (рекомендуется)

**Если сервер подключен к GitHub:**

1. **Закоммитьте изменения:**
   ```bash
   git add .
   git commit -m "feat: Add WebSocket, multi-device support, and push notifications"
   git push origin main
   ```

2. **Render автоматически задеплоит**
   - Зайдите в dashboard.render.com
   - Выберите ваш проект
   - Подождите деплой (~2-5 минут)

### Вариант B: Ручной деплой через Render CLI

```bash
# Установите Render CLI (если нет)
npm install -g render-cli

# Логин
render login

# Деплой
render deploy name-server-v2
```

### Вариант C: Через Render Dashboard

1. Зайдите на https://dashboard.render.com/
2. Выберите ваш сервис `pochtovik-name-server`
3. **Manual Deploy** section
4. Введите commit hash или выберите branch
5. Нажмите **"Deploy"**

---

## 📝 Шаг 4: Подготовка name-server-v2 к деплою

### 4.1 Создайте package.json для Render

Проверьте что в `name-server-v2/package.json` есть:

```json
{
  "name": "pochtovik-name-server-v2",
  "version": "2.0.0",
  "description": "Name server with WebSocket and Push notifications",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "engines": {
    "node": ">=18.0.0"
  },
  "dependencies": {
    "express": "^4.18.2",
    "ws": "^8.14.2",
    "lowdb": "^6.1.1",
    "bcryptjs": "^2.4.3",
    "firebase-admin": "^11.11.0",
    "cors": "^2.8.5",
    "body-parser": "^1.20.2"
  }
}
```

### 4.2 Создайте .gitignore

Убедитесь что в `name-server-v2/.gitignore` есть:

```gitignore
node_modules/
db.json
firebase-service-account.json
.env
*.log
.DS_Store
```

### 4.3 Создайте render.yaml (опционально)

Для автоматического деплоя:

```yaml
services:
  - type: web
    name: pochtovik-name-server-v2
    env: node
    buildCommand: npm install
    startCommand: node server.js
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 3001
```

---

## 🔍 Шаг 5: Проверка после деплоя

### 5.1 Проверьте логи

**В Render Dashboard:**

1. Зайдите в ваш сервис
2. Вкладка **"Logs"**
3. Должны увидеть:

```
✅ Firebase Admin initialized - Push notifications enabled
🚀 Name Server v2 running on port 3001
📊 Database location: /opt/render/project/src/db.json
🔌 WebSocket server ready
```

### 5.2 Проверьте WebSocket

**Через браузер консоль:**

```javascript
const ws = new WebSocket('wss://pochtovik-name-server.onrender.com');

ws.onopen = () => {
  console.log('✅ WebSocket connected');
  ws.send(JSON.stringify({
    type: 'auth',
    userId: 'test'
  }));
};

ws.onmessage = (event) => {
  console.log('📨 Message:', JSON.parse(event.data));
};
```

### 5.3 Проверьте health endpoint

**Curl команда:**
```bash
curl https://pochtovik-name-server.onrender.com/health
```

**Или откройте в браузере:**
https://pochtovik-name-server.onrender.com/health

---

## ⚠️ Шаг 6: Решение проблем

### Проблема 1: Сервер не деплоится

**Причина:** Ошибки в package.json или зависимостях

**Решение:**
```bash
cd name-server-v2
npm install
npm audit fix
git add package-lock.json
git commit -m "fix: dependencies"
git push
```

### Проблема 2: Firebase Admin не инициализируется

**Логи:**
```
⚠️ Firebase service account not found
```

**Решение:**

1. Скачайте service account ключ из Firebase Console
2. В Render Dashboard добавьте Environment Variable:
   ```
   FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}
   ```
   
   ИЛИ
   
3. Положите файл в репозиторий (не рекомендуется для security):
   ```bash
   cp firebase-service-account.json name-server-v2/
   git add firebase-service-account.json
   git commit -m "Add Firebase credentials"
   git push
   ```

### Проблема 3: UptimeRobot показывает down

**Причины:**
1. Сервер ещё деплоится
2. Ошибка в коде
3. Неправильный URL

**Решение:**
```bash
# Проверьте доступность
curl -v https://pochtovik-name-server.onrender.com/health

# Проверьте логи в Render
# Dashboard → Logs → Ищите ошибки
```

### Проблема 4: WebSocket не подключается

**Причина:** Render может блокировать WebSocket

**Решение:**
1. Проверьте что порт правильный (3001)
2. В Render Dashboard проверьте что тип сервиса **Web Service**
3. Проверьте CORS настройки

---

## 📊 Шаг 7: Мониторинг

### UptimeRobot Dashboard

Через 24 часа проверьте:

- **Uptime**: должен быть > 95%
- **Average Response Time**: < 500ms
- **Checks**: 288 в сутки (каждые 5 мин)

### Render Dashboard

Проверьте:

- **Requests**: количество запросов
- **Bandwidth**: использование трафика
- **Errors**: 4xx и 5xx ошибки

---

## 🎉 Чек-лист успешной настройки

- [ ] UptimeRobot монитор создан
- [ ] Интервал: 5 минут
- [ ] URL: `/health` endpoint
- [ ] Сервер обновлён на Render
- [ ] Логи показывают WebSocket готов
- [ ] Health endpoint возвращает 200 OK
- [ ] UptimeRobot статус: Up
- [ ] WebSocket подключается
- [ ] Push notifications работают (если настроен Firebase)

---

## 📈 Ожидаемые результаты

**После настройки:**

✅ **Сервер не спит** - UptimeRobot ping каждые 5 минут  
✅ **WebSocket работает** - real-time сообщения  
✅ **Push-уведомления готовы** - Firebase настроен  
✅ **Мониторинг активен** - видите статистику uptime  

**Uptime:** ~99% (с учётом редких перезагрузок Render)

---

## 🔄 Следующие шаги

1. **Протестируйте с другом** - отправьте сообщение
2. **Настройте Firebase** - для push-уведомлений
3. **Обновите клиент** - API URL если нужно
4. **Соберите APK** - с новыми фичами

**Готово!** 🎉
