import Link from "next/link";
import { Wrench, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-slate-50">
      <div className="max-w-md text-center">
        <div className="w-20 h-20 rounded-3xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-6 rotate-12">
          <Wrench className="w-10 h-10" />
        </div>
        <h1 className="text-6xl font-extrabold text-slate-900">404</h1>
        <h2 className="text-xl font-bold text-slate-800 mt-2">
          Oops! Looks like this page needs a repair.
        </h2>
        <p className="text-sm text-slate-500 mt-2">
          The page or service you are looking for does not exist or is currently
          unavailable.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
        >
          <Home className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
