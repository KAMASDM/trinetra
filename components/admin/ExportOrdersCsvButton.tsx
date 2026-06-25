"use client";

import type { Order } from "@/lib/types";

export default function ExportOrdersCsvButton({ orders }: { orders: Order[] }) {
  function handleExport() {
    const headers = ["Order ID", "Date", "Customer", "Email", "Phone", "Status", "Payment", "Total"];
    const rows = orders.map((order) => [
      order.id,
      new Date(order.createdAt).toISOString(),
      order.customer.name,
      order.customer.email,
      order.customer.phone,
      order.status,
      order.paymentStatus,
      String(order.total),
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `trinetra-orders-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button onClick={handleExport} className="btn-outline-gold !py-3 !px-5 text-xs">
      Export CSV
    </button>
  );
}
