import { NextResponse } from "next/server";
import { assertAdmin } from "@/lib/services/admin-api-auth";

export async function POST(request: Request) {
  const admin = await assertAdmin();
  if (!admin.ok) return admin.response;

  const body = (await request.json().catch(() => null)) as {
    id?: string;
    name?: string;
    slug?: string;
    sku?: string;
    description?: string;
    price?: number;
    stock?: number;
    categoryIds?: string[];
  } | null;

  if (!body?.id || !body.name || !body.slug || !body.sku || !body.description) {
    return NextResponse.json(
      { message: "Product ID, name, slug, SKU, and description are required." },
      { status: 400 }
    );
  }

  if (Number.isNaN(Number(body.price)) || Number(body.price) < 0) {
    return NextResponse.json({ message: "Price must be a valid number." }, { status: 400 });
  }

  if (body.stock !== undefined && (Number.isNaN(Number(body.stock)) || Number(body.stock) < 0)) {
    return NextResponse.json({ message: "Stock must be a valid non-negative number." }, { status: 400 });
  }

  const { error } = await admin.supabase.from("products").upsert(
    {
      id: body.id,
      name: body.name,
      slug: body.slug,
      sku: body.sku,
      description: body.description,
      price: Number(body.price || 0),
      origin: "Nicaragua",
      size: "6 x 52 Toro",
      wrapper: "Habano",
      binder: "Nicaraguan",
      filler: "Nicaraguan",
      strength: "Medium",
      tasting_notes: [],
      pairing_suggestions: [],
      is_active: true
    },
    { onConflict: "id" }
  );

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }

  const categoryIds = Array.isArray(body.categoryIds)
    ? body.categoryIds.filter((value): value is string => typeof value === "string" && value.length > 0)
    : [];

  const { error: deleteMappingsError } = await admin.supabase.from("product_categories").delete().eq("product_id", body.id);

  if (deleteMappingsError) {
    return NextResponse.json({ message: deleteMappingsError.message }, { status: 400 });
  }

  if (categoryIds.length) {
    const { error: categoryMappingError } = await admin.supabase.from("product_categories").insert(
      categoryIds.map((categoryId) => ({
        product_id: body.id!,
        category_id: categoryId
      }))
    );

    if (categoryMappingError) {
      return NextResponse.json({ message: categoryMappingError.message }, { status: 400 });
    }
  }

  const { error: inventoryError } = await admin.supabase.from("inventory").upsert(
    {
      product_id: body.id,
      stock: Number(body.stock || 0)
    },
    { onConflict: "product_id" }
  );

  if (inventoryError) {
    return NextResponse.json({ message: inventoryError.message }, { status: 400 });
  }

  const { error: logError } = await admin.supabase.from("admin_logs").insert({
    actor_user_id: admin.user.id,
    action: "upsert_product",
    payload: body
  });

  if (logError) {
    return NextResponse.json({ message: logError.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}

export async function PATCH(request: Request) {
  const admin = await assertAdmin();
  if (!admin.ok) return admin.response;

  const body = (await request.json().catch(() => null)) as {
    id?: string;
    name?: string;
    description?: string;
    price?: number;
    isActive?: boolean;
  } | null;

  if (!body?.id) {
    return NextResponse.json({ message: "Product id is required" }, { status: 400 });
  }

  const { error } = await admin.supabase
    .from("products")
    .update({
      name: body.name,
      description: body.description,
      price: body.price,
      is_active: body.isActive
    })
    .eq("id", body.id);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const admin = await assertAdmin();
  if (!admin.ok) return admin.response;

  const body = (await request.json().catch(() => null)) as { id?: string } | null;

  if (!body?.id) {
    return NextResponse.json({ message: "Product id is required" }, { status: 400 });
  }

  const { error } = await admin.supabase.from("products").delete().eq("id", body.id);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
