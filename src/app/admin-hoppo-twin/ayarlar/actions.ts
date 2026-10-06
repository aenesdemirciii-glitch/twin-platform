"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function saveSettings(formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== "SUPER_ADMIN") {
    throw new Error("Yetkisiz işlem")
  }

  const entries = Array.from(formData.entries())
  
  for (const [key, value] of entries) {
    if (typeof value === "string" && !key.startsWith("$ACTION")) {
      await prisma.settings.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    }
  }

  // Log audit
  await prisma.auditLog.create({
    data: {
      userId: (session.user as any)?.id,
      action: "UPDATE",
      resource: "Settings",
      details: "Site ayarları güncellendi."
    }
  })

  revalidatePath("/admin-hoppo-twin/ayarlar")
  return { success: true }
}
