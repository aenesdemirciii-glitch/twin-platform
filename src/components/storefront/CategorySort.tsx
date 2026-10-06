"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { ChevronDown } from "lucide-react"

export function CategorySort() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentSort = searchParams.get("sort") || ""

  return (
    <div className="relative w-full sm:w-56">
      <select 
        value={currentSort}
        onChange={(e) => {
          const params = new URLSearchParams(searchParams.toString())
          if (e.target.value) {
            params.set("sort", e.target.value)
          } else {
            params.delete("sort")
          }
          // Reset page when sorting changes
          params.delete("page")
          router.push(`${pathname}?${params.toString()}`)
        }}
        className="w-full appearance-none bg-white border-2 border-brand-slate/20 text-brand-slate font-bold px-4 py-2.5 rounded-lg focus:outline-none focus:border-brand-gold cursor-pointer h-[44px]"
      >
        <option value="">Akıllı Sıralama</option>
        <option value="price_asc">Fiyata Göre Artan</option>
        <option value="price_desc">Fiyata Göre Azalan</option>
        <option value="newest">En Yeniler</option>
      </select>
      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-slate pointer-events-none" />
    </div>
  )
}
