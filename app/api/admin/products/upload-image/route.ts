import { NextResponse } from "next/server";
import { assertAdmin } from "@/lib/services/admin-api-auth";

export async function POST(request: Request) {
  const admin = await assertAdmin();
  if (!admin.ok) return admin.response;

  const formData = await request.formData();
  const files = formData
    .getAll("files")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);
  const singleFile = formData.get("file");
  const productId = String(formData.get("productId") || "");
  const uploadFiles = files.length ? files : singleFile instanceof File && singleFile.size > 0 ? [singleFile] : [];

  if (!uploadFiles.length || !productId) {
    return NextResponse.json({ message: "At least one file and productId are required" }, { status: 400 });
  }

  const { count: existingImageCount } = await admin.supabase
    .from("product_images")
    .select("id", { count: "exact", head: true })
    .eq("product_id", productId);

  const uploadedUrls: string[] = [];
  let sortOrder = existingImageCount || 0;

  for (const file of uploadFiles) {
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${productId}/${crypto.randomUUID()}.${ext}`;

    const { error } = await admin.supabase.storage
      .from("product-images")
      .upload(path, file, { cacheControl: "3600", upsert: false });

    if (error) {
      if (error.message.toLowerCase().includes("bucket not found")) {
        return NextResponse.json(
          { message: "Supabase Storage bucket `product-images` does not exist. Create it first and make it public." },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { message: error.message },
        { status: 400 }
      );
    }

    const {
      data: { publicUrl }
    } = admin.supabase.storage.from("product-images").getPublicUrl(path);

    const { error: imageInsertError } = await admin.supabase.from("product_images").insert({
      product_id: productId,
      image_url: publicUrl,
      alt_text: `Product image ${productId}`,
      sort_order: sortOrder
    });

    if (imageInsertError) {
      return NextResponse.json({ message: imageInsertError.message }, { status: 400 });
    }

    uploadedUrls.push(publicUrl);
    sortOrder += 1;
  }

  return NextResponse.json({ success: true, urls: uploadedUrls, count: uploadedUrls.length });
}
