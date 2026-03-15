# 📱 Сборка APK - Полная инструкция

## ✅ Подготовка завершена

Все современные адаптивные стили применены к компонентам!

---

## 🔨 Способ 1: Через Android Studio (Рекомендуется)

### Шаг 1: Откройте проект в Android Studio

```bash
cd client/android
npx cap open android
```

Или просто откройте файл `client/android/build.gradle` в Android Studio.

### Шаг 2: Дождитесь синхронизации Gradle

Android Studio автоматически:
- Скачает зависимости
- Синхронизирует проект
- Подготовится к сборке

### Шаг 3: Соберите APK

**Вариант A: Debug APK (для тестирования)**

1. В меню: `Build` → `Build Bundle(s) / APK(s)` → `Build APK(s)`
2. Дождитесь завершения сборки
3. APK будет в: `client/android/app/build/outputs/apk/debug/app-debug.apk`

**Вариант B: Release APK (для публикации)**

1. В меню: `Build` → `Generate Signed Bundle / APK`
2. Выберите `APK`
3. Создайте новый ключ или используйте существующий
4. Выберите `release` сборку
5. Нажмите `Finish`

---

## ⚡ Способ 2: Через командную строку

### Быстрая сборка Debug APK

```bash
cd client/android
.\gradlew assembleDebug
```

**Результат:**
```
client/android/app/build/outputs/apk/debug/app-debug.apk
```

### Сборка Release APK

```bash
cd client/android
.\gradlew assembleRelease
```

**Результат:**
```
client/android/app/build/outputs/apk/release/app-release.apk
```

---

## 🎯 Где найти APK

После сборки APK находится в папке:

```
client/android/app/build/outputs/apk/
├── debug/
│   └── app-debug.apk          # Для тестирования
└── release/
    └── app-release.apk        # Для публикации
```

---

## 📲 Установка на устройство

### Через USB

1. Включите **USB Debugging** на устройстве:
   - Настройки → О телефоне → 7 раз нажмите "Номер сборки"
   - Настройки → Для разработчиков → USB Debugging (вкл)

2. Подключите телефон к компьютеру

3. Установите APK:
   ```bash
   adb install client/android/app/build/outputs/apk/debug/app-debug.apk
   ```

### Через файл

1. Скопируйте APK на телефон
2. Откройте файл на телефоне
3. Разрешите установку из неизвестных источников
4. Установите приложение

---

## 🔧 Решение проблем

### Проблема: Gradle не найден

**Решение:**
```bash
cd client/android
.\gradlew --version
```

Если ошибка - установите Android Studio с Gradle.

### Проблема: Не хватает SDK

**Решение:**
1. Откройте Android Studio
2. Tools → SDK Manager
3. Установите:
   - Android SDK Platform 34
   - Android SDK Build-Tools
   - Android Emulator

### Проблема: Ошибка подписи

**Решение для debug:**
```bash
# Debug APK не требует специальной подписи
.\gradlew assembleDebug
```

**Для release создайте key.properties:**
```properties
storePassword=ваш_пароль
keyPassword=ваш_пароль
keyAlias=ваш_key_alias
storeFile=../keystore.jks
```

### Проблема: Приложение вылетает

**Проверьте логи:**
```bash
adb logcat | grep -i pochtovik
```

**Частые причины:**
- Неправильный API URL
- Отсутствие разрешений в AndroidManifest.xml
- Ошибки в JavaScript коде

---

## 📦 Размер APK

### Оптимизация размера

Если APK слишком большой (>50MB):

1. **Включите ProGuard/R8** в `android/app/build.gradle`:
   ```gradle
   buildTypes {
       release {
           minifyEnabled true
           proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
       }
   }
   ```

2. **Используйте App Bundle** вместо APK:
   ```bash
   .\gradlew bundleRelease
   ```

3. **Сожмите ресурсы**:
   ```bash
   npx capacitor-assets generate
   ```

---

## 🎨 Иконка и Splash Screen

### Обновление иконки

1. Подготовьте иконку 512x512px
2. Положите в `client/public/icon.png`
3. Сгенерируйте размеры:
   ```bash
   npx @capacitor/assets generate
   ```

### Обновление Splash Screen

1. Подготовьте изображение 2732x2732px
2. Положите в `client/public/splash.png`
3. Сгенерируйте размеры:
   ```bash
   npx @capacitor/assets generate --splash
   ```

---

## 🚀 Публикация в Google Play

### Требования

1. **Release APK** должен быть подписан
2. **Уникальное имя пакета**: `com.yourcompany.pochtovik`
3. **Version code**: Увеличивайте с каждой версией
4. **Version name**: Человекочитаемая версия (1.0.0)

### Подготовка

1. Измените `android/app/build.gradle`:
   ```gradle
   defaultConfig {
       applicationId "com.yourcompany.pochtovik"
       versionCode 1
       versionName "1.0.0"
   }
   ```

2. Создайте keystore:
   ```bash
   keytool -genkey -v -keystore pochtovik.keystore -alias pochtovik -keyalg RSA -keysize 2048 -validity 10000
   ```

3. Соберите подписанный APK:
   ```bash
   .\gradlew assembleRelease
   ```

### Загрузка в Play Console

1. Зайдите в [Google Play Console](https://play.google.com/console)
2. Создайте приложение
3. Заполните информацию
4. Загрузите APK в разделе "Release"
5. Отправьте на модерацию

---

## 📊 Тестирование перед сборкой

### Чек-лист

- [ ] Все стили modern-ui.css применены
- [ ] Адаптивность работает на всех экранах
- [ ] Кнопки ≥ 44px на мобильном
- [ ] Input не зумится на iOS (16px+)
- [ ] Все разрешения добавлены в AndroidManifest.xml
- [ ] Иконка и splash screen настроены
- [ ] API URL правильный (http://localhost:3001 для dev)
- [ ] Нет ошибок в консоли браузера
- [ ] Capacitor синхронизирован: `npx cap sync`

### Команды перед сборкой

```bash
# 1. Постройте веб-версию
npm run build

# 2. Синхронизируйте с Capacitor
npx cap sync android

# 3. Проверьте что всё ок
npx cap doctor

# 4. Откройте в Android Studio
npx cap open android
```

---

## 🎉 Готово!

После успешной сборки у вас будет:

✅ **app-debug.apk** - Для тестирования (15-25MB)  
✅ **app-release.apk** - Для публикации (10-20MB после оптимизации)

**Установите на телефон и протестируйте!** 📱

---

## 📖 Дополнительная документация

- [Capacitor Android Guide](https://capacitorjs.com/docs/android)
- [Android Studio Setup](https://developer.android.com/studio/intro)
- [Publish to Google Play](https://developer.android.com/distribute/best-practices/launch)
