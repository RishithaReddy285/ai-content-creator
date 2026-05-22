// Main App with routes
// Folder: client/src/App.jsx

import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import SummaryResult from './pages/SummaryResult'
import History from './pages/History'
import ProtectedRoute from './components/ProtectedRoute'
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
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
          <Route path="/result/:id" element={<ProtectedRoute><SummaryResult/></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><History/></ProtectedRoute>} />
        </Routes>
      </main>
      <Footer />
      <ToastContainer position="top-right" autoClose={2600} />
    </div>
  )
}
