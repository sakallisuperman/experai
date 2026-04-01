'use client'
import { useState } from 'react'

const PARCALAR = [
  'kaput', 'on-tampon', 'arka-tampon', 'bagaj',
  'tavan', 'sol-on-kapi', 'sol-arka-kapi',
  'sag-on-kapi', 'sag-arka-kapi',
  'sol-on-camurluk', 'sag-on-camurluk'
]

const PARCA_ISIMLERI: Record<string, string> = {
  'kaput': 'Motor Kaputu', 'on-tampon': 'Ön Tampon',
  'arka-tampon': 'Arka Tampon', 'bagaj': 'Bagaj Kapağı',
  'tavan': 'Tavan', 'sol-on-kapi': 'Sol Ön Kapı',
  'sol-arka-kapi': 'Sol Arka Kapı', 'sag-on-kapi': 'Sağ Ön Kapı',
  'sag-arka-kapi': 'Sağ Arka Kapı',
  'sol-on-camurluk': 'Sol Ön Çamurluk',
  'sag-on-camurluk': 'Sağ Ön Çamurluk'
}

const PARCA_PENALTY: Record<string, number> = {
  'lb': 15000, 'b': 35000, 'deg': 55000
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
  const [hasarTab, setHasarTab] = useState<'hasar' | 'boya'>('hasar')
  const [paintMode, setPaintMode] = useState<ParcaTip>('lb')
  const [secilenParcalar, setSecilenParcalar] = useState<Record<string, ParcaTip>>({})
  const [link, setLink] = useState('')
  const [linkOk, setLinkOk] = useState(false)
  const [form, setForm] = useState({
    marka: 'Toyota', model: 'Corolla', yil: '2019',
    km: '85000', yakit: 'Benzin', vites: 'Otomatik',
    motor_hacmi: '1.6', motor_gucu: '132',
    kasa: 'Sedan', renk: 'Beyaz',
    ilan_fiyati: '', garanti: 'Garanti yok',
    hasar: '0',
  })

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const toggleParca = (id: string) => {
    setSecilenParcalar(prev => {
      const next = { ...prev }
      if (next[id] === paintMode) delete next[id]
      else next[id] = paintMode
      return next
    })
  }

  const parcaRenk = (id: string) => {
    const t = secilenParcalar[id]
    if (!t) return '#2a2a26'
    return { lb: '#E8892A', b: '#378ADD', deg: '#E24B4A' }[t]
  }

  const fiyatEtkisi = Object.values(secilenParcalar)
    .reduce((s, t) => s + PARCA_PENALTY[t], 0)

  const handleSubmit = async () => {
    const parcaList = Object.entries(secilenParcalar).map(([id, tip]) => ({
      isim: PARCA_ISIMLERI[id], tip: { lb: 'Lokal boyalı', b: 'Boyalı', deg: 'Değişen parça' }[tip]
    }))
    onAnaliz({
      form: { ...form, km: parseInt(form.km), ilan_fiyati: parseInt(form.ilan_fiyati) || 0 },
      mod, kullanici, parcalar: parcaList
    })
  }

  const inputCls = "w-full text-sm px-3 py-2 rounded-lg border border-white/10 bg-[#1f1f1c] text-[#f0ede4] outline-none focus:border-amber-600/50"
  const labelCls = "text-[10px] text-[#5a5854] uppercase tracking-wider mb-1 block"

  return (
    <div className="max-w-md mx-auto bg-[#161614] rounded-2xl border border-white/10 overflow-hidden pb-5">
      <div className="flex justify-between items-center px-5 py-4">
        <div className="text-[17px] font-medium tracking-tight">
          Eksper<sup className="text-[9px] text-amber-400 tracking-wider font-normal">AI</sup>
        </div>
        <div className="flex gap-2">
          {(['bireysel', 'galeri'] as const).map(u => (
            <button key={u} onClick={() => setKullanici(u)}
              className={`text-[11px] px-3 py-1 rounded-full border transition-all ${kullanici === u ? 'bg-amber-400/10 text-amber-400 border-amber-700' : 'border-white/10 text-[#9c9a8e]'}`}>
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
            className={inputCls + " flex-1"} />
          <button onClick={() => link && setLinkOk(true)}
            className="px-3 py-2 rounded-lg bg-amber-400/10 text-amber-400 border border-amber-700 text-xs font-medium whitespace-nowrap">
            Çek
          </button>
        </div>
        {linkOk && <div className="mt-2 text-xs text-emerald-400 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"/>Bilgiler aktarıldı
        </div>}
      </div>

      <div className="mx-5 mb-3">
        <div className="text-[10px] text-[#5a5854] uppercase tracking-wider mb-2 pb-1.5 border-b border-white/7">Temel bilgiler</div>
        <div className="grid grid-cols-2 gap-2">
          {[
            ['marka','Marka',['Toyota','VW','Renault','Honda','Hyundai','Mercedes-Benz','BMW','Audi','Ford','Opel','Fiat','Peugeot']],
            ['model','Model',['Corolla','Golf','Clio','Civic','Tucson','A180','3 Serisi','A3','Focus','Astra','Egea','308']],
            ['yil','Yıl',['2024','2023','2022','2021','2020','2019','2018','2017','2016','2015','2014','2013']],
            ['km','Kilometre',null],
            ['yakit','Yakıt',['Benzin','Dizel','LPG','Hibrit','Elektrik']],
            ['vites','Vites',['Otomatik','Yarı Otomatik','Manuel']],
            ['motor_hacmi','Motor Hacmi',['1.0','1.2','1.4','1.5','1.6','1.8','2.0','2.5','3.0']],
            ['motor_gucu','Motor Gücü (HP)',null],
            ['kasa','Kasa Tipi',['Sedan','Hatchback','SUV','Crossover','Coupe','Cabrio','Kombi','Pickup']],
            ['renk','Renk',['Beyaz','Siyah','Gri','Gümüş','Kırmızı','Mavi','Yeşil','Bej','Kahve']],
          ].map(([key, label, opts]: any) => (
            <div key={key} className="flex flex-col">
              <label className={labelCls}>{label}</label>
              {opts ? (
                <select value={form[key as keyof typeof form]} onChange={e => set(key, e.target.value)} className={inputCls}>
                  {opts.map((o: string) => <option key={o}>{o}</option>)}
                </select>
              ) : (
                <input value={form[key as keyof typeof form]} onChange={e => set(key, e.target.value)} className={inputCls} />
              )}
            </div>
          ))}
          <div className="flex flex-col">
            <label className={labelCls}>İlan fiyatı (TL)</label>
            <input value={form.ilan_fiyati} onChange={e => set('ilan_fiyati', e.target.value)} placeholder="1.259.000" className={inputCls} />
          </div>
          <div className="flex flex-col">
            <label className={labelCls}>Garanti</label>
            <select value={form.garanti} onChange={e => set('garanti', e.target.value)} className={inputCls}>
              {['Garanti yok','Yetkili servis','Bayi garantili'].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="mx-5 mb-3">
        <div className="text-[10px] text-[#5a5854] uppercase tracking-wider mb-2 pb-1.5 border-b border-white/7">Hasar & boya durumu</div>
        <div className="flex gap-2 mb-3">
          {[['hasar','Hasar kaydı'],['boya','Boyalı / değişen parça']].map(([t,l]) => (
            <button key={t} onClick={() => setHasarTab(t as any)}
              className={`flex-1 py-1.5 rounded-lg border text-xs font-medium transition-all ${hasarTab === t ? 'bg-[#1f1f1c] border-white/14 text-[#f0ede4]' : 'border-white/7 text-[#9c9a8e]'}`}>
              {l}
            </button>
          ))}
        </div>

        {hasarTab === 'hasar' ? (
          <div className="grid grid-cols-1 gap-2">
            <div><label className={labelCls}>Hasar kaydı</label>
              <select value={form.hasar} onChange={e => set('hasar', e.target.value)} className={inputCls}>
                <option value="0">Hasar kaydı yok</option>
                <option value="1">Hafif hasar geçmişi</option>
                <option value="2">Orta hasar</option>
                <option value="3">Ağır hasar geçmişi</option>
                <option value="4">Kaza kaydı var</option>
              </select>
            </div>
            <div><label className={labelCls}>Tramer kaydı</label>
              <select className={inputCls}>
                <option>Tramer kaydı yok</option>
                <option>Tramer kaydı var</option>
              </select>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex gap-2 mb-3">
              {[['lb','Lokal boyalı','#E8892A'],['b','Boyalı','#378ADD'],['deg','Değişen','#E24B4A']].map(([t,l,c]) => (
                <button key={t} onClick={() => setPaintMode(t as ParcaTip)}
                  className={`flex-1 py-1.5 rounded-lg border text-xs font-medium transition-all`}
                  style={paintMode === t ? { background: c+'26', borderColor: c, color: c } : { borderColor: 'rgba(255,255,255,0.07)', color: '#9c9a8e' }}>
                  {l}
                </button>
              ))}
            </div>

            <div className="bg-[#1f1f1c] border border-white/7 rounded-xl p-3 mb-2">
              <div className="flex gap-4 mb-2 flex-wrap">
                {[['#2a2a26','Orijinal'],['#E8892A','Lokal boyalı'],['#378ADD','Boyalı'],['#E24B4A','Değişen']].map(([c,l]) => (
                  <div key={l} className="flex items-center gap-1.5 text-[10px] text-[#9c9a8e]">
                    <div className="w-2.5 h-2.5 rounded-sm border border-white/20" style={{background:c}}/>
                    {l}
                  </div>
                ))}
              </div>
              <svg viewBox="0 0 300 160" className="w-full">
                <rect x="30" y="55" width="240" height="75" rx="8" fill="#222220" stroke="#3a3a36" strokeWidth="1"/>
                <path d="M70 55 Q80 28 110 26 L190 26 Q220 28 230 55Z" fill="#222220" stroke="#3a3a36" strokeWidth="1"/>
                <rect x="86" y="30" width="52" height="25" rx="2" fill="#1a2535" stroke="#2a3545" strokeWidth="0.6"/>
                <rect x="162" y="30" width="52" height="25" rx="2" fill="#1a2535" stroke="#2a3545" strokeWidth="0.6"/>
                <ellipse cx="75" cy="130" rx="20" ry="20" fill="#1a1a18" stroke="#444" strokeWidth="0.8"/>
                <ellipse cx="225" cy="130" rx="20" ry="20" fill="#1a1a18" stroke="#444" strokeWidth="0.8"/>
                <ellipse cx="75" cy="130" rx="11" ry="11" fill="#2a2a28" stroke="#555" strokeWidth="0.5"/>
                <ellipse cx="225" cy="130" rx="11" ry="11" fill="#2a2a28" stroke="#555" strokeWidth="0.5"/>
                {[
                  ['kaput','Motor Kaputu',32,57,54,40],
                  ['on-tampon','Ön Tampon',32,97,54,16],
                  ['tavan','Tavan',88,28,124,26],
                  ['sol-on-kapi','Sol Ön Kapı',98,60,42,50],
                  ['sol-arka-kapi','Sol Arka Kapı',142,60,42,50],
                  ['bagaj','Bagaj',214,57,54,40],
                  ['arka-tampon','Arka Tampon',214,97,54,16],
                  ['sol-on-camurluk','SÖÇ',32,57,18,40],
                  ['sag-on-camurluk','SAÇ',250,57,18,40],
                ].map(([id,name,x,y,w,h]: any) => (
                  <g key={id} onClick={() => toggleParca(id)} className="cursor-pointer">
                    <rect x={x} y={y} width={w} height={h} rx="3"
                      fill={parcaRenk(id)} stroke="rgba(255,255,255,0.15)" strokeWidth="0.5"
                      opacity="0.9"/>
                    <text x={x+w/2} y={y+h/2+4} textAnchor="middle"
                      fill="rgba(255,255,255,0.5)" fontSize="6" pointerEvents="none">
                      {(name as string).split(' ').slice(-1)[0]}
                    </text>
                  </g>
                ))}
              </svg>
              <div className="text-center text-[10px] text-[#5a5854] mt-1">Parçaya tıkla → işaretle</div>
            </div>

            {Object.keys(secilenParcalar).length > 0 && (
              <div className="space-y-1.5 mb-2">
                {Object.entries(secilenParcalar).map(([id, tip]) => (
                  <div key={id} className="flex justify-between items-center px-3 py-1.5 rounded-lg text-xs"
                    style={{ background: {lb:'rgba(232,137,42,.08)',b:'rgba(55,138,221,.08)',deg:'rgba(226,75,74,.08)'}[tip],
                      color: {lb:'#E8892A',b:'#378ADD',deg:'#E24B4A'}[tip] }}>
                    <span>{PARCA_ISIMLERI[id]}</span>
                    <span className="opacity-60 text-[10px]">{{lb:'Lokal boyalı',b:'Boyalı',deg:'Değişen parça'}[tip]}</span>
                    <button onClick={() => setSecilenParcalar(p => { const n={...p}; delete n[id]; return n })}
                      className="opacity-50 ml-2">×</button>
                  </div>
                ))}
              </div>
            )}

            {fiyatEtkisi > 0 && (
              <div className="px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg flex justify-between text-xs">
                <span className="text-[#9c9a8e]">Boya/değişim fiyat etkisi</span>
                <span className="text-red-400 font-medium">-{fiyatEtkisi.toLocaleString('tr-TR')} TL</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mx-5 mb-4">
        <div className="text-[10px] text-[#5a5854] uppercase tracking-wider mb-2">Kullanım amacı</div>
        <div className="grid grid-cols-3 gap-1.5">
          {[
            ['flip','Al-sat','Flip kâr','#EF9F27'],
            ['beklet','Beklet','Projeksiyon','#5DCAA5'],
            ['fiyat','Fiyat','Anlık piyasa','#378ADD'],
          ].map(([m,t,s,c]) => (
            <button key={m} onClick={() => setMod(m as Mod)}
              className={`py-2.5 px-2 rounded-xl border text-center transition-all`}
              style={mod === m ? { background: c+'1a', borderColor: c+'80' } : { background: '#1f1f1c', borderColor: 'rgba(255,255,255,0.07)' }}>
              <div className="text-xs font-medium" style={{ color: mod === m ? c : '#f0ede4' }}>{t}</div>
              <div className="text-[10px] text-[#5a5854] mt-0.5">{s}</div>
            </button>
          ))}
        </div>
      </div>

      <button onClick={handleSubmit} disabled={loading}
        className="mx-5 w-[calc(100%-40px)] py-3 bg-amber-400 text-[#1a1208] rounded-xl font-medium text-[15px] disabled:opacity-50 transition-opacity">
        {loading ? 'Analiz yapılıyor...' : 'Analiz et →'}
      </button>
    </div>
  )
}
