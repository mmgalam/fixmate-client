'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchWithAuth } from '@/lib/api';
import StatsCard from '@/components/StatsCard';
import type { Service, Booking } from '@/types';
import { Briefcase, CheckCircle2, Inbox, PlusCircle } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export default function TechnicianOverviewPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.all([
      fetchWithAuth('/api/services/technician/my'),
      fetchWithAuth('/api/bookings/technician'),
    ])
      .then(([s, b]: [unknown, unknown]) => {
        if (!active) return;
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

  const approvedServices = services.filter((s) => s.approvalStatus === 'approved').length;
  const pendingRequests = bookings.filter((b) => b.status === 'requested').length;

  const chartData = [
    { name: 'Requested', count: pendingRequests },
    { name: 'Accepted', count: bookings.filter((b) => b.status === 'accepted').length },
    { name: 'In Progress', count: bookings.filter((b) => b.status === 'in-progress').length },
    { name: 'Completed', count: bookings.filter((b) => b.status === 'completed').length },
  ];

  if (loading) {
    return <div className="h-64 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 animate-pulse" />;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)' }} className="text-2xl font-black text-slate-950 dark:text-white">
            Technician Overview
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage your repair listings and track incoming customer jobs[cite: 2]
          </p>
        </div>
        <Link
          href="/dashboard/technician/add-service"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-linear-to-r from-indigo-600 to-cyan-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-600/25 w-fit"
        >
          <PlusCircle className="w-4 h-4" />
          Add a Service
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard title="Total Services" value={services.length} icon={Briefcase} />
        <StatsCard
          title="Approved Services"
          value={approvedServices}
          subtitle="Live on public marketplace"
          icon={CheckCircle2}
          colorClass="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400"
        />
        <StatsCard
          title="Pending Requests"
          value={pendingRequests}
          subtitle="Awaiting your response"
          icon={Inbox}
          colorClass="bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400"
        />
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-3d-card">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Incoming Repair Jobs Pipeline</h2>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#06b6d4" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}