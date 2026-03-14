const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');
const bcrypt = require('bcryptjs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize database
const dbPath = path.join(__dirname, 'db.json');
const adapter = new JSONFile(dbPath);
const db = new Low(adapter, { users: {} });

// Initialize database
db.read().catch(err => {
  console.error('Error reading database:', err);
  // Start with empty database if file doesn't exist
  db.data = { users: {} };
});

// GET /health - Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

// POST /register - Register user with password
app.post('/register', async (req, res) => {
  try {
    const { userId, publicKey, displayName, password } = req.body;
    
    if (!userId || !password) {
      return res.status(400).json({ error: 'userId and password are required' });
    }
    
    await db.read();
    
    // Check if user already exists
    if (db.data.users[userId]) {
      return res.status(409).json({ 
        error: 'User already exists',
        message: 'User with this ID is already registered'
      });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Register new user
    db.data.users[userId] = {
      publicKey: publicKey || '',
      displayName: displayName || userId,
      passwordHash: hashedPassword,
      registeredAt: Date.now(),
      lastSeen: Date.now()
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
    
    // Verify password
    const isValid = await bcrypt.compare(password, user.passwordHash);
    
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Update last seen
    user.lastSeen = Date.now();
    await db.write();
    
    res.json({
      success: true,
      userId,
      displayName: user.displayName,
      publicKey: user.publicKey
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
    
    // Update last seen
    user.lastSeen = Date.now();
    await db.write();
    
    res.json({
      userId,
      publicKey: user.publicKey,
      displayName: user.displayName,
      lastSeen: user.lastSeen
    });
  } catch (error) {
    console.error('Error fetching public key:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /users - List all users
app.get('/users', async (req, res) => {
  try {
    await db.read();
    
    const users = Object.keys(db.data.users).map(userId => ({
      userId,
      displayName: db.data.users[userId].displayName,
      lastSeen: db.data.users[userId].lastSeen
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
    
    delete db.data.users[userId];
    await db.write();
    
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Name server running on port ${PORT}`);
  console.log(`Database location: ${dbPath}`);
  console.log('\nAvailable endpoints:');
  console.log(`  GET  /health           - Health check`);
  console.log(`  POST /register         - Register user`);
  console.log(`  GET  /key/:userId      - Get public key`);
  console.log(`  GET  /users            - List all users`);
  console.log(`  PUT  /user/:userId/update - Update user`);
  console.log(`  DELETE /user/:userId   - Delete user`);
});
