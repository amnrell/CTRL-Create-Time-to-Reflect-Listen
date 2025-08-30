export type Stats = { calmMinutes: number; reflections: number; sessions: number }

const KEY = 'ctrl_stats'

export function getStats(): Stats {
  if (typeof window === 'undefined') return { calmMinutes: 0, reflections: 0, sessions: 0 }
  try {
    return JSON.parse(localStorage.getItem(KEY) || 'null') || { calmMinutes: 0, reflections: 0, sessions: 0 }
  } catch {
    return { calmMinutes: 0, reflections: 0, sessions: 0 }
  }
}

export function saveStats(stats: Stats) {
  if (typeof window === 'undefined') return
  localStorage.setItem(KEY, JSON.stringify(stats))
}

export function incReflections() {
  const s = getStats()
  s.reflections = (s.reflections || 0) + 1
  saveStats(s)
}
