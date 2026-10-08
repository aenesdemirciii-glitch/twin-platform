"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function saveBlogPost(data: any) {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error("Yetkisiz işlem")

  const { id, title, slug, category, excerpt, content, imageUrl, isActive } = data

  if (id) {
    await prisma.blogPost.update({
      where: { id },
      data: { title, slug, category, excerpt, content, imageUrl, isActive }
    })
  } else {
    await prisma.blogPost.create({
      data: { title, slug, category, excerpt, content, imageUrl, isActive }
    })
  }

  revalidatePath("/admin-hoppo-twin/icerik/blog")
  revalidatePath("/blog")
  return { success: true }
}

export async function deleteBlogPost(id: string) {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error("Yetkisiz işlem")

  await prisma.blogPost.delete({ where: { id } })
  revalidatePath("/admin-hoppo-twin/icerik/blog")
  revalidatePath("/blog")
  return { success: true }
}
