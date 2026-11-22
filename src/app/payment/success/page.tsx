"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { fetchWithAuth } from "@/lib/api";
import Logo from "@/components/Logo";
import { CheckCircle2, Loader2, XCircle, ArrowRight, Receipt } from "lucide-react";

interface PaymentDetails {
  serviceTitle: string;
  amount: number;
  transactionId: string;
  paidAt?: string;
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
      .then((data: unknown) => {
        if (!isMounted) return;
        const res = data as { payment?: PaymentDetails };
        if (res?.payment) {
          setPayment(res.payment);
        } else {
          setError("Payment details could not be retrieved.");
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : "Unable to verify payment.",
          );
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [sessionId]);

  if (!sessionId) {
    return (
      <div className="bg-spatial-grid flex min-h-[75vh] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-3xl border border-rose-200/80 bg-white p-8 text-center shadow-3d-card dark:border-rose-900/60 dark:bg-slate-900">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/70 dark:text-rose-400">
            <XCircle className="h-8 w-8" />
          </div>
          <h1
            style={{ fontFamily: "var(--font-display)" }}
            className="text-xl font-black text-slate-950 dark:text-white"
          >
            Verification Failed
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Missing payment session ID. Please return to your bookings to check
            payment status.
          </p>
          <Link
            href="/dashboard/customer/bookings"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-indigo-600 to-cyan-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/25 transition hover:from-indigo-700 hover:to-cyan-700"
          >
            Back to My Bookings
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-spatial-grid flex min-h-[75vh] flex-col items-center justify-center gap-3 px-4">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600 dark:text-cyan-400" />
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
          Verifying your Stripe payment...
        </p>
      </div>
    );
  }

  if (error || !payment) {
    return (
      <div className="bg-spatial-grid flex min-h-[75vh] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-3xl border border-rose-200/80 bg-white p-8 text-center shadow-3d-card dark:border-rose-900/60 dark:bg-slate-900">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/70 dark:text-rose-400">
            <XCircle className="h-8 w-8" />
          </div>
          <h1
            style={{ fontFamily: "var(--font-display)" }}
            className="text-xl font-black text-slate-950 dark:text-white"
          >
            Verification Failed
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            {error}
          </p>
          <Link
            href="/dashboard/customer/bookings"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-indigo-600 to-cyan-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/25 transition hover:from-indigo-700 hover:to-cyan-700"
          >
            Back to My Bookings
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-spatial-grid flex min-h-[75vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-slate-200/90 bg-white p-6 text-center shadow-3d-card sm:p-8 dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-5 flex justify-center">
          <Logo />
        </div>

        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 shadow-inner dark:bg-emerald-950/80 dark:text-emerald-400">
          <CheckCircle2 className="h-9 w-9" />
        </div>

        <h1
          style={{ fontFamily: "var(--font-display)" }}
          className="text-2xl font-black text-slate-950 dark:text-white"
        >
          Payment Successful!
        </h1>
        <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">
          Thank you for using FixMate. Your repair invoice has been settled.
        </p>

        <div className="mt-6 space-y-3 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 text-left text-sm dark:border-slate-800 dark:bg-slate-950/70">
          <div className="flex items-start justify-between gap-3">
            <span className="shrink-0 text-slate-500 dark:text-slate-400">
              Service:
            </span>
            <span className="text-right font-bold text-slate-900 dark:text-white">
              {payment.serviceTitle}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-slate-500 dark:text-slate-400">
              Amount Paid:
            </span>
            <span
              style={{ fontFamily: "var(--font-mono)" }}
              className="font-black text-emerald-600 dark:text-emerald-400"
            >
              ${Number(payment.amount || 0).toFixed(2)} USD
            </span>
          </div>
          {payment.paidAt && (
            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-500 dark:text-slate-400">Date:</span>
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                {new Date(payment.paidAt).toLocaleString()}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between gap-3 border-t border-slate-200/70 pt-2.5 dark:border-slate-800">
            <span className="shrink-0 text-slate-500 dark:text-slate-400">
              Transaction ID:
            </span>
            <span className="truncate font-mono text-xs text-slate-700 dark:text-slate-300">
              {payment.transactionId}
            </span>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/dashboard/customer/bookings"
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-linear-to-r from-indigo-600 to-cyan-600 px-4 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-600/25 transition hover:from-indigo-700 hover:to-cyan-700 sm:text-sm"
          >
            My Bookings
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/dashboard/customer/payments"
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-3 text-xs font-bold text-slate-700 transition hover:bg-slate-50 sm:text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700/70"
          >
            <Receipt className="h-4 w-4" />
            Receipt History
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
        <div className="bg-spatial-grid flex min-h-[75vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600 dark:text-cyan-400" />
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}