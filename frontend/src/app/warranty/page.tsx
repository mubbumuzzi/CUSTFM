import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { ShieldCheck, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Warranty Policy — Famous Mobiles",
  description: "Famous Mobiles doorstep repair warranty terms. Up to 6 months coverage on original screens and up to 8 months on batteries in Manikonda, Hyderabad.",
  alternates: {
    canonical: "https://famousmobiles.com/warranty",
  },
};

export default function WarrantyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-14 space-y-8">
      <div className="space-y-1.5 text-center sm:text-left">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Store-Backed Guarantee
        </span>
        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#121212]">
          Repair Warranty Policy
        </h1>
        <p className="text-xs sm:text-sm text-[#767676]">
          Every eligible repair performed by Famous Mobiles carries verified store-backed warranty protection.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6 sm:p-8 space-y-6 shadow-card text-xs sm:text-sm text-[#555555] leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-base font-bold text-[#121212]">1. Coverage Periods by Service</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
            <div className="bg-[#F8F9FA] p-4 rounded-xl border border-[#EBEBEB]">
              <span className="font-bold text-[#121212] block">📱 Screen & OLED Panels</span>
              <span className="text-xs text-emerald-700 font-semibold">Up to 6 Months Warranty</span>
              <p className="text-[11px] text-[#767676] mt-1">Covers touch digitizer failure, blank display, and spontaneous internal lines without physical impact.</p>
            </div>
            <div className="bg-[#F8F9FA] p-4 rounded-xl border border-[#EBEBEB]">
              <span className="font-bold text-[#121212] block">🔋 Battery Replacements</span>
              <span className="text-xs text-emerald-700 font-semibold">Up to 8 Months Warranty</span>
              <p className="text-[11px] text-[#767676] mt-1">Covers abnormal fast drain, sudden percentage drop, or battery failure to retain charge.</p>
            </div>
            <div className="bg-[#F8F9FA] p-4 rounded-xl border border-[#EBEBEB]">
              <span className="font-bold text-[#121212] block">⚡ Charging Ports & Flexes</span>
              <span className="text-xs text-emerald-700 font-semibold">3 Months Warranty</span>
              <p className="text-[11px] text-[#767676] mt-1">Covers pin conductivity failure, loose socket, and slow charging faults.</p>
            </div>
            <div className="bg-[#F8F9FA] p-4 rounded-xl border border-[#EBEBEB]">
              <span className="font-bold text-[#121212] block">🔧 Mic, Speaker & Camera</span>
              <span className="text-xs text-emerald-700 font-semibold">Up to 3 Months Warranty</span>
              <p className="text-[11px] text-[#767676] mt-1">Covers audio distortion, sensor failure, and hardware component defects.</p>
            </div>
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#121212]">2. Exclusions from Warranty</h2>
          <div className="bg-[#FFFBEB] p-4 rounded-xl border border-[#FDE68A] space-y-1.5 text-xs text-[#92400E]">
            <p className="font-bold">The following scenarios void warranty coverage:</p>
            <ul className="list-disc pl-5 space-y-1 text-[#78350F]">
              <li>Physical accidental drops resulting in cracked glass, chipped corners, or internal panel crush.</li>
              <li>Liquid ingress, swimming pool drops, rain exposure, or high-humidity moisture.</li>
              <li>Subsequent disassembly or tampering by an unauthorized third-party shop.</li>
            </ul>
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#121212]">3. How to Claim Doorstep Warranty</h2>
          <p>
            Simply WhatsApp or call our Manikonda shop desk at <strong className="text-[#121212]">+91 90637 86751</strong> with your Booking ID (<code className="bg-[#F8F9FA] px-1 py-0.5 rounded border border-[#EBEBEB]">FMO-2026-XXXX</code>). Our technician will be dispatched to your doorstep to inspect and replace the covered part free of charge.
          </p>
        </section>

        <div className="pt-2">
          <Link
            href="/book-repair"
            className="inline-flex items-center gap-2 bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-[10px] shadow-xs transition"
          >
            <span>Book Covered Repair (First Visit Free)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
