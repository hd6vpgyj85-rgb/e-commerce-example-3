"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, X } from "@/components/icons";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";

function variantLabel(variant: Record<string, string>): string {
  const entries = Object.entries(variant);
  if (entries.length === 0) return "";
  return entries.map(([k, v]) => `${k}: ${v}`).join(" · ");
}

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty, totalPrice } =
    useCart();

  return (
    <>
      <div
        className={`fixed inset-0 z-[60] bg-black/70 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeCart}
        aria-hidden="true"
      />

      <aside
        className={`fixed right-0 top-0 z-[70] flex h-full w-full max-w-sm flex-col bg-panel transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Carrito de compras"
      >
        <div className="flex items-center justify-between px-5 py-4">
          <h2 className="font-display text-lg tracking-[0.1em] text-off-white">
            TU CARRITO
          </h2>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Cerrar carrito"
            className="text-off-white transition-colors hover:text-neon"
          >
            <X size={22} strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5">
          {items.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted">
              Tu carrito está vacío.
            </p>
          ) : (
            <ul className="flex flex-col gap-5 py-2">
              {items.map((item) => (
                <li
                  key={`${item.productId}-${JSON.stringify(item.variant)}`}
                  className="flex gap-3"
                >
                  <div className="product-frame relative h-20 w-20 shrink-0 overflow-hidden">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    ) : null}
                  </div>

                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <p className="text-sm text-off-white">{item.name}</p>
                      {variantLabel(item.variant) && (
                        <p className="text-xs text-muted">
                          {variantLabel(item.variant)}
                        </p>
                      )}
                      <p className="text-xs text-neon">
                        {formatPrice(item.unitPrice)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          aria-label="Disminuir cantidad"
                          onClick={() =>
                            updateQty(item.productId, item.variant, item.qty - 1)
                          }
                          className="text-off-white transition-colors hover:text-neon disabled:opacity-30"
                          disabled={item.qty <= 1}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-sm text-off-white">{item.qty}</span>
                        <button
                          type="button"
                          aria-label="Aumentar cantidad"
                          onClick={() =>
                            updateQty(item.productId, item.variant, item.qty + 1)
                          }
                          className="text-off-white transition-colors hover:text-neon"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button
                        type="button"
                        aria-label="Quitar producto"
                        onClick={() => removeItem(item.productId, item.variant)}
                        className="text-muted transition-colors hover:text-neon"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="px-5 py-5">
          <div className="mb-4 flex items-center justify-between font-display text-sm tracking-[0.1em]">
            <span className="text-off-white">TOTAL</span>
            <span className="text-neon">{formatPrice(totalPrice)}</span>
          </div>
          <Link
            href="/checkout"
            onClick={closeCart}
            className={`btn btn-solid w-full ${
              items.length === 0 ? "pointer-events-none opacity-30" : ""
            }`}
          >
            IR A CHECKOUT
          </Link>
        </div>
      </aside>
    </>
  );
}
