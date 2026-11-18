import { Wrench } from "lucide-react";

export default function GlobalLoading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
      <div className="w-12 h-12 rounded-2xl bg-blue-600/10 text-blue-600 flex items-center justify-center animate-bounce">
        <Wrench className="w-6 h-6" />
      </div>
      <p className="text-sm font-medium text-slate-600">Loading FixMate...</p>
    </div>
  );
}
