"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchWithAuth } from "@/lib/api";
import StatsCard from "@/components/StatsCard";
import { ClipboardList, Wrench, CheckCircle2, ArrowRight } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Booking } from "@/types";

export default function CustomerOverviewPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWithAuth("/api/bookings/my")
      .then((data) => setBookings(Array.isArray(data) ? data : []))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
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
      <div className="h-64 bg-white rounded-2xl border border-slate-200 animate-pulse" />
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Customer Overview
          </h1>
          <p className="text-sm text-slate-500">
            Track your repair requests and settle completed jobs
          </p>
        </div>
        <Link
          href="/services"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition"
        >
          Book a Repair <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* 3 Required Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Requests"
          value={totalRequests}
          icon={ClipboardList}
          colorClass="bg-blue-50 text-blue-600"
        />
        <StatsCard
          title="Active Jobs"
          value={activeJobs}
          subtitle="Requested, Accepted, or In Progress"
          icon={Wrench}
          colorClass="bg-amber-50 text-amber-600"
        />
        <StatsCard
          title="Completed Jobs"
          value={completedJobs}
          icon={CheckCircle2}
          colorClass="bg-emerald-50 text-emerald-600"
        />
      </div>

      {/* Activity Chart */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <h2 className="text-lg font-bold text-slate-900 mb-4">
          My Repair Status Breakdown
        </h2>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e2e8f0"
              />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#2563eb" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
