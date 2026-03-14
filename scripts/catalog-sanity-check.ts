import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Missing SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function run() {
  const [
    { data: products, error: productsError },
    { data: categories, error: categoriesError },
    { data: productCategories, error: productCategoriesError },
    { data: productImages, error: productImagesError },
    { data: inventory, error: inventoryError }
  ] = await Promise.all([
    supabase
      .from("products")
      .select("id, name, sku, price, sale_price, best_seller, featured, new_arrival, limited_edition, is_active"),
    supabase.from("categories").select("id, name, slug"),
    supabase.from("product_categories").select("product_id, category_id"),
    supabase.from("product_images").select("id, product_id, image_url"),
    supabase.from("inventory").select("product_id, stock")
  ]);

  if (productsError || categoriesError || productCategoriesError || productImagesError || inventoryError) {
    throw new Error(
      [
        productsError?.message,
        categoriesError?.message,
        productCategoriesError?.message,
        productImagesError?.message,
        inventoryError?.message
      ]
        .filter(Boolean)
        .join(" | ")
    );
  }

  const categoryProductCounts = new Map<string, number>();
  const productImageCounts = new Map<string, number>();
  const inventoryMap = new Map<string, number>();

  for (const relation of productCategories || []) {
    if (!relation.category_id) continue;
    categoryProductCounts.set(relation.category_id, (categoryProductCounts.get(relation.category_id) || 0) + 1);
  }

  for (const image of productImages || []) {
    if (!image.product_id) continue;
    productImageCounts.set(image.product_id, (productImageCounts.get(image.product_id) || 0) + 1);
  }

  for (const entry of inventory || []) {
    if (!entry.product_id) continue;
    inventoryMap.set(entry.product_id, Number(entry.stock || 0));
  }

  const missingImages = (products || []).filter((product) => (productImageCounts.get(product.id) || 0) === 0);
  const missingCategories = (products || []).filter(
    (product) => !(productCategories || []).some((relation) => relation.product_id === product.id)
  );
  const missingSku = (products || []).filter((product) => !product.sku?.trim());
  const invalidPricing = (products || []).filter(
    (product) => Number(product.price || 0) <= 0 || (product.sale_price && Number(product.sale_price) >= Number(product.price))
  );
  const missingInventory = (products || []).filter((product) => !inventoryMap.has(product.id));
  const inactiveFlaggedProducts = (products || []).filter(
    (product) =>
      !product.is_active && (product.best_seller || product.featured || product.new_arrival || product.limited_edition)
  );
  const emptyCategories = (categories || []).filter((category) => (categoryProductCounts.get(category.id) || 0) === 0);

  const uspsEnv = {
    clientId: Boolean(process.env.USPS_CLIENT_ID),
    clientSecret: Boolean(process.env.USPS_CLIENT_SECRET),
    originZip: Boolean(process.env.USPS_ORIGIN_ZIP),
    accountType: Boolean(process.env.USPS_ACCOUNT_TYPE),
    accountNumber: Boolean(process.env.USPS_ACCOUNT_NUMBER)
  };

  console.log(
    JSON.stringify(
      {
        totals: {
          products: products?.length || 0,
          categories: categories?.length || 0,
          productImages: productImages?.length || 0,
          inventoryRows: inventory?.length || 0
        },
        issues: {
          productsMissingImages: missingImages.map((product) => ({ id: product.id, name: product.name })),
          productsMissingCategories: missingCategories.map((product) => ({ id: product.id, name: product.name })),
          productsMissingSku: missingSku.map((product) => ({ id: product.id, name: product.name })),
          invalidPricing: invalidPricing.map((product) => ({
            id: product.id,
            name: product.name,
            price: Number(product.price || 0),
            salePrice: product.sale_price ? Number(product.sale_price) : null
          })),
          productsMissingInventory: missingInventory.map((product) => ({ id: product.id, name: product.name })),
          inactiveFlaggedProducts: inactiveFlaggedProducts.map((product) => ({ id: product.id, name: product.name })),
          emptyCategories: emptyCategories.map((category) => ({ id: category.id, name: category.name, slug: category.slug }))
        },
        shipping: {
          uspsConfigPresent: Object.values(uspsEnv).every(Boolean),
          env: uspsEnv
        }
      },
      null,
      2
    )
  );
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
