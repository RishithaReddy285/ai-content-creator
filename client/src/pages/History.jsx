// History page
// Folder: client/src/pages/History.jsx

import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

export default function History() {
  const [items, setItems] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchList() }, [])

  async function fetchList() {
    try {
      const resp = await axios.get('/api/history')
      setItems(resp.data.data || [])
    } catch (err) {
      toast.error('Failed to load history')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this summary?')) return
    try {
      await axios.delete(`/api/history/${id}`)
      toast.success('Deleted')
      setItems(items.filter(i => i._id !== id))
    } catch (err) {
      toast.error('Delete failed')
    }
  }

  const filteredItems = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return items
    return items.filter(item => {
      const summary = item.generatedSummary?.toLowerCase() || ''
      const original = item.originalContent?.toLowerCase() || ''
      const keywords = (item.keywords || []).join(' ').toLowerCase()
      return summary.includes(normalized) || original.includes(normalized) || keywords.includes(normalized)
    })
  }, [items, query])

  return (
    <div className="app-container space-y-6">
      <section className="surface rounded-[28px] p-6 sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-sm font-black uppercase tracking-[0.2em] text-teal-600">Saved work</p>
            <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">History</h1>
            <p className="mt-3 max-w-2xl text-base font-semibold leading-7 text-slate-500">
              Search summaries, revisit keywords, and open any brief for export.
            </p>
          </div>
          <Link to="/" className="btn-primary w-full sm:w-auto">New summary</Link>
        </div>

        <div className="mt-6">
          <input
            className="field"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by summary, source text, or keyword"
          />
        </div>
      </section>

      {loading && (
        <div className="surface rounded-3xl p-8 text-center font-bold text-slate-500">Loading summaries...</div>
      )}

      {!loading && filteredItems.length === 0 && (
        <div className="surface rounded-3xl p-10 text-center">
          <h2 className="text-2xl font-black text-slate-950">{items.length ? 'No matches found' : 'No saved summaries yet'}</h2>
          <p className="mx-auto mt-2 max-w-md font-semibold leading-7 text-slate-500">
            {items.length ? 'Try another search term.' : 'Create a summary and your saved brief will appear here.'}
          </p>
          <Link to="/" className="btn-primary mt-6">Create summary</Link>
        </div>
      )}

      <ul className="grid gap-4 md:grid-cols-2">
        {filteredItems.map(item => (
          <li key={item._id} className="metric-card flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="chip capitalize">{item.summaryLength}</span>
                <span className="text-sm font-bold text-slate-400">{new Date(item.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-3">
                <Link to={`/result/${item._id}`} className="text-sm font-black text-blue-600 hover:text-blue-700">Open</Link>
                <button onClick={() => handleDelete(item._id)} className="text-sm font-black text-rose-600 hover:text-rose-700">Delete</button>
              </div>
            </div>

            <p className="line-clamp-4 min-h-[84px] font-semibold leading-7 text-slate-700">
              {item.generatedSummary}
            </p>

            <div className="flex flex-wrap gap-2">
              {(item.keywords || []).slice(0, 5).map(keyword => (
                <span key={keyword} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">{keyword}</span>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
