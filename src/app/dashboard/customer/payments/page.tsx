"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/api";
import type { Payment } from "@/types";
import { Receipt, Printer, CheckCircle2, X, Wrench } from "lucide-react";

export default function CustomerPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<Payment | null>(null);

  useEffect(() => {
    let active = true;
    fetchWithAuth("/api/payments/my")
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

  const totalSpent = payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1
            style={{ fontFamily: "var(--font-display)" }}
            className="text-2xl font-black text-slate-950 sm:text-3xl dark:text-white"
          >
            Payment History
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Verified Stripe transaction receipts for your completed repairs
          </p>
        </div>

        {payments.length > 0 && (
          <div className="w-fit rounded-2xl border border-emerald-200/80 bg-emerald-50 px-5 py-2.5 dark:border-emerald-800/60 dark:bg-emerald-950/60">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Total Paid
            </span>
            <span
              style={{ fontFamily: "var(--font-mono)" }}
              className="text-lg font-black text-emerald-700 dark:text-emerald-300"
            >
              ${totalSpent.toFixed(2)} USD
            </span>
          </div>
        )}
      </div>

      {payments.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-14 text-center shadow-3d-card dark:border-slate-800 dark:bg-slate-900">
          <Receipt className="mx-auto mb-3 h-12 w-12 text-slate-300 dark:text-slate-600" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            No payments yet
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Completed Stripe payments will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-3d-card dark:border-slate-800 dark:bg-slate-900">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-bold uppercase text-slate-500 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400">
                <th className="whitespace-nowrap px-4 py-3.5">Service</th>
                <th className="whitespace-nowrap px-4 py-3.5">Technician</th>
                <th className="whitespace-nowrap px-4 py-3.5">Amount</th>
                <th className="whitespace-nowrap px-4 py-3.5">
                  Transaction ID
                </th>
                <th className="whitespace-nowrap px-4 py-3.5">Payment Date</th>
                <th className="whitespace-nowrap px-4 py-3.5 text-right">
                  Invoice
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm dark:divide-slate-800">
              {payments.map((payment) => (
                <tr
                  key={payment._id}
                  className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40"
                >
                  <td className="whitespace-nowrap px-4 py-4 font-bold text-slate-900 dark:text-white">
                    {payment.serviceTitle}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-slate-700 dark:text-slate-300">
                    {payment.technicianName}
                  </td>
                  <td
                    style={{ fontFamily: "var(--font-mono)" }}
                    className="whitespace-nowrap px-4 py-4 font-extrabold text-emerald-600 dark:text-emerald-400"
                  >
                    ${Number(payment.amount).toFixed(2)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 font-mono text-xs text-slate-600 dark:text-slate-400">
                    {payment.transactionId}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-slate-600 dark:text-slate-400">
                    {new Date(payment.paidAt).toLocaleDateString()}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedInvoice(payment)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-600 transition hover:bg-indigo-100 dark:bg-indigo-950/80 dark:text-cyan-400 dark:hover:bg-indigo-900/60"
                    >
                      <Printer className="h-3.5 w-3.5" />
                      Receipt / PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Printable PDF Invoice Modal */}
      {selectedInvoice && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-xs print:bg-white print:p-0"
        >
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 text-slate-900 shadow-2xl sm:p-8 print:border-none print:shadow-none">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
                  <Wrench className="h-4 w-4" />
                </div>
                <span className="text-lg font-black">
                  Fix<span className="text-indigo-600">Mate</span>
                </span>
              </div>
              <button
                type="button"
                aria-label="Close receipt"
                onClick={() => setSelectedInvoice(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 print:hidden"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="my-5 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Official Repair Receipt
                </p>
                <p className="mt-0.5 font-mono text-xs text-slate-600">
                  #{selectedInvoice._id.slice(-8).toUpperCase()}
                </p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5" /> PAID
              </span>
            </div>

            <div className="space-y-3 rounded-2xl border border-slate-200/80 bg-slate-50 p-4 text-sm">
              <div className="flex justify-between gap-2">
                <span className="text-slate-500">Service:</span>
                <span className="text-right font-bold">
                  {selectedInvoice.serviceTitle}
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-slate-500">Technician:</span>
                <span className="font-semibold">
                  {selectedInvoice.technicianName}
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-slate-500">Paid Date:</span>
                <span>{new Date(selectedInvoice.paidAt).toLocaleString()}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-slate-500">Stripe Txn ID:</span>
                <span className="max-w-45 truncate font-mono text-xs">
                  {selectedInvoice.transactionId}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-200 pt-3">
                <span className="font-bold text-slate-700">Total Paid</span>
                <span className="font-mono text-xl font-black text-emerald-600">
                  ${Number(selectedInvoice.amount).toFixed(2)} USD
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 print:hidden">
              <button
                type="button"
                onClick={() => setSelectedInvoice(null)}
                className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-indigo-700"
              >
                <Printer className="h-3.5 w-3.5" />
                Save / Print PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}