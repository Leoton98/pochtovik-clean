# 📦 Инструкция по сборке APK

## ✅ Текущий статус

- [x] React приложение собрано
- [x] Capacitor синхронизирован с Android
- [ ] APK файл не собран (требуется JDK)

## 🔧 Вариант 1: Сборка через Android Studio (Рекомендуется)

### Шаг 1: Откройте проект в Android Studio
```bash
cd client
npm run cap:open
```

Или вручную откройте папку: `client/android`

### Шаг 2: Дождитесь индексации
Android Studio выполнит:
- Sync Gradle
- Indexing файлов
- Download зависимостей

### Шаг 3: Соберите APK
В меню Android Studio:
1. **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
2. Дождитесь завершения сборки
3. APK будет в: `android/app/build/outputs/apk/debug/app-debug.apk`

### Шаг 4: Установка на устройство
```bash
# Через ADB (если установлен)
adb install android/app/build/outputs/apk/debug/app-debug.apk

# Или просто скопируйте APK на устройство и установите вручную
```

## 💻 Вариант 2: Сборка через командную строку (Требует JDK)

### Требования
- **JDK 11 или выше**
- **JAVA_HOME** переменная окружения

### Установка JDK

#### Способ 1: Через Android Studio (Автоматически)
1. Откройте Android Studio
2. **Tools** → **SDK Manager**
3. Вкладка **SDK Tools**
4. Отметьте **Android SDK Platform-Tools** и **NDK**
5. Нажмите **Apply**

#### Способ 2: Установить отдельно
Скачайте с: https://www.oracle.com/java/technologies/downloads/

Или используйте OpenJDK: https://adoptium.net/

### Настройка JAVA_HOME

1. Найдите путь к Java:
   - Обычно: `C:\Program Files\Java\jdk-17`
   - Или: `C:\Program Files\Android\AndroidStudio\jbr`

2. Добавьте переменную окружения:
```powershell
# PowerShell (от администратора)
[System.Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\Program Files\Java\jdk-17", "Machine")

# Или через GUI:
# Панель управления → Система → Дополнительные параметры системы
# Переменные среды → Создать (для пользователя или системы)
# Имя: JAVA_HOME
# Значение: C:\Program Files\Java\jdk-17
```

3. Перезапустите терминал и проверьте:
```bash
java -version
echo $env:JAVA_HOME
```

### Сборка APK

```bash
cd client\android

# Debug APK
.\gradlew assembleDebug

# Release APK (требует signing key)
.\gradlew assembleRelease
```

APK файлы будут в:
- Debug: `android/app/build/outputs/apk/debug/app-debug.apk`
- Release: `android/app/build/outputs/apk/release/app-release-unsigned.apk`

## 🔑 Вариант 3: Использование bundled JDK от Android Studio

Android Studio включает собственную JDK (JBR). Давайте используем её:

```bash
# Найти путь к JBR
$androidStudioPath = "C:\Program Files\Android\AndroidStudio"
$jbrPath = "$androidStudioPath\jbr"

# Установить JAVA_HOME временно для текущей сессии
$env:JAVA_HOME = $jbrPath

# Перейти к проекту
cd client\android

# Собрать APK
.\gradlew assembleDebug
```

## 📍 Где искать APK после сборки

После успешной сборки APK файлы находятся в папке:

```
client/android/app/build/outputs/apk/
├── debug/
│   └── app-debug.apk              # Debug версия (для тестирования)
└── release/
    └── app-release-unsigned.apk   # Release версия (без подписи)
```

## ⚙️ Проверка сборки

Проверьте что APK создан:

```bash
Test-Path "android/app/build/outputs/apk/debug/app-debug.apk"
```

Если `True` - APK готов!

## 📱 Установка APK на устройство

### Через USB
1. Включите **Отладку по USB** на устройстве
2. Подключите к ПК
3. Выполните:
```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

### Без USB
1. Скопируйте APK файл на устройство
2. Откройте файловый менеджер
3. Нажмите на APK файл
4. Разрешите установку из неизвестных источников
5. Установите приложение

## 🐛 Возможные проблемы

### "JAVA_HOME is not set"
Установите переменную окружения JAVA_HOME (см. выше)

### "SDK location not found"
Создайте файл `local.properties` в папке `client/android`:
```
sdk.dir=C:\\Users\\ВАШЕ_ИМЯ\\AppData\\Local\\Android\\Sdk
```

### "Gradle build failed"
Очистите кэш:
```bash
cd client\android
.\gradlew clean
.\gradlew assembleDebug
```

### "Certificate error" при установке
Для release версии нужна подпись. Для debug версии используется автоматическая подпись.

## 🎯 Быстрая команда (если JDK установлен)

```bash
cd client
npm run build
npx cap sync android
cd android
.\gradlew assembleDebug

# Проверка
if (Test-Path "app/build/outputs/apk/debug/app-debug.apk") {
    Write-Host "✅ APK успешно создан!" -ForegroundColor Green
    Write-Host "Путь: $(Get-Location)\app\build\outputs\apk\debug\app-debug.apk"
}
```

## 📞 Помощь

- 📖 [Android Studio Setup Guide](https://developer.android.com/studio/intro)
- 🔧 [JDK Installation Guide](https://www.java.com/en/download/help/download_options.xml)
- 📦 [Capacitor Deployment](https://capacitorjs.com/docs/basics/deploying-to-app-stores)

---

**Рекомендация**: Используйте **Android Studio** для первой сборки - это самый надежный способ! 🚀
