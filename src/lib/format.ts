import { siteConfig } from "@/lib/site-config";

const formatter = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: siteConfig.currency,
  maximumFractionDigits: 2,
});

export function formatPrice(amount: number): string {
  return formatter.format(amount);
}

export function effectivePrice(price: number, discountPrice?: number | null): number {
  return discountPrice != null && discountPrice > 0 && discountPrice < price
    ? discountPrice
    : price;
}
