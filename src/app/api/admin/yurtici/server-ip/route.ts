import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Sunucunun dış dünyadaki public IP adresini öğren
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 4000)

    const res = await fetch("https://api.ipify.org?format=json", {
      signal: controller.signal,
    })
    clearTimeout(timeout)

    if (res.ok) {
      const data = await res.json()
      return NextResponse.json({ ip: data.ip })
    }
    return NextResponse.json({ ip: "Belirlenemedi" })
  } catch (e: any) {
    return NextResponse.json({ ip: "Belirlenemedi (Ağ kısıtlı)" })
  }
}

