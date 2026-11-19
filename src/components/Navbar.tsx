"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { toast } from "sonner";
import {
  Wrench,
  Menu,
  X,
  LayoutDashboard,
  UserCog,
  LogOut,
  ChevronDown,
} from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();

  // menu কোন page-এ খোলা হয়েছে সেটা মনে রাখি। page বদলালে নিজে থেকেই বন্ধ হয় (useEffect লাগে না)
  const [mobilePath, setMobilePath] = useState<string | null>(null);
  const [dropdownPath, setDropdownPath] = useState<string | null>(null);
  const mobileOpen = mobilePath === pathname;
  const dropdownOpen = dropdownPath === pathname;

  const closeAll = () => {
    setMobilePath(null);
    setDropdownPath(null);
  };

  const user = session?.user;
  const role = (user as { role?: string } | undefined)?.role || "customer";
  const dashboardHref = `/dashboard/${role}`;
  const avatar =
    user?.image ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user?.name || "User",
    )}&background=0f766e&color=fff&format=png`;

  const handleSignOut = async () => {
    await signOut();
    closeAll();
    toast.success("Signed out successfully");
    router.push("/");
    router.refresh();
  };

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white shadow-md shadow-teal-700/20">
            <Wrench className="h-5 w-5" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-900">
            Fix<span className="text-primary">Mate</span>
          </span>
        </Link>

        {/* Desktop links */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                isActive(link.href)
                  ? "bg-teal-50 text-primary"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop auth */}
        <div className="hidden items-center gap-3 md:flex">
          {isPending ? (
            <div className="h-9 w-28 animate-pulse rounded-lg bg-slate-100" />
          ) : !user ? (
            <>
              <Link
                href="/sign-in"
                className="px-4 py-2 text-sm font-semibold text-slate-700 transition hover:text-primary"
              >
                Sign In
              </Link>
              <Link href="/sign-up" className="btn-primary px-5! py-2! text-sm">
                Sign Up
              </Link>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={() => setDropdownPath(dropdownOpen ? null : pathname)}
                className="flex items-center gap-2.5 rounded-full border border-slate-200 p-1.5 pr-3 transition hover:bg-slate-50"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={avatar}
                  alt={user.name || "User"}
                  className="h-8 w-8 rounded-full object-cover"
                />
                <span className="max-w-28 truncate text-sm font-semibold text-slate-800">
                  {user.name}
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-slate-500 transition ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {dropdownOpen && (
                <>
                  {/* বাইরে ক্লিক করলে বন্ধ হবে */}
                  <button
                    aria-label="Close menu"
                    className="fixed inset-0 z-40 cursor-default"
                    onClick={() => setDropdownPath(null)}
                  />
                  <div className="absolute right-0 z-50 mt-2 w-64 rounded-2xl border border-slate-200 bg-white py-2 shadow-xl">
                    <div className="border-b border-slate-100 px-4 py-3">
                      <p className="truncate text-sm font-bold text-slate-900">
                        {user.name}
                      </p>
                      <span className="mt-1 inline-block rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-semibold uppercase text-primary">
                        {role}
                      </span>
                    </div>
                    <Link
                      href={dashboardHref}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      <LayoutDashboard className="h-4 w-4 text-primary" />
                      Dashboard
                    </Link>
                    <Link
                      href="/dashboard/profile"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      <UserCog className="h-4 w-4 text-slate-500" />
                      Update Profile
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="mt-1 flex w-full items-center gap-2.5 border-t border-slate-100 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobilePath(mobileOpen ? null : pathname)}
          className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 md:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="space-y-1 border-t border-slate-200 bg-white px-4 pb-5 pt-3 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block rounded-lg px-3 py-2.5 text-sm font-semibold ${
                isActive(link.href)
                  ? "bg-teal-50 text-primary"
                  : "text-slate-700"
              }`}
            >
              {link.label}
            </Link>
          ))}

          <div className="border-t border-slate-100 pt-3">
            {!user ? (
              <div className="flex flex-col gap-2">
                <Link href="/sign-in" className="btn-outline w-full text-sm">
                  Sign In
                </Link>
                <Link href="/sign-up" className="btn-primary w-full text-sm">
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="flex items-center gap-2.5 px-3 pb-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={avatar}
                    alt={user.name || "User"}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <span className="text-sm font-bold text-slate-900">
                    {user.name}
                  </span>
                  <span className="rounded-full bg-teal-50 px-2 py-0.5 text-xs font-semibold uppercase text-primary">
                    {role}
                  </span>
                </div>
                <Link
                  href={dashboardHref}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/profile"
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Update Profile
                </Link>
                <button
                  onClick={handleSignOut}
                  className="block w-full rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-red-600 hover:bg-red-50"
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
