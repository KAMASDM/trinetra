"use client";

import { useState } from "react";
import type { Order, OrderStatus } from "@/lib/types";

const STATUS_FLOW: OrderStatus[] = ["new", "confirmed", "packed", "shipped", "delivered", "cancelled", "returned"];

export default function OrderStatusForm({
  order,
  action,
}: {
  order: Order;
  action: (status: OrderStatus, note: string, trackingNumber: string, courier: string) => Promise<void>;
}) {
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    const form = new FormData(event.currentTarget);
    await action(
      form.get("status") as OrderStatus,
      String(form.get("note") ?? ""),
      String(form.get("trackingNumber") ?? ""),
      String(form.get("courier") ?? ""),
    );
    setPending(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label>
        <span className="admin-label">Status</span>
        <select name="status" defaultValue={order.status} className="admin-input">
          {STATUS_FLOW.map((status) => <option key={status} value={status}>{status}</option>)}
        </select>
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label>
          <span className="admin-label">Tracking number</span>
          <input name="trackingNumber" defaultValue={order.trackingNumber} className="admin-input" />
        </label>
        <label>
          <span className="admin-label">Courier</span>
          <input name="courier" defaultValue={order.courier} className="admin-input" />
        </label>
      </div>
      <label>
        <span className="admin-label">Note (visible internally)</span>
        <textarea name="note" rows={2} className="admin-input" />
      </label>
      <button type="submit" disabled={pending} className="btn-gold">
        {pending ? "Updating" : "Update Status"}
      </button>
    </form>
  );
}
