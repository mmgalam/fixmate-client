'use client';

import { useEffect, useState } from 'react';
import { fetchWithAuth } from '@/lib/api';
import { ApprovalStatusBadge } from '@/components/StatusBadge';
import type { Service, ApprovalStatus } from '@/types';
import { toast } from 'sonner';
import { Check, X, CheckSquare } from 'lucide-react';
import Image from 'next/image';

export default function AdminServiceApprovalPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetchWithAuth('/api/admin/services')
      .then((data: unknown) => {
        if (active) {
          setServices(Array.isArray(data) ? (data as Service[]) : []);
        }
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
  }, []);

  const handleApproval = async (
    serviceId: string,
    approvalStatus: Extract<ApprovalStatus, 'approved' | 'rejected'>
  ) => {
    setUpdatingId(serviceId);
    try {
      await fetchWithAuth(`/api/admin/services/${serviceId}/approval`, {
        method: 'PATCH',
        body: JSON.stringify({ approvalStatus }),
      });
      setServices((prev) =>
        prev.map((s) =>
          s._id === serviceId ? { ...s, approvalStatus } : s
        )
      );
      toast.success(`Service ${approvalStatus}`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to update approval');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredServices =
    filterStatus === 'all'
      ? services
      : services.filter((s) => s.approvalStatus === filterStatus);

  if (loading) {
    return (
      <div className="h-72 bg-white rounded-2xl border border-slate-200 animate-pulse" />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Service Approval
          </h1>
          <p className="text-sm text-slate-500">
            Approve or reject repair services before they appear on public pages
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5 bg-white p-1.5 rounded-xl border border-slate-200">
          {[
            { label: 'All (Pending First)', value: 'all' },
            { label: 'Pending', value: 'pending' },
            { label: 'Approved', value: 'approved' },
            { label: 'Rejected', value: 'rejected' },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilterStatus(tab.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                filterStatus === tab.value
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {filteredServices.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-14 text-center">
          <CheckSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-900">No services found</h3>
          <p className="text-sm text-slate-500 mt-1">
            No services match the selected approval status filter.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase text-slate-500">
                <th className="py-3.5 px-4">Service</th>
                <th className="py-3.5 px-4">Technician</th>
                <th className="py-3.5 px-4">Category & Mode</th>
                <th className="py-3.5 px-4">Base Price</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredServices.map((service) => (
                <tr
                  key={service._id}
                  className={
                    service.approvalStatus === 'pending'
                      ? 'bg-amber-50/40 hover:bg-amber-50/70'
                      : 'hover:bg-slate-50/60'
                  }
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <Image
                        src={service.image}
                        alt={service.title}
                        className="w-12 h-12 rounded-lg object-cover shrink-0 bg-slate-100"
                      />
                      <div>
                        <p className="font-bold text-slate-900">{service.title}</p>
                        <p className="text-xs text-slate-500">{service.serviceArea}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <p className="font-medium text-slate-900">{service.technicianName}</p>
                    <p className="text-xs text-slate-500">{service.technicianEmail}</p>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-slate-800">{service.category}</p>
                    <p className="text-xs text-slate-500">{service.serviceMode}</p>
                  </td>
                  <td className="py-4 px-4 font-bold text-slate-900">
                    ${service.basePrice}
                  </td>
                  <td className="py-4 px-4">
                    <ApprovalStatusBadge status={service.approvalStatus} />
                  </td>
                  <td className="py-4 px-4 text-right space-x-2 whitespace-nowrap">
                    <button
                      onClick={() => handleApproval(service._id, 'approved')}
                      disabled={
                        updatingId === service._id ||
                        service.approvalStatus === 'approved'
                      }
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-xs font-semibold transition"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleApproval(service._id, 'rejected')}
                      disabled={
                        updatingId === service._id ||
                        service.approvalStatus === 'rejected'
                      }
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white text-xs font-semibold transition"
                    >
                      <X className="w-3.5 h-3.5" />
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}