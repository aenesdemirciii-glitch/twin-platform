const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const products = await prisma.product.findMany({
    where: { name: { contains: "Gül Yağı" } },
    include: { images: true }
  })
  console.log(JSON.stringify(products, null, 2))
}
main().catch(e => console.error(e)).finally(() => prisma.$disconnect())
