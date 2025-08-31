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
    const add
