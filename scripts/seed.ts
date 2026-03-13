import { createClient } from "@supabase/supabase-js";
import { categories, events, membershipTiers, products } from "../lib/data/demo-products";

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
  console.log("Seeding categories...");
  const { error: categoryError } = await supabase.from("categories").upsert(categories, { onConflict: "id" });
  if (categoryError) throw categoryError;

  console.log("Seeding products...");
  const productRows = products.map((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    sku: product.sku,
    description: product.description,
    price: product.price,
    sale_price: product.salePrice,
    origin: product.origin,
    size: product.size,
    wrapper: product.wrapper,
    binder: product.binder,
    filler: product.filler,
    strength: product.strength,
    tasting_notes: product.tastingNotes,
    pairing_suggestions: product.pairingSuggestions,
    rating: product.rating,
    review_count: product.reviewCount,
    badges: product.badges || [],
    featured: Boolean(product.featured),
    new_arrival: Boolean(product.newArrival),
    best_seller: Boolean(product.bestSeller),
    limited_edition: Boolean(product.limitedEdition),
    is_active: true
  }));

  const { error: productError } = await supabase.from("products").upsert(productRows, { onConflict: "id" });
  if (productError) throw productError;

  console.log("Seeding product images...");
  const imageRows = products.flatMap((product) =>
    product.images.map((imageUrl, index) => ({
      product_id: product.id,
      image_url: imageUrl,
      alt_text: product.name,
      sort_order: index
    }))
  );

  const { error: imageDeleteError } = await supabase
    .from("product_images")
    .delete()
    .in(
      "product_id",
      products.map((product) => product.id)
    );
  if (imageDeleteError) throw imageDeleteError;

  const { error: imageError } = await supabase.from("product_images").insert(imageRows);
  if (imageError) throw imageError;

  console.log("Seeding inventory...");
  const inventoryRows = products.map((product) => ({
    product_id: product.id,
    stock: product.stock,
    reorder_threshold: 12,
    backorder_allowed: false
  }));

  const { error: inventoryError } = await supabase.from("inventory").upsert(inventoryRows, {
    onConflict: "product_id"
  });
  if (inventoryError) throw inventoryError;

  console.log("Seeding category mappings...");
  const { error: mappingDeleteError } = await supabase
    .from("product_categories")
    .delete()
    .in(
      "product_id",
      products.map((product) => product.id)
    );
  if (mappingDeleteError) throw mappingDeleteError;

  const mappingRows = products.flatMap((product) =>
    product.categorySlugs.map((categorySlug) => {
      const category = categories.find((entry) => entry.slug === categorySlug);
      return {
        product_id: product.id,
        category_id: category?.id || categories[0].id
      };
    })
  );

  const { error: mappingError } = await supabase.from("product_categories").insert(mappingRows);
  if (mappingError) throw mappingError;

  console.log("Seeding events...");
  const eventRows = events.map((event) => ({
    id: event.id,
    title: event.title,
    slug: event.slug,
    description: event.description,
    date: event.date,
    location: event.location,
    capacity: event.capacity,
    ticket_price: event.ticketPrice,
    featured_image: event.featuredImage
  }));

  const { error: eventError } = await supabase.from("events").upsert(eventRows, { onConflict: "id" });
  if (eventError) throw eventError;

  console.log("Seeding promo codes...");
  const promoRows = [
    {
      code: "FIRST10",
      description: "10% off first order",
      discount_type: "percent",
      discount_value: 10,
      minimum_subtotal: 50,
      active: true
    },
    {
      code: "LOUNGE25",
      description: "$25 off orders above $180",
      discount_type: "fixed",
      discount_value: 25,
      minimum_subtotal: 180,
      active: true
    }
  ];

  const { error: promoError } = await supabase.from("promo_codes").upsert(promoRows, { onConflict: "code" });
  if (promoError) throw promoError;

  console.log("Seeding gift cards...");
  const giftRows = [
    {
      code: "GIFT-100-YISOS",
      initial_amount: 100,
      balance: 100,
      is_active: true
    },
    {
      code: "GIFT-250-YISOS",
      initial_amount: 250,
      balance: 250,
      is_active: true
    }
  ];

  const { error: giftError } = await supabase.from("gift_cards").upsert(giftRows, { onConflict: "code" });
  if (giftError) throw giftError;

  console.log("Seeding site settings...");
  const settingsRows = [
    {
      key: "shipping",
      value: {
        freeShippingThreshold: 180,
        baseRate: 18,
        signatureRequired: true
      },
      description: "Shipping rules and thresholds"
    },
    {
      key: "local_payment_methods",
      value: {
        enabled: true,
        methods: ["Cashier Pickup", "Bank Transfer", "Private Invoice"]
      },
      description: "Admin-controlled local payment methods"
    },
    {
      key: "membership_tiers",
      value: membershipTiers,
      description: "Membership tiers for the public membership page"
    }
  ];

  const { error: settingsError } = await supabase.from("site_settings").upsert(settingsRows, { onConflict: "key" });
  if (settingsError) throw settingsError;

  console.log("Seed completed.");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
