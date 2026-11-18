import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { MapPin, Phone, Clock, MessageSquare, ShieldCheck, Mail, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact & Store Location — Famous Mobiles Manikonda",
  description: "Find Famous Mobiles store address, operating hours, phone numbers, and WhatsApp contact for doorstep smartphone repair in Manikonda, Hyderabad.",
};

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-14 space-y-8">
      {/* Header */}
      <div className="text-center space-y-1.5">
        <span className="text-xs font-bold uppercase tracking-wider text-[#F97316] bg-[#FFF7ED] px-3 py-1 rounded-full border border-[#FFEDD5]">
          Direct Support Desk
        </span>
        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#121212]">
          Contact Famous Mobiles
        </h1>
        <p className="text-xs sm:text-sm text-[#767676] max-w-md mx-auto">
          Need a quick quote or want to visit our physical workshop? Our repair technicians are available daily from 10:00 AM to 1:00 AM.
        </p>
      </div>

      {/* Contact Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Physical Address */}
        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6 space-y-3 shadow-card">
          <div className="w-10 h-10 rounded-[10px] bg-[#FFF7ED] text-[#F97316] flex items-center justify-center font-bold">
            <MapPin className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-[#121212]">Store & Workshop Location</h2>
          <p className="text-xs sm:text-sm text-[#767676] leading-relaxed">
            Opp Friends Colony Bus Stop, Shaikpet Main Road, Puppalaguda, Manikonda, Hyderabad, Telangana 500089
          </p>
          <div className="text-[11px] font-semibold text-[#F97316]">
            <span>📍 Landmark: Opp Friends Colony Bus Stop (Shaikpet Main Road)</span>
          </div>
          <a
            href="https://share.google/U0L5BeQxKW1dBHUbJ"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#121212] bg-[#F7F7F8] hover:bg-[#EFEFEF] border border-[#EBEBEB] px-3.5 py-2 rounded-[8px] transition mt-1"
          >
            <MapPin className="w-3.5 h-3.5 text-[#F97316]" />
            <span>Open in Google Maps →</span>
          </a>
        </div>

        {/* Operating Hours */}
        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6 space-y-3 shadow-card">
          <div className="w-10 h-10 rounded-[10px] bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-[#121212]">Operating Hours</h2>
          <p className="text-xs sm:text-sm text-[#767676] leading-relaxed">
            Monday through Sunday: <strong className="text-[#121212]">10:00 AM – 1:00 AM</strong> (365 Days)
          </p>
          <div className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1.5 rounded-[8px] border border-emerald-200 inline-block">
            ⚡ Doorstep Dispatches Active Everyday Until 1:00 AM
          </div>
        </div>

        {/* Phone Contact */}
        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6 space-y-3 shadow-card">
          <div className="w-10 h-10 rounded-[10px] bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Phone className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-[#121212]">Phone Support Desk</h2>
          <p className="text-xs text-[#767676]">
            Speak directly with our repair technicians for immediate questions and parts availability.
          </p>
          <a
            href="tel:+919063786751"
            className="inline-flex items-center gap-2 font-bold text-[#121212] text-base hover:text-[#F97316] transition"
          >
            <span>+91 90637 86751</span>
          </a>
        </div>

        {/* WhatsApp Instant Quote */}
        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6 space-y-3 shadow-card">
          <div className="w-10 h-10 rounded-[10px] bg-emerald-700 text-white flex items-center justify-center font-bold shadow-xs">
            <MessageSquare className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-[#121212]">WhatsApp Chat Desk</h2>
          <p className="text-xs text-[#767676]">
            Send a photo or model number of your broken phone for an upfront quote in 5 minutes.
          </p>
          <a
            href="https://wa.me/919063786751?text=Hi%20Famous%20Mobiles,%20I%20need%20a%20doorstep%20repair%20quote"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:underline"
          >
            <span>Open WhatsApp Chat →</span>
          </a>
        </div>
      </div>
    </div>
  );
}
