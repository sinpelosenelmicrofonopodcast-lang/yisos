import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Product } from "@/types";

interface ProductImageRow {
  image_url?: string | null;
}

interface ProductCategoryRow {
  categories?: { slug?: string | null } | null;
}

interface ProductRow {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  price: number;
  sale_price?: number | null;
  stock?: number | null;
  inventory?: { stock?: number | null } | Array<{ stock?: number | null }> | null;
  rating?: number | null;
  review_count?: number | null;
  origin: string;
  size: string;
  wrapper: string;
  binder: string;
  filler: string;
  strength: Product["strength"];
  tasting_notes?: string[] | null;
  pairing_suggestions?: string[] | null;
  product_images?: ProductImageRow[] | null;
  images?: string[] | null;
  badges?: string[] | null;
  featured?: boolean | null;
  new_arrival?: boolean | null;
  best_seller?: boolean | null;
  limited_edition?: boolean | null;
  product_categories?: ProductCategoryRow[] | null;
}

function isString(value: string | null | undefined): value is string {
  return Boolean(value);
}

function normalizeProduct(row: ProductRow): Product {
  const inventoryStock = Array.isArray(row.inventory) ? row.inventory[0]?.stock : row.inventory?.stock;

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    sku: row.sku,
    description: row.description,
    price: Number(row.price),
    salePrice: row.sale_price ? Number(row.sale_price) : null,
    stock: row.stock ?? inventoryStock ?? 0,
    rating: Number(row.rating ?? 0),
    reviewCount: Number(row.review_count ?? 0),
    origin: row.origin,
    size: row.size,
    wrapper: row.wrapper,
    binder: row.binder,
    filler: row.filler,
    strength: row.strength,
    tastingNotes: row.tasting_notes ?? [],
    pairingSuggestions: row.pairing_suggestions ?? [],
    images: row.product_images?.map((img) => img.image_url).filter(isString) ?? row.images ?? [],
    badges: row.badges ?? [],
    featured: Boolean(row.featured),
    newArrival: Boolean(row.new_arrival),
    bestSeller: Boolean(row.best_seller),
    limitedEdition: Boolean(row.limited_edition),
    categorySlugs: row.product_categories?.map((pc) => pc.categories?.slug).filter(isString) ?? []
  };
}

export async function getProducts() {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      product_images(image_url, sort_order),
      inventory(stock),
      product_categories(categories(slug))
    `
    )
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error || !data?.length) {
    return [];
  }

  return (data as unknown as ProductRow[]).map(normalizeProduct);
}

export async function getFeaturedProducts() {
  const all = await getProducts();
  return all.filter((product) => product.featured).slice(0, 4);
}

export async function getProductBySlug(slug: string) {
  const all = await getProducts();
  return all.find((product) => product.slug === slug) ?? null;
}

export async function getRelatedProducts(slug: string) {
  const all = await getProducts();
  const current = all.find((product) => product.slug === slug);
  if (!current) return all.slice(0, 3);

  return all
    .filter(
      (product) =>
        product.slug !== slug &&
        product.categorySlugs.some((category) => current.categorySlugs.includes(category))
    )
    .slice(0, 3);
}

export async function getCategories() {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug, description")
    .order("name");

  if (error || !data?.length) {
    return [];
  }

  return data;
}
