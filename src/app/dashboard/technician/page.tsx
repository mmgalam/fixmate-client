"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchWithAuth } from "@/lib/api";
import StatsCard from "@/components/StatsCard";
import type { Service, Booking } from "@/types";
import { Briefcase, CheckCircle2, Inbox, PlusCircle } from "lucide-react";
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
      .then(([servicesData, bookingsData]: [unknown, unknown]) => {
        if (!active) return;
        setServices(
          Array.isArray(servicesData) ? (servicesData as Service[]) : [],
        );
        setBookings(
          Array.isArray(bookingsData) ? (bookingsData as Booking[]) : [],
        );
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

  const totalServices = services.length;
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
      <div className="h-64 bg-white rounded-2xl border border-slate-200 animate-pulse" />
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Technician Overview
          </h1>
          <p className="text-sm text-slate-500">
            Manage your repair listings and track incoming customer jobs
          </p>
        </div>
        <Link
          href="/dashboard/technician/add-service"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition"
        >
          <PlusCircle className="w-4 h-4" />
          Add a Service
        </Link>
      </div>

      {/* 3 Required Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Services"
          value={totalServices}
          icon={Briefcase}
          colorClass="bg-blue-50 text-blue-600"
        />
        <StatsCard
          title="Approved Services"
          value={approvedServices}
          subtitle="Live on public marketplace"
          icon={CheckCircle2}
          colorClass="bg-emerald-50 text-emerald-600"
        />
        <StatsCard
          title="Pending Requests"
          value={pendingRequests}
          subtitle="Awaiting your response"
          icon={Inbox}
          colorClass="bg-amber-50 text-amber-600"
        />
      </div>

      {/* Job Pipeline Chart */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <h2 className="text-lg font-bold text-slate-900 mb-4">
          Incoming Repair Jobs Pipeline
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
