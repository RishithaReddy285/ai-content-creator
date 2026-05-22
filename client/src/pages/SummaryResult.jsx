// Summary result page
// Folder: client/src/pages/SummaryResult.jsx

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { jsPDF } from 'jspdf'

export default function SummaryResult() {
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSummary() {
      try {
        const token = localStorage.getItem('token')
        const resp = await axios.get(`/api/history/${id}`, { headers: { Authorization: `Bearer ${token}` } })
        setData(resp.data.data)
      } catch (err) {
        toast.error('Unable to fetch summary')
      } finally {
        setLoading(false)
      }
    }
    fetchSummary()
  }, [id])

  async function copySummary() {
    try {
      await navigator.clipboard.writeText(data.generatedSummary)
      toast.success('Copied to clipboard')
    } catch (err) {
      toast.error('Copy failed')
    }
  }

  function downloadPdf() {
    const doc = new jsPDF()
    doc.setFontSize(16)
    doc.text('Summary', 10, 14)
    doc.setFontSize(11)
    const lines = doc.splitTextToSize(data.generatedSummary, 180)
    doc.text(lines, 10, 26)
    doc.save('summary.pdf')
  }

  if (loading) {
    return <div className="app-container surface rounded-3xl p-8 text-center font-bold text-slate-500">Loading summary...</div>
  }

  if (!data) {
    return (
      <div className="app-container surface rounded-3xl p-10 text-center">
        <h1 className="text-2xl font-black text-slate-950">Summary not found</h1>
        <Link to="/history" className="btn-primary mt-5">Back to history</Link>
      </div>
    )
  }

  return (
    <div className="app-container space-y-6">
      <section className="surface rounded-[28px] p-6 sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-sm font-black uppercase tracking-[0.2em] text-teal-600">Generated brief</p>
            <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">Summary</h1>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="chip capitalize">{data.summaryLength}</span>
              <span className="chip">{data.readingTimeOriginal || 0} min source</span>
              <span className="chip">{data.readingTimeSummary || 0} min brief</span>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button onClick={copySummary} className="btn-secondary">Copy</button>
            <button onClick={downloadPdf} className="btn-primary">Download PDF</button>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_0.38fr]">
        <article className="surface rounded-[24px] p-6 sm:p-8">
          <h2 className="mb-4 text-xl font-black text-slate-950">Generated Summary</h2>
          <p className="whitespace-pre-line text-lg font-semibold leading-9 text-slate-700">{data.generatedSummary}</p>
        </article>

        <aside className="space-y-6">
          <div className="metric-card">
            <h3 className="text-lg font-black text-slate-950">Keywords</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {(data.keywords || []).length ? (
                data.keywords.map(keyword => <span key={keyword} className="chip">{keyword}</span>)
              ) : (
                <p className="font-semibold text-slate-500">No keywords saved.</p>
              )}
            </div>
          </div>

          <div className="insight-board p-5">
            <div className="relative">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-slate-500">Compression</p>
              <p className="mt-2 text-4xl font-black text-slate-950">
                {Math.max(0, (data.readingTimeOriginal || 0) - (data.readingTimeSummary || 0))}
              </p>
              <p className="font-semibold text-slate-500">minutes saved</p>
              <div className="mt-5 space-y-3">
                <div className="mini-bar"><span style={{ width: '90%' }} /></div>
                <div className="mini-bar"><span style={{ width: '56%' }} /></div>
              </div>
            </div>
          </div>
        </aside>
      </section>

      <section className="surface rounded-[24px] p-6 sm:p-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-950">Original Content</h2>
          <Link to="/history" className="text-sm font-black text-blue-600 hover:text-blue-700">Back to history</Link>
        </div>
        <div className="max-h-[360px] overflow-auto rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <p className="whitespace-pre-line text-sm font-semibold leading-7 text-slate-600">{data.originalContent}</p>
        </div>
      </section>
    </div>
  )
}
