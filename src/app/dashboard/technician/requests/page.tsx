"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/api";
import { JobStatusBadge, PaymentStatusBadge } from "@/components/StatusBadge";
import type { Booking, BookingStatus } from "@/types";
import { toast } from "sonner";
import { Check, X, Play, CheckCircle2, Inbox } from "lucide-react";

export default function TechnicianRequestsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [filterStatus, setFilterStatus] = useState("all");

  const [rejectTarget, setRejectTarget] = useState<Booking | null>(null);
  const [completeTarget, setCompleteTarget] = useState<Booking | null>(null);
  const [finalAmount, setFinalAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    fetchWithAuth("/api/bookings/technician")
      .then((data: unknown) => {
        if (active) setBookings(Array.isArray(data) ? (data as Booking[]) : []);
      })
      .catch((err: unknown) => {
        if (active) {
          toast.error(
            err instanceof Error ? err.message : "Failed to load requests",
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

  const handleStatusUpdate = async (
    id: string,
    status: BookingStatus,
    amount?: number,
  ) => {
    if (amount !== undefined && (!Number.isFinite(amount) || amount <= 0)) {
      toast.error("Final amount must be greater than $0");
      return;
    }

    setSubmitting(true);
    try {
      await fetchWithAuth(`/api/bookings/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({
          status,
          ...(amount !== undefined ? { finalAmount: amount } : {}),
        }),
      });
      toast.success(`Job marked as ${status}`);
      setRejectTarget(null);
      setCompleteTarget(null);
      setRefreshKey((k) => k + 1);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSubmitting(false);
    }
  };

  const filtered =
    filterStatus === "all"
      ? bookings
      : bookings.filter((b) => b.status === filterStatus);

  if (loading) {
    return (
      <div className="h-64 animate-pulse rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900" />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1
            style={{ fontFamily: "var(--font-display)" }}
            className="text-2xl font-black text-slate-950 sm:text-3xl dark:text-white"
          >
            Manage Requests
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Update job progress step by step and set the final invoice upon
            completion
          </p>
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          aria-label="Filter requests by status"
          className="w-fit rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm font-semibold text-slate-800 focus:border-indigo-600 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
        >
          <option value="all">All Statuses</option>
          <option value="requested">Requested</option>
          <option value="accepted">Accepted</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-14 text-center shadow-3d-card dark:border-slate-800 dark:bg-slate-900">
          <Inbox className="mx-auto mb-3 h-12 w-12 text-slate-300 dark:text-slate-600" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {bookings.length === 0
              ? "No incoming repair requests yet"
              : "No requests match this status"}
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {bookings.length === 0
              ? "Once customers book your approved services, their requests will appear here."
              : "Switch the status filter above to view other repair jobs."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-3d-card dark:border-slate-800 dark:bg-slate-900">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-bold uppercase text-slate-500 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400">
                <th className="whitespace-nowrap px-4 py-3.5">
                  Service &amp; Issue
                </th>
                <th className="whitespace-nowrap px-4 py-3.5">Customer</th>
                <th className="whitespace-nowrap px-4 py-3.5">Date</th>
                <th className="whitespace-nowrap px-4 py-3.5">Amount</th>
                <th className="whitespace-nowrap px-4 py-3.5">Status</th>
                <th className="whitespace-nowrap px-4 py-3.5 text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm dark:divide-slate-800">
              {filtered.map((b) => (
                <tr
                  key={b._id}
                  className="align-top hover:bg-slate-50/60 dark:hover:bg-slate-800/40"
                >
                  <td className="max-w-xs px-4 py-4">
                    <p className="font-bold text-slate-900 dark:text-white">
                      {b.serviceTitle}
                    </p>
                    <p className="mt-1 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
                      {b.problemDescription}
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {b.customerName}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {b.customerPhone}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      {b.address}
                    </p>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-slate-600 dark:text-slate-400">
                    {new Date(b.preferredDate).toLocaleDateString()}
                  </td>
                  <td
                    style={{ fontFamily: "var(--font-mono)" }}
                    className="whitespace-nowrap px-4 py-4 font-extrabold text-slate-900 dark:text-white"
                  >
                    ${b.finalAmount ?? b.basePrice}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4">
                    <JobStatusBadge status={b.status} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-right">
                    {b.status === "requested" && (
                      <div className="inline-flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleStatusUpdate(b._id, "accepted")}
                          disabled={submitting}
                          className="inline-flex items-center gap-1 rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-700 disabled:opacity-60"
                        >
                          <Check className="h-3.5 w-3.5" /> Accept
                        </button>
                        <button
                          type="button"
                          onClick={() => setRejectTarget(b)}
                          disabled={submitting}
                          className="inline-flex items-center gap-1 rounded-xl border border-red-200 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/40"
                        >
                          <X className="h-3.5 w-3.5" /> Reject
                        </button>
                      </div>
                    )}

                    {b.status === "accepted" && (
                      <button
                        type="button"
                        onClick={() => handleStatusUpdate(b._id, "in-progress")}
                        disabled={submitting}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-amber-600 disabled:opacity-60"
                      >
                        <Play className="h-3.5 w-3.5" /> Start Work
                      </button>
                    )}

                    {b.status === "in-progress" && (
                      <button
                        type="button"
                        onClick={() => {
                          setCompleteTarget(b);
                          setFinalAmount(String(b.basePrice));
                        }}
                        disabled={submitting}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-60"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" /> Mark Completed
                      </button>
                    )}

                    {b.status === "completed" && (
                      <PaymentStatusBadge status={b.paymentStatus} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Reject Modal */}
      {rejectTarget && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
        >
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Reject Repair Request?
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Reject request from <strong>{rejectTarget.customerName}</strong>?
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                disabled={submitting}
                onClick={() => setRejectTarget(null)}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={() => handleStatusUpdate(rejectTarget._id, "rejected")}
                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-60"
              >
                {submitting ? "Rejecting..." : "Yes, Reject"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Complete Job Modal */}
      {completeTarget && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
        >
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Complete Job &amp; Set Final Amount
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Pre-filled with base price (${completeTarget.basePrice}). Customer
              will pay this amount via Stripe.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleStatusUpdate(
                  completeTarget._id,
                  "completed",
                  Number(finalAmount),
                );
              }}
              className="mt-4 space-y-4"
            >
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-600 dark:text-slate-400">
                  Final Amount (USD) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  step="0.01"
                  value={finalAmount}
                  onChange={(e) => setFinalAmount(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50/70 px-3.5 py-2.5 text-sm font-bold text-slate-900 focus:border-emerald-600 focus:outline-none dark:border-slate-700 dark:bg-slate-950/70 dark:text-white"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => setCompleteTarget(null)}
                  className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-emerald-600 px-5 py-2 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-60"
                >
                  {submitting ? "Completing..." : "Confirm & Complete"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
