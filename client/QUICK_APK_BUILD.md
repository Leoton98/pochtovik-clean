# ⚡ Экстренная инструкция по сборке APK

## 🚨 Проблема
Для сборки APK через командную строку требуется **Java (JDK)**.

## ✅ Решение 1: Android Studio (Самый простой способ)

### Просто сделайте это:

1. **Откройте Android Studio**
   ```bash
   cd ..
   npm run cap:open
   ```

2. **В Android Studio:**
   - Дождитесь завершения индексации (полоса загрузки внизу)
   - Нажмите **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
   - Готово! ✅

3. **Найдите APK:**
   - Внизу будет ссылка "app-debug.apk generated"
   - Нажмите на неё
   - Файл откроется в проводнике

**Время**: ~5-10 минут (первый раз)

---

## 💻 Решение 2: Установка JDK для командной строки

### Шаг 1: Установите JDK

**Вариант A: Через Android Studio**
1. Откройте Android Studio
2. **Tools** → **SDK Manager**
3. **SDK Tools** → Отметьте **Android SDK Build-Tools**
4. Нажмите **Apply**

**Вариант B: Отдельная установка**
1. Скачайте: https://adoptium.net/temurin/releases/
2. Выберите **JDK 17** для Windows
3. Установите

### Шаг 2: Настройте JAVA_HOME

```powershell
# Найдите Java (после установки)
where java

# Если нашли, установите JAVA_HOME
[System.Environment]::SetEnvironmentVariable("JAVA_HOME", (where java)[0].Replace("\bin\java.exe", ""), "User")

# Перезапустите терминал!
```

### Шаг 3: Соберите APK

```bash
cd client\android
.\gradlew assembleDebug
```

**Время**: ~15-20 минут (с установкой JDK)

---

## 🎯 Что уже готово

✅ React приложение собрано в папке `build/`  
✅ Capacitor синхронизирован с Android  
✅ Android проект готов в папке `android/`  

Осталось только скомпилировать APK через Gradle!

---

## 📍 Где будет APK

После сборки:
```
client/android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 💡 Совет

Если вам нужно быстро протестировать приложение - **просто используйте Android Studio**. Это самый быстрый и надежный способ!

Откройте:
```bash
npm run cap:open
```

Затем нажмите зеленую кнопку **Run** (▶️) - приложение запустится в эмуляторе без необходимости собирать APK вручную!

---

**Нужна помощь?** См. [BUILD_APK_INSTRUCTIONS.md](./BUILD_APK_INSTRUCTIONS.md)
