"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ProductForm } from "@/components/admin/ProductForm";
import { Loader2 } from "@/components/icons";
import { getAllCollections } from "@/lib/collections";
import { getProductById } from "@/lib/products";
import type { Collection, Product } from "@/lib/types";

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.all([
      getProductById(params.id).catch(() => null),
      getAllCollections().catch(() => []),
    ]).then(([productData, collectionsData]) => {
      if (active) {
        setProduct(productData);
        setCollections(collectionsData);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [params.id]);

  return (
    <div>
      <h1 className="font-display text-2xl tracking-[0.08em] text-off-white">
        EDITAR PRODUCTO
      </h1>
      <div className="mt-8">
        {loading ? (
          <Loader2 className="animate-spin text-neon" size={24} />
        ) : !product ? (
          <p className="text-sm text-muted">No se encontró el producto.</p>
        ) : (
          <ProductForm product={product} collections={collections} />
        )}
      </div>
    </div>
  );
}
