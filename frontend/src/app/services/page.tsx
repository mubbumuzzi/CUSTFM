import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { Clock, ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react";
import { SERVICES_DATA } from "@/data/servicesData";

export const metadata: Metadata = {
  title: "Doorstep Repair Services Overview — Manikonda, Hyderabad",
  description:
    "Explore our complete range of smartphone repair services in Manikonda. Screen replacement, battery fixes, charging ports, software flashing, and water damage recovery.",
};

export default function ServicesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-14 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-black uppercase tracking-wider text-accent-600 bg-accent-50 px-3 py-1 rounded-full border border-accent-200">
          Professional Smartphone Care
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-navy-950">
          All Mobile Repair Services
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Fast doorstep repairs within 5 km of our Manikonda hub. Select any service below to explore symptoms, repair process, and warranty terms.
        </p>
      </div>

      {/* Services List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SERVICES_DATA.map((service) => (
          <div
            key={service.slug}
            className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs hover:shadow-xl transition group"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-4xl">{service.icon}</span>
                <span className={`text-[10px] font-extrabold text-white px-2.5 py-1 rounded-lg ${service.tagColor}`}>
                  {service.tag}
                </span>
              </div>

              <div>
                <h2 className="text-lg font-black text-navy-950 group-hover:text-accent-600 transition">
                  {service.title}
                </h2>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 font-semibold">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{service.turnaround}</span>
                  </span>
                  <span>•</span>
                  <span className="text-emerald-700">{service.warranty}</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {service.shortDesc}
              </p>

              {/* Common Symptoms */}
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                  Common Symptoms
                </span>
                <ul className="space-y-1 text-xs text-slate-700 font-medium">
                  {service.symptoms.slice(0, 3).map((s, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-accent-500 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
              <Link
                href={`/services/${service.slug}`}
                className="text-xs font-black text-navy-900 hover:text-accent-600 transition underline"
              >
                Learn More
              </Link>

              <Link
                href={`/book-repair?category=${encodeURIComponent(service.title)}`}
                className="bg-accent-500 hover:bg-accent-600 text-white text-xs font-black px-4 py-2 rounded-xl shadow-xs transition active:scale-95 flex items-center gap-1"
              >
                <span>Book Service</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
