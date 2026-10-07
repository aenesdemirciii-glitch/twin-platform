import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const cats = await prisma.category.findMany()
  console.log("Categories:", cats.map(c => c.slug))
  
  const prods = await prisma.product.findMany({
    include: { category: true }
  })
  console.log("Products:")
  prods.forEach(p => console.log(`- ${p.name} | slug: ${p.slug} | isActive: ${p.isActive} | catSlug: ${p.category?.slug}`))
}

main().catch(console.error).finally(() => prisma.$disconnect())
