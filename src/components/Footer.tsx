import Link from "next/link";
import { Wrench, Mail, Phone, MapPin } from "lucide-react";

const CATEGORIES = [
  "Smartphone",
  "Laptop & PC",
  "AC",
  "Refrigerator",
  "TV",
  "Washing Machine",
  "Electrical",
];

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand (same logo style as navbar) */}
        <div>
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-indigo-600 via-blue-600 to-cyan-500 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30">
              <Wrench className="w-4 h-4" />
            </div>
            <span
              style={{ fontFamily: "var(--font-display)" }}
              className="text-xl font-black tracking-tight text-white"
            >
              Fix
              <span className="bg-linear-to-r from-indigo-400 to-cyan-300 bg-clip-text text-transparent">
                Mate
              </span>
            </span>
          </Link>
          <p className="mt-4 text-sm text-slate-400 leading-relaxed">
            On-demand smart device and home appliance repair booking. Follow
            every stage of the job and pay securely only after the repair is
            completed.
          </p>

          {/* New X logo */}
          <div className="mt-5 flex items-center gap-3">
            <a
              href="https://x.com"
              target="_blank"
              rel="noreferrer"
              aria-label="FixMate on X"
              className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500 hover:bg-indigo-600 text-white flex items-center justify-center transition"
            >
              <svg
                className="w-4 h-4 fill-current"
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
          <h4 className="text-sm font-bold text-white mb-4">Quick links</h4>
          <ul className="space-y-2.5 text-sm text-slate-400">
            <li>
              <Link href="/" className="hover:text-white transition">
                Home
              </Link>
            </li>
            <li>
              <Link href="/services" className="hover:text-white transition">
                Browse Services
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-white transition">
                How It Works
              </Link>
            </li>
            <li>
              <Link href="/sign-up" className="hover:text-white transition">
                Join as a Technician
              </Link>
            </li>
          </ul>
        </div>

        {/* Popular categories */}
        <div>
          <h4 className="text-sm font-bold text-white mb-4">
            Popular categories
          </h4>
          <ul className="space-y-2.5 text-sm text-slate-400">
            {CATEGORIES.map((cat) => (
              <li key={cat}>
                <Link
                  href={`/services?category=${encodeURIComponent(cat)}`}
                  className="hover:text-white transition"
                >
                  {cat}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-sm font-bold text-white mb-4">Contact</h4>
          <ul className="space-y-3 text-sm text-slate-400">
            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
              support@fixmate.com
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-indigo-400 shrink-0" />
              +880 1700-000000
            </li>
            <li className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
              Dhanmondi, Dhaka, Bangladesh
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-900 py-5 text-center text-xs text-slate-400">
        &copy; {new Date().getFullYear()} FixMate Inc. All rights reserved.
      </div>
    </footer>
  );
}
