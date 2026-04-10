# ExperAI - İkinci El Araç Yatırım Asistanı

![ExperAI](https://experai.vercel.app)

AI destekli ikinci el araç fiyat analizi, risk skoru ve kâr hesabı platformu.

## Özellikler

- **AI Destekli Fiyat Analizi**: Sahibinden ve arabam.com'dan ilan verilerini çekip gerçek piyasa değerini hesaplar
- **Risk Skoru**: Araçların kronik sorunlarını, hasar geçmişini ve risk faktörlerini analiz eder
- **Kâr Hesaplama**: Flip, Beklet veya Yatırım modlarına göre tahmini kâr hesaplaması
- **Pazarlık Taktikleri**: Nazik, dengeli ve sert olmak üzere 3 farklı pazarlık senaryosu
- **Kullanıcı Sistemi**: Kayıt ol, analiz geçmişini kaydet, favorilere ekle
- **Premium Abonelik**: Sınırsız analiz, PDF rapor, pazar trendleri

## Tech Stack

| Kategori | Teknoloji |
|----------|-----------|
| Framework | Next.js 14 (App Router) |
| Dil | TypeScript |
| Stil | Tailwind CSS |
| Auth | Clerk |
| Veritabanı | Supabase |
| AI | Groq (Llama 3.3) |
| Arama | Serper |
| Deploy | Vercel |

## Kurulum

```bash
# Bağımlılıkları yükle
npm install

# .env.local dosyasını oluştur
cp .env.example .env.local

# Geliştirme sunucusunu başlat
npm run dev
```

## Ortam Değişkenleri

`.env.local` dosyasına aşağıdaki değişkenleri ekleyin:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/giris
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/kayit
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxx
SUPABASE_SERVICE_ROLE_KEY=eyJxxxxx

# Groq AI
GROQ_API_KEY=gsk_xxxxx

# Serper (Google Search)
SERPER_API_KEY=xxxxx
```

## Supabase Veritabanı Şeması

Supabase SQL Editor'de aşağıdaki kodları çalıştırın:

```sql
-- Analizler tablosu
create table analizler (
  id uuid default gen_random_uuid() primary key,
  user_id text,
  created_at timestamp with time zone default now(),
  marka text not null,
  model text not null,
  yil integer,
  km integer,
  yakit text,
  vites text,
  motor_hacmi text,
  motor_gucu text,
  kasa text,
  renk text,
  ilan_fiyati integer,
  parcalar text[],
  kullanici_tip text,
  analiz_mod text,
  karar text,
  karar_aciklama text,
  piyasa_degeri integer,
  max_alim_fiyati integer,
  hedef_satis_fiyati integer,
  tahmini_kar integer,
  satis_suresi text,
  risk_skoru integer,
  risk_aciklamasi text,
  risk_items text[],
  kronik_sorunlar text,
  pazarlik_nazik text,
  pazarlik_dengeli text,
  pazarlik_sert text,
  ai_yorum text,
  fiyat_etkisi integer,
  piyasa_ortalama integer,
  piyasa_min integer,
  piyasa_max integer,
  piyasa_adet integer
);

-- Abonelikler tablosu
create table abonelikler (
  id uuid default gen_random_uuid() primary key,
  user_id text not null unique,
  plan text default 'free',
  status text default 'active',
  created_at timestamp with time zone default now(),
  expires_at timestamp with time zone
);

-- Row Level Security (RLS)
alter table analizler enable row level security;
alter table abonelikler enable row level security;

-- RLS Policy'leri
create policy "Users can view own analyses"
  on analizler for select
  using (auth.uid()::text = user_id);

create policy "Users can insert own analyses"
  on analizler for insert
  with check (auth.uid()::text = user_id);

create policy "Users can delete own analyses"
  on analizler for delete
  using (auth.uid()::text = user_id);

create policy "Users can view own subscription"
  on abonelikler for select
  using (auth.uid()::text = user_id);

create policy "Service role can manage subscriptions"
  on abonelikler for all
  using (true)
  with check (true);
```

## Sayfa Yapısı

| Sayfa | Yol | Açıklama |
|-------|-----|----------|
| Ana Sayfa | `/` | Landing page, özellikler, fiyatlandırma |
| Araç Ekle | `/arac-ekle` | Analiz formu |
| Sonuç | `/sonuc` | Analiz sonuçları |
| Giriş | `/giris` | Clerk giriş sayfası |
| Kayıt | `/kayit` | Clerk kayıt sayfası |
| Dashboard | `/dashboard` | Kullanıcı paneli |
| Fiyatlandırma | `/fiyatlandirma` | Planlar ve FAQ |
| Gizlilik | `/gizlilik` | Gizlilik politikası |
| Kullanım | `/kullanim` | Kullanım şartları |

## API Endpoints

| Endpoint | Metod | Açıklama |
|----------|-------|----------|
| `/api/analyze` | POST | AI analizi çalıştır |
| `/api/search` | POST | Piyasa verisi ara |
| `/api/extract` | POST | İlan linkinden veri çek |
| `/api/save-analysis` | POST | Analizi kaydet |
| `/api/history` | GET | Kullanıcı geçmişini al |

## Para Kazanma Modeli

### Freemium
- **Ücretsiz**: Günde 3 analiz
- **Premium (99₺/ay)**: Sınırsız analiz + PDF rapor + Favori takibi

### Gelecek Planlar
- B2B API (Galericilere özel fiyatlandırma)
- Affiliate (Sigorta, kredi ortaklıkları)
- Marketplace komisyonu

## Katkıda Bulunma

1. Fork yapın
2. Branch oluşturun (`git checkout -b feature/ozellik`)
3. Commit yapın (`git commit -m 'Yeni özellik eklendi'`)
4. Push yapın (`git push origin feature/ozellik`)
5. Pull Request açın

## Lisans

MIT
