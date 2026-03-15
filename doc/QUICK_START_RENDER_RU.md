# 🚀 БЫСТРЫЙ СТАРТ - Развёртывание на Render.com

## ⚠️ ШАГ 0: Установка Git (ТРЕБУЕТСЯ!)

### Вариант A: Скачать и установить вручную
1. Перейдите на https://git-scm.com/download/win
2. Скачайте установщик
3. Запустите от имени администратора
4. Нажмите "Next" → "Next" → ... → "Finish" (настройки по умолчанию)
5. **Перезапустите PowerShell/терминал**

### Вариант B: Через winget (если есть права)
```powershell
winget install --id Git.Git
```

### Проверка установки
Откройте **НОВЫЙ** PowerShell и выполните:
```powershell
git --version
```

Должно вывести: `git version 2.x.x`

---

## 📋 ШАГ 1: Инициализация Git и отправка на GitHub

### 1.1 Откройте НОВЫЙ PowerShell
```powershell
cd C:\Users\pkleontev\Documents\pochtovik-mobile\Pochtovik
```

### 1.2 Инициализируйте Git
```powershell
git init
git add .
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"
git commit -m "Add Render deployment configuration"
```

### 1.3 Создайте репозиторий на GitHub
1. Перейдите на https://github.com/new
2. Введите название: **pochtovik**
3. Тип: **Public** или **Private** (не важно)
4. ⛔ **НЕ ставьте** галочки на:
   - ❌ Add a README file
   - ❌ Add .gitignore
   - ❌ Choose a license
5. Нажмите **Create repository**

### 1.4 Отправьте код на GitHub
После создания репозитория, GitHub покажет инструкции. Выполните:

```powershell
# Замените USERNAME на ваш логин GitHub
git remote add origin https://github.com/USERNAME/pochtovik.git
git branch -M main
git push -u origin main
```

**Проверка:** Откройте https://github.com/USERNAME/pochtovik в браузере - вы должны увидеть ваши файлы!

---

## 📋 ШАГ 2: Развёртывание на Render.com

### 2.1 Регистрация
1. Перейдите на https://render.com
2. Нажмите **Get Started for Free**
3. Выберите **Sign up with GitHub** (рекомендуется)

### 2.2 Создание Web Service
1. В панели нажмите **New +** → **Web Service**
2. Найдите репозиторий **pochtovik**
3. Нажмите **Connect**

### 2.3 Настройка сервиса
Заполните поля:

| Поле | Значение |
|------|----------|
| **Name** | `pochtovik-name-server` |
| **Region** | Frankfurt (Germany) |
| **Branch** | `main` |
| **Root Directory** | `name-server` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `node server.js` |

### 2.4 Выберите бесплатный тариф
⬇️ Прокрутите вниз до **Instance Type**
✅ Выберите: **Free** 

### 2.5 Добавьте переменные окружения
⬇️ Прокрутите до **Environment Variables**
Нажмите **Add Environment Variable** и добавьте:

```
NODE_ENV = production
PORT = 3001
LOG_LEVEL = info
```

### 2.6 Запуск
✅ Оставьте галочку **Auto-Deploy** включенной
Нажмите **Create Web Service**

---

## 📋 ШАГ 3: Ожидание развёртывания

⏳ **Время:** 3-5 минут

**Что происходит:**
- Render скачивает ваш код из GitHub
- Устанавливает зависимости (`npm install`)
- Запускает сервер (`node server.js`)

**Статус изменится:**
- ⏳ `In Progress` → ✅ `Live`

**Ваш URL:**
```
https://pochtovik-name-server.onrender.com
```

---

## 📋 ШАГ 4: Проверка работы

### 4.1 Откройте в браузере
Перейдите на:
```
https://pochtovik-name-server.onrender.com/health
```

**Успешный ответ:**
```json
{"status":"ok","timestamp":1773489881633}
```

### 4.2 Проверьте список пользователей
```
https://pochtovik-name-server.onrender.com/users
```

**Ответ:**
```json
{"users":[]}
```

---

## 📋 ШАГ 5: Сборка APK с новым URL

Приложение уже обновлено! Просто пересоберите APK:

### 5.1 Откройте PowerShell в папке проекта
```powershell
cd C:\Users\pkleontev\Documents\pochtovik-mobile\Pochtovik\client
```

### 5.2 Увеличьте память для Node.js
```powershell
$env:NODE_OPTIONS="--max-old-space-size=4096"
```

### 5.3 Соберите веб-приложение
```powershell
npm run build
```

✅ Дождитесь: `Compiled successfully.`

### 5.4 Синхронизируйте с Android
```powershell
npx cap sync android
```

✅ Дождитесь: `Sync finished in X.XXs`

### 5.5 Соберите APK
```powershell
cd android
$env:JAVA_HOME="C:\Program Files\Android\Android Studio\jbr"
.\gradlew assembleDebug
```

✅ Дождитесь: `BUILD SUCCESSFUL`

### 5.6 Готовый APK
```
Путь: C:\Users\pkleontev\Documents\pochtovik-mobile\Pochtovik\client\android\app\build\outputs\apk\debug\app-debug.apk
Размер: ~5 MB
```

---

## 📋 ШАГ 6: Тестирование на телефоне

### 6.1 Передайте APK на телефон
- По USB кабелю
- Через Google Drive / Dropbox
- Через Telegram (Saved Messages)

### 6.2 Установите на телефон
1. Откройте файл `app-debug.apk` на телефоне
2. Разрешите установку из неизвестных источников
3. Нажмите **Install**

### 6.3 Запустите приложение
1. Откройте приложение
2. Введите:
   - **User ID**: любое (например, `user1`)
   - **Password**: любой пароль
3. Нажмите **Register**
4. Если всё работает - увидите chat interface! 🎉

---

## ⚠️ Важно: Sleep Mode на бесплатном тарифе

### Проблема
На бесплатном тарифе Render засыпает через **15 минут** бездействия.

**Симптомы:**
- Первый запрос после простоя занимает 20-30 секунд
- Приложение долго подключается

### Решение: UptimeRobot (бесплатно)

1. Зарегистрируйтесь на https://uptimerobot.com/
2. Нажмите **Add New Monitor**
3. Заполните:
   - **Friendly Name**: `Pochtovik Server`
   - **URL or IP**: `https://pochtovik-name-server.onrender.com/health`
   - **Monitoring Interval**: **5 minutes**
4. Нажмите **Create Monitor**

✅ Теперь сервер не будет засыпать!

---

## 🔄 Обновление кода

Если внесли изменения в код:

```powershell
# Внесите изменения в файлы
git add .
git commit -m "Update feature"
git push
```

Render **автоматически** пересоберёт сервис за 2-3 минуты!

---

## 📊 Логи и мониторинг

### Просмотр логов в Render
1. Откройте https://dashboard.render.com/
2. Выберите ваш сервис
3. Вкладка **Logs**

### Перезапуск сервиса
1. Settings → Manual Deploy
2. Выберите коммит
3. Нажмите **Deploy Latest Commit**

---

## ❓ Проблемы и решения

### ❌ Git не устанавливается
**Решение:** Запустите установщик от имени администратора (ПКМ → Run as Administrator)

### ❌ Ошибка при пуше на GitHub
**Решение:** 
- Проверьте правильность URL репозитория
- Убедитесь, что репозиторий существует
- Проверьте интернет-соединение

### ❌ Render выдаёт ошибку сборки
**Решение:**
- Откройте логи в Render Dashboard
- Проверьте, что `name-server/render.yaml` существует
- Убедитесь, что `package.json` в папке name-server

### ❌ APK не подключается к серверу
**Решение:**
- Проверьте URL в приложении (должен быть `https://...onrender.com`)
- Убедитесь, что сервер работает (откройте `/health` в браузере)

### ❌ Первый запрос очень долгий
**Решение:** Это нормально! Используйте UptimeRobot для поддержания активности.

---

## 🎉 Готово!

Ваш мессенджер развёрнут бесплатно! 🎊

**URL сервера:** `https://pochtovik-name-server.onrender.com`

**APK для установки:** `client\android\app\build\outputs\apk\debug\app-debug.apk`

---

## 📚 Дополнительные материалы

- Полная документация: [`DEPLOY_AUTOMATION_GUIDE_RU.md`](./DEPLOY_AUTOMATION_GUIDE_RU.md)
- Инструкция по Render: [`DEPLOY_RENDER_FREE_RU.md`](./doc/DEPLOY_RENDER_FREE_RU.md)

---

## ✅ Чек-лист успешного развёртывания

- [ ] Git установлен и работает
- [ ] Код отправлен на GitHub
- [ ] Сервис создан на Render
- [ ] Статус сервиса: **Live**
- [ ] Health check возвращает `{"status":"ok",...}`
- [ ] APK собран без ошибок
- [ ] APK установлен на телефон
- [ ] Регистрация работает
- [ ] Сообщения отправляются

**Успехов!** 🚀
