import { ClientPageForm } from "../ClientPageForm"

export default function NewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Yeni Sayfa</h2>
        <p className="text-sm text-slate-500 mt-1">Hakkımızda veya İletişim gibi yeni bir sayfa oluşturun.</p>
      </div>

      <ClientPageForm />
    </div>
  )
}
