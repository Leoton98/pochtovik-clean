import React, { useState } from 'react';
import './LoginView.comfortable.css';

// SVG Icons
const Icons = {
  User: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  ),
  Lock: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  ),
  Mail: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
      <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
  )
};

function LoginView({ onLogin, onRegister }) {
  const [view, setView] = useState('login'); // 'login' or 'register'
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await onLogin(userId, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }
    
    if (password.length < 6) {
      setError('Пароль должен быть не менее 6 символов');
      return;
    }
    
    setLoading(true);

    try {
      await onRegister(userId, password, displayName);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Logo */}
        <div className="login-logo">
          <img 
            src="/logo.png" 
            alt="Почтовик"
            className="login-logo-img"
          />
        </div>
        
        <h1 className="login-title">Почтовик</h1>
        
        <p className="login-subtitle">Безопасный мессенджер</p>
        
        {error && (
          <div className="error-message">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {view === 'login' ? (
          <form className="login-form" onSubmit={handleLoginSubmit}>
            <h2>Вход</h2>
            
            <div className="form-group">
              <label className="form-label">Логин</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <Icons.User />
                </span>
                <input
                  type="text"
                  className="login-input"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  required
                  placeholder="alice"
                  autoFocus
                />
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Пароль</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <Icons.Lock />
                </span>
                <input
                  type="password"
                  className="login-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn-primary" 
              disabled={loading}
            >
              {loading ? '⏳ Вход...' : 'Войти →'}
            </button>

            <button 
              type="button" 
              className="btn-secondary" 
              onClick={() => setView('register')}
            >
              Регистрация
            </button>
          </form>
        ) : (
          <form className="login-form" onSubmit={handleRegisterSubmit}>
            <h2>Регистрация</h2>
            
            <div className="form-group">
              <label className="form-label">Логин</label>
              <input
                type="text"
                className="login-input"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
                placeholder="alice"
                style={{ paddingLeft: '14px' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Пароль</label>
              <input
                type="password"
                className="login-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                style={{ paddingLeft: '14px' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Подтверждение пароля</label>
              <input
                type="password"
                className="login-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="••••••••"
                style={{ paddingLeft: '14px' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Никнейм</label>
              <input
                type="text"
                className="login-input"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                placeholder="Alice"
                style={{ paddingLeft: '14px' }}
              />
            </div>

            <button 
              type="submit" 
              className="btn-primary" 
              disabled={loading || !userId}
            >
              {loading ? '⏳ Создание...' : 'Создать аккаунт →'}
            </button>

            <button 
              type="button" 
              className="btn-secondary" 
              onClick={() => setView('login')}
            >
              ← Назад ко входу
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default LoginView;
