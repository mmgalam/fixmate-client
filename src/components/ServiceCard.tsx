import Link from "next/link";
import Image from "next/image";
import Tilt3DCard from "@/components/Tilt3DCard";
import { MapPin, User, ArrowUpRight, Clock, BadgeCheck } from "lucide-react";
import type { Service } from "@/types";

export default function ServiceCard({ service }: { service: Service }) {
  return (
    <Tilt3DCard>
      <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-3d-card transition-all duration-300 hover:border-indigo-300/80 hover:shadow-3d-hover dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-500/60">
        {/* Image Header */}
        <div className="relative h-48 w-full shrink-0 overflow-hidden bg-slate-900">
          <Image
            src={service.image}
            alt={service.title}
            fill
            unoptimized
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-linear-to-t from-slate-950/75 via-slate-950/15 to-transparent" />

          <span
            style={{ fontFamily: "var(--font-mono)" }}
            className="absolute left-3 top-3 z-10 rounded-lg bg-indigo-600/95 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-lg shadow-indigo-950/30 backdrop-blur-md"
          >
            {service.category}
          </span>

          <span className="absolute right-3 top-3 z-10 rounded-lg bg-white/95 px-2.5 py-1 text-xs font-semibold text-slate-900 shadow-md backdrop-blur-md dark:bg-slate-950/90 dark:text-slate-100">
            {service.serviceMode}
          </span>

          {service.estimatedDuration && (
            <span
              style={{ fontFamily: "var(--font-mono)" }}
              className="absolute bottom-3 left-3 z-10 inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-slate-950/70 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-md"
            >
              <Clock className="h-3 w-3 text-cyan-400" />
              {service.estimatedDuration}
            </span>
          )}
        </div>

        {/* Equal-Height Content Body */}
        <div className="flex flex-1 flex-col justify-between bg-linear-to-b from-white to-slate-50/50 p-5 dark:from-slate-900 dark:to-slate-900/95">
          <div>
            <h3
              style={{ fontFamily: "var(--font-display)" }}
              className="line-clamp-1 text-lg font-extrabold text-slate-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-cyan-400"
            >
              {service.title}
            </h3>

            <div className="mt-3 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 shrink-0 text-indigo-500 dark:text-cyan-400" />
                <span className="truncate font-semibold text-slate-700 dark:text-slate-300">
                  {service.technicianName}
                </span>
                <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-cyan-500" />
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                <span className="truncate">{service.serviceArea}</span>
              </div>
            </div>
          </div>

          {/* 3D Tactile Footer */}
          <div className="mt-5 flex items-center justify-between gap-2 border-t border-slate-200/70 pt-4 dark:border-slate-800">
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Starting From
              </span>
              <span
                style={{ fontFamily: "var(--font-mono)" }}
                className="text-xl font-black text-slate-950 dark:text-white"
              >
                ${service.basePrice}
              </span>
            </div>

            <Link
              href={`/services/${service._id}`}
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-slate-950/15 transition-all duration-300 hover:bg-indigo-600 group-hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-cyan-600 dark:group-hover:bg-cyan-600"
            >
              View Details
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </Tilt3DCard>
  );
}