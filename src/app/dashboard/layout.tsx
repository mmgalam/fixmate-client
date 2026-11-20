'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from '@/lib/auth-client';
import ThemeToggle from '@/components/ThemeToggle';
import { toast } from 'sonner';
import type { LucideIcon } from 'lucide-react';
import {
  Wrench,
  LayoutDashboard,
  ClipboardList,
  CreditCard,
  PlusCircle,
  Briefcase,
  Inbox,
  Users,
  CheckSquare,
  Receipt,
  UserCog,
  Home,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const ROLE_MENUS: Record<string, NavItem[]> = {
  customer: [
    { label: 'Overview', href: '/dashboard/customer', icon: LayoutDashboard },
    { label: 'My Bookings', href: '/dashboard/customer/bookings', icon: ClipboardList },
    { label: 'Payment History', href: '/dashboard/customer/payments', icon: CreditCard },
  ],
  technician: [
    { label: 'Overview', href: '/dashboard/technician', icon: LayoutDashboard },
    { label: 'Add a Service', href: '/dashboard/technician/add-service', icon: PlusCircle },
    { label: 'My Services', href: '/dashboard/technician/my-services', icon: Briefcase },
    { label: 'Manage Requests', href: '/dashboard/technician/requests', icon: Inbox },
  ],
  admin: [
    { label: 'Overview', href: '/dashboard/admin', icon: LayoutDashboard },
    { label: 'Manage Users', href: '/dashboard/admin/users', icon: Users },
    { label: 'Service Approval', href: '/dashboard/admin/services', icon: CheckSquare },
    { label: 'All Bookings', href: '/dashboard/admin/bookings', icon: ClipboardList },
    { label: 'Transactions', href: '/dashboard/admin/transactions', icon: Receipt },
  ],
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const user = session?.user;
  const role = (user?.role as string) || 'customer';

  useEffect(() => {
    if (isPending) return;

    if (!user) {
      router.replace(`/sign-in?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    if (pathname === '/dashboard') {
      router.replace(`/dashboard/${role}`);
      return;
    }

    if (!pathname.startsWith('/dashboard/profile')) {
      if (pathname.startsWith('/dashboard/customer') && role !== 'customer') {
        router.replace(`/dashboard/${role}`);
      } else if (pathname.startsWith('/dashboard/technician') && role !== 'technician') {
        router.replace(`/dashboard/${role}`);
      } else if (pathname.startsWith('/dashboard/admin') && role !== 'admin') {
        router.replace(`/dashboard/${role}`);
      }
    }
  }, [user, isPending, pathname, role, router]);

  if (isPending || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F6FB] dark:bg-[#060913]">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const menuItems = [
    ...(ROLE_MENUS[role] || ROLE_MENUS.customer),
    { label: 'Update Profile', href: '/dashboard/profile', icon: UserCog },
  ];

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully');
    router.push('/');
  };

  return (
    <div className="min-h-screen flex bg-[#F4F6FB] dark:bg-[#060913] text-slate-900 dark:text-slate-100 transition-colors">
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Collapsible Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-950 text-slate-300 border-r border-slate-800/80 flex flex-col transition-transform duration-200 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800/80">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-linear-to-br from-indigo-600 to-cyan-500 text-white flex items-center justify-center shadow-md shadow-indigo-600/30">
              <Wrench className="w-4 h-4" />
            </div>
            <span
              style={{ fontFamily: 'var(--font-display)' }}
              className="text-lg font-black text-white"
            >
              Fix<span className="text-cyan-400">Mate</span>
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-5 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-linear-to-r from-indigo-600 to-cyan-600 text-white shadow-lg shadow-indigo-600/25'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-800/80 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-900 hover:text-white transition"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-950/50 transition"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-sm font-bold text-slate-500 dark:text-slate-400 capitalize hidden sm:inline">
              {role} Workspace
            </span>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-900 dark:text-white leading-none">
                {user.name}
              </p>
              <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-cyan-300 border border-indigo-100 dark:border-indigo-800">
                {role}
              </span>
            </div>

            <Image
              src={
                user.image ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  user.name || 'User'
                )}&background=4f46e5&color=fff`
              }
              alt={user.name || 'User'}
              width={36}
              height={36}
              unoptimized
              className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700"
            />
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}