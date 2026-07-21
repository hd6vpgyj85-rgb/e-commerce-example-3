"use client";

import { SafeImage } from "@/components/SafeImage";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import {
  createCollection,
  deleteCollection,
  updateCollection,
} from "@/lib/collections";
import { slugify } from "@/lib/slug";
import type { Collection } from "@/lib/types";

export function CollectionForm({ collection }: { collection?: Collection }) {
  const router = useRouter();
  const isEdit = Boolean(collection);

  const [name, setName] = useState(collection?.name ?? "");
  const [slug, setSlug] = useState(collection?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [imageUrl, setImageUrl] = useState(collection?.imageUrl ?? "");
  const [order, setOrder] = useState(collection?.order ?? 0);
  const [visible, setVisible] = useState(collection?.visible ?? true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    const input = { name, slug: slug || slugify(name), imageUrl, order, visible };
    try {
      if (isEdit && collection) {
        await updateCollection(collection.id, input);
      } else {
        await createCollection(input);
      }
      router.push("/admin/colecciones");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo guardar la colección."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!collection) return;
    if (!window.confirm(`¿Eliminar la colección "${collection.name}"?`)) return;
    await deleteCollection(collection.id);
    router.push("/admin/colecciones");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-lg flex-col gap-5">
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
        <span className="text-xs text-muted">
          URL de imagen — sube la imagen antes a un servicio como ImgBB o
          Cloudinary y pega aquí el enlace DIRECTO a la imagen (por ejemplo
          https://i.ibb.co/..., terminado en .jpg o .png), no el enlace de la
          página donde se ve la imagen.
        </span>
        {imageUrl && (
          <div className="product-frame relative mb-2 h-32 w-32 overflow-hidden">
            <SafeImage src={imageUrl} alt="" fill sizes="128px" className="object-cover" />
          </div>
        )}
        <input
          type="url"
          placeholder="https://..."
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="border-2 border-white/10 bg-panel px-3 py-2 text-sm text-off-white outline-none focus:border-neon"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs text-muted">Orden</span>
        <input
          type="number"
          value={order}
          onChange={(e) => setOrder(Number(e.target.value))}
          className="border-2 border-white/10 bg-panel px-3 py-2 text-sm text-off-white outline-none focus:border-neon"
        />
      </label>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={visible}
          onChange={(e) => setVisible(e.target.checked)}
        />
        <span className="text-sm text-off-white">
          Visible en el menú y la tienda
        </span>
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
