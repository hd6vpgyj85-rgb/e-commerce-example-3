"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Loader2 } from "@/components/icons";
import { formatPrice } from "@/lib/format";
import { getAllProducts } from "@/lib/products";
import type { Product } from "@/lib/types";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getAllProducts()
      .catch(() => [])
      .then((data) => {
        if (active) {
          setProducts(data);
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
          PRODUCTOS
        </h1>
        <Link href="/admin/productos/nuevo" className="btn btn-solid">
          NUEVO PRODUCTO
        </Link>
      </div>

      {loading ? (
        <Loader2 className="mt-8 animate-spin text-neon" size={24} />
      ) : products.length === 0 ? (
        <p className="mt-8 text-sm text-muted">Aún no hay productos.</p>
      ) : (
        <ul className="mt-8 flex flex-col gap-2">
          {products.map((p) => (
            <li key={p.id}>
              <Link
                href={`/admin/productos/${p.id}`}
                className="flex items-center justify-between bg-panel px-4 py-3 transition-colors hover:bg-panel-soft"
              >
                <span className="text-sm text-off-white">{p.name}</span>
                <span className="text-xs text-muted">
                  {formatPrice(p.price)} · existencias: {p.stock} ·{" "}
                  {p.visible ? "Visible" : "Oculto"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
