import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Review } from "@/types";

interface ReviewRow {
  id: string;
  product_id: string;
  rating: number;
  comment: string;
  created_at: string;
  profiles?: { full_name?: string | null } | Array<{ full_name?: string | null }> | null;
}

export async function getProductReviews(productId: string) {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("reviews")
    .select("id, product_id, rating, comment, created_at, profiles(full_name)")
    .eq("product_id", productId)
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return (data as unknown as ReviewRow[]).map((review) => ({
    id: review.id,
    productId: review.product_id,
    userName:
      (Array.isArray(review.profiles)
        ? review.profiles[0]?.full_name
        : review.profiles?.full_name) || "Verified Customer",
    rating: review.rating,
    comment: review.comment,
    createdAt: review.created_at
  }));
}

interface HomepageReviewRow {
  id: string;
  product_id: string;
  rating: number;
  comment: string;
  created_at: string;
  profiles?: { full_name?: string | null } | Array<{ full_name?: string | null }> | null;
}

export async function getHomepageReviews(limit = 3): Promise<Review[]> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("reviews")
    .select("id, product_id, rating, comment, created_at, profiles(full_name)")
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) {
    return [];
  }

  return (data as unknown as HomepageReviewRow[]).map((review) => ({
    id: review.id,
    productId: review.product_id,
    userName:
      (Array.isArray(review.profiles)
        ? review.profiles[0]?.full_name
        : review.profiles?.full_name) || "Verified Customer",
    rating: review.rating,
    comment: review.comment,
    createdAt: review.created_at
  }));
}
