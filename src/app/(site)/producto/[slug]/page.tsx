import { notFound } from "next/navigation";
import { ProductActions } from "@/components/ProductActions";
import { ProductGallery } from "@/components/ProductGallery";
import { RelatedProducts } from "@/components/RelatedProducts";
import { getProductBySlug, getRandomRelatedProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug).catch(() => null);
  return { title: product?.name ?? "Producto" };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug).catch(() => null);

  if (!product || !product.visible) {
    notFound();
  }

  const related = await getRandomRelatedProducts(product.id, 4).catch(() => []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-2">
        <ProductGallery images={product.images} name={product.name} />
        <ProductActions product={product} />
      </div>

      <RelatedProducts products={related} />
    </div>
  );
}
