"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/api";
import { JobStatusBadge, PaymentStatusBadge } from "@/components/StatusBadge";
import type { Booking } from "@/types";
import { toast } from "sonner";
import { ClipboardList } from "lucide-react";

export default function AdminAllBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    let active = true;
    fetchWithAuth("/api/admin/bookings")
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
  }, []);

  const filtered =
    filterStatus === "all"
      ? bookings
      : bookings.filter((b) => b.status === filterStatus);

  if (loading) {
    return (
      <div className="h-72 animate-pulse rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900" />
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
            All Bookings
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Platform-wide overview of all repair requests and job statuses
          </p>
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          aria-label="Filter bookings by status"
          className="w-fit rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm font-semibold text-slate-800 focus:border-indigo-600 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
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

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-14 text-center shadow-3d-card dark:border-slate-800 dark:bg-slate-900">
          <ClipboardList className="mx-auto mb-3 h-12 w-12 text-slate-300 dark:text-slate-600" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            No bookings found
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {bookings.length === 0
              ? "Customer repair bookings will appear here once submitted."
              : "Try selecting a different job status filter above."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-3d-card dark:border-slate-800 dark:bg-slate-900">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-bold uppercase text-slate-500 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400">
                <th className="whitespace-nowrap px-4 py-3.5">Service</th>
                <th className="whitespace-nowrap px-4 py-3.5">Customer</th>
                <th className="whitespace-nowrap px-4 py-3.5">Technician</th>
                <th className="whitespace-nowrap px-4 py-3.5">Date</th>
                <th className="whitespace-nowrap px-4 py-3.5">Status</th>
                <th className="whitespace-nowrap px-4 py-3.5">Payment</th>
                <th className="whitespace-nowrap px-4 py-3.5 text-right">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm dark:divide-slate-800">
              {filtered.map((booking) => (
                <tr
                  key={booking._id}
                  className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40"
                >
                  <td className="whitespace-nowrap px-4 py-4 font-bold text-slate-900 dark:text-white">
                    {booking.serviceTitle}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-slate-700 dark:text-slate-300">
                    {booking.customerName}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-slate-700 dark:text-slate-300">
                    {booking.technicianName}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-slate-600 dark:text-slate-400">
                    {new Date(booking.preferredDate).toLocaleDateString()}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4">
                    <JobStatusBadge status={booking.status} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-4">
                    <PaymentStatusBadge status={booking.paymentStatus} />
                  </td>
                  <td
                    style={{ fontFamily: "var(--font-mono)" }}
                    className="whitespace-nowrap px-4 py-4 text-right font-extrabold text-slate-900 dark:text-white"
                  >
                    ${booking.finalAmount ?? booking.basePrice}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}