import React, { useState, useEffect } from 'react';

// SVG Icons
const Icons = {
  Smartphone: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
      <line x1="12" y1="18" x2="12.01" y2="18"></line>
    </svg>
  ),
  Monitor: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
      <line x1="8" y1="21" x2="16" y2="21"></line>
      <line x1="12" y1="17" x2="12" y2="21"></line>
    </svg>
  ),
  Tablet: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
      <line x1="12" y1="18" x2="12.01" y2="18"></line>
    </svg>
  ),
  Trash: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
  ),
  Check: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  ),
  AlertCircle: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
  ),
  RefreshCw: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="23 4 23 10 17 10"></polyline>
      <polyline points="1 20 1 14 7 14"></polyline>
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
    </svg>
  ),
  ArrowLeft: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="19" y1="12" x2="5" y2="12"></line>
      <polyline points="12 19 5 12 12 5"></polyline>
    </svg>
  ),
  Shield: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    </svg>
  )
};

function DevicesView({ apiService, userId, onBack }) {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingDevice, setDeletingDevice] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Загрузка списка устройств
  const loadDevices = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getUserDevices(userId);
      setDevices(data.devices || []);
    } catch (err) {
      console.error('Error loading devices:', err);
      setError('Не удалось загрузить список устройств');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDevices();
  }, [userId]);

  // Удаление устройства
  const handleDeleteDevice = async (deviceId) => {
    if (!confirm('Вы уверены, что хотите удалить это устройство? Оно потеряет доступ к переписке.')) {
      return;
    }

    try {
      setDeletingDevice(deviceId);
      await apiService.removeDevice(userId, deviceId);
      
      // Обновляем список
      setDevices(devices.filter(d => d.deviceId !== deviceId));
    } catch (err) {
      console.error('Error deleting device:', err);
      alert('Ошибка при удалении устройства: ' + err.message);
    } finally {
      setDeletingDevice(null);
    }
  };

  // Определение иконки устройства по платформе
  const getDeviceIcon = (platform, deviceName) => {
    if (platform === 'mobile' || (deviceName && deviceName.toLowerCase().includes('phone'))) {
      return <Icons.Smartphone />;
    } else if (platform === 'desktop' || (deviceName && deviceName.toLowerCase().includes('desktop'))) {
      return <Icons.Monitor />;
    } else if (platform === 'tablet' || (deviceName && deviceName.toLowerCase().includes('tablet'))) {
      return <Icons.Tablet />;
    }
    return <Icons.Smartphone />; // По умолчанию
  };

  // Форматирование даты
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Никогда';
    const date = new Date(timestamp);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '1rem'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '2rem',
          color: 'white'
        }}>
          <button
            onClick={onBack}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '12px',
              padding: '0.75rem',
              cursor: 'pointer',
              marginRight: '1rem',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
          >
            <Icons.ArrowLeft />
          </button>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '28px', fontWeight: '700', margin: 0 }}>
              Мои устройства
            </h1>
            <p style={{ fontSize: '14px', opacity: 0.9, margin: '0.5rem 0 0 0' }}>
              Управление доверенными устройствами
            </p>
          </div>
          <button
            onClick={loadDevices}
            disabled={refreshing}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '12px',
              padding: '0.75rem',
              cursor: refreshing ? 'not-allowed' : 'pointer',
              color: 'white',
              transition: 'all 0.2s',
              opacity: refreshing ? 0.5 : 1
            }}
          >
            <Icons.RefreshCw />
          </button>
        </div>

        {/* Info Card */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '16px',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            <div style={{ 
              color: '#667eea',
              flexShrink: 0
            }}>
              <Icons.Shield />
            </div>
            <div>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '16px', color: '#1f2937' }}>
                Безопасность устройств
              </h3>
              <p style={{ margin: 0, fontSize: '14px', color: '#6b7280', lineHeight: 1.6 }}>
                Каждое устройство имеет свой уникальный ключ шифрования. 
                Вы можете удалить любое устройство - оно потеряет доступ к переписке, 
                но остальные устройства продолжат работу.
              </p>
            </div>
          </div>
        </div>

        {/* Devices List */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '16px',
          padding: '1.5rem',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '1.5rem'
          }}>
            <h2 style={{ margin: 0, fontSize: '20px', color: '#1f2937' }}>
              Зарегистрированные устройства
            </h2>
            <span style={{
              background: '#667eea',
              color: 'white',
              padding: '0.25rem 0.75rem',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              {devices.length}
            </span>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>
              <p>Загрузка устройств...</p>
            </div>
          ) : error ? (
            <div style={{
              background: '#fee2e2',
              border: '1px solid #fecaca',
              borderRadius: '12px',
              padding: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              color: '#dc2626'
            }}>
              <Icons.AlertCircle />
              <span>{error}</span>
            </div>
          ) : devices.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>
              <p>У вас пока нет зарегистрированных устройств</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {devices.map((device) => {
                const isCurrentDevice = true; // TODO: определить текущее устройство
                const isDeleting = deletingDevice === device.deviceId;

                return (
                  <div
                    key={device.deviceId}
                    style={{
                      border: isCurrentDevice ? '2px solid #667eea' : '1px solid #e5e7eb',
                      borderRadius: '12px',
                      padding: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      background: isCurrentDevice ? 'rgba(102, 126, 234, 0.05)' : 'white',
                      transition: 'all 0.2s'
                    }}
                  >
                    {/* Device Icon */}
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: device.platform === 'mobile' 
                        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                        : device.platform === 'desktop'
                        ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
                        : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      flexShrink: 0
                    }}>
                      {getDeviceIcon(device.platform, device.deviceName)}
                    </div>

                    {/* Device Info */}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                          {device.deviceName || 'Неизвестное устройство'}
                        </h3>
                        {isCurrentDevice && (
                          <span style={{
                            background: '#10b981',
                            color: 'white',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '600'
                          }}>
                            Текущее
                          </span>
                        )}
                        {device.online && (
                          <span style={{
                            background: '#10b981',
                            color: 'white',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '600'
                          }}>
                            Онлайн
                          </span>
                        )}
                      </div>
                      <p style={{ margin: 0, fontSize: '13px', color: '#6b7280', marginBottom: '0.25rem' }}>
                        Платформа: {device.platform || 'web'}
                      </p>
                      <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>
                        Зарегистрировано: {formatDate(device.registeredAt)}
                      </p>
                      {device.lastSeen && (
                        <p style={{ margin: '0.25rem 0 0 0', fontSize: '12px', color: '#9ca3af' }}>
                          Активность: {formatDate(device.lastSeen)}
                        </p>
                      )}
                    </div>

                    {/* Delete Button */}
                    {!isCurrentDevice && (
                      <button
                        onClick={() => handleDeleteDevice(device.deviceId)}
                        disabled={isDeleting}
                        style={{
                          background: isDeleting ? '#f3f4f6' : '#fee2e2',
                          border: 'none',
                          borderRadius: '10px',
                          padding: '0.75rem',
                          cursor: isDeleting ? 'not-allowed' : 'pointer',
                          color: isDeleting ? '#9ca3af' : '#dc2626',
                          transition: 'all 0.2s',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        title="Удалить устройство"
                      >
                        {isDeleting ? (
                          <Icons.RefreshCw />
                        ) : (
                          <Icons.Trash />
                        )}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DevicesView;
