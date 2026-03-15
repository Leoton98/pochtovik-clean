# 🔑 Firebase Configuration Values

## 📋 Скопируйте значения из Firebase Console

**Откройте:** https://console.firebase.google.com/project/pochtovik/settings/general/web

---

### 1️⃣ VAPID Key (Cloud Messaging)

**Путь:** Project settings → Cloud messaging → Web Push certificates

```
REACT_APP_FIREBASE_VAPID_KEY=
```

**Вставьте сюда ключ который скопировали (начинается с BKagOny0KF...)**

---

### 2️⃣ Firebase Config (Web App)

**Путь:** Project settings → General → Your apps → SDK setup and configuration

**Скопируйте значения:**

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",              // ← скопируйте
  authDomain: "...",              // ← скопируйте  
  projectId: "...",               // ← скопируйте
  storageBucket: "...",           // ← скопируйте
  messagingSenderId: "...",       // ← скопируйте
  appId: "..."                    // ← скопируйте
};
```

**Заполните .env файл:**

```bash
REACT_APP_FIREBASE_API_KEY=AIzaSy...        # из apiKey
REACT_APP_FIREBASE_AUTH_DOMAIN=...           # из authDomain
REACT_APP_FIREBASE_PROJECT_ID=pochtovik      # из projectId
REACT_APP_FIREBASE_STORAGE_BUCKET=...        # из storageBucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=...   # из messagingSenderId
REACT_APP_FIREBASE_APP_ID=...                # из appId
```

---

### ✅ Проверка

После заполнения проверьте что в `client/.env` есть:

```bash
REACT_APP_FIREBASE_VAPID_KEY=BKagOny0KF...     # ✓ Длинный ключ
REACT_APP_FIREBASE_API_KEY=AIzaSy...           # ✓ API ключ
REACT_APP_FIREBASE_PROJECT_ID=pochtovik        # ✓ ID проекта
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123...  # ✓ Числовой ID
REACT_APP_FIREBASE_APP_ID=1:123...             # ✓ ID приложения
```

---

## 🔒 Service Account Key (для сервера)

**Путь:** Project settings → Service accounts → Generate new private key

1. Нажмите **"Generate new private key"**
2. Скачайте JSON файл
3. Переименуйте в `firebase-service-account.json`
4. Положите в папку `name-server-v2/`

**Формат файла:**
```json
{
  "type": "service_account",
  "project_id": "pochtovik",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...",
  "client_email": "...",
  "client_id": "...",
  "auth_uri": "...",
  "token_uri": "...",
  ...
}
```

---

## 📝 Пример заполненного .env

```bash
GENERATE_SOURCEMAP=false

# Firebase Cloud Messaging Configuration
REACT_APP_FIREBASE_VAPID_KEY=BKagOny0KFxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
REACT_APP_FIREBASE_API_KEY=AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxx
REACT_APP_FIREBASE_AUTH_DOMAIN=pochtovik.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=pochtovik
REACT_APP_FIREBASE_STORAGE_BUCKET=pochtovik.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789012
REACT_APP_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
```

---

## ✅ Следующий шаг

После заполнения `.env`:

1. **Перезапустите клиент:**
   ```bash
   cd client
   npm start
   ```

2. **Проверьте консоль:**
   ```
   ✅ Firebase Cloud Messaging initialized
   ```

3. **Если ошибка** - проверьте что все значения скопированы правильно

---

**Готово! Переходите к настройке сервера!** 🎉
