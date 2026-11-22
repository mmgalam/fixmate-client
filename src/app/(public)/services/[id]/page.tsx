"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "@/lib/auth-client";
import { fetchWithAuth } from "@/lib/api";
import type { Service, UserProfile } from "@/types";
import { toast } from "sonner";
import {
  MapPin,
  Clock,
  Wrench,
  ShieldCheck,
  X,
  CheckCircle2,
  Star,
  Lock,
  ArrowLeft,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface ServiceReview {
  customerName: string;
  rating: number;
  review?: string;
  reviewedAt?: string;
}

function getLocalTodayString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function ServiceDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session } = useSession();

  const [service, setService] = useState<Service | null>(null);
  const [technician, setTechnician] = useState<Partial<UserProfile> | null>(
    null,
  );
  const [reviews, setReviews] = useState<ServiceReview[]>([]);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMissing, setIsMissing] = useState(false);

  // Repair Request Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [customerPhone, setCustomerPhone] = useState("");
  const [address, setAddress] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [problemDescription, setProblemDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);

  useEffect(() => {
    let active = true;
    fetch(`${API_URL}/api/services/${id}`)
      .then(async (res) => {
        if (!res.ok) {
          if (active) setIsMissing(true);
          return null;
        }
        return res.json();
      })
      .then(
        (
          data: {
            service?: Service;
            technician?: Partial<UserProfile>;
            reviews?: ServiceReview[];
            averageRating?: number | null;
          } | null,
        ) => {
          if (!active || !data) return;
          setService(data.service || null);
          setTechnician(data.technician || null);
          setReviews(Array.isArray(data.reviews) ? data.reviews : []);
          setAverageRating(data.averageRating ?? null);
        },
      )
      .catch(() => {
        if (active) setIsMissing(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  // Close modal on Escape key & lock body scroll while open
  useEffect(() => {
    if (!modalOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !submitting) {
        setModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [modalOpen, submitting]);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="mb-6 h-5 w-36 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="h-[460px] animate-pulse rounded-3xl border border-slate-200 bg-white lg:col-span-2 dark:border-slate-800 dark:bg-slate-900" />
          <div className="space-y-6">
            <div className="h-56 animate-pulse rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900" />
            <div className="h-44 animate-pulse rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900" />
          </div>
        </div>
      </div>
    );
  }

  if (isMissing || !service) {
    notFound();
  }

  const user = session?.user;
  const role = user?.role as string | undefined;
  const todayStr = getLocalTodayString();

  const handleRequestButtonClick = () => {
    if (!user) {
      router.push(
        `/sign-in?callbackUrl=${encodeURIComponent(`/services/${id}`)}`,
      );
      return;
    }
    setModalOpen(true);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (problemDescription.trim().length < 20) {
      toast.error("Please describe the problem in at least 20 characters.");
      return;
    }

    setSubmitting(true);
    try {
      await fetchWithAuth("/api/bookings", {
        method: "POST",
        body: JSON.stringify({
          serviceId: service._id,
          customerPhone: customerPhone.trim(),
          address: address.trim(),
          preferredDate,
          problemDescription: problemDescription.trim(),
        }),
      });

      toast.success("Repair request submitted successfully!");
      setRequestSuccess(true);
      setModalOpen(false);
      setCustomerPhone("");
      setAddress("");
      setPreferredDate("");
      setProblemDescription("");
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Failed to submit repair request",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      {/* Back navigation */}
      <div className="mb-6">
        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 transition hover:text-indigo-600 dark:text-slate-400 dark:hover:text-cyan-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Services
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left 2 Columns: Service Banner, Specs & Customer Reviews */}
        <div className="space-y-6 lg:col-span-2">
          <div className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-3d-card dark:border-slate-800 dark:bg-slate-900">
            <div className="relative h-64 w-full bg-slate-900 sm:h-96">
              <Image
                src={service.image}
                alt={service.title}
                fill
                priority
                unoptimized
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/60 via-transparent to-transparent" />
            </div>

            <div className="p-6 sm:p-8">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded-lg bg-indigo-600 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                  {service.category}
                </span>
                <span className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  {service.serviceMode}
                </span>
                {averageRating && (
                  <span className="inline-flex items-center gap-1 rounded-lg border border-amber-200/70 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 dark:border-amber-800/50 dark:bg-amber-950/60 dark:text-amber-300">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    {averageRating} ({reviews.length})
                  </span>
                )}
              </div>

              <h1
                style={{ fontFamily: "var(--font-display)" }}
                className="text-2xl font-black text-slate-950 sm:text-3xl dark:text-white"
              >
                {service.title}
              </h1>

              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3 border-y border-slate-100 py-4 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 shrink-0 text-indigo-600 dark:text-cyan-400" />
                  <span>
                    Area:{" "}
                    <strong className="text-slate-900 dark:text-white">
                      {service.serviceArea}
                    </strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 shrink-0 text-indigo-600 dark:text-cyan-400" />
                  <span>
                    Est. Duration:{" "}
                    <strong className="text-slate-900 dark:text-white">
                      {service.estimatedDuration}
                    </strong>
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <h2 className="mb-2 text-lg font-extrabold text-slate-900 dark:text-white">
                  Service Description
                </h2>
                <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-300">
                  {service.description}
                </p>
              </div>
            </div>
          </div>

          {/* Customer Reviews Section (If any exist) */}
          {reviews.length > 0 && (
            <div className="space-y-4 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-3d-card sm:p-8 dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                Verified Customer Reviews ({reviews.length})
              </h2>
              <div className="space-y-3">
                {reviews.map((rev, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-slate-200/70 bg-slate-50 p-4 dark:border-slate-700/70 dark:bg-slate-800/60"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {rev.customerName}
                      </span>
                      <span
                        aria-label={`${rev.rating} out of 5 stars`}
                        className="text-xs font-bold text-amber-500"
                      >
                        {"★".repeat(rev.rating)}
                      </span>
                    </div>
                    {rev.review && (
                      <p className="mt-1.5 text-xs leading-relaxed text-slate-600 sm:text-sm dark:text-slate-300">
                        {rev.review}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Pricing, Request Action & Technician Card */}
        <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-3d-card dark:border-slate-800 dark:bg-slate-900">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Starting Service Price
            </span>
            <div
              style={{ fontFamily: "var(--font-mono)" }}
              className="mt-1 text-4xl font-black text-slate-950 dark:text-white"
            >
              ${service.basePrice}
            </div>
            <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <Lock className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
              Pay via Stripe only after repair completion.
            </p>

            {/* Role-Restricted Action Area */}
            <div className="mt-6">
              {role === "technician" || role === "admin" ? (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-center text-xs font-bold text-amber-800 dark:border-amber-800/70 dark:bg-amber-950/60 dark:text-amber-300">
                  Only customers can request a repair.
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleRequestButtonClick}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-indigo-600 to-cyan-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/25 transition hover:from-indigo-700 hover:to-cyan-700"
                >
                  <Wrench className="h-4 w-4" />
                  Request Repair
                </button>
              )}

              {requestSuccess && (
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-800 dark:border-emerald-800/70 dark:bg-emerald-950/60 dark:text-emerald-300">
                  <span className="flex items-center gap-1.5 font-bold">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    Request sent!
                  </span>
                  <Link
                    href="/dashboard/customer/bookings"
                    className="whitespace-nowrap font-extrabold underline hover:text-emerald-950 dark:hover:text-emerald-200"
                  >
                    View My Bookings &rarr;
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Technician Summary Card */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-3d-card dark:border-slate-800 dark:bg-slate-900">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">
              Service Technician
            </h3>
            <div className="flex items-center gap-3.5">
              <Image
                src={
                  technician?.image ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    service.technicianName,
                  )}&background=4f46e5&color=fff`
                }
                alt={service.technicianName}
                width={56}
                height={56}
                unoptimized
                className="h-14 w-14 shrink-0 rounded-2xl border border-slate-200 object-cover dark:border-slate-700"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="truncate font-extrabold text-slate-900 dark:text-white">
                    {service.technicianName}
                  </h4>
                  <ShieldCheck className="h-4 w-4 shrink-0 text-cyan-500" />
                </div>
                <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
                  {technician?.area || service.serviceArea}
                </p>
              </div>
            </div>
            {technician?.bio && (
              <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {technician.bio}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Customer Repair Request Modal */}
      {modalOpen && user && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="request-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
        >
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-8 dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-5 flex items-center justify-between">
              <h2
                id="request-modal-title"
                style={{ fontFamily: "var(--font-display)" }}
                className="text-xl font-black text-slate-950 dark:text-white"
              >
                Request Repair
              </h2>
              <button
                type="button"
                aria-label="Close modal"
                onClick={() => setModalOpen(false)}
                className="rounded-xl p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase text-slate-400">
                    Your Name
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={user.name || ""}
                    className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-800/70 dark:text-slate-400"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase text-slate-400">
                    Your Email
                  </label>
                  <input
                    type="email"
                    readOnly
                    value={user.email || ""}
                    className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-800/70 dark:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-bold text-slate-700 dark:text-slate-300">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="e.g. +880 1712-345678"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-bold text-slate-700 dark:text-slate-300">
                  Service / Pickup Address *
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House, Road, Area..."
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-bold text-slate-700 dark:text-slate-300">
                  Preferred Date *
                </label>
                <input
                  type="date"
                  required
                  min={todayStr}
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:scheme-dark dark:focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-bold text-slate-700 dark:text-slate-300">
                  Problem Description * (min 20 characters)
                </label>
                <textarea
                  rows={4}
                  required
                  minLength={20}
                  value={problemDescription}
                  onChange={(e) => setProblemDescription(e.target.value)}
                  placeholder="Describe the exact issue with your device or appliance..."
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-cyan-400"
                />
                <span
                  className={`mt-1 block text-xs font-medium ${
                    problemDescription.trim().length >= 20
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-slate-400"
                  }`}
                >
                  {problemDescription.trim().length} / 20 characters minimum
                </span>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-linear-to-r from-indigo-600 to-cyan-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-indigo-600/20 transition hover:from-indigo-700 hover:to-cyan-700 disabled:opacity-60"
                >
                  {submitting ? "Submitting..." : "Submit Repair Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}