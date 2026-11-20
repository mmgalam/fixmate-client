'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { fetchWithAuth } from '@/lib/api';
import StatsCard from '@/components/StatsCard';
import { JobStatusBadge } from '@/components/StatusBadge';
import type { Booking } from '@/types';
import {
  ClipboardList,
  Wrench,
  CheckCircle2,
  ArrowRight,
  Plus,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export default function CustomerOverviewPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchWithAuth('/api/bookings/my')
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
    ['requested', 'accepted', 'in-progress'].includes(b.status)
  ).length;
  const completedJobs = bookings.filter((b) => b.status === 'completed').length;

  const chartData = [
    { name: 'Requested', count: bookings.filter((b) => b.status === 'requested').length },
    { name: 'Accepted', count: bookings.filter((b) => b.status === 'accepted').length },
    { name: 'In Progress', count: bookings.filter((b) => b.status === 'in-progress').length },
    { name: 'Completed', count: completedJobs },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-28 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 animate-pulse"
            />
          ))}
        </div>
        <div className="h-72 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Executive Greeting Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-950 text-white p-6 sm:p-8 border border-white/10 shadow-xl">
        <div
          aria-hidden="true"
          className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-indigo-600/25 blur-3xl pointer-events-none"
        />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span
              style={{ fontFamily: 'var(--font-mono)' }}
              className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-cyan-400"
            >
              <Sparkles className="w-3.5 h-3.5" />
              CUSTOMER COMMAND CENTER
            </span>
            <h1
              style={{ fontFamily: 'var(--font-display)' }}
              className="text-2xl sm:text-3xl font-black mt-1"
            >
              Customer Overview
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Track live repair milestones and settle completed invoices safely.
            </p>
          </div>

          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-5 py-3 bg-linear-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white text-xs font-extrabold rounded-xl shadow-lg shadow-indigo-600/30 transition w-fit"
          >
            <Plus className="w-4 h-4" />
            Book New Repair
          </Link>
        </div>
      </div>

      {/* 3D Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-3d-card">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white mb-4">
            Repair Status Breakdown
          </h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.18} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#4f46e5" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-3d-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                Recent Requests
              </h2>
              <Link
                href="/dashboard/customer/bookings"
                className="text-xs font-bold text-indigo-600 dark:text-cyan-400 hover:underline inline-flex items-center gap-1"
              >
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {bookings.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-slate-400 py-8 text-center">
                No repair requests yet. Book a verified technician to get started.
              </p>
            ) : (
              <div className="space-y-3">
                {bookings.slice(0, 3).map((b) => (
                  <div
                    key={b._id}
                    className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Image
                        src={b.serviceImage}
                        alt={b.serviceTitle}
                        width={40}
                        height={40}
                        unoptimized
                        className="w-10 h-10 rounded-lg object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {b.serviceTitle}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">
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