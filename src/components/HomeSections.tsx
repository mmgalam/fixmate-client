import Link from "next/link";
import Tilt3DCard from "@/components/Tilt3DCard";
import SectionHeading from "@/components/SectionHeading";
import {
  ShieldCheck,
  Check,
  X,
  CheckCircle2,
  Smartphone,
  Laptop,
  Wind,
  Refrigerator,
  Tv,
  WashingMachine,
  Zap,
  ArrowRight,
  ArrowUpRight,
  UserRound,
  BriefcaseBusiness,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* 1. Floating stats bar (overlaps the bottom of the hero)             */
/* ------------------------------------------------------------------ */
const STATS = [
  { value: "50+", label: "Verified technicians" },
  { value: "1,200+", label: "Jobs completed" },
  { value: "4.8/5", label: "Average rating" },
  { value: "100%", label: "Pay after service" },
];

export function StatsBar() {
  return (
    <section className="relative z-10 -mt-12 px-4">
      <div className="mx-auto grid max-w-5xl grid-cols-2 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_25px_60px_-20px_rgba(79,70,229,0.35)] backdrop-blur-xl md:grid-cols-4 dark:border-slate-800 dark:bg-slate-900">
        {STATS.map((s, i) => (
          <div
            key={s.label}
            className={`px-4 py-6 text-center sm:px-6 ${
              i > 0 ? "md:border-l" : ""
            } ${i % 2 === 1 ? "border-l md:border-l" : ""} ${
              i > 1 ? "border-t md:border-t-0" : ""
            } border-slate-200 dark:border-slate-800`}
          >
            <p
              style={{ fontFamily: "var(--font-display)" }}
              className="text-2xl font-black text-indigo-600 sm:text-3xl dark:text-cyan-400"
            >
              {s.value}
            </p>
            <p className="mt-1 text-xs text-slate-600 sm:text-sm dark:text-slate-400">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 2. Category "device shelf": tall colour tiles in a wave             */
/* ------------------------------------------------------------------ */
const CATEGORIES = [
  { name: "Smartphone", icon: Smartphone, desc: "Screen & battery", from: "#6366f1", to: "#1d4ed8" },
  { name: "Laptop & PC", icon: Laptop, desc: "Hardware & OS", from: "#0ea5e9", to: "#0e7490" },
  { name: "AC", icon: Wind, desc: "Servicing & gas", from: "#06b6d4", to: "#0f766e" },
  { name: "Refrigerator", icon: Refrigerator, desc: "Cooling & PCB", from: "#14b8a6", to: "#047857" },
  { name: "TV", icon: Tv, desc: "Panel & backlight", from: "#8b5cf6", to: "#7e22ce" },
  { name: "Washing Machine", icon: WashingMachine, desc: "Drum & motor", from: "#3b82f6", to: "#3730a3" },
  { name: "Electrical", icon: Zap, desc: "Wiring & fittings", from: "#f59e0b", to: "#c2410c" },
];

export function CategoryShelf() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <style>{`
        .fm-shelf{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;align-items:start;padding-bottom:16px}
        @media (min-width:640px){.fm-shelf{grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}}
        @media (min-width:768px){.fm-shelf{grid-template-columns:repeat(4,minmax(0,1fr))}}
        @media (min-width:1280px){
          .fm-shelf{grid-template-columns:repeat(7,minmax(0,1fr));padding-bottom:36px}
          .fm-shelf > a:nth-child(even){margin-top:36px}
        }
        .fm-tile{position:relative;display:flex;flex-direction:column;justify-content:space-between;
          min-height:208px;padding:18px;border-radius:24px;overflow:hidden;color:#fff;text-decoration:none;
          box-shadow:0 10px 25px -8px rgba(15,23,42,.35);transition:transform .3s,box-shadow .3s}
        @media (min-width:1280px){.fm-tile{min-height:224px;padding:16px}}
        .fm-tile:hover{transform:translateY(-8px);box-shadow:0 25px 45px -12px rgba(79,70,229,.55)}
        .fm-tile-bg{position:absolute;right:-20px;bottom:-20px;width:108px;height:108px;
          color:rgba(255,255,255,.16);transform:rotate(-12deg);transition:transform .5s}
        .fm-tile:hover .fm-tile-bg{transform:rotate(0) scale(1.1)}
        .fm-tile-chip{position:relative;display:flex;align-items:center;justify-content:center;
          width:44px;height:44px;border-radius:16px;background:rgba(255,255,255,.22);
          box-shadow:inset 0 0 0 1px rgba(255,255,255,.35)}
        .fm-tile-name{display:block;font-size:16px;font-weight:800;line-height:1.25;word-break:break-word}
        .fm-tile-desc{display:flex;align-items:center;justify-content:space-between;gap:4px;margin-top:4px;
          font-size:13px;color:rgba(255,255,255,.9)}
        .fm-tile-arrow{flex-shrink:0;opacity:0;transition:opacity .3s}
        .fm-tile:hover .fm-tile-arrow{opacity:1}
      `}</style>

      <SectionHeading
        title="What needs fixing?"
        subtitle="Pick a device type and see technicians who handle it"
      />

      <div className="fm-shelf">
        {CATEGORIES.map(({ name, icon: Icon, desc, from, to }) => (
          <Link
            key={name}
            href={`/services?category=${encodeURIComponent(name)}`}
            className="fm-tile"
            style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
          >
            <Icon aria-hidden="true" className="fm-tile-bg" />
            <span className="fm-tile-chip">
              <Icon size={22} />
            </span>
            <span className="relative">
              <span className="fm-tile-name">{name}</span>
              <span className="fm-tile-desc">
                {desc}
                <ArrowUpRight size={15} className="fm-tile-arrow" />
              </span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 4. Trust section: "usual way" vs FixMate (plain CSS, always dark)   */
/* ------------------------------------------------------------------ */
const COMPARE = [
  { bad: "Pay upfront before any work is done", good: "Pay only after the job is completed" },
  { bad: "No idea what is happening with your device", good: "Live status from Requested to Completed" },
  { bad: "Unknown technician, no way to check", good: "Every service is approved by an admin" },
  { bad: "Price changes when you come to collect", good: "Final amount is shown before you pay" },
  { bad: "Hard to cancel once you handed it over", good: "Cancel any time while the job is Requested" },
  { bad: "Cash payment and no record", good: "Stripe checkout with a saved payment history" },
];

export function TrustCompare() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <style>{`
        .fm-vs{position:relative;overflow:hidden;border-radius:32px;padding:48px 20px;color:#fff;
          background:radial-gradient(600px 320px at 8% 0%,rgba(99,102,241,.38),transparent 60%),
                     radial-gradient(520px 320px at 96% 100%,rgba(6,182,212,.28),transparent 60%),#020617;
          box-shadow:0 40px 80px -30px rgba(15,23,42,.6)}
        @media (min-width:640px){.fm-vs{padding:64px 40px}}
        .fm-vs-head{text-align:center;max-width:640px;margin:0 auto 40px}
        .fm-vs-head h2{font-size:28px;font-weight:900;line-height:1.15}
        @media (min-width:640px){.fm-vs-head h2{font-size:32px}}
        .fm-vs-head p{margin-top:10px;color:#94a3b8;font-size:15px;line-height:1.6}
        @media (min-width:640px){.fm-vs-head p{font-size:16px}}

        .fm-vs-grid{position:relative;display:grid;grid-template-columns:1fr;gap:20px;max-width:1000px;margin:0 auto}
        @media (min-width:900px){.fm-vs-grid{grid-template-columns:1fr 1fr;gap:32px}}
        .fm-vs-badge{display:none}
        @media (min-width:900px){
          .fm-vs-badge{display:flex;position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);z-index:5;
            width:52px;height:52px;border-radius:9999px;align-items:center;justify-content:center;
            font-weight:900;font-size:14px;color:#fff;background:linear-gradient(135deg,#6366f1,#06b6d4);
            box-shadow:0 0 0 6px #020617,0 12px 30px -6px rgba(99,102,241,.7)}
        }

        .fm-vs-bad{border-radius:24px;padding:24px;background:rgba(255,255,255,.04);
          border:1px solid rgba(255,255,255,.09)}
        @media (min-width:640px){.fm-vs-bad{padding:28px}}
        .fm-vs-goodwrap{border-radius:26px;padding:2px;
          background:linear-gradient(135deg,#6366f1,#06b6d4,#8b5cf6,#6366f1);background-size:300% 300%;
          animation:fm-vs-shift 8s ease infinite;box-shadow:0 25px 60px -15px rgba(99,102,241,.55)}
        .fm-vs-good{height:100%;border-radius:24px;padding:24px;background:#0b1224}
        @media (min-width:640px){.fm-vs-good{padding:28px}}

        .fm-vs-tag{display:inline-flex;align-items:center;gap:8px;margin-bottom:8px;padding:5px 14px;
          border-radius:9999px;font-size:13px;font-weight:700}
        .fm-vs-tag-bad{color:#fda4af;background:rgba(244,63,94,.12);border:1px solid rgba(244,63,94,.25)}
        .fm-vs-tag-good{color:#a5f3fc;background:rgba(34,211,238,.12);border:1px solid rgba(34,211,238,.3)}

        .fm-vs-row{display:flex;align-items:flex-start;gap:12px;padding:14px 8px;margin:0 -8px;
          border-bottom:1px dashed rgba(255,255,255,.1);font-size:14px;line-height:1.5;
          border-radius:12px;transition:background .3s,transform .3s}
        @media (min-width:640px){.fm-vs-row{font-size:15px;padding:15px 8px}}
        .fm-vs-row:last-child{border-bottom:none}
        .fm-vs-bad .fm-vs-row{color:#94a3b8}
        .fm-vs-good .fm-vs-row{color:#f1f5f9;font-weight:600}
        .fm-vs-good .fm-vs-row:hover{background:rgba(99,102,241,.14);transform:translateX(4px)}
        .fm-vs-ic{flex:none;display:flex;align-items:center;justify-content:center;
          width:24px;height:24px;margin-top:1px;border-radius:9999px}
        .fm-vs-ic-bad{background:rgba(244,63,94,.16);color:#fb7185}
        .fm-vs-ic-good{background:rgba(52,211,153,.18);color:#34d399}

        .fm-vs-cta{display:flex;justify-content:center;margin-top:36px}
        .fm-vs-btn{display:inline-flex;align-items:center;gap:8px;padding:13px 28px;border-radius:14px;
          font-weight:700;font-size:15px;color:#fff;text-decoration:none;
          background:linear-gradient(90deg,#6366f1,#06b6d4);
          box-shadow:0 14px 30px -10px rgba(99,102,241,.7);transition:transform .3s,box-shadow .3s}
        .fm-vs-btn:hover{transform:translateY(-3px);box-shadow:0 20px 40px -10px rgba(34,211,238,.6)}

        @keyframes fm-vs-shift{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
        @media (prefers-reduced-motion:reduce){.fm-vs-goodwrap{animation:none}}
      `}</style>

      <div className="fm-vs">
        <div className="fm-vs-head">
          <h2 style={{ fontFamily: "var(--font-display)" }}>
            Repair without the risk
          </h2>
          <p>
            Handing over a device should not mean crossing your fingers. Here
            is how FixMate is different from the usual way.
          </p>
        </div>

        <div className="fm-vs-grid">
          <span className="fm-vs-badge" aria-hidden="true">
            VS
          </span>

          <div className="fm-vs-bad">
            <span className="fm-vs-tag fm-vs-tag-bad">The usual way</span>
            {COMPARE.map((r) => (
              <div key={r.bad} className="fm-vs-row">
                <span className="fm-vs-ic fm-vs-ic-bad">
                  <X size={14} strokeWidth={3} />
                </span>
                {r.bad}
              </div>
            ))}
          </div>

          <div className="fm-vs-goodwrap">
            <div className="fm-vs-good">
              <span className="fm-vs-tag fm-vs-tag-good">
                <ShieldCheck size={14} /> With FixMate
              </span>
              {COMPARE.map((r) => (
                <div key={r.good} className="fm-vs-row">
                  <span className="fm-vs-ic fm-vs-ic-good">
                    <Check size={14} strokeWidth={3} />
                  </span>
                  {r.good}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="fm-vs-cta">
          <Link href="/services" className="fm-vs-btn">
            Find a verified technician
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 5. Two audiences: each card previews its own dashboard              */
/* ------------------------------------------------------------------ */
export function AudienceSplit() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <SectionHeading
        title="Two sides, one trusted platform"
        subtitle="Whether you need a repair or offer one, every job stays clear"
      />

      <div className="perspective-1200 grid gap-6 lg:grid-cols-2">
        {/* ---------------- Customers ---------------- */}
        <Tilt3DCard>
          <div className="flex h-full flex-col rounded-3xl bg-linear-to-br from-indigo-600 to-blue-700 p-6 text-white shadow-2xl sm:p-10">
            <span className="inline-flex items-center gap-2 self-start rounded-full bg-indigo-800/90 px-3.5 py-1.5 text-sm font-semibold text-indigo-100">
              <UserRound className="h-4 w-4" />
              For customers
            </span>

            <h2
              style={{ fontFamily: "var(--font-display)" }}
              className="mt-5 text-2xl font-black leading-tight sm:text-3xl"
            >
              Get your device fixed without the guesswork
            </h2>

            <ul className="mt-5 space-y-2.5 text-sm text-indigo-50 sm:text-base">
              {[
                "Compare approved technicians",
                "Track every status change",
                "Pay only when the job is done",
              ].map((t) => (
                <li key={t} className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-cyan-300" />
                  {t}
                </li>
              ))}
            </ul>

            {/* Mini "My Bookings" preview (Light + Dark mode adaptive) */}
            <div className="mt-8 rounded-2xl border border-white/60 bg-white p-4 text-slate-900 shadow-xl dark:border-white/10 dark:bg-slate-900/95 dark:text-slate-100">
              <p className="mb-1 text-sm font-bold text-slate-500 dark:text-slate-400">
                My bookings
              </p>

              <div className="flex items-center justify-between gap-3 border-b border-slate-100 py-3 dark:border-slate-800">
                <span className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300">
                    <Smartphone className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-semibold">Screen replacement</span>
                </span>
                <span className="shrink-0 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-bold text-blue-700 dark:bg-blue-500/20 dark:text-blue-300">
                  Requested
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 border-b border-slate-100 py-3 dark:border-slate-800">
                <span className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-300">
                    <Wind className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-semibold">AC servicing</span>
                </span>
                <span className="shrink-0 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
                  In progress
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 pt-3">
                <span className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                    <Laptop className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-semibold">Laptop cleaning</span>
                </span>
                <span className="shrink-0 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white shadow">
                  Pay Now
                </span>
              </div>
            </div>

            <div className="mt-auto pt-8">
              <Link
                href="/services"
                className="group inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-indigo-700 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                Browse services
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </Tilt3DCard>

        {/* ---------------- Technicians ---------------- */}
        <Tilt3DCard>
          <div className="flex h-full flex-col rounded-3xl border border-slate-700 bg-slate-950 p-6 text-white shadow-2xl sm:p-10">
            <span className="inline-flex items-center gap-2 self-start rounded-full bg-slate-800 px-3.5 py-1.5 text-sm font-semibold text-cyan-300">
              <BriefcaseBusiness className="h-4 w-4" />
              For technicians
            </span>

            <h2
              style={{ fontFamily: "var(--font-display)" }}
              className="mt-5 text-2xl font-black leading-tight sm:text-3xl"
            >
              Turn your skills into a steady stream of jobs
            </h2>

            <ul className="mt-5 space-y-2.5 text-sm text-slate-300 sm:text-base">
              {[
                "List the repairs you offer",
                "Accept requests that suit you",
                "Set the final amount when you finish",
              ].map((t) => (
                <li key={t} className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                  {t}
                </li>
              ))}
            </ul>

            {/* Mini "Manage Requests" preview */}
            <div className="mt-8 rounded-2xl border border-slate-700 bg-slate-900 p-4 shadow-xl">
              <p className="mb-1 text-sm font-bold text-slate-400">New requests</p>

              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 py-3">
                <span className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-cyan-300">
                    <Refrigerator className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-white">
                      Fridge not cooling
                    </span>
                    <span className="block text-xs text-slate-400">
                      Rafi &middot; Mirpur
                    </span>
                  </span>
                </span>
                <span className="flex gap-2">
                  <span className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white">
                    Accept
                  </span>
                  <span className="rounded-lg bg-rose-900 px-3 py-1.5 text-xs font-bold text-rose-200">
                    Reject
                  </span>
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 py-3">
                <span className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-cyan-300">
                    <Tv className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-white">
                      TV backlight repair
                    </span>
                    <span className="block text-xs text-slate-400">
                      Nusrat &middot; Uttara
                    </span>
                  </span>
                </span>
                <span className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white">
                  Mark Completed
                </span>
              </div>

              <div className="mt-1 flex items-center justify-between rounded-xl bg-slate-800 px-4 py-3">
                <span className="text-sm text-slate-300">Earned this week</span>
                <span className="text-lg font-black text-cyan-300">$240.00</span>
              </div>
            </div>

            <div className="mt-auto pt-8">
              <Link
                href="/sign-up"
                className="group inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-indigo-500 to-cyan-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                Join as a technician
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </Tilt3DCard>
      </div>
    </section>
  );
}