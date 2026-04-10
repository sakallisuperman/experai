'use client'

import { useState } from 'react'
import { Analysis } from '@/lib/supabase'
import { Car, Calendar, Gauge, Fuel, Settings, Palette, AlertTriangle, TrendingUp, Target, Clock, Shield, MessageSquare, Share2, Trash2 } from 'lucide-react'

interface AnalysisResultProps {
  analysis: Analysis
  onSave?: () => void
  onShare?: () => void
  onDelete?: () => void
  isSaved?: boolean
}

const KARAR_COLOR = {
  'AL': 'text-green-500 bg-green-500/10 border-green-500/30',
  'DIKKATLI_OL': 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30',
  'KACIN': 'text-red-500 bg-red-500/10 border-red-500/30',
}

const KARAR_LABEL = {
  'AL': 'AL',
  'DIKKATLI_OL': 'DİKKATLİ OL',
  'KACIN': 'KAÇIN',
}

const RISK_COLOR = (score: number) => {
  if (score <= 3) return 'text-green-500'
  if (score <= 6) return 'text-yellow-500'
  return 'text-red-500'
}

export default function AnalysisResult({ analysis, onSave, onShare, onDelete, isSaved }: AnalysisResultProps) {
  const [showCopied, setShowCopied] = useState(false)

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href + '/analiz/' + analysis.id)
      setShowCopied(true)
      setTimeout(() => setShowCopied(false), 2000)
    } catch {
      onShare?.()
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-slide-up">
      {/* Decision Card */}
      <div className={`rounded-xl p-6 border ${KARAR_COLOR[analysis.karar]}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider opacity-70 mb-1">Karar</p>
            <h2 className="text-2xl font-bold">{KARAR_LABEL[analysis.karar]}</h2>
            <p className="text-sm opacity-80 mt-1">{analysis.karar_aciklama}</p>
          </div>
          <div className={`text-6xl font-bold ${KARAR_COLOR[analysis.karar].split(' ')[0]}`}>
            {analysis.karar === 'AL' ? '✓' : analysis.karar === 'DIKKATLI_OL' ? '!' : '✗'}
          </div>
        </div>
      </div>

      {/* Price Summary */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-sm font-medium text-gray-400 mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          Fiyat Analizi
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-gray-500">Piyasa Değeri</p>
            <p className="text-xl font-bold text-white">{analysis.piyasa_degeri?.toLocaleString('tr-TR')} ₺</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Maks. Alım</p>
            <p className="text-xl font-bold text-green-500">{analysis.max_alim_fiyati?.toLocaleString('tr-TR')} ₺</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Hedef Satış</p>
            <p className="text-xl font-bold text-blue-500">{analysis.hedef_satis_fiyati?.toLocaleString('tr-TR')} ₺</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Tahmini Kâr</p>
            <p className="text-xl font-bold text-accent-500">{analysis.tahmini_kar?.toLocaleString('tr-TR')} ₺</p>
          </div>
        </div>
      </div>

      {/* Vehicle Info */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-sm font-medium text-gray-400 mb-4 flex items-center gap-2">
          <Car className="w-4 h-4" />
          Araç Bilgileri
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Car className="w-4 h-4 text-gray-500" />
            <span>{analysis.marka} {analysis.model}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span>{analysis.yil} Model</span>
          </div>
          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-gray-500" />
            <span>{analysis.km?.toLocaleString('tr-TR')} km</span>
          </div>
          <div className="flex items-center gap-2">
            <Fuel className="w-4 h-4 text-gray-500" />
            <span>{analysis.yakit}</span>
          </div>
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-gray-500" />
            <span>{analysis.vites}</span>
          </div>
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-gray-500" />
            <span>{analysis.renk}</span>
          </div>
        </div>
        {analysis.ilan_fiyati && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <p className="text-sm text-gray-400">İlan Fiyatı</p>
            <p className="text-lg font-semibold">{analysis.ilan_fiyati?.toLocaleString('tr-TR')} ₺</p>
          </div>
        )}
      </div>

      {/* Risk Analysis */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-sm font-medium text-gray-400 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          Risk Analizi
        </h3>
        <div className="flex items-center gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-500">Risk Skoru</p>
            <p className={`text-2xl font-bold ${RISK_COLOR(analysis.risk_skoru || 5)}`}>
              {analysis.risk_skoru}/10
            </p>
          </div>
          <div className="flex-1">
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  (analysis.risk_skoru || 5) <= 3 ? 'bg-green-500' :
                  (analysis.risk_skoru || 5) <= 6 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${(analysis.risk_skoru || 5) * 10}%` }}
              />
            </div>
          </div>
        </div>
        {analysis.risk_items && analysis.risk_items.length > 0 && (
          <ul className="space-y-1">
            {analysis.risk_items.map((item, idx) => (
              <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                <span className="text-yellow-500">•</span>
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Negotiation Scripts */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-sm font-medium text-gray-400 mb-4 flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          Pazarlık Taktikleri
        </h3>
        <div className="space-y-3">
          {analysis.pazarlik_nazik && (
            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <p className="text-xs text-green-400 mb-1">Nazik Yaklaşım</p>
              <p className="text-sm">"{analysis.pazarlik_nazik}"</p>
            </div>
          )}
          {analysis.pazarlik_dengeli && (
            <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <p className="text-xs text-blue-400 mb-1">Dengeli Yaklaşım</p>
              <p className="text-sm">"{analysis.pazarlik_dengeli}"</p>
            </div>
          )}
          {analysis.pazarlik_sert && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <p className="text-xs text-red-400 mb-1">Sert Yaklaşım</p>
              <p className="text-sm">"{analysis.pazarlik_sert}"</p>
            </div>
          )}
        </div>
      </div>

      {/* AI Comment */}
      {analysis.ai_yorum && (
        <div className="glass rounded-xl p-6">
          <h3 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
            <Target className="w-4 h-4" />
            AI Yorumu
          </h3>
          <p className="text-sm text-gray-300 leading-relaxed">{analysis.ai_yorum}</p>
        </div>
      )}

      {/* Market Data */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-sm font-medium text-gray-400 mb-4">Piyasa Karşılaştırması</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 rounded-lg bg-white/5">
            <p className="text-xs text-gray-500">Min Fiyat</p>
            <p className="text-lg font-semibold">{analysis.piyasa_min?.toLocaleString('tr-TR')} ₺</p>
          </div>
          <div className="p-3 rounded-lg bg-white/5">
            <p className="text-xs text-gray-500">Ortalama</p>
            <p className="text-lg font-semibold text-brand-500">{analysis.piyasa_ortalama?.toLocaleString('tr-TR')} ₺</p>
          </div>
          <div className="p-3 rounded-lg bg-white/5">
            <p className="text-xs text-gray-500">Max Fiyat</p>
            <p className="text-lg font-semibold">{analysis.piyasa_max?.toLocaleString('tr-TR')} ₺</p>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-3 text-center">
          {analysis.piyasa_adet} ilan analiz edildi
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        {!isSaved && onSave && (
          <button
            onClick={onSave}
            className="flex-1 px-4 py-3 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Shield className="w-4 h-4" />
            Kaydet
          </button>
        )}
        <button
          onClick={handleShare}
          className="flex-1 px-4 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-colors flex items-center justify-center gap-2"
        >
          <Share2 className="w-4 h-4" />
          {showCopied ? 'Kopyalandı!' : 'Paylaş'}
        </button>
        {onDelete && (
          <button
            onClick={onDelete}
            className="px-4 py-3 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}
