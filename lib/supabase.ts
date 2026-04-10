import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Analysis {
  id: string
  user_id: string | null
  created_at: string
  marka: string
  model: string
  yil: number
  km: number
  yakit: string
  vites: string
  motor_hacmi: string
  motor_gucu: string
  kasa: string
  renk: string
  ilan_fiyati: number | null
  parcalar: string[]
  kullanici_tip: 'bireysel' | 'galeri'
  analiz_mod: 'flip' | 'beklet' | 'fiyat'
  // AI Analysis Results
  karar: 'AL' | 'DIKKATLI_OL' | 'KACIN'
  karar_aciklama: string
  piyasa_degeri: number
  max_alim_fiyati: number
  hedef_satis_fiyati: number
  tahmini_kar: number
  satis_suresi: string
  risk_skoru: number
  risk_aciklamasi: string
  risk_items: string[]
  kronik_sorunlar: string
  pazarlik_nazik: string
  pazarlik_dengeli: string
  pazarlik_sert: string
  ai_yorum: string
  fiyat_etkisi: number
  // Market data
  piyasa_ortalama: number
  piyasa_min: number
  piyasa_max: number
  piyasa_adet: number
}

export interface UserSubscription {
  id: string
  user_id: string
  plan: 'free' | 'premium'
  status: 'active' | 'cancelled' | 'expired'
  created_at: string
  expires_at: string | null
}
