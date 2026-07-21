"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Loader2 } from "@/components/icons";
import { getAllCollections } from "@/lib/collections";
import type { Collection } from "@/lib/types";

export default function AdminCollectionsPage() {
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
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl tracking-[0.08em] text-off-white">
          COLECCIONES
        </h1>
        <Link href="/admin/colecciones/nueva" className="btn btn-solid">
          NUEVA COLECCIÓN
        </Link>
      </div>

      {loading ? (
        <Loader2 className="mt-8 animate-spin text-neon" size={24} />
      ) : collections.length === 0 ? (
        <p className="mt-8 text-sm text-muted">Aún no hay colecciones.</p>
      ) : (
        <ul className="mt-8 flex flex-col gap-2">
          {collections.map((c) => (
            <li key={c.id}>
              <Link
                href={`/admin/colecciones/${c.id}`}
                className="flex items-center justify-between bg-panel px-4 py-3 transition-colors hover:bg-panel-soft"
              >
                <span className="text-sm text-off-white">{c.name}</span>
                <span className="text-xs text-muted">
                  {c.visible ? "Visible" : "Oculta"} · orden {c.order}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
