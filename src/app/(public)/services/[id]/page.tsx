"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "@/lib/auth-client";
import { fetchWithAuth } from "@/lib/api";
import { ServiceItem } from "@/components/ServiceCard";
import { toast } from "sonner";
import {
  MapPin,
  Clock,
  Wrench,
  ShieldCheck,
  Calendar,
  X,
  CheckCircle2,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface TechnicianSummary {
  name: string;
  email: string;
  image?: string;
  area?: string;
  bio?: string;
}

export default function ServiceDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session } = useSession();

  const [service, setService] = useState<ServiceItem | null>(null);
  const [technician, setTechnician] = useState<TechnicianSummary | null>(null);
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
    fetch(`${API_URL}/api/services/${id}`)
      .then(async (res) => {
        if (!res.ok) {
          setIsMissing(true);
          return null;
        }
        return res.json();
      })
      .then(
        (
          data: {
            service: ServiceItem;
            technician: TechnicianSummary | null;
          } | null,
        ) => {
          if (data) {
            setService(data.service);
            setTechnician(data.technician);
          }
        },
      )
      .catch(() => setIsMissing(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="h-96 bg-white rounded-2xl border border-slate-200 animate-pulse" />
      </div>
    );
  }

  if (isMissing || !service) {
    notFound();
  }

  const user = session?.user;
  const role = user?.role as string | undefined;
  const todayStr = new Date().toISOString().split("T")[0];

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
          customerPhone,
          address,
          preferredDate,
          problemDescription,
        }),
      });

      toast.success("Repair request submitted successfully!");
      setRequestSuccess(true);
      setModalOpen(false);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to submit repair request";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Service Banner & Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="relative w-full h-72 sm:h-96 bg-slate-100">
              <Image
                src={service.image}
                alt={service.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover"
              />
            </div>

            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-600 text-white">
                  {service.category}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                  {service.serviceMode}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {service.title}
              </h1>

              <div className="mt-4 flex flex-wrap gap-6 text-sm text-slate-600 border-y border-slate-100 py-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span>
                    Area: <strong>{service.serviceArea}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>
                    Est. Duration: <strong>{service.estimatedDuration}</strong>
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <h2 className="text-lg font-bold text-slate-900 mb-2">
                  Service Description
                </h2>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                  {service.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Pricing, Action Button & Technician Summary */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <span className="text-sm text-slate-500">
              Starting Service Price
            </span>
            <div className="text-4xl font-extrabold text-slate-900 mt-1">
              ${service.basePrice}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Final invoice confirmed upon repair completion. Pay via Stripe
              after service.
            </p>

            {/* Role-Restricted Action Area */}
            <div className="mt-6">
              {role === "technician" || role === "admin" ? (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium text-center">
                  Only customers can request a repair.
                </div>
              ) : (
                <button
                  onClick={handleRequestButtonClick}
                  className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition flex items-center justify-center gap-2"
                >
                  <Wrench className="w-4 h-4" />
                  Request Repair
                </button>
              )}

              {requestSuccess && (
                <div className="mt-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    Request sent!
                  </span>
                  <Link
                    href="/dashboard/customer/bookings"
                    className="font-bold underline"
                  >
                    View My Bookings →
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Technician Summary Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
              Service Technician
            </h3>
            <div className="flex items-center gap-3.5">
              <Image
                src={
                  technician?.image ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    service.technicianName,
                  )}&background=2563eb&color=fff&format=png`
                }
                alt={service.technicianName}
                width={56}
                height={56}
                className="w-14 h-14 rounded-full object-cover border border-slate-200"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-slate-900">
                    {service.technicianName}
                  </h4>
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-xs text-slate-500">
                  {technician?.area || service.serviceArea}
                </p>
              </div>
            </div>
            {technician?.bio && (
              <p className="mt-4 text-sm text-slate-600 leading-relaxed">
                {technician.bio}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Customer Repair Request Modal */}
      {modalOpen && user && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-slate-900">
                Request Repair
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={user.name || ""}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">
                    Your Email
                  </label>
                  <input
                    type="email"
                    readOnly
                    value={user.email || ""}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="e.g. +880 1712-345678"
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Service / Pickup Address *
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House, Road, Area..."
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Preferred Date *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    min={todayStr}
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <Calendar className="w-4 h-4 text-slate-400 pointer-events-none absolute right-3 top-2.5 hidden" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Problem Description * (min 20 characters)
                </label>
                <textarea
                  rows={4}
                  required
                  minLength={20}
                  value={problemDescription}
                  onChange={(e) => setProblemDescription(e.target.value)}
                  placeholder="Describe the exact issue with your device or appliance..."
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <span className="text-xs text-slate-400">
                  {problemDescription.trim().length} / 20 characters minimum
                </span>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-semibold transition"
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
