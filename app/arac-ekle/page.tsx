'use client'

import { useState } from 'react'
import { useAuth, useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import { Car, AlertCircle, Loader2 } from 'lucide-react'
import { MARKALAR } from '@/lib/carData'

export default function AracEklePage() {
  const { isSignedIn } = useAuth()
  const { user } = useUser()
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    marka: '',
    model: '',
    yil: '',
    km: '',
    yakit: 'Benzin',
    vites: 'Otomatik',
    motor_hacmi: '1.6',
    motor_gucu: '120',
    kasa: 'Sedan',
    renk: 'Beyaz',
    ilan_fiyati: '',
    kullanici_tip: 'bireysel' as 'bireysel' | 'galeri',
    analiz_mod: 'fiyat' as 'flip' | 'beklet' | 'fiyat',
    ilan_link: '',
  })

  const [parcalar, setParcalar] = useState<Record<string, 'lb' | 'b' | 'deg'>>({})
  const [paintMode, setPaintMode] = useState<'lb' | 'b' | 'deg'>('lb')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleIlanLink = async () => {
    if (!formData.ilan_link) return
    // Simple extraction - in production would use actual scraping
    try {
      const res = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: formData.ilan_link }),
      })
      const data = await res.json()
      if (data.marka) setFormData(prev => ({ ...prev, marka: data.marka, model: data.model || '' }))
    } catch (err) {
      setError('İlan linki çözümlenemedi')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // 1. Search market data
      const searchRes = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          marka: formData.marka,
          model: formData.model,
          yil: formData.yil,
          km: formData.km,
          yakit: formData.yakit,
          vites: formData.vites,
        }),
      })
      const searchData = await searchRes.json()

      // 2. AI Analysis
      const analyzeRes = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          arac: {
            marka: formData.marka,
            model: formData.model,
            yil: parseInt(formData.yil),
            km: parseInt(formData.km),
            yakit: formData.yakit,
            vites: formData.vites,
            motor_hacmi: formData.motor_hacmi,
            motor_gucu: formData.motor_gucu,
            kasa: formData.kasa,
            renk: formData.renk,
            ilan_fiyati: formData.ilan_fiyati ? parseInt(formData.ilan_fiyati) : null,
          },
          piyasa: searchData.ozet,
          mod: formData.analiz_mod,
          kullanici: formData.kullanici_tip,
          parcalar: Object.entries(parcalar).map(([isim, tip]) => ({ isim, tip })),
        }),
      })
      const analyzeData = await analyzeRes.json()

      if (analyzeData.error) {
        setError(analyzeData.error)
        return
      }

      // 3. Save to history if signed in
      if (isSignedIn && user) {
        await fetch('/api/save-analysis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...analyzeData.analiz,
            user_id: user.id,
            marka: formData.marka,
            model: formData.model,
            yil: parseInt(formData.yil),
            km: parseInt(formData.km),
            yakit: formData.yakit,
            vites: formData.vites,
            motor_hacmi: formData.motor_hacmi,
            motor_gucu: formData.motor_gucu,
            kasa: formData.kasa,
            renk: formData.renk,
            ilan_fiyati: formData.ilan_fiyati ? parseInt(formData.ilan_fiyati) : null,
            parcalar: Object.keys(parcalar),
            kullanici_tip: formData.kullanici_tip,
            analiz_mod: formData.analiz_mod,
            piyasa_ortalama: searchData.ozet?.ortalama,
            piyasa_min: searchData.ozet?.min,
            piyasa_max: searchData.ozet?.max,
            piyasa_adet: searchData.ozet?.adet,
          }),
        })
      }

      // 4. Redirect to results
      router.push(`/sonuc?data=${encodeURIComponent(JSON.stringify({
        ...analyzeData.analiz,
        marka: formData.marka,
        model: formData.model,
        yil: formData.yil,
        km: formData.km,
        yakit: formData.yakit,
        vites: formData.vites,
        motor_hacmi: formData.motor_hacmi,
        motor_gucu: formData.motor_gucu,
        kasa: formData.kasa,
        renk: formData.renk,
        ilan_fiyati: formData.ilan_fiyati,
        parcalar: Object.keys(parcalar),
        kullanici_tip: formData.kullanici_tip,
        analiz_mod: formData.analiz_mod,
        piyasa_ortalama: searchData.ozet?.ortalama,
        piyasa_min: searchData.ozet?.min,
        piyasa_max: searchData.ozet?.max,
        piyasa_adet: searchData.ozet?.adet,
      }))}`)

    } catch (err) {
      setError('Analiz sırasında bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="pt-24 pb-20 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Araç Analizi</h1>
            <p className="text-gray-400">Aracınızı analiz edelim ve doğru fiyatı bulalım</p>
          </div>

          {/* Quick Link Input */}
          <div className="glass rounded-xl p-4 mb-6">
            <label className="block text-sm font-medium mb-2">Hızlı Başla (İlan Linki)</label>
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="https://www.sahibinden.com/ilan/..."
                value={formData.ilan_link}
                onChange={(e) => setFormData({ ...formData, ilan_link: e.target.value })}
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-500"
              />
              <button
                type="button"
                onClick={handleIlanLink}
                className="px-4 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-sm transition-colors"
              >
                Çek
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="glass rounded-xl p-6 space-y-4">
              <h2 className="font-semibold flex items-center gap-2">
                <Car className="w-5 h-5 text-brand-500" />
                Araç Bilgileri
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Marka</label>
                  <select
                    name="marka"
                    value={formData.marka}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-500"
                  >
                    <option value="">Seçiniz</option>
                    {MARKALAR.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Model</label>
                  <input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    required
                    placeholder="Örn: Corolla"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Yıl</label>
                  <select
                    name="yil"
                    value={formData.yil}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-500"
                  >
                    <option value="">Seçiniz</option>
                    {Array.from({ length: 30 }, (_, i) => 2025 - i).map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Kilometre (km)</label>
                  <input
                    type="number"
                    name="km"
                    value={formData.km}
                    onChange={handleInputChange}
                    required
                    placeholder="50000"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Yakıt</label>
                  <select
                    name="yakit"
                    value={formData.yakit}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-500"
                  >
                    {['Benzin', 'Dizel', 'LPG', 'Hibrit', 'Elektrik'].map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Vites</label>
                  <select
                    name="vites"
                    value={formData.vites}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-500"
                  >
                    {['Otomatik', 'Yarı Otomatik', 'Manuel', 'CVT', 'Çift Kavramalı (DSG)'].map(v => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Motor Hacmi</label>
                  <select
                    name="motor_hacmi"
                    value={formData.motor_hacmi}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-500"
                  >
                    {['0.9', '1.0', '1.2', '1.4', '1.6', '1.8', '2.0', '2.5', '3.0', 'Elektrik'].map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Motor Gücü (HP)</label>
                  <select
                    name="motor_gucu"
                    value={formData.motor_gucu}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-500"
                  >
                    {[90, 100, 120, 140, 160, 180, 200, 220, 250, 300].map(hp => (
                      <option key={hp} value={hp}>{hp} HP</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Condition */}
            <div className="glass rounded-xl p-6 space-y-4">
              <h2 className="font-semibold">Hasar Durumu</h2>
              <p className="text-sm text-gray-400">Boyalı veya değişen parçaları işaretleyin</p>

              <div className="flex gap-2">
                {(['lb', 'b', 'deg'] as const).map(mode => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setPaintMode(mode)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      paintMode === mode ? 'bg-brand-500 text-white' : 'bg-white/10'
                    }`}
                  >
                    {mode === 'lb' ? 'Lokal Boyalı' : mode === 'b' ? 'Boyalı' : 'Değişen'}
                  </button>
                ))}
              </div>

              {/* Simple damage marks - simplified CarMap */}
              <div className="grid grid-cols-4 gap-2">
                {['kaput', 'sol-on-kapi', 'sag-on-kapi', 'bagaj'].map(part => (
                  <button
                    key={part}
                    type="button"
                    onClick={() => setParcalar(prev => {
                      const newParcalar = { ...prev }
                      if (newParcalar[part] === paintMode) {
                        delete newParcalar[part]
                      } else {
                        newParcalar[part] = paintMode
                      }
                      return newParcalar
                    })}
                    className={`p-3 rounded-lg text-xs font-medium capitalize transition-colors ${
                      parcalar[part] ? 'bg-brand-500 text-white' : 'bg-white/10'
                    }`}
                  >
                    {part.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Usage Type */}
            <div className="glass rounded-xl p-6 space-y-4">
              <h2 className="font-semibold">Kullanım Amacı</h2>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'fiyat', label: 'Fiyat Öğren' },
                  { value: 'flip', label: 'Al/Sat (Flip)' },
                  { value: 'beklet', label: 'Beklet/Yatırım' },
                ].map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, analiz_mod: opt.value as any })}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      formData.analiz_mod === opt.value ? 'bg-brand-500 text-white' : 'bg-white/10'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              <div className="flex gap-2 mt-4">
                {[
                  { value: 'bireysel', label: 'Bireysel' },
                  { value: 'galeri', label: 'Galerici' },
                ].map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, kullanici_tip: opt.value as any })}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                      formData.kullanici_tip === opt.value ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-white/5'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price (Optional) */}
            <div className="glass rounded-xl p-6 space-y-4">
              <h2 className="font-semibold">İlan Fiyatı (Opsiyonel)</h2>
              <input
                type="number"
                name="ilan_fiyati"
                value={formData.ilan_fiyati}
                onChange={handleInputChange}
                placeholder="Satıcının istediği fiyat (TL)"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-500"
              />
            </div>

            {/* Submit */}
            {error && (
              <div className="flex items-center gap-2 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400">
                <AlertCircle className="w-5 h-5" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-lg transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analiz yapılıyor...
                </>
              ) : (
                'Analiz Et'
              )}
            </button>

            {!isSignedIn && (
              <p className="text-center text-sm text-gray-500">
                Analizlerinizi kaydetmek için{' '}
                <Link href="/kayit" className="text-brand-500 hover:underline">ücretsiz kayıt olun</Link>
              </p>
            )}
          </form>
        </div>
      </main>
    </div>
  )
}
