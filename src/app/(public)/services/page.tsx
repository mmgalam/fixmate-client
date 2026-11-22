"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ServiceCard from "@/components/ServiceCard";
import type { Service } from "@/types";
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  Wrench,
  Sparkles,
  X,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const CATEGORIES = [
  "Smartphone",
  "Laptop & PC",
  "AC",
  "Refrigerator",
  "TV",
  "Washing Machine",
  "Electrical",
];

function ServicesGridSkeleton() {
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

function ServicesBrowserContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Derive filters directly from URL params (React 19 compiler-safe)
  const urlSearch = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const serviceMode = searchParams.get("serviceMode") || "";
  const sort = searchParams.get("sort") || "newest";

  const [services, setServices] = useState<Service[]>([]);
  const [loadedQuery, setLoadedQuery] = useState<string | null>(null);

  const queryString = searchParams.toString();
  const loading = loadedQuery !== queryString;

  useEffect(() => {
    const controller = new AbortController();

    fetch(`${API_URL}/api/services?${queryString}`, {
      signal: controller.signal,
    })
      .then((res) => (res.ok ? res.json() : []))
      .then((data: unknown) => {
        setServices(Array.isArray(data) ? (data as Service[]) : []);
        setLoadedQuery(queryString);
      })
      .catch((err: unknown) => {
        if (err instanceof Error && err.name !== "AbortError") {
          setServices([]);
          setLoadedQuery(queryString);
        }
      });

    return () => controller.abort();
  }, [queryString]);

  const updateUrlParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, val]) => {
      if (val) {
        params.set(key, val);
      } else {
        params.delete(key);
      }
    });
    const next = params.toString();
    router.replace(next ? `/services?${next}` : "/services", { scroll: false });
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const term = String(formData.get("search") || "").trim();
    updateUrlParams({ search: term });
  };

  const handleResetFilters = () => {
    router.replace("/services", { scroll: false });
  };

  const hasActiveFilters = Boolean(
    urlSearch || category || serviceMode || sort !== "newest"
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      {/* Page Header */}
      <div className="mb-8 max-w-2xl">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-200/70 bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 dark:border-indigo-800/60 dark:bg-indigo-950/80 dark:text-cyan-300">
          <Sparkles className="h-3.5 w-3.5" />
          <span>ADMIN-VERIFIED SPECIALISTS</span>
        </div>
        <h1
          style={{ fontFamily: "var(--font-display)" }}
          className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl dark:text-white"
        >
          Browse Repair Services
        </h1>
        <p className="mt-2 text-sm text-slate-600 sm:text-base dark:text-slate-400">
          Search and filter vetted repair services by device type, service mode,
          and price.
        </p>
      </div>

      {/* Responsive Search, Filter & Sort Control Bar */}
      <div className="mb-8 space-y-4 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-3d-card sm:p-5 dark:border-slate-800 dark:bg-slate-900">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
          {/* Search Input */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center gap-2 lg:col-span-5"
          >
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                key={urlSearch}
                type="text"
                name="search"
                defaultValue={urlSearch}
                placeholder="Search title or category..."
                aria-label="Search services by title or category"
                className="w-full rounded-xl border border-slate-300 bg-slate-50/70 py-2.5 pl-10 pr-9 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 dark:border-slate-700 dark:bg-slate-950/70 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20"
              />
              {urlSearch && (
                <button
                  type="button"
                  onClick={() => updateUrlParams({ search: "" })}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:bg-slate-200/70 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="shrink-0 whitespace-nowrap rounded-xl bg-linear-to-r from-indigo-600 to-cyan-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/20 transition hover:from-indigo-700 hover:to-cyan-700 sm:px-5 sm:text-sm"
            >
              Search
            </button>
          </form>

          {/* Filter & Sort Dropdowns (3 spacious columns on tablet & desktop) */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:col-span-7">
            <select
              value={category}
              onChange={(e) => updateUrlParams({ category: e.target.value })}
              aria-label="Filter by category"
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800 transition focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <select
              value={serviceMode}
              onChange={(e) => updateUrlParams({ serviceMode: e.target.value })}
              aria-label="Filter by service mode"
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800 transition focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20"
            >
              <option value="">All Modes</option>
              <option value="Home Visit">Home Visit</option>
              <option value="Shop Drop-off">Shop Drop-off</option>
            </select>

            <select
              value={sort}
              onChange={(e) => updateUrlParams({ sort: e.target.value })}
              aria-label="Sort services"
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800 transition focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20"
            >
              <option value="newest">Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Active Filter Summary, Pills & Reset */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-xs dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-2 text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <SlidersHorizontal className="h-3.5 w-3.5 text-indigo-600 dark:text-cyan-400" />
              <span>
                Showing{" "}
                <strong className="text-slate-900 dark:text-white">
                  {loading ? "..." : services.length}
                </strong>{" "}
                approved {services.length === 1 ? "service" : "services"}
              </span>
            </span>

            {category && (
              <button
                type="button"
                onClick={() => updateUrlParams({ category: "" })}
                className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 font-semibold text-indigo-700 transition hover:bg-indigo-100 dark:bg-indigo-950 dark:text-cyan-300 dark:hover:bg-indigo-900/70"
              >
                {category}
                <X className="h-3 w-3" />
              </button>
            )}

            {serviceMode && (
              <button
                type="button"
                onClick={() => updateUrlParams({ serviceMode: "" })}
                className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 font-semibold text-indigo-700 transition hover:bg-indigo-100 dark:bg-indigo-950 dark:text-cyan-300 dark:hover:bg-indigo-900/70"
              >
                {serviceMode}
                <X className="h-3 w-3" />
              </button>
            )}

            {urlSearch && (
              <button
                type="button"
                onClick={() => updateUrlParams({ search: "" })}
                className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 font-semibold text-indigo-700 transition hover:bg-indigo-100 dark:bg-indigo-950 dark:text-cyan-300 dark:hover:bg-indigo-900/70"
              >
                &ldquo;{urlSearch}&rdquo;
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 font-bold text-rose-600 hover:underline dark:text-rose-400"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset All Filters
            </button>
          )}
        </div>
      </div>

      {/* Responsive Services Grid (3 Desktop, 2 Tablet, 1 Mobile) */}
      {loading ? (
        <ServicesGridSkeleton />
      ) : services.length === 0 ? (
        <div className="rounded-3xl border border-slate-200/90 bg-white p-10 text-center shadow-3d-card sm:p-14 dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-cyan-400">
            <Wrench className="h-7 w-7" />
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
            No matching repair services found
          </h3>
          <p className="mx-auto mt-1.5 max-w-md text-sm text-slate-500 dark:text-slate-400">
            Try adjusting your search keywords, switching service mode, or
            clearing the active filters.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="mt-6 rounded-xl bg-linear-to-r from-indigo-600 to-cyan-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-indigo-600/20 transition hover:from-indigo-700 hover:to-cyan-700"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service._id} service={service} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function BrowseServicesPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div className="mb-8 h-24 max-w-md animate-pulse rounded-2xl bg-slate-200/70 dark:bg-slate-800/70" />
          <div className="mb-8 h-28 animate-pulse rounded-2xl bg-white dark:bg-slate-900" />
          <ServicesGridSkeleton />
        </div>
      }
    >
      <ServicesBrowserContent />
    </Suspense>
  );
}