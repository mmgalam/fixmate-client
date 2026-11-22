"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { toast } from "sonner";
import ThemeToggle from "@/components/ThemeToggle";
import Logo from "@/components/Logo";
import {
  Menu,
  X,
  LayoutDashboard,
  UserCog,
  LogOut,
  ChevronDown,
} from "lucide-react";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "How It Works", href: "/about" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close menus automatically when route changes (without useEffect)
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMobileOpen(false);
    setDropdownOpen(false);
  }

  // Close profile dropdown on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDropdownOpen(false);
        setMobileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const user = session?.user;
  const role = (user?.role as string) || "customer";
  const dashboardHref = `/dashboard/${role}`;
  const avatarSrc =
    user?.image ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user?.name || "User",
    )}&background=4f46e5&color=fff`;

  const handleSignOut = async () => {
    await signOut();
    setDropdownOpen(false);
    setMobileOpen(false);
    toast.success("Signed out successfully");
    router.push("/");
  };

  return (
    <header className="sticky top-3 z-50 px-3 sm:px-6">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between rounded-2xl border border-slate-200/80 bg-white/95 px-4 shadow-lg shadow-slate-900/5 backdrop-blur-md sm:px-6 dark:border-slate-800 dark:bg-slate-900/95 dark:shadow-slate-950/40">
        {/* Brand logo (shared component) */}
        <Logo />

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-100/90 p-1.5 dark:border-slate-700/80 dark:bg-slate-800/90">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-4 py-1.5 text-sm font-bold transition-all duration-200 ${
                isActive(link.href)
                  ? "bg-white text-indigo-600 shadow-xs dark:bg-slate-950 dark:text-cyan-400"
                  : "text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop theme toggle + auth */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />

          {isPending ? (
            <div className="h-9 w-28 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
          ) : !user ? (
            <>
              <Link
                href="/sign-in"
                className="px-4 py-2 text-sm font-bold text-slate-700 transition hover:text-indigo-600 dark:text-slate-200 dark:hover:text-cyan-400"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="inline-flex items-center rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-indigo-600/20 transition-all hover:-translate-y-0.5 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={dropdownOpen}
                className="flex cursor-pointer items-center gap-2.5 rounded-full border border-slate-200 bg-white py-1 pl-1.5 pr-3 shadow-md shadow-slate-900/5 transition-all hover:shadow-lg dark:border-slate-700 dark:bg-slate-800"
              >
                <Image
                  src={avatarSrc}
                  alt={user.name || "User"}
                  width={32}
                  height={32}
                  unoptimized
                  className="h-8 w-8 rounded-full object-cover ring-2 ring-indigo-500/20"
                />
                <div className="text-left">
                  <p className="max-w-27.5 truncate text-xs font-bold text-slate-900 dark:text-white">
                    {user.name}
                  </p>
                  <p className="text-xs font-bold capitalize text-indigo-600 dark:text-cyan-400">
                    {role}
                  </p>
                </div>
                <ChevronDown
                  className={`h-4 w-4 text-slate-500 transition-transform duration-200 dark:text-slate-400 ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {dropdownOpen && (
                <div
                  role="menu"
                  className="absolute right-0 z-50 mt-2.5 w-60 rounded-2xl border border-slate-200 bg-white py-2 shadow-2xl dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="border-b border-slate-100 px-4 py-2.5 dark:border-slate-800">
                    <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
                      {user.name}
                    </p>
                    <span className="mt-1 inline-block rounded-full border border-indigo-100 bg-indigo-50 px-2.5 py-0.5 text-xs font-bold capitalize text-indigo-700 dark:border-indigo-800/60 dark:bg-indigo-950/80 dark:text-cyan-300">
                      {role}
                    </span>
                  </div>

                  <Link
                    href={dashboardHref}
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-indigo-50/60 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    <LayoutDashboard className="h-4 w-4 text-indigo-600 dark:text-cyan-400" />
                    Dashboard
                  </Link>

                  <Link
                    href="/dashboard/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-indigo-50/60 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    <UserCog className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                    Update Profile
                  </Link>

                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="mt-1 flex w-full cursor-pointer items-center gap-2.5 border-t border-slate-100 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:border-slate-800 dark:text-red-400 dark:hover:bg-red-950/40"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile theme toggle + hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="cursor-pointer rounded-xl p-2 text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="mx-auto mt-2 max-w-7xl space-y-3 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-2xl backdrop-blur-md md:hidden dark:border-slate-800 dark:bg-slate-900/95">
          <div className="space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block rounded-xl px-3 py-2.5 text-sm font-bold transition ${
                  isActive(link.href)
                    ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/80 dark:text-cyan-400"
                    : "text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-3 dark:border-slate-800">
            {isPending ? (
              <div className="h-10 w-full animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
            ) : !user ? (
              <div className="grid grid-cols-2 gap-2.5">
                <Link
                  href="/sign-in"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl border border-slate-200 py-2.5 text-center text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl bg-indigo-600 py-2.5 text-center text-sm font-bold text-white transition hover:bg-indigo-700 dark:bg-indigo-500"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2 rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800/60">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <Image
                      src={avatarSrc}
                      alt={user.name || "User"}
                      width={32}
                      height={32}
                      unoptimized
                      className="h-8 w-8 shrink-0 rounded-full object-cover"
                    />
                    <span className="truncate text-sm font-bold text-slate-900 dark:text-white">
                      {user.name}
                    </span>
                  </div>
                  <span className="shrink-0 rounded-full border border-indigo-100 bg-indigo-50 px-2.5 py-0.5 text-xs font-bold capitalize text-indigo-700 dark:border-indigo-800/60 dark:bg-indigo-950 dark:text-cyan-300">
                    {role}
                  </span>
                </div>

                <Link
                  href={dashboardHref}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <LayoutDashboard className="h-4 w-4 text-indigo-600 dark:text-cyan-400" />
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/profile"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <UserCog className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                  Update Profile
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
                >
                  <LogOut className="h-4 w-4" />
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
