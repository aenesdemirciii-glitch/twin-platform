import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string // variantId
  productId: string
  name: string
  price: number
  quantity: number
  image?: string
  sku: string
}

interface CartState {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
  coupon: { code: string; type: string; value: number } | null
  applyCoupon: (coupon: { code: string; type: string; value: number } | null) => void
  getDiscount: () => number
  getGrandTotal: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => set((state) => {
        const existingItem = state.items.find((i) => i.id === item.id)
        if (existingItem) {
          return {
            items: state.items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
            ),
          }
        }
        return { items: [...state.items, item] }
      }),
      removeItem: (id) => set((state) => ({
        items: state.items.filter((i) => i.id !== id),
      })),
      updateQuantity: (id, quantity) => set((state) => ({
        items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
      })),
      clearCart: () => set({ items: [] }),
      getTotal: () => {
        const { items } = get()
        return items.reduce((total, item) => total + item.price * item.quantity, 0)
      },
      coupon: null,
      applyCoupon: (coupon) => set({ coupon }),
      getDiscount: () => {
        const { getTotal, coupon } = get()
        if (!coupon) return 0
        const total = getTotal()
        if (coupon.type === "PERCENTAGE") {
          return (total * coupon.value) / 100
        } else if (coupon.type === "FIXED") {
          return Math.min(total, coupon.value) // Cannot discount more than total
        }
        return 0 // FREE_SHIPPING is handled separately if needed
      },
      getGrandTotal: () => {
        const { getTotal, getDiscount } = get()
        return Math.max(0, getTotal() - getDiscount())
      },
    }),
    {
      name: 'ecommerce-cart',
    }
  )
)
