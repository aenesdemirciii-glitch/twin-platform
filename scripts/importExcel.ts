import { PrismaClient } from '@prisma/client';
import * as xlsx from 'xlsx';

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

async function main() {
  const filePath = '../antigravity_urun_import_guncel.xlsx';
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(worksheet);

  console.log(`Found ${data.length} rows to import.`);

  for (const row of data as any[]) {
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

    if (!productName) {
        continue;
    }

    // 1. Category
    let category = await prisma.category.findFirst({ where: { name: categoryName } });
    if (!category) {
      const slug = generateSlug(categoryName) + '-' + Date.now();
      category = await prisma.category.create({
        data: { name: categoryName, slug: slug }
      });
      console.log(`Created category: ${categoryName}`);
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
        console.log(`Created brand: ${brandName}`);
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
      console.log(`Created product: ${productName}`);
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
        console.log(`Created variant ${variantName} for product: ${productName}`);
      }
    }
  }

  console.log('Import completed successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
