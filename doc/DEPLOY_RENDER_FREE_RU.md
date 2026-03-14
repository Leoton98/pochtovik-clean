# 🆓 Бесплатное развёртывание на Render.com

## ⏱️ Время: ~10 минут

---

## 📋 Шаг 1: Подготовка репозитория GitHub

### 1.1 Создайте репозиторий (если ещё нет)
```powershell
# В папке проекта
cd C:\Users\pkleontev\Documents\pochtovik-mobile\Pochtovik

# Инициализация git (если не инициализирован)
git init

# Проверка статуса
git status
```

### 1.2 Создайте `.gitignore` для name-server
```powershell
# Файл: name-server/.gitignore
node_modules/
.env
*.log
.DS_Store
```

### 1.3 Создайте `render.yaml` для автоматического деплоя
```powershell
# Файл: name-server/render.yaml
```

**Содержимое render.yaml:**
```yaml
services:
  - type: web
    name: pochtovik-name-server
    env: node
    region: frankfurt
    plan: free
    buildCommand: npm install
    startCommand: node server.js
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 3001
```

### 1.4 Отправьте код на GitHub
```powershell
# Добавьте все изменения
git add .

# Сделайте коммит
git commit -m "Add Render deployment config"

# Отправьте на GitHub (замените на ваш URL)
git remote add origin https://github.com/ВАШ_USERNAME/pochtovik.git
git push -u origin main
```

---

## 📋 Шаг 2: Регистрация на Render.com

### 2.1 Перейдите на сайт
👉 https://render.com

### 2.2 Зарегистрируйтесь
1. Нажмите **Get Started for Free**
2. Войдите через **GitHub** (рекомендуется) или email
3. Подтвердите email

---

## 📋 Шаг 3: Создание сервиса

### 3.1 Создайте новый Web Service
1. В личном кабинете нажмите **New +**
2. Выберите **Web Service**

### 3.2 Подключите репозиторий
1. Найдите ваш репозиторий `pochtovik`
2. Нажмите **Connect**
3. Укажите путь к name-server: `name-server`

### 3.3 Настройте сервис
**Settings:**
- **Name**: `pochtovik-name-server`
- **Region**: Frankfurt (Germany) или ближайший к вам
- **Branch**: `main`
- **Root Directory**: `name-server`
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `node server.js`

### 3.4 Выберите бесплатный тариф
- **Instance Type**: **Free** ✨

### 3.5 Environment Variables
Добавьте переменные окружения:
```
NODE_ENV = production
PORT = 3001
```

### 3.6 Auto-Deploy
✅ Оставьте включённым (автоматический деплой при пуше в GitHub)

### 3.7 Нажмите **Create Web Service**

---

## 📋 Шаг 4: Ожидание развёртывания

⏳ Процесс займёт 2-5 минут.

**Вы увидите:**
- Логи сборки
- Статус: **Live** когда готово

**Ваш URL будет вида:**
```
https://pochtovik-name-server.onrender.com
```

---

## 📋 Шаг 5: Проверка работы

### 5.1 Проверьте health endpoint
Перейдите в браузере:
```
https://pochtovik-name-server.onrender.com/health
```

**Ответ:**
```json
{"status":"ok","timestamp":1234567890}
```

### 5.2 Проверьте список пользователей
```
https://pochtovik-name-server.onrender.com/users
```

**Ответ:**
```json
{"users":[]}
```

---

## 📋 Шаг 6: Обновление клиента

Теперь нужно обновить URL в клиентском приложении.

### 6.1 Обновите ApiService.js

**Файл:** `client/src/services/ApiService.js`

Замените:
```javascript
this.nameServerUrl = nameServerUrl || 'http://localhost:3001';
```

На:
```javascript
this.nameServerUrl = nameServerUrl || 'https://pochtovik-name-server.onrender.com';
```

### 6.2 Обновите App.js

**Файл:** `client/src/App.js`

Замените ВСЕ вхождения `'http://localhost:3001'` на ваш URL:
```javascript
// initializeServices
const api = new ApiService(user.nameServerUrl || 'https://pochtovik-name-server.onrender.com');

// handleLogin
const api = new ApiService('https://pochtovik-name-server.onrender.com');

// nameServerUrl в userConfig
nameServerUrl: 'https://pochtovik-name-server.onrender.com',

// handleRegister
const api = new ApiService('https://pochtovik-name-server.onrender.com');

// nameServerUrl в userConfig
nameServerUrl: 'https://pochtovik-name-server.onrender.com',
```

---

## 📋 Шаг 7: Пересборка APK

### 7.1 Соберите веб-приложение
```powershell
cd C:\Users\pkleontev\Documents\pochtovik-mobile\Pochtovik\client

$env:NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

### 7.2 Синхронизируйте с Android
```powershell
npx cap sync android
```

### 7.3 Соберите APK
```powershell
cd android
$env:JAVA_HOME="C:\Program Files\Android\Android Studio\jbr"
.\gradlew assembleDebug
```

### 7.4 Готовый APK
```
C:\Users\pkleontev\Documents\pochtovik-mobile\Pochtovik\client\android\app\build\outputs\apk\debug\app-debug.apk
```

---

## 📋 Шаг 8: Тестирование

### 8.1 Установите APK на телефон
1. Передайте файл `app-debug.apk` на телефон
2. Установите (разрешите установку из неизвестных источников)

### 8.2 Зарегистрируйтесь
1. Откройте приложение
2. Введите userId и password
3. Нажмите **Register**

### 8.3 Проверьте подключение
Если всё работает - вы увидите chat interface! 🎉

---

## 🔧 Дополнительные настройки

### CORS (если нужны ограничения)

**Файл:** `name-server/server.js`

Замените:
```javascript
app.use(cors());
```

На:
```javascript
app.use(cors({
  origin: ['https://pochtovik-name-server.onrender.com', 'capacitor://localhost']
}));
```

### Логирование

**Файл:** `name-server/.env`
```env
LOG_LEVEL=debug
```

---

## ⚠️ Важные моменты

### 1. Sleep mode на бесплатном тарифе
- Сервис "засыпает" через 15 минут бездействия
- Первый запрос после простоя занимает ~30 секунд
- **Решение**: отправляйте запрос каждые 10-14 минут (можно использовать UptimeRobot)

### 2. Автоматический деплой
При каждом пуше в GitHub:
- Render автоматически пересоберёт сервис
- Деплой займёт 2-3 минуты
- Старая версия заменится новой

### 3. Логи
Смотреть логи можно в панели Render:
- **Logs** tab в реальном времени
- Или скачайте полные логи

---

## 🎁 Бонус: Как избежать sleep mode

### Вариант A: UptimeRobot (бесплатно)
1. Зарегистрируйтесь на https://uptimerobot.com/
2. Добавьте новый монитор
3. URL: `https://pochtovik-name-server.onrender.com/health`
4. Interval: 5 minutes
5. Монитор будет "будить" сервер каждые 5 минут

### Вариант B: Cron job
Создайте GitHub Action для периодического пинга:

**.github/workflows/keep-alive.yml:**
```yaml
name: Keep Render Alive

on:
  schedule:
    - cron: '*/10 * * * *'
  
jobs:
  ping:
    runs-on: ubuntu-latest
    steps:
      - name: Ping Render
        run: curl https://pochtovik-name-server.onrender.com/health
```

---

## 📊 Сравнение с другими платформами

| Платформа | Бесплатно | Сон | Серверы | Сложность |
|-----------|-----------|-----|---------|-----------|
| **Render** | ✅ Да | ⚠️ 15 мин | ЕС/США | ⭐ Легко |
| Railway | ⚠️ $5 кредит | ❌ Нет | ЕС/США | ⭐⭐ Средне |
| Yandex Functions | ✅ До лимита | ❌ Нет | РФ/СНГ | ⭐⭐⭐ Сложно |
| Vercel | ✅ Да | ❌ Нет | Глобально | ⭐⭐ Средне |

---

## 🎯 Что дальше?

1. ✅ Протестируйте регистрацию пользователей
2. ✅ Проверьте обмен сообщениями
3. ✅ Раздайте APK тестировщикам
4. 📈 Следите за статистикой в Render Dashboard

---

## ❓ Проблемы?

### Ошибка CORS
Убедитесь, что `cors()` настроен правильно в `server.js`

### Ошибка подключения
Проверьте URL в клиенте - должен быть `https://`

### Долгая первая загрузка
Это нормально! Сервер "просыпается". Используйте UptimeRobot.

### Деплой не работает
Проверьте логи в Render Dashboard

---

## 🎉 Готово!

Ваш Name Server работает бесплатно 24/7 (с небольшими особенностями)!

**URL вашего сервера:** `https://pochtovik-name-server.onrender.com`

**APK для установки:** `client/android/app/build/outputs/apk/debug/app-debug.apk`
