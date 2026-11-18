"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchWithAuth } from "@/lib/api";
import StatsCard from "@/components/StatsCard";
import type { UserProfile, Service, Booking } from "@/types";
import { Users, Wrench, Clock, CheckSquare } from "lucide-react";
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
      .then(
        ([usersData, servicesData, bookingsData]: [
          unknown,
          unknown,
          unknown,
        ]) => {
          if (!active) return;
          setUsers(
            Array.isArray(usersData) ? (usersData as UserProfile[]) : [],
          );
          setServices(
            Array.isArray(servicesData) ? (servicesData as Service[]) : [],
          );
          setBookings(
            Array.isArray(bookingsData) ? (bookingsData as Booking[]) : [],
          );
        },
      )
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

  const totalUsers = users.length;
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
      <div className="h-64 bg-white rounded-2xl border border-slate-200 animate-pulse" />
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Admin Overview
          </h1>
          <p className="text-sm text-slate-500">
            Monitor users, moderate service listings, and track platform
            activity
          </p>
        </div>
        <Link
          href="/dashboard/admin/services"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition"
        >
          <CheckSquare className="w-4 h-4" />
          Review Pending Services ({pendingServices})
        </Link>
      </div>

      {/* 3 Required Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Users"
          value={totalUsers}
          icon={Users}
          colorClass="bg-blue-50 text-blue-600"
        />
        <StatsCard
          title="Total Technicians"
          value={totalTechnicians}
          icon={Wrench}
          colorClass="bg-indigo-50 text-indigo-600"
        />
        <StatsCard
          title="Pending Services"
          value={pendingServices}
          subtitle="Awaiting admin approval"
          icon={Clock}
          colorClass="bg-amber-50 text-amber-600"
        />
      </div>

      {/* Platform Analytics Chart */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <h2 className="text-lg font-bold text-slate-900 mb-4">
          Platform Overview Analytics
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
