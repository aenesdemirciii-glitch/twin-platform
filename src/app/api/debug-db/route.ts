import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  const p = await prisma.product.findFirst({ 
    where: { name: { contains: 'Balen' } }, 
    include: { images: true } 
  })
  return NextResponse.json(p)
}
