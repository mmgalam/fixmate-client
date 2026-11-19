import Link from "next/link";
import { MapPin, User, ArrowRight, Clock } from "lucide-react";

export interface ServiceItem {
  _id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  basePrice: number;
  estimatedDuration: string;
  serviceMode: "Home Visit" | "Shop Drop-off";
  serviceArea: string;
  technicianName: string;
  technicianEmail: string;
}

export default function ServiceCard({ service }: { service: ServiceItem }) {
  return (
    <div className="card-base card-hover group flex h-full flex-col overflow-hidden">
      <div className="relative h-48 w-full shrink-0 overflow-hidden bg-slate-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={service.image}
          alt={service.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white shadow">
          {service.category}
        </span>
        <span className="absolute right-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-slate-800 shadow">
          {service.serviceMode}
        </span>
      </div>

      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <h3 className="line-clamp-1 text-lg font-bold text-slate-900">
            {service.title}
          </h3>

          <div className="mt-3 space-y-2 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <User className="h-3.5 w-3.5 shrink-0 text-primary" />
              <span className="truncate">{service.technicianName}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
              <span className="truncate">{service.serviceArea}</span>
            </div>
            {service.estimatedDuration && (
              <div className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 shrink-0 text-primary" />
                <span className="truncate">{service.estimatedDuration}</span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
          <div>
            <span className="block text-xs text-slate-500">Starting at</span>
            <span className="text-xl font-extrabold text-slate-900">
              ${service.basePrice}
            </span>
          </div>
          <Link
            href={`/services/${service._id}`}
            className="btn-primary !px-4 !py-2 text-sm"
          >
            View Details
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}