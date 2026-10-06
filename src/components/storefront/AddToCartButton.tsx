"use client"

import { useCartStore } from "@/store/useCartStore"
import { useState } from "react"

interface AddToCartButtonProps {
  product: any
  variant?: any
  quantity?: number
  className?: string
  text?: string
}

export function AddToCartButton({ 
  product, 
  variant = null, 
  quantity = 1,
  className = "w-full bg-brand-slate text-white font-bold py-2 lg:py-3 rounded-lg hover:bg-brand-gold hover:text-brand-slate transition-colors text-xs lg:text-sm",
  text = "Sepete Ekle"
}: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem)
  const [added, setAdded] = useState(false)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Determine what to add. If variant is provided use it, otherwise use product (or its first variant).
    const selectedVariant = variant || (product.variants && product.variants.length > 0 ? product.variants[0] : null)
    
    const cartItem = {
      id: selectedVariant ? selectedVariant.id : product.id,
      productId: product.id,
      name: selectedVariant ? `${product.name} (${selectedVariant.name})` : product.name,
      price: Number(selectedVariant ? selectedVariant.price : product.price),
      quantity: quantity,
      image: product.images?.[0]?.url,
      sku: selectedVariant ? selectedVariant.sku : product.sku,
    }

    addItem(cartItem)
    setAdded(true)
    
    setTimeout(() => {
      setAdded(false)
    }, 2000)
  }

  return (
    <button 
      onClick={handleAddToCart} 
      className={className}
      disabled={added}
    >
      {added ? "Eklendi!" : text}
    </button>
  )
}
