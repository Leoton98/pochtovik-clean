import React, { useState, useEffect } from 'react';
import CryptoManager from './crypto/CryptoManager';
import YandexCloudClient from './cloud/YandexCloudClient';
import ApiService from './services/ApiService';
import LoginView from './components/LoginView';
import ChatView from './components/ChatView';
import SettingsView from './components/SettingsView';
import DevicesView from './components/DevicesView';
import DEFAULT_CONFIG from './config/default.config';
import storageAdapter from './utils/StorageAdapter';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [privateKey, setPrivateKey] = useState(null);
  const [view, setView] = useState('login'); // login, chat, settings, devices
  const [apiService, setApiService] = useState(null);
  const [cloudClient, setCloudClient] = useState(null);

  useEffect(() => {
    // Load saved user data on startup
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const savedUser = await storageAdapter.get('user');
      const savedPrivateKey = await storageAdapter.get('privateKey');
      
      if (savedUser && savedPrivateKey) {
        setCurrentUser(savedUser);
        setPrivateKey(savedPrivateKey);
        initializeServices(savedUser, savedPrivateKey);
        setView('chat');
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const initializeServices = (user, privKey) => {
    // Initialize API service
    const api = new ApiService(user.nameServerUrl || 'https://pochtovik-name-server.onrender.com');
    setApiService(api);

    // Initialize cloud client
    const cloud = new YandexCloudClient({
      bucket: user.bucket,
      accessKeyId: user.accessKeyId,
      secretAccessKey: user.secretAccessKey,
      endpoint: user.endpoint || 'https://storage.yandexcloud.net'
    });
    setCloudClient(cloud);
  };

  const handleLogin = async (userId, password) => {
    try {
      // Login to name server
      const api = new ApiService('http://localhost:3001');
      const loginResult = await api.login(userId, password);
      
      // Get or generate private key
      let privateKeyPem = await storageAdapter.get('privateKey');
      
      if (!privateKeyPem) {
        // Generate new key pair
        const keyPair = CryptoManager.generateRSAKeyPair(2048);
        privateKeyPem = keyPair.privateKey;
        await storageAdapter.set('privateKey', privateKeyPem);
        
        // Update public key on server if not exists
        const keyData = await api.getPublicKey(userId);
        if (!keyData.publicKey) {
          await api.registerUser(userId, password, keyPair.publicKey, loginResult.displayName);
        }
      } else {
        // Validate private key format
        console.log('Loaded private key format:', privateKeyPem.substring(0, 30) + '...');
        if (!privateKeyPem.includes('-----BEGIN RSA PRIVATE KEY-----') && 
            !privateKeyPem.includes('-----BEGIN PRIVATE KEY-----')) {
          console.error('Invalid private key format, regenerating...');
          const keyPair = CryptoManager.generateRSAKeyPair(2048);
          privateKeyPem = keyPair.privateKey;
          await storageAdapter.set('privateKey', privateKeyPem);
        }
      }
      
      // Generate device ID for multi-device support
      let deviceId = await storageAdapter.get('deviceId');
      if (!deviceId) {
        deviceId = `device-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        await storageAdapter.set('deviceId', deviceId);
      }
      
      // Register this device on the server
      try {
        const deviceInfo = {
          deviceId,
          publicKey: CryptoManager.extractPublicKey(privateKeyPem),
          deviceName: navigator.userAgent.includes('Android') || navigator.userAgent.includes('Mobile') 
            ? 'Mobile Device' 
            : 'Desktop',
          platform: navigator.userAgent.includes('Android') || navigator.userAgent.includes('Mobile')
            ? 'mobile'
            : 'web'
        };
        
        await api.registerDevice(userId, deviceId, deviceInfo);
        console.log('📱 Device registered:', deviceId);
      } catch (deviceError) {
        console.error('Warning: Could not register device:', deviceError);
        // Continue anyway - device registration is not critical
      }
      
      // Save user config
      const userConfig = {
        userId,
        displayName: loginResult.displayName,
        nameServerUrl: 'http://localhost:3001',
        bucket: DEFAULT_CONFIG.bucket,
        accessKeyId: DEFAULT_CONFIG.accessKeyId,
        secretAccessKey: DEFAULT_CONFIG.secretAccessKey,
        endpoint: DEFAULT_CONFIG.endpoint,
        region: DEFAULT_CONFIG.region
      };
      
      await storageAdapter.set('user', userConfig);

      setCurrentUser(userConfig);
      setPrivateKey(privateKeyPem);
      initializeServices(userConfig, privateKeyPem);
      setView('chat');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await storageAdapter.clear();
      setCurrentUser(null);
      setPrivateKey(null);
      setApiService(null);
      setCloudClient(null);
      setView('login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleRegister = async (userId, password, displayName) => {
    try {
      // Generate RSA key pair
      const keyPair = CryptoManager.generateRSAKeyPair(2048);
      
      // Register on name server with password
      const api = new ApiService('http://localhost:3001');
      await api.registerUser(userId, password, keyPair.publicKey, displayName);

      // Generate device ID
      const deviceId = `device-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      await storageAdapter.set('deviceId', deviceId);
      
      // Register this device
      try {
        const deviceInfo = {
          deviceId,
          publicKey: keyPair.publicKey,
          deviceName: navigator.userAgent.includes('Android') || navigator.userAgent.includes('Mobile') 
            ? 'Mobile Device' 
            : 'Desktop',
          platform: navigator.userAgent.includes('Android') || navigator.userAgent.includes('Mobile')
            ? 'mobile'
            : 'web'
        };
        
        await api.registerDevice(userId, deviceId, deviceInfo);
        console.log('📱 Device registered:', deviceId);
      } catch (deviceError) {
        console.error('Warning: Could not register device:', deviceError);
      }

      // Save user config
      const userConfig = {
        userId,
        displayName,
        nameServerUrl: 'http://localhost:3001',
        bucket: DEFAULT_CONFIG.bucket,
        accessKeyId: DEFAULT_CONFIG.accessKeyId,
        secretAccessKey: DEFAULT_CONFIG.secretAccessKey,
        endpoint: DEFAULT_CONFIG.endpoint,
        region: DEFAULT_CONFIG.region
      };
      
      await storageAdapter.set('user', userConfig);
      await storageAdapter.set('privateKey', keyPair.privateKey);

      setCurrentUser(userConfig);
      setPrivateKey(keyPair.privateKey);
      initializeServices(userConfig, keyPair.privateKey);
      setView('chat');
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  return (
    <div className="App">
      {view === 'login' && (
        <LoginView 
          onLogin={handleLogin}
          onRegister={handleRegister}
        />
      )}
      {view === 'chat' && currentUser && privateKey && (
        <ChatView
          user={currentUser}
          privateKey={privateKey}
          apiService={apiService}
          cloudClient={cloudClient}
          onLogout={handleLogout}
          onOpenSettings={() => setView('settings')}
        />
      )}
      {view === 'settings' && currentUser && (
        <SettingsView
          user={currentUser}
          onBack={() => setView('chat')}
          onLogout={handleLogout}
          userAvatar={localStorage.getItem(`avatar_${currentUser.userId}`)}
          onAvatarUpload={(base64) => {
            localStorage.setItem(`avatar_${currentUser.userId}`, base64);
            setView('chat');
          }}
          apiService={apiService}
          onOpenDevices={() => setView('devices')}
        />
      )}
      {view === 'devices' && currentUser && (
        <DevicesView
          apiService={apiService}
          userId={currentUser.userId}
          onBack={() => setView('settings')}
        />
      )}
    </div>
  );
}

export default App;
