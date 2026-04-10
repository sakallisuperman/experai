'use client'

import Link from 'next/link'
import { useUserButton, useAuth } from '@clerk/nextjs'
import { Car, User, Menu, X, LogOut, History, Crown } from 'lucide-react'
import { useState } from 'react'

export default function Header() {
  const { isSignedIn, user } = useAuth()
  const { openUserButton } = useUserButton()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-dark">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center transition-transform group-hover:scale-105">
              <Car className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">
              Exper<span className="text-brand-500">AI</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/#ozellikler" className="text-sm text-gray-400 hover:text-white transition-colors">
              Özellikler
            </Link>
            <Link href="/fiyatlandirma" className="text-sm text-gray-400 hover:text-white transition-colors">
              Fiyatlandırma
            </Link>

            {isSignedIn ? (
              <>
                <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1.5">
                  <History className="w-4 h-4" />
                  Geçmiş
                </Link>
                <Link href="/favoriler" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1.5">
                  <Car className="w-4 h-4" />
                  Favoriler
                </Link>
                <button
                  onClick={openUserButton}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm truncate max-w-[100px]">{user?.firstName || 'Hesap'}</span>
                </button>
              </>
            ) : (
              <>
                <Link href="/giris" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Giriş Yap
                </Link>
                <Link
                  href="/kayit"
                  className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium transition-colors"
                >
                  Ücretsiz Başla
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10 animate-fade-in">
            <div className="flex flex-col gap-3">
              <Link
                href="/#ozellikler"
                className="px-3 py-2 rounded-lg hover:bg-white/10 text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                Özellikler
              </Link>
              <Link
                href="/fiyatlandirma"
                className="px-3 py-2 rounded-lg hover:bg-white/10 text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                Fiyatlandırma
              </Link>

              {isSignedIn ? (
                <>
                  <Link
                    href="/dashboard"
                    className="px-3 py-2 rounded-lg hover:bg-white/10 text-sm flex items-center gap-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <History className="w-4 h-4" />
                    Geçmiş
                  </Link>
                  <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 text-sm text-left">
                    <LogOut className="w-4 h-4" />
                    Çıkış Yap
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/giris"
                    className="px-3 py-2 rounded-lg hover:bg-white/10 text-sm"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Giriş Yap
                  </Link>
                  <Link
                    href="/kayit"
                    className="px-3 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Ücretsiz Başla
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
