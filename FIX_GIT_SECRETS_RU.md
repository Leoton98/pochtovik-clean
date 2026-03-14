# 🔒 Очистка секретов из истории Git

## Проблема
Секреты уже закоммичены в историю Git. GitHub Secret Scanning блокирует пуш.

## Решение 1: Разрешить секреты (БЫСТРЕЕ)

Если это ваши личные ключи и вы доверяете репозиторию:

1. Перейдите по ссылке из ошибки:
   ```
   https://github.com/Leoton98/pochtovik/security/secret-scanning/unblock-secret/3Aw9KHhWOF9povondxMN5KhrcI
   ```

2. Нажмите **"Allow this secret"**

3. Сделайте push снова:
   ```powershell
   git push -u origin main
   ```

---

## Решение 2: Полная очистка истории (ПРАВИЛЬНЕЕ)

### Шаг 1: Удалите cloudflared.exe из истории
```powershell
# BFG Repo-Cleaner (быстрее)
# Скачайте: https://rtyley.github.io/bfg-repo-cleaner/
java -jar bfg.jar --delete-files cloudflared.exe repo.git
```

### Шаг 2: Измените последние коммиты
```powershell
# Отмените последний коммит, сохраняя изменения
git reset --soft HEAD~1

# Перекоммитьте
git commit -m "Remove secrets and large binaries"

# Force push
git push -f origin main
```

### Шаг 3: Если нужно очистить глубже
```powershell
# Используйте git filter-branch
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch cloudflared.exe" \
  --prune-empty --tag-name-filter cat -- --all

# Force push
git push -f origin main
```

---

## Решение 3: Создать новый чистый репозиторий

### 1. Удалите репозиторий на GitHub
https://github.com/Leoton98/pochtovik/settings → Delete this repository

### 2. Очистите локальную историю
```powershell
cd C:\Users\pkleontev\Documents\pochtovik-mobile\Pochtovik

# Удалите .git
Remove-Item -Recurse -Force .git

# Инициализируйте заново
git init
git add .
git commit -m "Initial commit - clean version"
```

### 3. Создайте новый репозиторий
1. https://github.com/new
2. Название: `pochtovik`
3. Скопируйте URL

### 4. Отправьте код
```powershell
git remote add origin https://github.com/Leoton98/pochtovik.git
git branch -M main
git push -u origin main
```

---

## ✅ Рекомендация

**Используйте Решение 1** (разрешить секреты через GitHub UI) - это быстрее всего!

Затем продолжите развёртывание на Render.
