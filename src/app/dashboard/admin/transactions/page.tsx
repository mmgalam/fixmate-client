"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/api";
import type { Payment } from "@/types";
import { DollarSign, Receipt } from "lucide-react";
import { toast } from "sonner";

export default function AdminTransactionsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchWithAuth("/api/admin/payments")
      .then((data: unknown) => {
        if (active) {
          setPayments(Array.isArray(data) ? (data as Payment[]) : []);
        }
      })
      .catch((err: unknown) => {
        if (active) {
          toast.error(
            err instanceof Error ? err.message : "Failed to load transactions",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const totalRevenue = payments.reduce(
    (sum, p) => sum + Number(p.amount || 0),
    0,
  );

  if (loading) {
    return (
      <div className="h-72 bg-white rounded-2xl border border-slate-200 animate-pulse" />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Transactions
          </h1>
          <p className="text-sm text-slate-500">
            All completed Stripe payments processed through FixMate
          </p>
        </div>

        {/* Total Revenue Banner Card */}
        <div className="bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-100">
              Total Revenue
            </p>
            <p className="text-2xl font-extrabold">
              ${totalRevenue.toFixed(2)} USD
            </p>
          </div>
        </div>
      </div>

      {payments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-14 text-center">
          <Receipt className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-900">
            No transactions yet
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Completed customer payments will appear here.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase text-slate-500">
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Technician</th>
                <th className="py-3.5 px-4">Service</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Transaction ID</th>
                <th className="py-3.5 px-4">Payment Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {payments.map((payment) => (
                <tr key={payment._id} className="hover:bg-slate-50/60">
                  <td className="py-4 px-4">
                    <p className="font-semibold text-slate-900">
                      {payment.customerName}
                    </p>
                    <p className="text-xs text-slate-500">
                      {payment.customerEmail}
                    </p>
                  </td>
                  <td className="py-4 px-4 text-slate-700">
                    {payment.technicianName}
                  </td>
                  <td className="py-4 px-4 font-medium text-slate-900">
                    {payment.serviceTitle}
                  </td>
                  <td className="py-4 px-4 font-bold text-emerald-600">
                    ${Number(payment.amount).toFixed(2)}
                  </td>
                  <td className="py-4 px-4 font-mono text-xs text-slate-600">
                    {payment.transactionId}
                  </td>
                  <td className="py-4 px-4 text-slate-600">
                    {new Date(payment.paidAt).toLocaleDateString()}
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
