'use client';

import { useEffect, useState } from 'react';
import { fetchWithAuth } from '@/lib/api';
import type { Payment } from '@/types';
import { Receipt, Printer, CheckCircle2, X, Wrench } from 'lucide-react';

export default function CustomerPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<Payment | null>(null);

  useEffect(() => {
    let active = true;
    fetchWithAuth('/api/payments/my')
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
      <div className="h-64 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 animate-pulse" />
    );
  }

  const totalSpent = payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            style={{ fontFamily: 'var(--font-display)' }}
            className="text-2xl font-black text-slate-950 dark:text-white"
          >
            Payment History
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Verified Stripe transaction receipts for your completed repairs[cite: 8]
          </p>
        </div>

        {payments.length > 0 && (
          <div className="px-5 py-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/60">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block">
              Total Paid
            </span>
            <span
              style={{ fontFamily: 'var(--font-mono)' }}
              className="text-lg font-black text-emerald-700 dark:text-emerald-300"
            >
              ${totalSpent.toFixed(2)} USD
            </span>
          </div>
        )}
      </div>

      {payments.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-14 text-center shadow-3d-card">
          <Receipt className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No payments yet</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Completed Stripe payments will appear here automatically[cite: 8].
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-3d-card overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
                <th className="py-3.5 px-4">Service</th>
                <th className="py-3.5 px-4">Technician</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Transaction ID</th>
                <th className="py-3.5 px-4">Payment Date</th>
                <th className="py-3.5 px-4 text-right">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              {payments.map((payment) => (
                <tr key={payment._id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                  <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">
                    {payment.serviceTitle}
                  </td>
                  <td className="py-4 px-4 text-slate-700 dark:text-slate-300">
                    {payment.technicianName}
                  </td>
                  <td
                    style={{ fontFamily: 'var(--font-mono)' }}
                    className="py-4 px-4 font-extrabold text-emerald-600 dark:text-emerald-400"
                  >
                    ${Number(payment.amount).toFixed(2)}
                  </td>
                  <td className="py-4 px-4 font-mono text-xs text-slate-600 dark:text-slate-400">
                    {payment.transactionId}
                  </td>
                  <td className="py-4 px-4 text-slate-600 dark:text-slate-400">
                    {new Date(payment.paidAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedInvoice(payment)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-cyan-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-xs font-bold transition"
                    >
                      <Printer className="w-3.5 h-3.5" />
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
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                  <Wrench className="w-4 h-4" />
                </div>
                <span className="text-lg font-black">
                  Fix<span className="text-indigo-600">Mate</span>
                </span>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-5 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Official Repair Receipt
                </p>
                <p className="text-xs font-mono text-slate-600 mt-0.5">
                  #{selectedInvoice._id.slice(-8).toUpperCase()}
                </p>
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" /> PAID
              </span>
            </div>

            <div className="space-y-3 text-sm bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <div className="flex justify-between gap-2">
                <span className="text-slate-500">Service:</span>
                <span className="font-bold text-right">{selectedInvoice.serviceTitle}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-slate-500">Technician:</span>
                <span className="font-semibold">{selectedInvoice.technicianName}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-slate-500">Paid Date:</span>
                <span>{new Date(selectedInvoice.paidAt).toLocaleString()}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-slate-500">Stripe Txn ID:</span>
                <span className="font-mono text-xs truncate max-w-[180px]">
                  {selectedInvoice.transactionId}
                </span>
              </div>
              <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                <span className="font-bold text-slate-700">Total Paid</span>
                <span className="text-xl font-black font-mono text-emerald-600">
                  ${Number(selectedInvoice.amount).toFixed(2)} USD
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedInvoice(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md"
              >
                <Printer className="w-3.5 h-3.5" />
                Save / Print PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}