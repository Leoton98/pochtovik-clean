const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  store: {
    get: (key) => ipcRenderer.invoke('store-get', key),
    set: (key, value) => ipcRenderer.invoke('store-set', key, value),
    delete: (key) => ipcRenderer.invoke('store-delete', key),
    clear: () => ipcRenderer.invoke('store-clear')
  },
  
  // Configuration import/export
  configExport: () => ipcRenderer.invoke('config-export'),
  configImport: () => ipcRenderer.invoke('config-import'),
  
  // Private key import/export
  privateKeyExport: (privateKeyPem) => ipcRenderer.invoke('private-key-export', null, privateKeyPem),
  privateKeyImport: () => ipcRenderer.invoke('private-key-import')
});
