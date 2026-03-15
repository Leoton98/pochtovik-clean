import React, { useState, useEffect } from 'react';
import CryptoManager from './crypto/CryptoManager';
import YandexCloudClient from './cloud/YandexCloudClient';
import ApiService from './services/ApiService';
import pushService from './services/PushService';
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
      // Use production server on Render by default
      const nameServerUrl = 'https://pochtovik-name-server.onrender.com';
      const api = new ApiService(nameServerUrl);
      console.log('🌐 Connecting to:', nameServerUrl);
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
        
        // Initialize push notifications after device registration
        await initializePushNotifications(userId, deviceId, api);
      } catch (deviceError) {
        console.error('Warning: Could not register device:', deviceError);
        // Continue anyway - device registration is not critical
      }
      
      // Save user config
      const userConfig = {
        userId,
        displayName: loginResult.displayName,
        nameServerUrl: 'https://pochtovik-name-server.onrender.com',
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

  const initializePushNotifications = async (userId, deviceId, api) => {
    try {
      // Create Firebase config from environment variables
      const firebaseConfig = {
        apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
        authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
        storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.REACT_APP_FIREBASE_APP_ID
      };

      // Check if all variables are configured
      if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
        console.warn('⚠️ Firebase config not complete, skipping push initialization');
        return;
      }

      // Initialize push service
      const initialized = await pushService.initialize(firebaseConfig);
      
      if (!initialized) {
        console.warn('⚠️ Push service initialization failed');
        return;
      }

      // Request permission and get token
      const token = await pushService.requestPermissionAndGetToken();
      
      if (token) {
        console.log('📱 FCM Token obtained:', token.substring(0, 30) + '...');
        
        // Register token on server
        try {
          await api.registerFcmToken(userId, deviceId, token);
          console.log('✅ FCM token registered on server');
        } catch (error) {
          console.error('❌ Failed to register FCM token:', error.message);
        }
      } else {
        console.log('ℹ️ Notification permission denied or token not received');
      }

      // Listen for messages when app is in foreground
      pushService.onMessageReceived((payload) => {
        console.log('📨 New message received:', payload);
        // You can update UI or show notification here
      });

    } catch (error) {
      console.error('❌ Error initializing push notifications:', error);
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
