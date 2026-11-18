"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/api";
import { JobStatusBadge, PaymentStatusBadge } from "@/components/StatusBadge";
import type { Booking } from "@/types";
import { toast } from "sonner";

export default function AdminAllBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    let active = true;
    fetchWithAuth("/api/admin/bookings")
      .then((data: unknown) => {
        if (active) {
          setBookings(Array.isArray(data) ? (data as Booking[]) : []);
        }
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
  }, []);

  const filtered =
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
            All Bookings
          </h1>
          <p className="text-sm text-slate-500">
            Platform-wide overview of all repair requests and job statuses
          </p>
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3.5 py-2 rounded-xl border border-slate-300 text-sm bg-white font-medium"
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

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase text-slate-500">
              <th className="py-3.5 px-4">Service</th>
              <th className="py-3.5 px-4">Customer</th>
              <th className="py-3.5 px-4">Technician</th>
              <th className="py-3.5 px-4">Date</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Payment</th>
              <th className="py-3.5 px-4 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {filtered.map((booking) => (
              <tr key={booking._id} className="hover:bg-slate-50/60">
                <td className="py-4 px-4 font-bold text-slate-900">
                  {booking.serviceTitle}
                </td>
                <td className="py-4 px-4 text-slate-700">
                  {booking.customerName}
                </td>
                <td className="py-4 px-4 text-slate-700">
                  {booking.technicianName}
                </td>
                <td className="py-4 px-4 text-slate-600">
                  {new Date(booking.preferredDate).toLocaleDateString()}
                </td>
                <td className="py-4 px-4">
                  <JobStatusBadge status={booking.status} />
                </td>
                <td className="py-4 px-4">
                  <PaymentStatusBadge status={booking.paymentStatus} />
                </td>
                <td className="py-4 px-4 text-right font-bold text-slate-900">
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
