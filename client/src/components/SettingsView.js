import React, { useState, useEffect } from 'react';

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

function SettingsView({ user, onBack, onLogout, userAvatar, onAvatarUpload }) {
  const [displayName, setDisplayName] = useState(user.displayName || '');
  const [nameServerUrl, setNameServerUrl] = useState(() => {
    try {
      return localStorage.getItem('nameServerUrl') || user.nameServerUrl || 'http://localhost:3001';
    } catch (e) {
      return 'http://localhost:3001';
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
  
  // Theme colors - support both light and dark
  const theme = {
    bg: darkMode 
      ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
      : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    card: darkMode
      ? 'rgba(255, 255, 255, 0.05)'
      : 'rgba(255, 255, 255, 0.9)',
    text: darkMode ? '#fff' : '#1a1a2e',
    textSecondary: darkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
    border: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
    inputBg: darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)'
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: theme.bg,
      padding: '2rem',
      fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        animation: 'slideUp 0.5s ease'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          padding: '1.5rem 2rem',
          background: theme.card,
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          border: `1px solid ${theme.border}`,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <button
            onClick={onBack}
            style={{
              background: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
              border: 'none',
              color: theme.text,
              padding: '0.75rem 1.25rem',
              borderRadius: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.95rem',
              fontWeight: '600',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = darkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)';
              e.target.style.transform = 'translateX(-4px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
              e.target.style.transform = 'translateX(0)';
            }}
          >
            <Icons.ArrowLeft />
            Назад к чату
          </button>
          
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setDarkMode(!darkMode)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0.75rem',
                borderRadius: '12px',
                color: theme.text,
                transition: 'all 0.2s'
              }}
              title={darkMode ? 'Светлая тема' : 'Тёмная тема'}
            >
              {darkMode ? <Icons.Sun /> : <Icons.Moon />}
            </button>
            <button
              onClick={onLogout}
              style={{
                background: 'rgba(245, 87, 108, 0.8)',
                border: 'none',
                color: '#fff',
                padding: '0.75rem 1.25rem',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontWeight: '600'
              }}
            >
              <Icons.Logout />
              Выход
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div style={{
          background: theme.card,
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '2rem',
          border: `1px solid ${theme.border}`,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '2rem',
            paddingBottom: '1rem',
            borderBottom: `2px solid ${theme.border}`
          }}>
            <Icons.Settings />
            <h2 style={{ 
              margin: 0,
              fontSize: '1.8rem',
              fontWeight: '700',
              color: theme.text
            }}>Настройки</h2>
          </div>

          {/* Account Information */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem',
              marginBottom: '1.5rem',
              paddingBottom: '0.75rem',
              borderBottom: `1px solid ${theme.border}`
            }}>
              <Icons.User />
              <h3 style={{ 
                margin: 0,
                fontSize: '1.3rem',
                fontWeight: '600',
                color: theme.text
              }}>Информация об аккаунте</h3>
            </div>
            
            {/* Avatar Upload */}
            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
              <label style={{
                display: 'inline-block',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
              }}
              >
                {userAvatar ? (
                  <img 
                    src={userAvatar} 
                    alt="Avatar"
                    style={{
                      width: '120px',
                      height: '120px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                      border: `4px solid ${darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`
                    }}
                  />
                ) : (
                  <div style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '3rem',
                    fontWeight: '700',
                    color: '#fff',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                    border: `4px solid ${darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`
                  }}>
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
              <p style={{
                marginTop: '1rem',
                color: theme.textSecondary,
                fontSize: '0.85rem'
              }}>
                Нажмите чтобы изменить аватарку
              </p>
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                color: theme.textSecondary,
                fontSize: '0.9rem',
                fontWeight: '500'
              }}>User ID</label>
              <div style={{ 
                padding: '0.75rem', 
                background: theme.inputBg, 
                borderRadius: '8px',
                fontFamily: 'monospace',
                fontSize: '0.95rem',
                color: theme.text
              }}>
                {user.userId}
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                color: theme.textSecondary,
                fontSize: '0.9rem',
                fontWeight: '500'
              }}>Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Введите ваше имя"
                style={{ 
                  width: '100%',
                  padding: '0.75rem',
                  background: theme.inputBg,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '8px',
                  color: theme.text,
                  fontSize: '0.95rem'
                }}
              />
            </div>

            <button 
              onClick={() => alert('Сохранение не реализовано')} 
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                fontSize: '0.95rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              Сохранить изменения
            </button>
          </div>

          {/* Connection Info */}
          <div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem',
              marginBottom: '1.5rem',
              paddingBottom: '0.75rem',
              borderBottom: `1px solid ${theme.border}`
            }}>
              <Icons.Server />
              <h3 style={{ 
                margin: 0,
                fontSize: '1.3rem',
                fontWeight: '600',
                color: theme.text
              }}>Подключение</h3>
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                color: theme.textSecondary,
                fontSize: '0.9rem',
                fontWeight: '500'
              }}>Name Server URL</label>
              <div style={{ 
                display: 'flex',
                gap: '0.5rem',
                alignItems: 'center'
              }}>
                <input
                  type="text"
                  value={nameServerUrl}
                  onChange={(e) => setNameServerUrl(e.target.value)}
                  placeholder="http://localhost:3001"
                  style={{ 
                    flex: 1,
                    padding: '0.75rem',
                    background: theme.inputBg,
                    border: `1px solid ${connectionStatus === 'error' ? '#f5576c' : theme.border}`,
                    borderRadius: '8px',
                    color: theme.text,
                    fontSize: '0.85rem',
                    fontFamily: 'monospace',
                    outline: 'none',
                    transition: 'all 0.2s'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = darkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = connectionStatus === 'error' ? '#f5576c' : theme.border;
                  }}
                />
                <button
                  onClick={checkConnection}
                  disabled={connectionStatus === 'checking'}
                  style={{
                    padding: '0.75rem 1.25rem',
                    background: connectionStatus === 'connected' 
                      ? '#4caf50' 
                      : connectionStatus === 'error'
                      ? '#f5576c'
                      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: connectionStatus === 'checking' ? 'not-allowed' : 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    opacity: connectionStatus === 'checking' ? 0.7 : 1,
                    transition: 'all 0.2s',
                    minWidth: '120px'
                  }}
                >
                  {connectionStatus === 'checking' ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="animate-spin">
                        <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/>
                      </svg>
                      Проверка...
                    </span>
                  ) : connectionStatus === 'connected' ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Подключено
                    </span>
                  ) : connectionStatus === 'error' ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
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
              <p style={{
                marginTop: '0.5rem',
                color: theme.textSecondary,
                fontSize: '0.8rem'
              }}>
                Введите адрес сервера для подключения из другой сети
              </p>
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                color: theme.textSecondary,
                fontSize: '0.9rem'
              }}>Yandex Cloud Bucket</label>
              <div style={{ 
                padding: '0.75rem', 
                background: theme.inputBg, 
                borderRadius: '8px',
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                color: theme.text
              }}>
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
