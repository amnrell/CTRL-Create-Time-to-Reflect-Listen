# CTRL-Create-Time-to-Reflect-Listen# CTRL — Create Time to Reflect & Listen

*A gentle, privacy‑first stress relief & focus app that nudges healthier engagement without shaming.*

---

## ✨ Elevator Pitch

CTRL adds soft, opt‑in “heartbeat” moments to your day—brief breathing cues, tiny reflections, and intentional breaks—so doom‑scrolling and stress don’t run the show. It’s local‑first, open‑source, and built to be kind.

---

## 🧭 Product Principles

* **Supportive, not shaming.** Language stays kind and opt‑in.
* **Private by default.** Local stats; cloud sync is optional and explicit.
* **Low friction.** One‑tap snooze, no guilt streaks, no nagging.
* **Accessible.** Keyboard friendly, screen‑reader tested, dyslexia‑friendly copy.

---

## 🎯 Core Features (MVP)

* **Heartbeat Checks**: gentle, snoozable micro‑prompts (15–60s) with breath pacing (4‑4‑6) and quick reflections.
* **Modes**: *Focus* (scheduled breaks; minimal prompts), *Scroll* (more frequent nudges), *Calm* (just breathing).
* **Progress w/o pressure**: private stats (calm minutes, reflections, sessions) stored locally.
* **Copy Variants**: rotating supportive prompts to avoid prompt fatigue.
* **Privacy‑first Telemetry**: none by default; optional opt‑in later.

---

## 🧱 Tech Outline

* **Frontend**: React + Vite + Tailwind.
* **State**: React hooks.
* **Storage**: `localStorage` (MVP), optional **Supabase** for sync (later).
* **Testing**: Vitest + React Testing Library (later).
* **CI**: GitHub Actions (lint, format, test) (later).

---

## 🗺️ Roadmap

**Phase 0 — MVP (Weeks 1–2)**

* [ ] Breathing widget (4‑4‑6), start/stop.
* [ ] Prompt scheduler (every N minutes; snooze).
* [ ] Local stats (calm minutes, reflections, sessions).
* [ ] Modes: Focus / Scroll / Calm.
* [ ] Copy variants library; A11y pass.

**Phase 1 — Beta (Weeks 3–4)**

* [ ] Export "Calm Log" (CSV/PDF).
* [ ] Settings: cadence, tone, duration.
* [ ] Optional Supabase sync toggle.
* [ ] Basic tests; CI.

**Phase 2 — v1 (Weeks 5–8)**

* [ ] Artist voice packs (licensed) — stretch.
* [ ] Taggable reflections + calendar view.
* [ ] Theming & widgets (desktop/mobile).

---

## 🗣️ Copy Variants (Supportive)

* *“Take 15s to breathe. In 4, hold 4, out 6. You got this.”*
* *“Tiny pause, big payoff. One slow breath together—then back to it.”*
* *“Snooze me if now’s not it. Your pace, your rules.”*
* *“Write one line: what do I need right now?”*
* *“Let’s trade 30s for clarity.”*

---

## 🔐 Privacy & Data

* Local by default. No trackers. No 3rd‑party pixels.
* Optional cloud sync via Supabase (user‑controlled). Encryption at rest; environment keys not bundled in client.

---

## 🧩 Repo Structure (proposed)

```
ctrl/
├─ README.md
├─ LICENSE (MIT)
├─ package.json
├─ vite.config.js
├─ postcss.config.js
├─ tailwind.config.js
├─ .gitignore
├─ .env.example  # SUPABASE_URL, SUPABASE_ANON_KEY (later)
├─ index.html
├─ src/
│  ├─ main.jsx
│  ├─ index.css
│  ├─ App.jsx
│  ├─ components/
│  │  └─ BreathingWidget.jsx
│  └─ lib/
│     └─ storage.js
└─ public/
   └─ hero.svg
```

---

## 🛠️ Local Dev (short)

```bash
npm install
npm run dev   # starts Vite dev server
npm run build # production build
```

---

## 🤝 Contributing (starter)

1. Fork → create feature branch → PR with a clear description.
2. Keep components small; prefer hooks; keep A11y in mind.
3. Use conventional commits (`feat:`, `fix:`, etc.).
4. Open a **Discussion** for UX copy ideas and new prompt tones.

**Labels**: `good first issue`, `help wanted`, `a11y`, `copy`, `feature`, `bug`.

---

## 📣 Outreach Blurb (paste into GitHub README/Discussions)

> CTRL is an open‑source, privacy‑first stress‑relief and focus app. We’re building gentle heartbeat prompts, breathing exercises, and reflection nudges that respect your attention. Looking for collaborators who care about ethical tech, A11y, and calm design. Jump in with copy ideas, UI components, or sync integrations.

---

## 📄 License

MIT. Use freely; please keep the supportive ethos.

---

## 🖼️ Hero Image (to‑do)

We’ll generate a soft, minimalist hero (calm gradients, subtle heart glyph) and export `public/hero.svg`. Ping when ready and we’ll produce variants.

---

## 🔜 Next Steps

* Create repo `ctrl` on GitHub, commit the starter scaffold (provided in the downloadable zip).
* Open 5–8 `good first issue`s (copy ideas, a11y checks, tests) to invite collaboration.
* Share the Outreach Blurb on X/Bluesky/Reddit r/opensource.

---

## 🧩 App.jsx (excerpt, MVP controls)

> Full code is included in the downloadable starter; this excerpt shows the core pattern.

```jsx
import { useEffect, useMemo, useRef, useState } from "react";
import BreathingWidget from "./components/BreathingWidget.jsx";
import { getStats, saveStats } from "./lib/storage.js";

const COPIES = [
  "Take 15s to breathe. In 4, hold 4, out 6.",
  "Tiny pause, big payoff.",
  "Snooze me if now’s not it.",
  "Write one line: what do I need right now?",
];

export default function App() {
  const [mode, setMode] = useState("focus"); // focus | scroll | calm
  const [nextIn, setNextIn] = useState(5);   // minutes between prompts
  const [showPrompt, setShowPrompt] = useState(false);
  const [copyIdx, setCopyIdx] = useState(0);
  const [stats, setStats] = useState(getStats());
  const tRef = useRef(null);

  // cadence per mode
  const cadence = useMemo(() => ({
    focus: 25, // break every 25m
    scroll: 8, // nudge every 8m
    calm: 0,   // manual
  }), []);

  useEffect(() => {
    if (mode === "calm") return; // manual only
    setNextIn(cadence[mode]);
    clearInterval(tRef.current);
    tRef.current = setInterval(() => {
      setShowPrompt(true);
      setCopyIdx((i) => (i + 1) % COPIES.length);
    }, cadence[mode] * 60 * 1000);
    return () => clearInterval(tRef.current);
  }, [mode, cadence]);

  const onBreathComplete = (seconds = 30) => {
    const add = Math.round(seconds / 60);
    const next = { ...stats, calmMinutes: stats.calmMinutes + add, sessions: stats.sessions + 1 };
    setStats(next); saveStats(next);
    setShowPrompt(false);
  };

  const snooze = (min = 15) => {
    setShowPrompt(false);
    clearInterval(tRef.current);
    tRef.current = setInterval(() => setShowPrompt(true), min * 60 * 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-800 p-6">
      <header className="max-w-3xl mx-auto flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-semibold">CTRL — Create Time to Reflect & Listen</h1>
        <div className="flex gap-2">
          {['focus','scroll','calm'].map(m => (
            <button key={m} onClick={() => setMode(m)}
              className={`px-3 py-1 rounded-full border ${mode===m?'bg-slate-900 text-white':'bg-white'}`}>{m}</button>
          ))}
        </div>
      </header>

      <main className="max-w-3xl mx-auto mt-6">
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
  );
}
```

---

## 📦 What’s included in the downloadable starter

* GitHub‑ready scaffold with React + Vite + Tailwind.
* README, MIT License, `.gitignore`, `.env.example` (for future Supabase).
* Minimal Breathing widget, local‑stats utility, supportive copy.
* Placeholder hero (`public/hero.svg`).

---

## 🧵 Quick GitHub push (after unzipping)

```bash
git init
git add .
git commit -m "feat: init CTRL MVP"
git branch -M main
git remote add origin YOUR_REPO_URL
git push -u origin main
```

> Want a generated hero image next? Say the vibe (soft gradient? line art heart?) and I’ll produce variants and drop them into `/public/hero.svg`.
