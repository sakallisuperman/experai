@import type { Metadata } from 'next'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'

export const metadata: Metadata = {
  title: 'ExperAI — Araç Yatırım Asistanı',
  description: 'AI destekli ikinci el araç fiyat analizi, risk skoru ve kâr hesabı. Doğru fiyat, akıllı yatırım.',
  keywords: ['ikinci el araba', 'araç değerleme', 'araba fiyat analizi', 'AI araç', 'Türkiye araba'],
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  openGraph: {
    title: 'ExperAI — Araç Yatırım Asistanı',
    description: 'AI destekli ikinci el araç fiyat analizi',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="tr">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        </head>
        <body className="font-sans antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
