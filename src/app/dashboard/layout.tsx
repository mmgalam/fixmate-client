"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import ThemeToggle from "@/components/ThemeToggle";
import Logo from "@/components/Logo";
import { toast } from "sonner";
import type { LucideIcon } from "lucide-react";
import {
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
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const ROLE_MENUS: Record<string, NavItem[]> = {
  customer: [
    { label: "Overview", href: "/dashboard/customer", icon: LayoutDashboard },
    { label: "My Bookings", href: "/dashboard/customer/bookings", icon: ClipboardList },
    { label: "Payment History", href: "/dashboard/customer/payments", icon: CreditCard },
  ],
  technician: [
    { label: "Overview", href: "/dashboard/technician", icon: LayoutDashboard },
    { label: "Add a Service", href: "/dashboard/technician/add-service", icon: PlusCircle },
    { label: "My Services", href: "/dashboard/technician/my-services", icon: Briefcase },
    { label: "Manage Requests", href: "/dashboard/technician/requests", icon: Inbox },
  ],
  admin: [
    { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
    { label: "Manage Users", href: "/dashboard/admin/users", icon: Users },
    { label: "Service Approval", href: "/dashboard/admin/services", icon: CheckSquare },
    { label: "All Bookings", href: "/dashboard/admin/bookings", icon: ClipboardList },
    { label: "Transactions", href: "/dashboard/admin/transactions", icon: Receipt },
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
  const role = (user?.role as string) || "customer";

  useEffect(() => {
    if (isPending) return;

    if (!user) {
      router.replace(`/sign-in?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    if (pathname === "/dashboard") {
      router.replace(`/dashboard/${role}`);
      return;
    }

    if (!pathname.startsWith("/dashboard/profile")) {
      if (pathname.startsWith("/dashboard/customer") && role !== "customer") {
        router.replace(`/dashboard/${role}`);
      } else if (pathname.startsWith("/dashboard/technician") && role !== "technician") {
        router.replace(`/dashboard/${role}`);
      } else if (pathname.startsWith("/dashboard/admin") && role !== "admin") {
        router.replace(`/dashboard/${role}`);
      }
    }
  }, [user, isPending, pathname, role, router]);

  // Close mobile sidebar on Escape key and lock background scroll while open
  useEffect(() => {
    if (!sidebarOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [sidebarOpen]);

  if (isPending || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F4F6FB] dark:bg-[#060913]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  const menuItems = [
    ...(ROLE_MENUS[role] || ROLE_MENUS.customer),
    { label: "Update Profile", href: "/dashboard/profile", icon: UserCog },
  ];

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
    router.push("/");
  };

  return (
    <div className="flex min-h-screen bg-[#F4F6FB] text-slate-900 transition-colors dark:bg-[#060913] dark:text-slate-100">
      {sidebarOpen && (
        <div
          aria-hidden="true"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Collapsible Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col border-r border-slate-800/80 bg-slate-950 text-slate-300 transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-800/80 px-5">
          <Logo variant="footer" />
          <button
            type="button"
            aria-label="Close sidebar"
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-900 hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1.5 overflow-y-auto px-3 py-5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-linear-to-r from-indigo-600 to-cyan-600 text-white shadow-lg shadow-indigo-600/25"
                    : "text-slate-300 hover:bg-slate-900 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-1 border-t border-slate-800/80 p-3">
          <Link
            href="/"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-900 hover:text-white"
          >
            <Home className="h-4 w-4 shrink-0" />
            Back to Home
          </Link>
          <button
            type="button"
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-rose-400 transition hover:bg-rose-950/50"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/85 px-4 backdrop-blur-xl sm:px-6 dark:border-slate-800 dark:bg-slate-900/85">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl p-2 text-slate-600 transition hover:bg-slate-100 lg:hidden dark:text-slate-300 dark:hover:bg-slate-800"
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
            <span className="hidden text-sm font-bold capitalize text-slate-500 sm:inline dark:text-slate-400">
              {role} Workspace
            </span>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <ThemeToggle />

            <div className="text-right">
              <p className="max-w-27.5 truncate text-xs font-bold leading-none text-slate-900 sm:max-w-45 sm:text-sm dark:text-white">
                {user.name}
              </p>
              <span className="mt-1 inline-block rounded-full border border-indigo-100 bg-indigo-50 px-2 py-0.5 text-[10px] font-bold uppercase text-indigo-700 dark:border-indigo-800/60 dark:bg-indigo-950 dark:text-cyan-300">
                {role}
              </span>
            </div>

            <Image
              src={
                user.image ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  user.name || "User",
                )}&background=4f46e5&color=fff`
              }
              alt={user.name || "User"}
              width={36}
              height={36}
              unoptimized
              className="h-9 w-9 shrink-0 rounded-full border border-slate-200 object-cover dark:border-slate-700"
            />
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}