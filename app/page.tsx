'use client'
import { useState } from 'react'
import InputForm from '@/components/InputForm'
import ResultCard from '@/components/ResultCard'

type Ekran = 'input' | 'loading' | 'result'

const LOADING_STEPS = [
  'sahibinden.com taranıyor...',
  'arabam.com kontrol ediliyor...',
  'otoendeks verileri çekiliyor...',
  'AI analiz yapıyor...',
]

export default function Home() {
  const [ekran, setEkran] = useState<Ekran>('input')
  const [loadStep, setLoadStep] = useState(0)
  const [result, setResult] = useState<any>(null)

  const handleAnaliz = async (data: any) => {
    setEkran('loading')
    setLoadStep(0)

    const interval = setInterval(() => {
      setLoadStep(s => s < LOADING_STEPS.length - 1 ? s + 1 : s)
    }, 800)

    try {
      const searchRes = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data.form),
      })
      const searchData = await searchRes.json()

      const analyzeRes = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          arac: data.form,
          piyasa: searchData.ozet,
          mod: data.mod,
          kullanici: data.kullanici,
          parcalar: data.parcalar,
        }),
      })
      const analyzeData = await analyzeRes.json()

      clearInterval(interval)
      setResult({ ...analyzeData, searchData, form: data.form })
      setEkran('result')
    } catch (err) {
      clearInterval(interval)
      console.error(err)
      setEkran('input')
      alert('Bir hata oluştu, tekrar dene.')
    }
  }

  return (
    <main className="min-h-screen bg-[#0e0e0c] py-6 px-4">
      {ekran === 'input' && (
        <div className="animate-fade-up">
          <InputForm onAnaliz={handleAnaliz} loading={false} />
        </div>
      )}

      {ekran === 'loading' && (
        <div className="animate-fade-up max-w-md mx-auto bg-[#161614] rounded-2xl border border-white/10 overflow-hidden">
          <div className="px-5 py-4 border-b border-white/7">
            <div className="text-[17px] font-medium tracking-tight">
              Eksper<sup className="text-[9px] text-amber-400 tracking-wider font-normal">AI</sup>
            </div>
          </div>
          <div className="px-5 py-16 text-center">
            <div className="flex gap-2 justify-center mb-6">
              {[0,1,2].map(i => (
                <div key={i} className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse-dot"
                  style={{animationDelay: `${i * 0.2}s`}}/>
              ))}
            </div>
            <div className="text-base font-medium mb-2 text-[#f0ede4]">Analiz yapılıyor</div>
            <div className="text-sm text-[#9c9a8e] mb-10 h-5">{LOADING_STEPS[loadStep]}</div>
            <div className="text-left max-w-[220px] mx-auto space-y-3">
              {LOADING_STEPS.map((step, i) => (
                <div key={i} className="flex items-center gap-2.5 text-xs transition-all duration-300"
                  style={{color: i < loadStep ? '#5DCAA5' : i === loadStep ? '#EF9F27' : '#3a3a36'}}>
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{background: i < loadStep ? '#5DCAA5' : i === loadStep ? '#EF9F27' : '#3a3a36'}}/>
                  <span style={{textDecoration: i < loadStep ? 'line-through' : 'none', opacity: i < loadStep ? 0.6 : 1}}>
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {ekran === 'result' && result && (
        <div className="animate-fade-up">
          <ResultCard
            analiz={result.analiz}
            piyasa={result.searchData?.ozet || {}}
            ilanlar={result.searchData?.ilanlar || []}
            arac={result.form}
            onGeri={() => { setResult(null); setEkran('input') }}
          />
        </div>
      )}
    </main>
  )
}
