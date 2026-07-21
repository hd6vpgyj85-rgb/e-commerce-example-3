"use client";

import { useEffect, useState } from "react";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";
import { Loader2 } from "@/components/icons";
import { formatPrice } from "@/lib/format";
import { getAllOrders } from "@/lib/orders";
import type { Order } from "@/lib/types";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getAllOrders()
      .catch(() => [])
      .then((data) => {
        if (active) {
          setOrders(data);
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div>
      <h1 className="font-display text-2xl tracking-[0.08em] text-off-white">
        PEDIDOS
      </h1>

      {loading ? (
        <Loader2 className="mt-8 animate-spin text-neon" size={24} />
      ) : orders.length === 0 ? (
        <p className="mt-8 text-sm text-muted">Aún no hay pedidos.</p>
      ) : (
        <ul className="mt-8 flex flex-col gap-4">
          {orders.map((order) => (
            <li key={order.id} className="flex flex-col gap-3 bg-panel p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs text-muted">
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleString("es-MX")
                    : ""}
                </span>
                <OrderStatusSelect orderId={order.id} status={order.status} />
              </div>

              <ul className="flex flex-col gap-1">
                {order.items.map((item, i) => (
                  <li key={i} className="text-sm text-off-white">
                    {item.name}
                    {Object.entries(item.variant).length > 0 && (
                      <span className="text-muted">
                        {" "}
                        (
                        {Object.entries(item.variant)
                          .map(([k, v]) => `${k}: ${v}`)
                          .join(", ")}
                        )
                      </span>
                    )}{" "}
                    x{item.qty} — {formatPrice(item.lineTotal)}
                  </li>
                ))}
              </ul>

              <div className="flex justify-end font-display text-sm tracking-[0.05em] text-neon">
                TOTAL: {formatPrice(order.total)}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
