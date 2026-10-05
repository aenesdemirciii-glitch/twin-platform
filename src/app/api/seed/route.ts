import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import productsData from '@/data/products.json';

const prisma = new PrismaClient();

function generateSlug(text: string) {
  return text
    .toString()
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export async function GET() {
  try {
    // Basic sync of database - wait, Prisma needs the tables to exist first.
    // If you are pushing to Hostinger, the database is currently empty.
    
    console.log(`Found ${productsData.length} rows to import.`);

    for (const row of productsData as any[]) {
      const categoryName = row['Kategori'] || 'Genel';
      const brandName = row['Marka'] || null;
      const productName = row['Ürün Adı'];
      const variantName = row['Varyant'];
      const price = parseFloat(row['Fiyat']) || 0;
      const stockStatus = row['Stok'];
      
      let stock = 100;
      if (stockStatus && String(stockStatus).toLowerCase() === 'yok') {
        stock = 0;
      }

      if (!productName) continue;

      // 1. Category
      let category = await prisma.category.findFirst({ where: { name: categoryName } });
      if (!category) {
        const slug = generateSlug(categoryName) + '-' + Date.now();
        category = await prisma.category.create({
          data: { name: categoryName, slug: slug }
        });
      }

      // 2. Brand
      let brand = null;
      if (brandName) {
        brand = await prisma.brand.findFirst({ where: { name: brandName } });
        if (!brand) {
          const slug = generateSlug(brandName) + '-' + Date.now();
          brand = await prisma.brand.create({
            data: { name: brandName, slug: slug }
          });
        }
      }

      // 3. Product
      let product = await prisma.product.findFirst({ where: { name: productName } });
      if (!product) {
        const productSlug = generateSlug(productName) + '-' + Date.now();
        product = await prisma.product.create({
          data: {
            name: productName,
            slug: productSlug,
            sku: 'SKU-' + Date.now() + Math.floor(Math.random() * 1000),
            price: price,
            stock: stock,
            categoryId: category.id,
            brandId: brand ? brand.id : null,
            isActive: true,
            unit: variantName
          }
        });
      }

      // 4. Variant
      if (variantName) {
        const variantSku = product.sku + '-' + generateSlug(variantName);
        let variant = await prisma.productVariant.findFirst({ where: { sku: variantSku } });
        if (!variant) {
          await prisma.productVariant.create({
            data: {
              productId: product.id,
              sku: variantSku,
              name: variantName,
              price: price,
              stock: stock
            }
          });
        }
      }
    }

    return NextResponse.json({ success: true, message: "İçe aktarım tamamlandı!" });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
