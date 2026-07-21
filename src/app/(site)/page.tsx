import { SafeImage } from "@/components/SafeImage";
import Image from "next/image";
import Link from "next/link";
import { ProductGrid } from "@/components/ProductGrid";
import { SocialShelf } from "@/components/SocialShelf";
import { getVisibleCollections } from "@/lib/collections";
import { getVisibleProducts } from "@/lib/products";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [collections, products] = await Promise.all([
    getVisibleCollections().catch(() => []),
    getVisibleProducts().catch(() => []),
  ]);

  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden">
        <Image
          src="/hero-bg.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-ink/75" />
        <div className="relative mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-20 sm:px-6 sm:py-28">
          <h1 className="font-display text-5xl leading-[0.95] tracking-[0.02em] text-off-white sm:text-7xl">
            ARMA TU PEDIDO.
            <br />
            <span className="text-neon">ACUERDA LA RECOGIDA.</span>
          </h1>
          <p className="max-w-md text-sm text-muted sm:text-base">
            {siteConfig.description}
          </p>
          <Link href="/productos" className="btn btn-solid">
            VER PRODUCTOS
          </Link>
        </div>
      </section>

      {collections.length > 0 && (
        <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
          <h2 className="font-display text-2xl tracking-[0.08em] text-off-white">
            COLECCIONES
          </h2>
          <div className="mt-6 flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {collections.map((c) => (
              <Link
                key={c.id}
                href={`/coleccion/${c.slug}`}
                className="group flex w-32 shrink-0 flex-col gap-3 sm:w-40"
              >
                <div className="product-frame relative aspect-square w-full overflow-hidden bg-panel">
                  {c.imageUrl ? (
                    <SafeImage
                      src={c.imageUrl}
                      alt={c.name}
                      fill
                      sizes="160px"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-muted">
                      {c.name}
                    </div>
                  )}
                </div>
                <p className="font-display text-sm tracking-[0.1em] text-off-white transition-colors group-hover:text-neon">
                  {c.name.toUpperCase()}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <h2 className="font-display text-2xl tracking-[0.08em] text-off-white">
          NUEVOS PRODUCTOS
        </h2>
        <div className="mt-6">
          <ProductGrid products={products.slice(0, 8)} />
        </div>
      </section>

      <SocialShelf />
    </div>
  );
}
