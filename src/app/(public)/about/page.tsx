import Link from "next/link";
import {
  ShieldCheck,
  Wrench,
  CreditCard,
  Users,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200/70 dark:border-indigo-800/60 text-indigo-700 dark:text-cyan-300 text-xs font-bold mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>OUR MISSION & WORKFLOW</span>
        </div>
        <h1
          style={{ fontFamily: "var(--font-display)" }}
          className="text-3xl sm:text-5xl font-black text-slate-950 dark:text-white tracking-tight"
        >
          How FixMate Works
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          FixMate connects everyday device owners with verified local repair
          technicians—bringing transparency, live status tracking, and
          post-repair Stripe payments to every job.
        </p>
      </div>

      <div className="mt-14 grid sm:grid-cols-2 gap-6">
        {[
          {
            title: "Verified Service Listings",
            desc: "Technicians publish detailed repair offerings with clear starting prices and service modes. Every listing goes through admin moderation before going live[cite: 3].",
            icon: ShieldCheck,
          },
          {
            title: "Clear Step-by-Step Pipeline",
            desc: "From Requested to Accepted, In Progress, and Completed, customers never have to wonder what is happening with their device[cite: 3].",
            icon: Wrench,
          },
          {
            title: "Pay-After-Completion Protection",
            desc: "Customers only pay once the technician finishes the repair and confirms the final amount, processed securely through Stripe Checkout[cite: 3].",
            icon: CreditCard,
          },
          {
            title: "Built for Local Technicians",
            desc: "Skilled technicians get a dedicated dashboard to showcase their expertise, toggle availability, and manage incoming requests[cite: 3].",
            icon: Users,
          },
        ].map((card) => (
          <div
            key={card.title}
            className="bg-white dark:bg-slate-900 p-7 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-3d-card hover:-translate-y-1 transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-indigo-600 to-cyan-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/20 mb-5">
              <card.icon className="w-6 h-6" />
            </div>
            <h2
              style={{ fontFamily: "var(--font-display)" }}
              className="text-xl font-extrabold text-slate-950 dark:text-white"
            >
              {card.title}
            </h2>
            <p className="mt-2.5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {card.desc}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-14 text-center">
        <Link
          href="/services"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-linear-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white text-sm font-bold shadow-lg shadow-indigo-600/25 transition"
        >
          Explore Available Services
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
