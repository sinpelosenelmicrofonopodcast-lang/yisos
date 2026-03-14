import { NextResponse } from "next/server";
import { assertAdmin } from "@/lib/services/admin-api-auth";

function getStoragePathFromPublicUrl(imageUrl: string) {
  try {
    const pathname = new URL(imageUrl).pathname;
    const marker = "/storage/v1/object/public/product-images/";
    const markerIndex = pathname.indexOf(marker);

    if (markerIndex === -1) {
      return null;
    }

    return decodeURIComponent(pathname.slice(markerIndex + marker.length));
  } catch {
    return null;
  }
}

export async function DELETE(request: Request) {
  const admin = await assertAdmin();
  if (!admin.ok) return admin.response;

  const body = await request.json().catch(() => null);
  const imageId = String(body?.imageId || "");

  if (!imageId) {
    return NextResponse.json({ message: "imageId is required" }, { status: 400 });
  }

  const { data: image, error: imageError } = await admin.supabase
    .from("product_images")
    .select("id, image_url")
    .eq("id", imageId)
    .maybeSingle();

  if (imageError) {
    return NextResponse.json({ message: imageError.message }, { status: 400 });
  }

  if (!image) {
    return NextResponse.json({ message: "Image not found" }, { status: 404 });
  }

  const storagePath = typeof image.image_url === "string" ? getStoragePathFromPublicUrl(image.image_url) : null;

  if (storagePath) {
    const { error: storageError } = await admin.supabase.storage.from("product-images").remove([storagePath]);

    if (storageError) {
      return NextResponse.json({ message: storageError.message }, { status: 400 });
    }
  }

  const { error: deleteError } = await admin.supabase.from("product_images").delete().eq("id", imageId);

  if (deleteError) {
    return NextResponse.json({ message: deleteError.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
