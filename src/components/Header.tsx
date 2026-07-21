import Image from "next/image";
import Link from "next/link";
import { CartButton } from "@/components/CartButton";
import { NavBar } from "@/components/NavBar";
import { siteConfig } from "@/lib/site-config";
import type { Collection } from "@/lib/types";

export function Header({ collections }: { collections: Collection[] }) {
  return (
    <header className="sticky top-0 z-50 bg-ink">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo-duck.png"
            alt=""
            width={40}
            height={40}
            className="h-9 w-9 object-contain"
            priority
          />
          <span className="font-display text-2xl tracking-[0.2em] text-neon">
            {siteConfig.name}
          </span>
        </Link>
        <CartButton />
      </div>
      <NavBar collections={collections} />
    </header>
  );
}
