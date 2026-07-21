import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SocialShelf } from "@/components/SocialShelf";
import { CartDrawer } from "@/components/CartDrawer";
import { CartProvider } from "@/context/CartContext";
import { getVisibleCollections } from "@/lib/collections";

export const dynamic = "force-dynamic";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const collections = await getVisibleCollections().catch(() => []);

  return (
    <CartProvider>
      <Header collections={collections} />
      <main className="flex-1">{children}</main>
      <SocialShelf />
      <Footer />
      <CartDrawer />
    </CartProvider>
  );
}
