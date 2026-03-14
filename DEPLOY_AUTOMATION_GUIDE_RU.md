# 🚀 Автоматическое развёртывание на Render.com

## 📋 Чек-лист выполнения

### ✅ Шаг 1: Проверка Git
```powershell
cd C:\Users\pkleontev\Documents\pochtovik-mobile\Pochtovik
git status
```

Если Git не инициализирован:
```powershell
git init
git add .
git commit -m "Initial commit with Render deployment config"
```

---

### ✅ Шаг 2: Создание GitHub репозитория

1. Перейдите на https://github.com/new
2. Название: `pochtovik` (или любое другое)
3. Сделайте **Public** или **Private** (не важно)
4. **НЕ** ставьте галочки на README, .gitignore, license
5. Нажмите **Create repository**

После создания выполните команды из инструкции GitHub:
```powershell
# В папке проекта
git remote add origin https://github.com/ВАШ_USERNAME/pochtovik.git
git branch -M main
git push -u origin main
```

---

### ✅ Шаг 3: Регистрация на Render.com

1. Перейдите на https://render.com
2. Нажмите **Get Started for Free**
3. Войдите через **GitHub** (рекомендуется) или email
4. Подтвердите email (если нужно)

---

### ✅ Шаг 4: Создание Web Service

1. В панели управления нажмите **New +** → **Web Service**
2. Найдите ваш репозиторий `pochtovik` в списке
3. Нажмите **Connect**

**Настройки:**
- **Name**: `pochtovik-name-server`
- **Region**: Frankfurt (Germany)
- **Branch**: `main`
- **Root Directory**: `name-server`
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `node server.js`

**Instance Type**: 
- Выберите **Free** ✨

**Environment Variables** (добавьте вручную):
```
NODE_ENV = production
PORT = 3001
LOG_LEVEL = info
```

✅ **Auto-Deploy**: Оставьте включённым

Нажмите **Create Web Service**

---

### ✅ Шаг 5: Ожидание деплоя

⏳ Процесс займёт 3-5 минут.

**Статус будет меняться:**
- ⏳ In Progress
- ✅ Live (когда готово)

**Ваш URL:**
```
https://pochtovik-name-server.onrender.com
```

---

### ✅ Шаг 6: Проверка работы

Перейдите в браузере:
```
https://pochtovik-name-server.onrender.com/health
```

**Успешный ответ:**
```json
{"status":"ok","timestamp":1773489881633}
```

---

### ✅ Шаг 7: Сборка APK с новым URL

Приложение уже обновлено! Просто пересоберите APK:

```powershell
cd C:\Users\pkleontev\Documents\pochtovik-mobile\Pochtovik\client

# Увеличим память для Node.js
$env:NODE_OPTIONS="--max-old-space-size=4096"

# Сборка веб-приложения
npm run build

# Синхронизация с Android
npx cap sync android

# Сборка APK
cd android
$env:JAVA_HOME="C:\Program Files\Android\Android Studio\jbr"
.\gradlew assembleDebug

Write-Host "✅ APK готов!" -ForegroundColor Green
Write-Host "Путь: client\android\app\build\outputs\apk\debug\app-debug.apk" -ForegroundColor Cyan
```

---

### ✅ Шаг 8: Тестирование на телефоне

1. Передайте файл APK на телефон
2. Установите (разрешите установку из неизвестных источников)
3. Откройте приложение
4. Зарегистрируйтесь с новым userId и password
5. Проверьте работу!

---

## 🔧 Дополнительные команды

### Просмотр логов в Render
В панели Render перейдите на вкладку **Logs**

### Перезапуск сервиса
```bash
# В панели Render: Settings → Manual Deploy → Deploy Latest Commit
```

### Обновление кода
Просто сделайте пуш в GitHub:
```powershell
git add .
git commit -m "Update feature"
git push
```
Render автоматически пересоберёт сервис!

---

## ⚠️ Важно: Sleep Mode

На бесплатном тарифе сервис засыпает через 15 минут бездействия.

**Решение:** Используйте UptimeRobot для поддержания активности:

1. Зарегистрируйтесь на https://uptimerobot.com/
2. Добавьте монитор:
   - URL: `https://pochtovik-name-server.onrender.com/health`
   - Interval: 5 minutes
3. Монитор будет пинговать сервер каждые 5 минут

---

## 🎉 Готово!

Ваш Name Server развёрнут бесплатно! 🎊

**URL сервера:** `https://pochtovik-name-server.onrender.com`

**APK для установки:** `client\android\app\build\outputs\apk\debug\app-debug.apk`

---

## ❓ Проблемы?

### Деплой не работает
Проверьте логи в панели Render → Logs

### Ошибка CORS
Убедитесь, что в `server.js` есть `app.use(cors())`

### APK не подключается
Проверьте, что URL в приложении совпадает с вашим URL от Render

### Первый запрос долгий
Это нормально! Сервер просыпается. Используйте UptimeRobot.
