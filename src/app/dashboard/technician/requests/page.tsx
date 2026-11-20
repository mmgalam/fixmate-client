'use client';

import { useEffect, useState } from 'react';
import { fetchWithAuth } from '@/lib/api';
import { JobStatusBadge, PaymentStatusBadge } from '@/components/StatusBadge';
import type { Booking, BookingStatus } from '@/types';
import { toast } from 'sonner';
import { Check, X, Play, CheckCircle2 } from 'lucide-react';

export default function TechnicianRequestsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [filterStatus, setFilterStatus] = useState('all');

  const [rejectTarget, setRejectTarget] = useState<Booking | null>(null);
  const [completeTarget, setCompleteTarget] = useState<Booking | null>(null);
  const [finalAmount, setFinalAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    fetchWithAuth('/api/bookings/technician')
      .then((data: unknown) => {
        if (active) setBookings(Array.isArray(data) ? (data as Booking[]) : []);
      })
      .catch((err: unknown) => {
        if (active) {
          toast.error(err instanceof Error ? err.message : 'Failed to load requests');
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [refreshKey]);

  const handleStatusUpdate = async (id: string, status: BookingStatus, amount?: number) => {
    setSubmitting(true);
    try {
      await fetchWithAuth(`/api/bookings/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, ...(amount !== undefined ? { finalAmount: amount } : {}) }),
      });
      toast.success(`Job marked as ${status}`);
      setRejectTarget(null);
      setCompleteTarget(null);
      setRefreshKey((k) => k + 1);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = filterStatus === 'all' ? bookings : bookings.filter((b) => b.status === filterStatus);

  if (loading) {
    return <div className="h-64 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 animate-pulse" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)' }} className="text-2xl font-black text-slate-950 dark:text-white">
            Manage Requests
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Update job progress step by step and set the final invoice upon completion[cite: 2]
          </p>
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-semibold w-fit"
        >
          <option value="all">All Statuses</option>
          <option value="requested">Requested</option>
          <option value="accepted">Accepted</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-3d-card overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
              <th className="py-3.5 px-4">Service & Issue</th>
              <th className="py-3.5 px-4">Customer</th>
              <th className="py-3.5 px-4">Date</th>
              <th className="py-3.5 px-4">Amount</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
            {filtered.map((b) => (
              <tr key={b._id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 align-top">
                <td className="py-4 px-4 max-w-xs">
                  <p className="font-bold text-slate-900 dark:text-white">{b.serviceTitle}</p>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{b.problemDescription}</p>
                </td>
                <td className="py-4 px-4">
                  <p className="font-semibold text-slate-900 dark:text-white">{b.customerName}</p>
                  <p className="text-xs text-slate-500">{b.customerPhone}</p>
                  <p className="text-xs text-slate-400">{b.address}</p>
                </td>
                <td className="py-4 px-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                  {new Date(b.preferredDate).toLocaleDateString()}
                </td>
                <td style={{ fontFamily: 'var(--font-mono)' }} className="py-4 px-4 font-extrabold text-slate-900 dark:text-white">
                  ${b.finalAmount ?? b.basePrice}
                </td>
                <td className="py-4 px-4">
                  <JobStatusBadge status={b.status} />
                </td>
                <td className="py-4 px-4 text-right whitespace-nowrap">
                  {b.status === 'requested' && (
                    <div className="inline-flex gap-2">
                      <button
                        onClick={() => handleStatusUpdate(b._id, 'accepted')}
                        disabled={submitting}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold"
                      >
                        <Check className="w-3.5 h-3.5" /> Accept
                      </button>
                      <button
                        onClick={() => setRejectTarget(b)}
                        disabled={submitting}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-xs font-bold"
                      >
                        <X className="w-3.5 h-3.5" /> Reject
                      </button>
                    </div>
                  )}

                  {b.status === 'accepted' && (
                    <button
                      onClick={() => handleStatusUpdate(b._id, 'in-progress')}
                      disabled={submitting}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 text-white text-xs font-bold"
                    >
                      <Play className="w-3.5 h-3.5" /> Start Work
                    </button>
                  )}

                  {b.status === 'in-progress' && (
                    <button
                      onClick={() => {
                        setCompleteTarget(b);
                        setFinalAmount(String(b.basePrice));
                      }}
                      disabled={submitting}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Mark Completed
                    </button>
                  )}

                  {b.status === 'completed' && <PaymentStatusBadge status={b.paymentStatus} />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Reject Modal */}
      {rejectTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-sm w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Reject Repair Request?</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              Reject request from <strong>{rejectTarget.customerName}</strong>?
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setRejectTarget(null)} className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-sm font-semibold">
                Cancel
              </button>
              <button onClick={() => handleStatusUpdate(rejectTarget._id, 'rejected')} className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-bold">
                Yes, Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Complete Job Modal */}
      {completeTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Complete Job & Set Final Amount</h3>
            <p className="text-xs text-slate-500 mt-1">
              Pre-filled with base price (${completeTarget.basePrice}). Customer will pay this amount via Stripe[cite: 2].
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleStatusUpdate(completeTarget._id, 'completed', Number(finalAmount));
              }}
              className="mt-4 space-y-4"
            >
              <input
                type="number"
                required
                min="1"
                step="0.01"
                value={finalAmount}
                onChange={(e) => setFinalAmount(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-sm font-bold"
              />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setCompleteTarget(null)} className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-sm font-semibold">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-sm font-bold">
                  Confirm & Complete
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}