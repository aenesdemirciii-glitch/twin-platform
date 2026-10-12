import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { STATIC_PAGES } from "@/data/staticPages"
import { blogPosts } from "@/lib/blogData"

export async function GET() {
  try {
    // 1. Delete or deactivate SSS if it exists
    await prisma.page.deleteMany({
      where: { slug: "sss" }
    }).catch(() => {})

    // 2. Upsert static pages
    for (const [slug, pageData] of Object.entries(STATIC_PAGES)) {
      await prisma.page.upsert({
        where: { slug },
        update: {
          title: pageData.title,
          content: pageData.content,
          seoTitle: pageData.seoTitle,
          seoDesc: pageData.metaDescription,
          isActive: true
        },
        create: {
          slug,
          title: pageData.title,
          content: pageData.content,
          seoTitle: pageData.seoTitle,
          seoDesc: pageData.metaDescription,
          isActive: true
        }
      })
    }

    // 3. Upsert Blog Posts from blogData
    for (const post of blogPosts) {
      await prisma.blogPost.upsert({
        where: { slug: post.slug },
        update: {
          title: post.title,
          category: post.category,
          excerpt: post.excerpt,
          content: post.content,
          imageUrl: post.imageUrl,
          isActive: true
        },
        create: {
          slug: post.slug,
          title: post.title,
          category: post.category,
          excerpt: post.excerpt,
          content: post.content,
          imageUrl: post.imageUrl,
          isActive: true
        }
      })
    }

    return NextResponse.json({ success: true, message: "CMS içerikleri, kurumsal sayfalar ve blog yazıları güncellendi!" })

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
