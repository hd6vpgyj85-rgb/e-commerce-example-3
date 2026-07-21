import { siteConfig } from "@/lib/site-config";
import { formatPrice } from "@/lib/format";
import type { CartItem } from "@/lib/types";

function variantLabel(variant: Record<string, string>): string {
  const entries = Object.entries(variant);
  if (entries.length === 0) return "";
  return ` (${entries.map(([k, v]) => `${k}: ${v}`).join(", ")})`;
}

export function buildOrderMessage(
  items: CartItem[],
  total: number,
  customerName: string,
  customerPhone: string
): string {
  const lines = items.map((item) => {
    const lineTotal = formatPrice(item.unitPrice * item.qty);
    return `• ${item.name}${variantLabel(item.variant)} x${item.qty} — ${lineTotal}`;
  });

  return [
    `Hola ${siteConfig.name}, quiero acordar un punto medio para la recogida de mi pedido:`,
    "",
    ...lines,
    "",
    `Total: ${formatPrice(total)}`,
    "",
    `Nombre: ${customerName}`,
    `Teléfono: ${customerPhone}`,
  ].join("\n");
}

export function buildWhatsappLink(message: string): string {
  return `https://wa.me/${siteConfig.contact.whatsappNumber}?text=${encodeURIComponent(
    message
  )}`;
}
