# 🔑 Настройка Firebase на Render

## ✅ Что сделано:

- ✅ `.env` файл заполнен Firebase конфигурацией
- ✅ PushService интегрирован в App.js
- ✅ Сервер использует production URL на Render
- ✅ Server.js обновлён для чтения FIREBASE_SERVICE_ACCOUNT

---

## 🔧 Осталось сделать:

### Шаг 1: Добавьте Firebase Service Account на Render

**1. Скачайте JSON ключ из Firebase:**

1. https://console.firebase.google.com/project/pochtovik/settings/serviceaccounts/adminsdk
2. Нажмите **"Generate new private key"**
3. Скачайте JSON файл (например: `pochtovik-firebase-adminsdk-xxxxx.json`)

**2. Скопируйте содержимое файла:**

Откройте файл и скопируйте **весь JSON** (будет что-то вроде):

```json
{
  "type": "service_account",
  "project_id": "pochtovik",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "...",
  "client_id": "...",
  "auth_uri": "...",
  "token_uri": "...",
  ...
}
```

**Важно:** Это **один длинный JSON**, не разбивайте его на строки!

**3. Вставьте в Render Environment Variable:**

1. Зайдите на https://dashboard.render.com/
2. Выберите сервис `pochtovik-name-server`
3. Вкладка **"Environment"**
4. Нажмите **"Add Environment Variable"**
5. Заполните:
   ```
   Key: FIREBASE_SERVICE_ACCOUNT
   Value: [вставьте весь JSON в одну строку]
   ```
6. **Save Changes**

---

### Шаг 2: Проверьте что всё работает

**1. Проверьте логи Render:**

https://dashboard.render.com → Ваш сервис → Logs

**Должно быть:**
```
✅ Firebase Admin initialized - Push notifications enabled
```

**Если видите это** - отлично! 🎉

**Если видите предупреждение:**
```
⚠️ Firebase service account not found
```

Значит переменная не настроена или JSON невалидный.

---

### Шаг 3: Перезапустите сервер на Render

**Чтобы применить изменения:**

1. В Render Dashboard
2. Ваш сервис → **Manual Deploy**
3. Нажмите **"Deploy"**

ИЛИ

**Через Git:**
```bash
git add .
git commit -m "fix: Add FIREBASE_SERVICE_ACCOUNT support"
git push origin main
```

Render автоматически задеплоит.

---

### Шаг 4: Тестирование push-уведомлений

**1. Откройте приложение:**

http://localhost:3000

**2. Войдите в систему:**

Логин: `alice`  
Пароль: ваш пароль

**3. Проверьте консоль (F12):**

Должно появиться:
```
🌐 Connecting to: https://pochtovik-name-server.onrender.com
📱 Device registered: device-xxxxx
✅ Firebase Cloud Messaging initialized
```

**4. Разрешите уведомления:**

Браузер спросит разрешение - нажмите **"Разрешить"**

**5. Проверьте что токен зарегистрировался:**

```
📱 FCM Token obtained: eXwW...
✅ FCM token registered on server
```

---

## 🐛 Отладка

### Ошибка: "Invalid JSON in FIREBASE_SERVICE_ACCOUNT"

**Причина:** JSON отформатирован неправильно

**Решение:**
1. Убедитесь что JSON в **одну строку**
2. Все кавычки должны быть экранированы
3. Символы новой строки в private_key должны быть `\n`

**Пример правильного формата:**
```json
{"type":"service_account","project_id":"pochtovik","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"..."}
```

### Ошибка: "Firebase Admin initialization error"

**Проверьте логи:**

В Render Dashboard → Logs ищите:
```
⚠️ Firebase Admin initialization error: ...
```

**Возможные причины:**
1. Неправильный JSON формат
2. Битый private key
3. Истёк срок действия ключа

**Решение:**
1. Перегенерируйте ключ в Firebase Console
2. Вставьте заново в Render

### Уведомления не приходят

**Проверьте:**

1. **На клиенте:**
   ```javascript
   // В консоли браузера должно быть:
   ✅ Firebase Cloud Messaging initialized
   📱 FCM Token obtained: ...
   ✅ FCM token registered on server
   ```

2. **На сервере:**
   ```
   # В логах Render:
   ✅ Firebase Admin initialized - Push notifications enabled
   📱 FCM token registered for device device-xxxxx
   ```

3. **В Firebase Console:**
   - Cloud Messaging → Tokens
   - Должен видеть ваш токен

---

## ✅ Чек-лист

- [ ] Firebase проект создан
- [ ] `.env` файл заполнен
- [ ] Service account key скачан
- [ ] JSON скопирован в одну строку
- [ ] Переменная `FIREBASE_SERVICE_ACCOUNT` добавлена в Render
- [ ] Сервер перезапускался после добавления переменной
- [ ] В логах: `✅ Firebase Admin initialized`
- [ ] Приложение показывает `✅ Firebase Cloud Messaging initialized`
- [ ] FCM token регистрируется
- [ ] Тестовое уведомление пришло

---

## 🎉 Готово!

После настройки:

✅ **Сервер на Render** работает с Firebase Admin  
✅ **Push-уведомления** готовы к отправке  
✅ **Клиент** может регистрировать FCM токены  
✅ **UptimeRobot** пингует сервер каждые 5 минут  

**Всё работает!** 🚀
