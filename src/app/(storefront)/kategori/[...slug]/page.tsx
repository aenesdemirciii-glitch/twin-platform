import Link from "next/link"
import Image from "next/image"
import { ArrowRight, SlidersHorizontal } from "lucide-react"
import { getCategoryData } from "@/services/productService"
import { CategorySort } from "@/components/storefront/CategorySort"
import { AddToCartButton } from "@/components/storefront/AddToCartButton"

export default async function CategoryPage(props: { params: Promise<{ slug: string | string[] }>, searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const slugArray = Array.isArray(params.slug) ? params.slug : (params.slug ? [params.slug] : []);
  const rawSlug = slugArray.join('/') || "kategori";
  
  const page = typeof searchParams.page === "string" ? Number(searchParams.page) : 1;
  const sort = typeof searchParams.sort === "string" ? searchParams.sort : "";
  const perPage = 12;
  const skip = (page - 1) * perPage;

  const { category, products, total } = await getCategoryData(rawSlug, { take: perPage, skip, sort });
  
  const categoryName = category ? category.name : rawSlug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
    .replace(/[0-9]/g, '').trim();

  const totalPages = Math.ceil(total / perPage);

  return (
    <div className="container mx-auto px-4 lg:px-8 py-8 lg:py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-brand-slate/60 mb-6 font-bold uppercase tracking-wider text-xs">
        <Link href="/" className="hover:text-brand-gold transition-colors">Ana Sayfa</Link>
        <span>/</span>
        <span className="text-brand-slate">{categoryName}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-end justify-between mb-10 pb-6 border-b-2 border-brand-slate/10">
        <div>
          <h1 className="text-3xl lg:text-4xl font-black text-brand-slate mb-3">
            {categoryName}
          </h1>
          <p className="text-brand-slate/70 font-semibold max-w-2xl">
            Taptaze ve özenle seçilmiş ürünlerimizle tanışın. En kaliteli hasatları sizin için paketledik.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto mt-4 lg:mt-0">
          <CategorySort />
        </div>
      </div>

      <div>
        <div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
            {products.map((prod: any, i: number) => (
              <Link href={`/urun/${prod.slug}`} key={prod.id || i} className="bg-white rounded-2xl overflow-hidden border-2 border-brand-slate/10 flex flex-col group hover:border-brand-gold transition-colors">
                <div className="relative aspect-square bg-brand-slate/5 flex items-center justify-center">
                  {prod.images && prod.images[0] ? (
                    <img src={prod.images[0].url} alt={prod.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-brand-slate/40 font-bold text-xs lg:text-base">Ürün Görseli</span>
                  )}
                </div>
                <div className="p-3 lg:p-5 flex flex-col flex-1 border-t border-brand-slate/5">
                  <h3 className="font-bold text-sm lg:text-base mb-2 line-clamp-2 text-brand-slate group-hover:text-brand-gold transition-colors">{prod.name}</h3>
                  <div className="mt-auto pt-2">
                    <div className="flex items-center gap-2 mb-3">
                      <p className="text-base lg:text-xl font-black text-brand-slate">{Number(prod.price).toLocaleString('tr-TR')} TL</p>
                    </div>
                    <AddToCartButton product={prod} />
                  </div>
                </div>
              </Link>
            ))}
            {products.length === 0 && (
              <div className="col-span-full py-10 text-center text-brand-slate/50 font-bold">
                Bu kategoride ürün bulunamadı.
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-16 flex items-center justify-center gap-2">
              <Link 
                href={`?page=${Math.max(1, page - 1)}${sort ? `&sort=${sort}` : ''}`}
                className="w-10 h-10 flex items-center justify-center rounded-lg border-2 border-brand-slate/20 text-brand-slate/50 font-black hover:border-brand-slate hover:text-brand-slate transition-colors"
              >
                &lt;
              </Link>
              
              {Array.from({ length: totalPages }).map((_, i) => (
                <Link 
                  key={i} 
                  href={`?page=${i + 1}${sort ? `&sort=${sort}` : ''}`}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg border-2 font-black transition-colors ${
                    page === i + 1 
                      ? "border-brand-gold bg-brand-gold text-brand-slate" 
                      : "border-transparent text-brand-slate hover:border-brand-slate/20"
                  }`}
                >
                  {i + 1}
                </Link>
              ))}

              <Link 
                href={`?page=${Math.min(totalPages, page + 1)}${sort ? `&sort=${sort}` : ''}`}
                className="w-10 h-10 flex items-center justify-center rounded-lg border-2 border-brand-slate/20 text-brand-slate font-black hover:border-brand-slate transition-colors"
              >
                &gt;
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
