import { createSupabaseServerClient } from "@/lib/supabase/server";

interface EventRow {
  id: string;
  title: string;
  slug: string;
  description: string;
  date: string;
  location: string;
  capacity: number;
  ticket_price: number;
  featured_image: string;
}

export async function getEvents() {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("events")
    .select("id, title, slug, description, date, location, capacity, ticket_price, featured_image")
    .order("date");

  if (error || !data?.length) {
    return [];
  }

  return (data as unknown as EventRow[]).map((event) => ({
    ...event,
    ticketPrice: Number(event.ticket_price),
    featuredImage: event.featured_image
  }));
}
