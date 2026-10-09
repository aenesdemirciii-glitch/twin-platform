import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

import prisma from "@/lib/prisma"

export async function generateMetadata(): Promise<Metadata> {
  const settings = await prisma.settings.findMany({
    where: { key: { in: ["store_name", "site_favicon"] } }
  })
  
  const storeName = settings.find(s => s.key === "store_name")?.value || "İKİZLER Baharatçılık"
  const faviconUrl = settings.find(s => s.key === "site_favicon")?.value
  
  return {
    title: {
      template: `%s | ${storeName}`,
      default: storeName,
    },
    description: `${storeName} Online Mağazası`,
    icons: faviconUrl ? { icon: faviconUrl } : undefined,
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${montserrat.variable} font-sans h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
