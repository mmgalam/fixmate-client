import Link from "next/link";
import { Wrench } from "lucide-react";

type Props = {
  /** "footer" always uses light text because the footer background is always dark */
  variant?: "default" | "footer";
};

export default function Logo({ variant = "default" }: Props) {
  const isFooter = variant === "footer";

  return (
    <Link
      href="/"
      aria-label="FixMate home"
      className="group inline-flex shrink-0 items-center gap-2.5"
    >
      <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 via-blue-500 to-cyan-400 text-white shadow-lg shadow-indigo-500/40 ring-1 ring-white/30 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-105">
        <Wrench className="h-5 w-5" strokeWidth={2.4} />
      </span>
      <span
        style={{ fontFamily: "var(--font-display)" }}
        className={`text-2xl font-black tracking-tight ${
          isFooter ? "text-white" : "text-slate-900 dark:text-white"
        }`}
      >
        Fix
        <span
          className={
            isFooter ? "text-cyan-300" : "text-indigo-600 dark:text-cyan-300"
          }
        >
          Mate
        </span>
      </span>
    </Link>
  );
}