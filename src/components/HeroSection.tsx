import Link from "next/link";
import Tilt3DCard from "@/components/Tilt3DCard";
import {
  Search,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Cpu,
  Sparkles,
  BadgeDollarSign,
} from "lucide-react";

export default function HeroSection() {
  return (
    <section className="bg-spatial-grid relative overflow-hidden border-b border-slate-200/80 px-4 pb-24 pt-12 sm:pt-16 dark:border-slate-800/80">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-12 lg:gap-14">
        {/* LEFT */}
        <div className="lg:col-span-6">
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-white px-4 py-1.5 text-xs font-semibold text-indigo-700 shadow-md shadow-indigo-900/5 sm:text-sm dark:border-indigo-500/30 dark:bg-slate-900 dark:text-cyan-300">
            <Sparkles className="h-4 w-4 shrink-0" />
            Verified technicians. Pay after service.
          </p>

          <h1
            style={{ fontFamily: "var(--font-display)" }}
            className="text-3xl font-black leading-[1.1] text-slate-950 sm:text-5xl dark:text-white"
          >
            Broken device? Get it fixed by{" "}
            <span className="bg-linear-to-r from-indigo-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent dark:from-indigo-400 dark:via-blue-400 dark:to-cyan-300">
              verified technicians
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-300">
            Book trusted experts for smartphones, laptops and home appliances.
            Follow every step of the repair and pay through Stripe only after
            the job is done.
          </p>

          {/* Search */}
          <form
            action="/services"
            method="GET"
            className="mt-8 flex max-w-xl flex-col gap-2 rounded-2xl border border-white bg-white/95 p-2 shadow-[0_20px_50px_-12px_rgba(79,70,229,0.28)] backdrop-blur-md sm:flex-row dark:border-slate-800 dark:bg-slate-900/95"
          >
            <div className="flex flex-1 items-center pl-3">
              <Search className="h-4 w-4 shrink-0 text-indigo-600 dark:text-cyan-400" />
              <input
                type="text"
                name="search"
                aria-label="Search repair services"
                placeholder="Search iPhone screen, AC servicing, MacBook..."
                className="w-full bg-transparent px-3 py-2.5 text-sm text-slate-950 placeholder:text-slate-500 focus:outline-none dark:text-white dark:placeholder:text-slate-400"
              />
            </div>
            <button
              type="submit"
              className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-indigo-600 to-cyan-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/30 transition-all hover:-translate-y-0.5 hover:from-indigo-700 hover:to-cyan-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
            >
              Find services
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Popular */}
          <div className="mt-6 flex flex-wrap items-center gap-2 text-sm">
            <span className="font-semibold text-slate-500 dark:text-slate-400">
              Popular:
            </span>
            {["Smartphone", "Laptop & PC", "AC", "Refrigerator"].map((cat) => (
              <Link
                key={cat}
                href={`/services?category=${encodeURIComponent(cat)}`}
                className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-700 transition-all hover:-translate-y-0.5 hover:border-indigo-500 hover:text-indigo-600 hover:shadow-md sm:text-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-cyan-400 dark:hover:text-cyan-400"
              >
                {cat}
              </Link>
            ))}
          </div>

          {/* Mini trust row */}
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-600 sm:text-sm dark:text-slate-400">
            {[
              "Admin-approved listings",
              "No advance payment",
              "Live job tracking",
            ].map((t) => (
              <span key={t} className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* RIGHT: layered 3D job card */}
        <div className="perspective-1200 relative py-4 sm:py-8 lg:col-span-6">
          <div
            aria-hidden="true"
            className="absolute inset-6 rounded-full bg-linear-to-tr from-indigo-500/30 via-cyan-400/25 to-purple-500/30 blur-3xl"
          />

          {/* back layers */}
          <div
            aria-hidden="true"
            className="absolute -top-1 right-2 hidden h-72 w-[88%] translate-x-4 -translate-y-3 rotate-3 rounded-3xl bg-linear-to-br from-indigo-600/90 to-cyan-600/90 opacity-30 shadow-2xl sm:block"
          />

          <div className="animate-float-3d relative">
            <Tilt3DCard>
              <div className="rounded-3xl border border-white/15 bg-slate-950/95 p-5 text-white shadow-[0_35px_70px_-15px_rgba(15,23,42,0.6)] backdrop-blur-xl sm:p-7">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-rose-500" />
                    <span className="h-3 w-3 rounded-full bg-amber-400" />
                    <span className="h-3 w-3 rounded-full bg-emerald-400" />
                  </div>
                  <span className="text-xs font-semibold text-slate-200 sm:text-sm">
                    Job #FM-8821
                  </span>
                </div>

                <div className="mt-5 flex items-start justify-between gap-3 sm:gap-4">
                  <div className="flex items-start gap-3 sm:gap-3.5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-500 to-cyan-500 shadow-lg shadow-indigo-500/30 sm:h-12 sm:w-12">
                      <Cpu className="h-5 w-5 text-white sm:h-6 sm:w-6" />
                    </div>
                    <div>
                      <span className="inline-block rounded-full border border-amber-400/30 bg-amber-500/15 px-2.5 py-0.5 text-xs font-semibold text-amber-300">
                        In progress
                      </span>
                      <h3
                        style={{ fontFamily: "var(--font-display)" }}
                        className="mt-1.5 text-base font-extrabold leading-snug sm:text-lg"
                      >
                        MacBook Pro Logic &amp; Thermal Care
                      </h3>
                      <p className="mt-0.5 text-xs text-slate-400 sm:text-sm">
                        Technician: Tariqul Islam &middot; Home visit
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 rounded-xl border border-white/15 bg-white/10 px-2.5 py-1.5 text-xs font-bold text-cyan-300 sm:px-3 sm:text-sm">
                    $55.00
                  </span>
                </div>

                {/* progress */}
                <div className="mt-6 grid grid-cols-4 gap-1.5">
                  <div className="h-1.5 rounded-full bg-emerald-400" />
                  <div className="h-1.5 rounded-full bg-emerald-400" />
                  <div className="h-1.5 rounded-full bg-cyan-400" />
                  <div className="h-1.5 rounded-full bg-white/20" />
                </div>

                <ul className="mt-4 space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <li className="flex items-center justify-between text-xs text-slate-100 sm:text-sm">
                    Request accepted
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                  </li>
                  <li className="flex items-center justify-between text-xs text-slate-100 sm:text-sm">
                    Repair in progress
                    <span className="rounded-md border border-cyan-500/30 bg-cyan-500/20 px-2 py-0.5 text-xs font-semibold text-cyan-300">
                      Now
                    </span>
                  </li>
                  <li className="flex items-center justify-between text-xs text-slate-400 sm:text-sm">
                    Completed. Payment unlocks
                    <Lock className="h-4 w-4 shrink-0" />
                  </li>
                </ul>

                <p className="mt-5 flex items-center gap-1.5 text-xs text-slate-300 sm:text-sm">
                  <Lock className="h-4 w-4 shrink-0 text-emerald-400" />
                  No payment until the job is completed
                </p>
              </div>
            </Tilt3DCard>
          </div>

          {/* floating badges */}
          <div className="animate-float-badge absolute -bottom-3 -left-3 z-20 hidden items-center gap-3 rounded-2xl border border-white bg-white/95 px-4 py-3 shadow-[0_20px_40px_-10px_rgba(15,23,42,0.3)] backdrop-blur-xl sm:flex dark:border-slate-700 dark:bg-slate-900/95">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-md shadow-emerald-500/30">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-950 dark:text-white">
                Admin-approved
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Every listing reviewed
              </p>
            </div>
          </div>

          <div className="animate-float-badge absolute -right-2 top-0 z-20 hidden items-center gap-3 rounded-2xl border border-white bg-white/95 px-4 py-3 shadow-[0_20px_40px_-10px_rgba(15,23,42,0.3)] backdrop-blur-xl sm:flex dark:border-slate-700 dark:bg-slate-900/95">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30">
              <BadgeDollarSign className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-950 dark:text-white">
                Pay after service
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Secure Stripe checkout
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}