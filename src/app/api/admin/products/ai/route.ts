import { NextResponse } from "next/server"
import { generateProductDraft } from "@/services/aiService"
// import { getServerSession } from "next-auth/next"
// import { authOptions } from "@/lib/auth"
// import prisma from "@/lib/prisma" // To be created

export async function POST(req: Request) {
  try {
    // 1. Check Authentication (RBAC)
    // const session = await getServerSession(authOptions)
    // if (!session || (session.user as any).role !== "SUPER_ADMIN") {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // }

    // 2. Parse Request
    const body = await req.json()
    const { productName } = body

    if (!productName || typeof productName !== "string") {
      return NextResponse.json({ error: "Geçerli bir ürün adı girilmelidir." }, { status: 400 })
    }

    // 3. Generate Draft via AI
    const draft = await generateProductDraft(productName)

    // 4. (Optional) Log AI Generation to Database here
    // await prisma.aiGenerationLog.create({
    //   data: {
    //     prompt: productName,
    //     response: JSON.stringify(draft),
    //     type: "PRODUCT_DRAFT",
    //     status: "SUCCESS"
    //   }
    // })

    return NextResponse.json(draft)
  } catch (error: any) {
    console.error("API Error in AI Generation:", error)
    return NextResponse.json({ error: error.message || "Bilinmeyen bir hata oluştu." }, { status: 500 })
  }
}
