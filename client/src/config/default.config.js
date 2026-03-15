// Конфигурация Yandex Cloud Storage по умолчанию
// Эти значения используются автоматически для всех пользователей
// При регистрации новый пользователь получает эти настройки
// ВАЖНО: Для production используйте переменные окружения REACT_APP_*

module.exports = {
  // Название бакета (основной бакет для всех пользователей)
  bucket: 'pochtovik-bucket',
  
  // Access Key ID (создаётся в Yandex Cloud Console)
  // Приоритет: 1) ENV, 2) hardcoded value (только для разработки!)
  accessKeyId: process.env.REACT_APP_YANDEX_ACCESS_KEY_ID || 'YOUR_ACCESS_KEY_ID',
  
  // Secret Access Key (создаётся в Yandex Cloud Console)
  secretAccessKey: process.env.REACT_APP_YANDEX_SECRET_ACCESS_KEY || 'YOUR_SECRET_ACCESS_KEY',
  
  // Endpoint Yandex Object Storage
  endpoint: 'https://storage.yandexcloud.net',
  
  // Регион
  region: 'ru-central1'
};
