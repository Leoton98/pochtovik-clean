# 🔔 Push Notifications - Инструкция по настройке

## ✅ Реализовано

### 1. **Frontend (Client)**
- ✅ **PushService.js** - работа с Firebase Cloud Messaging
- ✅ **Capacitor Local Notifications** - показ уведомлений на Android
- ✅ **FCM token registration** - регистрация токенов на сервере

### 2. **Backend (Server)**
- ✅ **Firebase Admin SDK** - отправка push-уведомлений
- ✅ **POST /push/register** - endpoint для регистрации FCM токена
- ✅ **sendPushNotification()** - функция отправки push

---

## 📋 Шаг 1: Настройка Firebase проекта

### 1.1 Создайте Firebase проект

1. Зайдите на [Firebase Console](https://console.firebase.google.com/)
2. Нажмите **"Add project"**
3. Введите название: `pochtovik`
4. Отключите Google Analytics (не обязательно)
5. Нажмите **"Create project"**

### 1.2 Добавьте веб-приложение

1. В Firebase Console нажмите **⚙️ Settings** → **Project settings**
2. В разделе **"Your apps"** нажмите иконку **Web** (`</>`)
3. Введите название: `Pochtovik Web`
4. Скопируйте **firebaseConfig**:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "pochtovik.firebaseapp.com",
  projectId: "pochtovik",
  storageBucket: "pochtovik.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

### 1.3 Получите VAPID ключ

1. В Firebase Console перейдите в **Project settings**
2. Вкладка **Cloud Messaging**
3. В разделе **"Web Push certificates"** скопируйте ключ:
   ```
   BKagOny0KF... (длинная строка)
   ```

---

## 🔧 Шаг 2: Настройка Frontend

### 2.1 Обновите `.env` файл

Создайте или обновите `client/.env`:

```bash
REACT_APP_FIREBASE_VAPID_KEY=BKagOny0KF...
REACT_APP_FIREBASE_API_KEY=AIzaSyXXX...
REACT_APP_FIREBASE_AUTH_DOMAIN=pochtovik.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=pochtovik
REACT_APP_FIREBASE_STORAGE_BUCKET=pochtovik.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789012
REACT_APP_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
```

### 2.2 Обновите `App.js`

Добавьте инициализацию PushService:

```javascript
import pushService from './services/PushService';

// После логина пользователя
useEffect(() => {
  if (currentUser) {
    initializePush();
  }
}, [currentUser]);

async function initializePush() {
  // Создаём конфиг Firebase из env переменных
  const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID
  };

  // Инициализируем сервис
  await pushService.initialize(firebaseConfig);
  
  // Запрашиваем разрешение и получаем токен
  const token = await pushService.requestPermissionAndGetToken();
  
  if (token && currentUser) {
    // Регистрируем токен на сервере
    await api.registerFcmToken(
      currentUser.userId, 
      currentUser.deviceId, 
      token
    );
  }
  
  // Слушаем сообщения в foreground
  pushService.onMessageReceived((payload) => {
    console.log('New message in foreground:', payload);
    // Обновляем UI, показываем уведомление
  });
}
```

### 2.3 Обновите `ApiService.js`

Добавьте метод для регистрации FCM токена:

```javascript
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

## 🔧 Шаг 3: Настройка Backend

### 3.1 Скачайте Service Account Key

1. В Firebase Console перейдите в **Project settings**
2. Вкладка **Service accounts**
3. Нажмите **"Generate new private key"**
4. Сохраните JSON файл как `firebase-service-account.json`
5. Положите файл в папку `name-server-v2/`

### 3.2 Проверьте установку зависимостей

```bash
cd name-server-v2
npm install firebase-admin
```

### 3.3 Запустите сервер

```bash
npm start
```

**Вы должны увидеть:**
```
✅ Firebase Admin initialized - Push notifications enabled
```

---

## 📱 Шаг 4: Настройка Capacitor Local Notifications

### 4.1 Установите плагин

```bash
cd client
npm install @capacitor/local-notifications
npx cap sync android
```

### 4.2 Настройте AndroidManifest.xml

Откройте `client/android/app/src/main/AndroidManifest.xml` и добавьте разрешения:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <!-- Permissions for notifications -->
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS"/>
    <uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM"/>
    
    <!-- Existing permissions -->
    <uses-permission android:name="android.permission.INTERNET" />
    ...
</manifest>
```

### 4.3 Создайте notification channel

В `client/android/app/src/main/java/com/example/app/MainActivity.java`:

```java
package com.example.app;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.media.AudioAttributes;
import android.net.Uri;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    
    // Create notification channel
    createNotificationChannel();
  }
  
  private void createNotificationChannel() {
    NotificationManager manager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
    
    AudioAttributes audioAttributes = new AudioAttributes.Builder()
      .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
      .setUsage(AudioAttributes.USAGE_NOTIFICATION)
      .build();
      
    Uri soundUri = Uri.parse("content://settings/system/notification_sound");
    
    NotificationChannel channel = new NotificationChannel(
      "pochtovik-messages",
      "Messages",
      NotificationManager.IMPORTANCE_HIGH
    );
    
    channel.setDescription("Notifications for new messages");
    channel.setSound(soundUri, audioAttributes);
    channel.enableVibration(true);
    channel.setVibrationPattern(new long[]{200, 100, 200});
    
    manager.createNotificationChannel(channel);
  }
}
```

---

## 🧪 Шаг 5: Тестирование

### 5.1 Проверка frontend

1. Откройте приложение в браузере
2. Должно появиться окно запроса разрешения на уведомления
3. Нажмите **"Разрешить"**
4. Проверьте консоль:
   ```
   ✅ Firebase Cloud Messaging initialized
   ✅ Notification permission granted
   📱 FCM Token received: eXwW...
   ```

### 5.2 Проверка backend

1. Запустите сервер
2. Проверьте логи:
   ```
   ✅ Firebase Admin initialized - Push notifications enabled
   ```

### 5.3 Отправьте тестовое уведомление

Через консоль сервера (Node.js REPL):

```javascript
const admin = require('firebase-admin');
const serviceAccount = require('./firebase-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

admin.messaging().send({
  token: 'ВАШ_FCM_TOKEN',
  notification: {
    title: 'Test Message',
    body: 'Hello from Pochtovik!'
  }
})
.then(response => console.log('✅ Sent:', response))
.catch(error => console.error('❌ Error:', error));
```

---

## 🔍 Отладка

### Проблема: Notification permission denied

**Решение:**
- Очистите разрешения сайта в браузере
- Chrome: `chrome://settings/content/notifications`
- Найдите ваш сайт и разрешите уведомления

### Проблема: Firebase Admin not initialized

**Причины:**
1. Файл `firebase-service-account.json` не найден
2. Неправильный путь к файлу
3. Файл повреждён

**Решение:**
```bash
# Проверьте что файл существует
ls name-server-v2/firebase-service-account.json

# Проверьте права доступа
chmod 600 name-server-v2/firebase-service-account.json
```

### Проблема: FCM token not received

**Причины:**
1. Firebase не инициализирован на клиенте
2. VAPID ключ неправильный
3. Permission не получен

**Решение:**
```javascript
// Проверьте конфигурацию
console.log('Firebase config:', {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  // ... другие поля
});

// Проверьте VAPID ключ
console.log('VAPID Key:', pushService.getVapidKey());
```

### Проблема: Push не приходит на Android

**Причины:**
1. Не настроен Notification Channel
2. Нет разрешений в AndroidManifest.xml
3. FCM token не зарегистрирован на сервере

**Решение:**
```bash
# Проверьте логи Android
adb logcat | grep -i firebase
adb logcat | grep -i notification

# Проверьте registered tokens на сервере
# В логах должно быть:
📱 FCM token registered for device device-abc123 (user: alice)
```

---

## 📊 Метрики

### Отслеживайте в Firebase Console:

1. **Cloud Messaging** → **Analytics**
   - Sent notifications
   - Delivered notifications
   - Engagement metrics

2. **Проверка токенов:**
   ```bash
   # Посмотреть все зарегистрированные устройства
   cat db.json | jq '.devices'
   ```

---

## 🎯 Что работает после настройки

✅ **Foreground уведомления** - когда приложение открыто  
✅ **Background уведомления** - когда приложение свёрнуто  
✅ **Local notifications** - через Capacitor на Android  
✅ **Browser notifications** - fallback для веба  
✅ **FCM delivery** - надёжная доставка через Firebase  

---

## 📖 Дополнительные ресурсы

- [Firebase Cloud Messaging Docs](https://firebase.google.com/docs/cloud-messaging)
- [Capacitor Local Notifications](https://capacitorjs.com/docs/guides/push-notifications)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)

---

## ✅ Чек-лист успешной настройки

- [ ] Firebase проект создан
- [ ] Веб-приложение добавлено
- [ ] VAPID ключ получен
- [ ] `.env` файл настроен
- [ ] `firebase-service-account.json` скачан
- [ ] Server запущен с Firebase Admin
- [ ] Client запрашивает notification permission
- [ ] FCM token регистрируется на сервере
- [ ] Тестовое уведомление пришло

**Готово! Push-уведомления работают!** 🎉
