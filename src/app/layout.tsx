import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Piano Sight Reading Practice',
  description: 'Practice piano sight reading with interactive musical staff',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}