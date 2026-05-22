// Main App with routes
// Folder: client/src/App.jsx

import React from 'react'
import { Navigate, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import SummaryResult from './pages/SummaryResult'
import History from './pages/History'
import Nav from './components/Nav'
import Footer from './components/Footer'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col text-slate-900">
      <Nav />
      <main className="flex-grow w-full py-8 md:py-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/register" element={<Navigate to="/" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/result/:id" element={<SummaryResult />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </main>
      <Footer />
      <ToastContainer position="top-right" autoClose={2600} />
    </div>
  )
}
