"use client";

import { useState } from "react";
import { updateOrderStatus } from "@/lib/orders";
import type { OrderStatus } from "@/lib/types";

const options: OrderStatus[] = ["pendiente", "contactado", "completado"];

export function OrderStatusSelect({
  orderId,
  status,
}: {
  orderId: string;
  status: OrderStatus;
}) {
  const [value, setValue] = useState(status);
  const [saving, setSaving] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value as OrderStatus;
    setValue(next);
    setSaving(true);
    try {
      await updateOrderStatus(orderId, next);
    } finally {
      setSaving(false);
    }
  }

  return (
    <select
      value={value}
      onChange={handleChange}
      disabled={saving}
      className="border-2 border-white/10 bg-panel px-2 py-1 text-xs uppercase tracking-[0.05em] text-off-white outline-none focus:border-neon"
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}
