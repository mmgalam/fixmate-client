'use client';

import { useEffect, useState } from 'react';
import { fetchWithAuth } from '@/lib/api';
import { JobStatusBadge, PaymentStatusBadge } from '@/components/StatusBadge';
import type { Booking } from '@/types';
import { toast } from 'sonner';

export default function AdminAllBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    let active = true;
    fetchWithAuth('/api/admin/bookings')
      .then((data: unknown) => {
        if (active) setBookings(Array.isArray(data) ? (data as Booking[]) : []);
      })
      .catch((err: unknown) => {
        if (active) toast.error(err instanceof Error ? err.message : 'Failed to load bookings');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const filtered = filterStatus === 'all' ? bookings : bookings.filter((b) => b.status === filterStatus);

  if (loading) {
    return <div className="h-72 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 animate-pulse" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)' }} className="text-2xl font-black text-slate-950 dark:text-white">
            All Bookings
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Platform-wide overview of all repair requests and job statuses[cite: 2]
          </p>
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-sm bg-white dark:bg-slate-900 font-semibold w-fit"
        >
          <option value="all">All Statuses</option>
          <option value="requested">Requested</option>
          <option value="accepted">Accepted</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="rejected">Rejected</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-3d-card overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
              <th className="py-3.5 px-4">Service</th>
              <th className="py-3.5 px-4">Customer</th>
              <th className="py-3.5 px-4">Technician</th>
              <th className="py-3.5 px-4">Date</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Payment</th>
              <th className="py-3.5 px-4 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
            {filtered.map((booking) => (
              <tr key={booking._id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">{booking.serviceTitle}</td>
                <td className="py-4 px-4 text-slate-700 dark:text-slate-300">{booking.customerName}</td>
                <td className="py-4 px-4 text-slate-700 dark:text-slate-300">{booking.technicianName}</td>
                <td className="py-4 px-4 text-slate-600 dark:text-slate-400">{new Date(booking.preferredDate).toLocaleDateString()}</td>
                <td className="py-4 px-4"><JobStatusBadge status={booking.status} /></td>
                <td className="py-4 px-4"><PaymentStatusBadge status={booking.paymentStatus} /></td>
                <td style={{ fontFamily: 'var(--font-mono)' }} className="py-4 px-4 text-right font-extrabold text-slate-900 dark:text-white">
                  ${booking.finalAmount ?? booking.basePrice}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}