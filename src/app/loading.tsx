import { Wrench } from "lucide-react";

export default function GlobalLoading() {
  return (
    <div className="flex min-h-[75vh] flex-col items-center justify-center gap-3 px-4">
      <div className="flex h-12 w-12 animate-bounce items-center justify-center rounded-2xl bg-indigo-600/10 text-indigo-600 dark:bg-cyan-500/15 dark:text-cyan-400">
        <Wrench className="h-6 w-6" />
      </div>
      <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
        Loading FixMate...
      </p>
    </div>
  );
}
