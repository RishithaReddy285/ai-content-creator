// Home page - summary workspace
// Folder: client/src/pages/Home.jsx

import React, { useMemo, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const modes = [
  { id: 'text', label: 'Text' },
  { id: 'url', label: 'URL' },
  { id: 'file', label: 'File' }
]

const lengthOptions = [
  { value: 'short', label: 'Short' },
  { value: 'medium', label: 'Medium' },
  { value: 'long', label: 'Long' }
]

const toneOptions = ['Neutral', 'Executive', 'Academic', 'Friendly']
const languageOptions = ['English', 'Hindi', 'Spanish', 'French']

export default function Home() {
  const [mode, setMode] = useState('text')
  const [content, setContent] = useState('')
  const [url, setUrl] = useState('')
  const [file, setFile] = useState(null)
  const [summaryLength, setSummaryLength] = useState('short')
  const [language, setLanguage] = useState('English')
  const [tone, setTone] = useState('Neutral')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const wordCount = useMemo(() => {
    return content.trim() ? content.trim().split(/\s+/).length : 0
  }, [content])

  const estimatedMinutes = Math.max(1, Math.ceil(wordCount / 200))
  const compression = summaryLength === 'short' ? 74 : summaryLength === 'medium' ? 58 : 42

  async function handleSubmit(e) {
    e.preventDefault()
    const token = localStorage.getItem('token')

    if (!token) {
      toast.info('Login to save summaries and history')
      navigate('/login')
      return
    }

    try {
      setLoading(true)
      const headers = { Authorization: `Bearer ${token}` }
      let resp

      if (mode === 'text') {
        if (!content.trim()) {
          toast.error('Add text before summarizing')
          return
        }
        resp = await axios.post('/api/summaries/text', { content, summaryLength, language, tone }, { headers })
      }

      if (mode === 'url') {
        if (!url.trim()) {
          toast.error('Add a URL before summarizing')
          return
        }
        resp = await axios.post('/api/summaries/url', { url, summaryLength, language, tone }, { headers })
      }

      if (mode === 'file') {
        if (!file) {
          toast.error('Choose a PDF, DOCX, or text file')
          return
        }
        const formData = new FormData()
        formData.append('file', file)
        formData.append('summaryLength', summaryLength)
        formData.append('language', language)
        formData.append('tone', tone)
        resp = await axios.post('/api/summaries/upload', formData, { headers })
      }

      toast.success('Summary generated')
      navigate(`/result/${resp.data.data._id}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error generating summary')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-container space-y-8">
      <section className="grid items-start gap-6 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="surface rounded-[28px] p-5 sm:p-7">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="mb-2 text-sm font-black uppercase tracking-[0.2em] text-teal-600">AI content studio</p>
              <h1 className="max-w-2xl text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">
                Turn long content into a sharp, useful brief.
              </h1>
            </div>
            <Link to="/history" className="btn-secondary shrink-0">View history</Link>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="inline-flex rounded-2xl bg-slate-100 p-1">
              {modes.map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setMode(item.id)}
                  className={`mode-tab ${mode === item.id ? 'active' : ''}`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {mode === 'text' && (
              <div>
                <label className="mb-2 block text-sm font-extrabold text-slate-700">Source text</label>
                <textarea
                  className="field min-h-[260px] resize-y leading-7"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Paste an article, transcript, report, or notes..."
                />
                <div className="mt-2 flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-500">
                  <span>{wordCount} words</span>
                  <span className="text-slate-300">/</span>
                  <span>{estimatedMinutes} min read</span>
                </div>
              </div>
            )}

            {mode === 'url' && (
              <div>
                <label className="mb-2 block text-sm font-extrabold text-slate-700">Article URL</label>
                <input
                  className="field"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/long-read"
                />
              </div>
            )}

            {mode === 'file' && (
              <div>
                <label className="mb-2 block text-sm font-extrabold text-slate-700">Upload document</label>
                <label className="flex min-h-[190px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/55 px-6 text-center transition hover:border-blue-400 hover:bg-blue-50">
                  <input
                    type="file"
                    className="sr-only"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                  <span className="mb-2 text-lg font-black text-slate-900">{file ? file.name : 'Choose a document'}</span>
                  <span className="text-sm font-semibold text-slate-500">PDF, DOCX, and TXT files are supported.</span>
                </label>
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-3">
              <label className="block">
                <span className="mb-2 block text-sm font-extrabold text-slate-700">Length</span>
                <select className="field" value={summaryLength} onChange={(e) => setSummaryLength(e.target.value)}>
                  {lengthOptions.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-extrabold text-slate-700">Tone</span>
                <select className="field" value={tone} onChange={(e) => setTone(e.target.value)}>
                  {toneOptions.map(item => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-extrabold text-slate-700">Language</span>
                <select className="field" value={language} onChange={(e) => setLanguage(e.target.value)}>
                  {languageOptions.map(item => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-xl text-sm font-semibold leading-6 text-slate-500">
                Your summaries are saved to history with keywords, reading time, and PDF export.
              </p>
              <button className="btn-primary" disabled={loading}>
                {loading ? 'Generating...' : 'Summarize now'}
              </button>
            </div>
          </form>
        </div>

        <aside className="insight-board p-5 sm:p-6">
          <div className="relative space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.18em] text-slate-500">Live brief</p>
                <h2 className="text-2xl font-black text-slate-950">Output preview</h2>
              </div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700">Ready</span>
            </div>

            <div className="rounded-2xl bg-slate-950 p-5 text-white shadow-2xl">
              <div className="mb-5 flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-[0.18em] text-blue-200">Summary signal</span>
                <span className="text-xs font-black text-emerald-300">{compression}% shorter</span>
              </div>
              <div className="space-y-3">
                <div className="h-3 w-11/12 rounded-full bg-white/88" />
                <div className="h-3 w-10/12 rounded-full bg-white/72" />
                <div className="h-3 w-8/12 rounded-full bg-white/55" />
              </div>
              <div className="mt-6 grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-white/10 p-3">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-blue-100">Length</p>
                  <p className="mt-1 text-lg font-black capitalize">{summaryLength}</p>
                </div>
                <div className="rounded-xl bg-white/10 p-3">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-blue-100">Tone</p>
                  <p className="mt-1 truncate text-lg font-black">{tone}</p>
                </div>
                <div className="rounded-xl bg-white/10 p-3">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-blue-100">Type</p>
                  <p className="mt-1 text-lg font-black capitalize">{mode}</p>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="metric-card">
                <p className="text-sm font-black text-slate-500">Keyword map</p>
                <div className="mt-4 space-y-3">
                  <div className="mini-bar"><span style={{ width: '88%' }} /></div>
                  <div className="mini-bar"><span style={{ width: '62%' }} /></div>
                  <div className="mini-bar"><span style={{ width: '74%' }} /></div>
                </div>
              </div>
              <div className="metric-card">
                <p className="text-sm font-black text-slate-500">Reading time</p>
                <p className="mt-3 text-4xl font-black text-slate-950">{Math.max(1, Math.ceil(estimatedMinutes * 0.35))}</p>
                <p className="text-sm font-semibold text-slate-500">minutes after summary</p>
              </div>
            </div>

            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-extrabold leading-6 text-amber-900">
                Best for research notes, meeting transcripts, newsletters, articles, policies, and study material.
              </p>
            </div>
          </div>
        </aside>
      </section>
    </div>
  )
}
