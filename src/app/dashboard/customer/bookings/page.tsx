"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchWithAuth } from "@/lib/api";
import { JobStatusBadge, PaymentStatusBadge } from "@/components/StatusBadge";
import JobTimeline from "@/components/JobTimeline";
import type { Booking } from "@/types";
import { toast } from "sonner";
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
  X,
} from "lucide-react";

type FilterTab = "all" | "active" | "unpaid" | "paid";

export default function CustomerBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  const [cancelTargetId, setCancelTargetId] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [payingId, setPayingId] = useState<string | null>(null);

  const [reviewTarget, setReviewTarget] = useState<Booking | null>(null);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    let active = true;
    fetchWithAuth("/api/bookings/my")
      .then((data: unknown) => {
        if (active) setBookings(Array.isArray(data) ? (data as Booking[]) : []);
      })
      .catch((err: unknown) => {
        if (active) {
          toast.error(
            err instanceof Error ? err.message : "Failed to load bookings",
          );
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
    setCancelling(true);
    try {
      await fetchWithAuth(`/api/bookings/${cancelTargetId}/cancel`, {
        method: "PATCH",
      });
      toast.success("Booking cancelled");
      setCancelTargetId(null);
      setRefreshKey((k) => k + 1);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to cancel");
    } finally {
      setCancelling(false);
    }
  };

  const handlePayNow = async (bookingId: string) => {
    setPayingId(bookingId);
    try {
      const data = (await fetchWithAuth(
        "/api/payments/create-checkout-session",
        {
          method: "POST",
          body: JSON.stringify({ bookingId }),
        },
      )) as { url?: string };
      if (data.url) {
        window.location.assign(data.url);
      }
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Failed to start Stripe checkout",
      );
      setPayingId(null);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewTarget) return;
    setSubmittingReview(true);
    try {
      await fetchWithAuth(`/api/bookings/${reviewTarget._id}/review`, {
        method: "PATCH",
        body: JSON.stringify({ rating, review: reviewText.trim() }),
      });
      toast.success("Thank you for rating the service!");
      setReviewTarget(null);
      setReviewText("");
      setRefreshKey((k) => k + 1);
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Failed to submit review",
      );
    } finally {
      setSubmittingReview(false);
    }
  };

  const counts = {
    all: bookings.length,
    active: bookings.filter((b) =>
      ["requested", "accepted", "in-progress"].includes(b.status),
    ).length,
    unpaid: bookings.filter(
      (b) => b.status === "completed" && b.paymentStatus === "unpaid",
    ).length,
    paid: bookings.filter((b) => b.paymentStatus === "paid").length,
  };

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === "active") {
      return ["requested", "accepted", "in-progress"].includes(b.status);
    }
    if (activeTab === "unpaid") {
      return b.status === "completed" && b.paymentStatus === "unpaid";
    }
    if (activeTab === "paid") {
      return b.paymentStatus === "paid";
    }
    return true;
  });

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-36 animate-pulse rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header + Book CTA */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1
            style={{ fontFamily: "var(--font-display)" }}
            className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl dark:text-white"
          >
            My Bookings
          </h1>
          <p className="text-xs text-slate-500 sm:text-sm dark:text-slate-400">
            Track live repair milestones and settle completed invoices securely
          </p>
        </div>

        <Link
          href="/services"
          className="inline-flex w-fit items-center gap-1.5 rounded-xl bg-linear-to-r from-indigo-600 to-cyan-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/20 transition hover:from-indigo-700 hover:to-cyan-700"
        >
          <Plus className="h-4 w-4" />
          Book New Repair
        </Link>
      </div>

      {/* Quick Filter Tabs */}
      {bookings.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {(
            [
              { id: "all", label: "All Bookings", count: counts.all },
              { id: "active", label: "Active Jobs", count: counts.active },
              { id: "unpaid", label: "Ready to Pay", count: counts.unpaid },
              { id: "paid", label: "Paid & Closed", count: counts.paid },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? "border-slate-950 bg-slate-950 text-white dark:border-indigo-500 dark:bg-indigo-600"
                  : "border-slate-200 bg-white text-slate-600 hover:border-indigo-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
              }`}
            >
              <span>{tab.label}</span>
              <span
                style={{ fontFamily: "var(--font-mono)" }}
                className={`rounded px-1.5 py-0.5 text-[10px] ${
                  activeTab === tab.id
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
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
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-3d-card dark:border-slate-800 dark:bg-slate-900">
          <Wrench className="mx-auto mb-2.5 h-10 w-10 text-slate-300 dark:text-slate-600" />
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
            {bookings.length === 0
              ? "No repair requests yet"
              : "No bookings in this tab"}
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {bookings.length === 0
              ? "Browse verified services and book your first repair."
              : "Switch tabs above to view your other repair requests."}
          </p>
          {bookings.length === 0 && (
            <Link
              href="/services"
              className="mt-4 inline-block rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700"
            >
              Browse Services
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredBookings.map((b) => {
            const isPayable =
              b.status === "completed" && b.paymentStatus === "unpaid";

            return (
              <div
                key={b._id}
                className={`space-y-3 rounded-2xl border bg-white p-4 shadow-3d-card transition-all dark:bg-slate-900 ${
                  isPayable
                    ? "border-emerald-400/80 ring-2 ring-emerald-500/10 dark:border-emerald-500/50"
                    : "border-slate-200/90 hover:border-indigo-300/70 dark:border-slate-800 dark:hover:border-slate-700"
                }`}
              >
                {/* ROW 1: Compact Multi-Column Info Strip */}
                <div className="flex flex-wrap items-center justify-between gap-4 lg:flex-nowrap">
                  {/* Column 1: Image + Title + Tech/Date/Address */}
                  <div className="flex min-w-0 flex-1 items-center gap-3.5">
                    <Image
                      src={b.serviceImage}
                      alt={b.serviceTitle}
                      width={52}
                      height={52}
                      unoptimized
                      className="h-13 w-13 shrink-0 rounded-xl border border-slate-200/80 object-cover dark:border-slate-700"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-indigo-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:bg-indigo-950/90 dark:text-cyan-400">
                          {b.category}
                        </span>
                        <span
                          style={{ fontFamily: "var(--font-mono)" }}
                          className="text-[10px] text-slate-400"
                        >
                          #{b._id.slice(-6).toUpperCase()}
                        </span>
                      </div>

                      <h3
                        style={{ fontFamily: "var(--font-display)" }}
                        className="mt-0.5 truncate text-base font-extrabold text-slate-950 dark:text-white"
                      >
                        {b.serviceTitle}
                      </h3>

                      <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                        <span className="inline-flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                          <User className="h-3 w-3 text-indigo-500 dark:text-cyan-400" />
                          {b.technicianName}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-slate-400" />
                          {new Date(b.preferredDate).toLocaleDateString()}
                        </span>
                        <span className="inline-flex max-w-44 items-center gap-1 truncate">
                          <MapPin className="h-3 w-3 shrink-0 text-slate-400" />
                          <span className="truncate">{b.address}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Column 2: Price */}
                  <div className="shrink-0 text-left lg:text-right">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {b.status === "completed" ? "Final Fee" : "Est. Fee"}
                    </span>
                    <span
                      style={{ fontFamily: "var(--font-mono)" }}
                      className="text-lg font-black text-slate-950 dark:text-white"
                    >
                      ${b.finalAmount ?? b.basePrice}
                    </span>
                  </div>

                  {/* Column 3: Status & Payment Badges */}
                  <div className="flex shrink-0 items-center gap-1.5">
                    <JobStatusBadge status={b.status} />
                    <PaymentStatusBadge status={b.paymentStatus} />
                  </div>

                  {/* Column 4: Action Button */}
                  <div className="shrink-0">
                    {b.status === "requested" && (
                      <button
                        type="button"
                        onClick={() => setCancelTargetId(b._id)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 px-3 py-1.5 text-xs font-bold text-rose-600 transition hover:bg-rose-50 dark:border-rose-900/80 dark:text-rose-400 dark:hover:bg-rose-950/40"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        Cancel
                      </button>
                    )}

                    {isPayable && (
                      <button
                        type="button"
                        onClick={() => handlePayNow(b._id)}
                        disabled={payingId === b._id}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 px-4 py-2 text-xs font-extrabold text-white shadow-md shadow-emerald-600/20 transition hover:from-emerald-700 hover:to-teal-700 disabled:opacity-60"
                      >
                        <CreditCard className="h-3.5 w-3.5" />
                        {payingId === b._id ? "Redirecting..." : "Pay Now"}
                      </button>
                    )}

                    {b.paymentStatus === "paid" && !b.rating && (
                      <button
                        type="button"
                        onClick={() => {
                          setReviewTarget(b);
                          setRating(5);
                        }}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-3.5 py-1.5 text-xs font-bold text-white transition hover:bg-amber-600"
                      >
                        <Star className="h-3.5 w-3.5 fill-white" />
                        Rate
                      </button>
                    )}

                    {b.rating && (
                      <span className="inline-flex items-center gap-1 rounded-lg border border-amber-200/80 bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 dark:border-amber-800/50 dark:bg-amber-950/50 dark:text-amber-300">
                        <Sparkles className="h-3 w-3" />
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
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
        >
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Cancel Repair Request?
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Are you sure you want to cancel this booking? This action cannot be
              undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                disabled={cancelling}
                onClick={() => setCancelTargetId(null)}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Keep Request
              </button>
              <button
                type="button"
                disabled={cancelling}
                onClick={handleConfirmCancel}
                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-60"
              >
                {cancelling ? "Cancelling..." : "Yes, Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewTarget && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
        >
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Rate Your Repair Experience
                </h3>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  {reviewTarget.serviceTitle}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setReviewTarget(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="mt-4 space-y-4">
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`rounded-lg border px-3 py-1.5 text-sm font-bold transition ${
                      rating >= star
                        ? "border-amber-400 bg-amber-400 text-slate-950"
                        : "border-slate-300 text-slate-400 hover:border-amber-300 dark:border-slate-700"
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
                className="w-full rounded-xl border border-slate-300 bg-slate-50/70 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 dark:border-slate-700 dark:bg-slate-950/70 dark:text-white dark:placeholder:text-slate-500"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReviewTarget(null)}
                  className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-700 disabled:opacity-60"
                >
                  {submittingReview ? "Saving..." : "Submit Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}