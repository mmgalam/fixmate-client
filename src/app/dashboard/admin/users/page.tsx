"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSession } from "@/lib/auth-client";
import { fetchWithAuth } from "@/lib/api";
import type { UserProfile } from "@/types";
import { toast } from "sonner";
import { Users } from "lucide-react";

export default function AdminManageUsersPage() {
  const { data: session } = useSession();
  const currentEmail = session?.user?.email;

  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetchWithAuth("/api/admin/users")
      .then((data: unknown) => {
        if (active) setUsers(Array.isArray(data) ? (data as UserProfile[]) : []);
      })
      .catch((err: unknown) => {
        if (active) {
          toast.error(
            err instanceof Error ? err.message : "Failed to load users",
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

  const handleRoleChange = async (userId: string, newRole: string) => {
    setUpdatingId(userId);
    try {
      await fetchWithAuth(`/api/admin/users/${userId}/role`, {
        method: "PATCH",
        body: JSON.stringify({ role: newRole }),
      });
      toast.success(`User role updated to ${newRole}`);
      setRefreshKey((k) => k + 1);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Role update failed");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="h-64 animate-pulse rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900" />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1
          style={{ fontFamily: "var(--font-display)" }}
          className="text-2xl font-black text-slate-950 sm:text-3xl dark:text-white"
        >
          Manage Users
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Update user roles across Customer, Technician, and Admin
        </p>
      </div>

      {users.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-14 text-center shadow-3d-card dark:border-slate-800 dark:bg-slate-900">
          <Users className="mx-auto mb-3 h-12 w-12 text-slate-300 dark:text-slate-600" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            No users found
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Registered accounts will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-3d-card dark:border-slate-800 dark:bg-slate-900">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-bold uppercase text-slate-500 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400">
                <th className="whitespace-nowrap px-4 py-3.5">User</th>
                <th className="whitespace-nowrap px-4 py-3.5">Email</th>
                <th className="whitespace-nowrap px-4 py-3.5">Role</th>
                <th className="whitespace-nowrap px-4 py-3.5">Joined</th>
                <th className="whitespace-nowrap px-4 py-3.5 text-right">
                  Change Role
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm dark:divide-slate-800">
              {users.map((u) => {
                const isSelf = u.email === currentEmail;
                return (
                  <tr
                    key={u._id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40"
                  >
                    <td className="whitespace-nowrap px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <Image
                          src={
                            u.image ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              u.name || "U",
                            )}&background=4f46e5&color=fff`
                          }
                          alt={u.name}
                          width={36}
                          height={36}
                          unoptimized
                          className="h-9 w-9 shrink-0 rounded-full object-cover"
                        />
                        <span className="font-bold text-slate-900 dark:text-white">
                          {u.name}
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-slate-600 dark:text-slate-300">
                      {u.email}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5">
                      <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-bold uppercase text-indigo-700 dark:bg-indigo-950 dark:text-cyan-300">
                        {u.role}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-slate-500 dark:text-slate-400">
                      {u.createdAt
                        ? new Date(u.createdAt).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-right">
                      <select
                        disabled={isSelf || updatingId === u._id}
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        aria-label={`Change role for ${u.name}`}
                        title={
                          isSelf
                            ? "You cannot change your own role"
                            : "Change role"
                        }
                        className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 focus:border-indigo-600 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
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
      )}
    </div>
  );
}