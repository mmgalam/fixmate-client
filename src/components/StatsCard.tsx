import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  colorClass?: string;
}

export default function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  colorClass = "bg-blue-50 text-blue-600",
}: StatsCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="text-3xl font-extrabold text-slate-900 mt-1">{value}</p>
        {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
      </div>
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClass}`}
      >
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
}
