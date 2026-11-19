import Link from "next/link";
import { Wrench, Mail, Phone, MapPin } from "lucide-react";

const categories = [
  "Smartphone",
  "Laptop & PC",
  "AC",
  "Refrigerator",
  "TV",
  "Washing Machine",
  "Electrical",
];

const headingClass =
  "mb-4 text-sm font-bold uppercase tracking-wider text-white";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-900 text-slate-300">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        {/* Brand */}
        <div>
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white">
              <Wrench className="h-5 w-5" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-white">
              Fix<span className="text-teal-400">Mate</span>
            </span>
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-slate-400">
            Trusted device and home appliance repair booking. Track every step
            and pay safely only after the repair is completed.
          </p>
          <div className="mt-5">
            <a
              href="https://x.com"
              target="_blank"
              rel="noreferrer"
              aria-label="X (formerly Twitter)"
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-white transition hover:bg-primary"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h4 className={headingClass}>Quick Links</h4>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link href="/" className="transition hover:text-white">
                Home
              </Link>
            </li>
            <li>
              <Link href="/services" className="transition hover:text-white">
                Browse Services
              </Link>
            </li>
            <li>
              <Link href="/about" className="transition hover:text-white">
                How It Works / About
              </Link>
            </li>
            <li>
              <Link href="/sign-up" className="transition hover:text-white">
                Join as a Technician
              </Link>
            </li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h4 className={headingClass}>Popular Categories</h4>
          <ul className="space-y-2.5 text-sm">
            {categories.slice(0, 6).map((cat) => (
              <li key={cat}>
                <Link
                  href={`/services?category=${encodeURIComponent(cat)}`}
                  className="transition hover:text-white"
                >
                  {cat} Repair
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className={headingClass}>Contact Us</h4>
          <ul className="space-y-3 text-sm text-slate-400">
            <li className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 shrink-0 text-teal-400" />
              support@fixmate.com
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 shrink-0 text-teal-400" />
              +880 1700-000000
            </li>
            <li className="flex items-center gap-2.5">
              <MapPin className="h-4 w-4 shrink-0 text-teal-400" />
              Dhanmondi, Dhaka, Bangladesh
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800 py-5 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} FixMate. All rights reserved.
      </div>
    </footer>
  );
}