"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function savePage(data: any) {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error("Yetkisiz işlem")

  const { id, title, slug, content, isActive } = data

  if (id) {
    await prisma.page.update({
      where: { id },
      data: { title, slug, content, isActive }
    })
  } else {
    await prisma.page.create({
      data: { title, slug, content, isActive }
    })
  }

  revalidatePath("/admin-hoppo-twin/icerik/sayfalar")
  revalidatePath("/") // generic revalidation for pages
  return { success: true }
}

export async function deletePage(id: string) {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error("Yetkisiz işlem")

  await prisma.page.delete({ where: { id } })
  revalidatePath("/admin-hoppo-twin/icerik/sayfalar")
  return { success: true }
}
