import './globals.css'

export const metadata = {
  title: 'CTRL — Create Time to Reflect & Listen',
  description: 'Gentle heartbeat checks for calmer focus',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-800">
        {children}
      </body>
    </html>
  )
}
