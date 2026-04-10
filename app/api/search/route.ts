import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { marka, model, yil, km, yakit, vites } = await req.json()

    const queries = [
      `${marka} ${model} ${yil} ikinci el satılık`,
      `${marka} ${model} ${yil} ${km} km sahibinden`,
      `${marka} ${model} ${yil} fiyat`,
    ]

    const results = await Promise.all(
      queries.map(q =>
        fetch('https://google.serper.dev/search', {
          method: 'POST',
          headers: {
            'X-API-KEY': process.env.SERPER_API_KEY!,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ q, gl: 'tr', hl: 'tr', num: 10 }),
        }).then(r => r.json())
      )
    )

    const ilanlar: any[] = []

    results.forEach(result => {
      if (!result.organic) return
      result.organic.forEach((item: any) => {
        const snippet = item.snippet || ''
        const title = item.title || ''
        const link = item.link || ''

        const fiyatMatch = (snippet + title).match(/[\d.,]+\s*(TL|tl|₺)/)
        const kmMatch = (snippet + title).match(/(\d[\d.]+)\s*km/i)

        if (fiyatMatch && (
          link.includes('sahibinden.com') ||
          link.includes('arabam.com') ||
          link.includes('otoendeks.com') ||
          link.includes('carvak.com')
        )) {
          const fiyatStr = fiyatMatch[0].replace(/[^\d]/g, '')
          const fiyat = parseInt(fiyatStr)

          if (fiyat > 100000 && fiyat < 50000000) {
            ilanlar.push({
              baslik: title,
              fiyat,
              km: kmMatch ? kmMatch[1].replace('.', '') : null,
              kaynak: new URL(link).hostname.replace('www.', ''),
              link,
              snippet,
            })
          }
        }
      })
    })

    const fiyatlar = ilanlar.map(i => i.fiyat).filter(Boolean)
    const ortalama = fiyatlar.length
      ? Math.round(fiyatlar.reduce((a, b) => a + b, 0) / fiyatlar.length)
      : 0
    const min = fiyatlar.length ? Math.min(...fiyatlar) : 0
    const max = fiyatlar.length ? Math.max(...fiyatlar) : 0

    return NextResponse.json({
      ilanlar: ilanlar.slice(0, 8),
      ozet: { ortalama, min, max, adet: ilanlar.length }
    })

  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Arama hatası' }, { status: 500 })
  }
}
