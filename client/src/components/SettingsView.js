import React, { useState, useEffect } from 'react';
import './SettingsView.comfortable.css';

// SVG Icons
const Icons = {
  User: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  ),
  ArrowLeft: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="19" y1="12" x2="5" y2="12"></line>
      <polyline points="12 19 5 12 12 5"></polyline>
    </svg>
  ),
  Settings: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3"></circle>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
    </svg>
  ),
  Server: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="2" y1="12" x2="22" y2="12"></line>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
    </svg>
  ),
  Sun: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="5"></circle>
      <line x1="12" y1="1" x2="12" y2="3"></line>
      <line x1="12" y1="21" x2="12" y2="23"></line>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
      <line x1="1" y1="12" x2="3" y2="12"></line>
      <line x1="21" y1="12" x2="23" y2="12"></line>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>
  ),
  Moon: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>
  ),
  Logout: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
      <polyline points="16 17 21 12 16 7"></polyline>
      <line x1="21" y1="12" x2="9" y2="12"></line>
    </svg>
  )
};

function SettingsView({ user, onBack, onLogout, userAvatar, onAvatarUpload, apiService, onOpenDevices }) {
  const [displayName, setDisplayName] = useState(user.displayName || '');
  const [nameServerUrl, setNameServerUrl] = useState(() => {
    try {
      return localStorage.getItem('nameServerUrl') || user.nameServerUrl || 'https://pochtovik-name-server.onrender.com';
    } catch (e) {
      return 'https://pochtovik-name-server.onrender.com';
    }
  });
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const savedTheme = localStorage.getItem('theme');
      return savedTheme ? JSON.parse(savedTheme) : true;
    } catch (e) {
      return true;
    }
  });
  const [connectionStatus, setConnectionStatus] = useState(null); // 'checking', 'connected', 'error'
  
  // Handle avatar file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onAvatarUpload(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Check server connection
  const checkConnection = async () => {
    setConnectionStatus('checking');
    try {
      const response = await fetch(`${nameServerUrl}/health`);
      if (response.ok) {
        setConnectionStatus('connected');
        localStorage.setItem('nameServerUrl', nameServerUrl);
        setTimeout(() => setConnectionStatus(null), 3000);
      } else {
        setConnectionStatus('error');
      }
    } catch (error) {
      setConnectionStatus('error');
      console.error('Connection error:', error);
    }
  };
  
  // Save theme to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('theme', JSON.stringify(darkMode));
    } catch (e) {
      console.error('Failed to save theme:', e);
    }
  }, [darkMode]);

  return (
    <div className={`settings-container ${darkMode ? '' : 'light-theme'}`}>
      <div className="settings-content">
        {/* Header */}
        <div className="settings-header">
          <button className="btn-back" onClick={onBack}>
            <Icons.ArrowLeft />
            Назад к чату
          </button>
          
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              className="btn-icon"
              onClick={() => setDarkMode(!darkMode)}
              title={darkMode ? 'Светлая тема' : 'Тёмная тема'}
            >
              {darkMode ? <Icons.Sun /> : <Icons.Moon />}
            </button>
            <button
              className="btn-logout"
              onClick={onLogout}
            >
              <Icons.Logout />
              Выход
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="settings-card">
          <div className="settings-title-wrapper">
            <Icons.Settings />
            <h2 className="settings-title">Настройки</h2>
          </div>

          {/* Devices Management Button */}
          {onOpenDevices && (
            <button className="btn-devices" onClick={onOpenDevices}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                <line x1="12" y1="18" x2="12.01" y2="18"></line>
              </svg>
              Управление устройствами
            </button>
          )}

          {/* Account Information */}
          <div className="section">
            <div className="section-title-wrapper">
              <Icons.User />
              <h3 className="section-title">Информация об аккаунте</h3>
            </div>
            
            {/* Avatar Upload */}
            <div className="avatar-upload">
              <label className="avatar-label">
                {userAvatar ? (
                  <img 
                    src={userAvatar} 
                    alt="Avatar"
                    className="avatar-img"
                  />
                ) : (
                  <div className="avatar-placeholder">
                    {(user.displayName || user.userId).charAt(0).toUpperCase()}
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </label>
              <p className="avatar-hint">
                Нажмите чтобы изменить аватарку
              </p>
            </div>
            
            <div className="form-field">
              <label className="form-label">User ID</label>
              <div className="form-value">
                {user.userId}
              </div>
            </div>

            <div className="form-field">
              <label className="form-label">Display Name</label>
              <input
                type="text"
                className="form-input"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Введите ваше имя"
              />
            </div>

            <button className="btn-save" onClick={() => alert('Сохранение не реализовано')}>
              Сохранить изменения
            </button>
          </div>

          {/* Connection Info */}
          <div className="section">
            <div className="section-title-wrapper">
              <Icons.Server />
              <h3 className="section-title">Подключение</h3>
            </div>
            
            <div className="form-field">
              <label className="form-label">Name Server URL</label>
              <div className="connection-wrapper">
                <input
                  type="text"
                  className={`connection-input ${connectionStatus === 'error' ? 'error' : ''}`}
                  value={nameServerUrl}
                  onChange={(e) => setNameServerUrl(e.target.value)}
                  placeholder="https://pochtovik-name-server.onrender.com"
                />
                <button
                  className={`btn-check ${connectionStatus === 'connected' ? 'connected' : ''} ${connectionStatus === 'error' ? 'error' : ''}`}
                  onClick={checkConnection}
                  disabled={connectionStatus === 'checking'}
                >
                  {connectionStatus === 'checking' ? (
                    <span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="animate-spin">
                        <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/>
                      </svg>
                      Проверка...
                    </span>
                  ) : connectionStatus === 'connected' ? (
                    <span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Подключено
                    </span>
                  ) : connectionStatus === 'error' ? (
                    <span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                      Ошибка
                    </span>
                  ) : (
                    'Проверить'
                  )}
                </button>
              </div>
              <p className="field-hint">
                Введите адрес сервера для подключения из другой сети
              </p>
            </div>

            <div className="form-field">
              <label className="form-label">Yandex Cloud Bucket</label>
              <div className="form-value">
                {user.bucket || 'Не настроено'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsView;
