"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchWithAuth } from "@/lib/api";
import { uploadImageToImgBB } from "@/lib/imgbb";
import { ApprovalStatusBadge } from "@/components/StatusBadge";
import type { Service } from "@/types";
import { toast } from "sonner";
import { Pencil, Trash2, PlusCircle, Briefcase, X } from "lucide-react";

export default function TechnicianMyServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const [editTarget, setEditTarget] = useState<Service | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editArea, setEditArea] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editFile, setEditFile] = useState<File | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let active = true;
    fetchWithAuth("/api/services/technician/my")
      .then((data: unknown) => {
        if (active) setServices(Array.isArray(data) ? (data as Service[]) : []);
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

  const handleToggleAvailability = async (service: Service) => {
    try {
      await fetchWithAuth(`/api/services/${service._id}`, {
        method: "PATCH",
        body: JSON.stringify({ isAvailable: !service.isAvailable }),
      });
      toast.success(
        `Service marked ${!service.isAvailable ? "Available" : "Unavailable"}`,
      );
      setRefreshKey((k) => k + 1);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    }
  };

  const openEditModal = (s: Service) => {
    setEditTarget(s);
    setEditTitle(s.title);
    setEditPrice(String(s.basePrice));
    setEditArea(s.serviceArea);
    setEditDesc(s.description);
    setEditFile(null);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTarget) return;
    setSavingEdit(true);
    try {
      let imageUrl = editTarget.image;
      if (editFile) {
        imageUrl = await uploadImageToImgBB(editFile);
      }
      await fetchWithAuth(`/api/services/${editTarget._id}`, {
        method: "PATCH",
        body: JSON.stringify({
          title: editTitle.trim(),
          basePrice: Number(editPrice),
          serviceArea: editArea.trim(),
          description: editDesc.trim(),
          image: imageUrl,
        }),
      });
      toast.success(
        "Service updated! Status reset to pending for admin review.",
      );
      setEditTarget(null);
      setRefreshKey((k) => k + 1);
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update service",
      );
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await fetchWithAuth(`/api/services/${deleteTarget._id}`, {
        method: "DELETE",
      });
      toast.success("Service deleted");
      setDeleteTarget(null);
      setRefreshKey((k) => k + 1);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

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
            My Services
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage your repair offerings, edit details, or toggle availability
          </p>
        </div>

        <Link
          href="/dashboard/technician/add-service"
          className="inline-flex w-fit items-center gap-2 rounded-xl bg-linear-to-r from-indigo-600 to-cyan-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/20 transition hover:from-indigo-700 hover:to-cyan-700"
        >
          <PlusCircle className="h-4 w-4" />
          Add New Service
        </Link>
      </div>

      {services.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-14 text-center shadow-3d-card dark:border-slate-800 dark:bg-slate-900">
          <Briefcase className="mx-auto mb-3 h-12 w-12 text-slate-300 dark:text-slate-600" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            No services listed yet
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Create your first repair service listing to start receiving customer
            requests.
          </p>
          <Link
            href="/dashboard/technician/add-service"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-indigo-700"
          >
            <PlusCircle className="h-4 w-4" />
            Add a Service
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-3d-card dark:border-slate-800 dark:bg-slate-900">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-bold uppercase text-slate-500 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400">
                <th className="whitespace-nowrap px-4 py-3.5">Service</th>
                <th className="whitespace-nowrap px-4 py-3.5">Category</th>
                <th className="whitespace-nowrap px-4 py-3.5">Price</th>
                <th className="whitespace-nowrap px-4 py-3.5">Approval</th>
                <th className="whitespace-nowrap px-4 py-3.5">Availability</th>
                <th className="whitespace-nowrap px-4 py-3.5 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm dark:divide-slate-800">
              {services.map((s) => (
                <tr
                  key={s._id}
                  className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40"
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
                  <td className="whitespace-nowrap px-4 py-3.5 text-slate-600 dark:text-slate-300">
                    {s.category}
                  </td>
                  <td
                    style={{ fontFamily: "var(--font-mono)" }}
                    className="whitespace-nowrap px-4 py-3.5 font-extrabold text-slate-900 dark:text-white"
                  >
                    ${s.basePrice}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5">
                    <ApprovalStatusBadge status={s.approvalStatus || "pending"} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5">
                    <button
                      type="button"
                      onClick={() => handleToggleAvailability(s)}
                      className={`rounded-full px-3 py-1 text-xs font-bold transition ${
                        s.isAvailable
                          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200/80 dark:bg-emerald-950 dark:text-emerald-300"
                          : "bg-slate-200 text-slate-600 hover:bg-slate-300/80 dark:bg-slate-800 dark:text-slate-400"
                      }`}
                    >
                      {s.isAvailable ? "Available" : "Unavailable"}
                    </button>
                  </td>
                  <td className="space-x-2 whitespace-nowrap px-4 py-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => openEditModal(s)}
                      className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      <Pencil className="h-3.5 w-3.5 text-indigo-600 dark:text-cyan-400" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(s)}
                      className="inline-flex items-center gap-1 rounded-xl border border-red-200 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/40"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {editTarget && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
        >
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Edit Service
                </h3>
                <p className="mt-1 text-xs font-medium text-amber-600 dark:text-amber-400">
                  Note: Saving edits resets approval status to Pending.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditTarget(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="mt-4 space-y-3.5">
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-600 dark:text-slate-400">
                  Service Title *
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50/70 px-3.5 py-2 text-sm text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-700 dark:bg-slate-950/70 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-600 dark:text-slate-400">
                    Base Price ($) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    step="0.01"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50/70 px-3.5 py-2 text-sm text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-700 dark:bg-slate-950/70 dark:text-white"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-600 dark:text-slate-400">
                    Service Area *
                  </label>
                  <input
                    type="text"
                    required
                    value={editArea}
                    onChange={(e) => setEditArea(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50/70 px-3.5 py-2 text-sm text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-700 dark:bg-slate-950/70 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-600 dark:text-slate-400">
                  Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50/70 px-3.5 py-2 text-sm text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-700 dark:bg-slate-950/70 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-600 dark:text-slate-400">
                  Replace Image (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEditFile(e.target.files?.[0] || null)}
                  className="text-xs text-slate-500 dark:text-slate-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditTarget(null)}
                  className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-700 disabled:opacity-60"
                >
                  {savingEdit ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteTarget && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
        >
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Delete Service?
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Are you sure you want to delete{" "}
              <strong>{deleteTarget.title}</strong>?
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setDeleteTarget(null)}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDelete}
                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}