"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/api";
import { JobStatusBadge, PaymentStatusBadge } from "@/components/StatusBadge";
import type { Booking, BookingStatus } from "@/types";
import { toast } from "sonner";
import {
  Check,
  X,
  Play,
  CheckCircle2,
  AlertTriangle,
  Inbox,
} from "lucide-react";

const STATUS_TABS: { label: string; value: string }[] = [
  { label: "All", value: "all" },
  { label: "Requested", value: "requested" },
  { label: "Accepted", value: "accepted" },
  { label: "In Progress", value: "in-progress" },
  { label: "Completed", value: "completed" },
];

export default function TechnicianRequestsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");

  // Reject Confirmation Modal
  const [rejectTarget, setRejectTarget] = useState<Booking | null>(null);

  // Complete Job Modal (with Final Amount input)
  const [completeTarget, setCompleteTarget] = useState<Booking | null>(null);
  const [finalAmount, setFinalAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    fetchWithAuth("/api/bookings/technician")
      .then((data: unknown) => {
        if (active) {
          setBookings(Array.isArray(data) ? (data as Booking[]) : []);
        }
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
  }, []);

  const refreshRequests = async () => {
    const data: unknown = await fetchWithAuth("/api/bookings/technician");
    setBookings(Array.isArray(data) ? (data as Booking[]) : []);
  };

  const handleStatusUpdate = async (
    bookingId: string,
    nextStatus: BookingStatus,
    amount?: number,
  ) => {
    setSubmitting(true);
    try {
      await fetchWithAuth(`/api/bookings/${bookingId}/status`, {
        method: "PATCH",
        body: JSON.stringify({
          status: nextStatus,
          ...(amount !== undefined ? { finalAmount: amount } : {}),
        }),
      });
      toast.success(`Job marked as ${nextStatus}`);
      setRejectTarget(null);
      setCompleteTarget(null);
      await refreshRequests();
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update job status",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const openCompleteModal = (booking: Booking) => {
    setCompleteTarget(booking);
    setFinalAmount(String(booking.basePrice));
  };

  const handleCompleteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!completeTarget) return;

    const parsed = Number(finalAmount);
    if (!parsed || parsed <= 0) {
      toast.error("Please enter a valid final amount greater than 0.");
      return;
    }
    handleStatusUpdate(completeTarget._id, "completed", parsed);
  };

  const filteredBookings =
    filterStatus === "all"
      ? bookings
      : bookings.filter((b) => b.status === filterStatus);

  if (loading) {
    return (
      <div className="h-72 bg-white rounded-2xl border border-slate-200 animate-pulse" />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Manage Requests
          </h1>
          <p className="text-sm text-slate-500">
            Update job progress step by step and set the final invoice upon
            completion
          </p>
        </div>

        {/* Status Filter Pills */}
        <div className="flex flex-wrap gap-1.5 bg-white p-1.5 rounded-xl border border-slate-200">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilterStatus(tab.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                filterStatus === tab.value
                  ? "bg-blue-600 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-14 text-center">
          <Inbox className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-900">
            No requests found
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            There are no repair requests matching the selected status.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase text-slate-500">
                <th className="py-3.5 px-4">Service & Issue</th>
                <th className="py-3.5 px-4">Customer Details</th>
                <th className="py-3.5 px-4">Preferred Date</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredBookings.map((booking) => (
                <tr
                  key={booking._id}
                  className="hover:bg-slate-50/60 align-top"
                >
                  <td className="py-4 px-4 max-w-xs">
                    <p className="font-bold text-slate-900">
                      {booking.serviceTitle}
                    </p>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                      {booking.problemDescription}
                    </p>
                  </td>
                  <td className="py-4 px-4">
                    <p className="font-semibold text-slate-900">
                      {booking.customerName}
                    </p>
                    <p className="text-xs text-slate-500">
                      {booking.customerPhone}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {booking.address}
                    </p>
                  </td>
                  <td className="py-4 px-4 text-slate-600 whitespace-nowrap">
                    {new Date(booking.preferredDate).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-4 font-bold text-slate-900 whitespace-nowrap">
                    ${booking.finalAmount ?? booking.basePrice}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <JobStatusBadge status={booking.status} />
                  </td>
                  <td className="py-4 px-4 text-right whitespace-nowrap">
                    {booking.status === "requested" && (
                      <div className="inline-flex gap-2">
                        <button
                          onClick={() =>
                            handleStatusUpdate(booking._id, "accepted")
                          }
                          disabled={submitting}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Accept
                        </button>
                        <button
                          onClick={() => setRejectTarget(booking)}
                          disabled={submitting}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold"
                        >
                          <X className="w-3.5 h-3.5" />
                          Reject
                        </button>
                      </div>
                    )}

                    {booking.status === "accepted" && (
                      <button
                        onClick={() =>
                          handleStatusUpdate(booking._id, "in-progress")
                        }
                        disabled={submitting}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold"
                      >
                        <Play className="w-3.5 h-3.5" />
                        Start Work
                      </button>
                    )}

                    {booking.status === "in-progress" && (
                      <button
                        onClick={() => openCompleteModal(booking)}
                        disabled={submitting}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Mark Completed
                      </button>
                    )}

                    {booking.status === "completed" && (
                      <PaymentStatusBadge status={booking.paymentStatus} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Reject Confirmation Modal */}
      {rejectTarget && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center gap-3 text-red-600 mb-3">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-bold text-slate-900">
                Reject Repair Request?
              </h3>
            </div>
            <p className="text-sm text-slate-600">
              Are you sure you want to reject the request from{" "}
              <strong>{rejectTarget.customerName}</strong> for{" "}
              <strong>{rejectTarget.serviceTitle}</strong>?
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setRejectTarget(null)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-sm font-semibold text-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={() => handleStatusUpdate(rejectTarget._id, "rejected")}
                disabled={submitting}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold"
              >
                Yes, Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mark Completed + Final Amount Modal */}
      {completeTarget && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900">
              Complete Job & Set Final Amount
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Confirm the final repair charge for{" "}
              <strong>{completeTarget.serviceTitle}</strong>. The customer will
              pay this amount via Stripe.
            </p>

            <form onSubmit={handleCompleteSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Final Amount (USD) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  step="0.01"
                  value={finalAmount}
                  onChange={(e) => setFinalAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <span className="text-xs text-slate-400">
                  Pre-filled with starting base price ($
                  {completeTarget.basePrice})
                </span>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCompleteTarget(null)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-sm font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold"
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
