import { NextResponse } from "next/server";
import { assertAdmin } from "@/lib/services/admin-api-auth";

export async function POST(request: Request) {
  const admin = await assertAdmin();
  if (!admin.ok) return admin.response;

  const body = (await request.json().catch(() => null)) as {
    id?: string;
    name?: string;
    slug?: string;
    description?: string;
  } | null;

  if (!body?.id || !body.name || !body.slug || !body.description) {
    return NextResponse.json(
      { message: "Category ID, name, slug, and description are required." },
      { status: 400 }
    );
  }

  const { error } = await admin.supabase.from("categories").upsert(
    {
      id: body.id,
      name: body.name,
      slug: body.slug,
      description: body.description
    },
    { onConflict: "id" }
  );

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
