import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const p = await prisma.product.findFirst({ where: { name: { contains: 'Balen' } }, include: { images: true } })
  console.log(JSON.stringify(p?.images, null, 2))
}
main()
