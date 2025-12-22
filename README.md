# Native App Factory 🏭

Turn any website into a native desktop application for Windows, macOS, or Linux.

![Native App Factory](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![Electron](https://img.shields.io/badge/Electron-28-47848F?style=flat-square&logo=electron)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)

## Features

- 🌐 **Website to Desktop App** - Enter any URL and generate a native desktop application
- 🖥️ **Cross-Platform** - Build for Windows, macOS, and Linux
- ⚡ **Fast Generation** - Create apps in seconds
- 🔒 **Secure** - Sandboxed execution with context isolation
- 🎨 **Modern UI** - Beautiful, responsive interface

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/native-app-factory.git
   cd native-app-factory
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Enter the website URL you want to convert (e.g., `https://example.com`)
2. Give your app a name
3. Select your target platform (Windows, macOS, or Linux)
4. Click "Generate Desktop App"
5. Download your native application!

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Desktop**: Electron, electron-builder

## Project Structure

```
native-app-factory/
├── app/
│   ├── api/
│   │   └── generate/      # API endpoint for app generation
│   ├── page.tsx           # Main UI
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── electron-app/          # Electron wrapper (for running this app as desktop)
├── public/
│   └── downloads/         # Generated apps are stored here
├── temp-builds/           # Temporary build directory
└── package.json
```

## API Reference

### POST /api/generate

Generate a desktop application from a website URL.

**Request Body:**
```json
{
  "url": "https://example.com",
  "appName": "My App",
  "platform": "windows" | "macos" | "linux"
}
```

**Response:**
```json
{
  "success": true,
  "downloadUrl": "/downloads/my-app-windows.exe",
  "fileName": "my-app-windows.exe"
}
```

## Running as Desktop App

This project can also run as a desktop application itself:

1. Start the Next.js server:
   ```bash
   npm run dev
   ```

2. In another terminal, start Electron:
   ```bash
   cd electron-app
   npm install
   npm start
   ```

## Building for Production

```bash
# Build Next.js
npm run build

# Build Electron app
cd electron-app
npm run build:windows   # For Windows
npm run build:macos     # For macOS
npm run build:linux     # For Linux
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see [LICENSE](LICENSE) for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Electron](https://www.electronjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
