import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/ProductGrid";
import { getCollectionBySlug } from "@/lib/collections";
import { getProductsByCollectionId } from "@/lib/products";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collectionData = await getCollectionBySlug(slug).catch(() => null);
  return { title: collectionData?.name ?? "Colección" };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let collectionData;
  try {
    collectionData = await getCollectionBySlug(slug);
  } catch (err) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <p className="text-sm text-red-400">
          Hubo un problema cargando esta colección:{" "}
          {err instanceof Error ? err.message : String(err)}
        </p>
      </div>
    );
  }

  if (!collectionData || !collectionData.visible) {
    notFound();
  }

  let products;
  try {
    products = await getProductsByCollectionId(collectionData.id);
  } catch (err) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <p className="text-sm text-red-400">
          Hubo un problema cargando los productos de esta colección:{" "}
          {err instanceof Error ? err.message : String(err)}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl tracking-[0.08em] text-off-white">
        {collectionData.name.toUpperCase()}
      </h1>
      <div className="mt-8">
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
