'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchWithAuth } from '@/lib/api';
import { uploadImageToImgBB } from '@/lib/imgbb';
import { ApprovalStatusBadge } from '@/components/StatusBadge';
import type { Service, ServiceCategory, ServiceMode } from '@/types';
import { toast } from 'sonner';
import { Pencil, Trash2, PlusCircle, AlertTriangle, X } from 'lucide-react';
import Image from 'next/image';

const CATEGORIES: ServiceCategory[] = [
  'Smartphone',
  'Laptop & PC',
  'AC',
  'Refrigerator',
  'TV',
  'Washing Machine',
  'Electrical',
];

export default function TechnicianMyServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [editTarget, setEditTarget] = useState<Service | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState<ServiceCategory>('Smartphone');
  const [editDescription, setEditDescription] = useState('');
  const [editBasePrice, setEditBasePrice] = useState('');
  const [editDuration, setEditDuration] = useState('');
  const [editMode, setEditMode] = useState<ServiceMode>('Home Visit');
  const [editArea, setEditArea] = useState('');
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);

  // Delete Confirmation Modal State
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let active = true;
    fetchWithAuth('/api/services/technician/my')
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

  const refreshServices = async () => {
    const data: unknown = await fetchWithAuth('/api/services/technician/my');
    setServices(Array.isArray(data) ? (data as Service[]) : []);
  };

  const handleToggleAvailability = async (service: Service) => {
    const nextValue = !service.isAvailable;
    try {
      await fetchWithAuth(`/api/services/${service._id}`, {
        method: 'PATCH',
        body: JSON.stringify({ isAvailable: nextValue }),
      });
      setServices((prev) =>
        prev.map((s) =>
          s._id === service._id ? { ...s, isAvailable: nextValue } : s
        )
      );
      toast.success(
        nextValue ? 'Service is now visible publicly' : 'Service hidden from public listings'
      );
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to toggle availability');
    }
  };

  const openEditModal = (service: Service) => {
    setEditTarget(service);
    setEditTitle(service.title);
    setEditCategory(service.category);
    setEditDescription(service.description);
    setEditBasePrice(String(service.basePrice));
    setEditDuration(service.estimatedDuration);
    setEditMode(service.serviceMode);
    setEditArea(service.serviceArea);
    setEditImageFile(null);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTarget) return;

    setSavingEdit(true);
    try {
      let imageUrl = editTarget.image;
      if (editImageFile) {
        imageUrl = await uploadImageToImgBB(editImageFile);
      }

      await fetchWithAuth(`/api/services/${editTarget._id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          title: editTitle,
          category: editCategory,
          description: editDescription,
          basePrice: Number(editBasePrice),
          estimatedDuration: editDuration,
          serviceMode: editMode,
          serviceArea: editArea,
          image: imageUrl,
        }),
      });

      toast.success('Service updated! Status reset to Pending for admin review.');
      setEditTarget(null);
      await refreshServices();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to update service');
    } finally {
      setSavingEdit(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await fetchWithAuth(`/api/services/${deleteTarget._id}`, {
        method: 'DELETE',
      });
      toast.success('Service deleted');
      setDeleteTarget(null);
      await refreshServices();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete service');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="h-72 bg-white rounded-2xl border border-slate-200 animate-pulse" />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">My Services</h1>
          <p className="text-sm text-slate-500">
            Edit listings, toggle availability, or remove outdated services
          </p>
        </div>
        <Link
          href="/dashboard/technician/add-service"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition"
        >
          <PlusCircle className="w-4 h-4" />
          Add New Service
        </Link>
      </div>

      {services.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-14 text-center">
          <h3 className="text-lg font-bold text-slate-900">No services listed yet</h3>
          <p className="text-sm text-slate-500 mt-1">
            Publish your first repair service to start receiving customer bookings.
          </p>
          <Link
            href="/dashboard/technician/add-service"
            className="inline-block mt-5 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700"
          >
            Add a Service
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase text-slate-500">
                <th className="py-3.5 px-4">Service</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Base Price</th>
                <th className="py-3.5 px-4">Approval Status</th>
                <th className="py-3.5 px-4">Available</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {services.map((service) => (
                <tr key={service._id} className="hover:bg-slate-50/60">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <Image
                        src={service.image}
                        alt={service.title}
                        className="w-12 h-12 rounded-lg object-cover shrink-0 bg-slate-100"
                      />
                      <div>
                        <p className="font-bold text-slate-900">{service.title}</p>
                        <p className="text-xs text-slate-500">{service.serviceMode}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-slate-700">{service.category}</td>
                  <td className="py-4 px-4 font-bold text-slate-900">
                    ${service.basePrice}
                  </td>
                  <td className="py-4 px-4">
                    <ApprovalStatusBadge status={service.approvalStatus} />
                  </td>
                  <td className="py-4 px-4">
                    <button
                      type="button"
                      onClick={() => handleToggleAvailability(service)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                        service.isAvailable ? 'bg-blue-600' : 'bg-slate-300'
                      }`}
                      aria-label="Toggle availability"
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                          service.isAvailable ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </td>
                  <td className="py-4 px-4 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(service)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteTarget(service)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold"
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
      )}

      {/* Pre-Filled Edit Service Modal */}
      {editTarget && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Edit Service</h3>
                <p className="text-xs text-amber-600">
                  Saving changes will set approval status back to Pending.
                </p>
              </div>
              <button
                onClick={() => setEditTarget(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={editCategory}
                    onChange={(e) =>
                      setEditCategory(e.target.value as ServiceCategory)
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Base Price (USD)
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    step="0.01"
                    value={editBasePrice}
                    onChange={(e) => setEditBasePrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    required
                    value={editDuration}
                    onChange={(e) => setEditDuration(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Service Mode
                  </label>
                  <select
                    value={editMode}
                    onChange={(e) => setEditMode(e.target.value as ServiceMode)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                  >
                    <option value="Home Visit">Home Visit</option>
                    <option value="Shop Drop-off">Shop Drop-off</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Service Area
                </label>
                <input
                  type="text"
                  required
                  value={editArea}
                  onChange={(e) => setEditArea(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Replace Image (Optional, uploads via ImgBB)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEditImageFile(e.target.files?.[0] || null)}
                  className="w-full text-xs text-slate-600"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditTarget(null)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-sm font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold"
                >
                  {savingEdit ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center gap-3 text-red-600 mb-3">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-bold text-slate-900">Delete Service?</h3>
            </div>
            <p className="text-sm text-slate-600">
              Are you sure you want to permanently delete{' '}
              <strong>{deleteTarget.title}</strong>?
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-sm font-semibold text-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold"
              >
                {deleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}