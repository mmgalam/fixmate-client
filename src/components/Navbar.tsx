"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { toast } from "sonner";
import ThemeToggle from "@/components/ThemeToggle";
import {
  Wrench,
  Menu,
  X,
  LayoutDashboard,
  UserCog,
  LogOut,
  ChevronDown,
  Sparkles,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "How It Works", href: "/about" },
  ];

  const user = session?.user;
  const role = (user?.role as string) || "customer";
  const dashboardHref = `/dashboard/${role}`;

  const handleSignOut = async () => {
    await signOut();
    setDropdownOpen(false);
    setMobileOpen(false);
    toast.success("Signed out successfully");
    router.push("/");
  };

  return (
    <header className="sticky top-3 z-50 px-3 sm:px-6">
      <div className="max-w-7xl mx-auto h-16 px-4 sm:px-6 rounded-2xl bg-white/85 dark:bg-slate-900/85 backdrop-blur-2xl border border-white/80 dark:border-slate-800/90 shadow-[0_14px_35px_-10px_rgba(15,23,42,0.12)] dark:shadow-[0_14px_35px_-10px_rgba(0,0,0,0.65)] flex items-center justify-between">
        {/* Consistent Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-linear-to-br from-indigo-600 via-blue-600 to-cyan-500 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 group-hover:rotate-6 group-hover:scale-105 transition-all duration-300">
            <Wrench className="w-4 h-4" />
          </div>
          <span
            style={{ fontFamily: "var(--font-display)" }}
            className="text-xl font-black tracking-tight text-slate-950 dark:text-white"
          >
            Fix
            <span className="bg-linear-to-r from-indigo-600 to-cyan-400 bg-clip-text text-transparent">
              Mate
            </span>
          </span>
        </Link>

        {/* Desktop Pill Nav */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/90 dark:bg-slate-800/80 p-1.5 rounded-xl border border-slate-200/70 dark:border-slate-700/70">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all duration-200 ${
                  isActive
                    ? "bg-white dark:bg-slate-950 text-indigo-600 dark:text-cyan-400 shadow-xs"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Theme Toggle + Auth Actions */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />

          {isPending ? (
            <div className="w-28 h-9 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
          ) : !user ? (
            <>
              <Link
                href="/sign-in"
                className="px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-cyan-400 transition"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-bold bg-linear-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white rounded-xl shadow-[0_10px_20px_-5px_rgba(79,70,229,0.45)] hover:-translate-y-0.5 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Get Started
              </Link>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 pl-1.5 pr-3 py-1 rounded-full border border-slate-200/90 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-md shadow-slate-900/5 hover:shadow-lg transition-all"
              >
                <Image
                  src={
                    user.image ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user.name || "User",
                    )}&background=4f46e5&color=fff`
                  }
                  alt={user.name || "User"}
                  width={32}
                  height={32}
                  unoptimized
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-900 dark:text-white max-w-27.5 truncate">
                    {user.name}
                  </p>
                  <p className="text-[10px] uppercase tracking-wider text-indigo-600 dark:text-cyan-400 font-extrabold">
                    {role}
                  </p>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {dropdownOpen && (
                <div
                  onMouseLeave={() => setDropdownOpen(false)}
                  className="absolute right-0 mt-2.5 w-60 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/80 dark:border-slate-800 py-2 z-50"
                >
                  <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {user.name}
                    </p>
                    <span className="inline-block mt-1 px-2.5 py-0.5 text-[11px] font-bold uppercase rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-cyan-300 border border-indigo-100 dark:border-indigo-800">
                      {role}
                    </span>
                  </div>

                  <Link
                    href={dashboardHref}
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-indigo-50/60 dark:hover:bg-slate-800"
                  >
                    <LayoutDashboard className="w-4 h-4 text-indigo-600 dark:text-cyan-400" />
                    Dashboard
                  </Link>

                  <Link
                    href="/dashboard/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-indigo-50/60 dark:hover:bg-slate-800"
                  >
                    <UserCog className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    Update Profile
                  </Link>

                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 border-t border-slate-100 dark:border-slate-800 mt-1"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Theme Toggle + Hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden mt-2 max-w-7xl mx-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`block px-3 py-2 rounded-xl text-sm font-bold ${
                pathname === link.href
                  ? "bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-cyan-400"
                  : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              {link.label}
            </Link>
          ))}

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            {!user ? (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/sign-in"
                  onClick={() => setMobileOpen(false)}
                  className="py-2.5 text-center border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  onClick={() => setMobileOpen(false)}
                  className="py-2.5 text-center bg-indigo-600 rounded-xl text-sm font-bold text-white"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between px-2 pb-2">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {user.name}
                  </span>
                  <span className="px-2.5 py-0.5 text-xs font-bold uppercase rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-cyan-300">
                    {role}
                  </span>
                </div>
                <Link
                  href={dashboardHref}
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/profile"
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Update Profile
                </Link>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-3 py-2 rounded-xl text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
