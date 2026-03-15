import React, { useState } from 'react';
import '../styles/modern-ui.css';

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
    <div style={{ 
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '1.5rem',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    }}>
      <div className="login-card" style={{
        maxWidth: '420px',
        width: '100%',
        padding: '2rem',
        background: 'rgba(255, 255, 255, 0.98)',
        borderRadius: '24px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        animation: 'slideUp 0.5s ease'
      }}>
        {/* Logo */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '2rem',
          marginTop: '1rem'
        }}>
          <img 
            src="/logo.png" 
            alt="Почтовик"
            style={{
              width: '120px',
              height: '120px',
              objectFit: 'contain',
              filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15))'
            }}
          />
        </div>
        
        <h1 style={{
          textAlign: 'center',
          fontSize: '28px',
          fontWeight: '800',
          color: '#1a1a2e',
          marginBottom: '0.5rem',
          letterSpacing: '-0.5px'
        }}>Почтовик</h1>
        
        <p style={{
          textAlign: 'center',
          color: '#6b7280',
          fontSize: '15px',
          marginBottom: '2rem'
        }}>
          Безопасный мессенджер
        </p>
        
        {error && (
          <div style={{ 
            backgroundColor: '#fee2e2',
            padding: '1rem',
            borderRadius: '12px',
            marginBottom: '1.5rem',
            color: '#dc2626',
            fontWeight: '500',
            border: '1px solid #fecaca',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {view === 'login' ? (
          <form onSubmit={handleLoginSubmit}>
            <h2 style={{ 
              marginBottom: '1.5rem',
              fontSize: '22px',
              textAlign: 'center',
              fontWeight: '700',
              color: '#1f2937'
            }}>Вход</h2>
            
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem',
                fontWeight: '600',
                fontSize: '14px',
                color: '#374151'
              }}>Логин</label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <Icons.User />
                </span>
                <input
                  type="text"
                  className="input-modern"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  required
                  placeholder="alice"
                  autoFocus
                  style={{ 
                    width: '100%',
                    padding: '14px 14px 14px 44px',
                    fontSize: '16px',
                    borderRadius: '12px',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    outline: 'none',
                    transition: 'all 0.2s',
                    boxSizing: 'border-box',
                    background: 'rgba(255, 255, 255, 0.9)',
                    color: '#1f2937'
                  }}
                />
              </div>
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem',
                fontWeight: '600',
                fontSize: '14px',
                color: '#374151'
              }}>Пароль</label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <Icons.Lock />
                </span>
                <input
                  type="password"
                  className="input-modern"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  style={{ 
                    width: '100%',
                    padding: '14px 14px 14px 44px',
                    fontSize: '16px',
                    borderRadius: '12px',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    outline: 'none',
                    transition: 'all 0.2s',
                    boxSizing: 'border-box',
                    background: 'rgba(255, 255, 255, 0.9)',
                    color: '#1f2937'
                  }}
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn-primary-modern" 
              disabled={loading}
              style={{ 
                width: '100%',
                marginBottom: '1rem',
                padding: '16px',
                fontSize: '16px',
                fontWeight: '700',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                transition: 'all 0.2s',
                boxShadow: '0 4px 14px rgba(102, 126, 234, 0.4)'
              }}
            >
              {loading ? '⏳ Вход...' : 'Войти →'}
            </button>

            <button 
              type="button" 
              className="btn-secondary-modern" 
              onClick={() => setView('register')}
              style={{ 
                width: '100%',
                padding: '14px',
                fontWeight: '600',
                fontSize: '15px',
                borderRadius: '12px',
                background: '#f3f4f6',
                color: '#374151',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Регистрация
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit}>
            <h2 style={{ 
              marginBottom: '1.5rem',
              fontSize: '22px',
              textAlign: 'center',
              fontWeight: '700',
              color: '#1f2937'
            }}>Регистрация</h2>
            
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem',
                fontWeight: '600',
                fontSize: '14px',
                color: '#374151'
              }}>Логин</label>
              <input
                type="text"
                className="input-modern"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
                placeholder="alice"
                style={{ 
                  width: '100%',
                  padding: '14px',
                  fontSize: '16px',
                  borderRadius: '12px',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  outline: 'none',
                  transition: 'all 0.2s',
                  boxSizing: 'border-box',
                  background: 'rgba(255, 255, 255, 0.9)',
                  color: '#1f2937'
                }}
              />
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem',
                fontWeight: '600',
                fontSize: '14px',
                color: '#374151'
              }}>Пароль</label>
              <input
                type="password"
                className="input-modern"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                style={{ 
                  width: '100%',
                  padding: '14px',
                  fontSize: '16px',
                  borderRadius: '12px',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  outline: 'none',
                  transition: 'all 0.2s',
                  boxSizing: 'border-box',
                  background: 'rgba(255, 255, 255, 0.9)',
                  color: '#1f2937'
                }}
              />
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem',
                fontWeight: '600',
                fontSize: '14px',
                color: '#374151'
              }}>Подтверждение пароля</label>
              <input
                type="password"
                className="input-modern"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="••••••••"
                style={{ 
                  width: '100%',
                  padding: '14px',
                  fontSize: '16px',
                  borderRadius: '12px',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  outline: 'none',
                  transition: 'all 0.2s',
                  boxSizing: 'border-box',
                  background: 'rgba(255, 255, 255, 0.9)',
                  color: '#1f2937'
                }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem',
                fontWeight: '600',
                fontSize: '14px',
                color: '#374151'
              }}>Никнейм</label>
              <input
                type="text"
                className="input-modern"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                placeholder="Alice"
                style={{ 
                  width: '100%',
                  padding: '14px',
                  fontSize: '16px',
                  borderRadius: '12px',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  outline: 'none',
                  transition: 'all 0.2s',
                  boxSizing: 'border-box',
                  background: 'rgba(255, 255, 255, 0.9)',
                  color: '#1f2937'
                }}
              />
            </div>

            <button 
              type="submit" 
              className="btn-primary-modern" 
              disabled={loading || !userId}
              style={{ 
                width: '100%',
                marginBottom: '1rem',
                padding: '16px',
                fontSize: '16px',
                fontWeight: '700',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                transition: 'all 0.2s',
                boxShadow: '0 4px 14px rgba(102, 126, 234, 0.4)'
              }}
            >
              {loading ? '⏳ Создание...' : 'Создать аккаунт →'}
            </button>

            <button 
              type="button" 
              className="btn-secondary-modern" 
              onClick={() => setView('login')}
              style={{ 
                width: '100%',
                padding: '14px',
                fontWeight: '600',
                fontSize: '15px',
                borderRadius: '12px',
                background: '#f3f4f6',
                color: '#374151',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
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
