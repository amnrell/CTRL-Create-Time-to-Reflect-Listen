'use client'

export default function Page() {
  return (
    <main className="p-6 max-w-5xl mx-auto">
      <img
        src="/hero.svg"
        alt="CTRL hero"
        className="mx-auto block w-full max-w-[900px] h-auto rounded-xl shadow-sm"
      />
      <h1 className="text-3xl font-semibold mt-6 text-center">
        CTRL — Create Time to Reflect &amp; Listen
      </h1>
      <p className="mt-2 text-slate-600 text-center">
        Deployment check: if you see this, Next.js is running.
      </p>
    </main>
  )
}
