'use client';

import { useEffect, useState } from 'react';
import { useSession } from '@/lib/auth-client';
import { fetchWithAuth } from '@/lib/api';
import type { UserProfile, UserRole } from '@/types';
import { toast } from 'sonner';
import Image from 'next/image';

export default function AdminManageUsersPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetchWithAuth('/api/admin/users')
      .then((data: unknown) => {
        if (active) {
          setUsers(Array.isArray(data) ? (data as UserProfile[]) : []);
        }
      })
      .catch((err: unknown) => {
        if (active) {
          toast.error(err instanceof Error ? err.message : 'Failed to load users');
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleRoleChange = async (userId: string, nextRole: UserRole) => {
    setUpdatingId(userId);
    try {
      await fetchWithAuth(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        body: JSON.stringify({ role: nextRole }),
      });
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: nextRole } : u))
      );
      toast.success(`User role updated to ${nextRole}`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to update role');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="h-72 bg-white rounded-2xl border border-slate-200 animate-pulse" />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Manage Users</h1>
        <p className="text-sm text-slate-500">
          View registered members and assign Customer, Technician, or Admin roles
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase text-slate-500">
              <th className="py-3.5 px-4">User</th>
              <th className="py-3.5 px-4">Email</th>
              <th className="py-3.5 px-4">Joined Date</th>
              <th className="py-3.5 px-4">Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {users.map((user) => {
              const isSelf = user.email === session?.user?.email;
              return (
                <tr key={user._id} className="hover:bg-slate-50/60">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <Image
                        src={
                          user.image ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            user.name || 'User'
                          )}&background=2563eb&color=fff`
                        }
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <p className="font-bold text-slate-900">
                          {user.name}{' '}
                          {isSelf && (
                            <span className="ml-1.5 text-xs font-normal text-blue-600">
                              (You)
                            </span>
                          )}
                        </p>
                        {user.area && (
                          <p className="text-xs text-slate-500">{user.area}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-slate-700">{user.email}</td>
                  <td className="py-4 px-4 text-slate-600">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : '—'}
                  </td>
                  <td className="py-4 px-4">
                    <select
                      value={user.role || 'customer'}
                      disabled={isSelf || updatingId === user._id}
                      onChange={(e) =>
                        handleRoleChange(user._id, e.target.value as UserRole)
                      }
                      className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold capitalize bg-white disabled:bg-slate-100 disabled:text-slate-400"
                    >
                      <option value="customer">Customer</option>
                      <option value="technician">Technician</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}