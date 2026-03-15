# ⚡ Быстрое обновление сервера на Render

## 🎯 3 шага к обновлению

### Шаг 1: Настройте UptimeRobot (2 минуты)

**Создайте монитор:**

1. https://dashboard.uptimerobot.com/monitors → **Add New Monitor**
2. Заполните:
   ```
   Type: HTTP(s)
   Name: Pochtovik Server Keep-Alive
   URL: https://pochtovik-name-server.onrender.com/health
   Interval: 5 minutes
   ```
3. **Create Monitor** ✅

---

### Шаг 2: Задеплойте новую версию (3 минуты)

**Если используете GitHub:**

```bash
cd c:\Users\pkleontev\Documents\pochtovik-mobile\Pochtovik
git add .
git commit -m "feat: Update to name-server-v2 with WebSocket and Push notifications"
git push origin main
```

**Render автоматически задеплоит!**

---

### Шаг 3: Проверьте (1 минута)

**1. Проверьте логи Render:**
https://dashboard.render.com → Ваш сервис → Logs

**Должно быть:**
```
✅ Firebase Admin initialized - Push notifications enabled
🚀 Name Server v2 running on port 3001
🔌 WebSocket server ready
```

**2. Проверьте health:**
https://pochtovik-name-server.onrender.com/health

**3. Проверьте UptimeRobot:**
Статус должен быть **"Up"**

---

## ✅ Готово!

**Что работает:**
- ✅ Сервер не спит (UptimeRobot ping)
- ✅ WebSocket для real-time
- ✅ Push-уведомления (если настроен Firebase)
- ✅ Мульти-девайс поддержка
- ✅ Индикаторы онлайн/офлайн

---

## 🐛 Если что-то не так

**Сервер не деплоится:**
```bash
cd name-server-v2
npm install
git add package-lock.json
git commit -m "fix: dependencies"
git push
```

**Firebase не работает:**
- Добавьте service account key в Render Environment Variables
- Или прочитайте `PUSH_NOTIFICATIONS_SETUP.md`

**WebSocket не подключается:**
- Проверьте логи в Render Dashboard
- Убедитесь что тип сервиса "Web Service"

---

## 📖 Полная инструкция

[`UPTIMEROBOT_SETUP.md`](./UPTIMEROBOT_SETUP.md) - детальная настройка
