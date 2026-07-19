"use client";

import { ShoppingBag } from "@/components/icons";
import { useCart } from "@/context/CartContext";

export function CartButton() {
  const { totalItems, openCart } = useCart();

  return (
    <button
      type="button"
      onClick={openCart}
      aria-label="Abrir carrito"
      className="relative flex h-10 w-10 items-center justify-center text-off-white transition-colors hover:text-neon"
    >
      <ShoppingBag size={22} strokeWidth={1.5} />
      {totalItems > 0 && (
        <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center bg-neon px-1 text-[10px] font-semibold text-ink">
          {totalItems}
        </span>
      )}
    </button>
  );
}
