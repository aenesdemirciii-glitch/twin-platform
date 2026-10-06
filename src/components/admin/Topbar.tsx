import { Search } from "lucide-react"

export function Topbar() {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-10">
      <div className="flex-1 flex items-center">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Arama modülü geliştirme aşamasındadır..." 
            disabled
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-400 focus:outline-none cursor-not-allowed"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Bildirim zili geliştirme aşamasında olduğundan gizlendi */}
        
        <div className="flex items-center gap-3 p-1 rounded-lg">
          <div className="h-8 w-8 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center font-bold text-sm">
            AD
          </div>
          <div className="text-sm">
            <p className="font-medium text-slate-700">Yönetici</p>
            <p className="text-xs text-slate-500">Tam Yetkili</p>
          </div>
        </div>
      </div>
    </header>
  )
}
