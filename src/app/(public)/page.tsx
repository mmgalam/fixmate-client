import { Suspense } from 'react';
import Link from 'next/link';
import ServiceCard from '@/components/ServiceCard';
import type { Service } from '@/types';
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
  Sparkles,
  Activity,
  Lock,
  ArrowRight,
  Cpu,
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const CATEGORIES = [
  { name: 'Smartphone', icon: Smartphone, desc: 'OLED & Battery' },
  { name: 'Laptop & PC', icon: Laptop, desc: 'Logic Board & OS' },
  { name: 'AC', icon: Wind, desc: 'Jet Wash & Gas' },
  { name: 'Refrigerator', icon: Refrigerator, desc: 'Cooling & PCB' },
  { name: 'TV', icon: Tv, desc: 'Panel & Backlight' },
  { name: 'Washing Machine', icon: WashingMachine, desc: 'Drum & Motor' },
  { name: 'Electrical', icon: Zap, desc: 'Smart Wiring' },
];

async function FeaturedServicesSection() {
  let latestServices: Service[] = [];
  try {
    const res = await fetch(`${API_URL}/api/services?limit=6`, {
      cache: 'no-store',
    });
    if (res.ok) {
      latestServices = await res.json();
    }
  } catch {
    latestServices = [];
  }

  if (latestServices.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center shadow-3d-card">
        <p className="text-slate-600 dark:text-slate-400">No approved services available yet.</p>
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
          className="h-80 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 animate-pulse shadow-3d-card"
        />
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <div>
      {/* 1. SPATIAL 3D HERO SECTION */}
      <section className="bg-spatial-grid pt-14 pb-24 px-4 overflow-hidden border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Copy & 3D Floating Search Bar */}
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-indigo-200/80 dark:border-indigo-500/30 text-indigo-700 dark:text-cyan-300 text-xs font-bold mb-6 shadow-md shadow-indigo-900/5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-cyan-400" />
              <span>NEXT-GEN REPAIR BOOKING PLATFORM</span>
            </div>

            <h1
              style={{ fontFamily: 'var(--font-display)' }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-950 dark:text-white leading-[1.07]"
            >
              Device Down? Fixed by{' '}
              <span className="bg-linear-to-r from-indigo-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent">
                3D-Verified
              </span>{' '}
              Specialists.
            </h1>

            <p className="mt-5 text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl">
              Book admin-approved technicians for smartphones, laptops, and home appliances. Track live diagnostics and pay via Stripe only after completion.
            </p>

            {/* 3D Elevated Search Console */}
            <form
              action="/services"
              method="GET"
              className="mt-8 flex flex-col sm:flex-row gap-2 max-w-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-2 rounded-2xl border border-white dark:border-slate-800 shadow-[0_20px_50px_-12px_rgba(79,70,229,0.22)]"
            >
              <div className="flex-1 flex items-center pl-3">
                <Search className="w-4 h-4 text-indigo-600 dark:text-cyan-400 shrink-0" />
                <input
                  type="text"
                  name="search"
                  placeholder="Search 'iPhone screen', 'AC jet wash', 'MacBook'..."
                  className="w-full px-3 py-2.5 text-slate-950 dark:text-white placeholder:text-slate-400 text-sm bg-transparent focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-linear-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white font-bold rounded-xl text-sm shadow-lg shadow-indigo-600/30 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 shrink-0"
              >
                Find Services
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Category Pills */}
            <div className="mt-6 flex flex-wrap items-center gap-2 text-xs">
              <span className="font-bold text-slate-400">Trending:</span>
              {['Smartphone', 'Laptop & PC', 'AC', 'Refrigerator'].map((cat) => (
                <Link
                  key={cat}
                  href={`/services?category=${encodeURIComponent(cat)}`}
                  className="px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-500 dark:hover:border-cyan-400 hover:text-indigo-600 dark:hover:text-cyan-400 hover:shadow-md hover:-translate-y-0.5 font-semibold transition-all"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>

          {/* Right: 3D Isometric Stacked Hardware & Telemetry Cards */}
          <div className="lg:col-span-6 perspective-1200 relative py-6">
            <div
              aria-hidden="true"
              className="absolute inset-8 bg-linear-to-tr from-indigo-500/25 via-cyan-400/20 to-purple-500/25 blur-3xl rounded-full"
            />

            <div
              aria-hidden="true"
              className="hidden sm:block absolute -top-2 right-4 w-[88%] h-72 rounded-3xl bg-linear-to-br from-indigo-600/90 to-cyan-600/90 opacity-30 transform rotate-3 translate-x-4 -translate-y-3 shadow-2xl"
            />

            <div className="relative animate-float-3d bg-slate-950/95 backdrop-blur-xl text-white rounded-3xl p-6 sm:p-7 border border-white/15 shadow-[0_35px_70px_-15px_rgba(15,23,42,0.55)]">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500" />
                  <span className="w-3 h-3 rounded-full bg-amber-400" />
                  <span className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <span
                  style={{ fontFamily: 'var(--font-mono)' }}
                  className="text-[11px] text-cyan-400 font-semibold tracking-wider"
                >
                  {'3D_DIAGNOSTIC // #FM-8821'}
                </span>
              </div>

              <div className="mt-5 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/30">
                    <Cpu className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <span
                      style={{ fontFamily: 'var(--font-mono)' }}
                      className="text-[10px] uppercase tracking-widest text-cyan-300 font-bold"
                    >
                      IN PROGRESS • HOME VISIT
                    </span>
                    <h3
                      style={{ fontFamily: 'var(--font-display)' }}
                      className="text-lg font-extrabold mt-0.5"
                    >
                      MacBook Pro M-Series Logic & Thermal Care
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Specialist: Tariqul Islam • Verified Pro
                    </p>
                  </div>
                </div>

                <span
                  style={{ fontFamily: 'var(--font-mono)' }}
                  className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-cyan-300 text-sm font-black shrink-0"
                >
                  $55.00
                </span>
              </div>

              <div className="mt-6 space-y-2.5 bg-white/4 p-4 rounded-2xl border border-white/10">
                {[
                  { label: '01. Request Accepted & Dispatched', done: true },
                  { label: '02. Precision Hardware Calibration', done: true, active: true },
                  { label: '03. Completed — Stripe Checkout Unlocks', done: false },
                ].map((step) => (
                  <div
                    key={step.label}
                    className="flex items-center justify-between text-xs"
                  >
                    <span className={step.done ? 'text-slate-100 font-medium' : 'text-slate-500'}>
                      {step.label}
                    </span>
                    {step.active ? (
                      <span
                        style={{ fontFamily: 'var(--font-mono)' }}
                        className="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold"
                      >
                        LIVE
                      </span>
                    ) : step.done ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <span className="text-[10px] font-mono text-slate-500">ESCROW</span>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-5 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  Zero Upfront Risk:
                </span>
                <span
                  style={{ fontFamily: 'var(--font-mono)' }}
                  className="text-emerald-400 font-bold"
                >
                  PAY AFTER COMPLETION
                </span>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-3 animate-float-badge bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl px-4 py-3 rounded-2xl border border-white dark:border-slate-700 shadow-[0_20px_40px_-10px_rgba(15,23,42,0.25)] absolute -bottom-3 -left-4 z-20">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/30">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-extrabold text-slate-950 dark:text-white">
                  100% Admin-Vetted
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Stripe Verified Escrow
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 3D INTERACTIVE FEATURED SERVICES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span
              style={{ fontFamily: 'var(--font-mono)' }}
              className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-cyan-400"
            >
              {'// INTERACTIVE 3D CATALOG'}
            </span>
            <h2
              style={{ fontFamily: 'var(--font-display)' }}
              className="text-3xl font-black text-slate-950 dark:text-white mt-1"
            >
              Latest Repair Services
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
              Hover over any card to inspect in 3D—all listings are admin-verified
            </p>
          </div>
          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-bold text-indigo-600 dark:text-cyan-400 hover:border-indigo-500 hover:shadow-md transition-all"
          >
            Browse All Services
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <Suspense fallback={<FeaturedServicesSkeleton />}>
          <FeaturedServicesSection />
        </Suspense>
      </section>

      {/* 3. HOW FIXMATE WORKS */}
      <section className="bg-white dark:bg-slate-900/60 border-y border-slate-200/80 dark:border-slate-800/80 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span
              style={{ fontFamily: 'var(--font-mono)' }}
              className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-cyan-400"
            >
              {'// SEAMLESS PIPELINE'}
            </span>
            <h2
              style={{ fontFamily: 'var(--font-display)' }}
              className="text-3xl font-black text-slate-950 dark:text-white mt-1"
            >
              How FixMate Works
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-2">
              Four transparent stages from instant booking to verified completion
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Find a Service',
                desc: 'Filter admin-approved technicians by device category, area, and Home Visit or Shop Drop-off mode.',
                icon: Search,
              },
              {
                step: '02',
                title: 'Send a Request',
                desc: 'Describe your fault, choose a preferred date, and submit a booking request with zero advance fee.',
                icon: Send,
              },
              {
                step: '03',
                title: 'Technician Fixes It',
                desc: 'Track live progress from Accepted to In Progress and Completed inside your dashboard.',
                icon: Wrench,
              },
              {
                step: '04',
                title: 'Pay After Completion',
                desc: 'Pay the confirmed final invoice via Stripe Checkout only after your device is fixed.',
                icon: CreditCard,
              },
            ].map((item) => (
              <div
                key={item.step}
                className="group p-6 rounded-3xl bg-[#F8FAFC] dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800/90 hover:-translate-y-2 hover:border-indigo-300 dark:hover:border-cyan-500/50 shadow-3d-card hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-indigo-600 to-cyan-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/25 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span
                    style={{ fontFamily: 'var(--font-mono)' }}
                    className="text-sm font-black text-slate-300 dark:text-slate-700 group-hover:text-indigo-500 dark:group-hover:text-cyan-400 transition-colors"
                  >
                    {item.step}
                  </span>
                </div>
                <h3
                  style={{ fontFamily: 'var(--font-display)' }}
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
        </div>
      </section>

      {/* 4. POPULAR CATEGORIES & OBSIDIAN TRUST VAULT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span
            style={{ fontFamily: 'var(--font-mono)' }}
            className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-cyan-400"
          >
            {'// DEVICE SPECIALTIES'}
          </span>
          <h2
            style={{ fontFamily: 'var(--font-display)' }}
            className="text-3xl font-black text-slate-950 dark:text-white mt-1"
          >
            Popular Categories
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4 mb-20">
          {CATEGORIES.map(({ name, icon: Icon, desc }) => (
            <Link
              key={name}
              href={`/services?category=${encodeURIComponent(name)}`}
              className="group p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-3d-card hover:shadow-[0_22px_40px_-10px_rgba(79,70,229,0.28)] hover:border-indigo-500 dark:hover:border-cyan-400 hover:-translate-y-2 transition-all duration-300 text-center flex flex-col items-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-cyan-400 group-hover:bg-linear-to-br group-hover:from-indigo-600 group-hover:to-cyan-500 group-hover:text-white group-hover:shadow-lg group-hover:shadow-indigo-600/30 flex items-center justify-center transition-all duration-300 mb-3.5">
                <Icon className="w-6 h-6" />
              </div>
              <span className="text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-cyan-400 transition-colors">
                {name}
              </span>
              <span className="text-[11px] text-slate-400 mt-1">{desc}</span>
            </Link>
          ))}
        </div>

        <div className="bg-slate-950 dark:bg-slate-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-[0_30px_60px_-15px_rgba(15,23,42,0.45)] border border-white/10">
          <div
            aria-hidden="true"
            className="absolute -top-24 -right-24 w-80 h-80 bg-indigo-600/25 blur-3xl rounded-full"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-24 -left-24 w-80 h-80 bg-cyan-500/20 blur-3xl rounded-full"
          />

          <div className="relative z-10 grid md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg">Admin-Approved Services</h3>
                <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                  Every service listing goes through admin moderation before becoming publicly visible.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 flex items-center justify-center shrink-0">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg">Live Status Pipeline</h3>
                <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                  Track every update from Requested to Accepted, In Progress, and Completed.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg">Pay Only After Service</h3>
                <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                  Zero advance payment—settle your confirmed invoice securely via Stripe after completion.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
