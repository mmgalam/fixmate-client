'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ServiceCard from '@/components/ServiceCard';
import type { Service } from '@/types';
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  Wrench,
  Sparkles,
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const CATEGORIES = [
  'Smartphone',
  'Laptop & PC',
  'AC',
  'Refrigerator',
  'TV',
  'Washing Machine',
  'Electrical',
];

function ServicesBrowserContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Derive filters directly from URL params (React 19 compiler-safe)
  const urlSearch = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const serviceMode = searchParams.get('serviceMode') || '';
  const sort = searchParams.get('sort') || 'newest';

  const [searchInput, setSearchInput] = useState(urlSearch);
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
        if (err instanceof Error && err.name !== 'AbortError') {
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
    router.replace(next ? `/services?${next}` : '/services');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrlParams({ search: searchInput.trim() });
  };

  const handleResetFilters = () => {
    setSearchInput('');
    router.replace('/services');
  };

  const hasActiveFilters = Boolean(urlSearch || category || serviceMode || sort !== 'newest');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Page Header */}
      <div className="max-w-2xl mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200/70 dark:border-indigo-800/60 text-indigo-700 dark:text-cyan-300 text-xs font-bold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>ADMIN-VERIFIED SPECIALISTS</span>
        </div>
        <h1
          style={{ fontFamily: 'var(--font-display)' }}
          className="text-3xl sm:text-4xl font-black text-slate-950 dark:text-white tracking-tight"
        >
          Browse Repair Services
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2">
          Search and filter vetted repair services by device type, service mode, and price[cite: 3].
        </p>
      </div>

      {/* Responsive Search, Filter & Sort Control Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 shadow-3d-card mb-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="md:col-span-5 flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                key={urlSearch}
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search title or category..."
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-950/60 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-linear-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 shrink-0 transition"
            >
              Search
            </button>
          </form>

          {/* Category Dropdown */}
          <div className="md:col-span-3">
            <select
              value={category}
              onChange={(e) => updateUrlParams({ category: e.target.value })}
              aria-label="Filter by category"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Service Mode Dropdown */}
          <div className="md:col-span-2">
            <select
              value={serviceMode}
              onChange={(e) => updateUrlParams({ serviceMode: e.target.value })}
              aria-label="Filter by service mode"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              <option value="">All Modes</option>
              <option value="Home Visit">Home Visit</option>
              <option value="Shop Drop-off">Shop Drop-off</option>
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="md:col-span-2">
            <select
              value={sort}
              onChange={(e) => updateUrlParams({ sort: e.target.value })}
              aria-label="Sort services"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              <option value="newest">Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Active Filter Summary & Reset */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-600 dark:text-cyan-400" />
            <span>
              Showing <strong className="text-slate-900 dark:text-white">{services.length}</strong> approved{' '}
              {services.length === 1 ? 'service' : 'services'}
            </span>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-bold hover:underline"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset All Filters
            </button>
          )}
        </div>
      </div>

      {/* Responsive Services Grid (3 Desktop, 2 Tablet, 1 Mobile) */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-80 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 animate-pulse"
            />
          ))}
        </div>
      ) : services.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-14 text-center shadow-3d-card">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-cyan-400 flex items-center justify-center mx-auto mb-4">
            <Wrench className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
            No matching repair services found
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 max-w-md mx-auto">
            Try adjusting your search keywords, switching service mode, or clearing the active filters[cite: 3].
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="mt-6 px-5 py-2.5 rounded-xl bg-linear-to-r from-indigo-600 to-cyan-600 text-white text-sm font-bold shadow-md shadow-indigo-600/20"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
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
        <div className="max-w-7xl mx-auto px-4 py-14">
          <div className="h-96 bg-white dark:bg-slate-900 rounded-2xl animate-pulse" />
        </div>
      }
    >
      <ServicesBrowserContent />
    </Suspense>
  );
}