'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { fetchWithAuth } from '@/lib/api';
import { uploadImageToImgBB } from '@/lib/imgbb';
import { ApprovalStatusBadge } from '@/components/StatusBadge';
import type { Service } from '@/types';
import { toast } from 'sonner';
import { Pencil, Trash2 } from 'lucide-react';

export default function TechnicianMyServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const [editTarget, setEditTarget] = useState<Service | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editArea, setEditArea] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editFile, setEditFile] = useState<File | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);

  useEffect(() => {
    let active = true;
    fetchWithAuth('/api/services/technician/my')
      .then((data: unknown) => {
        if (active) setServices(Array.isArray(data) ? (data as Service[]) : []);
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

  const handleToggleAvailability = async (service: Service) => {
    try {
      await fetchWithAuth(`/api/services/${service._id}`, {
        method: 'PATCH',
        body: JSON.stringify({ isAvailable: !service.isAvailable }),
      });
      toast.success(`Service marked ${!service.isAvailable ? 'Available' : 'Unavailable'}`);
      setRefreshKey((k) => k + 1);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Update failed');
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
        method: 'PATCH',
        body: JSON.stringify({
          title: editTitle.trim(),
          basePrice: Number(editPrice),
          serviceArea: editArea.trim(),
          description: editDesc.trim(),
          image: imageUrl,
        }),
      });
      toast.success('Service updated! Status reset to pending for admin review.');
      setEditTarget(null);
      setRefreshKey((k) => k + 1);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to update service');
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await fetchWithAuth(`/api/services/${deleteTarget._id}`, { method: 'DELETE' });
      toast.success('Service deleted');
      setDeleteTarget(null);
      setRefreshKey((k) => k + 1);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  if (loading) {
    return <div className="h-64 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 animate-pulse" />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 style={{ fontFamily: 'var(--font-display)' }} className="text-2xl font-black text-slate-950 dark:text-white">
          My Services
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Manage your repair offerings, edit details, or toggle availability[cite: 2]
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-x-auto shadow-3d-card">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
              <th className="py-3.5 px-4">Service</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Price</th>
              <th className="py-3.5 px-4">Approval</th>
              <th className="py-3.5 px-4">Availability</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
            {services.map((s) => (
              <tr key={s._id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
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
                <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">{s.category}</td>
                <td style={{ fontFamily: 'var(--font-mono)' }} className="py-3.5 px-4 font-extrabold text-slate-900 dark:text-white">
                  ${s.basePrice}
                </td>
                <td className="py-3.5 px-4">
                  <ApprovalStatusBadge status={s.approvalStatus || 'pending'} />
                </td>
                <td className="py-3.5 px-4">
                  <button
                    type="button"
                    onClick={() => handleToggleAvailability(s)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                      s.isAvailable
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {s.isAvailable ? 'Available' : 'Unavailable'}
                  </button>
                </td>
                <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-2">
                  <button
                    onClick={() => openEditModal(s)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Pencil className="w-3.5 h-3.5 text-indigo-600 dark:text-cyan-400" />
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteTarget(s)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-xs font-bold hover:bg-red-50 dark:hover:bg-red-950/40"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Edit Service</h3>
            <p className="text-xs text-amber-600 mt-1">
              Note: Saving edits resets approval status to Pending[cite: 2].
            </p>
            <form onSubmit={handleEditSubmit} className="mt-4 space-y-3">
              <input
                type="text"
                required
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-sm"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  required
                  min="1"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-sm"
                />
                <input
                  type="text"
                  required
                  value={editArea}
                  onChange={(e) => setEditArea(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-sm"
                />
              </div>
              <textarea
                rows={3}
                required
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-sm"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setEditFile(e.target.files?.[0] || null)}
                className="text-xs text-slate-500"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditTarget(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-bold"
                >
                  {savingEdit ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-sm w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Delete Service?</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              Are you sure you want to delete <strong>{deleteTarget.title}</strong>?
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-bold"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}