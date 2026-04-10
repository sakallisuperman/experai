import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Check, Zap, Star, Shield, Clock, FileText, Bell, Crown } from 'lucide-react'

export default function FiyatlandirmaPage() {
  return (
    <div className="min-h-screen">
      <Header />

      <main className="pt-24 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Basit, Şeffaf Fiyatlandırma</h1>
            <p className="text-gray-400 max-w-xl mx-auto">
              Başlangıçta ücretsiz. İhtiyacınız olduğunda Premium'a geçin. Herhangi bir gizli ücret yok.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Free Plan */}
            <div className="glass rounded-2xl p-8 relative">
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Ücretsiz</h3>
                <p className="text-4xl font-bold">0 ₺<span className="text-base font-normal text-gray-500">/ay</span></p>
              </div>

              <p className="text-sm text-gray-400 mb-6">Arada bir araç alıp satanlar için ideal.</p>

              <ul className="space-y-3 mb-8">
                {[
                  { icon: Check, text: 'Günde 3 analiz', included: true },
                  { icon: Check, text: 'Temel fiyat analizi', included: true },
                  { icon: Check, text: 'Risk skoru hesaplama', included: true },
                  { icon: Check, text: 'Pazarlık taktikleri', included: true },
                  { icon: Check, text: 'Son 10 analiz geçmişi', included: true },
                  { icon: Clock, text: 'Sınırsız analiz', included: false },
                  { icon: FileText, text: 'Detaylı PDF rapor', included: false },
                  { icon: Bell, text: 'Favori araç bildirimi', included: false },
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm">
                    <item.icon className={`w-4 h-4 ${item.included ? 'text-green-500' : 'text-gray-600'}`} />
                    <span className={item.included ? 'text-gray-300' : 'text-gray-600'}>{item.text}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/kayit"
                className="block w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-center font-medium transition-colors"
              >
                Ücretsiz Başla
              </Link>
            </div>

            {/* Premium Plan */}
            <div className="rounded-2xl p-8 bg-gradient-to-br from-brand-600/20 to-brand-700/20 border border-brand-500/30 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-brand-500 to-brand-600 text-sm font-medium flex items-center gap-1">
                <Crown className="w-4 h-4" />
                Popüler
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                  Premium
                  <Zap className="w-5 h-5 text-yellow-500" />
                </h3>
                <p className="text-4xl font-bold">99 ₺<span className="text-base font-normal text-gray-500">/ay</span></p>
              </div>

              <p className="text-sm text-gray-400 mb-6">Sık araç alıp satanlar ve profesyoneller için.</p>

              <ul className="space-y-3 mb-8">
                {[
                  { icon: Check, text: 'Sınırsız analiz', included: true },
                  { icon: Check, text: 'Tüm ücretsiz özellikler', included: true },
                  { icon: FileText, text: 'Detaylı PDF rapor indirme', included: true },
                  { icon: Bell, text: 'Favori araç bildirimleri', included: true },
                  { icon: Star, text: 'Pazar trendleri raporu', included: true },
                  { icon: Shield, text: 'Öncelikli destek', included: true },
                  { icon: Clock, text: 'Analiz geçmişi (sınırsız)', included: true },
                  { icon: Star, text: 'Yeni özellikler (erken erişim)', included: true },
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm">
                    <item.icon className="w-4 h-4 text-green-500" />
                    <span className="text-gray-300">{item.text}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/abonelik"
                className="block w-full py-3 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-center font-medium transition-all shadow-lg shadow-brand-500/25"
              >
                Premium'a Geç
              </Link>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-20">
            <h2 className="text-2xl font-bold text-center mb-8">Sık Sorulan Sorular</h2>

            <div className="max-w-2xl mx-auto space-y-4">
              {[
                {
                  q: 'Analiz limiti ne zaman yenileniyor?',
                  a: 'Günlük limit her gece saat 00:00\'da yenileniyor.',
                },
                {
                  q: 'Premium aboneliğimi iptal edebilir miyim?',
                  a: 'Evet, istediğiniz zaman iptal edebilirsiniz. İptal ettikten sonra dönem sonuna kadar Premium kullanmaya devam edersiniz.',
                },
                {
                  q: 'Hangi ödeme yöntemlerini kabul ediyorsunuz?',
                  a: 'Kredi kartı, banka kartı ve dijital cüzdanlar kabul ediliyor. Kredi kartı ile ödemeler Stripe tarafından güvenli şekilde işlenir.',
                },
                {
                  q: 'PDF raporu ne içerir?',
                  a: 'Detaylı araç analizi, piyasa karşılaştırması, risk raporu, kronik sorunlar ve pazarlık taktiklerini içeren kapsamlı bir rapor.',
                },
              ].map((faq, idx) => (
                <div key={idx} className="glass rounded-xl p-6">
                  <h3 className="font-semibold mb-2">{faq.q}</h3>
                  <p className="text-sm text-gray-400">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-20 text-center">
            <p className="text-gray-400 mb-4">Hala emin misiniz?</p>
            <Link href="/arac-ekle" className="text-brand-500 hover:underline">
              Ücretsiz deneyin
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
