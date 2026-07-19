"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Plus, Trash2, X } from "@/components/icons";
import { createProduct, deleteProduct, updateProduct } from "@/lib/products";
import { slugify } from "@/lib/slug";
import { uploadProductImage } from "@/lib/upload";
import type { Collection, Product, ProductVariant } from "@/lib/types";

interface VariantRow {
  name: string;
  optionsText: string;
}

function toVariantRows(variants: ProductVariant[]): VariantRow[] {
  return variants.map((v) => ({ name: v.name, optionsText: v.options.join(", ") }));
}

export function ProductForm({
  product,
  collections,
}: {
  product?: Product;
  collections: Collection[];
}) {
  const router = useRouter();
  const isEdit = Boolean(product);

  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(product?.price ?? 0);
  const [discountPrice, setDiscountPrice] = useState<number | "">(
    product?.discountPrice ?? ""
  );
  const [stock, setStock] = useState(product?.stock ?? 0);
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [collectionIds, setCollectionIds] = useState<string[]>(
    product?.collectionIds ?? []
  );
  const [variantRows, setVariantRows] = useState<VariantRow[]>(
    toVariantRows(product?.variants ?? [])
  );
  const [visible, setVisible] = useState(product?.visible ?? true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleImagesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setUploading(true);
    try {
      const urls = await Promise.all(files.map(uploadProductImage));
      setImages((prev) => [...prev, ...urls]);
    } catch {
      setError("No se pudo subir alguna imagen.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function removeImage(url: string) {
    setImages((prev) => prev.filter((img) => img !== url));
  }

  function toggleCollection(id: string) {
    setCollectionIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  }

  function addVariantRow() {
    setVariantRows((prev) => [...prev, { name: "", optionsText: "" }]);
  }

  function updateVariantRow(index: number, patch: Partial<VariantRow>) {
    setVariantRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, ...patch } : row))
    );
  }

  function removeVariantRow(index: number) {
    setVariantRows((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const variants: ProductVariant[] = variantRows
      .filter((row) => row.name.trim() && row.optionsText.trim())
      .map((row) => ({
        name: row.name.trim(),
        options: row.optionsText
          .split(",")
          .map((o) => o.trim())
          .filter(Boolean),
      }));

    const input = {
      name,
      slug: slug || slugify(name),
      description,
      price: Number(price),
      discountPrice: discountPrice === "" ? null : Number(discountPrice),
      stock: Number(stock),
      images,
      collectionIds,
      variants,
      visible,
    };

    try {
      if (isEdit && product) {
        await updateProduct(product.id, input);
      } else {
        await createProduct(input);
      }
      router.push("/admin/productos");
      router.refresh();
    } catch {
      setError("No se pudo guardar el producto.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!product) return;
    if (!window.confirm(`¿Eliminar el producto "${product.name}"?`)) return;
    await deleteProduct(product.id);
    router.push("/admin/productos");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-2xl flex-col gap-5">
      <label className="flex flex-col gap-1.5">
        <span className="text-xs text-muted">Nombre</span>
        <input
          required
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (!slugTouched) setSlug(slugify(e.target.value));
          }}
          className="border-2 border-white/10 bg-panel px-3 py-2 text-sm text-off-white outline-none focus:border-neon"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs text-muted">Slug (URL)</span>
        <input
          required
          value={slug}
          onChange={(e) => {
            setSlug(slugify(e.target.value));
            setSlugTouched(true);
          }}
          className="border-2 border-white/10 bg-panel px-3 py-2 text-sm text-off-white outline-none focus:border-neon"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs text-muted">Descripción</span>
        <textarea
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border-2 border-white/10 bg-panel px-3 py-2 text-sm text-off-white outline-none focus:border-neon"
        />
      </label>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs text-muted">Precio</span>
          <input
            type="number"
            min={0}
            step="0.01"
            required
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="border-2 border-white/10 bg-panel px-3 py-2 text-sm text-off-white outline-none focus:border-neon"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs text-muted">Precio con descuento</span>
          <input
            type="number"
            min={0}
            step="0.01"
            value={discountPrice}
            onChange={(e) =>
              setDiscountPrice(e.target.value === "" ? "" : Number(e.target.value))
            }
            className="border-2 border-white/10 bg-panel px-3 py-2 text-sm text-off-white outline-none focus:border-neon"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs text-muted">Existencias</span>
          <input
            type="number"
            min={0}
            required
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
            className="border-2 border-white/10 bg-panel px-3 py-2 text-sm text-off-white outline-none focus:border-neon"
          />
        </label>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-muted">Imágenes</span>
        {images.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {images.map((url) => (
              <div key={url} className="product-frame relative h-20 w-20">
                <Image src={url} alt="" fill sizes="80px" className="object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(url)}
                  aria-label="Quitar imagen"
                  className="absolute -right-2 -top-2 bg-ink text-off-white"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImagesChange}
          className="text-xs text-muted"
        />
        {uploading && <span className="text-xs text-neon">Subiendo...</span>}
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-muted">Colecciones</span>
        <div className="flex flex-wrap gap-2">
          {collections.length === 0 ? (
            <p className="text-xs text-muted">
              Crea primero una colección para poder asignarla.
            </p>
          ) : (
            collections.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => toggleCollection(c.id)}
                className={`btn !px-3 !py-1.5 text-xs ${
                  collectionIds.includes(c.id) ? "btn-solid" : ""
                }`}
              >
                {c.name}
              </button>
            ))
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted">
            Variantes (por ejemplo, Talla o Color)
          </span>
          <button
            type="button"
            onClick={addVariantRow}
            className="flex items-center gap-1 text-xs text-neon"
          >
            <Plus size={14} /> AGREGAR
          </button>
        </div>
        {variantRows.map((row, i) => (
          <div key={i} className="flex items-start gap-2">
            <input
              placeholder="Nombre (Talla)"
              value={row.name}
              onChange={(e) => updateVariantRow(i, { name: e.target.value })}
              className="w-32 border-2 border-white/10 bg-panel px-3 py-2 text-sm text-off-white outline-none focus:border-neon"
            />
            <input
              placeholder="Opciones separadas por coma (S, M, L)"
              value={row.optionsText}
              onChange={(e) => updateVariantRow(i, { optionsText: e.target.value })}
              className="flex-1 border-2 border-white/10 bg-panel px-3 py-2 text-sm text-off-white outline-none focus:border-neon"
            />
            <button
              type="button"
              onClick={() => removeVariantRow(i)}
              aria-label="Quitar variante"
              className="mt-2 text-muted hover:text-neon"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={visible}
          onChange={(e) => setVisible(e.target.checked)}
        />
        <span className="text-sm text-off-white">Visible en la tienda</span>
      </label>

      {error && <p className="text-xs text-red-400">{error}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="btn btn-solid">
          {saving ? "GUARDANDO..." : "GUARDAR"}
        </button>
        {isEdit && (
          <button
            type="button"
            onClick={handleDelete}
            className="btn !border-red-500 !text-red-400 hover:!bg-red-500 hover:!text-ink"
          >
            ELIMINAR
          </button>
        )}
      </div>
    </form>
  );
}
