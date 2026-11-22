"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/api";
import type { Payment } from "@/types";
import { Receipt } from "lucide-react";

export default function AdminTransactionsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchWithAuth("/api/admin/payments")
      .then((data: unknown) => {
        if (active) setPayments(Array.isArray(data) ? (data as Payment[]) : []);
      })
      .catch(() => {
        if (active) setPayments([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="h-64 animate-pulse rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900" />
    );
  }

  const totalRevenue = payments.reduce(
    (sum, p) => sum + Number(p.amount || 0),
    0,
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1
            style={{ fontFamily: "var(--font-display)" }}
            className="text-2xl font-black text-slate-950 sm:text-3xl dark:text-white"
          >
            Transactions
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            All verified Stripe payments across FixMate
          </p>
        </div>

        <div className="w-fit rounded-2xl bg-linear-to-r from-emerald-600 to-teal-600 px-6 py-3.5 text-white shadow-lg shadow-emerald-600/20">
          <span className="block text-[11px] font-bold uppercase tracking-wider text-emerald-100">
            Total Platform Revenue
          </span>
          <span
            style={{ fontFamily: "var(--font-mono)" }}
            className="text-2xl font-black"
          >
            ${totalRevenue.toFixed(2)} USD
          </span>
        </div>
      </div>

      {payments.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-14 text-center shadow-3d-card dark:border-slate-800 dark:bg-slate-900">
          <Receipt className="mx-auto mb-3 h-12 w-12 text-slate-300 dark:text-slate-600" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            No transactions recorded yet
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Completed customer Stripe payments will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-3d-card dark:border-slate-800 dark:bg-slate-900">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-bold uppercase text-slate-500 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400">
                <th className="whitespace-nowrap px-4 py-3.5">Service</th>
                <th className="whitespace-nowrap px-4 py-3.5">Customer</th>
                <th className="whitespace-nowrap px-4 py-3.5">Technician</th>
                <th className="whitespace-nowrap px-4 py-3.5">Amount</th>
                <th className="whitespace-nowrap px-4 py-3.5">
                  Transaction ID
                </th>
                <th className="whitespace-nowrap px-4 py-3.5">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm dark:divide-slate-800">
              {payments.map((p) => (
                <tr
                  key={p._id}
                  className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40"
                >
                  <td className="whitespace-nowrap px-4 py-3.5 font-bold text-slate-900 dark:text-white">
                    {p.serviceTitle}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-slate-700 dark:text-slate-300">
                    {p.customerName}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-slate-700 dark:text-slate-300">
                    {p.technicianName}
                  </td>
                  <td
                    style={{ fontFamily: "var(--font-mono)" }}
                    className="whitespace-nowrap px-4 py-3.5 font-extrabold text-emerald-600 dark:text-emerald-400"
                  >
                    ${Number(p.amount).toFixed(2)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 font-mono text-xs text-slate-600 dark:text-slate-400">
                    {p.transactionId}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-slate-500 dark:text-slate-400">
                    {new Date(p.paidAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}