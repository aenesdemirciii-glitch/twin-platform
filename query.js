const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const categories = await prisma.category.findMany({ select: { slug: true, name: true, _count: { select: { products: true } } } });
  console.log("Categories:", categories);
  
  const products = await prisma.product.findMany({ 
    select: { slug: true, name: true, isActive: true, category: { select: { slug: true } } } 
  });
  console.log("Products:", products);
}

main().catch(console.error).finally(() => prisma.$disconnect());
