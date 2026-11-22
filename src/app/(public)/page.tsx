import { Suspense } from "react";
import Link from "next/link";
import ServiceCard from "@/components/ServiceCard";
import HeroSection from "@/components/HeroSection";
import ProcessShowcase from "@/components/ProcessShowcase";
import SectionHeading from "@/components/SectionHeading";
import {
  StatsBar,
  CategoryShelf,
  TrustCompare,
  AudienceSplit,
} from "@/components/HomeSections";
import type { Service } from "@/types";
import { ArrowRight } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

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
      <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-12 text-center dark:border-slate-800 dark:bg-slate-950/60">
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
          Services are taking a moment to load. Please refresh the page.
        </p>
      </div>
    );
  }

  if (latestServices.length === 0) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-12 text-center dark:border-slate-800 dark:bg-slate-950/60">
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
          No approved services available yet.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
      {latestServices.map((service) => (
        <ServiceCard key={service._id} service={service} />
      ))}
    </div>
  );
}

function FeaturedServicesSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="h-48 w-full animate-pulse bg-slate-200 dark:bg-slate-800" />
          <div className="flex flex-1 flex-col justify-between space-y-4 p-5">
            <div className="space-y-2.5">
              <div className="h-5 w-3/4 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
              <div className="h-3.5 w-1/2 animate-pulse rounded-md bg-slate-100 dark:bg-slate-800/70" />
              <div className="h-3.5 w-2/3 animate-pulse rounded-md bg-slate-100 dark:bg-slate-800/70" />
            </div>
            <div className="flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
              <div className="h-7 w-16 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
              <div className="h-9 w-28 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <StatsBar />
      <CategoryShelf />

      <section className="border-y border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <SectionHeading
              align="left"
              title="Latest repair services"
              subtitle="Every listing is reviewed and approved by our admin team"
            />
            <Link
              href="/services"
              className="inline-flex shrink-0 self-start items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-indigo-600 transition-all hover:border-indigo-500 hover:bg-indigo-50/50 hover:shadow-md sm:self-auto dark:border-slate-700 dark:bg-slate-800/80 dark:text-cyan-400 dark:hover:border-cyan-500/60 dark:hover:bg-slate-800"
            >
              Browse all services
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <Suspense fallback={<FeaturedServicesSkeleton />}>
            <FeaturedServicesSection />
          </Suspense>
        </div>
      </section>

      <ProcessShowcase />
      <TrustCompare />
      <AudienceSplit />
    </div>
  );
}