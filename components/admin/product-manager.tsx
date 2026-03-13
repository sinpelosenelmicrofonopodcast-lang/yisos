"use client";

import { useMemo, useState } from "react";
import { PencilLine, Plus, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";

interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
}

interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  price: number;
  stock: number;
  is_active: boolean;
  categoryIds: string[];
  categoryNames: string[];
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildDefaultForm() {
  return {
    id: "",
    name: "",
    slug: "",
    sku: "",
    description: "",
    price: "",
    stock: "",
    categoryIds: [] as string[]
  };
}

export function ProductManager({
  products: initialProducts,
  categories: initialCategories
}: {
  products: AdminProduct[];
  categories: AdminCategory[];
}) {
  const [products, setProducts] = useState(initialProducts);
  const [categories, setCategories] = useState(initialCategories);
  const [form, setForm] = useState(buildDefaultForm());
  const [categoryForm, setCategoryForm] = useState({
    id: "",
    name: "",
    slug: "",
    description: ""
  });
  const [uploadProductId, setUploadProductId] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [statusTone, setStatusTone] = useState<"error" | "success" | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [manualOverrides, setManualOverrides] = useState({
    id: false,
    slug: false,
    sku: false,
    categoryId: false,
    categorySlug: false
  });
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const generatedSlug = useMemo(() => slugify(form.name), [form.name]);
  const generatedId = useMemo(() => (generatedSlug ? `prod-${generatedSlug}` : ""), [generatedSlug]);
  const generatedSku = useMemo(
    () => (generatedSlug ? `YIS-${generatedSlug.replace(/-/g, "-").toUpperCase()}` : ""),
    [generatedSlug]
  );

  const generatedCategorySlug = useMemo(() => slugify(categoryForm.name), [categoryForm.name]);
  const generatedCategoryId = useMemo(
    () => (generatedCategorySlug ? `cat-${generatedCategorySlug}` : ""),
    [generatedCategorySlug]
  );

  const update = (key: keyof typeof form, value: string | string[]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const resetProductForm = () => {
    setForm(buildDefaultForm());
    setEditingProductId(null);
    setManualOverrides((current) => ({
      ...current,
      id: false,
      slug: false,
      sku: false
    }));
  };

  const updateGeneratedFieldsFromName = (name: string) => {
    const nextSlug = slugify(name);
    const nextId = nextSlug ? `prod-${nextSlug}` : "";
    const nextSku = nextSlug ? `YIS-${nextSlug.replace(/-/g, "-").toUpperCase()}` : "";

    setForm((current) => ({
      ...current,
      name,
      slug: manualOverrides.slug ? current.slug : nextSlug,
      id: manualOverrides.id ? current.id : nextId,
      sku: manualOverrides.sku ? current.sku : nextSku
    }));
  };

  const syncGeneratedFields = () => {
    setForm((current) => ({
      ...current,
      slug: manualOverrides.slug ? current.slug : generatedSlug,
      id: manualOverrides.id ? current.id : generatedId,
      sku: manualOverrides.sku ? current.sku : generatedSku
    }));
  };

  const toggleCategory = (categoryId: string) => {
    setForm((current) => ({
      ...current,
      categoryIds: current.categoryIds.includes(categoryId)
        ? current.categoryIds.filter((entry) => entry !== categoryId)
        : [...current.categoryIds, categoryId]
    }));
  };

  const loadProductIntoForm = (product: AdminProduct) => {
    setEditingProductId(product.id);
    setForm({
      id: product.id,
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      description: product.description,
      price: String(product.price),
      stock: String(product.stock),
      categoryIds: product.categoryIds || []
    });
    setUploadProductId(product.id);
    setManualOverrides((current) => ({
      ...current,
      id: true,
      slug: true,
      sku: true
    }));
    setStatus(`Editing ${product.name}.`);
    setStatusTone("success");
  };

  const createOrUpdateProduct = async () => {
    const id = form.id || generatedId;
    const slug = form.slug || generatedSlug;
    const sku = form.sku || generatedSku;

    if (!id || !form.name || !slug || !sku || !form.description || !form.price) {
      setStatus("Fill in Product ID, Name, Slug, SKU, Description, and Price before saving.");
      setStatusTone("error");
      return;
    }

    setSaving(true);
    setStatus(null);
    setStatusTone(null);

    try {
      const payload = {
        ...form,
        id,
        slug,
        sku,
        price: Number(form.price),
        stock: Number(form.stock || 0)
      };

      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setStatus(data.message || "Unable to save product.");
        setStatusTone("error");
        return;
      }

      const categoryNames = categories
        .filter((category) => payload.categoryIds.includes(category.id))
        .map((category) => category.name);

      const nextProduct: AdminProduct = {
        id: payload.id,
        name: payload.name,
        slug: payload.slug,
        sku: payload.sku,
        description: payload.description,
        price: payload.price,
        stock: payload.stock,
        is_active: true,
        categoryIds: payload.categoryIds,
        categoryNames
      };

      setProducts((current) => {
        const existingIndex = current.findIndex((product) => product.id === nextProduct.id);
        if (existingIndex === -1) {
          return [nextProduct, ...current];
        }

        const copy = [...current];
        copy[existingIndex] = nextProduct;
        return copy;
      });

      setUploadProductId(id);
      setStatus(editingProductId ? "Product updated." : "Product saved. You can upload images for this product now.");
      setStatusTone("success");
      resetProductForm();
    } finally {
      setSaving(false);
    }
  };

  const uploadImage = async () => {
    if (!files.length || !uploadProductId) {
      setStatus("Select one or more files and a product ID.");
      setStatusTone("error");
      return;
    }

    setUploading(true);
    setStatus(null);
    setStatusTone(null);

    try {
      const body = new FormData();
      body.set("productId", uploadProductId);
      files.forEach((file) => body.append("files", file));

      const response = await fetch("/api/admin/products/upload-image", {
        method: "POST",
        body
      });

      const data = await response.json().catch(() => ({}));
      setStatus(response.ok ? `${data.count || files.length} image(s) uploaded.` : data.message || "Image upload failed.");
      setStatusTone(response.ok ? "success" : "error");
      if (response.ok) {
        setFiles([]);
      }
    } finally {
      setUploading(false);
    }
  };

  const createCategory = async () => {
    const id = categoryForm.id || generatedCategoryId;
    const slug = categoryForm.slug || generatedCategorySlug;

    if (!id || !categoryForm.name || !slug || !categoryForm.description) {
      setStatus("Category ID, name, slug, and description are required.");
      setStatusTone("error");
      return;
    }

    setCreatingCategory(true);
    setStatus(null);
    setStatusTone(null);

    try {
      const payload = {
        id,
        name: categoryForm.name,
        slug,
        description: categoryForm.description
      };

      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setStatus(data.message || "Unable to save category.");
        setStatusTone("error");
        return;
      }

      setCategories((current) => {
        const existingIndex = current.findIndex((category) => category.id === payload.id);
        if (existingIndex === -1) {
          return [...current, payload].sort((a, b) => a.name.localeCompare(b.name));
        }

        const copy = [...current];
        copy[existingIndex] = payload;
        return copy.sort((a, b) => a.name.localeCompare(b.name));
      });

      setCategoryForm({
        id: "",
        name: "",
        slug: "",
        description: ""
      });
      setManualOverrides((current) => ({
        ...current,
        categoryId: false,
        categorySlug: false
      }));
      setStatus("Category saved.");
      setStatusTone("success");
    } finally {
      setCreatingCategory(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-4xl text-yisos-bone">Products</h1>
        <div className="flex gap-3">
          <Button variant="outline" onClick={resetProductForm}>
            <RefreshCw className="mr-2 h-4 w-4" />
            New Product
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-yisos-charcoal/70 p-3">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Categories</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Edit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length ? (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell className="text-muted-foreground">{product.slug}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {product.categoryNames.length ? product.categoryNames.join(", ") : "Unassigned"}
                  </TableCell>
                  <TableCell>{formatCurrency(Number(product.price || 0))}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>{product.is_active ? "Active" : "Draft"}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => loadProductIntoForm(product)}>
                      <PencilLine className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-yisos-bone/70">
                  No products found in Supabase.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.35fr,0.95fr]">
        <div className="space-y-4 rounded-xl border border-border bg-yisos-charcoal/70 p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-display text-3xl text-yisos-bone">
                {editingProductId ? "Edit Product" : "Create Or Update Product"}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Name, SKU, description, and price are required. Categories are saved to `product_categories`.
              </p>
            </div>
            {editingProductId ? (
              <Button variant="outline" onClick={resetProductForm}>
                Cancel Edit
              </Button>
            ) : null}
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1">
              <Label>Product ID</Label>
              <Input
                value={form.id}
                onChange={(e) => {
                  setManualOverrides((current) => ({ ...current, id: true }));
                  update("id", e.target.value);
                }}
                placeholder={generatedId || "prod-dominion-toro"}
              />
            </div>
            <div className="space-y-1">
              <Label>Name</Label>
              <Input
                value={form.name}
                onChange={(e) => updateGeneratedFieldsFromName(e.target.value)}
                onBlur={syncGeneratedFields}
                placeholder="Dominion Toro"
              />
            </div>
            <div className="space-y-1">
              <Label>Slug</Label>
              <Input
                value={form.slug}
                onChange={(e) => {
                  setManualOverrides((current) => ({ ...current, slug: true }));
                  update("slug", e.target.value);
                }}
                placeholder={generatedSlug || "dominion-toro"}
              />
            </div>
            <div className="space-y-1">
              <Label>SKU</Label>
              <Input
                value={form.sku}
                onChange={(e) => {
                  setManualOverrides((current) => ({ ...current, sku: true }));
                  update("sku", e.target.value);
                }}
                placeholder={generatedSku || "YIS-DOMINION-TORO"}
              />
            </div>
            <div className="space-y-1 md:col-span-2">
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder="A premium toro built around aged Dominican and Nicaraguan tobacco with cocoa, oak, and black pepper."
              />
            </div>
            <div className="space-y-1">
              <Label>Price</Label>
              <Input value={form.price} onChange={(e) => update("price", e.target.value)} type="number" min="0" step="0.01" />
            </div>
            <div className="space-y-1">
              <Label>Stock</Label>
              <Input value={form.stock} onChange={(e) => update("stock", e.target.value)} type="number" min="0" step="1" />
            </div>
          </div>

          <div className="space-y-3">
            <Label>Categories</Label>
            <div className="flex flex-wrap gap-2">
              {categories.length ? (
                categories.map((category) => {
                  const active = form.categoryIds.includes(category.id);

                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => toggleCategory(category.id)}
                      className={`rounded-full border px-3 py-2 text-sm transition ${
                        active
                          ? "border-yisos-gold bg-yisos-gold/15 text-yisos-stitch"
                          : "border-border bg-black/20 text-muted-foreground hover:text-yisos-bone"
                      }`}
                    >
                      {category.name}
                    </button>
                  );
                })
              ) : (
                <p className="text-sm text-muted-foreground">No categories yet. Create one in the category panel.</p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={syncGeneratedFields} disabled={saving}>
              Generate ID / Slug / SKU
            </Button>
            <Button variant="luxury" onClick={createOrUpdateProduct} disabled={saving}>
              {saving ? "Saving..." : editingProductId ? "Update Product" : "Save Product"}
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-4 rounded-xl border border-border bg-yisos-charcoal/70 p-5">
            <div>
              <p className="font-display text-3xl text-yisos-bone">Categories</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Create categories once, then assign them directly to products from the editor.
              </p>
            </div>

            <div className="grid gap-3">
              <div className="space-y-1">
                <Label>Category ID</Label>
                <Input
                  value={categoryForm.id}
                  onChange={(e) => {
                    setManualOverrides((current) => ({ ...current, categoryId: true }));
                    setCategoryForm((current) => ({ ...current, id: e.target.value }));
                  }}
                  placeholder={generatedCategoryId || "cat-limited-editions"}
                />
              </div>
              <div className="space-y-1">
                <Label>Name</Label>
                <Input
                  value={categoryForm.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    const nextSlug = slugify(name);
                    const nextId = nextSlug ? `cat-${nextSlug}` : "";

                    setCategoryForm((current) => ({
                      ...current,
                      name,
                      slug: manualOverrides.categorySlug ? current.slug : nextSlug,
                      id: manualOverrides.categoryId ? current.id : nextId
                    }));
                  }}
                  placeholder="Limited Editions"
                />
              </div>
              <div className="space-y-1">
                <Label>Slug</Label>
                <Input
                  value={categoryForm.slug}
                  onChange={(e) => {
                    setManualOverrides((current) => ({ ...current, categorySlug: true }));
                    setCategoryForm((current) => ({ ...current, slug: e.target.value }));
                  }}
                  placeholder={generatedCategorySlug || "limited-editions"}
                />
              </div>
              <div className="space-y-1">
                <Label>Description</Label>
                <Textarea
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm((current) => ({ ...current, description: e.target.value }))}
                  placeholder="Collector-grade releases available in strict allocation."
                />
              </div>
            </div>

            <Button variant="outline" onClick={createCategory} disabled={creatingCategory}>
              <Plus className="mr-2 h-4 w-4" />
              {creatingCategory ? "Saving..." : "Save Category"}
            </Button>
          </div>

          <div className="space-y-4 rounded-xl border border-border bg-yisos-charcoal/70 p-5">
            <div>
              <p className="font-display text-3xl text-yisos-bone">Upload Product Image</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Save the product first, then upload one or more images to Supabase Storage.
              </p>
            </div>

            <div className="space-y-1">
              <Label>Product ID</Label>
              <Input value={uploadProductId} onChange={(e) => setUploadProductId(e.target.value)} placeholder="prod-dominion-toro" />
            </div>
            <div className="space-y-1">
              <Label>Image File</Label>
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setFiles(Array.from(e.target.files || []))}
              />
              {files.length ? (
                <p className="text-xs text-muted-foreground">{files.length} file(s) selected for upload.</p>
              ) : null}
            </div>
            <Button variant="outline" onClick={uploadImage} disabled={uploading}>
              {uploading ? "Uploading..." : "Upload Image"}
            </Button>
          </div>
        </div>
      </div>

      {status ? (
        <p className={`text-sm ${statusTone === "error" ? "text-red-300" : "text-yisos-bone/80"}`}>{status}</p>
      ) : null}
    </div>
  );
}
