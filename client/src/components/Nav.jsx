// Navbar component
// Folder: client/src/components/Nav.jsx

import React from 'react'
import { Link, NavLink } from 'react-router-dom'

export default function Nav() {
  return (
    <nav className="sticky top-0 z-30 border-b border-white/70 bg-white/82 backdrop-blur-xl">
      <div className="app-container flex items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-3">
          <span className="brand-mark">S</span>
          <span>
            <span className="block text-lg font-black leading-tight tracking-tight">Summara</span>
            <span className="block text-xs font-bold uppercase tracking-[0.18em] text-slate-500">AI workspace</span>
          </span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Create</NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Dashboard</NavLink>
          <NavLink to="/history" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>History</NavLink>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/" className="btn-primary min-h-10 px-3 py-2 text-sm">Start</Link>
        </div>
      </div>
      <div className="app-container flex gap-5 pb-3 md:hidden">
        <NavLink to="/" className={({ isActive }) => `nav-link text-sm ${isActive ? 'active' : ''}`}>Create</NavLink>
        <NavLink to="/dashboard" className={({ isActive }) => `nav-link text-sm ${isActive ? 'active' : ''}`}>Dashboard</NavLink>
        <NavLink to="/history" className={({ isActive }) => `nav-link text-sm ${isActive ? 'active' : ''}`}>History</NavLink>
      </div>
    </nav>
  )
}
