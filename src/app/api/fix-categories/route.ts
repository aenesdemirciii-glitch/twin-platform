import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

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

const targetCategories = [
  "Baharat Ürünleri",
  "Lokum ve Şekerleme",
  "Bal ve Arı Ürünleri",
  "Kuruyemişler",
  "Kuru Meyveler",
  "Pekmez Çeşitleri",
  "Kahve Çeşitleri",
  "Sirkeler",
  "Fonksiyonel Çaylar",
  "Bitkisel Kozmetik",
  "Sabun Çeşitleri",
  "Yağ ve Aromalar"
];

export async function GET() {
  try {
    const existing = await prisma.category.findMany();
    console.log("Existing categories:", existing.map(c => c.name));

    for (const catName of targetCategories) {
      // Find case-insensitive if possible, or just exact match
      const existingCat = existing.find(c => c.name.toLowerCase() === catName.toLowerCase());
      
      if (!existingCat) {
        await prisma.category.create({
          data: {
            name: catName,
            slug: generateSlug(catName)
          }
        });
        console.log(`Created category: ${catName}`);
      } else {
        // Just in case it has bad casing
        if (existingCat.name !== catName) {
           await prisma.category.update({
             where: { id: existingCat.id },
             data: { name: catName }
           });
           console.log(`Updated category name to: ${catName}`);
        }
      }
    }

    return NextResponse.json({ success: true, message: "Kategoriler eklendi." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
