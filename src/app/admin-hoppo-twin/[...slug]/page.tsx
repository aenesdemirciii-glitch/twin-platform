import { AlertCircle } from "lucide-react"

export default async function AdminFallbackPage(props: { params: Promise<{ slug: string[] }> }) {
  const params = await props.params;
  const pageName = params.slug.join('/')
    .split('/')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  return (
    <div className="flex flex-col items-center justify-center h-[70vh] w-full bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200">
      <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-6">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-bold text-slate-800 mb-3">{pageName} Modülü</h2>
      <p className="text-slate-500 font-medium max-w-md text-center leading-relaxed">
        Bu özellik mevcut altyapıyla geliştirme aşamasındadır. En kısa sürede yönetilebilir hale getirilecektir.
      </p>
    </div>
  )
}
