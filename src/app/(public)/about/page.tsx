import Link from "next/link";
import {
  ShieldCheck,
  Wrench,
  CreditCard,
  Users,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const WORKFLOW_CARDS = [
  {
    title: "Verified Service Listings",
    desc: "Technicians publish detailed repair offerings with clear starting prices and service modes. Every listing goes through admin moderation before going live.",
    icon: ShieldCheck,
  },
  {
    title: "Clear Step-by-Step Pipeline",
    desc: "From Requested to Accepted, In Progress, and Completed, customers never have to wonder what is happening with their device.",
    icon: Wrench,
  },
  {
    title: "Pay-After-Completion Protection",
    desc: "Customers only pay once the technician finishes the repair and confirms the final amount, processed securely through Stripe Checkout.",
    icon: CreditCard,
  },
  {
    title: "Built for Local Technicians",
    desc: "Skilled technicians get a dedicated dashboard to showcase their expertise, toggle availability, and manage incoming requests.",
    icon: Users,
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-200/70 bg-indigo-50 px-3.5 py-1.5 text-xs font-bold text-indigo-700 dark:border-indigo-800/60 dark:bg-indigo-950/80 dark:text-cyan-300">
          <Sparkles className="h-3.5 w-3.5" />
          <span>OUR MISSION &amp; WORKFLOW</span>
        </div>
        <h1
          style={{ fontFamily: "var(--font-display)" }}
          className="text-3xl font-black tracking-tight text-slate-950 sm:text-5xl dark:text-white"
        >
          How FixMate Works
        </h1>
        <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-300">
          FixMate connects everyday device owners with verified local repair
          technicians—bringing transparency, live status tracking, and
          post-repair Stripe payments to every job.
        </p>
      </div>

      <div className="mt-14 grid gap-6 sm:grid-cols-2">
        {WORKFLOW_CARDS.map((card) => (
          <div
            key={card.title}
            className="flex flex-col rounded-3xl border border-slate-200/90 bg-white p-7 shadow-3d-card transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300/80 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-500/50"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-600 to-cyan-600 text-white shadow-lg shadow-indigo-600/20">
              <card.icon className="h-6 w-6" />
            </div>
            <h2
              style={{ fontFamily: "var(--font-display)" }}
              className="text-xl font-extrabold text-slate-950 dark:text-white"
            >
              {card.title}
            </h2>
            <p className="mt-2.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {card.desc}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-14 text-center">
        <Link
          href="/services"
          className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-indigo-600 to-cyan-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/25 transition hover:-translate-y-0.5 hover:from-indigo-700 hover:to-cyan-700"
        >
          Explore Available Services
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}