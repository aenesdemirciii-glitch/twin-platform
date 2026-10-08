"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, ShoppingCart, Package, Users, Tag, Settings, FileText,
  BarChart3, LogOut, FolderTree, Boxes, Truck, Shield, History, Star, Menu, X
} from "lucide-react"
import { useState } from "react"

const menuItems = [
  { name: "Genel Bakış", href: "/admin-hoppo-twin", icon: LayoutDashboard },
  { name: "Siparişler", href: "/admin-hoppo-twin/siparisler", icon: ShoppingCart },
  { name: "Ürünler", href: "/admin-hoppo-twin/urunler", icon: Package },
  { name: "Kategoriler", href: "/admin-hoppo-twin/kategoriler", icon: FolderTree },
  { name: "Stok", href: "/admin-hoppo-twin/stok", icon: Boxes },
  { name: "Müşteriler", href: "/admin-hoppo-twin/musteriler", icon: Users },
  { name: "Kampanyalar", href: "/admin-hoppo-twin/kampanyalar", icon: Tag },
  { name: "Vitrin Yönetimi", href: "/admin-hoppo-twin/vitrin", icon: Star },
  { name: "İçerik Yönetimi", href: "/admin-hoppo-twin/icerik", icon: FileText },
  { name: "Kargo ve Teslimat", href: "/admin-hoppo-twin/kargo", icon: Truck },
  { name: "Raporlar", href: "/admin-hoppo-twin/raporlar", icon: BarChart3 },
  { name: "Kullanıcılar ve Yetkiler", href: "/admin-hoppo-twin/kullanicilar", icon: Shield },
  { name: "Site Ayarları", href: "/admin-hoppo-twin/ayarlar", icon: Settings },
  { name: "İşlem Geçmişi", href: "/admin-hoppo-twin/gecmis", icon: History },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed bottom-4 right-4 z-50 bg-amber-400 text-slate-900 p-4 rounded-full shadow-xl hover:bg-amber-500 transition-colors"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="md:hidden fixed inset-0 bg-black/50 z-40"
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "flex flex-col w-64 bg-slate-900 h-screen text-slate-300 fixed md:relative z-50 transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
          <h1 className="text-xl font-bold text-white tracking-wide">Platform<span className="text-amber-400">Admin</span></h1>
          <button onClick={() => setIsOpen(false)} className="md:hidden text-slate-400 hover:text-white p-1">
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-3">
            {menuItems.map((item) => {
              const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/admin-hoppo-twin")
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-slate-800 text-white" 
                      : "hover:bg-slate-800/50 hover:text-white"
                  )}
                >
                  <item.icon className={cn("h-5 w-5", isActive ? "text-amber-400" : "text-slate-400")} />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Çıkış Yap
          </button>
        </div>
      </div>
    </>
  )
}
