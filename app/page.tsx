import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Car, Shield, TrendingUp, Clock, Zap, Check, ArrowRight, Star, Users, BarChart3 } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 mb-8 animate-fade-in">
            <Zap className="w-4 h-4 text-brand-500" />
            <span className="text-sm text-brand-400">AI Destekli Araç Analizi</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight animate-slide-up">
            İkinci El Araba Alırken
            <br />
            <span className="bg-gradient-to-r from-brand-500 to-blue-500 bg-clip-text text-transparent">
              Kandırılmayın
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            ExperAI, AI destekli analiz ile ikinci el araçların gerçek piyasa değerini hesaplar.
            Risk skorları, kâr tahminleri ve pazarlık taktikleri ile en doğru kararı verin.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link
              href="/arac-ekle"
              className="px-8 py-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-lg transition-all hover:scale-105 flex items-center gap-2"
            >
              Analiz Et
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/fiyatlandirma"
              className="px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
            >
              Fiyatlandırma
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 mt-16 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div>
              <p className="text-3xl font-bold text-white">50+</p>
              <p className="text-sm text-gray-500">Marka</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">1000+</p>
              <p className="text-sm text-gray-500">Model</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">8K+</p>
              <p className="text-sm text-gray-500">İlan Analiz Edildi</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="ozellikler" className="py-20 px-4 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Neden ExperAI?</h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Geleneksel değerleme yöntemlerinin ötesinde, AI destekli kapsamlı analiz
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <Car className="w-6 h-6" />,
                title: 'Akıllı Fiyat Analizi',
                description: 'Yüzlerce ilanı tarayıp gerçek piyasa değerini hesaplar. Aşırı pahalı veya şüpheli ilanları tespit eder.',
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: 'Risk Skoru',
                description: 'Araçların kronik sorunlarını, hasar geçmişini ve risk faktörlerini detaylı raporlar.',
              },
              {
                icon: <TrendingUp className="w-6 h-6" />,
                title: 'Kâr Hesabı',
                description: 'Flip, bekle veya yatırım moduna göre tahmini kâr hesaplaması yapar.',
              },
              {
                icon: <Clock className="w-6 h-6" />,
                title: 'Hızlı Sonuç',
                description: '30 saniyede tam analiz. İlan linki yapıştır veya formu doldur, sonucu al.',
              },
              {
                icon: <BarChart3 className="w-6 h-6" />,
                title: 'Pazarlık Taktiği',
                description: 'Nazik, dengeli ve sert olmak üzere 3 farklı pazarlık senaryosu sunar.',
              },
              {
                icon: <Star className="w-6 h-6" />,
                title: 'Premium Rapor',
                description: 'Detaylı PDF rapor, favori takibi ve daha fazlası Premium üyelik ile.',
              },
            ].map((feature, idx) => (
              <div key={idx} className="glass rounded-xl p-6 hover:bg-white/[0.08] transition-colors group">
                <div className="w-12 h-12 rounded-xl bg-brand-500/20 flex items-center justify-center text-brand-500 mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nasıl Çalışır?</h2>
            <p className="text-gray-400">3 basit adımda aracınızı analiz edin</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'İlan Linki Yapıştır',
                description: 'Sahibinden.com veya arabam.com\'dan araç ilan linkini yapıştırın.',
              },
              {
                step: '02',
                title: 'Bilgileri Doğrula',
                description: 'Sistem bilgileri otomatik çeksin veya siz manuel girin.',
              },
              {
                step: '03',
                title: 'Analiz Sonucunu Al',
                description: 'AI analizi, fiyat önerisi ve pazarlık taktikleri anında gelsin.',
              },
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div className="text-[120px] font-bold text-white/5 absolute -top-10 -left-4">
                  {item.step}
                </div>
                <div className="relative z-10">
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-400">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 px-4 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Basit Fiyatlandırma</h2>
            <p className="text-gray-400">Başlangıçta ücretsiz, ihtiyacınız olduğunda Premium'a geçin</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Free Plan */}
            <div className="glass rounded-xl p-8">
              <h3 className="text-xl font-semibold mb-2">Ücretsiz</h3>
              <p className="text-3xl font-bold mb-6">0 ₺<span className="text-sm font-normal text-gray-500">/ay</span></p>
              <ul className="space-y-3 mb-8">
                {['Günde 3 analiz', 'Temel fiyat analizi', 'Risk skoru', 'Pazarlık taktikleri'].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/kayit"
                className="block w-full py-3 rounded-lg bg-white/10 hover:bg-white/20 text-center font-medium transition-colors"
              >
                Ücretsiz Başla
              </Link>
            </div>

            {/* Premium Plan */}
            <div className="rounded-xl p-8 bg-gradient-to-br from-brand-600/20 to-brand-700/20 border border-brand-500/30 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-brand-500 text-xs font-medium">
                Popüler
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium</h3>
              <p className="text-3xl font-bold mb-6">99 ₺<span className="text-sm font-normal text-gray-500">/ay</span></p>
              <ul className="space-y-3 mb-8">
                {['Sınırsız analiz', 'Detaylı PDF rapor', 'Favori araç takibi', 'Pazar trendleri', '优先 destek'].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/fiyatlandirma"
                className="block w-full py-3 rounded-lg bg-brand-600 hover:bg-brand-700 text-center font-medium transition-colors"
              >
                Premium'a Geç
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Hemen Araç Analizi Yapmaya Başlayın
          </h2>
          <p className="text-gray-400 mb-8">
            İlk analiz ücretsiz. Kayıt olmadan bile deneyebilirsiniz.
          </p>
          <Link
            href="/arac-ekle"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-lg transition-all hover:scale-105"
          >
            Hemen Başla
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
