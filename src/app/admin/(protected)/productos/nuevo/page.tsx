"use client";

import { useEffect, useState } from "react";
import { ProductForm } from "@/components/admin/ProductForm";
import { Loader2 } from "@/components/icons";
import { getAllCollections } from "@/lib/collections";
import type { Collection } from "@/lib/types";

export default function NewProductPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getAllCollections()
      .catch(() => [])
      .then((data) => {
        if (active) {
          setCollections(data);
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div>
      <h1 className="font-display text-2xl tracking-[0.08em] text-off-white">
        NUEVO PRODUCTO
      </h1>
      <div className="mt-8">
        {loading ? (
          <Loader2 className="animate-spin text-neon" size={24} />
        ) : (
          <ProductForm collections={collections} />
        )}
      </div>
    </div>
  );
}
