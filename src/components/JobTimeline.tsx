'use client';

import {
  Check,
  Send,
  UserCheck,
  Wrench,
  CheckCircle2,
  CreditCard,
  XCircle,
} from 'lucide-react';
import type { Booking } from '@/types';

const STEPS = [
  { key: 'requested', label: 'Requested', icon: Send },
  { key: 'accepted', label: 'Accepted', icon: UserCheck },
  { key: 'in-progress', label: 'In Progress', icon: Wrench },
  { key: 'completed', label: 'Completed', icon: CheckCircle2 },
  { key: 'paid', label: 'Paid', icon: CreditCard },
];

export default function JobTimeline({ booking }: { booking: Booking }) {
  if (booking.status === 'rejected' || booking.status === 'cancelled') {
    return (
      <div className="rounded-xl bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/60 px-4 py-3 text-xs flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-2 font-bold text-rose-600 dark:text-rose-400 capitalize leading-none">
          <XCircle className="w-4 h-4 shrink-0" />
          LIVE REPAIR TELEMETRY — Request {booking.status}
        </span>
        <span
          style={{ fontFamily: 'var(--font-mono)' }}
          className="text-[10px] font-extrabold uppercase text-rose-500 shrink-0 leading-none"
        >
          CLOSED
        </span>
      </div>
    );
  }

  const currentStage =
    booking.paymentStatus === 'paid' ? 'paid' : booking.status;
  const activeIndex = STEPS.findIndex((s) => s.key === currentStage);
  const isAllFinished = currentStage === 'paid';
  const progressPercent = isAllFinished
    ? 100
    : Math.max(20, (activeIndex + 1) * 20);

  return (
    <div className="rounded-xl bg-slate-50/90 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 px-4 py-3">
      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-200/70 dark:border-slate-800/80">
        <div className="inline-flex items-center gap-2">
          <span className="relative flex h-2 w-2 shrink-0">
            {!isAllFinished && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-500 opacity-75" />
            )}
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                isAllFinished ? 'bg-emerald-500' : 'bg-indigo-600'
              }`}
            />
          </span>
          <span
            style={{ fontFamily: 'var(--font-mono)' }}
            className="text-[10px] font-extrabold uppercase tracking-widest text-slate-600 dark:text-slate-300 leading-none"
          >
            LIVE REPAIR TELEMETRY
          </span>
        </div>

        <span
          style={{ fontFamily: 'var(--font-mono)' }}
          className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold tracking-wider leading-none ${
            isAllFinished
              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
              : 'bg-indigo-600/10 text-indigo-600 dark:text-cyan-400'
          }`}
        >
          {progressPercent}% DONE
        </span>
      </div>

      {/* Vertically Centered 1-Line Stepper with Equal Connector Line Gaps */}
      <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-y-2.5">
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isCompleted =
            idx < activeIndex || (idx === activeIndex && isAllFinished);
          const isCurrent = idx === activeIndex && !isAllFinished;

          const historyMatch = booking.statusHistory?.find(
            (h) => h.status === step.key
          );

          const shortTime = historyMatch
            ? new Date(historyMatch.changedAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })
            : null;

          return (
            <div
              key={step.key}
              className="flex items-center md:flex-1 md:last:flex-none"
            >
              {/* Fixed-Height Step Item so Icon & Text Stay Strictly Centered */}
              <div className="inline-flex items-center gap-2 h-7 shrink-0">
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                    isCompleted
                      ? 'bg-emerald-600 text-white'
                      : isCurrent
                      ? 'bg-indigo-600 text-white ring-3 ring-indigo-500/20'
                      : 'bg-white dark:bg-slate-900 text-slate-400 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  ) : (
                    <Icon className="w-3 h-3" />
                  )}
                </div>

                <div className="inline-flex items-center gap-1.5 leading-none">
                  <span
                    className={`text-xs leading-none ${
                      isCurrent
                        ? 'font-extrabold text-indigo-600 dark:text-cyan-400'
                        : isCompleted
                        ? 'font-bold text-slate-800 dark:text-slate-200'
                        : 'font-medium text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {step.label}
                  </span>
                  {shortTime && (
                    <span
                      style={{ fontFamily: 'var(--font-mono)' }}
                      className="text-[10px] text-slate-400 dark:text-slate-500 leading-none"
                    >
                      ({shortTime})
                    </span>
                  )}
                </div>
              </div>

              {/* Uniformly Spaced & Vertically Centered Horizontal Connector Line */}
              {idx < STEPS.length - 1 && (
                <div className="hidden md:block flex-1 h-0.5 mx-3 self-center bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      idx < activeIndex
                        ? 'w-full bg-linear-to-r from-emerald-500 to-indigo-500'
                        : 'w-0'
                    }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}