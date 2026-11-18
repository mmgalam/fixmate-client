import { Suspense } from 'react';
import Link from 'next/link';
import ServiceCard, { ServiceItem } from '@/components/ServiceCard';
import {
  Search,
  Send,
  Wrench,
  CreditCard,
  ShieldCheck,
  Clock,
  CheckCircle,
  Smartphone,
  Laptop,
  Wind,
  Refrigerator,
  Tv,
  WashingMachine,
  Zap,
} from 'lucide-react';
import Image from 'next/image';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const CATEGORIES = [
  { name: 'Smartphone', icon: Smartphone },
  { name: 'Laptop & PC', icon: Laptop },
  { name: 'AC', icon: Wind },
  { name: 'Refrigerator', icon: Refrigerator },
  { name: 'TV', icon: Tv },
  { name: 'Washing Machine', icon: WashingMachine },
  { name: 'Electrical', icon: Zap },
];

// 1. Dynamic Async Component wrapped in Suspense
async function FeaturedServicesSection() {
  let latestServices: ServiceItem[] = [];
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
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
        <p className="text-slate-600">No approved services available yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {latestServices.map((service) => (
        <ServiceCard key={service._id} service={service} />
      ))}
    </div>
  );
}

function FeaturedServicesSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="h-80 bg-white rounded-2xl border border-slate-200 animate-pulse"
        />
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <div>
      {/* 1. Hero Banner */}
      <section className="bg-linear-to-br from-slate-900 via-blue-950 to-slate-900 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block px-3.5 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-4">
              Trusted On-Demand Repair Platform
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
              Broken Device? Get It Fixed by Verified Technicians
            </h1>
            <p className="mt-4 text-slate-300 text-lg leading-relaxed max-w-xl">
              Book reliable smartphone, laptop, and home appliance repairs. Track every stage live and pay securely only after the job is done.
            </p>

            {/* Search Form redirecting to /services */}
            <form
              action="/services"
              method="GET"
              className="mt-8 flex flex-col sm:flex-row gap-2 max-w-lg bg-white p-2 rounded-xl shadow-lg"
            >
              <input
                type="text"
                name="search"
                placeholder="Search e.g. iPhone screen, AC gas refill..."
                className="flex-1 px-4 py-2.5 text-slate-900 text-sm focus:outline-none"
              />
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm transition flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                Find Services
              </button>
            </form>
          </div>

          <div className="hidden lg:block">
            <Image
              src="https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=900&q=80"
              alt="Technician repairing electronic circuit board"
              width={900}
              height={600}
              priority
              className="rounded-2xl shadow-2xl border border-white/10 object-cover h-100 w-full"
            />
          </div>
        </div>
      </section>

      {/* 2. Dynamic Featured Services (6 Latest Approved) wrapped in Suspense */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">
              Latest Repair Services
            </h2>
            <p className="text-slate-600 mt-1">
              Recently listed and admin-verified services ready for booking
            </p>
          </div>
          <Link
            href="/services"
            className="text-sm font-semibold text-blue-600 hover:underline"
          >
            Browse All Services →
          </Link>
        </div>

        <Suspense fallback={<FeaturedServicesSkeleton />}>
          <FeaturedServicesSection />
        </Suspense>
      </section>

      {/* 3. How FixMate Works (4-Step Visual Flow) */}
      <section className="bg-white border-y border-slate-200 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-slate-900">How FixMate Works</h2>
            <p className="text-slate-600 mt-2">
              Transparent, step-by-step repair tracking with zero upfront risk
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Find a Service',
                desc: 'Search and compare verified technicians by appliance category and service mode.',
                icon: Search,
              },
              {
                step: '02',
                title: 'Send a Request',
                desc: 'Describe the issue, choose your preferred date, and submit a booking request.',
                icon: Send,
              },
              {
                step: '03',
                title: 'Technician Fixes It',
                desc: 'Track real-time job updates from Accepted to In Progress and Completed.',
                icon: Wrench,
              },
              {
                step: '04',
                title: 'Pay After Completion',
                desc: 'Settle the final invoice safely via Stripe only after your repair is finished.',
                icon: CreditCard,
              },
            ].map((item) => (
              <div
                key={item.step}
                className="p-6 rounded-2xl bg-slate-50 border border-slate-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="text-2xl font-extrabold text-slate-200">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Popular Categories & Why Choose Us */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl font-bold text-slate-900">Popular Categories</h2>
          <p className="text-slate-600 mt-2">
            Click a category to browse specialists in your area
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4 mb-16">
          {CATEGORIES.map(({ name, icon: Icon }) => (
            <Link
              key={name}
              href={`/services?category=${encodeURIComponent(name)}`}
              className="flex flex-col items-center justify-center p-5 bg-white rounded-2xl border border-slate-200 hover:border-blue-600 hover:shadow-sm transition text-center group"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition mb-3">
                <Icon className="w-6 h-6" />
              </div>
              <span className="text-sm font-semibold text-slate-800">{name}</span>
            </Link>
          ))}
        </div>

        {/* Why Choose Us Trust Strip */}
        <div className="bg-blue-600 rounded-3xl p-8 sm:p-12 text-white grid md:grid-cols-3 gap-8">
          <div className="flex items-start gap-4">
            <ShieldCheck className="w-8 h-8 text-blue-200 shrink-0" />
            <div>
              <h3 className="font-bold text-lg">Admin-Approved Services</h3>
              <p className="text-sm text-blue-100 mt-1">
                Every technician listing is reviewed before appearing on FixMate.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Clock className="w-8 h-8 text-blue-200 shrink-0" />
            <div>
              <h3 className="font-bold text-lg">Live Job Status Pipeline</h3>
              <p className="text-sm text-blue-100 mt-1">
                Know the exact moment your device is accepted, in progress, or ready.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <CheckCircle className="w-8 h-8 text-blue-200 shrink-0" />
            <div>
              <h3 className="font-bold text-lg">Pay Only After Service</h3>
              <p className="text-sm text-blue-100 mt-1">
                Zero advance payments—pay via Stripe once the repair is completed.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}