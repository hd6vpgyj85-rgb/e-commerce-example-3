"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { siteConfig } from "@/lib/site-config";

const links = [
  { href: "/admin", label: "PANEL" },
  { href: "/admin/productos", label: "PRODUCTOS" },
  { href: "/admin/colecciones", label: "COLECCIONES" },
  { href: "/admin/pedidos", label: "PEDIDOS" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  async function handleLogout() {
    await logout();
    router.replace("/admin/login");
  }

  return (
    <aside className="flex w-full shrink-0 flex-col gap-1 border-b-2 border-white/5 bg-panel px-4 py-4 sm:w-56 sm:border-b-0 sm:border-r sm:px-3 sm:py-6">
      <p className="mb-4 px-2 font-display text-lg tracking-[0.15em] text-neon">
        {siteConfig.name}
      </p>
      <nav className="flex flex-row flex-wrap gap-1 sm:flex-col">
        {links.map((link) => {
          const active =
            link.href === "/admin"
              ? pathname === "/admin"
              : pathname?.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-2 font-display text-xs tracking-[0.1em] transition-colors ${
                active ? "bg-neon text-ink" : "text-off-white hover:text-neon"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
      <button
        type="button"
        onClick={handleLogout}
        className="mt-auto px-3 py-2 text-left font-display text-xs tracking-[0.1em] text-muted transition-colors hover:text-neon"
      >
        CERRAR SESIÓN
      </button>
    </aside>
  );
}
