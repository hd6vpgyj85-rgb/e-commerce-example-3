"use client";

import { useMemo, useState } from "react";
import { Minus, Plus } from "@/components/icons";
import { useCart } from "@/context/CartContext";
import { effectivePrice, formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

export function ProductActions({ product }: { product: Product }) {
  const { addItem, openCart } = useCart();
  const [selected, setSelected] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      product.variants.map((v) => [v.name, v.options[0] ?? ""])
    )
  );
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const outOfStock = product.stock <= 0;
  const price = effectivePrice(product.price, product.discountPrice);
  const hasDiscount = price < product.price;

  const missingVariant = useMemo(
    () => product.variants.some((v) => !selected[v.name]),
    [product.variants, selected]
  );

  function handleAdd() {
    if (outOfStock || missingVariant) return;
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: product.images[0] ?? "",
      unitPrice: price,
      variant: selected,
      qty,
    });
    setAdded(true);
    openCart();
    window.setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl tracking-[0.04em] text-off-white">
          {product.name}
        </h1>
        <div className="mt-2 flex items-center gap-3">
          <span className="text-xl font-semibold text-neon">
            {formatPrice(price)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-muted line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
      </div>

      {product.description && (
        <p className="text-sm leading-relaxed text-muted">
          {product.description}
        </p>
      )}

      {product.variants.map((variant) => (
        <div key={variant.name} className="flex flex-col gap-2">
          <p className="font-display text-xs tracking-[0.15em] text-muted">
            {variant.name.toUpperCase()}
          </p>
          <div className="flex flex-wrap gap-2">
            {variant.options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() =>
                  setSelected((prev) => ({ ...prev, [variant.name]: option }))
                }
                className={`btn !px-4 !py-2 text-xs ${
                  selected[variant.name] === option ? "btn-solid" : ""
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ))}

      <div className="flex items-center gap-4">
        <p className="font-display text-xs tracking-[0.15em] text-muted">
          CANTIDAD
        </p>
        <div className="flex items-center gap-4">
          <button
            type="button"
            aria-label="Disminuir cantidad"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="text-off-white transition-colors hover:text-neon disabled:opacity-30"
            disabled={qty <= 1}
          >
            <Minus size={16} />
          </button>
          <span className="text-sm text-off-white">{qty}</span>
          <button
            type="button"
            aria-label="Aumentar cantidad"
            onClick={() => setQty((q) => q + 1)}
            className="text-off-white transition-colors hover:text-neon"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={handleAdd}
        disabled={outOfStock || missingVariant}
        className="btn btn-solid w-full sm:w-auto"
      >
        {outOfStock
          ? "AGOTADO"
          : added
            ? "AGREGADO AL CARRITO"
            : "AGREGAR AL CARRITO"}
      </button>
    </div>
  );
}
