import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ExperAI — Araç Yatırım Asistanı',
  description: 'AI destekli ikinci el araç fiyat analizi, risk skoru ve kâr hesabı',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body style={{fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'}}>
        {children}
      </body>
    </html>
  )
}
