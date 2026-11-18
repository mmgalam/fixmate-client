import Link from "next/link";
import { Wrench, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center">
              <Wrench className="w-5 h-5" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-white">
              Fix<span className="text-blue-500">Mate</span>
            </span>
          </Link>
          <p className="mt-3 text-sm text-slate-400 leading-relaxed">
            Trusted smart device and home appliance repair booking. Track every
            step and pay safely only after the repair is completed.
          </p>
          {/* Social Links with New X Logo */}
          <div className="mt-5 flex items-center gap-3">
            <a
              href="https://x.com"
              target="_blank"
              rel="noreferrer"
              aria-label="X (formerly Twitter)"
              className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-blue-600 text-white flex items-center justify-center transition"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
            Quick Links
          </h4>
          <ul className="space-y-2.5 text-sm">
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
                How It Works / About
              </Link>
            </li>
            <li>
              <Link href="/sign-up" className="hover:text-white transition">
                Join as a Technician
              </Link>
            </li>
          </ul>
        </div>

        {/* Popular Categories */}
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
            Popular Categories
          </h4>
          <ul className="space-y-2.5 text-sm">
            {[
              "Smartphone",
              "Laptop & PC",
              "AC",
              "Refrigerator",
              "Washing Machine",
            ].map((cat) => (
              <li key={cat}>
                <Link
                  href={`/services?category=${encodeURIComponent(cat)}`}
                  className="hover:text-white transition"
                >
                  {cat} Repair
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
            Contact Us
          </h4>
          <ul className="space-y-3 text-sm text-slate-400">
            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-blue-500 shrink-0" />
              support@fixmate.com
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-blue-500 shrink-0" />
              +880 1700-000000
            </li>
            <li className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-blue-500 shrink-0" />
              Dhanmondi, Dhaka, Bangladesh
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800 py-5 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} FixMate. All rights reserved.
      </div>
    </footer>
  );
}
