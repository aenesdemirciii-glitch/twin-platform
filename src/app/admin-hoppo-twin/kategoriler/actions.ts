"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function createCategory(data: any) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== "SUPER_ADMIN") {
    throw new Error("Yetkisiz işlem")
  }

  const { name, description, imageUrl, parentId, isActive, seoTitle, seoDesc } = data

  if (!name) throw new Error("Kategori adı zorunludur.")

  let slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")
  if (!slug) slug = "kategori-" + Date.now()

  let uniqueSlug = slug
  let counter = 1
  while (true) {
    const existing = await prisma.category.findUnique({ where: { slug: uniqueSlug } })
    if (!existing) break
    uniqueSlug = `${slug}-${counter}`
    counter++
  }

  await prisma.category.create({
    data: {
      name,
      slug: uniqueSlug,
      description,
      imageUrl,
      parentId: parentId || null,
      active: isActive,
      seoTitle,
      seoDesc
    }
  })

  await prisma.auditLog.create({
    data: {
      userId: (session.user as any)?.id,
      action: "CREATE",
      resource: "Category",
      details: `Kategori eklendi: ${name}`
    }
  })

  revalidatePath("/admin-hoppo-twin/kategoriler")
  return { success: true }
}

export async function updateCategory(id: string, data: any) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== "SUPER_ADMIN") {
    throw new Error("Yetkisiz işlem")
  }

  const { name, description, imageUrl, parentId, isActive, seoTitle, seoDesc } = data

  if (!name) throw new Error("Kategori adı zorunludur.")

  await prisma.category.update({
    where: { id },
    data: {
      name,
      description,
      imageUrl,
      parentId: parentId || null,
      active: isActive,
      seoTitle,
      seoDesc
    }
  })

  await prisma.auditLog.create({
    data: {
      userId: (session.user as any)?.id,
      action: "UPDATE",
      resource: "Category",
      details: `Kategori güncellendi: ${name}`
    }
  })

  revalidatePath("/admin-hoppo-twin/kategoriler")
  return { success: true }
}

export async function deleteCategory(id: string) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== "SUPER_ADMIN") {
    throw new Error("Yetkisiz işlem")
  }

  const category = await prisma.category.findUnique({ where: { id } })
  if (!category) throw new Error("Kategori bulunamadı")

  await prisma.category.delete({ where: { id } })

  await prisma.auditLog.create({
    data: {
      userId: (session.user as any)?.id,
      action: "DELETE",
      resource: "Category",
      details: `Kategori silindi: ${category.name}`
    }
  })

  revalidatePath("/admin-hoppo-twin/kategoriler")
  return { success: true }
}
