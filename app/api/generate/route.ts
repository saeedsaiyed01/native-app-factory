import { exec } from "child_process";
import * as fs from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import * as path from "path";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    const { url, appName, platform } = await request.json();

    // Validate inputs
    if (!url || !appName || !platform) {
      return NextResponse.json(
        { error: "Missing required fields: url, appName, platform" },
        { status: 400 }
      );
    }

    // Validate URL
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }

    // Sanitize app name for file system
    const sanitizedAppName = appName
      .replace(/[^a-zA-Z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .toLowerCase();

    if (!sanitizedAppName) {
      return NextResponse.json(
        { error: "Invalid app name" },
        { status: 400 }
      );
    }

    // Create temp directory for the build
    const buildId = `${sanitizedAppName}-${Date.now()}`;
    const tempDir = path.join(process.cwd(), "temp-builds", buildId);
    
    await fs.mkdir(tempDir, { recursive: true });

    // Generate main.js for Electron
    const mainJs = `
const { app, BrowserWindow, shell } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true
    },
    icon: path.join(__dirname, 'icon.png'),
    title: '${appName}',
    autoHideMenuBar: true
  });

  mainWindow.loadURL('${url}');

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
`;

    // Generate package.json
    const packageJson = {
      name: sanitizedAppName,
      version: "1.0.0",
      description: `Desktop app for ${url}`,
      main: "main.js",
      scripts: {
        start: "electron .",
        "build:win": "electron-builder --win",
        "build:mac": "electron-builder --mac",
        "build:linux": "electron-builder --linux"
      },
      devDependencies: {
        electron: "^28.0.0",
        "electron-builder": "^24.9.1"
      },
      build: {
        appId: `com.nativeappfactory.${sanitizedAppName}`,
        productName: appName,
        files: ["main.js", "package.json"],
        win: {
          target: "portable",
          icon: "icon.png"
        },
        mac: {
          target: "dmg",
          icon: "icon.png"
        },
        linux: {
          target: "AppImage",
          icon: "icon.png"
        }
      }
    };

    // Write files
    await fs.writeFile(path.join(tempDir, "main.js"), mainJs);
    await fs.writeFile(
      path.join(tempDir, "package.json"),
      JSON.stringify(packageJson, null, 2)
    );

    // Create a simple icon placeholder (in production, you'd want to fetch the favicon)
    // For now, we'll skip the icon

    // Install dependencies and build
    try {
      await execAsync("npm install", { cwd: tempDir });
      
      const buildCommand = platform === "windows" 
        ? "npm run build:win"
        : platform === "macos"
        ? "npm run build:mac"
        : "npm run build:linux";
      
      await execAsync(buildCommand, { cwd: tempDir });
    } catch (buildError: any) {
      console.error("Build error:", buildError);
      // Clean up on error
      await fs.rm(tempDir, { recursive: true, force: true });
      return NextResponse.json(
        { error: "Failed to build application. Please try again." },
        { status: 500 }
      );
    }

    // Find the built file
    const distDir = path.join(tempDir, "dist");
    const files = await fs.readdir(distDir);
    
    let outputFile = "";
    if (platform === "windows") {
      outputFile = files.find(f => f.endsWith(".exe")) || "";
    } else if (platform === "macos") {
      outputFile = files.find(f => f.endsWith(".dmg")) || "";
    } else {
      outputFile = files.find(f => f.endsWith(".AppImage")) || "";
    }

    if (!outputFile) {
      await fs.rm(tempDir, { recursive: true, force: true });
      return NextResponse.json(
        { error: "Build completed but output file not found" },
        { status: 500 }
      );
    }

    // Move the file to public downloads folder
    const downloadsDir = path.join(process.cwd(), "public", "downloads");
    await fs.mkdir(downloadsDir, { recursive: true });
    
    const finalFileName = `${sanitizedAppName}-${platform}${path.extname(outputFile)}`;
    const finalPath = path.join(downloadsDir, finalFileName);
    
    await fs.copyFile(path.join(distDir, outputFile), finalPath);
    
    // Clean up temp directory
    await fs.rm(tempDir, { recursive: true, force: true });

    return NextResponse.json({
      success: true,
      downloadUrl: `/downloads/${finalFileName}`,
      fileName: finalFileName
    });

  } catch (error: any) {
    console.error("Generate error:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
