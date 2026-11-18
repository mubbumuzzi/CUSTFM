import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { ShieldCheck, MapPin, Clock, Phone, Award, Users, Star } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us — Famous Mobiles Manikonda, Hyderabad",
  description: "Learn about Famous Mobiles, Hyderabad's premier doorstep mobile repair center located in Manikonda. Over 10,000 devices repaired with genuine parts and 4.9★ rating.",
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-14 space-y-8">
      {/* Hero */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-[#F97316] bg-[#FFF7ED] px-3 py-1 rounded-full border border-[#FFEDD5]">
          Authentic Workshop Experience
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#121212]">
          About Famous Mobiles
        </h1>
        <p className="text-xs sm:text-sm text-[#767676] max-w-lg mx-auto leading-relaxed">
          Founded with a simple mission: Eliminate repair shop hassles and deliver transparent, certified smartphone repair right to your doorstep in Manikonda & Shaikpet.
        </p>
      </div>

      {/* Trust Stats Card */}
      <div className="grid grid-cols-3 gap-3.5 text-center">
        <div className="bg-white p-5 rounded-2xl border border-[#EBEBEB] shadow-card">
          <div className="text-2xl sm:text-3xl font-bold text-[#121212]">10,000+</div>
          <div className="text-[11px] sm:text-xs text-[#767676] font-medium mt-1">Phones Repaired</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#EBEBEB] shadow-card">
          <div className="text-2xl sm:text-3xl font-bold text-emerald-600">4.9 ★</div>
          <div className="text-[11px] sm:text-xs text-[#767676] font-medium mt-1">1k+ Google Reviews</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#EBEBEB] shadow-card">
          <div className="text-2xl sm:text-3xl font-bold text-[#F97316]">₹0</div>
          <div className="text-[11px] sm:text-xs text-[#767676] font-medium mt-1">First Home Visit Free</div>
        </div>
      </div>

      {/* Physical Store Details */}
      <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6 sm:p-8 space-y-4 shadow-card">
        <h2 className="text-lg sm:text-xl font-bold text-[#121212]">
          Our Physical Workshop in Shaikpet / Puppalaguda
        </h2>
        <p className="text-xs sm:text-sm text-[#555555] leading-relaxed">
          Unlike online aggregators who outsource your expensive phone to unknown third parties, Famous Mobiles operates an authentic physical store Opp Friends Colony Bus Stop, Shaikpet Main Road, Puppalaguda. Every technician who arrives at your doorstep is an in-house employee backed by our workshop equipment.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="bg-[#F8F9FA] p-4 rounded-xl border border-[#EBEBEB] space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-xs text-[#121212]">
              <MapPin className="w-4 h-4 text-[#F97316]" />
              <span>Workshop Address</span>
            </div>
            <p className="text-xs text-[#767676] leading-relaxed">
              Opp Friends Colony Bus Stop, Shaikpet Main Road, Puppalaguda, Manikonda, Hyderabad 500089
            </p>
            <a
              href="https://share.google/U0L5BeQxKW1dBHUbJ"
              target="_blank"
              rel="noreferrer"
              className="text-[11px] font-semibold text-[#F97316] hover:underline inline-flex items-center gap-1 pt-1"
            >
              <span>Get Directions on Google Maps →</span>
            </a>
          </div>

          <div className="bg-[#F8F9FA] p-4 rounded-xl border border-[#EBEBEB] space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-xs text-[#121212]">
              <Clock className="w-4 h-4 text-[#F97316]" />
              <span>Store Operating Hours</span>
            </div>
            <p className="text-xs text-[#767676] leading-relaxed">
              Monday through Sunday: <strong className="text-[#121212]">10:00 AM – 1:00 AM (365 Days)</strong>
            </p>
            <p className="text-[11px] text-emerald-700 font-medium pt-1">
              ⚡ Late-night emergency repair dispatch available.
            </p>
          </div>
        </div>
      </div>

      {/* Guarantees */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#EBEBEB] space-y-2 shadow-card">
          <Award className="w-6 h-6 text-[#F97316]" />
          <h3 className="text-sm font-bold text-[#121212]">Genuine OEM Quality</h3>
          <p className="text-xs text-[#767676]">We source certified display panels, ICs, and batteries directly from verified component manufacturers.</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#EBEBEB] space-y-2 shadow-card">
          <ShieldCheck className="w-6 h-6 text-emerald-600" />
          <h3 className="text-sm font-bold text-[#121212]">Store Warranty</h3>
          <p className="text-xs text-[#767676]">All major display replacements carry up to 6 months and battery replacements carry up to 8 months warranty.</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#EBEBEB] space-y-2 shadow-card">
          <Users className="w-6 h-6 text-blue-600" />
          <h3 className="text-sm font-bold text-[#121212]">Zero Passcode Policy</h3>
          <p className="text-xs text-[#767676]">Repairs are performed right in front of you. We never ask for your screen lock passcode or personal data.</p>
        </div>
      </div>
    </div>
  );
}
