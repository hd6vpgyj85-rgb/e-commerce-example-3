"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Loader2 } from "@/components/icons";
import { getAllCollections } from "@/lib/collections";
import { getAllOrders } from "@/lib/orders";
import { getAllProducts } from "@/lib/products";

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({
    products: 0,
    collections: 0,
    pendingOrders: 0,
  });

  useEffect(() => {
    let active = true;
    Promise.all([
      getAllProducts().catch(() => []),
      getAllCollections().catch(() => []),
      getAllOrders().catch(() => []),
    ]).then(([products, collections, orders]) => {
      if (!active) return;
      setCounts({
        products: products.length,
        collections: collections.length,
        pendingOrders: orders.filter((o) => o.status === "pendiente").length,
      });
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const stats = [
    { label: "PRODUCTOS", value: counts.products, href: "/admin/productos" },
    { label: "COLECCIONES", value: counts.collections, href: "/admin/colecciones" },
    {
      label: "PEDIDOS PENDIENTES",
      value: counts.pendingOrders,
      href: "/admin/pedidos",
    },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl tracking-[0.08em] text-off-white">
        PANEL DE ADMINISTRACIÓN
      </h1>

      {loading ? (
        <Loader2 className="mt-8 animate-spin text-neon" size={24} />
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {stats.map((stat) => (
            <Link
              key={stat.label}
              href={stat.href}
              className="flex flex-col gap-2 bg-panel px-5 py-6 transition-colors hover:bg-panel-soft"
            >
              <span className="font-display text-4xl text-neon">{stat.value}</span>
              <span className="font-display text-xs tracking-[0.1em] text-muted">
                {stat.label}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
