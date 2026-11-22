"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { fetchWithAuth } from "@/lib/api";
import { ApprovalStatusBadge } from "@/components/StatusBadge";
import type { Service } from "@/types";
import { toast } from "sonner";
import { Check, X, CheckSquare } from "lucide-react";

export default function AdminServiceApprovalPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetchWithAuth("/api/admin/services")
      .then((data: unknown) => {
        if (!active) return;
        const list = Array.isArray(data) ? (data as Service[]) : [];
        list.sort((a, b) =>
          a.approvalStatus === "pending"
            ? -1
            : b.approvalStatus === "pending"
              ? 1
              : 0,
        );
        setServices(list);
      })
      .catch((err: unknown) => {
        if (active) {
          toast.error(
            err instanceof Error ? err.message : "Failed to load services",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [refreshKey]);

  const handleApproval = async (
    id: string,
    approvalStatus: "approved" | "rejected",
  ) => {
    setProcessingId(id);
    try {
      await fetchWithAuth(`/api/admin/services/${id}/approval`, {
        method: "PATCH",
        body: JSON.stringify({ approvalStatus }),
      });
      toast.success(`Service ${approvalStatus}`);
      setRefreshKey((k) => k + 1);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Action failed");
    } finally {
      setProcessingId(null);
    }
  };

  const filtered =
    filter === "all"
      ? services
      : services.filter((s) => s.approvalStatus === filter);

  if (loading) {
    return (
      <div className="h-64 animate-pulse rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900" />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1
            style={{ fontFamily: "var(--font-display)" }}
            className="text-2xl font-black text-slate-950 sm:text-3xl dark:text-white"
          >
            Service Approval
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Approve or reject technician repair listings before they go public
          </p>
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          aria-label="Filter services by approval status"
          className="w-fit rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm font-semibold text-slate-800 focus:border-indigo-600 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
        >
          <option value="all">All Listings (Pending First)</option>
          <option value="pending">Pending Only</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-14 text-center shadow-3d-card dark:border-slate-800 dark:bg-slate-900">
          <CheckSquare className="mx-auto mb-3 h-12 w-12 text-slate-300 dark:text-slate-600" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            No services in this filter
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Switch the approval filter above to inspect other technician
            listings.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-3d-card dark:border-slate-800 dark:bg-slate-900">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-bold uppercase text-slate-500 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400">
                <th className="whitespace-nowrap px-4 py-3.5">Service</th>
                <th className="whitespace-nowrap px-4 py-3.5">Technician</th>
                <th className="whitespace-nowrap px-4 py-3.5">
                  Category &amp; Mode
                </th>
                <th className="whitespace-nowrap px-4 py-3.5">Price</th>
                <th className="whitespace-nowrap px-4 py-3.5">Status</th>
                <th className="whitespace-nowrap px-4 py-3.5 text-right">
                  Moderation
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm dark:divide-slate-800">
              {filtered.map((s) => {
                const isBusy = processingId === s._id;
                return (
                  <tr
                    key={s._id}
                    className={
                      s.approvalStatus === "pending"
                        ? "bg-amber-50/40 dark:bg-amber-950/20"
                        : "hover:bg-slate-50/60 dark:hover:bg-slate-800/40"
                    }
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <Image
                          src={s.image}
                          alt={s.title}
                          width={44}
                          height={44}
                          unoptimized
                          className="h-11 w-11 shrink-0 rounded-xl object-cover"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 dark:text-white">
                            {s.title}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {s.serviceArea}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        {s.technicianName}
                      </p>
                      <p className="text-xs text-slate-400">
                        {s.technicianEmail}
                      </p>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-xs">
                      <span className="block font-bold text-indigo-600 dark:text-cyan-400">
                        {s.category}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400">
                        {s.serviceMode}
                      </span>
                    </td>
                    <td
                      style={{ fontFamily: "var(--font-mono)" }}
                      className="whitespace-nowrap px-4 py-3.5 font-extrabold text-slate-900 dark:text-white"
                    >
                      ${s.basePrice}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5">
                      <ApprovalStatusBadge
                        status={s.approvalStatus || "pending"}
                      />
                    </td>
                    <td className="space-x-2 whitespace-nowrap px-4 py-3.5 text-right">
                      <button
                        type="button"
                        disabled={isBusy || s.approvalStatus === "approved"}
                        onClick={() => handleApproval(s._id, "approved")}
                        className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-45"
                      >
                        <Check className="h-3.5 w-3.5" /> Approve
                      </button>
                      <button
                        type="button"
                        disabled={isBusy || s.approvalStatus === "rejected"}
                        onClick={() => handleApproval(s._id, "rejected")}
                        className="inline-flex items-center gap-1 rounded-xl border border-red-200 px-3 py-1.5 text-xs font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-45 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/40"
                      >
                        <X className="h-3.5 w-3.5" /> Reject
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}