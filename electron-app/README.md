# Electron App

This directory contains the Electron wrapper for the Native App Factory.

## Structure

- `main.js` - Main Electron process (creates windows, handles system events)
- `preload.js` - Preload script for secure IPC communication
- `package.json` - Electron app configuration and build settings

## Development

### Running in Development Mode

1. Start the Next.js development server from the root directory:
   ```bash
   npm run dev
   ```

2. In a separate terminal, start the Electron app:
   ```bash
   cd electron-app
   npm start
   ```

The Electron app will load the Next.js app from `http://localhost:3000`.

### Building for Production

First, build the Next.js app for static export:

```bash
# From root directory
npm run build
```

Then build the Electron app for your target platform:

```bash
cd electron-app

# macOS
npm run build:macos

# Windows
npm run build:windows

# Linux
npm run build:linux
```

## IPC Communication

The app uses secure IPC communication through the preload script. Available APIs:

### App Information
```javascript
// Get app version
const version = await window.electronAPI.getAppVersion();

// Get platform (win32, darwin, linux)
const platform = await window.electronAPI.getPlatform();
```

### File System Operations
```javascript
// Read file
const result = await window.electronAPI.readFile('/path/to/file.txt');
if (result.success) {
  console.log(result.data);
}

// Write file
const result = await window.electronAPI.writeFile('/path/to/file.txt', 'content');
if (result.success) {
  console.log('File written successfully');
}
```

### Detecting Electron Environment
```javascript
if (window.isElectron) {
  // Running in Electron
  console.log('Running as desktop app');
} else {
  // Running in browser
  console.log('Running in web browser');
}
```

## Build Configuration

The build configuration in `package.json` includes:

- **App ID**: `com.yourcompany.electron-app` (change this to your company/app ID)
- **Product Name**: `electron-app` (change this to your app name)
- **Icons**: Place your app icon at `build/icon.png` (1024x1024 recommended)
- **Targets**:
  - macOS: DMG installer
  - Windows: NSIS installer
  - Linux: AppImage

## Adding Custom IPC Handlers

To add new IPC communication:

1. Add handler in `main.js`:
   ```javascript
   ipcMain.handle('your-channel', async (event, arg) => {
     // Your logic here
     return result;
   });
   ```

2. Expose in `preload.js`:
   ```javascript
   contextBridge.exposeInMainWorld('electronAPI', {
     yourMethod: (arg) => ipcRenderer.invoke('your-channel', arg),
   });
   ```

3. Use in your React components:
   ```javascript
   const result = await window.electronAPI.yourMethod(arg);
   ```

## Security

The app follows Electron security best practices:

- ✅ Context isolation enabled
- ✅ Node integration disabled
- ✅ Sandbox enabled
- ✅ Remote module disabled
- ✅ Secure IPC through preload script
- ✅ External links open in default browser

## Next Steps

1. Replace `build/icon.png` with your app icon
2. Update `appId` and `productName` in package.json
3. Configure Next.js for static export if needed
4. Add auto-updater functionality
5. Implement custom menu bar
6. Add native notifications
