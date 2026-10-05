import { Bell, Search, User } from "lucide-react"

export function Topbar() {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-10">
      <div className="flex-1 flex items-center">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Ürün, sipariş veya müşteri ara..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/20 focus:border-amber-400 transition-all"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-full hover:bg-slate-100">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full border border-white"></span>
        </button>
        
        <div className="h-8 w-px bg-slate-200 mx-2"></div>
        
        <div className="flex items-center gap-3 cursor-pointer p-1 rounded-lg hover:bg-slate-50 transition-colors">
          <div className="h-8 w-8 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center font-bold text-sm">
            AD
          </div>
          <div className="text-sm">
            <p className="font-medium text-slate-700">Yönetici</p>
            <p className="text-xs text-slate-500">Super Admin</p>
          </div>
        </div>
      </div>
    </header>
  )
}
