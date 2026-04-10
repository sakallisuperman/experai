'use client'

import Link from 'next/link'
import { Github, Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <span className="font-bold text-lg">ExperAI</span>
            </Link>
            <p className="text-sm text-gray-400 max-w-sm mb-4">
              AI destekli ikinci el araç fiyat analizi. Doğru fiyat, akıllı yatırım.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/sakallisuperman/experai"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <Github className="w-5 h-5 text-gray-400" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-sm mb-4">Ürün</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/#ozellikler" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Özellikler
                </Link>
              </li>
              <li>
                <Link href="/fiyatlandirma" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Fiyatlandırma
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Analiz Geçmişi
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-sm mb-4">Yasal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/gizlilik" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Gizlilik Politikası
                </Link>
              </li>
              <li>
                <Link href="/kullanim" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Kullanım Şartları
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} ExperAI. Tüm hakları saklıdır.
          </p>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-red-500" /> in Turkey
          </p>
        </div>
      </div>
    </footer>
  )
}
