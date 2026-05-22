// Footer component
// Folder: client/src/components/Footer.jsx

import React from 'react'

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-white/80 bg-white/70 py-7 backdrop-blur">
      <div className="app-container flex flex-col gap-2 text-sm font-semibold text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <span>Copyright {new Date().getFullYear()} Summara</span>
        <span className="text-slate-400">Summaries, keywords, and research notes in one focused workspace.</span>
      </div>
    </footer>
  )
}
