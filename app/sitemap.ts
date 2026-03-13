import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config/site";
import { getProducts } from "@/lib/services/product-service";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();

  const staticRoutes = [
    "",
    "/shop",
    "/about",
    "/membership",
    "/gift-cards",
    "/contact",
    "/events",
    "/cart",
    "/checkout"
  ];

  return [
    ...staticRoutes.map((path) => ({
      url: `${siteConfig.url}${path}`,
      lastModified: new Date()
    })),
    ...products.map((product) => ({
      url: `${siteConfig.url}/shop/${product.slug}`,
      lastModified: new Date()
    }))
  ];
}
