"use client";

import { SafeImage } from "@/components/SafeImage";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Loader2 } from "@/components/icons";
import { effectivePrice, formatPrice } from "@/lib/format";
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
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => {
            const price = effectivePrice(p.price, p.discountPrice);
            const hasDiscount = price < p.price;
            return (
              <Link
                key={p.id}
                href={`/admin/productos/${p.id}`}
                className="product-frame flex flex-col gap-2 p-3 transition-colors hover:bg-panel-soft"
              >
                <div className="relative aspect-square w-full overflow-hidden bg-panel">
                  {p.images[0] ? (
                    <SafeImage
                      src={p.images[0]}
                      alt={p.name}
                      fill
                      sizes="(min-width: 1024px) 20vw, (min-width: 640px) 30vw, 45vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-muted">
                      Sin imagen
                    </div>
                  )}
                  <div
                    className={`absolute left-2 top-2 px-2 py-0.5 text-[10px] font-display tracking-[0.1em] ${
                      p.visible ? "bg-neon text-ink" : "bg-ink text-muted"
                    }`}
                  >
                    {p.visible ? "VISIBLE" : "OCULTO"}
                  </div>
                </div>

                <p className="text-sm text-off-white">{p.name}</p>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-neon">
                    {formatPrice(price)}
                  </span>
                  {hasDiscount && (
                    <span className="text-xs text-muted line-through">
                      {formatPrice(p.price)}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted">Existencias: {p.stock}</p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
