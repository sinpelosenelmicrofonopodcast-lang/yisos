import { NextResponse } from "next/server";
import { assertAdmin } from "@/lib/services/admin-api-auth";

export async function POST(request: Request) {
  const admin = await assertAdmin();
  if (!admin.ok) return admin.response;

  const body = (await request.json().catch(() => null)) as {
    id?: string;
    title?: string;
    slug?: string;
    description?: string;
    date?: string;
    location?: string;
    capacity?: number;
    ticketPrice?: number;
    featuredImage?: string;
  } | null;

  if (!body?.id || !body.title || !body.slug || !body.description || !body.date || !body.location) {
    return NextResponse.json({ message: "Missing event fields" }, { status: 400 });
  }

  const { error } = await admin.supabase.from("events").upsert(
    {
      id: body.id,
      title: body.title,
      slug: body.slug,
      description: body.description,
      date: body.date,
      location: body.location,
      capacity: Number(body.capacity || 50),
      ticket_price: Number(body.ticketPrice || 0),
      featured_image: body.featuredImage || null
    },
    { onConflict: "id" }
  );

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
