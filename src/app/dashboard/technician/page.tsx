"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchWithAuth } from "@/lib/api";
import StatsCard from "@/components/StatsCard";
import type { Service, Booking } from "@/types";
import { Briefcase, CheckCircle2, Inbox, PlusCircle, Sparkles } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function TechnicianOverviewPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.all([
      fetchWithAuth("/api/services/technician/my"),
      fetchWithAuth("/api/bookings/technician"),
    ])
      .then(([s, b]: [unknown, unknown]) => {
        if (!active) return;
        setServices(Array.isArray(s) ? (s as Service[]) : []);
        setBookings(Array.isArray(b) ? (b as Booking[]) : []);
      })
      .catch(() => {
        if (!active) return;
        setServices([]);
        setBookings([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const approvedServices = services.filter(
    (s) => s.approvalStatus === "approved",
  ).length;
  const pendingRequests = bookings.filter(
    (b) => b.status === "requested",
  ).length;

  const chartData = [
    { name: "Requested", count: pendingRequests },
    {
      name: "Accepted",
      count: bookings.filter((b) => b.status === "accepted").length,
    },
    {
      name: "In Progress",
      count: bookings.filter((b) => b.status === "in-progress").length,
    },
    {
      name: "Completed",
      count: bookings.filter((b) => b.status === "completed").length,
    },
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
      {/* Executive Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950 p-6 text-white shadow-xl sm:p-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl"
        />
        <div className="relative z-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <span
              style={{ fontFamily: "var(--font-mono)" }}
              className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-cyan-400"
            >
              <Sparkles className="h-3.5 w-3.5" />
              TECHNICIAN WORKSPACE
            </span>
            <h1
              style={{ fontFamily: "var(--font-display)" }}
              className="mt-1 text-2xl font-black sm:text-3xl"
            >
              Technician Overview
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Manage your repair listings and track incoming customer jobs.
            </p>
          </div>
          <Link
            href="/dashboard/technician/add-service"
            className="inline-flex w-fit items-center gap-2 rounded-xl bg-linear-to-r from-indigo-600 to-cyan-600 px-5 py-3 text-xs font-extrabold text-white shadow-lg shadow-indigo-600/30 transition hover:from-indigo-700 hover:to-cyan-700"
          >
            <PlusCircle className="h-4 w-4" />
            Add a Service
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatsCard
          title="Total Services"
          value={services.length}
          subtitle="All listed repair services"
          icon={Briefcase}
          colorClass="bg-linear-to-br from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-600/25"
        />
        <StatsCard
          title="Approved Services"
          value={approvedServices}
          subtitle="Live on public marketplace"
          icon={CheckCircle2}
          colorClass="bg-linear-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25"
        />
        <StatsCard
          title="Pending Requests"
          value={pendingRequests}
          subtitle="Awaiting your response"
          icon={Inbox}
          colorClass="bg-linear-to-br from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25"
        />
      </div>

      {/* Chart */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-3d-card dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-4 text-base font-extrabold text-slate-900 dark:text-white">
          Incoming Repair Jobs Pipeline
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
                cursor={{ fill: "rgba(6, 182, 212, 0.08)" }}
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderColor: "#1e293b",
                  borderRadius: "12px",
                  color: "#f8fafc",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="count" fill="#06b6d4" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}