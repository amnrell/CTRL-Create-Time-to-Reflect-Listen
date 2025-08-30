'use client'

import { useEffect, useRef, useState } from 'react'

export default function BreathingWidget({ onComplete }: { onComplete?: (seconds?: number) => void }) {
  const [phase, setPhase] = useState<'in' | 'hold' | 'out'>('in')
  const [count, setCount] = useState<number>(4)
  const [running, setRunning] = useState<boolean>(false)
  const [elapsed, setElapsed] = useState<number>(0)
  const timer = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => () => { if (timer.current) clearInterval(timer.current) }, [])

  const tick = () => {
    setElapsed(e => e + 1)
    setCount(c => {
      if (c <= 1) {
        setPhase(p => {
          if (p === 'in') { setCount(4); return 'hold' }
          if (p === 'hold') { setCount(6); return 'out' }
          setCount(4); return 'in'
        })
        return 4
      }
      return c - 1
    })
  }

  const start = () => {
    if (timer.current) clearInterval(timer.current)
    setRunning(true)
    setPhase('in'); setCount(4); setElapsed(0)
    timer.current = setInterval(tick, 1000)
  }

  const finish = () => {
    setRunning(false)
    if (timer.current) clearInterval(timer.current)
    onComplete?.(elapsed)
  }

  return (
    <div className="rounded-xl border p-4 mt-2 flex items-center justify-between bg-white shadow-sm">
      <div>
        <div className="text-sm opacity-70">Pace</div>
        <div className="text-xl font-medium">In 4 • Hold 4 • Out 6</div>
        <div className="mt-1 text-sm">Phase: <b>{phase}</b> — Count: <b>{count}</b></div>
      </div>
      <div className="flex gap-2">
        {!running ? (
          <button className="px-3 py-2 rounded-xl border" onClick={start}>Start 30s</button>
        ) : (
          <button className="px-3 py-2 rounded-xl border" onClick={finish}>Finish</button>
        )}
      </div>
    </div>
  )
}
