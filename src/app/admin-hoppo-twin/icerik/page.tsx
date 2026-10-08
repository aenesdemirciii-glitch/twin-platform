import { LayoutTemplate, Plus, FileText, Image as ImageIcon } from "lucide-react"
import Link from "next/link"

export default function AdminContentPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">İçerik Yönetimi</h2>
          <p className="text-sm text-slate-500 mt-1">Blog yazıları, kurumsal sayfalar ve slider görselleri.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-500 text-slate-900 rounded-lg text-sm font-bold shadow-sm transition-colors">
          <Plus className="h-4 w-4" />
          Yeni İçerik Ekle
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/admin-hoppo-twin/icerik/banner" className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col items-center justify-center text-center h-48 hover:border-amber-400 hover:shadow-md transition-all group cursor-pointer">
          <ImageIcon className="h-10 w-10 text-amber-500 mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="font-semibold text-slate-700 group-hover:text-amber-600 transition-colors">Ana Sayfa Banner</h3>
          <p className="text-xs text-slate-500 mt-2">Ana sayfadaki büyük görseli, yazıları ve buton linkini yönetin.</p>
        </Link>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col items-center justify-center text-center h-48 opacity-75">
          <FileText className="h-10 w-10 text-slate-300 mb-3" />
          <h3 className="font-semibold text-slate-700">Blog Yazıları</h3>
          <p className="text-xs text-slate-500 mt-2">Blog yazıları şu an 'blogData.ts' içerisinden çekilmektedir. Yakında panele eklenecektir.</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col items-center justify-center text-center h-48 opacity-75">
          <LayoutTemplate className="h-10 w-10 text-slate-300 mb-3" />
          <h3 className="font-semibold text-slate-700">Kurumsal Sayfalar</h3>
          <p className="text-xs text-slate-500 mt-2">Hakkımızda, İletişim gibi sayfalar kod düzeyinde statik şablonlarla yönetilmektedir.</p>
        </div>
      </div>
    </div>
  )
}
