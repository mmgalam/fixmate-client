import Link from "next/link";
import Logo from "@/components/Logo";
import { Mail, Phone, MapPin, ArrowUpRight, ChevronRight } from "lucide-react";

const CATEGORIES = [
  "Smartphone",
  "Laptop & PC",
  "AC",
  "Refrigerator",
  "TV",
  "Washing Machine",
  "Electrical",
];

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "Browse Services", href: "/services" },
  { label: "How It Works", href: "/about" },
  { label: "Join as a Technician", href: "/sign-up" },
];

const CONTACTS = [
  { icon: Mail, label: "Email", value: "support@fixmate.com" },
  { icon: Phone, label: "Phone", value: "+880 1700-000000" },
  { icon: MapPin, label: "Address", value: "Dhanmondi, Dhaka, Bangladesh" },
];

export default function Footer() {
  return (
    <footer className="relative mt-10 overflow-hidden bg-slate-950 text-slate-300">
      {/* top gradient line */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-indigo-500 to-transparent"
      />
      {/* glow blobs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-indigo-600/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-cyan-500/15 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:px-8">
        {/* CTA strip */}
        <div className="flex flex-col items-start justify-between gap-5 rounded-3xl border border-white/10 bg-linear-to-r from-indigo-600/20 via-slate-900 to-cyan-600/20 p-7 shadow-[0_20px_50px_-15px_rgba(79,70,229,0.45)] sm:flex-row sm:items-center sm:p-9">
          <div>
            <h3
              style={{ fontFamily: "var(--font-display)" }}
              className="text-2xl font-black text-white"
            >
              Need something repaired?
            </h3>
            <p className="mt-1 text-sm text-slate-300">
              Find a verified technician and pay only after the job is done.
            </p>
          </div>
          <Link
            href="/services"
            className="group inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-indigo-700 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_30px_-8px_rgba(255,255,255,0.35)]"
          >
            Browse services
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 gap-10 py-14 md:grid-cols-2 lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Logo variant="footer" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-slate-400">
              On-demand smart device and home appliance repair booking. Follow
              every stage of the job and pay securely only after the repair is
              completed.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="FixMate on X"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-indigo-400 hover:bg-indigo-600 hover:shadow-[0_12px_25px_-6px_rgba(99,102,241,0.7)]"
              >
                <svg
                  className="h-4 w-4 fill-current"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div className="lg:col-span-2">
            <h4 className="mb-5 text-sm font-bold text-white">Quick links</h4>
            <ul className="space-y-3 text-sm">
              {QUICK_LINKS.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="group inline-flex items-center gap-1 text-slate-400 transition-all duration-300 hover:translate-x-1 hover:text-white"
                  >
                    <ChevronRight className="h-3.5 w-3.5 text-indigo-400 opacity-0 transition-opacity group-hover:opacity-100" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="lg:col-span-3">
            <h4 className="mb-5 text-sm font-bold text-white">
              Popular categories
            </h4>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat}
                  href={`/services?category=${encodeURIComponent(cat)}`}
                  className="rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-slate-300 transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-400 hover:bg-indigo-600 hover:text-white hover:shadow-[0_10px_20px_-6px_rgba(99,102,241,0.65)]"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h4 className="mb-5 text-sm font-bold text-white">Contact</h4>
            <ul className="space-y-3">
              {CONTACTS.map(({ icon: Icon, label, value }) => (
                <li
                  key={label}
                  className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-400/60 hover:bg-white/10 hover:shadow-[0_15px_30px_-10px_rgba(99,102,241,0.55)]"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-300 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs text-slate-400">{label}</span>
                    <span className="block truncate text-sm font-medium text-slate-100">
                      {value}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/10 py-6 text-xs text-slate-400 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} FixMate Inc. All rights reserved.</p>
          <p>Built for safer, transparent device repair.</p>
        </div>
      </div>
    </footer>
  );
}