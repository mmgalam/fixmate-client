import Link from "next/link";
import { MapPin, User, Wrench } from "lucide-react";
import Image from "next/image";

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
    <div className="h-full flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition">
      <div className="relative h-48 w-full bg-slate-100 shrink-0">
        <Image
          src={service.image}
          alt={service.title}
          className="w-full h-full object-cover"
        />
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-600 text-white">
          {service.category}
        </span>
        <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-medium bg-white/95 text-slate-800 shadow-xs">
          {service.serviceMode}
        </span>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 line-clamp-1">
            {service.title}
          </h3>

          <div className="mt-2.5 space-y-1.5 text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{service.technicianName}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{service.serviceArea}</span>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 block">Starting at</span>
            <span className="text-lg font-extrabold text-slate-900">
              ${service.basePrice}
            </span>
          </div>

          <Link
            href={`/services/${service._id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition"
          >
            <Wrench className="w-3.5 h-3.5" />
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
