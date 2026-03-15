const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');
const bcrypt = require('bcryptjs');
const path = require('path');
const WebSocket = require('ws');
const http = require('http');

// Firebase Admin for push notifications
let admin;
try {
  admin = require('firebase-admin');
} catch (error) {
  console.log('⚠️ Firebase Admin not available, push notifications disabled');
}

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Ensure database is initialized before processing requests
app.use(async (req, res, next) => {
  await db.read();
  if (!db.data) {
    db.data = { users: {}, sessions: {}, devices: {} };
  }
  // Ensure all required fields exist
  if (!db.data.users) db.data.users = {};
  if (!db.data.sessions) db.data.sessions = {};
  if (!db.data.devices) db.data.devices = {};
  next();
});

// Create HTTP server
const server = http.createServer(app);

// Initialize database
const dbPath = path.join(__dirname, 'db.json');
const adapter = new JSONFile(dbPath);
const db = new Low(adapter, { 
  users: {},
  sessions: {}, // Для мульти-девайс
  devices: {} // Хранилище устройств по userId
});

// Initialize database with default structure
db.read().then(() => {
  if (!db.data) {
    db.data = { users: {}, sessions: {}, devices: {} };
  }
  // Ensure all required fields exist
  if (!db.data.users) db.data.users = {};
  if (!db.data.sessions) db.data.sessions = {};
  if (!db.data.devices) db.data.devices = {};
  
  // Initialize Firebase Admin if available
  if (admin) {
    try {
      // Try to load from environment variable first (for Render)
      const serviceAccountEnv = process.env.FIREBASE_SERVICE_ACCOUNT;
      
      if (serviceAccountEnv) {
        const serviceAccount = JSON.parse(serviceAccountEnv);
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount)
        });
        console.log('✅ Firebase Admin initialized - Push notifications enabled');
      } else {
        // Fallback to file (for local development)
        const fs = require('fs');
        const serviceAccountPath = path.join(__dirname, 'firebase-service-account.json');
        
        if (fs.existsSync(serviceAccountPath)) {
          const serviceAccount = require('./firebase-service-account.json');
          admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
          });
          console.log('✅ Firebase Admin initialized - Push notifications enabled');
        } else {
          console.log('⚠️ Firebase service account not found. Add FIREBASE_SERVICE_ACCOUNT env var or create firebase-service-account.json');
        }
      }
    } catch (error) {
      console.log('⚠️ Firebase Admin initialization error:', error.message);
    }
  }
}).catch(err => {
  console.error('Error reading database:', err);
  db.data = { users: {}, sessions: {}, devices: {} };
});

// WebSocket server for real-time messaging
const wss = new WebSocket.Server({ server });

// Хранилище активных подключений: userId -> Set of WebSocket connections
const activeConnections = new Map();

// Отправка сообщения конкретному пользователю
function sendToUser(userId, message) {
  const connections = activeConnections.get(userId);
  if (connections) {
    connections.forEach(ws => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
      }
    });
    return true;
  }
  return false;
}

// Обработка WebSocket подключений
wss.on('connection', (ws, req) => {
  let userId = null;
  
  console.log('🔌 New WebSocket connection');
  
  // Получаем userId из первого сообщения
  ws.on('message', async (data) => {
    try {
      const message = JSON.parse(data.toString());
      
      if (message.type === 'auth' && message.userId) {
        // Авторизация подключения
        userId = message.userId;
        
        if (!activeConnections.has(userId)) {
          activeConnections.set(userId, new Set());
        }
        activeConnections.get(userId).add(ws);
        
        console.log(`✅ User ${userId} connected via WebSocket`);
        
        // Отправляем подтверждение
        ws.send(JSON.stringify({
          type: 'auth_success',
          userId: userId,
          timestamp: Date.now()
        }));
        
        // Уведомляем контакты что пользователь онлайн
        broadcastPresence(userId, true);
      }
      
      if (message.type === 'ping') {
        ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
      }
      
    } catch (error) {
      console.error('WebSocket message error:', error);
    }
  });
  
  ws.on('close', () => {
    if (userId) {
      const connections = activeConnections.get(userId);
      if (connections) {
        connections.delete(ws);
        if (connections.size === 0) {
          activeConnections.delete(userId);
          console.log(`❌ User ${userId} disconnected`);
          broadcastPresence(userId, false);
        }
      }
    }
  });
  
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
  
  // Heartbeat для поддержания соединения
  const pingInterval = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.ping();
    } else {
      clearInterval(pingInterval);
    }
  }, 30000); // Каждые 30 секунд
  
  ws.on('close', () => clearInterval(pingInterval));
});

// Рассылка статуса присутствия контактам пользователя
async function broadcastPresence(userId, isOnline) {
  await db.read();
  const allUsers = Object.keys(db.data.users);
  
  allUsers.forEach(contactId => {
    if (contactId !== userId) {
      sendToUser(contactId, {
        type: 'presence',
        userId: userId,
        online: isOnline,
        timestamp: Date.now()
      });
    }
  });
}

// REST API endpoints

// GET /health - Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: Date.now(),
    websocket: 'connected',
    onlineUsers: activeConnections.size
  });
});

// POST /register - Register user with password
app.post('/register', async (req, res) => {
  try {
    const { userId, publicKey, displayName, password } = req.body;
    
    if (!userId || !password) {
      return res.status(400).json({ error: 'userId and password are required' });
    }
    
    if (db.data.users[userId]) {
      return res.status(409).json({ 
        error: 'User already exists',
        message: 'User with this ID is already registered'
      });
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    db.data.users[userId] = {
      publicKey: publicKey || '',
      displayName: displayName || userId,
      passwordHash: hashedPassword,
      registeredAt: Date.now(),
      lastSeen: Date.now(),
      devices: [] // Список устройств пользователя
    };
    
    await db.write();
    
    console.log(`User registered: ${userId}`);
    res.status(201).json({ 
      success: true,
      message: 'User registered successfully',
      userId
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /login - Authenticate user
app.post('/login', async (req, res) => {
  try {
    const { userId, password } = req.body;
    
    if (!userId || !password) {
      return res.status(400).json({ error: 'userId and password are required' });
    }
    
    await db.read();
    
    const user = db.data.users[userId];
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (!user.passwordHash) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    const isValid = await bcrypt.compare(password, user.passwordHash);
    
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    user.lastSeen = Date.now();
    await db.write();
    
    // Проверяем есть ли активное WebSocket подключение
    const isOnline = activeConnections.has(userId);
    
    res.json({
      success: true,
      userId,
      displayName: user.displayName,
      publicKey: user.publicKey,
      online: isOnline
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /key/:userId - Get public key by user ID
app.get('/key/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    await db.read();
    
    const user = db.data.users[userId];
    
    if (!user) {
      return res.status(404).json({ 
        error: 'User not found',
        message: `No user found with ID: ${userId}`
      });
    }
    
    user.lastSeen = Date.now();
    await db.write();
    
    const isOnline = activeConnections.has(userId);
    
    res.json({
      userId,
      publicKey: user.publicKey,
      displayName: user.displayName,
      lastSeen: user.lastSeen,
      online: isOnline
    });
  } catch (error) {
    console.error('Error fetching public key:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /users - List all users with online status
app.get('/users', async (req, res) => {
  try {
    await db.read();
    
    const users = Object.keys(db.data.users).map(userId => ({
      userId,
      displayName: db.data.users[userId].displayName,
      lastSeen: db.data.users[userId].lastSeen,
      online: activeConnections.has(userId)
    }));
    
    res.json({ users });
  } catch (error) {
    console.error('Error listing users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /user/:userId/update - Update user info
app.put('/user/:userId/update', async (req, res) => {
  try {
    const { userId } = req.params;
    const { displayName, publicKey } = req.body;
    
    await db.read();
    
    if (!db.data.users[userId]) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (displayName) {
      db.data.users[userId].displayName = displayName;
    }
    
    if (publicKey) {
      db.data.users[userId].publicKey = publicKey;
    }
    
    db.data.users[userId].lastSeen = Date.now();
    await db.write();
    
    res.json({ success: true, message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /user/:userId - Delete user
app.delete('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    await db.read();
    
    if (!db.data.users[userId]) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Закрываем все WebSocket подключения
    const connections = activeConnections.get(userId);
    if (connections) {
      connections.forEach(ws => ws.close());
      activeConnections.delete(userId);
    }
    
    // Удаляем все устройства
    delete db.data.devices[userId];
    
    delete db.data.users[userId];
    await db.write();
    
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /device/register - Register new device for user
app.post('/device/register', async (req, res) => {
  try {
    const { userId, deviceId, publicKey, deviceName, platform } = req.body;
    
    if (!userId || !deviceId) {
      return res.status(400).json({ error: 'userId and deviceId are required' });
    }
    
    await db.read();
    
    const user = db.data.users[userId];
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Инициализируем хранилище устройств для пользователя
    if (!db.data.devices[userId]) {
      db.data.devices[userId] = [];
    }
    
    // Проверяем есть ли уже такое устройство
    const existingDevice = db.data.devices[userId].find(d => d.deviceId === deviceId);
    
    if (existingDevice) {
      // Обновляем существующее устройство
      existingDevice.publicKey = publicKey || existingDevice.publicKey;
      existingDevice.deviceName = deviceName || existingDevice.deviceName;
      existingDevice.platform = platform || existingDevice.platform;
      existingDevice.lastSeen = Date.now();
      existingDevice.isActive = true;
    } else {
      // Добавляем новое устройство
      const newDevice = {
        deviceId,
        publicKey: publicKey || '',
        deviceName: deviceName || 'Unknown Device',
        platform: platform || 'web',
        registeredAt: Date.now(),
        lastSeen: Date.now(),
        isActive: true
      };
      
      db.data.devices[userId].push(newDevice);
      
      // Также добавляем deviceId в список устройств пользователя
      if (!user.devices.find(id => id === deviceId)) {
        user.devices.push(deviceId);
      }
    }
    
    await db.write();
    
    console.log(`📱 Device registered: ${deviceId} for user ${userId}`);
    res.json({ 
      success: true, 
      message: 'Device registered successfully',
      deviceId,
      devices: db.data.devices[userId]
    });
  } catch (error) {
    console.error('Error registering device:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /devices/:userId - Get all devices for user
app.get('/devices/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    await db.read();
    
    const user = db.data.users[userId];
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const devices = db.data.devices[userId] || [];
    
    // Проверяем активные подключения
    const onlineDevices = activeConnections.has(userId);
    
    res.json({ 
      devices: devices.map(d => ({
        ...d,
        online: onlineDevices // Упрощённо считаем все устройства онлайн если пользователь подключён
      }))
    });
  } catch (error) {
    console.error('Error fetching devices:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /device/:userId/:deviceId - Remove device
app.delete('/device/:userId/:deviceId', async (req, res) => {
  try {
    const { userId, deviceId } = req.params;
    
    await db.read();
    
    const user = db.data.users[userId];
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (!db.data.devices[userId]) {
      return res.status(404).json({ error: 'No devices found for user' });
    }
    
    // Удаляем устройство из списка
    db.data.devices[userId] = db.data.devices[userId].filter(d => d.deviceId !== deviceId);
    
    // Удаляем deviceId из списка устройств пользователя
    user.devices = user.devices.filter(id => id !== deviceId);
    
    await db.write();
    
    console.log(`🗑️ Device removed: ${deviceId} for user ${userId}`);
    res.json({ 
      success: true, 
      message: 'Device removed successfully',
      devices: db.data.devices[userId]
    });
  } catch (error) {
    console.error('Error removing device:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /push/register - Register FCM token for push notifications
app.post('/push/register', async (req, res) => {
  try {
    const { userId, deviceId, fcmToken } = req.body;
    
    if (!userId || !deviceId || !fcmToken) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    await db.read();
    
    const user = db.data.users[userId];
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Initialize devices array if needed
    if (!db.data.devices[userId]) {
      db.data.devices[userId] = [];
    }
    
    // Find and update device with FCM token
    const device = db.data.devices[userId].find(d => d.deviceId === deviceId);
    
    if (device) {
      device.fcmToken = fcmToken;
      device.pushEnabled = true;
      await db.write();
      console.log(`📱 FCM token registered for device ${deviceId} (user: ${userId})`);
      res.json({ success: true, message: 'FCM token registered' });
    } else {
      res.status(404).json({ error: 'Device not found' });
    }
  } catch (error) {
    console.error('Error registering FCM token:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Helper function to send push notification via FCM
async function sendPushNotification(fcmToken, title, body, data = {}) {
  if (!admin) {
    console.log('⚠️ Firebase Admin not initialized, cannot send push');
    return false;
  }
  
  try {
    const message = {
      token: fcmToken,
      notification: {
        title: title,
        body: body,
      },
      data: data,
      android: {
        priority: 'HIGH',
        notification: {
          channelId: 'pochtovik-messages',
          sound: 'default',
        },
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
          },
        },
      },
    };

    const response = await admin.messaging().send(message);
    console.log('✅ Push notification sent:', response);
    return true;
  } catch (error) {
    console.error('❌ Error sending push notification:', error);
    return false;
  }
}

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Name Server v2 running on port ${PORT}`);
  console.log(`📊 Database location: ${dbPath}`);
  console.log(`🔌 WebSocket server ready`);
  console.log('\nAvailable endpoints:');
  console.log(`  GET  /health           - Health check`);
  console.log(`  POST /register         - Register user`);
  console.log(`  POST /login            - Login user`);
  console.log(`  GET  /key/:userId      - Get public key`);
  console.log(`  GET  /users            - List all users`);
  console.log(`  PUT  /user/:userId/update - Update user`);
  console.log(`  DELETE /user/:userId   - Delete user`);
  console.log(`  POST /device/register  - Register device`);
  console.log(`  GET  /devices/:userId  - Get user devices`);
  console.log(`  DELETE /device/:userId/:deviceId - Remove device`);
  console.log(`\nWebSocket: ws://localhost:${PORT}`);
});
