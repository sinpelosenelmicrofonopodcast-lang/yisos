export type ProductStrength = "Mild" | "Medium" | "Medium-Full" | "Full";

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  price: number;
  salePrice?: number | null;
  stock: number;
  rating: number;
  reviewCount: number;
  origin: string;
  size: string;
  wrapper: string;
  binder: string;
  filler: string;
  strength: ProductStrength;
  tastingNotes: string[];
  pairingSuggestions: string[];
  images: string[];
  badges?: string[];
  featured?: boolean;
  newArrival?: boolean;
  bestSeller?: boolean;
  limitedEdition?: boolean;
  categorySlugs: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export interface CartItem {
  productId: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
}

export interface CartSummary {
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface EventItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  date: string;
  location: string;
  capacity: number;
  ticketPrice: number;
  featuredImage: string;
}

export interface MembershipTier {
  id: string;
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  perks: string[];
}
