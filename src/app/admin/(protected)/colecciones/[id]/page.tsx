"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CollectionForm } from "@/components/admin/CollectionForm";
import { Loader2 } from "@/components/icons";
import { getCollectionById } from "@/lib/collections";
import type { Collection } from "@/lib/types";

export default function EditCollectionPage() {
  const params = useParams<{ id: string }>();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getCollectionById(params.id)
      .catch(() => null)
      .then((data) => {
        if (active) {
          setCollection(data);
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
        EDITAR COLECCIÓN
      </h1>
      <div className="mt-8">
        {loading ? (
          <Loader2 className="animate-spin text-neon" size={24} />
        ) : !collection ? (
          <p className="text-sm text-muted">No se encontró la colección.</p>
        ) : (
          <CollectionForm collection={collection} />
        )}
      </div>
    </div>
  );
}
