// Type definitions for Electron API exposed through preload script

export interface ElectronAPI {
  // App information
  getAppVersion: () => Promise<string>;
  getPlatform: () => Promise<NodeJS.Platform>;

  // File system operations
  readFile: (filePath: string) => Promise<{
    success: boolean;
    data?: string;
    error?: string;
  }>;
  writeFile: (filePath: string, content: string) => Promise<{
    success: boolean;
    error?: string;
  }>;
}

export interface ElectronEvents {
  onUpdateAvailable: (callback: (...args: any[]) => void) => void;
  onUpdateDownloaded: (callback: (...args: any[]) => void) => void;
  removeListener: (channel: string) => void;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
    electronEvents: ElectronEvents;
    isElectron: boolean;
  }
}

export { };

