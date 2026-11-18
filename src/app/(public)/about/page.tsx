import Link from "next/link";
import { ShieldCheck, Wrench, CreditCard, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-extrabold text-slate-900">
          About FixMate
        </h1>
        <p className="mt-4 text-lg text-slate-600 leading-relaxed">
          FixMate connects everyday device owners with verified local repair
          technicians—bringing transparency, live status tracking, and
          post-repair Stripe payments to every job.
        </p>
      </div>

      <div className="mt-14 grid md:grid-cols-2 gap-6">
        {[
          {
            title: "Verified Service Listings",
            desc: "Technicians publish detailed repair offerings with clear starting prices and service modes. Every listing goes through admin moderation before going live.",
            icon: ShieldCheck,
          },
          {
            title: "Clear Step-by-Step Pipeline",
            desc: "From Requested to Accepted, In Progress, and Completed, customers never have to wonder what is happening with their device.",
            icon: Wrench,
          },
          {
            title: "Pay-After-Completion Protection",
            desc: "Customers only pay once the technician finishes the repair and confirms the final amount, processed securely through Stripe Checkout.",
            icon: CreditCard,
          },
          {
            title: "Built for Local Technicians",
            desc: "Skilled technicians get a dedicated dashboard to showcase their expertise, toggle availability, and manage incoming requests.",
            icon: Users,
          },
        ].map((card) => (
          <div
            key={card.title}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs"
          >
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <card.icon className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">{card.title}</h2>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              {card.desc}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link
          href="/services"
          className="inline-block px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
        >
          Explore Available Services
        </Link>
      </div>
    </div>
  );
}
