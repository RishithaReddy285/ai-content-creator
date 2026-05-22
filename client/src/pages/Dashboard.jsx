// Dashboard page
// Folder: client/src/pages/Dashboard.jsx

import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

export default function Dashboard() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const token = localStorage.getItem('token')
        const resp = await axios.get('/api/history', { headers: { Authorization: `Bearer ${token}` } })
        setItems(resp.data.data || [])
      } catch (err) {
        toast.error('Unable to load dashboard')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const stats = useMemo(() => {
    const totalOriginal = items.reduce((sum, item) => sum + (item.readingTimeOriginal || 0), 0)
    const totalSummary = items.reduce((sum, item) => sum + (item.readingTimeSummary || 0), 0)
    const keywords = new Set(items.flatMap(item => item.keywords || []))

    return {
      summaries: items.length,
      minutesSaved: Math.max(0, totalOriginal - totalSummary),
      keywords: keywords.size,
      latest: items[0]?.createdAt ? new Date(items[0].createdAt).toLocaleDateString() : 'No activity'
    }
  }, [items])

  const recentItems = items.slice(0, 4)

  return (
    <div className="app-container space-y-7">
      <section className="surface rounded-[28px] p-6 sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-sm font-black uppercase tracking-[0.2em] text-teal-600">Workspace overview</p>
            <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">Your summary command center.</h1>
            <p className="mt-3 max-w-2xl text-base font-semibold leading-7 text-slate-500">
              Track saved briefs, reading time, and the keywords your content keeps returning to.
            </p>
          </div>
          <Link to="/" className="btn-primary w-full sm:w-auto">Create summary</Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <div className="metric-card">
          <p className="text-sm font-black text-slate-500">Summaries</p>
          <p className="mt-3 text-4xl font-black text-slate-950">{loading ? '-' : stats.summaries}</p>
        </div>
        <div className="metric-card">
          <p className="text-sm font-black text-slate-500">Minutes saved</p>
          <p className="mt-3 text-4xl font-black text-slate-950">{loading ? '-' : stats.minutesSaved}</p>
        </div>
        <div className="metric-card">
          <p className="text-sm font-black text-slate-500">Keywords</p>
          <p className="mt-3 text-4xl font-black text-slate-950">{loading ? '-' : stats.keywords}</p>
        </div>
        <div className="metric-card">
          <p className="text-sm font-black text-slate-500">Latest</p>
          <p className="mt-3 text-2xl font-black text-slate-950">{loading ? '-' : stats.latest}</p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_0.75fr]">
        <div className="surface rounded-[24px] p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-950">Recent summaries</h2>
            <Link to="/history" className="text-sm font-black text-blue-600 hover:text-blue-700">View all</Link>
          </div>

          {loading && <p className="font-semibold text-slate-500">Loading your workspace...</p>}

          {!loading && recentItems.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
              <h3 className="text-xl font-black text-slate-950">No summaries yet</h3>
              <p className="mt-2 font-semibold text-slate-500">Create your first brief and it will appear here.</p>
              <Link to="/" className="btn-primary mt-5">Start summarizing</Link>
            </div>
          )}

          <div className="space-y-3">
            {recentItems.map(item => (
              <Link
                to={`/result/${item._id}`}
                key={item._id}
                className="block rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg"
              >
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="chip capitalize">{item.summaryLength}</span>
                  <span className="text-sm font-bold text-slate-400">{new Date(item.createdAt).toLocaleString()}</span>
                </div>
                <p className="line-clamp-2 font-semibold leading-7 text-slate-700">{item.generatedSummary}</p>
              </Link>
            ))}
          </div>
        </div>

        <aside className="insight-board p-6">
          <div className="relative">
            <p className="mb-2 text-sm font-black uppercase tracking-[0.2em] text-slate-500">Focus mix</p>
            <h2 className="text-2xl font-black text-slate-950">Summary habits</h2>
            <div className="mt-6 space-y-5">
              {['short', 'medium', 'long'].map((length, index) => {
                const count = items.filter(item => item.summaryLength === length).length
                const percent = items.length ? Math.max(12, Math.round((count / items.length) * 100)) : [72, 46, 28][index]
                return (
                  <div key={length}>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-black capitalize text-slate-700">{length}</span>
                      <span className="text-sm font-black text-slate-400">{count}</span>
                    </div>
                    <div className="mini-bar"><span style={{ width: `${percent}%` }} /></div>
                  </div>
                )
              })}
            </div>
          </div>
        </aside>
      </section>
    </div>
  )
}
