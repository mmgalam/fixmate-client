"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchWithAuth } from "@/lib/api";
import StatsCard from "@/components/StatsCard";
import { JobStatusBadge } from "@/components/StatusBadge";
import type { Booking } from "@/types";
import {
  ClipboardList,
  Wrench,
  CheckCircle2,
  ArrowRight,
  Plus,
  Sparkles,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function CustomerOverviewPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchWithAuth("/api/bookings/my")
      .then((data: unknown) => {
        if (active) setBookings(Array.isArray(data) ? (data as Booking[]) : []);
      })
      .catch(() => {
        if (active) setBookings([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const totalRequests = bookings.length;
  const activeJobs = bookings.filter((b) =>
    ["requested", "accepted", "in-progress"].includes(b.status),
  ).length;
  const completedJobs = bookings.filter((b) => b.status === "completed").length;

  const chartData = [
    {
      name: "Requested",
      count: bookings.filter((b) => b.status === "requested").length,
    },
    {
      name: "Accepted",
      count: bookings.filter((b) => b.status === "accepted").length,
    },
    {
      name: "In Progress",
      count: bookings.filter((b) => b.status === "in-progress").length,
    },
    { name: "Completed", count: completedJobs },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-36 animate-pulse rounded-3xl bg-slate-900" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
            />
          ))}
        </div>
        <div className="h-72 animate-pulse rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Executive Greeting Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950 p-6 text-white shadow-xl sm:p-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-indigo-600/25 blur-3xl"
        />
        <div className="relative z-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <span
              style={{ fontFamily: "var(--font-mono)" }}
              className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-cyan-400"
            >
              <Sparkles className="h-3.5 w-3.5" />
              CUSTOMER COMMAND CENTER
            </span>
            <h1
              style={{ fontFamily: "var(--font-display)" }}
              className="mt-1 text-2xl font-black sm:text-3xl"
            >
              Customer Overview
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Track live repair milestones and settle completed invoices safely.
            </p>
          </div>

          <Link
            href="/services"
            className="inline-flex w-fit items-center gap-2 rounded-xl bg-linear-to-r from-indigo-600 to-cyan-600 px-5 py-3 text-xs font-extrabold text-white shadow-lg shadow-indigo-600/30 transition hover:from-indigo-700 hover:to-cyan-700"
          >
            <Plus className="h-4 w-4" />
            Book New Repair
          </Link>
        </div>
      </div>

      {/* 3D Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatsCard
          title="Total Requests"
          value={totalRequests}
          subtitle="All submitted repair orders"
          icon={ClipboardList}
          colorClass="bg-linear-to-br from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-600/25"
        />
        <StatsCard
          title="Active Jobs"
          value={activeJobs}
          subtitle="Currently in repair pipeline"
          icon={Wrench}
          colorClass="bg-linear-to-br from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25"
        />
        <StatsCard
          title="Completed Jobs"
          value={completedJobs}
          subtitle="Repaired & quality verified"
          icon={CheckCircle2}
          colorClass="bg-linear-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25"
        />
      </div>

      {/* Chart + Recent Bookings Split */}
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-3d-card lg:col-span-7 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-4 text-base font-extrabold text-slate-900 dark:text-white">
            Repair Status Breakdown
          </h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#64748b"
                  opacity={0.2}
                />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 12, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: "rgba(99, 102, 241, 0.08)" }}
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#1e293b",
                    borderRadius: "12px",
                    color: "#f8fafc",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="count" fill="#4f46e5" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-3d-card lg:col-span-5 dark:border-slate-800 dark:bg-slate-900">
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                Recent Requests
              </h2>
              <Link
                href="/dashboard/customer/bookings"
                className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:underline dark:text-cyan-400"
              >
                View All <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {bookings.length === 0 ? (
              <p className="py-8 text-center text-xs text-slate-500 dark:text-slate-400">
                No repair requests yet. Book a verified technician to get started.
              </p>
            ) : (
              <div className="space-y-3">
                {bookings.slice(0, 3).map((b) => (
                  <div
                    key={b._id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-slate-200/70 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950/60"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <Image
                        src={b.serviceImage}
                        alt={b.serviceTitle}
                        width={40}
                        height={40}
                        unoptimized
                        className="h-10 w-10 shrink-0 rounded-lg object-cover"
                      />
                      <div className="min-w-0">
                        <p className="truncate text-xs font-bold text-slate-900 dark:text-white">
                          {b.serviceTitle}
                        </p>
                        <p className="truncate text-[11px] text-slate-500 dark:text-slate-400">
                          Tech: {b.technicianName}
                        </p>
                      </div>
                    </div>
                    <JobStatusBadge status={b.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}