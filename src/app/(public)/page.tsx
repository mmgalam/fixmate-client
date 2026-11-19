import Link from "next/link";
import {
  Search,
  Smartphone,
  Laptop,
  Wind,
  Snowflake,
  Tv,
  Shirt,
  Zap,
  ShieldCheck,
  CreditCard,
  Activity,
  BadgeCheck,
  ArrowRight,
  Wrench,
  MousePointerClick,
  Send,
  Star,
} from "lucide-react";
import ServiceCard, { type ServiceItem } from "@/components/ServiceCard";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function getFeaturedServices(): Promise<ServiceItem[]> {
  try {
    const res = await fetch(`${API_URL}/api/services?sort=newest&limit=6`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    const list: ServiceItem[] = Array.isArray(data) ? data : data.services || [];
    return list.slice(0, 6);
  } catch {
    return [];
  }
}

const categories = [
  { name: "Smartphone", icon: Smartphone },
  { name: "Laptop & PC", icon: Laptop },
  { name: "AC", icon: Wind },
  { name: "Refrigerator", icon: Snowflake },
  { name: "TV", icon: Tv },
  { name: "Washing Machine", icon: Shirt },
  { name: "Electrical", icon: Zap },
];

const steps = [
  { icon: MousePointerClick, title: "Find a Service", text: "Browse verified technicians and pick the repair you need." },
  { icon: Send, title: "Send a Request", text: "Describe the problem, choose a date and send your request." },
  { icon: Wrench, title: "Technician Fixes It", text: "Track every step: accepted, in progress, completed." },
  { icon: CreditCard, title: "Pay After Completion", text: "Pay securely online only when the job is done." },
];

const trust = [
  { icon: BadgeCheck, title: "Verified Technicians", text: "Every service is reviewed and approved by our admin team." },
  { icon: Activity, title: "Live Job Tracking", text: "Know exactly what is happening with your device at all times." },
  { icon: ShieldCheck, title: "Pay After Service", text: "No upfront payment. You pay only after the work is delivered." },
];

const stats = [
  { value: "500+", label: "Verified Technicians" },
  { value: "12,000+", label: "Jobs Completed" },
  { value: "4.8/5", label: "Average Rating" },
  { value: "100%", label: "Pay After Service" },
];

const testimonials = [
  { name: "Rafiq Ahmed", area: "Mirpur, Dhaka", text: "My laptop was fixed in one day and I could track every step. I paid only after it worked perfectly." },
  { name: "Nusrat Jahan", area: "Dhanmondi, Dhaka", text: "The AC technician arrived on time and the final price matched what was agreed. Very trustworthy." },
  { name: "Tanvir Hasan", area: "Uttara, Dhaka", text: "Finally a platform where I do not have to pay first. The status updates are really helpful." },
];

export default async function HomePage() {
  const featured = await getFeaturedServices();

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-teal-900 text-white">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-teal-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-400/10 px-4 py-1.5 text-xs font-semibold text-teal-300">
              <BadgeCheck className="h-4 w-4" /> Trusted by thousands of customers
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
              Broken Device? Get It Fixed by{" "}
              <span className="bg-gradient-to-r from-teal-300 to-amber-300 bg-clip-text text-transparent">
                Verified Technicians
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-slate-300">
              Book a repair in minutes, track your job step by step, and pay only after the work is completed.
            </p>

            <form action="/services" method="GET" className="mt-8 flex max-w-xl flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  name="search"
                  placeholder="Search e.g. iPhone screen, AC servicing..."
                  className="w-full rounded-xl border border-white/10 bg-white py-3.5 pl-12 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>
              <button type="submit" className="btn-primary !bg-amber-500 !text-slate-900 hover:!bg-amber-400">
                Find Service
              </button>
            </form>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-300">
              <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-teal-300" /> Pay after service</span>
              <span className="flex items-center gap-2"><Activity className="h-4 w-4 text-teal-300" /> Live tracking</span>
              <span className="flex items-center gap-2"><Star className="h-4 w-4 text-amber-300" /> Rated technicians</span>
            </div>
          </div>

          {/* Illustration (no external image needed) */}
          <div className="relative mx-auto hidden w-full max-w-md lg:block">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary">
                  <Wrench className="h-7 w-7" />
                </div>
                <div>
                  <p className="font-bold">iPhone Screen Replacement</p>
                  <p className="text-xs text-slate-400">Dhanmondi, Dhaka</p>
                </div>
              </div>
              <div className="mt-6 space-y-3">
                {[
                  { label: "Requested", done: true },
                  { label: "Accepted", done: true },
                  { label: "In Progress", done: true },
                  { label: "Completed", done: false },
                ].map((s) => (
                  <div key={s.label} className="flex items-center gap-3">
                    <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${s.done ? "bg-teal-400 text-slate-900" : "bg-white/10 text-slate-400"}`}>
                      {s.done ? "✓" : "•"}
                    </span>
                    <span className={s.done ? "text-sm font-medium" : "text-sm text-slate-400"}>{s.label}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex items-center justify-between rounded-xl bg-white/10 px-4 py-3">
                <span className="text-sm text-slate-300">Pay after completion</span>
                <span className="text-lg font-extrabold text-amber-300">$45</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 sm:px-6 md:grid-cols-4 lg:px-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-extrabold text-primary">{s.value}</p>
              <p className="mt-1 text-sm text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED SERVICES */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-primary">Latest Services</p>
            <h2 className="section-title mt-2">Featured Repair Services</h2>
          </div>
          <Link href="/services" className="btn-outline">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {featured.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        ) : (
          <div className="card-base py-16 text-center">
            <Wrench className="mx-auto h-10 w-10 text-slate-300" />
            <p className="mt-4 font-semibold text-slate-700">No services available yet</p>
            <p className="mt-1 text-sm text-slate-500">Please check back soon.</p>
          </div>
        )}
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="text-sm font-bold uppercase tracking-wider text-primary">Simple Process</p>
            <h2 className="section-title mt-2">How FixMate Works</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <div key={step.title} className="card-base card-hover relative p-6 text-center">
                <span className="absolute right-4 top-4 text-5xl font-extrabold text-slate-100">{i + 1}</span>
                <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-primary">
                  <step.icon className="h-7 w-7" />
                </div>
                <h3 className="relative mt-5 text-lg font-bold">{step.title}</h3>
                <p className="relative mt-2 text-sm text-slate-600">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="text-sm font-bold uppercase tracking-wider text-primary">What Do You Need?</p>
          <h2 className="section-title mt-2">Popular Categories</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-7">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={`/services?category=${encodeURIComponent(cat.name)}`}
              className="card-base card-hover flex flex-col items-center gap-3 p-5 text-center hover:border-primary"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-primary">
                <cat.icon className="h-6 w-6" />
              </span>
              <span className="text-sm font-semibold text-slate-800">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE US + TESTIMONIALS */}
      <section className="bg-slate-900 py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="text-sm font-bold uppercase tracking-wider text-teal-300">Why FixMate</p>
            <h2 className="section-title mt-2 !text-white">Why Choose Us</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {trust.map((t) => (
              <div key={t.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
                  <t.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-bold">{t.title}</h3>
                <p className="mt-2 text-sm text-slate-300">{t.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.name} className="rounded-2xl bg-white p-6 text-slate-800">
                <div className="flex gap-0.5 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">&ldquo;{t.text}&rdquo;</p>
                <div className="mt-4">
                  <p className="text-sm font-bold">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.area}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-primary to-teal-600 px-8 py-14 text-center text-white">
          <h2 className="text-3xl font-extrabold sm:text-4xl">Are you a skilled technician?</h2>
          <p className="mx-auto mt-3 max-w-xl text-teal-50">
            List your repair services on FixMate and get new customers every day.
          </p>
          <Link href="/sign-up" className="btn-primary mt-7 !bg-white !text-primary !shadow-none hover:!bg-slate-100">
            Join as a Technician <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}