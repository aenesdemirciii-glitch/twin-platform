"use client"

import { Search } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useTransition, useState, useEffect } from "react"

export function SearchInput({ placeholder = "Ara..." }: { placeholder?: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  
  const [value, setValue] = useState(searchParams.get("q") || "")

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set("q", value)
      } else {
        params.delete("q")
      }
      
      startTransition(() => {
        router.push(`?${params.toString()}`)
      })
    }, 500)

    return () => clearTimeout(timer)
  }, [value, router, searchParams])

  return (
    <div className="relative w-full sm:w-80">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
      <input 
        type="text" 
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
      />
      {isPending && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 border-2 border-slate-200 border-t-amber-400 rounded-full animate-spin"></div>
      )}
    </div>
  )
}
