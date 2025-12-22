"use client";

import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [appName, setAppName] = useState("");
  const [platform, setPlatform] = useState<"windows" | "macos" | "linux">("windows");
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [error, setError] = useState("");

  const validateUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleGenerate = async () => {
    setError("");
    setDownloadUrl("");

    if (!url.trim()) {
      setError("Please enter a website URL");
      return;
    }

    if (!validateUrl(url)) {
      setError("Please enter a valid URL (e.g., https://example.com)");
      return;
    }

    if (!appName.trim()) {
      setError("Please enter an app name");
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setStatus("Initializing...");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: url.trim(),
          appName: appName.trim(),
          platform,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to generate app");
      }

      // Simulate progress updates
      const progressSteps = [
        { progress: 20, status: "Creating Electron project..." },
        { progress: 40, status: "Configuring app settings..." },
        { progress: 60, status: "Building application..." },
        { progress: 80, status: "Packaging for " + platform + "..." },
        { progress: 100, status: "Complete!" },
      ];

      for (const step of progressSteps) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        setProgress(step.progress);
        setStatus(step.status);
      }

      const data = await response.json();
      setDownloadUrl(data.downloadUrl);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center">
              <span className="text-xl">🏭</span>
            </div>
            <h1 className="text-xl font-bold text-white">Native App Factory</h1>
          </div>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/60 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-white mb-4">
            Turn Any Website Into a
            <span className="bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text text-transparent">
              {" "}Desktop App
            </span>
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Enter a website URL and we'll create a native desktop application for Windows, macOS, or Linux in seconds.
          </p>
        </div>

        {/* Main Card */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
            {/* URL Input */}
            <div className="mb-6">
              <label className="block text-white/80 text-sm font-medium mb-2">
                Website URL
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                disabled={isGenerating}
              />
            </div>

            {/* App Name Input */}
            <div className="mb-6">
              <label className="block text-white/80 text-sm font-medium mb-2">
                App Name
              </label>
              <input
                type="text"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                placeholder="My Awesome App"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                disabled={isGenerating}
              />
            </div>

            {/* Platform Selection */}
            <div className="mb-8">
              <label className="block text-white/80 text-sm font-medium mb-3">
                Target Platform
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "windows", label: "Windows", icon: "🪟" },
                  { id: "macos", label: "macOS", icon: "🍎" },
                  { id: "linux", label: "Linux", icon: "🐧" },
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPlatform(p.id as any)}
                    disabled={isGenerating}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                      platform === p.id
                        ? "bg-blue-500/30 border-blue-400 text-white"
                        : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <span className="text-2xl">{p.icon}</span>
                    <span className="text-sm font-medium">{p.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-500/20 border border-red-400/50 rounded-xl p-4 text-red-200">
                {error}
              </div>
            )}

            {/* Progress Bar */}
            {isGenerating && (
              <div className="mb-6">
                <div className="flex justify-between text-sm text-white/60 mb-2">
                  <span>{status}</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Download Button */}
            {downloadUrl && (
              <div className="mb-6 bg-green-500/20 border border-green-400/50 rounded-xl p-4">
                <p className="text-green-200 mb-3">✅ Your app is ready!</p>
                <a
                  href={downloadUrl}
                  download
                  className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download App
                </a>
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
                isGenerating
                  ? "bg-white/20 text-white/50 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl"
              }`}
            >
              {isGenerating ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Generating...
                </span>
              ) : (
                "Generate Desktop App"
              )}
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-6 mt-12">
            {[
              { icon: "⚡", title: "Fast", desc: "Generate in seconds" },
              { icon: "🔒", title: "Secure", desc: "Sandboxed execution" },
              { icon: "🎨", title: "Native", desc: "System integration" },
            ].map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="text-3xl mb-2">{feature.icon}</div>
                <h3 className="text-white font-semibold">{feature.title}</h3>
                <p className="text-white/50 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-16">
        <div className="max-w-6xl mx-auto px-6 py-6 text-center text-white/40 text-sm">
          Built with Next.js & Electron • Open Source
        </div>
      </footer>
    </div>
  );
}
