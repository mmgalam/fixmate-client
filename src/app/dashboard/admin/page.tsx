'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchWithAuth } from '@/lib/api';
import StatsCard from '@/components/StatsCard';
import type { UserProfile, Service, Booking } from '@/types';
import { Users, Wrench, Clock, CheckSquare } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export default function AdminOverviewPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.all([
      fetchWithAuth('/api/admin/users'),
      fetchWithAuth('/api/admin/services'),
      fetchWithAuth('/api/admin/bookings'),
    ])
      .then(([u, s, b]: [unknown, unknown, unknown]) => {
        if (!active) return;
        setUsers(Array.isArray(u) ? (u as UserProfile[]) : []);
        setServices(Array.isArray(s) ? (s as Service[]) : []);
        setBookings(Array.isArray(b) ? (b as Booking[]) : []);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const totalTechnicians = users.filter((u) => u.role === 'technician').length;
  const pendingServices = services.filter((s) => s.approvalStatus === 'pending').length;

  const chartData = [
    { name: 'Customers', count: users.filter((u) => u.role === 'customer').length },
    { name: 'Technicians', count: totalTechnicians },
    { name: 'Approved Services', count: services.filter((s) => s.approvalStatus === 'approved').length },
    { name: 'Pending Services', count: pendingServices },
    { name: 'Total Bookings', count: bookings.length },
  ];

  if (loading) {
    return <div className="h-64 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 animate-pulse" />;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)' }} className="text-2xl font-black text-slate-950 dark:text-white">
            Admin Overview
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Monitor users, moderate service listings, and track platform activity[cite: 2]
          </p>
        </div>
        <Link
          href="/dashboard/admin/services"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-linear-to-r from-indigo-600 to-cyan-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-600/25 w-fit"
        >
          <CheckSquare className="w-4 h-4" />
          Review Pending Services ({pendingServices})
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard title="Total Users" value={users.length} icon={Users} />
        <StatsCard
          title="Total Technicians"
          value={totalTechnicians}
          icon={Wrench}
          colorClass="bg-cyan-50 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400"
        />
        <StatsCard
          title="Pending Services"
          value={pendingServices}
          subtitle="Awaiting admin approval"
          icon={Clock}
          colorClass="bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400"
        />
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-3d-card">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Platform Overview Analytics</h2>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#4f46e5" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}