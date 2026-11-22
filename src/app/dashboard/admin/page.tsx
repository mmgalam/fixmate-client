"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchWithAuth } from "@/lib/api";
import StatsCard from "@/components/StatsCard";
import type { UserProfile, Service, Booking } from "@/types";
import { Users, Wrench, Clock, CheckSquare, Sparkles } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function AdminOverviewPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.all([
      fetchWithAuth("/api/admin/users"),
      fetchWithAuth("/api/admin/services"),
      fetchWithAuth("/api/admin/bookings"),
    ])
      .then(([u, s, b]: [unknown, unknown, unknown]) => {
        if (!active) return;
        setUsers(Array.isArray(u) ? (u as UserProfile[]) : []);
        setServices(Array.isArray(s) ? (s as Service[]) : []);
        setBookings(Array.isArray(b) ? (b as Booking[]) : []);
      })
      .catch(() => {
        if (!active) return;
        setUsers([]);
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

  const totalTechnicians = users.filter((u) => u.role === "technician").length;
  const pendingServices = services.filter(
    (s) => s.approvalStatus === "pending",
  ).length;

  const chartData = [
    {
      name: "Customers",
      count: users.filter((u) => u.role === "customer").length,
    },
    { name: "Technicians", count: totalTechnicians },
    {
      name: "Approved Services",
      count: services.filter((s) => s.approvalStatus === "approved").length,
    },
    { name: "Pending Services", count: pendingServices },
    { name: "Total Bookings", count: bookings.length },
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
          className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-indigo-600/25 blur-3xl"
        />
        <div className="relative z-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <span
              style={{ fontFamily: "var(--font-mono)" }}
              className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-cyan-400"
            >
              <Sparkles className="h-3.5 w-3.5" />
              ADMIN CONTROL PANEL
            </span>
            <h1
              style={{ fontFamily: "var(--font-display)" }}
              className="mt-1 text-2xl font-black sm:text-3xl"
            >
              Admin Overview
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Monitor users, moderate service listings, and track platform
              activity.
            </p>
          </div>
          <Link
            href="/dashboard/admin/services"
            className="inline-flex w-fit items-center gap-2 rounded-xl bg-linear-to-r from-indigo-600 to-cyan-600 px-5 py-3 text-xs font-extrabold text-white shadow-lg shadow-indigo-600/30 transition hover:from-indigo-700 hover:to-cyan-700"
          >
            <CheckSquare className="h-4 w-4" />
            Review Pending Services ({pendingServices})
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatsCard
          title="Total Users"
          value={users.length}
          subtitle="All registered accounts"
          icon={Users}
          colorClass="bg-linear-to-br from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-600/25"
        />
        <StatsCard
          title="Total Technicians"
          value={totalTechnicians}
          subtitle="Verified service providers"
          icon={Wrench}
          colorClass="bg-linear-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25"
        />
        <StatsCard
          title="Pending Services"
          value={pendingServices}
          subtitle="Awaiting admin approval"
          icon={Clock}
          colorClass="bg-linear-to-br from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25"
        />
      </div>

      {/* Analytics Chart */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-3d-card dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-4 text-base font-extrabold text-slate-900 dark:text-white">
          Platform Overview Analytics
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
    </div>
  );
}