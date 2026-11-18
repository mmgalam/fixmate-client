"use client";

import { AlertTriangle } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-900">
          Something went wrong
        </h2>
        <p className="text-sm text-slate-600 mt-2">
          {error.message ||
            "An unexpected error occurred while loading this page."}
        </p>
        <button
          onClick={reset}
          className="mt-6 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
