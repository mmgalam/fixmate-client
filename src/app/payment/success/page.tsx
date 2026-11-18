"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { fetchWithAuth } from "@/lib/api";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";

interface PaymentDetails {
  serviceTitle: string;
  amount: number;
  transactionId: string;
  paidAt: string;
}

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [loading, setLoading] = useState(Boolean(sessionId));
  const [error, setError] = useState("");
  const [payment, setPayment] = useState<PaymentDetails | null>(null);

  useEffect(() => {
    if (!sessionId) return;

    let isMounted = true;

    fetchWithAuth(
      `/api/payments/verify?session_id=${encodeURIComponent(sessionId)}`,
    )
      .then((data) => {
        if (isMounted) setPayment(data.payment);
      })
      .catch((err) => {
        if (isMounted) setError(err.message || "Unable to verify payment.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [sessionId]);

  // Handle missing session_id directly during render (no synchronous setState in useEffect)
  if (!sessionId) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white border border-red-200 rounded-2xl p-8 text-center shadow-sm">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <h1 className="text-xl font-bold text-slate-900">
            Verification Failed
          </h1>
          <p className="text-sm text-slate-600 mt-2">
            Missing payment session ID.
          </p>
          <Link
            href="/dashboard/customer/bookings"
            className="inline-block mt-6 px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
          >
            Back to My Bookings
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-slate-600 font-medium">
          Verifying your Stripe payment...
        </p>
      </div>
    );
  }

  if (error || !payment) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white border border-red-200 rounded-2xl p-8 text-center shadow-sm">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <h1 className="text-xl font-bold text-slate-900">
            Verification Failed
          </h1>
          <p className="text-sm text-slate-600 mt-2">{error}</p>
          <Link
            href="/dashboard/customer/bookings"
            className="inline-block mt-6 px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
          >
            Back to My Bookings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">
          Payment Successful!
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Thank you for using FixMate. Your repair invoice has been settled.
        </p>

        <div className="mt-6 bg-slate-50 rounded-xl p-4 text-left space-y-2.5 text-sm border border-slate-200">
          <div className="flex justify-between">
            <span className="text-slate-500">Service:</span>
            <span className="font-semibold text-slate-900">
              {payment.serviceTitle}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Amount Paid:</span>
            <span className="font-bold text-emerald-600">
              ${payment.amount.toFixed(2)} USD
            </span>
          </div>
          <div className="flex justify-between gap-2">
            <span className="text-slate-500 shrink-0">Transaction ID:</span>
            <span className="font-mono text-xs text-slate-700 truncate">
              {payment.transactionId}
            </span>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Link
            href="/dashboard/customer/bookings"
            className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
          >
            Back to My Bookings
          </Link>
          <Link
            href="/dashboard/customer/payments"
            className="flex-1 py-2.5 px-4 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-lg transition"
          >
            Payment History
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
