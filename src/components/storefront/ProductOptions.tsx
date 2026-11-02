"use client"

import { useState } from "react"
import { ShoppingCart, Heart, Check } from "lucide-react"
import { useCartStore } from "@/store/useCartStore"

export function ProductOptions({ product }: { product: any }) {
  const addItem = useCartStore((state) => state.addItem)
  const sortedVariants = product.variants 
    ? [...product.variants].sort((a, b) => Number(a.price || product.price) - Number(b.price || product.price)) 
    : []
    
  const [selectedVariant, setSelectedVariant] = useState(sortedVariants[0] || null)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  const isWinter = 
    product.slug === 'k-paketi' || 
    product.slug === 'kis-paketi' || 
    product.name?.toLowerCase().includes('kış paketi') || 
    product.name?.toLowerCase().includes('kis paketi')

  const basePrice = isWinter ? 3500 : Number(selectedVariant?.price || product.price)
  const discountPrice = isWinter 
    ? 3000 
    : (selectedVariant?.discountPrice !== undefined && selectedVariant?.discountPrice !== null)
      ? Number(selectedVariant.discountPrice)
      : (product.discountPrice ? Number(product.discountPrice) : null)

  const effectivePrice = discountPrice && discountPrice < basePrice ? discountPrice : basePrice
  const hasDiscount = discountPrice && discountPrice < basePrice

  return (
    <div className="flex flex-col">
       <div className="flex flex-wrap items-baseline gap-3.5 mb-8">
         <span className="text-4xl font-extrabold text-brand-slate">
           {Number(effectivePrice).toLocaleString('tr-TR')} TL
         </span>
         {hasDiscount && (
           <>
             <span className="text-2xl text-slate-400 line-through font-semibold">
               {Number(basePrice).toLocaleString('tr-TR')} TL
             </span>
             <span className="px-3 py-1 text-xs lg:text-sm font-extrabold bg-red-100 text-red-600 rounded-full">
               %{Math.round(((basePrice - discountPrice) / basePrice) * 100)} İndirim
             </span>
           </>
         )}
       </div>

       {sortedVariants.length > 0 && (
         <div className="space-y-4 mb-8">
           <h3 className="font-semibold text-brand-slate">Seçenekler</h3>
           <div className="flex flex-wrap gap-3">
             {sortedVariants.map((variant: any, i: number) => {
               const isSelected = selectedVariant?.id === variant.id
               return (
                 <button 
                   key={variant.id || i}
                   onClick={() => setSelectedVariant(variant)}
                   className={`px-5 py-2.5 border-2 font-medium rounded-xl transition-colors ${
                     isSelected 
                       ? 'border-brand-gold bg-brand-gold/10 text-brand-slate font-bold' 
                       : 'border-slate-200 text-slate-600 hover:border-slate-300'
                   }`}
                 >
                   {variant.name}
                 </button>
               )
             })}
           </div>
         </div>
       )}

       <div className="flex items-center gap-4 border-t border-slate-200 pt-8 mt-auto">
         <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden h-14 bg-white">
           <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2 hover:bg-slate-50 text-slate-600 transition-colors">-</button>
           <span className="px-4 font-bold text-brand-slate">{quantity}</span>
           <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-2 hover:bg-slate-50 text-slate-600 transition-colors">+</button>
         </div>
         <button 
           disabled={added}
           onClick={() => {
             const cartItem = {
               id: selectedVariant ? selectedVariant.id : product.id,
               productId: product.id,
               name: selectedVariant ? `${product.name} (${selectedVariant.name})` : product.name,
               price: Number(effectivePrice),
               quantity: quantity,
               image: product.images?.[0]?.url || (isWinter ? "/images/kis-paketi.jpg" : undefined),
               sku: selectedVariant ? selectedVariant.sku : product.sku,
             }
             addItem(cartItem)
             setAdded(true)
             setTimeout(() => setAdded(false), 2000)
           }}
           className="flex-1 bg-brand-slate text-white h-14 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 disabled:opacity-90 transition-colors shadow-lg shadow-slate-200"
         >
           {added ? <Check className="h-5 w-5 text-brand-gold" /> : <ShoppingCart className="h-5 w-5" />}
           <span>{added ? "Sepete Eklendi!" : "Sepete Ekle"}</span>
         </button>
         <button className="h-14 w-14 border border-slate-300 rounded-xl flex items-center justify-center text-slate-400 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50 transition-colors">
           <Heart className="h-6 w-6" />
         </button>
       </div>
    </div>
  )
}
