import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Sadece ürünleri ve onlara bağlı varyantları/siparişleri temizler.
    // OrderItem'lar product ve variant'a bağlı olduğu için önce onları temizlememiz gerekebilir (Foreign key constraint varsa)
    
    // Varyantları sil
    await prisma.productVariant.deleteMany({});
    
    // Ürünleri sil
    await prisma.product.deleteMany({});

    return NextResponse.json({ success: true, message: "Tüm ürünler ve varyantlar başarıyla temizlendi." });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
