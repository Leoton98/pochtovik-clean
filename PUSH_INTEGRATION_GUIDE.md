# 🔔 Интеграция Push-уведомлений в приложение

## ✅ Шаг 1: Заполните .env файл

**Файл:** `client/.env`

Скопируйте значения из Firebase Console (см. `FIREBASE_CONFIG_VALUES.md`)

---

## ⚙️ Шаг 2: Обновите App.js

**Добавьте PushService в начало файла:**

```javascript
import React, { useState, useEffect } from 'react';
import pushService from './services/PushService';
// ... остальные импорты
```

**Найдите функцию login (или добавьте после успешной авторизации):**

```javascript
const handleLogin = async (e) => {
  e.preventDefault();
  
  try {
    const result = await api.login(userId, password);
    // ... существующий код
    
    // После успешного логина - инициализируем push
    await initializePushNotifications(userId, deviceId);
    
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

**Добавьте функцию инициализации push:**

```javascript
async function initializePushNotifications(userId, deviceId) {
  try {
    // Создаём конфиг Firebase из env переменных
    const firebaseConfig = {
      apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
      authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
      storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.REACT_APP_FIREBASE_APP_ID
    };

    // Проверяем что все переменные настроены
    if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
      console.warn('⚠️ Firebase config not complete, skipping push initialization');
      return;
    }

    // Инициализируем сервис
    const initialized = await pushService.initialize(firebaseConfig);
    
    if (!initialized) {
      console.warn('⚠️ Push service initialization failed');
      return;
    }

    // Запрашиваем разрешение и получаем токен
    const token = await pushService.requestPermissionAndGetToken();
    
    if (token) {
      console.log('📱 FCM Token obtained:', token.substring(0, 30) + '...');
      
      // Регистрируем токен на сервере
      try {
        await api.registerFcmToken(userId, deviceId, token);
        console.log('✅ FCM token registered on server');
      } catch (error) {
        console.error('❌ Failed to register FCM token:', error.message);
      }
    } else {
      console.log('ℹ️ Notification permission denied or token not received');
    }

    // Слушаем сообщения когда приложение активно
    pushService.onMessageReceived((payload) => {
      console.log('📨 New message received:', payload);
      
      // Здесь можно обновить UI или показать уведомление
      // Например: добавить сообщение в чат
    });

  } catch (error) {
    console.error('❌ Error initializing push notifications:', error);
  }
}
```

---

## 📝 Шаг 3: Добавьте метод в ApiService.js

**Откройте:** `client/src/services/ApiService.js`

**Добавьте новый метод:**

```javascript
/**
 * Register FCM token for push notifications
 */
async registerFcmToken(userId, deviceId, fcmToken) {
  const response = await this.api.post('/push/register', {
    userId,
    deviceId,
    fcmToken
  });
  return response.data;
}
```

---

## 🔧 Шаг 4: Настройте Capacitor Local Notifications (для Android)

**Установите плагин (если ещё не установлен):**

```bash
cd client
npm install @capacitor/local-notifications
npx cap sync android
```

**Проверьте что в `AndroidManifest.xml` есть разрешения:**

Откройте `client/android/app/src/main/AndroidManifest.xml`

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <!-- Permissions for notifications -->
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS"/>
    
    <!-- Existing permissions -->
    <uses-permission android:name="android.permission.INTERNET" />
</manifest>
```

---

## 🧪 Шаг 5: Тестирование

### 5.1 Проверка frontend

**Запустите клиент:**

```bash
cd client
npm start
```

**В консоли браузера должно быть:**

```
✅ Firebase Cloud Messaging initialized
```

**После логина:**

```
📱 FCM Token obtained: eXwW...
✅ FCM token registered on server
```

### 5.2 Проверка backend

**Запустите сервер:**

```bash
cd name-server-v2
npm start
```

**В логах должно быть:**

```
✅ Firebase Admin initialized - Push notifications enabled
📱 FCM token registered for device device-abc123 (user: alice)
```

### 5.3 Отправьте тестовое уведомление

**Через Firebase Console:**

1. https://console.firebase.google.com/project/pochtovik
2. Вкладка **"Engagement"** → **"Cloud Messaging"**
3. Нажмите **"New notification"**
4. Заполните:
   ```
   Title: Test Message
   Body: Hello from Pochtovik!
   Target: All users
   ```
5. Нажмите **"Review"** → **"Publish"**

**Или через сервер (программно):**

Добавьте временный endpoint для тестирования в `server.js`:

```javascript
// TEST endpoint - удалить после тестирования
app.post('/test-push', async (req, res) => {
  const { fcmToken } = req.body;
  
  const success = await sendPushNotification(
    fcmToken,
    'Test Notification',
    'Push notifications are working! 🎉'
  );
  
  res.json({ success });
});
```

**Отправьте запрос:**

```javascript
fetch('https://pochtovik-name-server.onrender.com/test-push', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    fcmToken: 'ВАШ_FCM_TOKEN'
  })
})
.then(r => r.json())
.then(console.log);
```

---

## 🐛 Отладка

### Ошибка: "Firebase config not complete"

**Причина:** Не все переменные окружения заполнены

**Решение:**
```bash
# Проверьте .env файл
cat client/.env

# Должны быть все переменные:
REACT_APP_FIREBASE_VAPID_KEY=...
REACT_APP_FIREBASE_API_KEY=...
REACT_APP_FIREBASE_PROJECT_ID=...
# и т.д.
```

### Ошибка: "Notification permission denied"

**Причина:** Пользователь запретил уведомления

**Решение:**
1. Chrome: `chrome://settings/content/notifications`
2. Найдите ваш сайт
3. Разрешите уведомления
4. Перезагрузите страницу

### Ошибка: "FCM token not received"

**Причины:**
1. VAPID ключ неправильный
2. Firebase не инициализирован
3. Service Worker не зарегистрирован

**Решение:**
```javascript
// Проверьте VAPID ключ
console.log('VAPID Key:', process.env.REACT_APP_FIREBASE_VAPID_KEY);
// Должен начинаться с BKagOny0KF...

// Проверьте инициализацию
console.log('Push Service Initialized:', pushService.isInitialized);
```

### Уведомления не приходят на Android

**Причины:**
1. Не настроен notification channel
2. FCM token не зарегистрирован
3. Нет разрешений POST_NOTIFICATIONS

**Решение:**
```bash
# Проверьте логи Android
adb logcat | grep -i firebase
adb logcat | grep -i notification

# Проверьте что токен зарегистрирован
# В логах сервера:
📱 FCM token registered for device device-abc123
```

---

## ✅ Чек-лист успешной настройки

- [ ] Firebase проект создан
- [ ] `.env` файл заполнен (все 6 переменных)
- [ ] VAPID key скопирован
- [ ] Service account key скачан
- [ ] `firebase-service-account.json` в папке сервера
- [ ] PushService интегрирован в App.js
- [ ] Метод `registerFcmToken` добавлен в ApiService
- [ ] При логине запрашивается notification permission
- [ ] FCM token регистрируется на сервере
- [ ] Тестовое уведомление пришло

---

## 🎉 Готово!

**После настройки:**

✅ **Foreground уведомления** - работают через PushService  
✅ **Background уведомления** - через Firebase Cloud Messaging  
✅ **Android уведомления** - через Capacitor Local Notifications  
✅ **Web уведомления** - через Browser Notification API  

**Push-уведомления полностью работают!** 🎊
