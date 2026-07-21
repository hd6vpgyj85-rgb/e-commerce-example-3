"use client";

import { SafeImage } from "@/components/SafeImage";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";
import { createOrder } from "@/lib/orders";
import { buildOrderMessage, buildWhatsappLink } from "@/lib/whatsapp";
import type { OrderItem } from "@/lib/types";

function variantLabel(variant: Record<string, string>): string {
  const entries = Object.entries(variant);
  if (entries.length === 0) return "";
  return entries.map(([k, v]) => `${k}: ${v}`).join(" · ");
}

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");

  async function handleSend() {
    setStatus("sending");

    // Open the tab synchronously, inside the click handler, before any
    // `await` — mobile browsers (iOS Safari especially) drop the "user
    // gesture" that allows window.open() once an async gap has passed,
    // so opening it after awaiting createOrder() gets silently blocked.
    const whatsappWindow = window.open("", "_blank", "noopener,noreferrer");

    const orderItems: OrderItem[] = items.map((item) => ({
      productId: item.productId,
      name: item.name,
      slug: item.slug,
      image: item.image,
      variant: item.variant,
      qty: item.qty,
      unitPrice: item.unitPrice,
      lineTotal: item.unitPrice * item.qty,
    }));
    const message = buildOrderMessage(items, totalPrice);

    try {
      await createOrder(orderItems, totalPrice, message);
    } catch {
      // If Firestore isn't reachable, still let the customer send the WhatsApp message.
    }

    const whatsappUrl = buildWhatsappLink(message);
    if (whatsappWindow) {
      whatsappWindow.location.href = whatsappUrl;
    } else {
      window.location.href = whatsappUrl;
    }
    clearCart();
    setStatus("done");
  }

  if (status === "done") {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
        <h1 className="font-display text-3xl tracking-[0.08em] text-neon">
          MENSAJE ENVIADO
        </h1>
        <p className="mt-4 text-sm text-muted">
          Ponte de acuerdo con nosotros por WhatsApp para definir el punto
          medio y la hora de recogida de tu pedido.
        </p>
        <Link href="/productos" className="btn btn-solid mt-8 inline-flex">
          SEGUIR VIENDO PRODUCTOS
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
        <h1 className="font-display text-3xl tracking-[0.08em] text-off-white">
          TU CARRITO ESTÁ VACÍO
        </h1>
        <Link href="/productos" className="btn btn-solid mt-8 inline-flex">
          VER PRODUCTOS
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl tracking-[0.08em] text-off-white">
        CHECKOUT
      </h1>

      <ul className="mt-8 flex flex-col gap-5">
        {items.map((item) => (
          <li
            key={`${item.productId}-${JSON.stringify(item.variant)}`}
            className="flex gap-4"
          >
            <div className="product-frame relative h-20 w-20 shrink-0 overflow-hidden bg-panel">
              {item.image && (
                <SafeImage
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              )}
            </div>
            <div className="flex flex-1 flex-col justify-center">
              <p className="text-sm text-off-white">{item.name}</p>
              {variantLabel(item.variant) && (
                <p className="text-xs text-muted">{variantLabel(item.variant)}</p>
              )}
              <p className="text-xs text-muted">Cantidad: {item.qty}</p>
            </div>
            <p className="self-center text-sm text-neon">
              {formatPrice(item.unitPrice * item.qty)}
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex items-center justify-between font-display text-lg tracking-[0.08em]">
        <span className="text-off-white">TOTAL</span>
        <span className="text-neon">{formatPrice(totalPrice)}</span>
      </div>

      <div className="mt-10 bg-panel p-5">
        <p className="font-display text-sm tracking-[0.1em] text-off-white">
          PUNTO MEDIO — RECOGIDA EN PERSONA
        </p>
        <p className="mt-2 text-sm text-muted">
          Este pedido no se paga en línea. Al presionar el botón se abrirá
          WhatsApp con el detalle de tu pedido para que nos pongamos de
          acuerdo en un punto medio y la hora de recogida.
        </p>
        <button
          type="button"
          onClick={handleSend}
          disabled={status === "sending"}
          className="btn btn-solid mt-5 w-full"
        >
          {status === "sending" ? "ABRIENDO WHATSAPP..." : "ENVIAR MENSAJE POR WHATSAPP"}
        </button>
      </div>
    </div>
  );
}
