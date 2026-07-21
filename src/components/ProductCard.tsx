import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  const hasDiscount =
    product.discountPrice != null &&
    product.discountPrice > 0 &&
    product.discountPrice < product.price;
  const outOfStock = product.stock <= 0;

  return (
    <Link href={`/producto/${product.slug}`} className="group flex flex-col gap-3">
      <div className="product-frame relative aspect-square w-full overflow-hidden bg-panel">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-muted">
            Sin imagen
          </div>
        )}
        {outOfStock && (
          <div className="absolute left-2 top-2 bg-ink px-2 py-1 text-[10px] font-display tracking-[0.1em] text-off-white">
            AGOTADO
          </div>
        )}
      </div>

      <div>
        <p className="text-sm text-off-white">{product.name}</p>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-sm font-semibold text-neon">
            {formatPrice(hasDiscount ? product.discountPrice! : product.price)}
          </span>
          {hasDiscount && (
            <span className="text-xs text-muted line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
