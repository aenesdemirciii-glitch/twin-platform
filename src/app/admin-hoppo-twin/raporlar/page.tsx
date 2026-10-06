import { Download, BarChart3, TrendingUp, TrendingDown } from "lucide-react"

export default function AdminReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Raporlar</h2>
          <p className="text-sm text-slate-500 mt-1">Satış, stok ve müşteri istatistiklerinizi analiz edin.</p>
        </div>
        <button disabled className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-400 rounded-lg text-sm font-medium cursor-not-allowed">
          <Download className="h-4 w-4" />
          CSV Olarak İndir (Pasif)
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-6">
          <BarChart3 className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Raporlama Modülü Hazırlanıyor</h3>
        <p className="text-slate-500 max-w-md mx-auto">
          Detaylı satış analizleri, iade raporları, tarihsel filtreleme ve CSV indirme özellikleri mevcut altyapıda geliştirme aşamasındadır. Özet veriler için "Genel Bakış" ekranını kullanabilirsiniz.
        </p>
      </div>
    </div>
  )
}
