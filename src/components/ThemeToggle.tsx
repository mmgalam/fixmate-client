"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

const emptySubscribe = () => () => {};

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  if (!mounted) {
    return (
      <div className="h-9 w-9 rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800" />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-slate-200/80 bg-slate-100/90 text-slate-700 transition-all duration-200 hover:scale-105 hover:bg-indigo-50 active:scale-95 dark:border-slate-700/80 dark:bg-slate-800/90 dark:text-amber-400 dark:hover:bg-indigo-950/70"
    >
      {isDark ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4 text-indigo-600" />
      )}
    </button>
  );
}