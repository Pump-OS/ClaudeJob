import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ClawdJob | AI Job Hunter Experiment',
  description: 'Watch Claude AI search for a real job in real-time. An experimental journey of an AI trying to get hired.',
  keywords: ['AI', 'Claude', 'Job Search', 'Experiment', 'Live'],
  openGraph: {
    title: 'ClawdJob | AI Job Hunter Experiment',
    description: 'Watch Claude AI search for a real job in real-time',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-coal-darker warm-grid texture-overlay">
        {/* Warm gradient overlay */}
        <div className="fixed inset-0 bg-gradient-to-br from-coal-darker via-coal-dark to-coal-darker -z-10" />
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(223,193,145,0.05),transparent_50%)] -z-10" />
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(196,103,51,0.03),transparent_50%)] -z-10" />
        {children}
      </body>
    </html>
  )
}
