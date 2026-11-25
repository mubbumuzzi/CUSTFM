import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { Clock, ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react";
import { SERVICES_DATA } from "@/data/servicesData";

export const metadata: Metadata = {
  title: "Doorstep Repair Services Overview — Manikonda, Hyderabad",
  description:
    "Explore our complete range of smartphone repair services in Manikonda, Shaikpet & Gachibowli. Screen replacement, battery fixes, charging ports, software flashing, and water damage recovery.",
  alternates: {
    canonical: "https://famousmobiles.com/services",
  },
};

export default function ServicesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-14 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-[#F97316] bg-[#FFF7ED] px-3 py-1 rounded-full border border-[#FFEDD5]">
          Certified Smartphone Care
        </span>
        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#121212]">
          All Mobile Repair Services
        </h1>
        <p className="text-xs sm:text-sm text-[#767676]">
          Fast doorstep repairs within 6 km of our Shaikpet / Manikonda hub. Select any service below to explore symptoms, repair process, and warranty terms.
        </p>
      </div>

      {/* Services List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SERVICES_DATA.map((service) => (
          <div
            key={service.slug}
            className="bg-white rounded-2xl border border-[#EBEBEB] p-6 flex flex-col justify-between shadow-card hover:shadow-card-hover transition group"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-3xl p-2 rounded-[12px] bg-[#F7F7F8] border border-[#EBEBEB]">
                  {service.icon}
                </span>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-[6px]">
                  {service.tag}
                </span>
              </div>

              <div>
                <h2 className="text-lg font-bold text-[#121212] group-hover:text-[#F97316] transition">
                  {service.title}
                </h2>
                <div className="flex items-center gap-3 text-xs text-[#767676] mt-1 font-medium">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#767676]" />
                    <span>{service.turnaround}</span>
                  </span>
                  <span>•</span>
                  <span className="text-emerald-700 font-semibold">{service.warranty}</span>
                </div>
              </div>

              <p className="text-xs text-[#767676] leading-relaxed">
                {service.shortDesc}
              </p>

              {/* Common Symptoms Checklist */}
              <div className="bg-[#F7F7F8] rounded-[12px] p-3 border border-[#EBEBEB] space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#767676] block">
                  Common Symptoms
                </span>
                <ul className="space-y-1 text-xs text-[#555555]">
                  {service.symptoms.slice(0, 3).map((s, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#F97316] shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-5 mt-4 border-t border-[#EBEBEB] flex items-center justify-between">
              <Link
                href={`/services/${service.slug}`}
                className="text-xs font-semibold text-[#767676] hover:text-[#121212] transition underline"
              >
                Learn More
              </Link>

              <Link
                href={`/book-repair?category=${encodeURIComponent(service.title)}`}
                className="bg-[#121212] hover:bg-[#F97316] text-white text-xs font-bold px-4 py-2 rounded-[10px] shadow-xs transition active:scale-95 flex items-center gap-1"
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
