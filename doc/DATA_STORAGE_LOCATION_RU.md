# 📍 Где хранятся данные пользователей в Почтовике

## 🗄️ Типы данных и их расположение

### **1. Локальное хранилище приложения (Electron Store)**

**Что хранится:**
- ✅ Конфигурация аккаунта (User ID, настройки облака)
- ✅ Приватный ключ RSA
- ✅ Access Key ID и Secret Access Key
- ✅ Настройки сервера имён

**Где физически:**

#### **Windows:**
```
%APPDATA%\Pochtovik\config.json
или
C:\Users\<Username>\AppData\Roaming\Pochtovik\config.json
```

#### **macOS:**
```
~/Library/Application Support/Pochtovik/config.json
```

#### **Linux:**
```
~/.config/Pochtovik/config.json
```

**Структура файла:**
```json
{
  "user": {
    "userId": "alice",
    "displayName": "Алиса",
    "nameServerUrl": "http://localhost:3001",
    "bucket": "secure-messenger-bucket",
    "accessKeyId": "YCA...",
    "secretAccessKey": "...",
    "endpoint": "https://storage.yandexcloud.net"
  },
  "privateKey": "-----BEGIN RSA PRIVATE KEY-----\n..."
}
```

⚠️ **Важно:** Этот файл содержит чувствительные данные! Не передавайте его.

---

### **2. Name Server (Сервер имён)**

**Что хранится:**
- ✅ User ID пользователей
- ✅ Публичные ключи RSA
- ✅ Отображаемые имена (displayName)

**Где физически:**
```
name-server/db.json
или
<custom-path>/users.json (если задан в .env)
```

**Структура базы:**
```json
{
  "users": {
    "alice": {
      "publicKey": "-----BEGIN PUBLIC KEY-----\n...",
      "displayName": "Алиса",
      "registeredAt": 1234567890
    },
    "bob": {
      "publicKey": "-----BEGIN PUBLIC KEY-----\n...",
      "displayName": "Боб",
      "registeredAt": 1234567891
    }
  }
}
```

📍 **Путь к проекту:** [`c:\Users\pkleontev\Documents\Pochtovik\name-server\db.json`](c:\Users\pkleontev\Documents\Pochtovik\name-server\db.json)

---

### **3. Yandex Cloud (Облачное хранилище)**

**Что хранится:**
- ✅ Зашифрованные сообщения
- ✅ Файлы вложений (тоже зашифрованные)

**Где физически:**
```
Yandex Object Storage Bucket
Регион: ru-central1
Endpoint: https://storage.yandexcloud.net
```

**Структура в облаке:**
```
messages/
└── <recipientId>/
    ├── <timestamp>_<messageId>.enc
    └── ...

attachments/
└── <userId>/
    ├── <timestamp>_<fileId>.enc
    └── ...
```

🔐 **Важно:** Все файлы в облаке **зашифрованы**! Без приватного ключа их невозможно прочитать.

---

## 🔐 Уровень безопасности данных

| Данные | Где хранятся | Шифрование | Доступно извне |
|--------|--------------|------------|----------------|
| **Приватный ключ** | Electron Store | ❌ Нет (локально) | Только с устройства |
| **Secret Access Key** | Electron Store | ⚠️ Частично | Только с устройства |
| **Публичный ключ** | Name Server + локально | ❌ Нет | Видят все пользователи |
| **Сообщения** | Yandex Cloud | ✅ RSA+AES | Невозможно прочитать |
| **User ID** | Name Server + локально | ❌ Нет | Видят все пользователи |

---

## 📂 Полная карта данных

### **На устройстве пользователя:**

```
Устройство (Компьютер)
├── Electron Store (%APPDATA%\Pochtovik\config.json)
│   ├── user.userId
│   ├── user.displayName
│   ├── user.bucket
│   ├── user.accessKeyId
│   ├── user.secretAccessKey
│   └── privateKey (RSA приватный ключ)
│
└── Кэш (временные файлы)
    └── расшифрованные сообщения (в оперативной памяти)
```

### **На сервере имён:**

```
Name Server (name-server/db.json)
├── users.alice.publicKey
├── users.alice.displayName
├── users.bob.publicKey
└── users.bob.displayName
```

### **В облаке:**

```
Yandex Cloud Bucket
├── messages/alice/<encrypted-messages>
├── messages/bob/<encrypted-messages>
├── attachments/alice/<encrypted-files>
└── attachments/bob/<encrypted-files>
```

---

## 🔍 Как посмотреть данные

### **Посмотреть Electron Store:**

#### **Способ 1: Через приложение**
1. Откройте Настройки
2. Нажмите "💾 Экспорт приватного ключа"
3. Вы увидите часть данных

#### **Способ 2: Прямой доступ к файлу**

**Windows (PowerShell):**
```powershell
notepad "$env:APPDATA\Pochtovik\config.json"
```

**macOS:**
```bash
open ~/Library/Application\ Support/Pochtovik/config.json
```

**Linux:**
```bash
cat ~/.config/Pochtovik/config.json
```

⚠️ **Осторожно:** Не редактируйте файл вручную! Можно повредить данные.

---

### **Посмотреть Name Server:**

**Файл базы данных:**
```bash
# Из корня проекта
cat name-server/db.json
```

Или откройте файл в любом текстовом редакторе:
```
c:\Users\pkleontev\Documents\Pochtovik\name-server\db.json
```

---

### **Посмотреть облако:**

**Через Yandex Cloud Console:**
1. Зайдите в [консоль Яндекс Облака](https://console.cloud.yandex.com/)
2. Перейдите в ваш бакет
3. Включите режим просмотра файлов
4. Просматривайте структуру папок

**Через AWS CLI:**
```bash
aws s3 ls s3://<your-bucket-name>/messages/ \
  --endpoint-url=https://storage.yandexcloud.net \
  --profile=yandex
```

---

## 💾 Резервное копирование

### **Что нужно резервировать:**

#### **Критически важно:**
✅ **Приватный ключ** - без него не расшифруете сообщения  
✅ **Secret Access Key** - без него не получите доступ к облаку  

#### **Желательно:**
✅ **Конфигурацию** - можно восстановить, но проще иметь копию  
✅ **Name Server db.json** - если вы администратор сервера  

#### **Не обязательно:**
❌ **Сообщения из облака** - они уже в облаке  
❌ **Публичные ключи** - можно получить заново от контактов  

---

### **Как сделать резервную копию:**

#### **Способ 1: Через приложение**
```
1. Настройки → "💾 Экспорт приватного ключа"
2. Сохранить .pem файл
3. Настройки → "📤 Экспорт конфига" (если есть)
4. Сохранить .json файл
5. Скопировать оба файла в надёжное место
```

#### **Способ 2: Копирование файла**
```
Windows:
copy "%APPDATA%\Pochtovik\config.json" "D:\Backup\pochtovik-backup.json"

macOS/Linux:
cp ~/.config/Pochtovik/config.json /mnt/backup/pochtovik-backup.json
```

⚠️ **Зашифруйте резервную копию!** Используйте Veracrypt или 7-Zip с паролем.

---

## 🗑️ Удаление данных

### **Локальное удаление:**

**Через приложение:**
1. Настройки → "🚪 Выйти из аккаунта"
2. Подтвердить выход
3. ✅ Все данные удалены из Electron Store

**Вручную (удаление файла):**
```powershell
# Windows
Remove-Item "$env:APPDATA\Pochtovik\config.json"

# macOS
rm ~/Library/Application\ Support/Pochtovik/config.json

# Linux
rm ~/.config/Pochtovik/config.json
```

---

### **Удаление из Name Server:**

**Через API:**
```bash
# DELETE запрос к name server
curl -X DELETE http://localhost:3001/users/alice
```

**Прямое редактирование db.json:**
1. Открыть `name-server/db.json`
2. Удалить запись о пользователе
3. Сохранить файл

⚠️ **Осторожно:** Это действие необратимо!

---

### **Удаление из облака:**

**Через AWS CLI:**
```bash
# Удалить все сообщения пользователя
aws s3 rm s3://<bucket>/messages/alice/ \
  --recursive \
  --endpoint-url=https://storage.yandexcloud.net

# Удалить все вложения
aws s3 rm s3://<bucket>/attachments/alice/ \
  --recursive \
  --endpoint-url=https://storage.yandexcloud.net
```

**Через Yandex Cloud Console:**
1. Зайти в консоль
2. Открыть бакет
3. Удалить папки `messages/alice/` и `attachments/alice/`

---

## 🔒 Безопасность хранения

### **Защита на устройстве:**

✅ **Шифрование диска**
- Windows: BitLocker
- macOS: FileVault
- Linux: LUKS/dm-crypt

✅ **Защищённый пароль учётной записи**
- Не используйте admin/root для повседневной работы

✅ **Антивирус и фаервол**
- Защитят от удалённых атак

✅ **Регулярные обновления**
- Обновляйте Electron app и систему

---

### **Защита в Name Server:**

✅ **Ограничение доступа**
- Только localhost для локальной разработки
- Firewall правила для продакшена

✅HTTPS для продакшена
- Используйте reverse proxy (nginx)
- SSL/TLS сертификаты

✅ **Регулярные бэкапы**
- Бэкапьте db.json регулярно
- Храните в нескольких местах

---

### **Защита в облаке:**

✅ **Ограниченные права доступа**
- Роль `storage.editor`, не администратор

✅ **Ротация ключей**
- Меняйте Access Keys каждые 90 дней

✅ **Мониторинг доступа**
- Включите логирование в Yandex Cloud
- Настройте алерты на подозрительную активность

---

## 📊 Сравнение подходов

| Метод хранения | Плюсы | Минусы |
|----------------|-------|--------|
| **Electron Store (локально)** | ✅ Быстрый доступ<br>✅ Работает офлайн<br>✅ Полный контроль | ❌ Риск потери при поломке<br>❌ Нужно резервировать |
| **Name Server (централизованно)** | ✅ Доступ с любого устройства<br>✅ Синхронизация | ❌ Нужен доступ к серверу<br>❌ Только публичные ключи |
| **Yandex Cloud (облако)** | ✅ Надёжно<br>✅ Доступ отовсюду<br>✅ Масштабируемо | ❌ Зашифровано (нужен ключ)<br>❌ Платно (немного) |

---

## 💡 Рекомендации

### **Для обычных пользователей:**

✅ **Регулярно экспортируйте приватный ключ** (раз в месяц)  
✅ **Храните резервную копию в зашифрованном виде**  
✅ **Используйте шифрование диска**  
✅ **Не удаляйте config.json без необходимости**  

### **Для администраторов Name Server:**

✅ **Регулярно бэкапьте db.json**  
✅ **Ограничьте доступ к серверу**  
✅ **Используйте HTTPS**  
✅ **Мониторьте состояние сервера**  

### **Для разработчиков:**

✅ **Проверяйте пути к файлам при отладке**  
✅ **Используйте dev/test отдельные бакеты**  
✅ **Не коммитьте config.json в Git**  
✅ **Добавьте .env.example для документации**  

---

## 🎯 Итог

**Данные пользователей распределены по трём местам:**

1. **Electron Store** (локально на устройстве) - приватные ключи и конфиги
2. **Name Server** (центрально) - публичные ключи и User ID
3. **Yandex Cloud** (облако) - зашифрованные сообщения

✅ **Безопасно:** Приватные ключи только локально  
✅ **Надёжно:** Сообщения зашифрованы в облаке  
✅ **Доступно:** Публичные ключи в Name Server  

**Для резервного копирования:**
- Экспортируйте приватный ключ через приложение
- Сохраняйте в зашифрованное место
- Обновляйте регулярно

---

**Нужно найти конкретные данные?** Обратитесь к соответствующему разделу выше! 📍
