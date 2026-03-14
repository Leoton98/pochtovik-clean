# 🎯 Финальная инструкция по сборке APK

## ✅ Текущий статус

- [x] JDK 21 установлен и настроен ✅
- [x] React приложение собрано ✅
- [x] Capacitor синхронизирован ✅
- [ ] **Android SDK не установлен** ❌

## 🚨 Проблема

Для сборки APK через командную строку требуется **Android SDK**.

## ✅ Решение

### Вариант 1: Установить Android Studio (Рекомендуется)

Это самый простой способ! Android Studio автоматически установит всё необходимое.

#### Шаг 1: Скачайте Android Studio
- https://developer.android.com/studio
- Версия для Windows: ~1.1 GB

#### Шаг 2: Установите
1. Запустите установщик
2. Следуйте инструкциям мастера установки
3. Выберите стандартную установку

#### Шаг 3: Настройте SDK
После первого запуска:
1. Откройте **SDK Manager** (Tools → SDK Manager)
2. Установите:
   - Android SDK Platform (выберите последнюю версию)
   - Android SDK Build-Tools
   - Android SDK Command-line Tools

#### Шаг 4: Откройте проект в Android Studio
```bash
cd ..
npm run cap:open
```

#### Шаг 5: Соберите APK
В Android Studio:
1. **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
2. Готово! ✅

**APK будет в**: `android/app/build/outputs/apk/debug/app-debug.apk`

---

### Вариант 2: Установить только Android SDK (Для продвинутых)

Если не хотите устанавливать Android Studio полностью:

#### Шаг 1: Скачайте Command Line Tools
- https://developer.android.com/studio#command-tools
- Скачайте "Command line tools only"

#### Шаг 2: Установите SDK
```powershell
# Создайте папку для SDK
$sdkPath = "C:\Android\Sdk"
New-Item -ItemType Directory -Path $sdkPath -Force

# Распакуйте command-line tools в $sdkPath/cmdline-tools
# Переименуйте папку в "latest"

# Примите лицензии
cd $sdkPath\cmdline-tools\latest\bin
.\sdkmanager.bat --licenses

# Установите платформы и build-tools
.\sdkmanager.bat "platforms;android-34" "build-tools;34.0.0" "platform-tools"
```

#### Шаг 3: Настройте переменные окружения
```powershell
[System.Environment]::SetEnvironmentVariable("ANDROID_HOME", "C:\Android\Sdk", "Machine")
[System.Environment]::SetEnvironmentVariable("ANDROID_SDK_ROOT", "C:\Android\Sdk", "Machine")

$oldPath = [System.Environment]::GetEnvironmentVariable("Path", "Machine")
[System.Environment]::SetEnvironmentVariable("Path", "$oldPath;C:\Android\Sdk\platform-tools;C:\Android\Sdk\tools", "Machine")
```

#### Шаг 4: Создайте local.properties
В папке `client/android` создайте файл `local.properties`:
```
sdk.dir=C\:\\Android\\Sdk
```

#### Шаг 5: Соберите APK
```bash
cd client\android
.\gradlew assembleDebug
```

---

## 🎯 Самый быстрый способ (без установки)

### Используйте онлайн эмулятор или готовый APK:

1. **Расширение Chrome для тестирования Android приложений**:
   - ARC Welder (Chrome Web Store)

2. **Или используйте эмуляторы**:
   - BlueStacks
   - NoxPlayer
   - LDPlayer

Просто перетащите APK файл в окно эмулятора!

---

## 📋 Что уже готово

✅ **React приложение**: Собрано в папке `client/build/`  
✅ **Capacitor**: Синхронизировано с Android  
✅ **JDK 21**: Установлен и работает  
✅ **Android проект**: Готов в папке `client/android/`  

**Осталось**: Установить Android SDK (через Android Studio или отдельно)

---

## 💡 Рекомендация

**Установите Android Studio** - это:
- ✅ Автоматическая установка SDK
- ✅ Встроенный эмулятор
- ✅ Удобная сборка APK в один клик
- ✅ Отладка на реальных устройствах
- ✅ Все необходимые инструменты

**Ссылка**: https://developer.android.com/studio

---

## 🔍 Проверка после установки Android Studio

```bash
# Проверьте что SDK установлен
if (Test-Path "C:\Users\$env:USERNAME\AppData\Local\Android\Sdk") {
    Write-Host "✅ Android SDK найден!" -ForegroundColor Green
} else {
    Write-Host "❌ Android SDK не найден" -ForegroundColor Red
}

# Создайте local.properties
$sdkPath = "C:\Users\$env:USERNAME\AppData\Local\Android\Sdk"
"sdk.dir=$sdkPath".Replace('\', '\\') | Out-File -FilePath "local.properties" -Encoding ascii

# Соберите APK
.\gradlew assembleDebug
```

---

## 📦 Где будет APK

После успешной сборки:
```
client/android/app/build/outputs/apk/debug/app-debug.apk
```

Размер: ~50-70 MB (зависит от приложения)

---

## 🚀 Альтернатива: Веб-версия

Пока настраиваете Android, можете протестировать веб-версию:

```bash
cd client
npm run start:react
```

Откроется в браузере на localhost:3000

---

**Нужна помощь?** См. полную документацию в папке `client/`:
- README_ANDROID.md
- CHEATSHEET.md
- ANDROID_SETUP.md
