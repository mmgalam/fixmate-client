'use client';

import { useEffect, useState } from 'react';
import { fetchWithAuth } from '@/lib/api';
import type { Payment } from '@/types';

export default function AdminTransactionsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchWithAuth('/api/admin/payments')
      .then((data: unknown) => {
        if (active) setPayments(Array.isArray(data) ? (data as Payment[]) : []);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return <div className="h-64 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 animate-pulse" />;
  }

  const totalRevenue = payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)' }} className="text-2xl font-black text-slate-950 dark:text-white">
            Transactions
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            All verified Stripe payments across FixMate[cite: 2]
          </p>
        </div>

        <div className="bg-linear-to-r from-emerald-600 to-teal-600 text-white px-6 py-3.5 rounded-2xl shadow-lg shadow-emerald-600/20">
          <span className="text-[11px] uppercase tracking-wider font-bold text-emerald-100 block">
            Total Platform Revenue[cite: 2]
          </span>
          <span style={{ fontFamily: 'var(--font-mono)' }} className="text-2xl font-black">
            ${totalRevenue.toFixed(2)} USD
          </span>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-3d-card overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
              <th className="py-3.5 px-4">Service</th>
              <th className="py-3.5 px-4">Customer</th>
              <th className="py-3.5 px-4">Technician</th>
              <th className="py-3.5 px-4">Amount</th>
              <th className="py-3.5 px-4">Transaction ID</th>
              <th className="py-3.5 px-4">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
            {payments.map((p) => (
              <tr key={p._id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">{p.serviceTitle}</td>
                <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">{p.customerName}</td>
                <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">{p.technicianName}</td>
                <td style={{ fontFamily: 'var(--font-mono)' }} className="py-3.5 px-4 font-extrabold text-emerald-600 dark:text-emerald-400">
                  ${Number(p.amount).toFixed(2)}
                </td>
                <td className="py-3.5 px-4 font-mono text-xs text-slate-600 dark:text-slate-400">{p.transactionId}</td>
                <td className="py-3.5 px-4 text-slate-500">{new Date(p.paidAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}