import Link from "next/link";
import { Wrench, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="bg-spatial-grid flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-slate-200/90 bg-white p-8 text-center shadow-3d-card sm:p-10 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto mb-6 flex h-20 w-20 rotate-12 items-center justify-center rounded-3xl bg-indigo-50 text-indigo-600 shadow-inner dark:bg-indigo-950/80 dark:text-cyan-400">
          <Wrench className="h-10 w-10" />
        </div>
        <h1
          style={{ fontFamily: "var(--font-display)" }}
          className="bg-linear-to-r from-indigo-600 to-cyan-500 bg-clip-text text-6xl font-black text-transparent dark:from-indigo-400 dark:to-cyan-300"
        >
          404
        </h1>
        <h2
          style={{ fontFamily: "var(--font-display)" }}
          className="mt-3 text-xl font-extrabold text-slate-900 dark:text-white"
        >
          Oops! Looks like this page needs a repair.
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          The page or service you are looking for does not exist or is currently
          unavailable.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-indigo-600 to-cyan-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/25 transition hover:-translate-y-0.5 hover:from-indigo-700 hover:to-cyan-700"
        >
          <Home className="h-4 w-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}