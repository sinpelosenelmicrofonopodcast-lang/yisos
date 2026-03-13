import type { CartItem, CartSummary } from "@/types";

export function calculateCartSummary(items: CartItem[], shippingRate = 18, discount = 0): CartSummary {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountedSubtotal = Math.max(subtotal - discount, 0);
  const shipping = discountedSubtotal >= 180 || discountedSubtotal === 0 ? 0 : shippingRate;
  const tax = Number((discountedSubtotal * 0.0825).toFixed(2));
  const total = Number((discountedSubtotal + shipping + tax).toFixed(2));

  return {
    subtotal: Number(subtotal.toFixed(2)),
    discount: Number(discount.toFixed(2)),
    shipping: Number(shipping.toFixed(2)),
    tax,
    total
  };
}

export function getCartCount(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}
