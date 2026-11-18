"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUp, useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import { Wrench, User, Eye, EyeOff } from "lucide-react";

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

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-slate-900">
            Create an Account
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Join FixMate to book repairs or offer your technician skills
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Selection Cards */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              I want to join as a:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("customer")}
                className={`flex flex-col items-center p-3 rounded-xl border-2 transition ${
                  role === "customer"
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-slate-200 hover:border-slate-300 text-slate-600"
                }`}
              >
                <User className="w-5 h-5 mb-1" />
                <span className="text-sm font-semibold">Customer</span>
                <span className="text-xs opacity-75">Book repairs</span>
              </button>

              <button
                type="button"
                onClick={() => setRole("technician")}
                className={`flex flex-col items-center p-3 rounded-xl border-2 transition ${
                  role === "technician"
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-slate-200 hover:border-slate-300 text-slate-600"
                }`}
              >
                <Wrench className="w-5 h-5 mb-1" />
                <span className="text-sm font-semibold">Technician</span>
                <span className="text-xs opacity-75">Offer services</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Tariqul Islam"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Inline Password Validation Indicators */}
            {password.length > 0 && (
              <ul className="mt-2 space-y-1 text-xs">
                <li
                  className={hasMinLength ? "text-emerald-600" : "text-red-500"}
                >
                  {hasMinLength ? "✓" : "✗"} At least 6 characters
                </li>
                <li
                  className={hasUppercase ? "text-emerald-600" : "text-red-500"}
                >
                  {hasUppercase ? "✓" : "✗"} At least one uppercase letter
                </li>
                <li
                  className={hasLowercase ? "text-emerald-600" : "text-red-500"}
                >
                  {hasLowercase ? "✓" : "✗"} At least one lowercase letter
                </li>
              </ul>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting || (password.length > 0 && !isPasswordValid)}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold rounded-lg transition"
          >
            {submitting ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-600 mt-6">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="text-blue-600 font-semibold hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
