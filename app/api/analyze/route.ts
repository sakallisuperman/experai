import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const { arac, piyasa, mod, kullanici, parcalar } = await req.json()

    const parcaBilgi = parcalar && parcalar.length > 0
      ? `Boyalı/değişen parçalar: ${parcalar.map((p: any) => `${p.isim} (${p.tip})`).join(', ')}`
      : 'Boyasız, hasarsız'

    const modAciklama = {
      'flip': 'Hızlı al-sat (flip) modu — kısa sürede kâr hedefi',
      'beklet': 'Beklet/yatırım modu — uzun vadeli değer artışı',
      'fiyat': 'Sadece fiyat öğrenme modu',
    }[mod] || 'Genel analiz'

    const kullaniciTip = kullanici === 'galeri'
      ? 'Galerici/trader (komisyon, vergi ve stok maliyeti hesaba katılmalı)'
      : 'Bireysel alıcı/satıcı'

    const prompt = `Sen Türkiye ikinci el araç piyasasının uzman analistisin. Aşağıdaki araç için detaylı analiz yap.

ARAÇ BİLGİLERİ:
- ${arac.marka} ${arac.model} ${arac.yil}
- Kilometre: ${arac.km} km
- Yakıt: ${arac.yakit} | Vites: ${arac.vites}
- Motor: ${arac.motor_gucu} HP / ${arac.motor_hacmi}
- Kasa: ${arac.kasa} | Renk: ${arac.renk}
- İlan fiyatı: ${arac.ilan_fiyati ? arac.ilan_fiyati.toLocaleString('tr-TR') + ' TL' : 'Belirtilmedi'}
- Hasar durumu: ${parcaBilgi}

PİYASA VERİLERİ (${piyasa.adet} ilan analiz edildi):
- Ortalama fiyat: ${piyasa.ortalama.toLocaleString('tr-TR')} TL
- Min: ${piyasa.min.toLocaleString('tr-TR')} TL
- Max: ${piyasa.max.toLocaleString('tr-TR')} TL

KULLANICI PROFİLİ: ${kullaniciTip}
AMAÇ: ${modAciklama}

Aşağıdaki formatta JSON olarak yanıt ver, başka hiçbir şey yazma:

{
  "karar": "AL" | "DIKKATLI_OL" | "KACIN",
  "karar_aciklama": "tek cümle net karar gerekçesi",
  "piyasa_degeri": sayı (TL),
  "max_alim_fiyati": sayı (TL),
  "hedef_satis_fiyati": sayı (TL),
  "tahmini_kar": sayı (TL),
  "satis_suresi": "Hızlı (1 hafta)" | "Normal (2-4 hafta)" | "Yavaş (1-2 ay)",
  "risk_skoru": 1-10 arası sayı,
  "risk_aciklamasi": "risk detayı",
  "risk_items": ["madde1", "madde2", "madde3"],
  "kronik_sorunlar": "bu model ve km için bilinen sorunlar ve tahmini masraf",
  "pazarlik_nazik": "nazik pazarlık cümlesi",
  "pazarlik_dengeli": "dengeli pazarlık cümlesi", 
  "pazarlik_sert": "sert pazarlık cümlesi",
  "ai_yorum": "2-3 cümle genel değerlendirme",
  "fiyat_etkisi": sayı (hasar/boya nedeniyle düşen TL değeri, negatif olabilir)
}`

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 1000,
    })

    const raw = completion.choices[0].message.content || ''
    const jsonMatch = raw.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('JSON parse hatası')

    const analiz = JSON.parse(jsonMatch[0])
    return NextResponse.json({ analiz })

  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Analiz hatası' }, { status: 500 })
  }
}
