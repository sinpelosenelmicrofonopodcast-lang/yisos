import { FavoritesClient } from "@/components/account/favorites-client";
import { getProducts } from "@/lib/services/product-service";

export default async function AccountFavoritesPage() {
  const products = await getProducts();

  return (
    <div className="space-y-5">
      <div className="rounded-[1.5rem] border border-border bg-[linear-gradient(145deg,rgba(31,26,22,0.95),rgba(10,10,10,0.98))] p-6">
        <p className="text-xs uppercase tracking-[0.24em] text-yisos-gold">Shortlist</p>
        <h1 className="mt-3 font-display text-4xl text-yisos-bone">Favorites</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Save blends worth revisiting and build a personal shortlist before your next lounge night or gift order.
        </p>
      </div>
      <FavoritesClient products={products} />
    </div>
  );
}
