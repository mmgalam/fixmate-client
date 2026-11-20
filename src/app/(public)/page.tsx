import { Suspense } from "react";
import Link from "next/link";
import ServiceCard from "@/components/ServiceCard";
import SectionHeading from "@/components/SectionHeading";
import type { Service } from "@/types";
import {
  Search,
  Send,
  Wrench,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Smartphone,
  Laptop,
  Wind,
  Refrigerator,
  Tv,
  WashingMachine,
  Zap,
  Activity,
  Lock,
  ArrowRight,
  Cpu,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const CATEGORIES = [
  { name: "Smartphone", icon: Smartphone, desc: "Screen & battery" },
  { name: "Laptop & PC", icon: Laptop, desc: "Hardware & OS" },
  { name: "AC", icon: Wind, desc: "Servicing & gas" },
  { name: "Refrigerator", icon: Refrigerator, desc: "Cooling & PCB" },
  { name: "TV", icon: Tv, desc: "Panel & backlight" },
  { name: "Washing Machine", icon: WashingMachine, desc: "Drum & motor" },
  { name: "Electrical", icon: Zap, desc: "Wiring & fittings" },
];

const STATS = [
  { value: "50+", label: "Verified technicians" },
  { value: "1,200+", label: "Jobs completed" },
  { value: "4.8/5", label: "Average rating" },
  { value: "100%", label: "Pay after service" },
];

const STEPS = [
  {
    title: "Find a service",
    desc: "Filter admin-approved technicians by device category, area, and Home Visit or Shop Drop-off mode.",
    icon: Search,
  },
  {
    title: "Send a request",
    desc: "Describe the problem, choose a preferred date, and send your request with no advance fee.",
    icon: Send,
  },
  {
    title: "Technician fixes it",
    desc: "Follow the job from Accepted to In Progress and Completed inside your dashboard.",
    icon: Wrench,
  },
  {
    title: "Pay after completion",
    desc: "Pay the final amount through Stripe Checkout only after your device is fixed.",
    icon: CreditCard,
  },
];

async function getLatestServices(): Promise<Service[] | null> {
  // Retry once: a sleeping free-tier server can fail the first request.
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(`${API_URL}/api/services?limit=6`, {
        cache: "no-store",
        signal: AbortSignal.timeout(20000),
      });
      if (res.ok) return await res.json();
    } catch {
      // try again
    }
  }
  return null;
}

async function FeaturedServicesSection() {
  const latestServices = await getLatestServices();

  if (latestServices === null) {
    return (
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center">
        <p className="text-slate-600 dark:text-slate-400">
          Services are taking a moment to load. Please refresh the page.
        </p>
      </div>
    );
  }

  if (latestServices.length === 0) {
    return (
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center">
        <p className="text-slate-600 dark:text-slate-400">
          No approved services available yet.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
      {latestServices.map((service) => (
        <ServiceCard key={service._id} service={service} />
      ))}
    </div>
  );
}

function FeaturedServicesSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="h-96 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 animate-pulse"
        />
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <div>
      {/* 1. HERO */}
      <section className="bg-spatial-grid pt-14 pb-20 px-4 overflow-hidden border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6">
            <p className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-indigo-200/80 dark:border-indigo-500/30 text-indigo-700 dark:text-cyan-300 text-sm font-semibold mb-6 shadow-sm">
              <ShieldCheck className="w-4 h-4" />
              Verified technicians. Pay after service.
            </p>

            <h1
              style={{ fontFamily: "var(--font-display)" }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-950 dark:text-white leading-[1.08]"
            >
              Broken device? Get it fixed by verified technicians.
            </h1>

            <p className="mt-5 text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl">
              Book trusted experts for smartphones, laptops and home appliances.
              Follow every step of the repair and pay through Stripe only after
              the job is done.
            </p>

            <form
              action="/services"
              method="GET"
              className="mt-8 flex flex-col sm:flex-row gap-2 max-w-xl bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg"
            >
              <div className="flex-1 flex items-center pl-3">
                <Search className="w-4 h-4 text-indigo-600 dark:text-cyan-400 shrink-0" />
                <input
                  type="text"
                  name="search"
                  aria-label="Search repair services"
                  placeholder="Search iPhone screen, AC servicing, MacBook..."
                  className="w-full px-3 py-2.5 text-slate-950 dark:text-white placeholder:text-slate-500 text-sm bg-transparent focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
              >
                Find services
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-6 flex flex-wrap items-center gap-2 text-sm">
              <span className="font-semibold text-slate-500 dark:text-slate-400">
                Popular:
              </span>
              {["Smartphone", "Laptop & PC", "AC", "Refrigerator"].map(
                (cat) => (
                  <Link
                    key={cat}
                    href={`/services?category=${encodeURIComponent(cat)}`}
                    className="px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-500 hover:text-indigo-600 dark:hover:border-cyan-400 dark:hover:text-cyan-400 font-medium transition-colors"
                  >
                    {cat}
                  </Link>
                ),
              )}
            </div>
          </div>

          {/* Right: sample job card */}
          <div className="lg:col-span-6 relative py-6">
            <div
              aria-hidden="true"
              className="absolute inset-8 bg-linear-to-tr from-indigo-500/20 via-cyan-400/15 to-purple-500/20 blur-3xl rounded-full"
            />

            <div className="relative bg-slate-950 text-white rounded-3xl p-6 sm:p-7 border border-white/10 shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <p className="text-sm font-semibold text-slate-200">
                  Job #FM-8821
                </p>
                <span className="px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-400/30 text-xs font-semibold">
                  In progress
                </span>
              </div>

              <div className="mt-5 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shrink-0">
                    <Cpu className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3
                      style={{ fontFamily: "var(--font-display)" }}
                      className="text-lg font-extrabold"
                    >
                      MacBook Pro Logic &amp; Thermal Care
                    </h3>
                    <p className="text-sm text-slate-400 mt-0.5">
                      Technician: Tariqul Islam &middot; Home visit
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-cyan-300 text-sm font-bold shrink-0">
                  $55.00
                </span>
              </div>

              <ul className="mt-6 space-y-3 bg-white/5 p-4 rounded-2xl border border-white/10">
                <li className="flex items-center justify-between text-sm text-slate-100">
                  Request accepted
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </li>
                <li className="flex items-center justify-between text-sm text-slate-100">
                  Repair in progress
                  <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold">
                    Now
                  </span>
                </li>
                <li className="flex items-center justify-between text-sm text-slate-400">
                  Completed. Payment unlocks
                  <Lock className="w-4 h-4" />
                </li>
              </ul>

              <p className="mt-5 flex items-center gap-1.5 text-sm text-slate-300">
                <Lock className="w-4 h-4 text-emerald-400" />
                No payment until the job is completed
              </p>
            </div>

            <div className="hidden sm:flex items-center gap-3 bg-white dark:bg-slate-900 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl absolute -bottom-3 -left-4 z-20">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-950 dark:text-white">
                  Admin-approved listings
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Secure Stripe payments
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS */}
      <section className="border-b border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/60">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 px-4 py-8">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p
                style={{ fontFamily: "var(--font-display)" }}
                className="text-3xl font-black text-indigo-600 dark:text-cyan-400"
              >
                {s.value}
              </p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. POPULAR CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <SectionHeading
          title="Popular categories"
          subtitle="Choose a device type to see matching technicians"
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
          {CATEGORIES.map(({ name, icon: Icon, desc }) => (
            <Link
              key={name}
              href={`/services?category=${encodeURIComponent(name)}`}
              className="group p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-cyan-400 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 text-center flex flex-col items-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-cyan-400 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center transition-colors mb-3.5">
                <Icon className="w-6 h-6" />
              </div>
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                {name}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {desc}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. FEATURED SERVICES */}
      <section className="bg-white dark:bg-slate-900/60 border-y border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <h2
                style={{ fontFamily: "var(--font-display)" }}
                className="text-3xl font-black tracking-tight text-slate-950 dark:text-white"
              >
                Latest repair services
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-2">
                Every listing is reviewed and approved by our admin team
              </p>
            </div>
            <Link
              href="/services"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-bold text-indigo-600 dark:text-cyan-400 hover:border-indigo-500 hover:shadow-md transition-all"
            >
              Browse all services
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <Suspense fallback={<FeaturedServicesSkeleton />}>
            <FeaturedServicesSection />
          </Suspense>
        </div>
      </section>

      {/* 5. HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <SectionHeading
          title="How FixMate works"
          subtitle="Four simple steps from booking to payment"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((item, i) => (
            <div
              key={item.title}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:-translate-y-1 hover:border-indigo-300 dark:hover:border-cyan-500/50 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center">
                  <item.icon className="w-5 h-5" />
                </div>
                <span className="text-sm font-black text-slate-300 dark:text-slate-600">
                  Step {i + 1}
                </span>
              </div>
              <h3
                style={{ fontFamily: "var(--font-display)" }}
                className="text-lg font-extrabold text-slate-950 dark:text-white"
              >
                {item.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. WHY CHOOSE US */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="bg-slate-950 dark:bg-slate-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden border border-white/10">
          <div
            aria-hidden="true"
            className="absolute -top-24 -right-24 w-80 h-80 bg-indigo-600/25 blur-3xl rounded-full"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-24 -left-24 w-80 h-80 bg-cyan-500/20 blur-3xl rounded-full"
          />

          <h2
            style={{ fontFamily: "var(--font-display)" }}
            className="relative z-10 text-3xl font-black tracking-tight mb-8"
          >
            Why choose FixMate
          </h2>

          <div className="relative z-10 grid md:grid-cols-3 gap-8">
            {[
              {
                icon: ShieldCheck,
                tone: "bg-indigo-500/20 border-indigo-400/30 text-indigo-300",
                title: "Admin-approved services",
                desc: "Every service listing is moderated before it becomes visible to customers.",
              },
              {
                icon: Activity,
                tone: "bg-cyan-500/20 border-cyan-400/30 text-cyan-300",
                title: "Live job status",
                desc: "Follow each update from Requested to Accepted, In Progress and Completed.",
              },
              {
                icon: CheckCircle2,
                tone: "bg-emerald-500/20 border-emerald-400/30 text-emerald-300",
                title: "Pay only after service",
                desc: "No advance payment. Pay the final amount securely via Stripe once the job is done.",
              },
            ].map(({ icon: Icon, tone, title, desc }) => (
              <div key={title} className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 ${tone}`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg">{title}</h3>
                  <p className="text-sm text-slate-300 mt-1 leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. TECHNICIAN CTA */}
      <section className="px-4 pb-20">
        <div className="max-w-7xl mx-auto rounded-3xl bg-linear-to-r from-indigo-600 to-cyan-600 px-8 py-12 text-center text-white">
          <h2
            style={{ fontFamily: "var(--font-display)" }}
            className="text-3xl font-black tracking-tight"
          >
            Are you a skilled technician?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-indigo-50">
            List your repair services and receive job requests from customers
            near you.
          </p>
          <Link
            href="/sign-up"
            className="mt-6 inline-flex rounded-xl bg-white px-8 py-3 font-bold text-indigo-700 transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            Join as a technician
          </Link>
        </div>
      </section>
    </div>
  );
}
