import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { MapPin, Phone, Clock, MessageSquare, ShieldCheck, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact & Store Location — Famous Mobiles Manikonda",
  description: "Find Famous Mobiles store address, operating hours, phone numbers, and WhatsApp contact for doorstep smartphone repair in Manikonda, Hyderabad.",
};

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-14 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-black uppercase tracking-wider text-accent-600 bg-accent-50 px-3 py-1 rounded-full border border-accent-200">
          Visit or Call Us
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-navy-950">
          Contact Famous Mobiles
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
          Need a quick quote or want to drop by our store? Our technicians are ready to assist you.
        </p>
      </div>

      {/* Contact Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Physical Address */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-accent-50 text-accent-600 flex items-center justify-center font-black">
            <MapPin className="w-5 h-5" />
          </div>
          <h2 className="text-base font-black text-navy-950">Store & Workshop</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Main Road, Near Marrichettu Junction, Manikonda, Hyderabad, Telangana 500089
          </p>
          <div className="text-[11px] font-bold text-accent-600 pt-1">
            📍 Landmark: Near Marrichettu Junction (Opposite Friends Colony)
          </div>
        </div>

        {/* Operating Hours */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black">
            <Clock className="w-5 h-5" />
          </div>
          <h2 className="text-base font-black text-navy-950">Operating Hours</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Monday through Sunday: <strong className="text-navy-950">9:00 AM – 9:00 PM</strong>
          </p>
          <div className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 inline-block">
            ⚡ Doorstep Dispatches Active Daily
          </div>
        </div>

        {/* Phone Contact */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
            <Phone className="w-5 h-5" />
          </div>
          <h2 className="text-base font-black text-navy-950">Telephone Support</h2>
          <p className="text-xs text-slate-600">
            Speak directly with our repair technicians for immediate questions.
          </p>
          <a
            href="tel:+919063786751"
            className="inline-flex items-center gap-2 font-black text-navy-950 text-base hover:text-accent-600 transition"
          >
            <span>+91 90637 86751</span>
          </a>
        </div>

        {/* WhatsApp Instant Quote */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black shadow-xs">
            <MessageSquare className="w-5 h-5" />
          </div>
          <h2 className="text-base font-black text-navy-950">WhatsApp Chat Desk</h2>
          <p className="text-xs text-slate-600">
            Send photo of broken device for instant quotation in 5 minutes.
          </p>
          <a
            href="https://wa.me/919063786751?text=Hi%20Famous%20Mobiles,%20I%20need%20a%20doorstep%20repair%20quote"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-700 hover:underline"
          >
            <span>Open WhatsApp Chat →</span>
          </a>
        </div>
      </div>

      {/* Map Embed Simulation */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 space-y-3 shadow-xs">
        <h3 className="text-sm font-black text-navy-950">
          Google Maps Location & Directions
        </h3>
        <div className="bg-slate-100 rounded-2xl h-64 flex flex-col items-center justify-center text-center p-4 border border-slate-200">
          <MapPin className="w-8 h-8 text-accent-500 mb-2" />
          <span className="font-extrabold text-xs sm:text-sm text-navy-900">
            Famous Mobiles Store — Manikonda
          </span>
          <span className="text-xs text-slate-500 mt-1">
            Opposite Friends Colony Bus Stop, Main Road, Manikonda
          </span>
          <a
            href="https://maps.google.com/?q=Famous+Mobiles+Manikonda+Hyderabad"
            target="_blank"
            rel="noreferrer"
            className="mt-3 bg-navy-950 hover:bg-navy-900 text-white text-xs font-black px-4 py-2 rounded-xl transition"
          >
            Open in Google Maps App →
          </a>
        </div>
      </div>
    </div>
  );
}
