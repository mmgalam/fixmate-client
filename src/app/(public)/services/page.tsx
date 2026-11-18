"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ServiceCard, { ServiceItem } from "@/components/ServiceCard";
import { Search, SlidersHorizontal, Wrench } from "lucide-react";

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

function BrowseServicesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Derive active filter values directly from URL query params
  const urlSearch = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const serviceMode = searchParams.get("serviceMode") || "";
  const sort = searchParams.get("sort") || "newest";

  const [searchInput, setSearchInput] = useState(urlSearch);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loadedQuery, setLoadedQuery] = useState<string | null>(null);

  // Build normalized query string for the backend API
  const queryObj = new URLSearchParams();
  if (urlSearch) queryObj.set("search", urlSearch);
  if (category) queryObj.set("category", category);
  if (serviceMode) queryObj.set("serviceMode", serviceMode);
  if (sort) queryObj.set("sort", sort);
  const currentQuery = queryObj.toString();

  // Loading is true whenever the current URL query hasn't finished fetching yet
  const loading = loadedQuery !== currentQuery;

  // Fetch filtered/sorted results directly from MongoDB via Express API
  useEffect(() => {
    const controller = new AbortController();

    fetch(`${API_URL}/api/services?${currentQuery}`, {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data) => {
        setServices(Array.isArray(data) ? data : []);
        setLoadedQuery(currentQuery);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setServices([]);
          setLoadedQuery(currentQuery);
        }
      });

    return () => controller.abort();
  }, [currentQuery]);

  const updateUrlParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    router.replace(`/services?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrlParams({ search: searchInput.trim() });
  };

  const handleResetFilters = () => {
    setSearchInput("");
    router.replace("/services");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900">
          Browse Repair Services
        </h1>
        <p className="text-slate-600 mt-1">
          Search verified repair specialists by device, category, or service
          mode
        </p>
      </div>

      {/* Server-Side Search, Filter & Sort Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs mb-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="lg:col-span-2 flex gap-2"
          >
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                key={urlSearch}
                type="text"
                defaultValue={urlSearch}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search title or category..."
                className="w-full pl-10 pr-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition"
            >
              Search
            </button>
          </form>

          {/* Category Filter */}
          <select
            value={category}
            onChange={(e) => updateUrlParams({ category: e.target.value })}
            className="px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Service Mode Filter */}
          <select
            value={serviceMode}
            onChange={(e) => updateUrlParams({ serviceMode: e.target.value })}
            className="px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="">All Service Modes</option>
            <option value="Home Visit">Home Visit</option>
            <option value="Shop Drop-off">Shop Drop-off</option>
          </select>

          {/* Sort Dropdown */}
          <select
            value={sort}
            onChange={(e) => updateUrlParams({ sort: e.target.value })}
            className="px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="newest">Sort: Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>

        {(urlSearch || category || serviceMode || sort !== "newest") && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
            <span className="text-slate-500 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Active filters applied
            </span>
            <button
              onClick={handleResetFilters}
              className="text-blue-600 font-semibold hover:underline"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>

      {/* Results Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="h-80 bg-white rounded-2xl border border-slate-200 animate-pulse"
            />
          ))}
        </div>
      ) : services.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
          <Wrench className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-900">
            No matching services found
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Try adjusting your search keywords or clearing active filters.
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-5 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
      fallback={<div className="p-12 text-center">Loading services...</div>}
    >
      <BrowseServicesContent />
    </Suspense>
  );
}
