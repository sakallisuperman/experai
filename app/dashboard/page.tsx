import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Car, Clock, Trash2, ExternalLink, Search } from 'lucide-react'

export default async function DashboardPage() {
  const user = await currentUser()

  if (!user) {
    redirect('/giris')
  }

  // Placeholder data - in production, fetch from Supabase
  const recentAnalyses = [
    {
      id: '1',
      marka: 'Toyota',
      model: 'Corolla',
      yil: 2020,
      created_at: new Date().toISOString(),
      piyasa_degeri: 850000,
      karar: 'AL',
    },
    {
      id: '2',
      marka: 'Volkswagen',
      model: 'Passat',
      yil: 2019,
      created_at: new Date(Date.now() - 86400000).toISOString(),
      piyasa_degeri: 920000,
      karar: 'DIKKATLI_OL',
    },
  ]

  return (
    <div className="min-h-screen">
      <Header />

      <main className="pt-24 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* User Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-1">Hoş Geldin, {user.firstName}</h1>
            <p className="text-gray-400">Analiz geçmişiniz ve ayarlarınız</p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Link
              href="/arac-ekle"
              className="glass rounded-xl p-4 hover:bg-white/[0.08] transition-colors group"
            >
              <Search className="w-6 h-6 text-brand-500 mb-2" />
              <p className="font-medium text-sm">Yeni Analiz</p>
              <p className="text-xs text-gray-500">Araç analiz et</p>
            </Link>
            <Link
              href="/favoriler"
              className="glass rounded-xl p-4 hover:bg-white/[0.08] transition-colors group"
            >
              <Car className="w-6 h-6 text-brand-500 mb-2" />
              <p className="font-medium text-sm">Favoriler</p>
              <p className="text-xs text-gray-500">Kayıtlı araçlar</p>
            </Link>
            <Link
              href="/abonelik"
              className="glass rounded-xl p-4 hover:bg-white/[0.08] transition-colors group"
            >
              <Car className="w-6 h-6 text-brand-500 mb-2" />
              <p className="font-medium text-sm">Premium</p>
              <p className="text-xs text-gray-500">Abonelik yönetimi</p>
            </Link>
            <Link
              href="/ayarlar"
              className="glass rounded-xl p-4 hover:bg-white/[0.08] transition-colors group"
            >
              <Car className="w-6 h-6 text-brand-500 mb-2" />
              <p className="font-medium text-sm">Ayarlar</p>
              <p className="text-xs text-gray-500">Profil ve hesap</p>
            </Link>
          </div>

          {/* Recent Analyses */}
          <div className="glass rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Clock className="w-5 h-5 text-brand-500" />
                Son Analizler
              </h2>
              <Link href="/gecmis" className="text-sm text-brand-500 hover:underline">
                Tümünü Gör
              </Link>
            </div>

            {recentAnalyses.length > 0 ? (
              <div className="space-y-3">
                {recentAnalyses.map((analysis) => (
                  <Link
                    key={analysis.id}
                    href={`/sonuc/${analysis.id}`}
                    className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-brand-500/20 flex items-center justify-center">
                        <Car className="w-5 h-5 text-brand-500" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {analysis.marka} {analysis.model} ({analysis.yil})
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(analysis.created_at).toLocaleDateString('tr-TR')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-semibold">{analysis.piyasa_degeri?.toLocaleString('tr-TR')} ₺</p>
                        <p className={`text-xs ${
                          analysis.karar === 'AL' ? 'text-green-500' :
                          analysis.karar === 'DIKKATLI_OL' ? 'text-yellow-500' : 'text-red-500'
                        }`}>
                          {analysis.karar === 'AL' ? 'AL' : analysis.karar === 'DIKKATLI_OL' ? 'DİKKATLİ OL' : 'KAÇIN'}
                        </p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Car className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">Henüz analiz yapmadınız</p>
                <Link
                  href="/arac-ekle"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm transition-colors"
                >
                  İlk Analizini Yap
                </Link>
              </div>
            )}
          </div>

          {/* Usage Stats (Placeholder) */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="glass rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-brand-500">{recentAnalyses.length}</p>
              <p className="text-xs text-gray-500">Toplam Analiz</p>
            </div>
            <div className="glass rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-green-500">
                {recentAnalyses.filter(a => a.karar === 'AL').length}
              </p>
              <p className="text-xs text-gray-500">Alım Önerisi</p>
            </div>
            <div className="glass rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-yellow-500">3/3</p>
              <p className="text-xs text-gray-500">Ücretsiz Kalan</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
