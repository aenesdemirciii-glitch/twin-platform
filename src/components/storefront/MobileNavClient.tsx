"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Menu, X, ChevronRight } from "lucide-react"

export function MobileNavClient({ categories }: { categories: any[] }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <>
      <div className="flex items-center gap-3 sm:gap-6 md:hidden">
        <button 
          onClick={() => setIsSearchOpen(!isSearchOpen)}
          className="flex flex-col items-center justify-center p-2 text-brand-slate hover:text-brand-gold transition-colors"
        >
          {isSearchOpen ? <X className="h-6 w-6" /> : <Search className="h-6 w-6" />}
        </button>
        <button 
          onClick={() => setIsMenuOpen(true)}
          className="flex flex-col items-center justify-center p-2 text-brand-slate hover:text-brand-gold transition-colors"
        >
          <Menu className="h-7 w-7" />
        </button>
      </div>

      {/* Mobile Search Expandable Area */}
      {isSearchOpen && (
        <div className="absolute top-20 left-0 w-full bg-white border-b border-brand-slate/20 p-4 z-40 md:hidden shadow-lg animate-in slide-in-from-top-2">
          <form action="/arama" method="GET" className="relative w-full">
            <input 
              type="text" 
              name="q"
              placeholder="Ne aramıştınız? Örn: fıstık..." 
              autoFocus
              className="w-full bg-brand-slate/5 border-2 border-brand-slate/20 rounded-full py-3 pl-5 pr-14 text-sm font-bold focus:outline-none focus:border-brand-gold text-brand-slate placeholder:text-brand-slate/50 transition-colors"
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-brand-gold text-brand-slate rounded-full hover:bg-amber-500 transition-colors">
              <Search className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      {/* Mobile Sidebar Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <div className="absolute inset-0 bg-brand-slate/60 backdrop-blur-sm transition-opacity" onClick={() => setIsMenuOpen(false)}></div>
          <div className="absolute top-0 right-0 w-[80%] max-w-sm h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right">
            <div className="flex items-center justify-between p-6 border-b border-brand-slate/10 bg-brand-slate/5">
              <span className="text-xl font-black text-brand-slate">Menü</span>
              <button onClick={() => setIsMenuOpen(false)} className="p-2 bg-white rounded-full shadow-sm text-brand-slate hover:text-red-500">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto py-4">
              <ul className="flex flex-col">
                <li>
                  <Link href="/" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between px-6 py-4 font-bold text-brand-slate border-b border-slate-100 active:bg-slate-50">
                    Ana Sayfa <ChevronRight className="h-4 w-4 opacity-50" />
                  </Link>
                </li>
                {categories.slice(0, 10).map((cat) => (
                  <li key={cat.id}>
                    <Link href={`/kategori/${cat.slug}`} onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between px-6 py-4 font-bold text-brand-slate border-b border-slate-100 active:bg-slate-50">
                      {cat.name} <ChevronRight className="h-4 w-4 opacity-50" />
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/kategoriler" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between px-6 py-4 font-black text-brand-gold border-b border-slate-100 active:bg-slate-50">
                    Tüm Kategoriler <ChevronRight className="h-4 w-4 opacity-50" />
                  </Link>
                </li>
                <li>
                  <Link href="/sayfa/hakkimizda" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between px-6 py-4 font-bold text-brand-slate border-b border-slate-100 active:bg-slate-50">
                    Hakkımızda <ChevronRight className="h-4 w-4 opacity-50" />
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
