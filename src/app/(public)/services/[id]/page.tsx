'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from '@/lib/auth-client';
import { fetchWithAuth } from '@/lib/api';
import type { Service, UserProfile } from '@/types';
import { toast } from 'sonner';
import {
  MapPin,
  Clock,
  Wrench,
  ShieldCheck,
  X,
  CheckCircle2,
  Star,
  Lock,
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface ServiceReview {
  customerName: string;
  rating: number;
  review?: string;
  reviewedAt?: string;
}

export default function ServiceDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session } = useSession();

  const [service, setService] = useState<Service | null>(null);
  const [technician, setTechnician] = useState<Partial<UserProfile> | null>(null);
  const [reviews, setReviews] = useState<ServiceReview[]>([]);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMissing, setIsMissing] = useState(false);

  // Repair Request Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [customerPhone, setCustomerPhone] = useState('');
  const [address, setAddress] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [problemDescription, setProblemDescription] = useState('');
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
      .then((data: {
        service?: Service;
        technician?: Partial<UserProfile>;
        reviews?: ServiceReview[];
        averageRating?: number | null;
      } | null) => {
        if (!active || !data) return;
        setService(data.service || null);
        setTechnician(data.technician || null);
        setReviews(Array.isArray(data.reviews) ? data.reviews : []);
        setAverageRating(data.averageRating ?? null);
      })
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

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-14">
        <div className="h-96 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 animate-pulse" />
      </div>
    );
  }

  if (isMissing || !service) {
    notFound();
  }

  const user = session?.user;
  const role = user?.role as string | undefined;
  const todayStr = new Date().toISOString().split('T')[0];

  const handleRequestButtonClick = () => {
    if (!user) {
      router.push(`/sign-in?callbackUrl=${encodeURIComponent(`/services/${id}`)}`);
      return;
    }
    setModalOpen(true);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (problemDescription.trim().length < 20) {
      toast.error('Please describe the problem in at least 20 characters.');
      return;
    }

    setSubmitting(true);
    try {
      await fetchWithAuth('/api/bookings', {
        method: 'POST',
        body: JSON.stringify({
          serviceId: service._id,
          customerPhone: customerPhone.trim(),
          address: address.trim(),
          preferredDate,
          problemDescription: problemDescription.trim(),
        }),
      });

      toast.success('Repair request submitted successfully!');
      setRequestSuccess(true);
      setModalOpen(false);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to submit repair request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Service Banner, Specs & Customer Reviews */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-3d-card">
            <div className="relative h-64 sm:h-96 w-full bg-slate-900">
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
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-indigo-600 text-white">
                  {service.category}
                </span>
                <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {service.serviceMode}
                </span>
                {averageRating && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/70 dark:border-amber-800/50">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {averageRating} ({reviews.length})
                  </span>
                )}
              </div>

              <h1
                style={{ fontFamily: 'var(--font-display)' }}
                className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white"
              >
                {service.title}
              </h1>

              <div className="mt-4 flex flex-wrap gap-6 text-sm text-slate-600 dark:text-slate-400 border-y border-slate-100 dark:border-slate-800 py-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-indigo-600 dark:text-cyan-400 shrink-0" />
                  <span>
                    Area: <strong className="text-slate-900 dark:text-white">{service.serviceArea}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-600 dark:text-cyan-400 shrink-0" />
                  <span>
                    Est. Duration: <strong className="text-slate-900 dark:text-white">{service.estimatedDuration}</strong>
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white mb-2">
                  Service Description
                </h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line text-sm sm:text-base">
                  {service.description}
                </p>
              </div>
            </div>
          </div>

          {/* Customer Reviews Section (If any exist) */}
          {reviews.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-3d-card space-y-4">
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                Verified Customer Reviews ({reviews.length})
              </h2>
              <div className="space-y-3">
                {reviews.map((rev, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/70"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {rev.customerName}
                      </span>
                      <span className="text-xs font-bold text-amber-500">
                        {'★'.repeat(rev.rating)}
                      </span>
                    </div>
                    {rev.review && (
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1.5">
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
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-3d-card">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Starting Service Price
            </span>
            <div
              style={{ fontFamily: 'var(--font-mono)' }}
              className="text-4xl font-black text-slate-950 dark:text-white mt-1"
            >
              ${service.basePrice}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              Pay via Stripe only after repair completion[cite: 3].
            </p>

            {/* Role-Restricted Action Area */}
            <div className="mt-6">
              {role === 'technician' || role === 'admin' ? (
                <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-bold text-center">
                  Only customers can request a repair[cite: 3].
                </div>
              ) : (
                <button
                  onClick={handleRequestButtonClick}
                  className="w-full py-3.5 px-4 rounded-xl bg-linear-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white text-sm font-bold shadow-lg shadow-indigo-600/25 transition flex items-center justify-center gap-2"
                >
                  <Wrench className="w-4 h-4" />
                  Request Repair
                </button>
              )}

              {requestSuccess && (
                <div className="mt-4 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5 font-bold">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    Request sent!
                  </span>
                  <Link
                    href="/dashboard/customer/bookings"
                    className="font-extrabold underline whitespace-nowrap"
                  >
                    View My Bookings →
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Technician Summary Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-3d-card">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              Service Technician
            </h3>
            <div className="flex items-center gap-3.5">
              <Image
                src={
                  technician?.image ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    service.technicianName
                  )}&background=4f46e5&color=fff`
                }
                alt={service.technicianName}
                width={56}
                height={56}
                unoptimized
                className="w-14 h-14 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-extrabold text-slate-900 dark:text-white">
                    {service.technicianName}
                  </h4>
                  <ShieldCheck className="w-4 h-4 text-cyan-500 shrink-0" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {technician?.area || service.serviceArea}
                </p>
              </div>
            </div>
            {technician?.bio && (
              <p className="mt-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {technician.bio}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Customer Repair Request Modal */}
      {modalOpen && user && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2
                style={{ fontFamily: 'var(--font-display)' }}
                className="text-xl font-black text-slate-950 dark:text-white"
              >
                Request Repair
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={user.name || ''}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/70 text-sm text-slate-500 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                    Your Email
                  </label>
                  <input
                    type="email"
                    readOnly
                    value={user.email || ''}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/70 text-sm text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="e.g. +880 1712-345678"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Service / Pickup Address *
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House, Road, Area..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Preferred Date *
                </label>
                <input
                  type="date"
                  required
                  min={todayStr}
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Problem Description * (min 20 characters)
                </label>
                <textarea
                  rows={4}
                  required
                  minLength={20}
                  value={problemDescription}
                  onChange={(e) => setProblemDescription(e.target.value)}
                  placeholder="Describe the exact issue with your device or appliance..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
                <span className="text-xs text-slate-400">
                  {problemDescription.trim().length} / 20 characters minimum
                </span>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-linear-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 disabled:opacity-60 text-white text-sm font-bold shadow-md shadow-indigo-600/20"
                >
                  {submitting ? 'Submitting...' : 'Submit Repair Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}