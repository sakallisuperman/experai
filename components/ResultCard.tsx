'use client'
import { useState } from 'react'

interface Props {
  analiz: any
  piyasa: any
  ilanlar: any[]
  arac: any
  onGeri: () => void
}

export default function ResultCard({ analiz, piyasa, ilanlar, arac, onGeri }: Props) {
  const [tab, setTab] = useState<'ozet'|'kazanc'|'risk'|'ilanlar'>('ozet')
  const [pazTon, setPazTon] = useState<'nazik'|'dengeli'|'sert'>('nazik')
  const [copied, setCopied] = useState(false)

  const kararRenk = ({'AL':'#5DCAA5','DIKKATLI_OL':'#EF9F27','KACIN':'#E24B4A'} as Record<string,string>)[analiz.karar] || '#EF9F27'
  const kararIcon = ({'AL':'✓','DIKKATLI_OL':'!','KACIN':'✕'} as Record<string,string>)[analiz.karar] || '!'
  const kararBg = ({'AL':'rgba(93,202,165,.08)','DIKKATLI_OL':'rgba(239,159,39,.08)','KACIN':'rgba(226,75,74,.08)'} as Record<string,string>)[analiz.karar]
  const kararBorder = ({'AL':'rgba(93,202,165,.25)','DIKKATLI_OL':'rgba(239,159,39,.25)','KACIN':'rgba(226,75,74,.2)'} as Record<string,string>)[analiz.karar]

  const fmt = (n: number) => n?.toLocaleString('tr-TR') + ' TL'
  const pazMetin = { nazik: analiz.pazarlik_nazik, dengeli: analiz.pazarlik_dengeli, sert: analiz.pazarlik_sert }

  const copy = async () => {
    await navigator.clipboard.writeText(pazMetin[pazTon])
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const tabCls = (t: string) => `flex-1 py-1.5 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${tab === t ? 'bg-[#272724] text-[#f0ede4]' : 'text-[#9c9a8e]'}`

  return (
    <div className="max-w-md mx-auto bg-[#161614] rounded-2xl border border-white/10 overflow-hidden pb-5">
      <div className="px-5 py-4 border-b border-white/7">
        <button onClick={onGeri} className="text-xs text-[#5a5854] mb-2 block">← Yeni analiz</button>
        <div className="text-[15px] font-medium">{arac.marka} {arac.model} {arac.yil} · {Number(arac.km).toLocaleString('tr-TR')} km</div>
        <div className="text-xs text-[#5a5854] mt-1">{arac.yakit} · {arac.vites} · {ilanlar.length} ilan incelendi · az önce</div>
      </div>

      <div className="flex gap-0 mx-5 mt-3 mb-3 bg-[#1f1f1c] rounded-xl p-1 border border-white/7">
        {(['ozet','kazanc','risk','ilanlar'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={tabCls(t)}>
            {t.charAt(0).toUpperCase()+t.slice(1)}
          </button>
        ))}
      </div>

      {tab === 'ozet' && (
        <div>
          <div className="mx-5 mb-3 p-3 rounded-xl border" style={{background:kararBg, borderColor:kararBorder}}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium flex-shrink-0"
                style={{background:kararRenk+'26', color:kararRenk}}>
                {kararIcon}
              </div>
              <div>
                <div className="text-sm font-medium" style={{color:kararRenk}}>
                  {analiz.karar === 'AL' ? 'Al, fırsatlık' : analiz.karar === 'DIKKATLI_OL' ? 'Dikkatli ol' : 'Kaçın'}
                </div>
                <div className="text-xs text-[#9c9a8e] mt-0.5 leading-relaxed">{analiz.karar_aciklama}</div>
              </div>
            </div>
          </div>

          <div className="mx-5 mb-3 p-3 bg-[#1f1f1c] border border-white/7 rounded-xl">
            <div className="text-[10px] text-[#5a5854] uppercase tracking-wider mb-1">Piyasa ortalaması</div>
            <div className="text-3xl font-medium tracking-tight">{fmt(analiz.piyasa_degeri)}</div>
            <div className="text-xs text-[#9c9a8e] mt-1">{fmt(piyasa.min)} – {fmt(piyasa.max)} · {piyasa.adet} ilan</div>
            {arac.ilan_fiyati > 0 && (
              <div className="mt-2">
                <div className="h-1 bg-[#272724] rounded-full relative">
                  <div className="h-full rounded-full bg-amber-400"
                    style={{width: Math.min(100, ((arac.ilan_fiyati - piyasa.min) / (piyasa.max - piyasa.min)) * 100) + '%'}}/>
                  <div className="absolute top-[-3px] h-[10px] w-0.5 rounded bg-emerald-400"
                    style={{left: Math.min(98, ((arac.ilan_fiyati - piyasa.min) / (piyasa.max - piyasa.min)) * 100) + '%'}}/>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-[10px] text-[#5a5854]">{Math.round(piyasa.min/1000)}K</span>
                  <span className="text-[10px] text-emerald-400">↑ İlan: {Math.round(arac.ilan_fiyati/1000)}K</span>
                  <span className="text-[10px] text-[#5a5854]">{Math.round(piyasa.max/1000)}K</span>
                </div>
              </div>
            )}
          </div>

          <div className="mx-5 grid grid-cols-2 gap-2 mb-3">
            {[
              ['Maks. alım', fmt(analiz.max_alim_fiyati), 'text-emerald-400', 'Garantili kâr sınırı'],
              ['Hedef satış', fmt(analiz.hedef_satis_fiyati), 'text-amber-400', analiz.satis_suresi],
              ['Tahmini kâr', fmt(analiz.tahmini_kar), 'text-emerald-400', `%${Math.round(analiz.tahmini_kar/analiz.max_alim_fiyati*100)} marj`],
              ['Risk skoru', `${analiz.risk_skoru}/10`, analiz.risk_skoru <= 3 ? 'text-emerald-400' : analiz.risk_skoru <= 6 ? 'text-amber-400' : 'text-red-400', analiz.satis_suresi],
            ].map(([l,v,c,s]) => (
              <div key={l as string} className="p-3 bg-[#1f1f1c] border border-white/7 rounded-xl">
                <div className="text-[10px] text-[#5a5854] uppercase tracking-wider mb-1">{l}</div>
                <div className={`text-lg font-medium ${c}`}>{v}</div>
                <div className="text-[11px] text-[#5a5854] mt-0.5">{s}</div>
              </div>
            ))}
          </div>

          {analiz.ai_yorum && (
            <div className="mx-5 p-3 bg-[#1f1f1c] border border-white/7 rounded-xl mb-3">
              <div className="text-[10px] text-[#5a5854] uppercase tracking-wider mb-1.5">AI değerlendirme</div>
              <div className="text-xs text-[#9c9a8e] leading-relaxed">{analiz.ai_yorum}</div>
            </div>
          )}

          <div className="mx-5 flex gap-1.5 flex-wrap">
            {['sahibinden','otoendeks','arabam.com'].map(s => (
              <span key={s} className="text-[10px] px-2 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">{s}</span>
            ))}
          </div>
        </div>
      )}

      {tab === 'kazanc' && (
        <div>
          <div className="mx-5 mb-3 p-3 bg-[#1f1f1c] border border-white/7 rounded-xl">
            <div className="text-[10px] text-[#5a5854] uppercase tracking-wider mb-1">Tahmini net kâr</div>
            <div className="text-3xl font-medium text-emerald-400 tracking-tight">+{fmt(analiz.tahmini_kar)}</div>
            <div className="text-xs text-[#9c9a8e] mt-1">Komisyon ve masraf dahil</div>
          </div>
          <div className="mx-5 grid grid-cols-2 gap-2 mb-3">
            {[
              ['Alım fiyatı', fmt(arac.ilan_fiyati || analiz.max_alim_fiyati), 'text-[#f0ede4]', 'İlan fiyatı'],
              ['Maks. alım', fmt(analiz.max_alim_fiyati), 'text-amber-400', 'Pazarlık hedefi'],
              ['Satış hedefi', fmt(analiz.hedef_satis_fiyati), 'text-emerald-400', 'Optimal fiyat'],
              ['Hızlı satış', fmt(Math.round(analiz.hedef_satis_fiyati * 0.97)), 'text-[#f0ede4]', '~3 günde sat'],
            ].map(([l,v,c,s]) => (
              <div key={l as string} className="p-3 bg-[#1f1f1c] border border-white/7 rounded-xl">
                <div className="text-[10px] text-[#5a5854] uppercase tracking-wider mb-1">{l}</div>
                <div className={`text-lg font-medium ${c}`}>{v}</div>
                <div className="text-[11px] text-[#5a5854] mt-0.5">{s}</div>
              </div>
            ))}
          </div>
          <div className="mx-5 p-3 bg-[#1f1f1c] border border-white/7 rounded-xl">
            <div className="text-[10px] text-[#5a5854] uppercase tracking-wider mb-2">Pazarlık cümlesi</div>
            <div className="flex gap-1.5 mb-2">
              {(['nazik','dengeli','sert'] as const).map(t => (
                <button key={t} onClick={() => setPazTon(t)}
                  className={`flex-1 py-1.5 rounded-lg border text-[11px] font-medium transition-all`}
                  style={pazTon === t ? {background:'rgba(239,159,39,.1)',borderColor:'#BA7517',color:'#EF9F27'} : {borderColor:'rgba(255,255,255,0.07)',color:'#9c9a8e'}}>
                  {t.charAt(0).toUpperCase()+t.slice(1)}
                </button>
              ))}
            </div>
            <div className="text-xs text-[#f0ede4] leading-relaxed p-2.5 bg-[#272724] rounded-lg border border-white/7">
              {pazMetin[pazTon]}
            </div>
            <button onClick={copy} className="mt-2 text-right w-full text-[11px] text-amber-400">
              {copied ? 'Kopyalandı ✓' : 'Kopyala ↗'}
            </button>
          </div>
        </div>
      )}

      {tab === 'risk' && (
        <div>
          <div className="mx-5 mb-3 p-3 bg-[#1f1f1c] border border-white/7 rounded-xl">
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm font-medium">Risk skoru</div>
              <div className="text-2xl font-medium" style={{color: analiz.risk_skoru <= 3 ? '#5DCAA5' : analiz.risk_skoru <= 6 ? '#EF9F27' : '#E24B4A'}}>
                {analiz.risk_skoru}<span className="text-xs text-[#5a5854] font-normal">/10</span>
              </div>
            </div>
            <div className="h-1 bg-[#272724] rounded-full mb-3">
              <div className="h-full rounded-full transition-all"
                style={{width: (analiz.risk_skoru/10*100)+'%', background: analiz.risk_skoru <= 3 ? '#5DCAA5' : analiz.risk_skoru <= 6 ? '#EF9F27' : '#E24B4A'}}/>
            </div>
            <div className="space-y-2">
              {(analiz.risk_items || []).map((item: string, i: number) => (
                <div key={i} className="flex items-start gap-2 text-xs text-[#9c9a8e]">
                  <div className="w-1.5 h-1.5 rounded-full mt-1 flex-shrink-0"
                    style={{background: i < 3 ? '#5DCAA5' : '#EF9F27'}}/>
                  {item}
                </div>
              ))}
            </div>
          </div>
          {analiz.kronik_sorunlar && (
            <div className="mx-5 p-3 bg-[#1f1f1c] border border-white/7 rounded-xl">
              <div className="text-[10px] text-[#5a5854] uppercase tracking-wider mb-1.5">Kronik sorunlar</div>
              <div className="text-xs text-[#9c9a8e] leading-relaxed">{analiz.kronik_sorunlar}</div>
            </div>
          )}
        </div>
      )}

      {tab === 'ilanlar' && (
        <div className="mx-5">
          <div className="text-[10px] text-[#5a5854] uppercase tracking-wider mb-2">{ilanlar.length} ilan bulundu</div>
          <div className="space-y-2">
            {ilanlar.map((ilan, i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-[#1f1f1c] border border-white/7 rounded-xl">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{ilan.baslik?.slice(0,40)}</div>
                  <div className="text-[11px] text-[#5a5854] mt-0.5">{ilan.kaynak} {ilan.km ? `· ${Number(ilan.km).toLocaleString('tr-TR')} km` : ''}</div>
                </div>
                <div className="text-right ml-3 flex-shrink-0">
                  <div className="text-sm font-medium">{ilan.fiyat?.toLocaleString('tr-TR')} TL</div>
                  <a href={ilan.link} target="_blank" rel="noopener noreferrer"
                    className="text-[10px] text-blue-400">↗ İlana git</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
