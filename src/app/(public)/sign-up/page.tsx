"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUp, useSession } from "@/lib/auth-client";
import Logo from "@/components/Logo";
import { toast } from "sonner";
import { Wrench, User, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"customer" | "technician">("customer");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Redirect already logged-in users to their dashboard
  useEffect(() => {
    if (!isPending && session?.user) {
      const userRole = session.user.role || "customer";
      router.replace(`/dashboard/${userRole}`);
    }
  }, [session, isPending, router]);

  // Password validation checks
  const hasMinLength = password.length >= 6;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const isPasswordValid = hasMinLength && hasUppercase && hasLowercase;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (!isPasswordValid) {
      toast.error("Please fix the password requirements below.");
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
        role, // Strictly 'customer' or 'technician'
      });

      if (error) {
        toast.error(error.message || "Registration failed.");
        return;
      }

      toast.success("Account created successfully!");
      router.push(`/dashboard/${role}`);
    } catch {
      toast.error("Something went wrong during sign up.");
    } finally {
      setSubmitting(false);
    }
  };

  if (isPending || session?.user) {
    return (
      <div className="bg-spatial-grid flex min-h-[82vh] items-center justify-center px-4 py-12">
        <div className="h-130 w-full max-w-md animate-pulse rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900" />
      </div>
    );
  }

  return (
    <div className="bg-spatial-grid flex min-h-[82vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-slate-200/90 bg-white p-6 shadow-3d-card sm:p-8 dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-6 flex flex-col items-center text-center">
          <Logo />
          <h1
            style={{ fontFamily: "var(--font-display)" }}
            className="mt-5 text-2xl font-black text-slate-950 dark:text-white"
          >
            Create an Account
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Join FixMate to book repairs or offer your technician skills
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Selection Cards (Only Customer or Technician) */}
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
              I want to join as a:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("customer")}
                className={`flex flex-col items-center rounded-2xl border-2 p-3.5 transition ${
                  role === "customer"
                    ? "border-indigo-600 bg-indigo-50/80 text-indigo-700 dark:border-cyan-400 dark:bg-indigo-950/70 dark:text-cyan-300"
                    : "border-slate-200 bg-slate-50/50 text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-400 dark:hover:border-slate-700"
                }`}
              >
                <User className="mb-1.5 h-5 w-5" />
                <span className="text-sm font-extrabold">Customer</span>
                <span className="text-xs opacity-80">Book repairs</span>
              </button>

              <button
                type="button"
                onClick={() => setRole("technician")}
                className={`flex flex-col items-center rounded-2xl border-2 p-3.5 transition ${
                  role === "technician"
                    ? "border-indigo-600 bg-indigo-50/80 text-indigo-700 dark:border-cyan-400 dark:bg-indigo-950/70 dark:text-cyan-300"
                    : "border-slate-200 bg-slate-50/50 text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-400 dark:hover:border-slate-700"
                }`}
              >
                <Wrench className="mb-1.5 h-5 w-5" />
                <span className="text-sm font-extrabold">Technician</span>
                <span className="text-xs opacity-80">Offer services</span>
              </button>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-bold text-slate-700 dark:text-slate-300">
              Full Name
            </label>
            <input
              type="text"
              required
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Tariqul Islam"
              className="w-full rounded-xl border border-slate-300 bg-slate-50/70 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 dark:border-slate-700 dark:bg-slate-950/70 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-bold text-slate-700 dark:text-slate-300">
              Email Address
            </label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-slate-300 bg-slate-50/70 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 dark:border-slate-700 dark:bg-slate-950/70 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-bold text-slate-700 dark:text-slate-300">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
                className="w-full rounded-xl border border-slate-300 bg-slate-50/70 py-2.5 pl-3.5 pr-10 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 dark:border-slate-700 dark:bg-slate-950/70 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20"
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700 dark:hover:text-slate-200"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            {/* Inline Password Validation Indicators */}
            {password.length > 0 && (
              <ul className="mt-2.5 space-y-1 text-xs font-medium">
                <li
                  className={
                    hasMinLength
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-rose-500 dark:text-rose-400"
                  }
                >
                  {hasMinLength ? "✓" : "✗"} At least 6 characters
                </li>
                <li
                  className={
                    hasUppercase
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-rose-500 dark:text-rose-400"
                  }
                >
                  {hasUppercase ? "✓" : "✗"} At least one uppercase letter
                </li>
                <li
                  className={
                    hasLowercase
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-rose-500 dark:text-rose-400"
                  }
                >
                  {hasLowercase ? "✓" : "✗"} At least one lowercase letter
                </li>
              </ul>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting || (password.length > 0 && !isPasswordValid)}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-indigo-600 to-cyan-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/25 transition hover:from-indigo-700 hover:to-cyan-700 disabled:opacity-60"
          >
            {submitting ? "Creating Account..." : "Sign Up"}
            {!submitting && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-bold text-indigo-600 hover:underline dark:text-cyan-400"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}