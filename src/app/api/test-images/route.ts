import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const products = await prisma.product.findMany({
    where: { name: { contains: "Gül Yağı" } },
    include: { images: true }
  });
  return NextResponse.json(products);
}
