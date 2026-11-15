import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { ShieldCheck, MapPin, Clock, Phone, Award, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us — Famous Mobiles Manikonda, Hyderabad",
  description: "Learn about Famous Mobiles, Hyderabad's premier doorstep mobile repair center located in Manikonda. Over 10,000 devices repaired with genuine parts and 4.9★ rating.",
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-14 space-y-8">
      {/* Hero */}
      <div className="text-center space-y-3">
        <span className="text-xs font-black uppercase tracking-wider text-accent-600 bg-accent-50 px-3 py-1 rounded-full border border-accent-200">
          Our Story & Commitment
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-navy-950">
          About Famous Mobiles
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
          Founded with a simple mission: To eliminate repair shop hassles and deliver transparent, certified smartphone repair right to your doorstep in Manikonda.
        </p>
      </div>

      {/* Trust Stats Card */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-2xl sm:text-3xl font-black text-navy-950">10,000+</div>
          <div className="text-[11px] sm:text-xs text-slate-500 font-bold mt-1">Phones Repaired</div>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-2xl sm:text-3xl font-black text-emerald-600">4.9 ★</div>
          <div className="text-[11px] sm:text-xs text-slate-500 font-bold mt-1">1k+ Verified Reviews</div>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-2xl sm:text-3xl font-black text-accent-600">₹0</div>
          <div className="text-[11px] sm:text-xs text-slate-500 font-bold mt-1">First Home Visit Free</div>
        </div>
      </div>

      {/* Physical Store Details */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-sm">
        <h2 className="text-xl font-black text-navy-950">
          Our Physical Workshop in Manikonda
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Unlike online aggregators who outsource your expensive phone to unknown third parties, Famous Mobiles operates an authentic physical store on Main Road near Marrichettu Junction. Every technician who arrives at your doorstep is an in-house employee backed by our workshop equipment.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
            <div className="flex items-center gap-1.5 font-black text-xs text-navy-900">
              <MapPin className="w-4 h-4 text-accent-500" />
              <span>Workshop Address</span>
            </div>
            <p className="text-xs text-slate-600">
              Main Road, Near Marrichettu Junction, Manikonda, Hyderabad, Telangana 500089
            </p>
            <a
              href="https://share.google/U0L5BeQxKW1dBHUbJ"
              target="_blank"
              rel="noreferrer"
              className="text-[11px] font-bold text-accent-600 hover:underline inline-flex items-center gap-1 pt-1"
            >
              <span>Get Directions on Google Maps →</span>
            </a>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
            <div className="flex items-center gap-1.5 font-black text-xs text-navy-900">
              <Clock className="w-4 h-4 text-accent-500" />
              <span>Daily Working Hours</span>
            </div>
            <p className="text-xs text-slate-600">
              Monday – Sunday: 9:30 AM – 3:30 AM (365 Days)
            </p>
          </div>
        </div>
      </div>

      {/* Guarantees */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
          <Award className="w-6 h-6 text-accent-500" />
          <h3 className="text-sm font-black text-navy-950">Genuine OEM Quality</h3>
          <p className="text-xs text-slate-600">We source certified display panels, ICs, and batteries directly from verified component manufacturers.</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
          <ShieldCheck className="w-6 h-6 text-emerald-600" />
          <h3 className="text-sm font-black text-navy-950">6-Month Warranty</h3>
          <p className="text-xs text-slate-600">All major display and battery replacements carry up to 6 months replacement warranty backed by our store.</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
          <Users className="w-6 h-6 text-blue-600" />
          <h3 className="text-sm font-black text-navy-950">Zero Password Policy</h3>
          <p className="text-xs text-slate-600">Repairs are performed right in front of you. We never ask for your screen lock passcode or personal data.</p>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center pt-4">
        <Link
          href="/book-repair"
          className="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white font-black text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-md transition active:scale-95"
        >
          <span>Book Free Home Visit (₹0) →</span>
        </Link>
      </div>
    </div>
  );
}
