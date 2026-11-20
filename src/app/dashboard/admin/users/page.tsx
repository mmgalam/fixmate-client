'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSession } from '@/lib/auth-client';
import { fetchWithAuth } from '@/lib/api';
import type { UserProfile } from '@/types';
import { toast } from 'sonner';

export default function AdminManageUsersPage() {
  const { data: session } = useSession();
  const currentEmail = session?.user?.email;

  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let active = true;
    fetchWithAuth('/api/admin/users')
      .then((data: unknown) => {
        if (active) setUsers(Array.isArray(data) ? (data as UserProfile[]) : []);
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
  }, [refreshKey]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await fetchWithAuth(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        body: JSON.stringify({ role: newRole }),
      });
      toast.success(`User role updated to ${newRole}`);
      setRefreshKey((k) => k + 1);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Role update failed');
    }
  };

  if (loading) {
    return <div className="h-64 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 animate-pulse" />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 style={{ fontFamily: 'var(--font-display)' }} className="text-2xl font-black text-slate-950 dark:text-white">
          Manage Users
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Update user roles across Customer, Technician, and Admin[cite: 2]
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-3d-card overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
              <th className="py-3.5 px-4">User</th>
              <th className="py-3.5 px-4">Email</th>
              <th className="py-3.5 px-4">Role</th>
              <th className="py-3.5 px-4">Joined</th>
              <th className="py-3.5 px-4 text-right">Change Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
            {users.map((u) => {
              const isSelf = u.email === currentEmail;
              return (
                <tr key={u._id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <Image
                        src={
                          u.image ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name || 'U')}&background=4f46e5&color=fff`
                        }
                        alt={u.name}
                        width={36}
                        height={36}
                        unoptimized
                        className="w-9 h-9 rounded-full object-cover"
                      />
                      <span className="font-bold text-slate-900 dark:text-white">{u.name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">{u.email}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-cyan-300">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <select
                      disabled={isSelf}
                      value={u.role}
                      onChange={(e) => handleRoleChange(u._id, e.target.value)}
                      title={isSelf ? 'You cannot change your own role' : 'Change role'}
                      className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold disabled:opacity-50 disabled:cursor-not-allowed"
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