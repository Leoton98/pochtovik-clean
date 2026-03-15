const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const fs = require('fs');
const path = require('path');
const Store = require('electron-store');

// Initialize store for user data
const store = new Store();

let mainWindow;

// Disable GPU acceleration to avoid GPU process crashes
app.disableHardwareAcceleration();

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      disableBlinkFeatures: 'Auxclick'
    },
    icon: path.join(__dirname, '../../build/icon.png'),
    title: 'Почтовик'
  });

  // Load app
  const isDev = process.env.NODE_ENV === 'development';
  
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../../build/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  // Disable CORS for development
  app.commandLine.appendSwitch('disable-web-security');
  
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC Handlers

// Get user data from store
ipcMain.handle('store-get', (event, key) => {
  return store.get(key);
});

// Set user data in store
ipcMain.handle('store-set', (event, key, value) => {
  store.set(key, value);
  return true;
});

// Delete user data from store
ipcMain.handle('store-delete', (event, key) => {
  store.delete(key);
  return true;
});

// Clear all data
ipcMain.handle('store-clear', () => {
  store.clear();
  return true;
});

// Export configuration to file
ipcMain.handle('config-export', async () => {
  try {
    const userData = {
      userId: store.get('user.userId'),
      displayName: store.get('user.displayName'),
      nameServerUrl: store.get('user.nameServerUrl'),
      bucket: store.get('user.bucket'),
      accessKeyId: store.get('user.accessKeyId'),
      endpoint: store.get('user.endpoint')
      // Note: secretAccessKey and privateKey are NOT exported for security
    };
    
    const result = await dialog.showSaveDialog({
      title: 'Сохранить конфигурацию',
      defaultPath: 'pochtovik-config.json',
      filters: [
        { name: 'JSON', extensions: ['json'] }
      ]
    });
    
    if (result.filePath) {
      fs.writeFileSync(result.filePath, JSON.stringify(userData, null, 2));
      return { success: true, path: result.filePath };
    }
    return { success: false, message: 'Отменено пользователем' };
  } catch (error) {
    console.error('Export error:', error);
    return { success: false, message: error.message };
  }
});

// Import configuration from file
ipcMain.handle('config-import', async () => {
  try {
    const result = await dialog.showOpenDialog({
      title: 'Выберите файл конфигурации',
      filters: [
        { name: 'JSON', extensions: ['json'] }
      ],
      properties: ['openFile']
    });
    
    if (result.canceled || result.filePaths.length === 0) {
      return { success: false, message: 'Отменено пользователем' };
    }
    
    const filePath = result.filePaths[0];
    const configData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Validate required fields
    if (!configData.userId) {
      return { success: false, message: 'Неверный формат файла: отсутствует userId' };
    }
    
    // Сохраняем конфигурацию автоматически (без подтверждения)
    const currentConfig = store.get('user') || {};
    const newConfig = {
      userId: configData.userId,
      displayName: configData.displayName || currentConfig.displayName,
      nameServerUrl: configData.nameServerUrl || currentConfig.nameServerUrl || 'https://pochtovik-name-server.onrender.com',
      bucket: configData.bucket || currentConfig.bucket,
      accessKeyId: configData.accessKeyId || currentConfig.accessKeyId,
      secretAccessKey: configData.secretAccessKey || currentConfig.secretAccessKey,
      endpoint: configData.endpoint || currentConfig.endpoint || 'https://storage.yandexcloud.net'
    };
    
    store.set('user', newConfig);
    
    return { 
      success: true, 
      message: 'Конфигурация успешно импортирована',
      data: configData
    };
  } catch (error) {
    console.error('Import error:', error);
    return { success: false, message: error.message };
  }
});

// Export private key separately
ipcMain.handle('private-key-export', async (event, privateKeyPem) => {
  try {
    const result = await dialog.showSaveDialog({
      title: 'Сохранить приватный ключ',
      defaultPath: 'pochtovik-private-key.pem',
      filters: [
        { name: 'PEM', extensions: ['pem'] }
      ]
    });
    
    if (result.filePath) {
      fs.writeFileSync(result.filePath, privateKeyPem);
      return { success: true, path: result.filePath };
    }
    return { success: false, message: 'Отменено пользователем' };
  } catch (error) {
    console.error('Private key export error:', error);
    return { success: false, message: error.message };
  }
});

// Import private key from file
ipcMain.handle('private-key-import', async () => {
  try {
    const result = await dialog.showOpenDialog({
      title: 'Выберите файл приватного ключа',
      filters: [
        { name: 'PEM', extensions: ['pem', 'key'] }
      ],
      properties: ['openFile']
    });
    
    if (result.canceled || result.filePaths.length === 0) {
      return { success: false, message: 'Отменено пользователем' };
    }
    
    const filePath = result.filePaths[0];
    const privateKeyPem = fs.readFileSync(filePath, 'utf8');
    
    return { 
      success: true, 
      privateKey: privateKeyPem
    };
  } catch (error) {
    console.error('Private key import error:', error);
    return { success: false, message: error.message };
  }
});
