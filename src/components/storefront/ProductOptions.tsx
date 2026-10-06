"use client"

import { useState } from "react"
import { ShoppingCart, Heart } from "lucide-react"

export function ProductOptions({ product }: { product: any }) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0] || null)
  const [quantity, setQuantity] = useState(1)

  const currentPrice = selectedVariant?.price || product.price

  return (
    <div className="flex flex-col">
       <div className="flex items-center gap-4 mb-8">
         <span className="text-4xl font-extrabold text-brand-slate">
           {Number(currentPrice).toLocaleString('tr-TR')} TL
         </span>
       </div>

       {product.variants && product.variants.length > 0 && (
         <div className="space-y-4 mb-8">
           <h3 className="font-semibold text-brand-slate">Seçenekler</h3>
           <div className="flex flex-wrap gap-3">
             {product.variants.map((variant: any, i: number) => {
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
         <button className="flex-1 bg-brand-slate text-white h-14 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200">
           <ShoppingCart className="h-5 w-5" />
           Sepete Ekle
         </button>
         <button className="h-14 w-14 border border-slate-300 rounded-xl flex items-center justify-center text-slate-400 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50 transition-colors">
           <Heart className="h-6 w-6" />
         </button>
       </div>
    </div>
  )
}
