import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const blogs = await prisma.blogPost.findMany({
    select: { id: true, title: true, slug: true, imageUrl: true }
  })
  console.log(JSON.stringify(blogs, null, 2))
}

main().catch(console.error).finally(() => prisma.$disconnect())
