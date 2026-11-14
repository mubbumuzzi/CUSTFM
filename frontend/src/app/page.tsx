"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Star,
  Clock,
  ArrowRight,
  CheckCircle2,
  Phone,
  MessageSquare,
  MapPin,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { SERVICES_DATA, ServiceItem } from "@/data/servicesData";

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    { label: "All Repairs", cat: "All", icon: "⚡" },
    { label: "Display", cat: "display-replacement", icon: "📱" },
    { label: "Battery", cat: "battery-replacement", icon: "🔋" },
    { label: "Charging", cat: "charging-port-repair", icon: "⚡" },
    { label: "Software", cat: "software-repair", icon: "💻" },
    { label: "Hardware", cat: "hardware-repair", icon: "🔧" },
    { label: "Water Damage", cat: "water-damage-diagnosis", icon: "💧" },
  ];

  const filteredServices = SERVICES_DATA.filter((s) => {
    if (selectedCategory === "All") return true;
    return s.slug === selectedCategory;
  });

  return (
    <div className="space-y-10 md:space-y-16 pb-12">
      {/* ================================================================= */}
      {/* 1. HERO SECTION                                                  */}
      {/* ================================================================= */}
      <section className="bg-gradient-to-b from-amber-50/70 via-white to-slate-50 border-b border-slate-200/60 pt-6 pb-10 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-4 md:space-y-6 text-left">
              <div className="inline-flex items-center gap-2 bg-navy-900 text-amber-300 text-xs font-black uppercase px-3 py-1 rounded-full shadow-xs">
                <span className="w-2 h-2 rounded-full bg-accent-500 animate-ping"></span>
                <span>Hyperlocal Manikonda Service • 45 Mins Arrival</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-navy-950 leading-[1.1]">
                Mobile Repair at <br />
                <span className="bg-gradient-to-r from-accent-600 to-orange-500 bg-clip-text text-transparent">
                  Your Doorstep.
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 max-w-xl font-medium leading-relaxed">
                Professional smartphone repairs completed right in front of you. Certified technicians, genuine OEM parts, transparent quotations, and a physical workshop in Manikonda.
              </p>

              {/* Primary Call-to-actions */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <Link
                  href="/book-repair"
                  className="bg-accent-500 hover:bg-accent-600 text-white font-extrabold text-sm sm:text-base px-6 py-3.5 rounded-2xl shadow-lg transition active:scale-95 flex items-center justify-center gap-2 text-center"
                >
                  <span>Book Free Doorstep Visit</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="https://wa.me/919063786751?text=Hi%20Famous%20Mobiles,%20I%20need%20doorstep%20repair%20service"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm sm:text-base px-6 py-3.5 rounded-2xl shadow-md transition active:scale-95 flex items-center justify-center gap-2 text-center"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp Quote</span>
                </a>
              </div>

              {/* Trust Indicators Strip */}
              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-bold text-slate-700">
                <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>10,000+ Phones Repaired</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>4.9 / 5 Rating (657 Reviews)</span>
                </div>
              </div>
            </div>

            {/* Right Gold Envelope Promo Card (Zomato/Blinkit Style) */}
            <div className="lg:col-span-5">
              <div className="bg-gradient-to-br from-amber-400 via-amber-300 to-orange-400 rounded-3xl p-6 sm:p-7 text-navy-900 shadow-xl relative overflow-hidden animate-pulse-subtle border-2 border-amber-300">
                <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-white/25 pointer-events-none"></div>
                <div className="relative z-10 space-y-3.5">
                  <div className="inline-flex items-center gap-1.5 bg-navy-950 text-amber-300 text-[11px] font-black uppercase px-2.5 py-1 rounded-full shadow-xs">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>New Customer Offer</span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight text-navy-950">
                    Your First Home Visit is <br />
                    <span className="text-white drop-shadow-sm font-black">100% FREE! (₹0)</span>
                  </h2>

                  <p className="text-xs sm:text-sm font-semibold text-navy-900/85 leading-relaxed">
                    Doorstep inspection within 5 km of Manikonda shop. No call-out fee for your first eligible enquiry.
                  </p>

                  <div className="p-3 bg-white/80 rounded-xl text-xs space-y-1">
                    <div className="flex justify-between font-bold text-navy-950">
                      <span>First Visit Fee</span>
                      <span className="text-emerald-700 font-extrabold">₹0 FREE</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-600">
                      <span>Subsequent Visits</span>
                      <span>₹49 (100% adjusted if repair proceeds)</span>
                    </div>
                  </div>

                  <div className="pt-1">
                    <Link
                      href="/book-repair"
                      className="w-full bg-navy-950 hover:bg-navy-900 text-white font-extrabold text-xs sm:text-sm py-3 px-4 rounded-xl shadow-md transition flex items-center justify-center gap-2"
                    >
                      <span>Claim Free Doorstep Visit Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 2. REPAIR CATEGORIES & QUICK-COMMERCE PILLS                       */}
      {/* ================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-lg sm:text-2xl font-black text-navy-900">
              What Needs Fixing Today?
            </h2>
            <p className="text-xs text-slate-500">
              Select an issue below for guaranteed 45-minute doorstep dispatch.
            </p>
          </div>
          <span className="text-xs font-bold text-accent-600 self-start sm:self-auto bg-accent-50 px-3 py-1 rounded-full border border-accent-200">
            6 Specialized Repair Services
          </span>
        </div>

        {/* Category Pills Bar */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {categories.map((c) => {
            const active = selectedCategory === c.cat;
            return (
              <button
                key={c.cat}
                onClick={() => setSelectedCategory(c.cat)}
                className={`px-3.5 py-2.5 rounded-xl text-xs font-extrabold shrink-0 transition flex items-center gap-1.5 shadow-xs ${
                  active
                    ? "bg-navy-900 text-white shadow-md"
                    : "bg-white border border-slate-200 text-navy-900 hover:border-slate-400 hover:bg-slate-50"
                }`}
              >
                <span>{c.icon}</span>
                <span>{c.label}</span>
              </button>
            );
          })}
        </div>

        {/* Quick Filter Badges */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pt-1">
          <span className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold shrink-0 flex items-center gap-1">
            ⚡ Near & Fast (45 min arrival)
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 text-[11px] font-bold shrink-0 flex items-center gap-1">
            🛡️ 1st Home Visit Free (₹0)
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 text-[11px] font-bold shrink-0 flex items-center gap-1">
            ⭐ 4.9 ★ Rating (657 Reviews)
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-purple-50 text-purple-800 border border-purple-200 text-[11px] font-bold shrink-0 flex items-center gap-1">
            🏪 Verified Manikonda Physical Shop
          </span>
        </div>

        {/* Services Grid (Responsive 2 cols on mobile, 3 cols on desktop) */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5 pt-3">
          {filteredServices.map((service) => (
            <div
              key={service.slug}
              className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs hover:shadow-lg transition flex flex-col justify-between group"
            >
              <div>
                {/* Header with icon and tag */}
                <div className="relative rounded-xl bg-slate-50 h-28 sm:h-36 flex items-center justify-center mb-3 overflow-hidden border border-slate-100 group-hover:bg-amber-50/50 transition">
                  <span
                    className={`absolute top-2.5 left-2.5 ${service.tagColor} text-white text-[9px] sm:text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-xs`}
                  >
                    {service.tag}
                  </span>
                  <span className="text-4xl sm:text-5xl group-hover:scale-110 transition duration-300">
                    {service.icon}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] sm:text-xs mb-1.5">
                  <span className="bg-emerald-50 text-emerald-700 font-extrabold px-1.5 py-0.5 rounded">
                    {service.rating}
                  </span>
                  <span className="text-slate-500 font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{service.turnaround}</span>
                  </span>
                </div>

                <h3 className="text-xs sm:text-base font-extrabold text-navy-950 group-hover:text-accent-600 transition leading-snug">
                  {service.title}
                </h3>
                <p className="text-[10px] sm:text-xs text-slate-500 mt-1 line-clamp-2">
                  {service.shortDesc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block leading-tight">Warranty</span>
                  <span className="text-[11px] sm:text-xs font-black text-navy-900 block leading-tight">
                    {service.warranty.split(" ")[0]} {service.warranty.split(" ")[1] || "Cover"}
                  </span>
                </div>

                <Link
                  href={`/book-repair?category=${encodeURIComponent(service.title)}`}
                  className="bg-accent-500 hover:bg-accent-600 text-white text-xs font-extrabold px-3.5 py-2 rounded-xl shadow-xs transition active:scale-95 flex items-center gap-1"
                >
                  <span>Book</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================================================================= */}
      {/* 3. HOW IT WORKS (PRD 5-Step Lifecycle Stepper)                   */}
      {/* ================================================================= */}
      <section className="bg-navy-950 text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-accent-400">
              Simple & Transparent
            </span>
            <h2 className="text-2xl sm:text-3xl font-black">How Doorstep Repair Works</h2>
            <p className="text-xs sm:text-sm text-slate-300">
              No advance payment, zero hidden fees, and transparent pricing with prior approval.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              {
                step: "01",
                title: "Book Online",
                desc: "Provide only your 10-digit mobile number and address. No OTP or login needed.",
              },
              {
                step: "02",
                title: "Team Confirms",
                desc: "Our Manikonda desk calls in 10 mins to verify the issue and reserve OEM parts.",
              },
              {
                step: "03",
                title: "Tech Arrives",
                desc: "Certified technician reaches your doorstep in 45 mins with tools and parts.",
              },
              {
                step: "04",
                title: "You Approve Quote",
                desc: "Device diagnosed right before you. Repair starts only after you approve the quote.",
              },
              {
                step: "05",
                title: "Pay & Warranty",
                desc: "Test your device thoroughly. Pay via UPI/Cash and receive up to 6 months warranty.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-navy-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-2 relative"
              >
                <div className="text-accent-400 font-black text-lg">{item.step}</div>
                <h3 className="text-sm font-extrabold text-white">{item.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 4. WHY CHOOSE FAMOUS MOBILES (Trust & Physical Presence)          */}
      {/* ================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
            Backed by a Real Store
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-navy-950">
            Why Manikonda Trusts Famous Mobiles
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Unlike anonymous aggregator apps, we have a physical shop in Manikonda you can walk into anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-2 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-accent-50 text-accent-600 flex items-center justify-center font-black">
              ⭐
            </div>
            <h3 className="text-base font-extrabold text-navy-950">10,000+ Completed Repairs</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              From iPhone 16 screen replacements to motherboard water-damage recovery, our technicians have repaired over 10,000 devices with a 4.9★ rating.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-2 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
              🛡️
            </div>
            <h3 className="text-base font-extrabold text-navy-950">First Visit FREE (₹0)</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              New customers enjoy a ₹0 inspection visit. Subsequent home visits cost ₹49, which is 100% adjusted against your repair bill when you proceed.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-2 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black">
              📍
            </div>
            <h3 className="text-base font-extrabold text-navy-950">Physical Manikonda Hub</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Located on Main Road near Marrichettu Junction. Open daily from 9:00 AM to 9:00 PM for walk-ins, phone consultations, and warranty claims.
            </p>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 5. SERVICE AREA RADIUS (5 km Coverage)                           */}
      {/* ================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-navy-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 bg-accent-500 text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-full">
              <MapPin className="w-3.5 h-3.5" />
              <span>5 km Dedicated Coverage Area</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black">
              Serving All Major Localities Across Manikonda
            </h2>
            <p className="text-xs text-slate-300 max-w-lg">
              Lanco Hills • Puppalaguda Main Rd • Alkapoor Township • OU Colony • Shaikpet • Secretariat Colony
            </p>
          </div>

          <div className="flex gap-3 shrink-0">
            <Link
              href="/book-repair"
              className="bg-accent-500 hover:bg-accent-600 text-white font-extrabold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-md transition active:scale-95"
            >
              Book Doorstep Repair →
            </Link>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 6. COMMON FAQS                                                    */}
      {/* ================================================================= */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 space-y-4">
        <div className="text-center space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-navy-950">Frequently Asked Questions</h2>
          <p className="text-xs text-slate-500">Everything you need to know about our doorstep repair service.</p>
        </div>

        <div className="space-y-2.5">
          {[
            {
              q: "How does the 'First Home Visit is FREE' offer work?",
              a: "For all eligible new customers within our 5 km Manikonda service area, our technician visits your doorstep for ₹0. If you decide not to proceed with the repair after diagnosis, there is zero fee for your first visit. Subsequent visits are ₹49, which is 100% adjusted against your final repair bill if you proceed.",
            },
            {
              q: "Do I need to create an account or verify OTP to book a repair?",
              a: "No! Booking is completely frictionless. You only need to enter your 10-digit mobile number. OTP is required only if you want to look up live tracking details later to safeguard your privacy.",
            },
            {
              q: "How long does a typical screen or battery repair take at doorstep?",
              a: "Most screen replacements take 30 minutes, and battery replacements take around 20 minutes. All repairs are done in your presence.",
            },
            {
              q: "Can water-damaged phones be repaired at home?",
              a: "In alignment with technical standards, water damage diagnosis requires an industrial ultrasonic chemical bath and thermal microscope in our Manikonda workshop. We arrange doorstep pickup and safe return.",
            },
          ].map((faq, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 space-y-1.5 shadow-xs">
              <h3 className="text-xs sm:text-sm font-extrabold text-navy-900">{faq.q}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
