import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import VitrinClient from "./VitrinClient"

export const metadata = {
  title: "Vitrin Yönetimi | Admin",
}

export default async function VitrinPage() {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect("/login")
  }

  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
      isFeatured: true,
      isNew: true,
      images: {
        take: 1,
        select: { url: true }
      }
    },
    orderBy: { name: "asc" }
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Vitrin ve Ana Sayfa Yönetimi</h1>
        <p className="text-slate-500 mt-1">Ana sayfada "Çok Satanlar" ve "Popüler Ürünler" kısımlarında gösterilecek ürünleri seçin.</p>
      </div>

      <VitrinClient products={products} />
    </div>
  )
}
