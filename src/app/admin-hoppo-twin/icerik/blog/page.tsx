import prisma from "@/lib/prisma"
import Link from "next/link"
import { Plus, Edit, Trash2 } from "lucide-react"

export default async function BlogListPage() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Blog Yazıları</h2>
          <p className="text-sm text-slate-500 mt-1">Sitenizdeki blog içeriklerini buradan yönetebilirsiniz.</p>
        </div>
        <Link href="/admin-hoppo-twin/icerik/blog/yeni" className="flex items-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-500 text-slate-900 rounded-lg text-sm font-bold shadow-sm transition-colors">
          <Plus className="h-4 w-4" />
          Yeni Yazı Ekle
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-sm text-slate-600">
              <th className="p-4 font-semibold">Başlık</th>
              <th className="p-4 font-semibold">Kategori</th>
              <th className="p-4 font-semibold">Durum</th>
              <th className="p-4 font-semibold text-right">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 font-medium text-slate-800">{post.title}</td>
                <td className="p-4 text-slate-500 text-sm">{post.category || "-"}</td>
                <td className="p-4">
                  {post.isActive ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">Yayında</span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800">Taslak</span>
                  )}
                </td>
                <td className="p-4 flex items-center justify-end gap-2">
                  <Link href={`/admin-hoppo-twin/icerik/blog/${post.id}`} className="p-2 text-slate-400 hover:text-amber-500 bg-white rounded-lg border shadow-sm">
                    <Edit className="h-4 w-4" />
                  </Link>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-500">
                  Henüz hiç blog yazısı eklenmemiş.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
