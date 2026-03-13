import { FavoritesClient } from "@/components/account/favorites-client";
import { getProducts } from "@/lib/services/product-service";

export default async function AccountFavoritesPage() {
  const products = await getProducts();

  return (
    <div className="space-y-5">
      <h1 className="font-display text-4xl text-yisos-bone">Favorites</h1>
      <FavoritesClient products={products} />
    </div>
  );
}
