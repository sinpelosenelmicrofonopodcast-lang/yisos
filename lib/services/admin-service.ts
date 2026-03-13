import { getSupabaseAdminClient } from "@/lib/supabase/admin";

interface InventoryRelation {
  stock?: number | null;
}

interface CategoryRelation {
  id?: string | null;
  slug?: string | null;
  name?: string | null;
}

interface ProductCategoryRelation {
  categories?: CategoryRelation | CategoryRelation[] | null;
}

interface AdminProductRow {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  price: number;
  is_active: boolean;
  created_at: string;
  inventory?: InventoryRelation | InventoryRelation[] | null;
  product_categories?: ProductCategoryRelation[] | null;
}

interface AdminCategoryRow {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export async function getAdminProducts() {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return [];
  }

  const { data } = await supabase
    .from("products")
    .select(
      "id, name, slug, sku, description, price, is_active, created_at, inventory(stock), product_categories(categories(id, slug, name))"
    )
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    (data as unknown as AdminProductRow[] | null)?.map((row) => ({
      ...row,
      stock: Array.isArray(row.inventory) ? row.inventory[0]?.stock || 0 : row.inventory?.stock || 0,
      categoryIds:
        row.product_categories
          ?.map((relation) =>
            Array.isArray(relation.categories) ? relation.categories[0]?.id : relation.categories?.id
          )
          .filter((value): value is string => typeof value === "string" && value.length > 0) || [],
      categoryNames:
        row.product_categories
          ?.map((relation) =>
            Array.isArray(relation.categories) ? relation.categories[0]?.name : relation.categories?.name
          )
          .filter((value): value is string => typeof value === "string" && value.length > 0) || []
    })) || []
  );
}

export async function getAdminCategories() {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return [];
  }

  const { data } = await supabase.from("categories").select("id, name, slug, description").order("name");

  return (data as unknown as AdminCategoryRow[] | null) || [];
}

export async function getAdminOrders() {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return [];
  }

  const { data } = await supabase
    .from("orders")
    .select("id, order_number, customer_email, total, payment_status, fulfillment_status, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  return data || [];
}

export async function getAdminCustomers() {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return [];
  }

  const { data } = await supabase
    .from("profiles")
    .select("id, full_name, email, membership_tier, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  return data || [];
}

export async function getAnalyticsSnapshot() {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return {
      revenue: 0,
      orders: 0,
      subscribers: 0,
      pushSubscribers: 0,
      configured: false
    };
  }

  const [{ count: orderCount }, { data: revenueRows }, { count: newsletterCount }, { count: pushCount }] =
    await Promise.all([
      supabase.from("orders").select("id", { count: "exact", head: true }),
      supabase.from("orders").select("total"),
      supabase.from("newsletter_subscribers").select("id", { count: "exact", head: true }),
      supabase.from("push_subscribers").select("id", { count: "exact", head: true })
    ]);

  const revenue =
    revenueRows?.reduce((sum, row) => sum + Number((row as { total: number }).total || 0), 0) || 0;

  return {
    revenue,
    orders: orderCount || 0,
    subscribers: newsletterCount || 0,
    pushSubscribers: pushCount || 0,
    configured: true
  };
}
