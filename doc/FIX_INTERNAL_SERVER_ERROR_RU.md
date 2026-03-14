# 🔧 Исправление: Internal server error при создании пользователя

## ❌ Проблема

При попытке создать пользователя появляется ошибка:
```
Internal server error
```

## 🔍 Причина

Отсутствует файл базы данных `name-server/db.json`

## ✅ Решение

### Способ 1: Создать файл вручную

1. Перейдите в папку проекта: `c:\Users\pkleontev\Documents\Pochtovik\name-server\`
2. Создайте файл `db.json`
3. Добавьте содержимое:

```json
{
  "users": {}
}
```

4. Сохраните файл
5. Перезапустите сервер имён

---

### Способ 2: Автоматическое создание (через консоль)

**Windows (PowerShell):**
```powershell
cd c:\Users\pkleontev\Documents\Pochtovik\name-server
echo {"users":{}} > db.json
```

**macOS/Linux:**
```bash
cd /path/to/Pochtovik/name-server
echo '{"users":{}}' > db.json
```

---

## 🚀 Запуск сервера

После создания файла:

```bash
npm run dev:server
```

Вы должны увидеть:
```
Name server running on port 3001
Database location: c:\Users\pkleontev\Documents\Pochtovik\name-server\db.json

Available endpoints:
  GET  /health           - Health check
  POST /register         - Register user
  GET  /key/:userId      - Get public key
  GET  /users            - List all users
  PUT  /user/:userId/update - Update user
  DELETE /user/:userId   - Delete user
```

---

## ✅ Проверка

Проверьте, что сервер работает:

**В браузере или curl:**
```
http://localhost:3001/health
```

**Ответ:**
```json
{
  "status": "ok",
  "timestamp": 1234567890
}
```

---

## 🎯 Регистрация пользователя

Теперь попробуйте зарегистрировать пользователя:

**Через приложение:**
1. Откройте Почтовик
2. Нажмите "📝 Нет аккаунта? Зарегистрироваться"
3. Введите User ID и имя
4. Нажмите "✨ Создать аккаунт"
5. ✅ Готово!

**Или через API:**
```bash
curl -X POST http://localhost:3001/register \
  -H "Content-Type: application/json" \
  -d '{"userId":"alice","publicKey":"-----BEGIN PUBLIC KEY-----...","displayName":"Алиса"}'
```

**Ответ:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "userId": "alice"
}
```

---

## 🐛 Другие возможные проблемы

### Проблема 1: Сервер не запускается

**Ошибка:**
```
Error: Port 3001 is already in use
```

**Решение:**
```bash
# Windows PowerShell
Get-Process -Id (Get-NetTCPConnection -LocalPort 3001).OwningProcess | Stop-Process

# Или измените порт в .env
PORT=3002
```

---

### Проблема 2: Ошибка доступа к файлу

**Ошибка:**
```
EACCES: permission denied, open 'db.json'
```

**Решение:**
```bash
# Проверьте права на папку
icacls name-server

# Или запустите от имени администратора
```

---

### Проблема 3: Повреждённый db.json

**Симптомы:**
```
SyntaxError: Unexpected token E in JSON at position 0
```

**Решение:**
1. Удалите файл `db.json`
2. Создайте заново с правильным JSON:
```json
{
  "users": {}
}
```

---

## 📊 Структура db.json

После регистрации пользователей файл будет выглядеть так:

```json
{
  "users": {
    "alice": {
      "publicKey": "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAr...",
      "displayName": "Алиса",
      "registeredAt": 1234567890,
      "lastSeen": 1234567890
    },
    "bob": {
      "publicKey": "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAz...",
      "displayName": "Боб",
      "registeredAt": 1234567891,
      "lastSeen": 1234567891
    }
  }
}
```

---

## 💡 Профилактика

### Резервное копирование:

```bash
# Скопируйте базу перед изменениями
copy name-server\db.json name-server\db.json.backup
```

### Мониторинг:

```bash
# Проверка размера файла
dir name-server\db.json

# Просмотр содержимого
type name-server\db.json
```

---

## 🎉 Итог

✅ **Файл создан** - база данных готова  
✅ **Сервер запущен** - работает на порту 3001  
✅ **Регистрация работает** - можно создавать пользователей  

**Попробуйте зарегистрироваться прямо сейчас!** 📬✨
