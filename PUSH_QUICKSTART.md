# 🚀 Quick Start: Push Notifications

## ⚡ Быстрая настройка за 5 минут

### Шаг 1: Firebase (2 мин)

1. [Firebase Console](https://console.firebase.google.com/) → **Add project** → `pochtovik`
2. **Project settings** → **Cloud Messaging** → скопируйте **VAPID key**
3. **Service accounts** → **Generate new private key** → сохраните JSON

---

### Шаг 2: Frontend (2 мин)

**Создайте `client/.env`:**
```bash
REACT_APP_FIREBASE_VAPID_KEY=ваш_ключ_из_шага_2
```

**Остальные переменные можно добавить позже:**
```bash
# Опционально для полной настройки
REACT_APP_FIREBASE_API_KEY=...
REACT_APP_FIREBASE_PROJECT_ID=pochtovik
```

---

### Шаг 3: Backend (1 мин)

**Положите JSON файл из шага 1 в папку сервера:**
```bash
cp ~/Downloads/firebase-service-account.json name-server-v2/
```

**Проверьте установку:**
```bash
cd name-server-v2
npm list firebase-admin  # Должен быть установлен
```

---

### Шаг 4: Запуск (30 сек)

```bash
# Terminal 1 - Server
cd name-server-v2
npm start

# Terminal 2 - Client  
cd client
npm start
```

---

### Шаг 5: Проверка (30 сек)

**В консоли клиента должно быть:**
```
✅ Firebase Cloud Messaging initialized
📱 FCM Token received: eXwW...
```

**В консоли сервера:**
```
✅ Firebase Admin initialized - Push notifications enabled
📱 FCM token registered for device device-abc123
```

---

## 🎉 Готово!

Push-уведомления готовы к работе!

**Для полной настройки прочитайте:** [`PUSH_NOTIFICATIONS_SETUP.md`](./PUSH_NOTIFICATIONS_SETUP.md)
