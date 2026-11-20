'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { fetchWithAuth } from '@/lib/api';
import { JobStatusBadge, PaymentStatusBadge } from '@/components/StatusBadge';
import JobTimeline from '@/components/JobTimeline';
import type { Booking } from '@/types';
import { toast } from 'sonner';
import {
  CreditCard,
  XCircle,
  Wrench,
  Star,
  Calendar,
  User,
  MapPin,
  Plus,
  Sparkles,
} from 'lucide-react';

type FilterTab = 'all' | 'active' | 'unpaid' | 'paid';

export default function CustomerBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  const [cancelTargetId, setCancelTargetId] = useState<string | null>(null);
  const [payingId, setPayingId] = useState<string | null>(null);

  const [reviewTarget, setReviewTarget] = useState<Booking | null>(null);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    let active = true;
    fetchWithAuth('/api/bookings/my')
      .then((data: unknown) => {
        if (active) setBookings(Array.isArray(data) ? (data as Booking[]) : []);
      })
      .catch((err: unknown) => {
        if (active) {
          toast.error(err instanceof Error ? err.message : 'Failed to load bookings');
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [refreshKey]);

  const handleConfirmCancel = async () => {
    if (!cancelTargetId) return;
    try {
      await fetchWithAuth(`/api/bookings/${cancelTargetId}/cancel`, { method: 'PATCH' });
      toast.success('Booking cancelled');
      setCancelTargetId(null);
      setRefreshKey((k) => k + 1);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to cancel');
    }
  };

  const handlePayNow = async (bookingId: string) => {
    setPayingId(bookingId);
    try {
      const data = (await fetchWithAuth('/api/payments/create-checkout-session', {
        method: 'POST',
        body: JSON.stringify({ bookingId }),
      })) as { url?: string };
      if (data.url) {
        window.location.assign(data.url);
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to start Stripe checkout');
      setPayingId(null);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewTarget) return;
    setSubmittingReview(true);
    try {
      await fetchWithAuth(`/api/bookings/${reviewTarget._id}/review`, {
        method: 'PATCH',
        body: JSON.stringify({ rating, review: reviewText }),
      });
      toast.success('Thank you for rating the service!');
      setReviewTarget(null);
      setReviewText('');
      setRefreshKey((k) => k + 1);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const counts = {
    all: bookings.length,
    active: bookings.filter((b) =>
      ['requested', 'accepted', 'in-progress'].includes(b.status)
    ).length,
    unpaid: bookings.filter(
      (b) => b.status === 'completed' && b.paymentStatus === 'unpaid'
    ).length,
    paid: bookings.filter((b) => b.paymentStatus === 'paid').length,
  };

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'active') {
      return ['requested', 'accepted', 'in-progress'].includes(b.status);
    }
    if (activeTab === 'unpaid') {
      return b.status === 'completed' && b.paymentStatus === 'unpaid';
    }
    if (activeTab === 'paid') {
      return b.paymentStatus === 'paid';
    }
    return true;
  });

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-36 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header + Book CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1
            style={{ fontFamily: 'var(--font-display)' }}
            className="text-2xl font-black text-slate-950 dark:text-white tracking-tight"
          >
            My Bookings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Track live repair milestones and settle completed invoices securely
          </p>
        </div>

        <Link
          href="/services"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-linear-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition w-fit"
        >
          <Plus className="w-4 h-4" />
          Book New Repair
        </Link>
      </div>

      {/* Quick Filter Tabs */}
      {bookings.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {(
            [
              { id: 'all', label: 'All Bookings', count: counts.all },
              { id: 'active', label: 'Active Jobs', count: counts.active },
              { id: 'unpaid', label: 'Ready to Pay', count: counts.unpaid },
              { id: 'paid', label: 'Paid & Closed', count: counts.paid },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                activeTab === tab.id
                  ? 'bg-slate-950 dark:bg-indigo-600 text-white border-slate-950 dark:border-indigo-500'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-indigo-400'
              }`}
            >
              <span>{tab.label}</span>
              <span
                style={{ fontFamily: 'var(--font-mono)' }}
                className={`px-1.5 py-0.5 rounded text-[10px] ${
                  activeTab === tab.id
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Empty State or Compact 2-Row Booking Cards */}
      {filteredBookings.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center shadow-3d-card">
          <Wrench className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2.5" />
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
            {bookings.length === 0
              ? 'No repair requests yet'
              : 'No bookings in this tab'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {bookings.length === 0
              ? 'Browse verified services and book your first repair.'
              : 'Switch tabs above to view your other repair requests.'}
          </p>
          {bookings.length === 0 && (
            <Link
              href="/services"
              className="inline-block mt-4 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700"
            >
              Browse Services
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredBookings.map((b) => {
            const isPayable = b.status === 'completed' && b.paymentStatus === 'unpaid';

            return (
              <div
                key={b._id}
                className={`bg-white dark:bg-slate-900 rounded-2xl border p-4 shadow-3d-card transition-all space-y-3 ${
                  isPayable
                    ? 'border-emerald-400/80 dark:border-emerald-500/50 ring-2 ring-emerald-500/10'
                    : 'border-slate-200/90 dark:border-slate-800 hover:border-indigo-300/70 dark:hover:border-slate-700'
                }`}
              >
                {/* ROW 1: Compact Multi-Column Info Strip */}
                <div className="flex flex-wrap lg:flex-nowrap items-center justify-between gap-4">
                  {/* Column 1: Image + Title + Tech/Date/Address */}
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    <Image
                      src={b.serviceImage}
                      alt={b.serviceTitle}
                      width={52}
                      height={52}
                      unoptimized
                      className="w-13 h-13 rounded-xl object-cover shrink-0 border border-slate-200/80 dark:border-slate-700"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/90 text-indigo-600 dark:text-cyan-400">
                          {b.category}
                        </span>
                        <span
                          style={{ fontFamily: 'var(--font-mono)' }}
                          className="text-[10px] text-slate-400"
                        >
                          #{b._id.slice(-6).toUpperCase()}
                        </span>
                      </div>

                      <h3
                        style={{ fontFamily: 'var(--font-display)' }}
                        className="text-base font-extrabold text-slate-950 dark:text-white truncate mt-0.5"
                      >
                        {b.serviceTitle}
                      </h3>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                        <span className="inline-flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                          <User className="w-3 h-3 text-indigo-500 dark:text-cyan-400" />
                          {b.technicianName}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {new Date(b.preferredDate).toLocaleDateString()}
                        </span>
                        <span className="inline-flex items-center gap-1 truncate max-w-[160px]">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{b.address}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Column 2: Price */}
                  <div className="shrink-0 text-left lg:text-right">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">
                      {b.status === 'completed' ? 'Final Fee' : 'Est. Fee'}
                    </span>
                    <span
                      style={{ fontFamily: 'var(--font-mono)' }}
                      className="text-lg font-black text-slate-950 dark:text-white"
                    >
                      ${b.finalAmount ?? b.basePrice}
                    </span>
                  </div>

                  {/* Column 3: Status & Payment Badges */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <JobStatusBadge status={b.status} />
                    <PaymentStatusBadge status={b.paymentStatus} />
                  </div>

                  {/* Column 4: Action Button */}
                  <div className="shrink-0">
                    {b.status === 'requested' && (
                      <button
                        onClick={() => setCancelTargetId(b._id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/80 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold transition"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Cancel
                      </button>
                    )}

                    {isPayable && (
                      <button
                        onClick={() => handlePayNow(b._id)}
                        disabled={payingId === b._id}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-extrabold shadow-md shadow-emerald-600/20 transition"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        {payingId === b._id ? 'Redirecting...' : 'Pay Now'}
                      </button>
                    )}

                    {b.paymentStatus === 'paid' && !b.rating && (
                      <button
                        onClick={() => {
                          setReviewTarget(b);
                          setRating(5);
                        }}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition"
                      >
                        <Star className="w-3.5 h-3.5 fill-white" />
                        Rate
                      </button>
                    )}

                    {b.rating && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/50 border border-amber-200/80 dark:border-amber-800/50 text-amber-700 dark:text-amber-300 text-xs font-bold">
                        <Sparkles className="w-3 h-3" />
                        {b.rating}/5
                      </span>
                    )}
                  </div>
                </div>

                {/* ROW 2: 1-Line Horizontal Timeline */}
                <JobTimeline booking={b} />
              </div>
            );
          })}
        </div>
      )}

      {/* Cancel Modal */}
      {cancelTargetId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-sm w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Cancel Repair Request?
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              Are you sure you want to cancel this booking? This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setCancelTargetId(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-sm font-semibold"
              >
                Keep Request
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Rate Your Repair Experience
            </h3>
            <p className="text-xs text-slate-500 mt-1">{reviewTarget.serviceTitle}</p>
            <form onSubmit={handleReviewSubmit} className="mt-4 space-y-4">
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-bold border ${
                      rating >= star
                        ? 'bg-amber-400 border-amber-400 text-slate-950'
                        : 'border-slate-300 dark:border-slate-700 text-slate-400'
                    }`}
                  >
                    ★ {star}
                  </button>
                ))}
              </div>
              <textarea
                rows={3}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your feedback about the technician..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-sm"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReviewTarget(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-bold"
                >
                  {submittingReview ? 'Saving...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}