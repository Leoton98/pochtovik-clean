# 📬 Почтовик - Защищённый мессенджер

**Сквозное шифрование • Yandex Cloud • Кроссплатформенность**

## 🚀 Быстрый старт

### 1. Установка
```bash
npm run install:all
```

### 2. Запуск
```bash
# Терминал 1: Сервер имён
npm run dev:server

# Терминал 2: Клиент
npm run dev:client
```

### 3. Регистрация
1. Нажмите "Создать новый аккаунт"
2. Введите User ID и пароль
3. Готово!

## 📡 Подключение из другой сети

### Настройки Name Server:
- **Локально:** `http://localhost:3001`
- **Удалённо:** `http://<IP_сервера>:3001`

### Yandex Cloud (общий бакет):
```
Bucket: YOUR_BUCKET_NAME
Access Key: YOUR_ACCESS_KEY_ID
Secret Key: YOUR_SECRET_ACCESS_KEY
Endpoint: https://storage.yandexcloud.net
Region: ru-central1
```

## 🔐 Безопасность

✅ RSA-2048 + AES-256 шифрование  
✅ Приватные ключи хранятся локально  
✅ Сообщения в облаке зашифрованы  
✅ Сквозное шифрование  

## 📚 Документация

Полная документация в папке [`doc/`](doc/)

- [Архитектура](doc/ARCHITECTURE_RU.md)
- [Безопасность](doc/SECURITY_RU.md)
- [Настройка Yandex Cloud](doc/YANDEX_CLOUD_SETUP_RU.md)

## 💡 Как это работает

```
Алиса ←→ Шифрование ←→ Yandex Cloud ←→ Дешифрование ←→ Боб
       (RSA+AES)                        (приватный ключ)
```

Все сообщения хранятся в зашифрованном виде в Yandex Cloud. Каждый пользователь имеет свою папку в общем бакете.

## 🛠️ Разработка

```bash
# Установить всё
npm run install:all

# Запустить сервер
npm run dev:server

# Запустить клиент
npm run dev:client

# Собрать приложение
npm run build:client
```

## 📦 Структура

```
Pochtovik/
├── client/          # Electron приложение
├── name-server/     # Сервер имён
├── doc/             # Документация
└── .gitignore
```

## 🌍 Платформы

- Windows 10/11
- macOS 10.13+
- Linux

## 📝 Лицензия

MIT License

---

**Готовы начать?** Откройте [ПОЧТОВИК.md](ПОЧТОВИК.md) для подробной документации!
