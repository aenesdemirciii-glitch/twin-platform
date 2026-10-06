import prisma from "@/lib/prisma"
import { ClientSettingsForm } from "./ClientSettingsForm"

export default async function AdminSettingsPage() {
  const settings = await prisma.settings.findMany()
  const settingsMap = settings.reduce((acc: any, curr: any) => {
    acc[curr.key] = curr.value
    return acc
  }, {})

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Site Ayarları</h2>
        <p className="text-sm text-slate-500 mt-1">Mağaza bilgileri, logo, sosyal medya ve ödeme sistemi (iyzico) ayarları.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-6">
        <ClientSettingsForm initialSettings={settingsMap} />
      </div>
    </div>
  )
}
