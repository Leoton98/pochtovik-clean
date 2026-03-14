import React, { useState } from 'react';

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
      background: 'linear-gradient(135deg, hsla(251, 67%, 33%, 1.00) 0%, #764ba2 100%)',
      padding: '2rem',
      fontFamily: "'Inter', sans-serif"
    }}>
      <div className="card" style={{
        maxWidth: '450px',
        width: '100%',
        padding: '3rem',
        animation: 'slideUp 0.5s ease'
      }}>
        {/* Logo */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '3rem'
        }}>
          <img 
            src="/logo.png" 
            alt="Почтовик Logo"
            style={{
              width: '360px',
              height: '360px',
              objectFit: 'contain',
              filter: 'drop-shadow(0 8px 24px rgba(0, 0, 0, 0.5))'
            }}
          />
        </div>
        
        
        {error && (
          <div style={{ 
            backgroundColor: 'rgba(245, 87, 108, 0.9)',
            backdropFilter: 'blur(10px)',
            padding: '1rem 1.25rem',
            borderRadius: '12px',
            marginBottom: '1.5rem',
            color: 'white',
            fontWeight: '500',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 4px 16px rgba(245, 87, 108, 0.3)'
          }}>
            ⚠️ {error}
          </div>
        )}

        {view === 'login' ? (
          <form onSubmit={handleLoginSubmit}>
            <h2 style={{ 
              marginBottom: '1rem',
              fontSize: '2rem',
              textAlign: 'center',
              fontWeight: '700'
            }}> Вход</h2>
            
            <p style={{ 
              textAlign: 'center',
              color: '#aaa',
              marginBottom: '2rem',
              fontSize: '0.95rem'
            }}>
              Введите логин и пароль
            </p>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.75rem',
                fontWeight: '600',
                fontSize: '1rem'
              }}>Логин</label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#aaa'
                }}>
                  <Icons.User />
                </span>
                <input
                  type="text"
                  className="input"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  required
                  placeholder="alice"
                  autoFocus
                  style={{ 
                    width: '100%',
                    padding: '1.25rem 1.25rem 1.25rem 3rem',
                    fontSize: '1.1rem'
                  }}
                />
              </div>
            </div>
            
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.75rem',
                fontWeight: '600',
                fontSize: '1rem'
              }}>Пароль</label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#aaa'
                }}>
                  <Icons.Lock />
                </span>
                <input
                  type="password"
                  className="input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  style={{ 
                    width: '100%',
                    padding: '1.25rem 1.25rem 1.25rem 3rem',
                    fontSize: '1.1rem'
                  }}
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={loading}
              style={{ 
                width: '100%',
                marginBottom: '1rem',
                padding: '1.25rem',
                fontSize: '1.1rem',
                fontWeight: '700'
              }}
            >
              {loading ? '⏳ Вход...' : 'Войти'}
            </button>

            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={() => setView('register')}
              style={{ 
                width: '100%',
                padding: '1rem',
                fontWeight: '600'
              }}
            >
              Регистрация
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit}>
            <h2 style={{ 
              marginBottom: '1rem',
              fontSize: '2rem',
              textAlign: 'center',
              fontWeight: '700'
            }}>Регистрация</h2>
            
            <p style={{ 
              textAlign: 'center',
              color: '#aaa',
              marginBottom: '2rem',
              fontSize: '0.95rem'
            }}>
              Придумайте логин и пароль
            </p>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.75rem',
                fontWeight: '600',
                fontSize: '0.95rem'
              }}>Логин</label>
              <input
                type="text"
                className="input"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
                placeholder="alice"
                style={{ 
                  width: '100%',
                  padding: '1rem 1.25rem'
                }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.75rem',
                fontWeight: '600',
                fontSize: '0.95rem'
              }}>Пароль</label>
              <input
                type="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                style={{ 
                  width: '100%',
                  padding: '1rem 1.25rem'
                }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.75rem',
                fontWeight: '600',
                fontSize: '0.95rem'
              }}>Подтверждение пароля</label>
              <input
                type="password"
                className="input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="••••••••"
                style={{ 
                  width: '100%',
                  padding: '1rem 1.25rem'
                }}
              />
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.75rem',
                fontWeight: '600',
                fontSize: '0.95rem'
              }}>Никнейм</label>
              <input
                type="text"
                className="input"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                placeholder="Alice"
                style={{ 
                  width: '100%',
                  padding: '1rem 1.25rem'
                }}
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={loading || !userId}
              style={{ 
                width: '100%',
                marginBottom: '1rem',
                padding: '1.25rem',
                fontSize: '1.1rem',
                fontWeight: '700'
              }}
            >
              {loading ? 'Регистрация...' : 'Создать аккаунт'}
            </button>

            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={() => setView('login')}
              style={{ 
                width: '100%',
                padding: '1rem',
                fontWeight: '600'
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
