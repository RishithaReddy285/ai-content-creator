// Login page
// Folder: client/src/pages/Login.jsx

import React, { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      setLoading(true)
      const resp = await axios.post('/api/auth/login', { email, password })
      localStorage.setItem('token', resp.data.token)
      toast.success('Logged in')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-container grid min-h-[620px] items-center gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <section className="surface rounded-[28px] p-6 sm:p-8">
        <p className="mb-2 text-sm font-black uppercase tracking-[0.2em] text-teal-600">Welcome back</p>
        <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">Login</h1>
        <p className="mt-3 font-semibold leading-7 text-slate-500">Open your workspace and continue from your saved summaries.</p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-extrabold text-slate-700">Email</span>
            <input
              type="email"
              required
              className="field"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-extrabold text-slate-700">Password</span>
            <input
              type="password"
              required
              className="field"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <button className="btn-primary w-full" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
        </form>

        <p className="mt-5 text-center text-sm font-semibold text-slate-500">
          New here? <Link to="/register" className="font-black text-blue-600 hover:text-blue-700">Create an account</Link>
        </p>
      </section>

      <aside className="insight-board hidden min-h-[520px] p-8 lg:block">
        <div className="relative flex h-full flex-col justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-slate-500">Saved intelligence</p>
            <h2 className="mt-2 max-w-sm text-4xl font-black tracking-tight text-slate-950">A cleaner home for your reading workflow.</h2>
          </div>
          <div className="space-y-4 rounded-3xl bg-slate-950 p-5 text-white shadow-2xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-[0.18em] text-blue-200">Today</span>
              <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-black text-emerald-200">Synced</span>
            </div>
            <div className="space-y-3">
              <div className="h-3 w-full rounded-full bg-white/85" />
              <div className="h-3 w-9/12 rounded-full bg-white/65" />
              <div className="h-3 w-7/12 rounded-full bg-white/45" />
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-3xl font-black">12</p>
                <p className="text-sm font-bold text-blue-100">briefs</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-3xl font-black">41</p>
                <p className="text-sm font-bold text-blue-100">min saved</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  )
}
