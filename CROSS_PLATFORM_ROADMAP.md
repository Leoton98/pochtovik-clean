# 🔄 Roadmap: Кроссплатформенный мессенджер

## Текущее состояние

### ✅ Реализовано
- [x] Веб-клиент (React)
- [x] Android приложение (Capacitor)
- [x] Шифрование RSA+AES
- [x] Name Server на Render
- [x] Yandex Cloud Storage

### ❌ Проблемы
1. **Render free tier** - засыпает через 15 мин
2. **HTTP Polling** - неэффективно, нет real-time
3. **Нет push-уведомлений** - пользователь не знает о новых сообщениях
4. **Один ключ на пользователя** - нельзя с нескольких устройств
5. **Нет индикаторов** - онлайн/офлайн, набор текста, прочитано

---

## Этапы улучшений

### 🔥 ЭТАП 1: Стабильная связь (Приоритет)

#### 1.1 Переезд на нормальный хостинг
**Проблема:** Render free tier засыпает  
**Решение:**
- ✅ **Vercel** или **Railway** (бесплатно, не засыпает)
- ✅ **Fly.io** ($5/мес, стабильно)
- ✅ **DigitalOcean App Platform** ($5/мес)

**Файлы для обновления:**
```
client/src/App.js (API URL)
client/src/components/SettingsView.js (настройки сервера)
name-server/package.json (деплой)
```

#### 1.2 WebSocket для real-time
**Проблема:** Polling каждые 5 секунд  
**Решение:**
```javascript
// name-server/server.js
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

// Храним активные подключения
const connections = new Map();

wss.on('connection', (ws, userId) => {
  connections.set(userId, ws);
  
  ws.on('message', (data) => {
    // Обработка сообщений
  });
  
  ws.on('close', () => {
    connections.delete(userId);
  });
});

// Отправка сообщения
function sendMessageToUser(userId, message) {
  const ws = connections.get(userId);
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message));
  }
}
```

**Преимущества:**
- ⚡ Мгновенная доставка
- 📉 Меньше нагрузка на сервер
- 🔔 Онлайн статус пользователей

---

### 📱 ЭТАП 2: Мульти-девайс

#### 2.1 Система сессий устройств
**Проблема:** Один приватный ключ на все устройства  
**Решение:**

**Структура данных:**
```json
{
  "userId": "alice",
  "devices": [
    {
      "deviceId": "phone-android-abc123",
      "publicKey": "-----BEGIN PUBLIC KEY-----...",
      "name": "Samsung Galaxy S21",
      "lastSeen": 1234567890,
      "isActive": true
    },
    {
      "deviceId": "desktop-windows-xyz789",
      "publicKey": "-----BEGIN PUBLIC KEY-----...",
      "name": "Windows PC",
      "lastSeen": 1234567800,
      "isActive": true
    }
  ]
}
```

**Алгоритм отправки:**
1. Получаем список всех устройств получателя
2. Шифруем сообщение для КАЖДОГО устройства
3. Отправляем в cloud N зашифрованных версий

#### 2.2 Синхронизация ключей
**Flow регистрации нового устройства:**
```
1. Пользователь входит на новом устройстве
2. Генерируется новая пара ключей
3. Устройство получает master-ключ со старого устройства
4. Новое устройство добавляется в список доверенных
5. Синхронизируются контакты и история
```

---

### 🔔 ЭТАП 3: Push-уведомления

#### 3.1 Firebase Cloud Messaging (FCM)
**Интеграция:**
```javascript
// client/src/services/PushService.js
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

class PushService {
  async initialize() {
    const firebaseApp = initializeApp(firebaseConfig);
    const messaging = getMessaging(firebaseApp);
    
    // Запрос разрешения
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return;
    
    // Получаем токен
    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY
    });
    
    // Отправляем токен на сервер
    await api.registerPushToken(token);
    
    // Слушаем уведомления в фоне
    onMessage(messaging, (payload) => {
      this.showNotification(payload);
    });
  }
  
  showNotification(payload) {
    new Notification(payload.data.title, {
      body: payload.data.body,
      icon: '/logo.png'
    });
  }
}
```

#### 3.2 Capacitor Local Notifications
**Для Android:**
```javascript
import { LocalNotifications } from '@capacitor/local-notifications';

// Запрос разрешения
await LocalNotifications.requestPermissions();

// Показ уведомления
await LocalNotifications.schedule({
  notifications: [{
    title: 'Новое сообщение',
    body: 'Алиса: Привет!',
    id: Date.now(),
    icon: 'logo.png',
    sound: 'default'
  }]
});
```

---

### 🎯 ЭТАП 4: Улучшение UX

#### 4.1 Индикаторы статуса
```javascript
// Присутствие пользователей
const presence = {
  'alice': { 
    online: true, 
    lastSeen: Date.now(),
    typing: false // печатает прямо сейчас
  },
  'bob': { 
    online: false, 
    lastSeen: Date.now() - 3600000 
  }
};

// Отображение в UI
<ContactItem 
  user={contact}
  online={presence[contact.userId]?.online}
  typing={presence[contact.userId]?.typing}
/>
```

#### 4.2 Статусы сообщений
```
🕐 Отправлено (в cloud)
✓ Доставлено (получатель скачал)
✓✓ Прочитано (получатель открыл)
```

**Реализация:**
```javascript
// Добавляем в структуру сообщения
{
  senderId: 'alice',
  timestamp: 1234567890,
  status: 'read', // sent, delivered, read
  readTimestamp: 1234567900
}
```

---

### 🛡️ ЭТАП 5: Безопасность и надёжность

#### 5.1 Резервное копирование ключей
**Варианты:**
1. **Экспорт в файл** - `.pochtovik-key` (JSON зашифрованный)
2. **QR-код** - сканирование с другого устройства
3. **Seed-фраза** - 12 слов для восстановления

**Пример экспорта:**
```javascript
const exportPrivateKey = async (privateKey, password) => {
  const encrypted = await encryptKey(privateKey, password);
  const blob = new Blob([JSON.stringify(encrypted)], {type: 'application/json'});
  // Скачать файл
};
```

#### 5.2 Верификация ключей
**Защита от MITM:**
```
1. Пользователи сравнивают fingerprint ключей
2. QR-код для быстрой верификации
3. Зелёная галочка ✓ если ключ проверен
```

---

## 📋 Приоритеты реализации

### СЕЙЧАС (Критично):
1. ✅ **Переезд на Railway/Vercel** - убрать засыпание сервера
2. ✅ **WebSocket** - real-time сообщения
3. ✅ **Индикатор онлайн/офлайн**

### В БЛИЖАЙШЕЕ ВРЕМЯ:
4. 🔲 **Push-уведомления** - FCM + Capacitor
5. 🔲 **Мульти-девайс** - система сессий
6. 🔲 **Статусы сообщений** - отправлено/прочитано

### В ПЕРСПЕКТИВЕ:
7. 🔲 **Резервное копирование** - экспорт ключей
8. 🔲 **Голосовые/видео звонки** - WebRTC
9. 🔲 **Групповые чаты** - шифрование для группы

---

## 🎯 Архитектура после улучшений

```
┌─────────────┐         WebSocket          ┌──────────────┐
│   Алиса     │ ◄────────────────────────► │  Name Server │
│  (Android)  │                            │  (Railway)   │
└─────────────┘                            └──────────────┘
       ▲                                          │
       │                                          │
       │            Yandex Cloud                  │
       └──────────────────────────────────────────┘
       
┌─────────────┐         WebSocket          ┌──────────────┐
│    Боб      │ ◄────────────────────────► │   Push (FCM) │
│   (Desktop) │                            └──────────────┘
└─────────────┘
```

**Потоки данных:**
1. **Сообщения:** Client → WebSocket → Cloud → WebSocket → Client
2. **Статусы:** Client → WebSocket → Server (онлайн/офлайн)
3. **Push:** Server → FCM → Уведомление на устройстве

---

## 💰 Стоимость инфраструктуры

| Сервис | Free Tier | Paid | Рекомендация |
|--------|-----------|------|--------------|
| Railway | 500 часов/мес | $5/мес | ✅ Лучше Render |
| Vercel | Бесплатно | $20/мес | ✅ Для фронтенда |
| Yandex Cloud | 10GB бесплатно | ~$5/мес | ✅ Оставить |
| Firebase FCM | Бесплатно | Бесплатно | ✅ Использовать |

**Итого:** ~$10/мес за стабильную работу

---

## 🚀 Следующие шаги

1. **Создать новый Name Server** на Railway с WebSocket
2. **Добавить индикаторы онлайн/офлайн** в ChatView
3. **Интегрировать FCM** для push-уведомлений
4. **Протестировать** на 2-3 устройствах в разных сетях

Готово к реализации! 🎉
