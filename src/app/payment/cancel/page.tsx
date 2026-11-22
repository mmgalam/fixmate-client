import Link from "next/link";
import Logo from "@/components/Logo";
import { AlertCircle, ArrowLeft } from "lucide-react";

export default function PaymentCancelPage() {
  return (
    <div className="bg-spatial-grid flex min-h-[75vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-slate-200/90 bg-white p-6 text-center shadow-3d-card sm:p-8 dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-5 flex justify-center">
          <Logo />
        </div>

        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-950/80 dark:text-amber-400">
          <AlertCircle className="h-9 w-9" />
        </div>

        <h1
          style={{ fontFamily: "var(--font-display)" }}
          className="text-2xl font-black text-slate-950 dark:text-white"
        >
          Payment Cancelled
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          Your payment was not completed and no charges were made. You can try
          paying again anytime from your bookings page.
        </p>

        <Link
          href="/dashboard/customer/bookings"
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-indigo-600 to-cyan-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/25 transition hover:from-indigo-700 hover:to-cyan-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Try Again
        </Link>
      </div>
    </div>
  );
}