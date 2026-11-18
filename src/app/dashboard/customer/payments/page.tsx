"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/api";
import type { Payment } from "@/types";
import { Receipt } from "lucide-react";

export default function CustomerPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    fetchWithAuth("/api/payments/my")
      .then((data: unknown) => {
        if (active) {
          setPayments(Array.isArray(data) ? (data as Payment[]) : []);
        }
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
      <div className="h-64 bg-white rounded-2xl border border-slate-200 animate-pulse" />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">
          Payment History
        </h1>
        <p className="text-sm text-slate-500">
          Receipts and Stripe transaction records for your completed repairs
        </p>
      </div>

      {payments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-14 text-center">
          <Receipt className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-900">No payments yet</h3>
          <p className="text-sm text-slate-500 mt-1">
            Completed Stripe payments will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase text-slate-500">
                <th className="py-3.5 px-4">Service</th>
                <th className="py-3.5 px-4">Technician</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Transaction ID</th>
                <th className="py-3.5 px-4">Payment Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {payments.map((payment) => (
                <tr key={payment._id} className="hover:bg-slate-50/60">
                  <td className="py-4 px-4 font-bold text-slate-900">
                    {payment.serviceTitle}
                  </td>
                  <td className="py-4 px-4 text-slate-700">
                    {payment.technicianName}
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
