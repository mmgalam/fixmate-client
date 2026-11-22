import Link from "next/link";
import Logo from "@/components/Logo";
import { Mail, Phone, MapPin, ChevronRight } from "lucide-react";

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
  {
    icon: Mail,
    label: "Email",
    value: "support@fixmate.com",
    href: "mailto:support@fixmate.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+880 1700-000000",
    href: "tel:+8801700000000",
  },
  {
    icon: MapPin,
    label: "Address",
    value: "Dhanmondi, Dhaka, Bangladesh",
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-slate-800/80 bg-slate-950 text-slate-300">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-indigo-500 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-indigo-600/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-cyan-500/15 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 py-12 sm:grid-cols-2 sm:gap-10 sm:py-16 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Logo variant="footer" />
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              On-demand smart device and home appliance repair booking. Follow
              every stage of the job and pay securely only after the repair is
              completed.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="FixMate on X"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-indigo-400 hover:bg-indigo-600 hover:shadow-[0_12px_25px_-6px_rgba(99,102,241,0.7)]"
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
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-white">
              Quick links
            </h4>
            <ul className="space-y-2.5 text-sm">
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
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-white">
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
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-white">
              Contact
            </h4>
            <ul className="space-y-3">
              {CONTACTS.map(({ icon: Icon, label, value, href }) => {
                const content = (
                  <div className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-400/60 hover:bg-white/10 hover:shadow-[0_15px_30px_-10px_rgba(99,102,241,0.55)]">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-300 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs text-slate-400">
                        {label}
                      </span>
                      <span className="block wrap-break-word text-sm font-medium text-slate-100">
                        {value}
                      </span>
                    </span>
                  </div>
                );

                return (
                  <li key={label}>
                    {href ? (
                      <a href={href} className="block">
                        {content}
                      </a>
                    ) : (
                      content
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-2 border-t border-white/10 py-6 text-center text-xs text-slate-400 sm:flex-row sm:text-left">
          <p>
            &copy; {new Date().getFullYear()} FixMate Inc. All rights reserved.
          </p>
          <p>Built for safer, transparent device repair.</p>
        </div>
      </div>
    </footer>
  );
}