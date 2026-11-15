import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { ShieldCheck, CheckCircle2, AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
  title: "Warranty Policy — Famous Mobiles",
  description: "Famous Mobiles doorstep repair warranty terms. Up to 6 months coverage on original screens and batteries in Manikonda, Hyderabad.",
};

export default function WarrantyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-14 space-y-8">
      <div className="space-y-2">
        <span className="text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Transparent Peace of Mind
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-navy-950">
          Warranty Policy
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Every eligible repair performed by Famous Mobiles carries a verified store warranty.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs text-xs sm:text-sm text-slate-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-black text-navy-950">1. Coverage Periods</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="font-black text-navy-900 block">📱 Display / Screen Panels</span>
              <span className="text-xs text-emerald-700 font-bold">Up to 6 Months Warranty</span>
              <p className="text-[11px] text-slate-500 mt-1">Covers touch failure, blank display, and spontaneous internal lines without physical impact.</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="font-black text-navy-900 block">🔋 Battery Replacements</span>
              <span className="text-xs text-emerald-700 font-bold">Up to 8 Months Warranty</span>
              <p className="text-[11px] text-slate-500 mt-1">Covers abnormal fast drain, sudden percentage drop, or battery failure to retain charge.</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="font-black text-navy-900 block">⚡ Charging Ports & Flexes</span>
              <span className="text-xs text-emerald-700 font-bold">3 Months Warranty</span>
              <p className="text-[11px] text-slate-500 mt-1">Covers pin conductivity failure, loose socket, and slow charging faults.</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="font-black text-navy-900 block">🔧 Mic, Speaker & Camera</span>
              <span className="text-xs text-emerald-700 font-bold">Up to 3 Months Warranty</span>
              <p className="text-[11px] text-slate-500 mt-1">Covers audio distortion, sensor failure, and hardware component defects.</p>
            </div>
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-black text-navy-950">2. Exclusions from Warranty</h2>
          <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 space-y-1.5 text-xs text-amber-950">
            <p className="font-bold">The following scenarios void warranty coverage:</p>
            <ul className="list-disc pl-5 space-y-1 text-slate-700">
              <li>Physical accidental drops resulting in cracked glass, chipped corners, or internal panel crush.</li>
              <li>Liquid ingress, swimming pool drops, rain exposure, or high-humidity moisture.</li>
              <li>Subsequent disassembly or tampering by an unauthorized third-party shop.</li>
            </ul>
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-black text-navy-950">3. How to Claim Doorstep Warranty</h2>
          <p>
            Simply WhatsApp or call our Manikonda shop at <strong>+91 90637 86751</strong> with your Booking ID (`FM-2026-XXXX`). Our technician will be dispatched to your doorstep to replace the covered part free of charge.
          </p>
        </section>
      </div>
    </div>
  );
}
