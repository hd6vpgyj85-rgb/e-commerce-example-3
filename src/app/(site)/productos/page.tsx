import { ProductGrid } from "@/components/ProductGrid";
import { getVisibleProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Todos los productos",
};

export default async function ProductosPage() {
  const products = await getVisibleProducts().catch(() => []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl tracking-[0.08em] text-off-white">
        TODOS LOS PRODUCTOS
      </h1>
      <div className="mt-8">
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
