'use client'
import { useState, useEffect } from 'react'
import { CAR_DATA, MARKALAR, MOTOR_HACIMLERI, MOTOR_GUCLERI, YILLAR, RENKLER, KASA_TIPLERI } from '@/lib/carData'
import CarMap from '@/components/CarMap'

const PARCA_ISIMLERI: Record<string, string> = {
  'kaput': 'Motor Kaputu', 'on-tampon': 'Ön Tampon',
  'arka-tampon': 'Arka Tampon', 'bagaj': 'Bagaj Kapağı',
  'tavan': 'Tavan', 'sol-on-kapi': 'Sol Ön Kapı',
  'sol-arka-kapi': 'Sol Arka Kapı', 'sag-on-kapi': 'Sağ Ön Kapı',
  'sag-arka-kapi': 'Sağ Arka Kapı', 'sol-on-camurluk': 'Sol Ön Çamurluk',
  'sag-on-camurluk': 'Sağ Ön Çamurluk', 'sol-arka-camurluk': 'Sol Arka Çamurluk',
}

type ParcaTip = 'lb' | 'b' | 'deg'
type Mod = 'flip' | 'beklet' | 'fiyat'

interface Props {
  onAnaliz: (data: any) => void
  loading: boolean
}

export default function InputForm({ onAnaliz, loading }: Props) {
  const [kullanici, setKullanici] = useState<'bireysel' | 'galeri'>('galeri')
  const [mod, setMod] = useState<Mod>('flip')
  const [hasarTab, setHasarTab] = useState<'boya' | 'hasar'>('boya')
  const [paintMode, setPaintMode] = useState<ParcaTip>('lb')
  const [secilenParcalar, setSecilenParcalar] = useState<Record<string, ParcaTip>>({})
  const [link, setLink] = useState('')
  const [linkOk, setLinkOk] = useState(false)
  const [modeller, setModeller] = useState<string[]>([])
  const [form, setForm] = useState({
    marka: 'Toyota', model: 'Corolla', yil: '2019',
    km: '85000', yakit: 'Benzin', vites: 'Otomatik',
    motor_hacmi: '1.6', motor_gucu: '132',
    kasa: 'Sedan', renk: 'Beyaz',
    ilan_fiyati: '', garanti: 'Garanti yok', hasar: '0',
  })

  useEffect(() => {
    const m = CAR_DATA[form.marka] || []
    setModeller(m)
    if (!m.includes(form.model)) {
      setForm(f => ({ ...f, model: m[0] || '' }))
    }
  }, [form.marka])

  useEffect(() => {
    setModeller(CAR_DATA['Toyota'] || [])
  }, [])

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const toggleParca = (id: string) => {
    setSecilenParcalar(prev => {
      const next = { ...prev }
      if (next[id] === paintMode) delete next[id]
      else next[id] = paintMode
      return next
    })
  }

  const fiyatEtkisi = Object.values(secilenParcalar)
    .reduce((s, t) => s + ({ lb: 15000, b: 35000, deg: 55000 }[t] || 0), 0)

  const handleSubmit = async () => {
    const parcaList = Object.entries(secilenParcalar).map(([id, tip]) => ({
      isim: PARCA_ISIMLERI[id],
      tip: { lb: 'Lokal boyalı', b: 'Boyalı', deg: 'Değişen parça' }[tip]
    }))
    onAnaliz({
      form: {
        ...form,
        km: parseInt(form.km.replace(/\./g, '')),
        ilan_fiyati: parseInt(form.ilan_fiyati.replace(/\./g, '').replace(/,/g, '')) || 0
      },
      mod, kullanici, parcalar: parcaList
    })
  }

  const ic = "w-full text-sm px-3 py-[7px] rounded-lg border border-white/10 bg-[#1f1f1c] text-[#f0ede4] outline-none focus:border-amber-600/40 transition-colors"
  const lc = "text-[10px] text-[#5a5854] uppercase tracking-wider mb-1 block"

  return (
    <div className="max-w-md mx-auto bg-[#161614] rounded-2xl border border-white/10 overflow-hidden pb-5">
      <div className="flex justify-between items-center px-5 pt-4 pb-3">
        <div className="text-[17px] font-medium tracking-tight text-[#f0ede4]">
          Eksper<sup className="text-[9px] text-amber-400 tracking-wider font-normal">AI</sup>
        </div>
        <div className="flex gap-2">
          {(['bireysel', 'galeri'] as const).map(u => (
            <button key={u} onClick={() => setKullanici(u)}
              className={`text-[11px] px-3 py-1 rounded-full border transition-all ${kullanici === u ? 'bg-amber-400/10 text-amber-400 border-amber-700/60' : 'border-white/10 text-[#9c9a8e]'}`}>
              {u === 'bireysel' ? 'Bireysel' : 'Galerici'}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-5 mb-3 bg-[#1f1f1c] border border-white/10 rounded-xl p-3">
        <div className="text-[10px] text-[#5a5854] uppercase tracking-wider mb-2">İlan linki yapıştır</div>
        <div className="flex gap-2">
          <input value={link} onChange={e => setLink(e.target.value)}
            placeholder="sahibinden.com/ilan/..."
            className={ic + " flex-1"} />
          <button onClick={() => link && setLinkOk(true)}
            className="px-3 py-1.5 rounded-lg bg-amber-400/10 text-amber-400 border border-amber-700/60 text-xs font-medium whitespace-nowrap">
            Çek
          </button>
        </div>
        {linkOk && (
          <div className="mt-2 text-xs text-emerald-400 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block flex-shrink-0" />
            Bilgiler aktarıldı
          </div>
        )}
      </div>

      <div className="mx-5 mb-3">
        <div className="text-[10px] text-[#5a5854] uppercase tracking-wider mb-2 pb-1.5 border-b border-white/7">Araç bilgileri</div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className={lc}>Marka</label>
            <select value={form.marka} onChange={e => set('marka', e.target.value)} className={ic}>
              {MARKALAR.map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className={lc}>Model</label>
            <select value={form.model} onChange={e => set('model', e.target.value)} className={ic}>
              {modeller.map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className={lc}>Yıl</label>
            <select value={form.yil} onChange={e => set('yil', e.target.value)} className={ic}>
              {YILLAR.map(y => <option key={y}>{y}</option>)}
            </select>
          </div>
          <div>
            <label className={lc}>Kilometre</label>
            <input value={form.km} onChange={e => set('km', e.target.value)} placeholder="85.000" className={ic} />
          </div>
          <div>
            <label className={lc}>Yakıt tipi</label>
            <select value={form.yakit} onChange={e => set('yakit', e.target.value)} className={ic}>
              {['Benzin','Dizel','LPG','Hibrit','Elektrik','Hibrit (Benzin)','Hibrit (Dizel)'].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label className={lc}>Vites</label>
            <select value={form.vites} onChange={e => set('vites', e.target.value)} className={ic}>
              {['Otomatik','Yarı Otomatik','Manuel','CVT','Çift Kavramalı (DSG)'].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label className={lc}>Motor hacmi</label>
            <select value={form.motor_hacmi} onChange={e => set('motor_hacmi', e.target.value)} className={ic}>
              {MOTOR_HACIMLERI.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label className={lc}>Motor gücü (HP)</label>
            <select value={form.motor_gucu} onChange={e => set('motor_gucu', e.target.value)} className={ic}>
              {MOTOR_GUCLERI.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label className={lc}>Kasa tipi</label>
            <select value={form.kasa} onChange={e => set('kasa', e.target.value)} className={ic}>
              {KASA_TIPLERI.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label className={lc}>Renk</label>
            <select value={form.renk} onChange={e => set('renk', e.target.value)} className={ic}>
              {RENKLER.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label className={lc}>Garanti</label>
            <select value={form.garanti} onChange={e => set('garanti', e.target.value)} className={ic}>
              {['Garanti yok','Yetkili servis garantili','Bayi garantili'].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label className={lc}>Satıcı talep fiyatı (TL)</label>
            <input value={form.ilan_fiyati} onChange={e => set('ilan_fiyati', e.target.value)}
              placeholder="Örn: 850000" className={ic} />
          </div>
        </div>
      </div>

      <div className="mx-5 mb-3">
        <div className="text-[10px] text-[#5a5854] uppercase tracking-wider mb-2 pb-1.5 border-b border-white/7">Hasar & boya durumu</div>
        <div className="flex gap-2 mb-3">
          {([['boya','Boyalı / değişen parça'],['hasar','Hasar kaydı']] as const).map(([t,l]) => (
            <button key={t} onClick={() => setHasarTab(t)}
              className={`flex-1 py-1.5 rounded-lg border text-xs font-medium transition-all ${hasarTab === t ? 'bg-[#1f1f1c] border-white/14 text-[#f0ede4]' : 'border-white/7 text-[#9c9a8e]'}`}>
              {l}
            </button>
          ))}
        </div>

        {hasarTab === 'boya' ? (
          <div>
            <div className="flex gap-2 mb-3">
              {([['lb','Lokal boyalı','#E8892A'],['b','Boyalı','#378ADD'],['deg','Değişen parça','#E24B4A']] as [ParcaTip,string,string][]).map(([t,l,c]) => (
                <button key={t} onClick={() => setPaintMode(t)}
                  className="flex-1 py-1.5 rounded-lg border text-xs font-medium transition-all"
                  style={paintMode === t
                    ? { background: c+'26', borderColor: c+'80', color: c }
                    : { borderColor: 'rgba(255,255,255,0.07)', color: '#9c9a8e' }}>
                  {l}
                </button>
              ))}
            </div>

            <div className="bg-[#1f1f1c] border border-white/7 rounded-xl p-3 mb-2">
              <div className="flex gap-3 mb-3 flex-wrap">
                {([['#2a2a26','Orijinal'],['#E8892A','Lokal boyalı'],['#378ADD','Boyalı'],['#E24B4A','Değişen']] as const).map(([c,l]) => (
                  <div key={l} className="flex items-center gap-1.5 text-[10px] text-[#9c9a8e]">
                    <div className="w-2.5 h-2.5 rounded-sm border border-white/15" style={{ background: c }} />
                    {l}
                  </div>
                ))}
              </div>
              <CarMap
                secilenParcalar={secilenParcalar}
                onToggle={toggleParca}
                paintMode={paintMode}
              />
            </div>

            {Object.keys(secilenParcalar).length > 0 && (
              <div className="space-y-1.5 mb-2">
                {Object.entries(secilenParcalar).map(([id, tip]) => (
                  <div key={id} className="flex justify-between items-center px-3 py-1.5 rounded-lg text-xs"
                    style={{
                      background: ({ lb:'rgba(232,137,42,.08)', b:'rgba(55,138,221,.08)', deg:'rgba(226,75,74,.08)' } as Record<string,string>)[tip],
                      color: ({ lb:'#E8892A', b:'#378ADD', deg:'#E24B4A' } as Record<string,string>)[tip]
                    }}>
                    <span>{PARCA_ISIMLERI[id]}</span>
                    <span className="opacity-60 text-[10px]">{{ lb:'Lokal boyalı', b:'Boyalı', deg:'Değişen parça' }[tip]}</span>
                    <button onClick={() => setSecilenParcalar(p => { const n = { ...p }; delete n[id]; return n })}
                      className="opacity-50 ml-2 text-sm leading-none">×</button>
                  </div>
                ))}
              </div>
            )}

            {fiyatEtkisi > 0 && (
              <div className="px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg flex justify-between items-center text-xs">
                <span className="text-[#9c9a8e]">Tahmini fiyat etkisi</span>
                <span className="text-red-400 font-medium">-{fiyatEtkisi.toLocaleString('tr-TR')} TL</span>
              </div>
            )}
          </div>
        ) : (
          <div className="grid gap-2">
            <div>
              <label className={lc}>Hasar kaydı</label>
              <select value={form.hasar} onChange={e => set('hasar', e.target.value)} className={ic}>
                <option value="0">Hasar kaydı yok</option>
                <option value="1">Hafif hasar geçmişi</option>
                <option value="2">Orta hasar</option>
                <option value="3">Ağır hasar geçmişi</option>
                <option value="4">Kaza kaydı var</option>
              </select>
            </div>
            <div>
              <label className={lc}>Tramer kaydı</label>
              <select className={ic}>
                <option>Tramer kaydı yok</option>
                <option>Tramer kaydı var</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="mx-5 mb-4">
        <div className="text-[10px] text-[#5a5854] uppercase tracking-wider mb-2">Kullanım amacı</div>
        <div className="grid grid-cols-3 gap-2">
          {([
            ['flip','Al-sat','Flip kâr','#EF9F27'],
            ['beklet','Beklet','Projeksiyon','#5DCAA5'],
            ['fiyat','Fiyat öğren','Anlık piyasa','#378ADD'],
          ] as [Mod,string,string,string][]).map(([m,t,s,c]) => (
            <button key={m} onClick={() => setMod(m)}
              className="py-2.5 px-2 rounded-xl border text-center transition-all"
              style={mod === m
                ? { background: c+'1a', borderColor: c+'60' }
                : { background: '#1f1f1c', borderColor: 'rgba(255,255,255,0.07)' }}>
              <div className="text-xs font-medium" style={{ color: mod === m ? c : '#f0ede4' }}>{t}</div>
              <div className="text-[10px] text-[#5a5854] mt-0.5">{s}</div>
            </button>
          ))}
        </div>
      </div>

      <button onClick={handleSubmit} disabled={loading}
        className="mx-5 w-[calc(100%-40px)] py-3 bg-amber-400 text-[#1a1208] rounded-xl font-medium text-[15px] disabled:opacity-50 transition-opacity active:scale-[.98]">
        {loading ? 'Analiz yapılıyor...' : 'Analiz et →'}
      </button>
    </div>
  )
}
