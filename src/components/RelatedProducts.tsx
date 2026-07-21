import { ProductGrid } from "@/components/ProductGrid";
import type { Product } from "@/lib/types";

export function RelatedProducts({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <section className="mx-auto mt-16 max-w-6xl px-4 sm:px-6">
      <h2 className="font-display text-2xl tracking-[0.08em] text-off-white">
        TAMBIÉN TE PUEDE INTERESAR
      </h2>
      <div className="mt-6">
        <ProductGrid products={products} />
      </div>
    </section>
  );
}
