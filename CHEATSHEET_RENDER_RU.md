# 📝 ШПАРГАЛКА - Развёртывание на Render

## 🔧 1. Установите Git
- Скачайте: https://git-scm.com/download/win
- Установите (нужны права администратора)
- **Перезапустите PowerShell**

---

## 🚀 2. Отправьте код на GitHub

```powershell
cd C:\Users\pkleontev\Documents\pochtovik-mobile\Pochtovik

git init
git add .
git config --global user.name "ВАШЕ_ИМЯ"
git config --global user.email "ВАШ_EMAIL"
git commit -m "Render deployment"

# Создайте репозиторий на https://github.com/new
# Название: pochtovik, БЕЗ README и license

git remote add origin https://github.com/ВАШ_USERNAME/pochtovik.git
git branch -M main
git push -u origin main
```

---

## ☁️ 3. Разверните на Render

1. https://render.com → Login with GitHub
2. New + → Web Service
3. Выберите репозиторий `pochtovik`
4. Настройки:
   - **Name**: `pochtovik-name-server`
   - **Root Directory**: `name-server`
   - **Runtime**: `Node`
   - **Build**: `npm install`
   - **Start**: `node server.js`
   - **Instance**: **Free** ✨
5. Environment Variables:
   ```
   NODE_ENV = production
   PORT = 3001
   LOG_LEVEL = info
   ```
6. **Create Web Service**

---

## ⏳ 4. Дождитесь (3-5 мин)

Ваш URL: `https://pochtovik-name-server.onrender.com`

Проверка: https://pochtovik-name-server.onrender.com/health

---

## 📱 5. Соберите APK

```powershell
cd client
$env:NODE_OPTIONS="--max-old-space-size=4096"
npm run build
npx cap sync android

cd android
$env:JAVA_HOME="C:\Program Files\Android\Android Studio\jbr"
.\gradlew assembleDebug
```

**APK:** `client\android\app\build\outputs\apk\debug\app-debug.apk`

---

## 🎯 6. Установите на телефон

1. Передайте APK
2. Установите
3. Зарегистрируйтесь
4. Готово!

---

## ⚠️ Sleep Mode?

Используйте UptimeRobot: https://uptimerobot.com/
- URL: `https://pochtovik-name-server.onrender.com/health`
- Interval: 5 min

---

## 📚 Полная инструкция

Смотрите [`QUICK_START_RENDER_RU.md`](./QUICK_START_RENDER_RU.md)
