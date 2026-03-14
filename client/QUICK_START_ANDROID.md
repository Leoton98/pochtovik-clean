# 🚀 Быстрый старт для Android

## ✅ Готово

- Capacitor настроен
- Android проект создан в папке `android/`
- Сборка работает успешно

## 📱 Запуск приложения

### 1. Собрать веб-приложение
```bash
cd client
npm run build
```

### 2. Синхронизировать с Android
```bash
npm run cap:sync
```

### 3. Открыть в Android Studio
```bash
npm run cap:open
```

### 4. Запустить в эмуляторе или на устройстве
В Android Studio нажмите **Run** (зеленый треугольник)

## 🔧 Команды

| Команда | Описание |
|---------|----------|
| `npm run build` | Сборка React приложения |
| `npm run cap:sync` | Синхронизация с Android |
| `npm run cap:open` | Открыть Android Studio |
| `npm run android:build` | Полная сборка для Android |

## 📦 Создание APK

В Android Studio:
1. **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
2. APK будет в: `android/app/build/outputs/apk/debug/`

## ⚙️ Требования

- **Android Studio**: https://developer.android.com/studio
- **Android SDK**: Устанавливается через Android Studio
- **Минимальная версия**: Android 5.1 (API 22)

## 🎯 Что дальше?

1. Протестировать приложение на эмуляторе
2. Протестировать на реальном устройстве
3. Добавить нативные плагины при необходимости
4. Оптимизировать для продакшена

## 📖 Полная документация

Смотрите [ANDROID_SETUP.md](./ANDROID_SETUP.md) для подробной инструкции.
