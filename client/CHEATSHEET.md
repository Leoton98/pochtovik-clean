# 📋 Шпаргалка по запуску Android версии

## ⚡ Одна команда для сборки и синхронизации

```bash
cd client && npm run android:build
```

## 🚀 Открыть в Android Studio

```bash
npm run cap:open
```

## 📱 Тестирование на устройстве

1. Включите **Режим разработчика** на Android
2. Включите **Отладку по USB**
3. Подключите устройство к ПК
4. В Android Studio выберите устройство и нажмите **Run**

## 🎮 Эмулятор

1. В Android Studio: **Tools** → **Device Manager**
2. Создайте новое устройство (рекомендуется Pixel с Android 10+)
3. Нажмите ▶️ для запуска

## 🔧 Если что-то пошло не так

### Ошибка сборки
```bash
# Очистить кэш
Remove-Item -Recurse -Force node_modules\.cache -ErrorAction SilentlyContinue

# Пересобрать
npm run build
npm run cap:sync
```

### Порт занят
```powershell
# Освободить порт 3000
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue).OwningProcess | Stop-Process -Force
```

### Проблемы с Android SDK
```bash
# Проверить установку
npx cap doctor
```

## 📦 Готовый APK

После сборки в Android Studio:
- **Debug APK**: `android/app/build/outputs/apk/debug/app-debug.apk`
- **Release APK**: Требует подписывания

## 💻 Команды для разработки

| Задача | Команда |
|--------|---------|
| Сборка web | `npm run build` |
| Синхронизация | `npm run cap:sync` |
| Открыть AS | `npm run cap:open` |
| Полная сборка | `npm run android:build` |
| Докторинг | `npx cap doctor` |

## 🎯 Чеклист перед запуском

- [ ] Android Studio установлен
- [ ] Android SDK настроен
- [ ] Эмулятор или устройство готово
- [ ] Сборка прошла без ошибок
- [ ] Приложение запускается
- [ ] Базовая функциональность работает

---

**Удачи! 🚀**
