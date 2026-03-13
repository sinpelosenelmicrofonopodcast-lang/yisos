"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { Category, Product } from "@/types";
import { ProductCard } from "@/components/shop/product-card";
import { Input } from "@/components/ui/input";
import { SimpleSelect } from "@/components/ui/select";

interface ShopClientProps {
  products: Product[];
  categories: Category[];
}

type SortValue = "newest" | "best-selling" | "price-asc" | "price-desc";

export function ShopClient({ products, categories }: ShopClientProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStrength, setSelectedStrength] = useState("all");
  const [selectedWrapper, setSelectedWrapper] = useState("all");
  const [selectedFlavor, setSelectedFlavor] = useState("all");
  const [selectedPrice, setSelectedPrice] = useState("all");
  const [sort, setSort] = useState<SortValue>("newest");

  const wrappers = useMemo(
    () => Array.from(new Set(products.map((product) => product.wrapper))).sort(),
    [products]
  );

  const flavors = useMemo(
    () => Array.from(new Set(products.flatMap((product) => product.tastingNotes))).sort(),
    [products]
  );

  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>();

    products.forEach((product) => {
      const matchSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase());
      const matchStrength = selectedStrength === "all" || product.strength === selectedStrength;
      const matchWrapper = selectedWrapper === "all" || product.wrapper === selectedWrapper;
      const matchFlavor =
        selectedFlavor === "all" || product.tastingNotes.some((note) => note === selectedFlavor);
      const effectivePrice = product.salePrice || product.price;
      const matchPrice =
        selectedPrice === "all" ||
        (selectedPrice === "under-25" && effectivePrice < 25) ||
        (selectedPrice === "25-35" && effectivePrice >= 25 && effectivePrice <= 35) ||
        (selectedPrice === "over-35" && effectivePrice > 35);

      if (!(matchSearch && matchStrength && matchWrapper && matchFlavor && matchPrice)) {
        return;
      }

      product.categorySlugs.forEach((slug) => {
        counts.set(slug, (counts.get(slug) || 0) + 1);
      });
    });

    return counts;
  }, [products, search, selectedStrength, selectedWrapper, selectedFlavor, selectedPrice]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const matchSearch =
          product.name.toLowerCase().includes(search.toLowerCase()) ||
          product.description.toLowerCase().includes(search.toLowerCase());
        const matchCategory =
          selectedCategory === "all" || product.categorySlugs.includes(selectedCategory);
        const matchStrength = selectedStrength === "all" || product.strength === selectedStrength;
        const matchWrapper = selectedWrapper === "all" || product.wrapper === selectedWrapper;
        const matchFlavor =
          selectedFlavor === "all" || product.tastingNotes.some((note) => note === selectedFlavor);
        const effectivePrice = product.salePrice || product.price;
        const matchPrice =
          selectedPrice === "all" ||
          (selectedPrice === "under-25" && effectivePrice < 25) ||
          (selectedPrice === "25-35" && effectivePrice >= 25 && effectivePrice <= 35) ||
          (selectedPrice === "over-35" && effectivePrice > 35);

        return matchSearch && matchCategory && matchStrength && matchWrapper && matchFlavor && matchPrice;
      })
      .sort((a, b) => {
        const aPrice = a.salePrice || a.price;
        const bPrice = b.salePrice || b.price;

        switch (sort) {
          case "best-selling":
            return Number(b.bestSeller) - Number(a.bestSeller);
          case "price-asc":
            return aPrice - bPrice;
          case "price-desc":
            return bPrice - aPrice;
          case "newest":
          default:
            return Number(b.newArrival) - Number(a.newArrival);
        }
      });
  }, [
    products,
    search,
    selectedCategory,
    selectedStrength,
    selectedWrapper,
    selectedFlavor,
    selectedPrice,
    sort
  ]);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-20 pt-10 md:px-8">
      <div className="surface-2 rounded-[24px] border border-yisos-gold/15 p-4">
        <div className="grid gap-3 xl:grid-cols-[2fr,repeat(6,minmax(0,1fr))]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search blends, profiles, notes"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="pl-9"
            />
          </div>

          <SimpleSelect
            value={selectedCategory}
            onValueChange={setSelectedCategory}
            options={[
              { label: `Category (${products.length})`, value: "all" },
              ...categories.map((cat) => ({
                label: `${cat.name} (${categoryCounts.get(cat.slug) || 0})`,
                value: cat.slug
              }))
            ]}
          />
          <SimpleSelect
            value={selectedStrength}
            onValueChange={setSelectedStrength}
            options={[
              { label: "Strength", value: "all" },
              { label: "Mild", value: "Mild" },
              { label: "Medium", value: "Medium" },
              { label: "Medium-Full", value: "Medium-Full" },
              { label: "Full", value: "Full" }
            ]}
          />
          <SimpleSelect
            value={selectedFlavor}
            onValueChange={setSelectedFlavor}
            options={[{ label: "Flavor", value: "all" }, ...flavors.map((f) => ({ label: f, value: f }))]}
          />
          <SimpleSelect
            value={selectedWrapper}
            onValueChange={setSelectedWrapper}
            options={[
              { label: "Wrapper", value: "all" },
              ...wrappers.map((wrapper) => ({ label: wrapper, value: wrapper }))
            ]}
          />
          <SimpleSelect
            value={selectedPrice}
            onValueChange={setSelectedPrice}
            options={[
              { label: "Price", value: "all" },
              { label: "Under $25", value: "under-25" },
              { label: "$25 - $35", value: "25-35" },
              { label: "Over $35", value: "over-35" }
            ]}
          />
          <SimpleSelect
            value={sort}
            onValueChange={(value) => setSort(value as SortValue)}
            options={[
              { label: "Newest", value: "newest" },
              { label: "Best Selling", value: "best-selling" },
              { label: "Price: Low to High", value: "price-asc" },
              { label: "Price: High to Low", value: "price-desc" }
            ]}
          />
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <div className="text-sm text-yisos-bone/72">
          <span className="font-semibold text-yisos-stitch">{filteredProducts.length}</span> blends available
        </div>
        <div className="text-[10px] uppercase tracking-[0.28em] text-yisos-gold">
          Strength filters / Pairing mood / Limited drops
        </div>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {filteredProducts.length ? (
          filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)
        ) : (
          <div className="surface-1 col-span-full rounded-2xl border border-border p-8 text-center text-yisos-bone/76">
            No products match these filters.
          </div>
        )}
      </div>
    </div>
  );
}
