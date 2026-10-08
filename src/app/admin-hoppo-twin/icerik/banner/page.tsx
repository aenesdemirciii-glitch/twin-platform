import prisma from "@/lib/prisma"
import { ClientBannerForm } from "./ClientBannerForm"

export default async function BannerPage() {
  const settings = await prisma.settings.findMany({
    where: {
      key: {
        in: [
          "home_hero_image",
          "home_hero_title",
          "home_hero_subtitle",
          "home_hero_button_text",
          "home_hero_button_link",
          "home_hero_tag"
        ]
      }
    }
  })

  const initialSettings = settings.reduce((acc, curr) => {
    acc[curr.key] = curr.value
    return acc
  }, {} as Record<string, string>)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Ana Sayfa Banner Yönetimi</h2>
        <p className="text-sm text-slate-500 mt-1">Ana sayfadaki büyük karşılama görselini ve üzerindeki yazıları düzenleyin.</p>
      </div>

      <ClientBannerForm initialSettings={initialSettings} />
    </div>
  )
}
