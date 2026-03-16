import React, { useState, useEffect } from 'react';
import './DevicesView.comfortable.css';

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
  
  // Чтение настройки темы из localStorage
  const darkMode = (() => {
    try {
      const savedTheme = localStorage.getItem('theme');
      return savedTheme ? JSON.parse(savedTheme) : true;
    } catch (e) {
      return true;
    }
  })();

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
    <div className={`devices-container ${darkMode ? '' : 'light-theme'}`}>
      <div className="devices-content">
        {/* Header */}
        <div className="devices-header">
          <button
            className="btn-back-devices"
            onClick={onBack}
          >
            <Icons.ArrowLeft />
          </button>
          <div className="devices-title-wrapper">
            <h1 className="devices-title">
              Мои устройства
            </h1>
            <p className="devices-subtitle">
              Управление доверенными устройствами
            </p>
          </div>
          <button
            className="btn-refresh"
            onClick={loadDevices}
            disabled={refreshing}
          >
            <Icons.RefreshCw />
          </button>
        </div>

        {/* Info Card */}
        <div className="info-card">
          <div className="info-card-wrapper">
            <div className="info-icon">
              <Icons.Shield />
            </div>
            <div>
              <h3 className="info-title">
                Безопасность устройств
              </h3>
              <p className="info-description">
                Каждое устройство имеет свой уникальный ключ шифрования. 
                Вы можете удалить любое устройство - оно потеряет доступ к переписке, 
                но остальные устройства продолжат работу.
              </p>
            </div>
          </div>
        </div>

        {/* Devices List */}
        <div className="devices-list-card">
          <div className="devices-list-header">
            <h2 className="devices-list-title">
              Зарегистрированные устройства
            </h2>
            <span className="devices-count">
              {devices.length}
            </span>
          </div>

          {loading ? (
            <div className="loading-text">
              <p>Загрузка устройств...</p>
            </div>
          ) : error ? (
            <div className="error-card">
              <Icons.AlertCircle />
              <span>{error}</span>
            </div>
          ) : devices.length === 0 ? (
            <div className="empty-state">
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
                    className={`device-item ${isCurrentDevice ? 'current' : ''}`}
                  >
                    {/* Device Icon */}
                    <div className={`device-icon-wrapper ${device.platform}`}>
                      {getDeviceIcon(device.platform, device.deviceName)}
                    </div>

                    {/* Device Info */}
                    <div className="device-info">
                      <div className="device-name-wrapper">
                        <h3 className="device-name">
                          {device.deviceName || 'Неизвестное устройство'}
                        </h3>
                        {isCurrentDevice && (
                          <span className="badge">
                            Текущее
                          </span>
                        )}
                        {device.online && (
                          <span className="badge">
                            Онлайн
                          </span>
                        )}
                      </div>
                      <p className="device-meta">
                        Платформа: {device.platform || 'web'}
                      </p>
                      <p className="device-date">
                        Зарегистрировано: {formatDate(device.registeredAt)}
                      </p>
                      {device.lastSeen && (
                        <p className="device-date">
                          Активность: {formatDate(device.lastSeen)}
                        </p>
                      )}
                    </div>

                    {/* Delete Button */}
                    {!isCurrentDevice && (
                      <button
                        className="btn-delete"
                        onClick={() => handleDeleteDevice(device.deviceId)}
                        disabled={isDeleting}
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
