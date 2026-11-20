'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { fetchWithAuth } from '@/lib/api';
import { ApprovalStatusBadge } from '@/components/StatusBadge';
import type { Service } from '@/types';
import { toast } from 'sonner';
import { Check, X } from 'lucide-react';

export default function AdminServiceApprovalPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let active = true;
    fetchWithAuth('/api/admin/services')
      .then((data: unknown) => {
        if (!active) return;
        const list = Array.isArray(data) ? (data as Service[]) : [];
        list.sort((a, b) => (a.approvalStatus === 'pending' ? -1 : b.approvalStatus === 'pending' ? 1 : 0));
        setServices(list);
      })
      .catch((err: unknown) => {
        if (active) {
          toast.error(err instanceof Error ? err.message : 'Failed to load services');
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [refreshKey]);

  const handleApproval = async (id: string, approvalStatus: 'approved' | 'rejected') => {
    try {
      await fetchWithAuth(`/api/admin/services/${id}/approval`, {
        method: 'PATCH',
        body: JSON.stringify({ approvalStatus }),
      });
      toast.success(`Service ${approvalStatus}`);
      setRefreshKey((k) => k + 1);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Action failed');
    }
  };

  const filtered = filter === 'all' ? services : services.filter((s) => s.approvalStatus === filter);

  if (loading) {
    return <div className="h-64 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 animate-pulse" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)' }} className="text-2xl font-black text-slate-950 dark:text-white">
            Service Approval
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Approve or reject technician repair listings before they go public[cite: 2]
          </p>
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-semibold w-fit"
        >
          <option value="all">All Listings (Pending First)</option>
          <option value="pending">Pending Only</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-3d-card overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
              <th className="py-3.5 px-4">Service</th>
              <th className="py-3.5 px-4">Technician</th>
              <th className="py-3.5 px-4">Category & Mode</th>
              <th className="py-3.5 px-4">Price</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Moderation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
            {filtered.map((s) => (
              <tr
                key={s._id}
                className={
                  s.approvalStatus === 'pending'
                    ? 'bg-amber-50/40 dark:bg-amber-950/20'
                    : 'hover:bg-slate-50/60 dark:hover:bg-slate-800/40'
                }
              >
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <Image
                      src={s.image}
                      alt={s.title}
                      width={44}
                      height={44}
                      unoptimized
                      className="w-11 h-11 rounded-xl object-cover shrink-0"
                    />
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{s.title}</p>
                      <p className="text-xs text-slate-500">{s.serviceArea}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{s.technicianName}</p>
                  <p className="text-xs text-slate-400">{s.technicianEmail}</p>
                </td>
                <td className="py-3.5 px-4 text-xs">
                  <span className="font-bold text-indigo-600 dark:text-cyan-400 block">{s.category}</span>
                  <span className="text-slate-500">{s.serviceMode}</span>
                </td>
                <td style={{ fontFamily: 'var(--font-mono)' }} className="py-3.5 px-4 font-extrabold text-slate-900 dark:text-white">
                  ${s.basePrice}
                </td>
                <td className="py-3.5 px-4">
                  <ApprovalStatusBadge status={s.approvalStatus || 'pending'} />
                </td>
                <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-2">
                  <button
                    onClick={() => handleApproval(s._id, 'approved')}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                  >
                    <Check className="w-3.5 h-3.5" /> Approve
                  </button>
                  <button
                    onClick={() => handleApproval(s._id, 'rejected')}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 text-xs font-bold"
                  >
                    <X className="w-3.5 h-3.5" /> Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}