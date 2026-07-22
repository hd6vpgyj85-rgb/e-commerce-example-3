"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown } from "@/components/icons";
import type { Collection } from "@/lib/types";

export function NavBar({ collections }: { collections: Collection[] }) {
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const isHome = pathname === "/";
  const isProductos = pathname === "/productos";
  const isColeccion = pathname.startsWith("/coleccion");

  return (
    <nav className="neon-glow-line border-b border-white/5 bg-ink">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="hidden items-center gap-8 py-3 md:flex">
          <Link
            href="/"
            className={`font-display text-base tracking-[0.15em] transition-colors hover:text-neon ${
              isHome ? "text-neon" : "text-off-white"
            }`}
          >
            INICIO
          </Link>

          <div
            className="relative"
            onMouseEnter={() => setCollectionsOpen(true)}
            onMouseLeave={() => setCollectionsOpen(false)}
          >
            <button
              type="button"
              onClick={() => setCollectionsOpen((v) => !v)}
              aria-expanded={collectionsOpen}
              className={`flex items-center gap-1.5 font-display text-base tracking-[0.15em] transition-colors hover:text-neon ${
                isColeccion ? "text-neon" : "text-off-white"
              }`}
            >
              COLECCIONES
              <ChevronDown
                size={16}
                className={`transition-transform duration-300 ease-out ${
                  collectionsOpen ? "-rotate-180" : ""
                }`}
              />
            </button>

            <div
              className={`absolute left-1/2 top-full z-40 min-w-56 origin-top -translate-x-1/2 bg-panel py-2 transition-all duration-200 ease-out ${
                collectionsOpen
                  ? "pointer-events-auto translate-y-0 opacity-100"
                  : "pointer-events-none -translate-y-1 opacity-0"
              }`}
            >
              {collections.length === 0 ? (
                <p className="px-4 py-2 text-xs text-muted">
                  Aún no hay colecciones publicadas
                </p>
              ) : (
                collections.map((c) => (
                  <Link
                    key={c.id}
                    href={`/coleccion/${c.slug}`}
                    className={`block px-4 py-2 text-sm transition-colors hover:bg-panel-soft hover:text-neon ${
                      pathname === `/coleccion/${c.slug}`
                        ? "text-neon"
                        : "text-off-white"
                    }`}
                    onClick={() => setCollectionsOpen(false)}
                  >
                    {c.name}
                  </Link>
                ))
              )}
            </div>
          </div>

          <Link
            href="/productos"
            className={`font-display text-base tracking-[0.15em] transition-colors hover:text-neon ${
              isProductos ? "text-neon" : "text-off-white"
            }`}
          >
            TODOS LOS PRODUCTOS
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="flex w-full items-center justify-between py-4 font-display text-base tracking-[0.15em] text-off-white md:hidden"
          aria-expanded={mobileOpen}
        >
          MENÚ
          <ChevronDown
            size={18}
            className={`transition-transform duration-300 ease-out ${
              mobileOpen ? "-rotate-180" : ""
            }`}
          />
        </button>
      </div>

      <div
        className={`overflow-hidden bg-ink transition-[max-height] duration-300 ease-out md:hidden ${
          mobileOpen ? "max-h-[28rem]" : "max-h-0"
        }`}
      >
        <div className="flex flex-col gap-1 px-4 pb-4">
          <Link
            href="/"
            className={`py-2.5 font-display text-base tracking-[0.15em] ${
              isHome ? "text-neon" : "text-off-white"
            }`}
            onClick={() => setMobileOpen(false)}
          >
            INICIO
          </Link>
          <Link
            href="/productos"
            className={`py-2.5 font-display text-base tracking-[0.15em] ${
              isProductos ? "text-neon" : "text-off-white"
            }`}
            onClick={() => setMobileOpen(false)}
          >
            TODOS LOS PRODUCTOS
          </Link>
          <div className="flex w-full flex-col items-center">
            <p className="pt-3 font-display text-xs tracking-[0.15em] text-muted">
              COLECCIONES
            </p>
            <div className="flex w-fit flex-col items-start">
              {collections.length === 0 ? (
                <p className="py-1 text-xs text-muted">Aún no hay colecciones</p>
              ) : (
                collections.map((c) => (
                  <Link
                    key={c.id}
                    href={`/coleccion/${c.slug}`}
                    className={`py-2.5 pl-2 text-sm ${
                      pathname === `/coleccion/${c.slug}`
                        ? "text-neon"
                        : "text-off-white"
                    }`}
                    onClick={() => setMobileOpen(false)}
                  >
                    {c.name}
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
