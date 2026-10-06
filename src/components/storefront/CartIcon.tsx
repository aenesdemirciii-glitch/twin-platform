"use client"

import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import { useCartStore } from "@/store/useCartStore"
import { useEffect, useState } from "react"

export function CartIcon() {
  const items = useCartStore((state) => state.items)
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch by waiting until mounted
  useEffect(() => {
    setMounted(true)
  }, [])

  const totalItems = items.reduce((total, item) => total + item.quantity, 0)

  return (
    <Link href="/sepet" className="flex flex-col items-center gap-1 text-brand-slate hover:text-brand-gold transition-colors relative group">
      <div className="relative">
        <ShoppingBag className="h-6 w-6" />
        {mounted && totalItems > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-brand-gold text-brand-slate h-4 w-4 rounded-full text-[10px] font-bold flex items-center justify-center">
            {totalItems}
          </span>
        )}
      </div>
      <span className="text-[10px] font-bold hidden sm:block">SEPETİM</span>
    </Link>
  )
}
