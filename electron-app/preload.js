const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // App information
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  getPlatform: () => ipcRenderer.invoke('get-platform'),

  // File system operations
  readFile: (filePath) => ipcRenderer.invoke('read-file', filePath),
  writeFile: (filePath, content) => ipcRenderer.invoke('write-file', filePath, content),

  // Add more IPC methods as needed
  // Example: Database operations, system dialogs, etc.
});

// Expose a flag to detect if running in Electron
contextBridge.exposeInMainWorld('isElectron', true);

// Optional: Add event listeners for renderer to main communication
contextBridge.exposeInMainWorld('electronEvents', {
  // Example: Listen to events from main process
  onUpdateAvailable: (callback) => {
    ipcRenderer.on('update-available', (event, ...args) => callback(...args));
  },
  
  onUpdateDownloaded: (callback) => {
    ipcRenderer.on('update-downloaded', (event, ...args) => callback(...args));
  },

  // Remove listeners when component unmounts
  removeListener: (channel) => {
    ipcRenderer.removeAllListeners(channel);
  }
});

// Log that preload script has loaded
console.log('Preload script loaded successfully');
