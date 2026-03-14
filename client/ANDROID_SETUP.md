# Инструкция по запуску Android приложения на Capacitor

## ✅ Что уже сделано:

1. Установлен Capacitor и зависимости
2. Создан Android проект в папке `client/android`
3. Настроен capacitor.config.ts
4. Добавлены скрипты в package.json

## 📋 Требования:

### 1. Android Studio (обязательно)
- Скачайте и установите: https://developer.android.com/studio
- Установите Android SDK через Android Studio
- Минимальная версия Android: API 22 (Android 5.1)

### 2. Настройка переменных окружения
```powershell
# Добавьте в системные переменные:
ANDROID_HOME = C:\Users\ВАШЕ_ИМЯ\AppData\Local\Android\Sdk
```

## 🚀 Запуск приложения:

### Шаг 1: Сборка React приложения
```bash
cd client
npm run build
```

### Шаг 2: Синхронизация с Capacitor
```bash
npm run cap:sync
```

### Шаг 3: Открытие Android Studio
```bash
npm run cap:open
```

### Шаг 4: Запуск в эмуляторе или на устройстве
В Android Studio:
1. Откройте проект `client/android`
2. Создайте виртуальное устройство (AVD) или подключите реальное устройство
3. Нажмите кнопку "Run" (зеленый треугольник)

## 🔧 Быстрый запуск (если настроен):
```bash
npm run android:build
npm run cap:run
```

## 📱 Тестирование на реальном устройстве:

1. Включите "Режим разработчика" на Android устройстве
2. Включите "Отладка по USB"
3. Подключите устройство к компьютеру
4. Разрешите отладку на устройстве
5. Запустите через Android Studio

## ⚙️ Конфигурация:

### Изменение Package ID
Если хотите использовать свой домен:
```bash
npx cap setPackageName com.yourdomain.pochtovik
```

### Обновление версии Android
Минимальная версия задается в `android/app/build.gradle`:
```gradle
minSdkVersion 22
targetSdkVersion 34
```

## 🐛 Возможные проблемы:

### Ошибка: "SDK not found"
- Убедитесь, что Android Studio установлен
- Проверьте переменную окружения ANDROID_HOME
- Установите Android SDK Platform Tools

### Ошибка: "Build directory missing"
- Выполните `npm run build` перед синхронизацией
- Затем `npm run cap:sync`

### Эмулятор не запускается
- Включите виртуализацию в BIOS
- Выделите больше RAM для эмулятора
- Используйте x86 образ системы для лучшей производительности

## 📦 Создание APK файла:

В Android Studio:
1. Build → Build Bundle(s) / APK(s) → Build APK(s)
2. APK файл будет в: `android/app/build/outputs/apk/debug/`

## 🎯 Следующие шаги:

1. Протестировать базовую функциональность
2. Добавить нативные плагины при необходимости:
   - Камера
   - Файловая система
   - Push уведомления
   - Биометрия
3. Настроить подписывание приложения для релиза
4. Оптимизировать производительность

## 🔗 Полезные ссылки:

- Документация Capacitor: https://capacitorjs.com/docs
- Android разработка: https://developer.android.com/guide
- Плагины Capacitor: https://capacitorjs.com/docs/plugins
