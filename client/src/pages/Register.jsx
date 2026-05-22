// Register page
// Folder: client/src/pages/Register.jsx

import React, { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      setLoading(true)
      const resp = await axios.post('/api/auth/register', { name, email, password })
      localStorage.setItem('token', resp.data.token)
      toast.success('Registered')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-container grid min-h-[620px] items-center gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <aside className="insight-board hidden min-h-[520px] p-8 lg:block">
        <div className="relative flex h-full flex-col justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-slate-500">Create your library</p>
            <h2 className="mt-2 max-w-md text-4xl font-black tracking-tight text-slate-950">Capture the important parts of anything you read.</h2>
          </div>
          <div className="grid gap-4">
            <div className="rounded-3xl bg-white p-5 shadow-xl">
              <div className="mb-4 flex items-center justify-between">
                <span className="chip">Research</span>
                <span className="text-xs font-black text-slate-400">3 min</span>
              </div>
              <div className="space-y-3">
                <div className="mini-bar"><span style={{ width: '84%' }} /></div>
                <div className="mini-bar"><span style={{ width: '68%' }} /></div>
                <div className="mini-bar"><span style={{ width: '52%' }} /></div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <span className="rounded-2xl bg-blue-100 px-3 py-4 text-center text-sm font-black text-blue-700">Brief</span>
              <span className="rounded-2xl bg-emerald-100 px-3 py-4 text-center text-sm font-black text-emerald-700">Notes</span>
              <span className="rounded-2xl bg-amber-100 px-3 py-4 text-center text-sm font-black text-amber-800">PDF</span>
            </div>
          </div>
        </div>
      </aside>

      <section className="surface rounded-[28px] p-6 sm:p-8">
        <p className="mb-2 text-sm font-black uppercase tracking-[0.2em] text-teal-600">Get started</p>
        <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">Create account</h1>
        <p className="mt-3 font-semibold leading-7 text-slate-500">Save every generated summary and build a searchable research history.</p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-extrabold text-slate-700">Name</span>
            <input
              required
              className="field"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
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
              minLength={6}
              className="field"
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <button className="btn-primary w-full" disabled={loading}>{loading ? 'Creating...' : 'Create account'}</button>
        </form>

        <p className="mt-5 text-center text-sm font-semibold text-slate-500">
          Already have an account? <Link to="/login" className="font-black text-blue-600 hover:text-blue-700">Login</Link>
        </p>
      </section>
    </div>
  )
}
