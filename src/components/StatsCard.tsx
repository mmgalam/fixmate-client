'use client';

import Tilt3DCard from '@/components/Tilt3DCard';
import type { LucideIcon } from 'lucide-react';

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
  colorClass = 'bg-linear-to-br from-indigo-600 to-cyan-500 text-white shadow-lg shadow-indigo-600/25',
}: StatsCardProps) {
  return (
    <Tilt3DCard>
      <div className="group h-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-3d-card hover:shadow-3d-hover hover:border-indigo-300/80 dark:hover:border-indigo-500/50 transition-all duration-300 flex items-center justify-between relative overflow-hidden">
        {/* Subtle Corner Ambient Glow */}
        <div
          aria-hidden="true"
          className="absolute -right-8 -bottom-8 w-28 h-28 rounded-full bg-indigo-500/5 dark:bg-cyan-400/5 group-hover:scale-150 transition-transform duration-500 pointer-events-none"
        />

        <div className="relative z-10">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
            {title}
          </p>
          <p
            style={{ fontFamily: 'var(--font-mono)' }}
            className="text-3xl font-black text-slate-950 dark:text-white mt-1.5"
          >
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>

        <div
          className={`relative z-10 w-13 h-13 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 ${colorClass}`}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </Tilt3DCard>
  );
}