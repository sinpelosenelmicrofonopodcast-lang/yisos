import { getAdminCategories, getAdminProducts } from "@/lib/services/admin-service";
import { ProductManager } from "@/components/admin/product-manager";

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([getAdminProducts(), getAdminCategories()]);

  return (
    <div className="space-y-5">
      <ProductManager products={products} categories={categories} />
    </div>
  );
}
