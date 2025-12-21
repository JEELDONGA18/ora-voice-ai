// Layout.js
import React from "react";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white flex flex-col">
      {/* Top Bar */}
      <header className="h-16 flex items-center px-6 border-b border-white/5">
        <h1 className="text-xl font-medium">
          Ora <span className="text-green-400">🎙️</span>
        </h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6">
        {children}
      </main>
    </div>
  );
}
