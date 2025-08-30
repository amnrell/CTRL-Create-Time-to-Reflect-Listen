'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import BreathingWidget from '../components/BreathingWidget'
import { getStats, saveStats, incReflections, type Stats } from '../lib/storage'

const COPIES = [
  'Take 15s to breathe. In 4, hold 4, out 6. You got this.',
  'Tiny pause, big payoff.',
  'Snooze me if now’s not it. Your pace, your rules.',
  'Write one line: what do I need right now?',
]

export default function Page() {
  const [mode, setMode] = useState<'focus'|'scroll'|'calm'>('focus')
  const [showPrompt, setShowPrompt] = useState(false)
  const [copyIdx, setCopyIdx] = useState(0)
  const [stats, setStats] = useState<Stats>(getStats())
  const tRef = useRef<NodeJS.Timeout | null>(null)

  const cadence = useMemo(() => ({ focus: 25, scroll: 8, calm: 0 }), [])

  useEffect(() => {
    if (mode === 'calm') return
    if (tRef.current) clearInterval(tRef.current)
    tRef.current = setInterval(() => {
      setShowPrompt(true)
      setCopyIdx(i => (i + 1) % COPIES.length)
    }, cadence[mode] * 60 * 1000)
    return () => { if (tRef.current) clearInterval(tRef.current) }
  }, [mode, cadence])

  const onBreathComplete = (seconds = 30) => {
    const add = Math.max(1, Math.round(seconds / 60))
    const next = { ...stats, calmMinutes: stats.calmMinutes + add, sessions: stats.sessions + 1 }
    setStats(next); saveStats(next)
    setShowPrompt(false)
  }

  const snooze = (min = 15) => {
    setShowPrompt(false)
    if (tRef.current) clearInterval(tRef.current)
    tRef.current = setInterval(() => setShowPrompt(true), min * 60 * 1000)
  }

  return (
    <div className="p-6">
      <header className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/hero.svg" alt="CTRL hero" className="w-40 md:w-64" />
        </div>
        <div className="flex gap-2">
          {(['focus','scroll','calm'] as const).map(m => (
            <button key={m} onClick={() => setMode(m)}
              className={`px-3 py-1 rounded-full border ${mode===m?'bg-slate-900 text-white':'bg-white'}`}>{m}</button>
          ))}
        </div>
      </header>

      <main className="max-w-4xl mx-auto mt-6">
        <section className="rounded-2xl border p-5 shadow-sm bg-white">
          <p className="opacity-80">Private stats (local only)</p>
          <div className="mt-2 grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-xl bg-slate-50">Calm min<br/><b>{stats.calmMinutes}</b></div>
            <div className="p-3 rounded-xl bg-slate-50">Reflections<br/><b>{stats.reflections||0}</b></div>
            <div className="p-3 rounded-xl bg-slate-50">Sessions<br/><b>{stats.sessions}</b></div>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border p-5 shadow-sm bg-white">
          <h2 className="text-lg font-medium">Breathing</h2>
          <BreathingWidget onComplete={() => onBreathComplete(30)} />
          <div className="mt-3 flex gap-2">
            <button className="px-3 py-2 rounded-xl border" onClick={() => setShowPrompt(true)}>Prompt now</button>
            <button className="px-3 py-2 rounded-xl border" onClick={() => snooze(15)}>Snooze 15m</button>
            <button className="px-3 py-2 rounded-xl border" onClick={() => { incReflections(); setStats(getStats()); }}>Log reflection</button>
          </div>
        </section>

        {showPrompt && (
          <section className="mt-6 rounded-2xl border p-5 shadow-sm bg-white">
            <p className="mb-2 opacity-70">Heartbeat check</p>
            <p className="text-xl">{COPIES[copyIdx]}</p>
            <div className="mt-3 flex gap-2">
              <button className="px-3 py-2 rounded-xl border" onClick={() => onBreathComplete(30)}>Do 30s breath</button>
              <button className="px-3 py-2 rounded-xl border" onClick={() => setShowPrompt(false)}>Dismiss</button>
              <button className="px-3 py-2 rounded-xl border" onClick={() => snooze(15)}>Snooze</button>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
