import Link from "next/link";
import Image from "next/image";
import { MapPin, User, ArrowUpRight, Clock, BadgeCheck } from "lucide-react";
import type { Service } from "@/types";

export default function ServiceCard({ service }: { service: Service }) {
  return (
    <div className="group h-full flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-3d-card hover:shadow-3d-hover hover:-translate-y-1 hover:border-indigo-300/80 dark:hover:border-indigo-500/60 transition-all duration-300">
      {/* Image header */}
      <div className="relative h-48 w-full bg-slate-900 shrink-0 overflow-hidden">
        <Image
          src={service.image}
          alt={service.title}
          fill
          unoptimized
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-linear-to-t from-slate-950/75 via-slate-950/15 to-transparent" />

        <span className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-600/95 text-white shadow-lg">
          {service.category}
        </span>

        <span className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/95 dark:bg-slate-950/90 text-slate-900 dark:text-slate-100 shadow-md">
          {service.serviceMode}
        </span>

        {service.estimatedDuration && (
          <span className="absolute bottom-3 left-3 z-10 inline-flex items-center gap-1.5 text-xs font-medium text-white bg-slate-950/70 px-2.5 py-1 rounded-lg border border-white/10">
            <Clock className="w-3 h-3 text-cyan-400" />
            {service.estimatedDuration}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3
            title={service.title}
            style={{ fontFamily: "var(--font-display)" }}
            className="text-lg font-extrabold text-slate-900 dark:text-white line-clamp-2 min-h-14 group-hover:text-indigo-600 dark:group-hover:text-cyan-400 transition-colors"
          >
            {service.title}
          </h3>

          <div className="mt-3 space-y-1.5 text-sm text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-indigo-500 dark:text-cyan-400 shrink-0" />
              <span className="truncate font-semibold text-slate-700 dark:text-slate-300">
                {service.technicianName}
              </span>
              <BadgeCheck className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="truncate">{service.serviceArea}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-4 border-t border-slate-200/70 dark:border-slate-800 flex items-center justify-between gap-2">
          <div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">
              Starting from
            </span>
            <span className="text-xl font-black text-slate-950 dark:text-white">
              ${service.basePrice}
            </span>
          </div>

          <Link
            href={`/services/${service._id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-950 dark:bg-indigo-600 group-hover:bg-indigo-600 text-white text-sm font-bold shadow-md transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
          >
            View Details
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
