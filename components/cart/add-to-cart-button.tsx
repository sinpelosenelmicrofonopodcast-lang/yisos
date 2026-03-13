"use client";

import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart/cart-provider";
import type { Product } from "@/types";

export function AddToCartButton({ product, className }: { product: Product; className?: string }) {
  const { addItem } = useCart();

  return (
    <Button onClick={() => addItem(product)} className={className} variant="luxury">
      <ShoppingBag className="mr-2 h-4 w-4" />
      Add to Cart
    </Button>
  );
}
