// Конфигурация Yandex Cloud Storage по умолчанию
// Эти значения используются автоматически для всех пользователей
// При регистрации новый пользователь получает эти настройки

module.exports = {
  // Название бакета (основной бакет для всех пользователей)
  bucket: 'pochtovik-bucket',
  
  // Access Key ID (создаётся в Yandex Cloud Console)
  accessKeyId: 'YOUR_YANDEX_ACCESS_KEY_ID', // Замените на ваш ключ
  
  // Secret Access Key (создаётся в Yandex Cloud Console)
  secretAccessKey: 'YOUR_YANDEX_SECRET_ACCESS_KEY', // Замените на ваш секретный ключ
  
  // Endpoint Yandex Object Storage
  endpoint: 'https://storage.yandexcloud.net',
  
  // Регион
  region: 'ru-central1'
};
