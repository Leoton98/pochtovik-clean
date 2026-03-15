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
  ),
  Eye: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  ),
  EyeOff: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
      <line x1="1" y1="1" x2="23" y2="23"></line>
    </svg>
  )
};

function LoginView({ onLogin, onRegister }) {
  const [view, setView] = useState('login');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="login-container" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '1rem',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background Elements */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '-10%',
        width: '40%',
        height: '40%',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '50%',
        animation: 'float 6s ease-in-out infinite',
        filter: 'blur(60px)'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        right: '-10%',
        width: '40%',
        height: '40%',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '50%',
        animation: 'float 8s ease-in-out infinite reverse',
        filter: 'blur(60px)'
      }} />

      <div className="login-card animate-scale-in" style={{
        maxWidth: '440px',
        width: '100%',
        padding: '2.5rem',
        background: 'rgba(255, 255, 255, 0.98)',
        borderRadius: '24px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Logo */}
        <div style={{
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          <div style={{
            width: '100px',
            height: '100px',
            margin: '0 auto 1.5rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
            animation: 'float 3s ease-in-out infinite'
          }}>
            <span style={{ fontSize: '3rem' }}>📧</span>
          </div>
          
          <h1 style={{
            fontSize: '32px',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '0.5rem',
            letterSpacing: '-1px'
          }}>
            Почтовик
          </h1>
          
          <p style={{
            color: '#6b7280',
            fontSize: '15px',
            fontWeight: '500'
          }}>
            Безопасный мессенджер
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="animate-slide-up" style={{
            backgroundColor: '#fee2e2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            padding: '1rem',
            borderRadius: '12px',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontSize: '14px'
          }}>
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {view === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="animate-fade-in">
            <h2 style={{
              marginBottom: '1.5rem',
              fontSize: '24px',
              textAlign: 'center',
              fontWeight: '700',
              color: '#1f2937'
            }}>
              С возвращением! 👋
            </h2>
            
            {/* User ID Input */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '600',
                fontSize: '14px',
                color: '#374151'
              }}>
                Логин
              </label>
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
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
            
            {/* Password Input */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '600',
                fontSize: '14px',
                color: '#374151'
              }}>
                Пароль
              </label>
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
                  type={showPassword ? 'text' : 'password'}
                  className="input-modern"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '14px 50px 14px 44px',
                    boxSizing: 'border-box'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#9ca3af',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '4px'
                  }}
                >
                  {showPassword ? <Icons.EyeOff /> : <Icons.Eye />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn-primary-modern"
              disabled={loading}
              style={{
                width: '100%',
                marginBottom: '1rem'
              }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <span className="loading-spinner" style={{ width: '16px', height: '16px' }}></span>
                  Вход...
                </span>
              ) : (
                'Войти →'
              )}
            </button>

            {/* Switch to Register */}
            <button
              type="button"
              className="btn-secondary-modern"
              onClick={() => setView('register')}
              style={{
                width: '100%',
                color: '#6b7280',
                borderColor: '#e5e7eb'
              }}
            >
              Нет аккаунта? Зарегистрироваться
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="animate-fade-in">
            <h2 style={{
              marginBottom: '1.5rem',
              fontSize: '24px',
              textAlign: 'center',
              fontWeight: '700',
              color: '#1f2937'
            }}>
              Создание аккаунта 🎉
            </h2>
            
            {/* Display Name */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '600',
                fontSize: '14px',
                color: '#374151'
              }}>
                Никнейм
              </label>
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
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                  placeholder="Alice"
                  style={{
                    width: '100%',
                    padding: '14px 14px 14px 44px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* User ID */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '600',
                fontSize: '14px',
                color: '#374151'
              }}>
                Логин
              </label>
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
                  <Icons.Mail />
                </span>
                <input
                  type="text"
                  className="input-modern"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  required
                  placeholder="alice"
                  style={{
                    width: '100%',
                    padding: '14px 14px 14px 44px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '600',
                fontSize: '14px',
                color: '#374151'
              }}>
                Пароль
              </label>
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
                  type={showPassword ? 'text' : 'password'}
                  className="input-modern"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '14px 50px 14px 44px',
                    boxSizing: 'border-box'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#9ca3af',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '4px'
                  }}
                >
                  {showPassword ? <Icons.EyeOff /> : <Icons.Eye />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '600',
                fontSize: '14px',
                color: '#374151'
              }}>
                Подтверждение пароля
              </label>
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
                  type={showPassword ? 'text' : 'password'}
                  className="input-modern"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '14px 14px 14px 44px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn-primary-modern"
              disabled={loading || !userId || !password}
              style={{
                width: '100%',
                marginBottom: '1rem'
              }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <span className="loading-spinner" style={{ width: '16px', height: '16px' }}></span>
                  Создание...
                </span>
              ) : (
                'Создать аккаунт →'
              )}
            </button>

            {/* Back to Login */}
            <button
              type="button"
              className="btn-secondary-modern"
              onClick={() => setView('login')}
              style={{
                width: '100%',
                color: '#6b7280',
                borderColor: '#e5e7eb'
              }}
            >
              ← Уже есть аккаунт? Войти
            </button>
          </form>
        )}
      </div>

      {/* CSS for animations */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(10deg);
          }
        }
      `}</style>
    </div>
  );
}

export default LoginView;
