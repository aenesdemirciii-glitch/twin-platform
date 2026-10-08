import prisma from "@/lib/prisma"
import Link from "next/link"
import { Plus, Edit } from "lucide-react"

export default async function PagesListPage() {
  const pages = await prisma.page.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Kurumsal Sayfalar</h2>
          <p className="text-sm text-slate-500 mt-1">Hakkımızda, İletişim gibi metin tabanlı sayfaları yönetin.</p>
        </div>
        <Link href="/admin-hoppo-twin/icerik/sayfalar/yeni" className="flex items-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-500 text-slate-900 rounded-lg text-sm font-bold shadow-sm transition-colors">
          <Plus className="h-4 w-4" />
          Yeni Sayfa Ekle
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-sm text-slate-600">
              <th className="p-4 font-semibold">Başlık</th>
              <th className="p-4 font-semibold">URL (Slug)</th>
              <th className="p-4 font-semibold">Durum</th>
              <th className="p-4 font-semibold text-right">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {pages.map((page) => (
              <tr key={page.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 font-medium text-slate-800">{page.title}</td>
                <td className="p-4 text-slate-500 text-sm">/{page.slug}</td>
                <td className="p-4">
                  {page.isActive ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">Yayında</span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800">Taslak</span>
                  )}
                </td>
                <td className="p-4 flex items-center justify-end gap-2">
                  <Link href={`/admin-hoppo-twin/icerik/sayfalar/${page.id}`} className="p-2 text-slate-400 hover:text-amber-500 bg-white rounded-lg border shadow-sm">
                    <Edit className="h-4 w-4" />
                  </Link>
                </td>
              </tr>
            ))}
            {pages.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-500">
                  Henüz hiç sayfa eklenmemiş.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
