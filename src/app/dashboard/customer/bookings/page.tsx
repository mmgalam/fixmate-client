'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchWithAuth } from '@/lib/api';
import { JobStatusBadge, PaymentStatusBadge } from '@/components/StatusBadge';
import type { Booking } from '@/types';
import { toast } from 'sonner';
import { CreditCard, XCircle, Wrench, AlertTriangle } from 'lucide-react';
import Image from 'next/image';

export default function CustomerBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Initial load inside useEffect (all setState calls happen asynchronously)
  useEffect(() => {
    let active = true;

    fetchWithAuth('/api/bookings/my')
      .then((data: unknown) => {
        if (active) {
          setBookings(Array.isArray(data) ? (data as Booking[]) : []);
        }
      })
      .catch((err: unknown) => {
        if (active) {
          const message =
            err instanceof Error ? err.message : 'Failed to load bookings';
          toast.error(message);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const refreshBookings = async () => {
    try {
      const data: unknown = await fetchWithAuth('/api/bookings/my');
      setBookings(Array.isArray(data) ? (data as Booking[]) : []);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to refresh bookings';
      toast.error(message);
    }
  };

  const handleConfirmCancel = async () => {
    if (!cancelTarget) return;
    setActionLoadingId(cancelTarget._id);
    try {
      await fetchWithAuth(`/api/bookings/${cancelTarget._id}/cancel`, {
        method: 'PATCH',
      });
      toast.success('Booking cancelled');
      setCancelTarget(null);
      await refreshBookings();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Could not cancel booking';
      toast.error(message);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handlePayNow = async (bookingId: string) => {
    setActionLoadingId(bookingId);
    try {
      const data = (await fetchWithAuth(
        '/api/payments/create-checkout-session',
        {
          method: 'POST',
          body: JSON.stringify({ bookingId }),
        }
      )) as { url?: string };

      if (data?.url) {
        window.location.assign(data.url);
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to initiate payment';
      toast.error(message);
      setActionLoadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="h-72 bg-white rounded-2xl border border-slate-200 animate-pulse" />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">My Bookings</h1>
        <p className="text-sm text-slate-500">
          Monitor job progress and pay once your technician completes the repair
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-14 text-center">
          <Wrench className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-900">No bookings yet</h3>
          <p className="text-sm text-slate-500 mt-1">
            Browse verified repair services to submit your first request.
          </p>
          <Link
            href="/services"
            className="inline-block mt-5 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700"
          >
            Browse Services
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase text-slate-500">
                <th className="py-3.5 px-4">Service</th>
                <th className="py-3.5 px-4">Technician</th>
                <th className="py-3.5 px-4">Preferred Date</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Job Status</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {bookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-slate-50/60">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <Image
                        src={booking.serviceImage}
                        alt={booking.serviceTitle}
                        className="w-12 h-12 rounded-lg object-cover shrink-0 bg-slate-100"
                      />
                      <div>
                        <p className="font-bold text-slate-900">
                          {booking.serviceTitle}
                        </p>
                        <p className="text-xs text-slate-500">
                          {booking.category}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-slate-700">
                    {booking.technicianName}
                  </td>
                  <td className="py-4 px-4 text-slate-600">
                    {new Date(booking.preferredDate).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-4 font-bold text-slate-900">
                    ${booking.finalAmount ?? booking.basePrice}
                  </td>
                  <td className="py-4 px-4">
                    <JobStatusBadge status={booking.status} />
                  </td>
                  <td className="py-4 px-4">
                    <PaymentStatusBadge status={booking.paymentStatus} />
                  </td>
                  <td className="py-4 px-4 text-right">
                    {booking.status === 'requested' && (
                      <button
                        onClick={() => setCancelTarget(booking)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold transition"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Cancel
                      </button>
                    )}

                    {booking.status === 'completed' &&
                      booking.paymentStatus === 'unpaid' && (
                        <button
                          onClick={() => handlePayNow(booking._id)}
                          disabled={actionLoadingId === booking._id}
                          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white text-xs font-semibold transition"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          {actionLoadingId === booking._id
                            ? 'Redirecting...'
                            : 'Pay Now'}
                        </button>
                      )}

                    {booking.status === 'completed' &&
                      booking.paymentStatus === 'paid' && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                          Paid
                        </span>
                      )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {cancelTarget && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center gap-3 text-red-600 mb-3">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-bold text-slate-900">
                Cancel Repair Request?
              </h3>
            </div>
            <p className="text-sm text-slate-600">
              Are you sure you want to cancel your request for{' '}
              <strong>{cancelTarget.serviceTitle}</strong>? This action cannot
              be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setCancelTarget(null)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-sm font-semibold text-slate-700"
              >
                Keep Request
              </button>
              <button
                onClick={handleConfirmCancel}
                disabled={actionLoadingId === cancelTarget._id}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold"
              >
                Yes, Cancel Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}