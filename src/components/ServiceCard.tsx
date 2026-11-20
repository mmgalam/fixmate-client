import Link from 'next/link';
import Image from 'next/image';
import Tilt3DCard from '@/components/Tilt3DCard';
import { MapPin, User, ArrowUpRight, Clock, BadgeCheck } from 'lucide-react';
import type { Service } from '@/types';

export default function ServiceCard({ service }: { service: Service }) {
  return (
    <Tilt3DCard>
      <div className="group h-full flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-3d-card hover:shadow-3d-hover hover:border-indigo-300/80 dark:hover:border-indigo-500/60 transition-all duration-300">
        {/* Image Header */}
        <div className="relative h-48 w-full bg-slate-900 shrink-0 overflow-hidden">
          <Image
            src={service.image}
            alt={service.title}
            fill
            unoptimized
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-linear-to-t from-slate-950/75 via-slate-950/15 to-transparent" />

          <span
            style={{ fontFamily: 'var(--font-mono)' }}
            className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider bg-indigo-600/95 backdrop-blur-md text-white shadow-lg shadow-indigo-950/30"
          >
            {service.category}
          </span>

          <span className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/95 dark:bg-slate-950/90 backdrop-blur-md text-slate-900 dark:text-slate-100 shadow-md">
            {service.serviceMode}
          </span>

          {service.estimatedDuration && (
            <span
              style={{ fontFamily: 'var(--font-mono)' }}
              className="absolute bottom-3 left-3 z-10 inline-flex items-center gap-1.5 text-[11px] font-medium text-white bg-slate-950/70 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10"
            >
              <Clock className="w-3 h-3 text-cyan-400" />
              {service.estimatedDuration}
            </span>
          )}
        </div>

        {/* Equal-Height Content Body */}
        <div className="p-5 flex-1 flex flex-col justify-between bg-linear-to-b from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-900/95">
          <div>
            <h3
              style={{ fontFamily: 'var(--font-display)' }}
              className="text-lg font-extrabold text-slate-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-cyan-400 transition-colors"
            >
              {service.title}
            </h3>

            <div className="mt-3 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-500 dark:text-cyan-400 shrink-0" />
                <span className="truncate font-semibold text-slate-700 dark:text-slate-300">
                  {service.technicianName}
                </span>
                <BadgeCheck className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{service.serviceArea}</span>
              </div>
            </div>
          </div>

          {/* 3D Tactile Footer */}
          <div className="mt-5 pt-4 border-t border-slate-200/70 dark:border-slate-800 flex items-center justify-between gap-2">
            <div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">
                Starting From
              </span>
              <span
                style={{ fontFamily: 'var(--font-mono)' }}
                className="text-xl font-black text-slate-950 dark:text-white"
              >
                ${service.basePrice}
              </span>
            </div>

            <Link
              href={`/services/${service._id}`}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-950 dark:bg-indigo-600 group-hover:bg-linear-to-r group-hover:from-indigo-600 group-hover:to-cyan-600 text-white text-xs font-bold shadow-md shadow-slate-950/15 transition-all duration-300"
            >
              View Details
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </Tilt3DCard>
  );
}
