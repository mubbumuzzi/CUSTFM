"use client";

import React, { useState, useEffect } from "react";
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
  ExternalLink,
  Wrench,
  Smartphone,
  Lock,
  BatteryCharging,
  Zap,
  Laptop,
  Droplets,
  Award,
  Store,
  Search,
  XCircle,
} from "lucide-react";
import { SERVICES_DATA, ServiceItem } from "@/data/servicesData";
import GpsPromptBanner from "@/components/GpsPromptBanner";
import { GoogleIcon } from "@/components/GoogleReviewsModal";
import { getStoredLocation, GpsLocationData } from "@/lib/gps";
import { openBookingDrawer } from "@/components/InteractiveBookingModal";

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [userLoc, setUserLoc] = useState<Partial<GpsLocationData> | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const stored = getStoredLocation();
    if (stored) {
      setUserLoc(stored);
    }

    const handleLocationChange = (e: Event) => {
      const detail = (e as CustomEvent<GpsLocationData>).detail;
      if (detail) {
        setUserLoc(detail);
      }
    };

    const handleSearchQuery = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      if (typeof detail === "string") {
        setSearchQuery(detail);
      }
    };

    window.addEventListener("fm_location_updated", handleLocationChange);
    window.addEventListener("fm_search_query", handleSearchQuery);
    return () => {
      window.removeEventListener("fm_location_updated", handleLocationChange);
      window.removeEventListener("fm_search_query", handleSearchQuery);
    };
  }, []);

  const categories = [
    { label: "All Repairs", cat: "All", icon: "⚡" },
    { label: "Screen & OLED", cat: "display-replacement", icon: "📱" },
    { label: "Battery", cat: "battery-replacement", icon: "🔋" },
    { label: "Charging Port", cat: "charging-port-repair", icon: "⚡" },
    { label: "Software Recovery", cat: "software-repair", icon: "💻" },
    { label: "Hardware & Camera", cat: "hardware-repair", icon: "🔧" },
    { label: "Water Damage", cat: "water-damage-diagnosis", icon: "💧" },
  ];

  const expressCards = [
    {
      id: "display",
      title: "Display",
      serviceName: "Display Replacement",
      time: "30 mins",
      warranty: "Up to 6 Months Warranty",
      warrantyBadge: "Up to 6 Months",
      desc: "Original Quality Glass & Touch",
      icon: Smartphone,
      iconBg: "bg-slate-50 group-hover:bg-orange-50",
      iconColor: "text-slate-800 group-hover:text-[#F97316]",
      keywords: "display screen glass touch cracked broken iphone samsung oled",
    },
    {
      id: "battery",
      title: "Battery",
      serviceName: "Battery Replacement",
      time: "20 mins",
      warranty: "Up to 8 Months Warranty",
      warrantyBadge: "Up to 8 Months",
      desc: "OEM-Grade with Health Display",
      icon: BatteryCharging,
      iconBg: "bg-emerald-50/70 group-hover:bg-orange-50",
      iconColor: "text-emerald-600 group-hover:text-[#F97316]",
      keywords: "battery draining fast swelling power health backup",
    },
    {
      id: "charging-port",
      title: "Charging Port",
      serviceName: "Charging Port Repair",
      time: "25 mins",
      warranty: "3 Months Warranty",
      warrantyBadge: "3 Months",
      desc: "Fast Charging Restored",
      icon: Zap,
      iconBg: "bg-amber-50/80 group-hover:bg-orange-50",
      iconColor: "text-amber-500 group-hover:text-[#F97316]",
      keywords: "charging port jack cable slow charge lightning type c connector pin",
    },
    {
      id: "software",
      title: "Software & Unlocking",
      serviceName: "Software & Unlocking",
      time: "30 mins",
      warranty: "Service Guarantee",
      warrantyBadge: "Service Guarantee",
      desc: "Safe Flashing & OS Recovery",
      icon: Laptop,
      iconBg: "bg-slate-50 group-hover:bg-orange-50",
      iconColor: "text-slate-700 group-hover:text-[#F97316]",
      keywords: "software unlocking flash hang logo update bypass bootloop unbrick",
    },
    {
      id: "hardware",
      title: "Hardware & Board",
      serviceName: "Hardware & Board Repair",
      time: "30–45 mins",
      warranty: "Up to 3 Months Warranty",
      warrantyBadge: "Up to 3 Months",
      desc: "Precision Micro-Soldering",
      icon: Wrench,
      iconBg: "bg-slate-50 group-hover:bg-orange-50",
      iconColor: "text-slate-600 group-hover:text-[#F97316]",
      keywords: "hardware motherboard ic speaker mic camera network sound ringer",
    },
    {
      id: "water-damage",
      title: "Water Damage Diagnosis",
      serviceName: "Water Damage Diagnosis",
      time: "Lab Pickup Required",
      warranty: "Subject to Board Condition",
      warrantyBadge: "Subject to Board Condition",
      desc: "Free Safe Pickup & Drop",
      icon: Droplets,
      iconBg: "bg-sky-50 group-hover:bg-orange-50",
      iconColor: "text-sky-500 group-hover:text-[#F97316]",
      keywords: "water liquid rain dropped dead phone diagnosis wet corrosion",
    },
  ];

  const filteredExpressCards = expressCards.filter((card) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      card.title.toLowerCase().includes(q) ||
      card.serviceName.toLowerCase().includes(q) ||
      card.desc.toLowerCase().includes(q) ||
      card.keywords.toLowerCase().includes(q)
    );
  });

  const filteredServices = SERVICES_DATA.filter((s) => {
    if (selectedCategory === "All") return true;
    return s.slug === selectedCategory;
  });

  const handleOpenReviews = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("fm_open_reviews_modal"));
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("fm_search_query", { detail: "" }));
    }
  };

  return (
    <>
      {/* Local SEO FAQPage Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Which areas are covered under your 6 km doorstep pickup and delivery?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "We cover all neighborhoods within 6 km of our Shaikpet Main Road / Puppalaguda store, including Manikonda, Alkapur Township, Lanco Hills, OU Colony, Shaikpet, Tolichowki, Narsingi, Kokapet, Raidurg, Gachibowli, Film Nagar, Jubilee Hills, and Mehdipatnam."
                }
              },
              {
                "@type": "Question",
                "name": "What are your store timings? Are you open late at night?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. Famous Mobiles is open daily from 10:00 AM to 1:00 AM at Opp Friends Colony Bus Stop, Shaikpet Main Road, Puppalaguda, allowing emergency late-night screen, battery, and charging repairs."
                }
              },
              {
                "@type": "Question",
                "name": "How fast can my phone be repaired?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Most screen, battery, and charging port replacements take 30 to 60 minutes for walk-in customers and 2 to 3 hours round-trip for 6 km doorstep pickup orders."
                }
              },
              {
                "@type": "Question",
                "name": "Do you offer original screens and batteries?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. We provide upfront quotes for both Original/Service-Pack parts and budget-friendly compatible options with clear warranty terms."
                }
              },
              {
                "@type": "Question",
                "name": "How does doorstep pickup work for gated communities like Lanco Hills or Alkapur Township?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Upon slot confirmation via website or WhatsApp (+91 90637 86751), we share our rider's details immediately for MyGate, NoBrokerHood, or security gate approval."
                }
              }
            ]
          }),
        }}
      />

      {/* GPS Prompt Banner */}
      <GpsPromptBanner />

      <div className="space-y-8 md:space-y-14 pb-20">
        {/* ================================================================= */}
        {/* 1. HERO & QUICK SERVICE TILES (Urban Company Mobile-First Architecture) */}
        {/* ================================================================= */}
        <section className="bg-white border-b border-[#EBEBEB] pt-4 pb-8 sm:py-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-5">
            
            {/* Live Express Status Pill */}
            <div>
              <div className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200/80 rounded-full px-3 py-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[11.5px] font-semibold text-slate-700 tracking-tight">
                  {userLoc && userLoc.eligible && userLoc.eta && userLoc.eta !== "Shop Visit Only"
                    ? `~${userLoc.eta} Express Arrival in ${userLoc.areaTitle || userLoc.locality?.split(",")[0] || "Manikonda"}`
                    : "15–45 Mins Express Arrival • 6 km Radius"}
                </span>
              </div>
            </div>

            {/* Hero Headline */}
            <div className="text-left space-y-1">
              <h1 className="text-[26px] sm:text-4xl md:text-5xl leading-[1.18] font-extrabold tracking-tight text-slate-950">
                Express Mobile Repair <span className="text-[#F97316]">at Your Doorstep</span>
              </h1>
              <p className="text-[13px] sm:text-base leading-relaxed text-slate-500 font-medium">
                Open Daily 10:00 AM – 1:00 AM • Repaired in 30 Mins Live in Front of You
              </p>
            </div>

            {/* NEW: WHY CHOOSE FAMOUS MOBILES (Trust Strip) */}
            <section aria-label="Why Choose Famous Mobiles" className="pt-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
                  Why Choose Us
                </span>
                <button
                  type="button"
                  onClick={handleOpenReviews}
                  className="text-[11px] font-semibold text-amber-600 flex items-center gap-1 cursor-pointer hover:underline"
                >
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>4.9★ Rated Local Hub</span>
                </button>
              </div>
              
              {/* 3 High-Trust Value Cards */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {/* Pillar 1: Live Transparency */}
                <div className="bg-orange-50/70 border border-orange-100 rounded-xl p-2.5 sm:p-3 flex flex-col justify-between">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white shadow-xs flex items-center justify-center text-[#F97316] mb-1.5">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[11px] sm:text-xs font-bold text-slate-900 leading-tight">Live in Front of You</p>
                    <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 leading-tight">100% Data Safe</p>
                  </div>
                </div>

                {/* Pillar 2: Warranty */}
                <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-2.5 sm:p-3 flex flex-col justify-between">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white shadow-xs flex items-center justify-center text-emerald-600 mb-1.5">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[11px] sm:text-xs font-bold text-slate-900 leading-tight">Up to 8 Mos. Warranty</p>
                    <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 leading-tight">Genuine OEM Parts</p>
                  </div>
                </div>

                {/* Pillar 3: Physical Store Backing */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 sm:p-3 flex flex-col justify-between">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white shadow-xs flex items-center justify-center text-slate-800 mb-1.5">
                    <Store className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[11px] sm:text-xs font-bold text-slate-900 leading-tight">Manikonda Store</p>
                    <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 leading-tight">₹0 Inspection Fee</p>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION HEADER: SELECT REPAIR SERVICE */}
            <div className="flex items-center justify-between pt-2" id="services-section">
              <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-800">
                Select Repair Service
              </h2>
              <span className="bg-[#ECFDF5] border border-[#A7F3D0] text-[#059669] text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                ₹0 Inspection Fee
              </span>
            </div>

            {/* Active Search Indicator (if query exists) */}
            {searchQuery && (
              <div className="flex items-center justify-between bg-orange-50/80 border border-orange-200/80 rounded-xl px-3 py-2 text-xs">
                <span className="text-slate-700">
                  Showing results for: <strong className="text-[#F97316]">"{searchQuery}"</strong>
                </span>
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>Clear</span>
                  <XCircle className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* 2-COLUMN SERVICE CARDS GRID (Exact 2-Col on Mobile, Scalable on Tablet/Desktop) */}
            <div id="servicesGrid" className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filteredExpressCards.map((card) => {
                const IconComponent = card.icon;
                return (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => openBookingDrawer(card.serviceName, card.time, card.warranty)}
                    className="service-card group text-left bg-white border border-slate-100 hover:border-orange-200 rounded-2xl p-3.5 shadow-card hover:shadow-card-hover active:scale-[0.98] transition flex flex-col items-center text-center cursor-pointer"
                  >
                    <div className={`w-11 h-11 rounded-xl ${card.iconBg} flex items-center justify-center mb-2.5 transition`}>
                      <IconComponent className={`w-5 h-5 ${card.iconColor} transition`} />
                    </div>
                    <h3 className="text-[14px] font-bold text-slate-900 leading-snug group-hover:text-[#F97316] transition">
                      {card.title}
                    </h3>
                    <p className="text-[11.5px] font-medium text-slate-400 mt-0.5">{card.time}</p>
                    <p className="text-[10.5px] text-slate-500 font-medium mt-1 leading-tight line-clamp-2">
                      {card.desc}
                    </p>
                    <span className="mt-2.5 inline-block bg-[#ECFDF5] text-[#059669] text-[10.5px] font-bold px-2.5 py-0.5 rounded-md">
                      {card.warrantyBadge}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Empty Search State */}
            {filteredExpressCards.length === 0 && (
              <div className="text-center py-8 px-4 bg-slate-50 rounded-2xl border border-slate-100 mt-2">
                <p className="text-sm font-bold text-slate-800">Can't find your exact issue?</p>
                <p className="text-xs text-slate-500 mt-1">
                  Book a free ₹0 doorstep inspection and our technician will diagnose it live.
                </p>
                <button
                  type="button"
                  onClick={() => openBookingDrawer("Free Doorstep Inspection", "15–45 mins", "₹0 Inspection Fee")}
                  className="mt-3 bg-[#F97316] hover:bg-orange-600 active:scale-95 transition text-white text-xs font-bold px-4 py-2 rounded-full shadow-sm cursor-pointer"
                >
                  Book ₹0 Inspection
                </button>
              </div>
            )}

            {/* Popular Brand Selectors (One-Tap Chips) */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Select Your Phone Brand
                </span>
                <span className="text-[11px] text-slate-500 font-medium">All models serviced</span>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {["iPhone", "Samsung", "OnePlus", "Vivo", "Xiaomi", "Pixel", "Realme", "Oppo"].map((brand) => (
                  <button
                    key={brand}
                    type="button"
                    onClick={() => openBookingDrawer(`Doorstep Repair (${brand})`, "15–45 mins", "Up to 8 Mos Warranty")}
                    className="px-2 py-2 text-center text-xs font-semibold rounded-xl bg-slate-50 hover:bg-orange-50 hover:text-[#F97316] hover:border-orange-200 border border-slate-200/80 text-slate-800 transition active:scale-95 flex items-center justify-center cursor-pointer"
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </div>

            {/* High-Converting Doorstep Action Card */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-card flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 text-left w-full md:w-auto">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex flex-col items-center justify-center shrink-0">
                  <span className="text-sm font-black leading-none">₹0</span>
                  <span className="text-[8px] font-bold uppercase tracking-tighter">FREE</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">Free Doorstep Inspection</h3>
                    <span className="text-[9px] font-extrabold uppercase text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded">
                      First Visit Offer
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Arrives in 15–30 mins. Replaced in front of you with genuine OEM parts. Pay after testing.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
                <button
                  type="button"
                  onClick={() => openBookingDrawer("Express Doorstep Visit", "15–45 mins Arrival", "₹0 Inspection Fee")}
                  className="flex-1 md:flex-initial bg-[#F97316] hover:bg-orange-600 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-xs transition active:scale-95 flex items-center justify-center gap-2 text-center cursor-pointer"
                >
                  <span>Book Doorstep Visit</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href="https://wa.me/919063786751?text=Hi%20Famous%20Mobiles,%20I%20need%20a%20doorstep%20repair%20quote"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[#15803D] hover:bg-[#16A34A] text-white font-bold text-xs sm:text-sm px-4 py-3 rounded-xl shadow-xs transition active:scale-95 flex items-center justify-center gap-1.5 text-center shrink-0"
                  title="WhatsApp Quote"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span className="hidden sm:inline">WhatsApp</span>
                </a>
              </div>
            </div>

            {/* NEW: SOCIAL PROOF & LOCAL TRUST SECTION */}
            <section className="bg-slate-50 border border-slate-200/70 rounded-2xl p-4">
              <div className="flex items-center justify-between border-b border-slate-200/70 pb-3 mb-3">
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-extrabold text-slate-900">4.9</span>
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                    Trusted by 2,500+ locals in Manikonda
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleOpenReviews}
                  className="text-[10.5px] font-bold bg-white border border-slate-200 text-slate-700 px-2.5 py-1 rounded-full hover:bg-slate-100 transition cursor-pointer"
                >
                  Verified Reviews
                </button>
              </div>

              {/* Review Quote */}
              <blockquote className="text-xs text-slate-700 leading-relaxed italic">
                “Fixed my iPhone screen in 20 minutes right at my office desk in Manikonda. Super transparent process and genuine quality!”
              </blockquote>
              <div className="mt-2.5 flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-900">— Rahul M., Lanco Hills</span>
                <span className="text-[10.5px] font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Doorstep Screen Repair
                </span>
              </div>
            </section>

            {/* Store Guarantee Footer Note */}
            <div className="mt-2 text-center">
              <p className="text-[11px] text-slate-400">
                Backed by <strong className="text-slate-600">Famous Mobiles Retail Store, Manikonda</strong> • No Fix, No Labor Fee
              </p>
            </div>

          </div>
        </section>

        {/* ================================================================= */}
        {/* 2. REPAIR CATEGORIES & FULL SPECIFICATION DETAILS                */}
        {/* ================================================================= */}
        <section id="services-grid" className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6 scroll-mt-20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EBEBEB] pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-950">
                Smartphone Repair Catalog
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Upfront quotes, genuine components, and on-demand doorstep technician dispatch.
              </p>
            </div>
            <span className="text-xs font-semibold text-[#F97316] bg-[#FFF7ED] px-3 py-1 rounded-full border border-[#FFEDD5] self-start sm:self-auto">
              6 Specialized Categories
            </span>
          </div>

          {/* Clean Filter Pills Bar */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {categories.map((c) => {
              const active = selectedCategory === c.cat;
              return (
                <button
                  key={c.cat}
                  onClick={() => setSelectedCategory(c.cat)}
                  className={`px-3.5 py-2 rounded-[10px] text-xs font-semibold shrink-0 transition flex items-center gap-1.5 cursor-pointer ${
                    active
                      ? "bg-slate-950 text-white"
                      : "bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <span>{c.icon}</span>
                  <span>{c.label}</span>
                </button>
              );
            })}
          </div>

          {/* Services Grid (Clean Urban Company Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredServices.map((service) => (
              <div
                key={service.slug}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-card hover:shadow-card-hover transition flex flex-col justify-between group"
              >
                <div className="space-y-3.5">
                  {/* Top Icon & Tag */}
                  <div className="flex items-center justify-between">
                    <span className="text-3xl p-2 rounded-[12px] bg-slate-50 border border-slate-200/70">
                      {service.icon}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-[6px]">
                      {service.tag}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-950 group-hover:text-[#F97316] transition leading-snug">
                      {service.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {service.shortDesc}
                    </p>
                  </div>

                  {/* Metadata: Turnaround & Warranty */}
                  <div className="flex items-center justify-between text-xs py-2 border-y border-slate-100 text-slate-600">
                    <div className="flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{service.turnaround}</span>
                    </div>
                    <div className="flex items-center gap-1 font-semibold text-slate-900">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{service.warranty.replace(/ Warranty$/, "")}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="mt-4 pt-2 flex items-center justify-between">
                  <Link
                    href={`/services/${service.slug}`}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-900 underline"
                  >
                    View Details
                  </Link>

                  <button
                    type="button"
                    onClick={() => openBookingDrawer(service.title, service.turnaround, service.warranty)}
                    className="bg-slate-950 hover:bg-[#F97316] text-white text-xs font-bold px-3.5 py-2 rounded-[10px] shadow-xs transition active:scale-95 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Book Service</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================================================================= */}
        {/* 3. 3-STEP CONVERSION PROCESS                                      */}
        {/* ================================================================= */}
        <section className="bg-white border-y border-slate-200/80 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
            <div className="text-center max-w-xl mx-auto space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#F97316]">
                Simple & Transparent
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950">
                How Doorstep Mobile Repair Works
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Zero advance payment, upfront quotation, and verified technician dispatch.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  step: "01",
                  title: "Book in 30 Seconds",
                  desc: "Enter your mobile number and select your phone brand & issue. No registration or complex forms required.",
                },
                {
                  step: "02",
                  title: "Technician Arrives at Doorstep",
                  desc: "Our verified technician reaches your location within 15–45 minutes with diagnostic tools and parts.",
                },
                {
                  step: "03",
                  title: "Repair in 30 Mins & Pay on Delivery",
                  desc: "Watch the repair happen live. Verify the device, test touch & display, and pay with UPI or cash.",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 space-y-3 relative"
                >
                  <div className="text-xs font-bold text-[#F97316] bg-orange-50 border border-orange-200 inline-block px-2.5 py-1 rounded-[8px]">
                    Step {item.step}
                  </div>
                  <h3 className="text-base font-bold text-slate-950">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* 4. WHY CHOOSE FAMOUS MOBILES (Trust & Comparison Grid)            */}
        {/* ================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F97316]">
              Verified Store Quality
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950">
              Why West Hyderabad Trusts Famous Mobiles
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Unlike faceless aggregator apps, we run a real physical workshop at Opp Friends Colony Bus Stop, Shaikpet Main Road.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 space-y-2.5 shadow-card hover:border-[#F97316] transition">
              <div className="w-9 h-9 rounded-[10px] bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-sm">
                🌙
              </div>
              <h3 className="text-base font-bold text-slate-950">Open Till 1:00 AM Daily</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Emergency late-night screen or battery repair. Get your device fixed tonight so you are ready by morning.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 space-y-2.5 shadow-card hover:border-emerald-500 transition">
              <div className="w-9 h-9 rounded-[10px] bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm">
                📍
              </div>
              <h3 className="text-base font-bold text-slate-950">Authentic Store Hub</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Physical workshop at Opp Friends Colony Bus Stop, Shaikpet Main Road. Know exactly where your phone is serviced.
              </p>
              <a
                href="https://share.google/U0L5BeQxKW1dBHUbJ"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-semibold text-emerald-700 hover:underline inline-block pt-1"
              >
                View on Google Maps →
              </a>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 space-y-2.5 shadow-card hover:border-blue-500 transition">
              <div className="w-9 h-9 rounded-[10px] bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-sm">
                🛡️
              </div>
              <h3 className="text-base font-bold text-slate-950">Gated Community Ready</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Seamless entry into Lanco Hills, Alkapur Township, and OU Colony with technician details shared for MyGate / NoBrokerHood.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 space-y-2.5 shadow-card hover:border-purple-500 transition">
              <div className="w-9 h-9 rounded-[10px] bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-sm">
                🔒
              </div>
              <h3 className="text-base font-bold text-slate-950">Zero Passcode Policy</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Your data stays 100% private. Hardware repairs are completed in front of you without ever asking for your screen lock code.
              </p>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* 5. 6 KM COVERAGE RADIUS                                           */}
        {/* ================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-card">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                <MapPin className="w-3.5 h-3.5 text-[#F97316]" />
                <span>Strict 6 km Dedicated Radius</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-950">
                Serving All 13 Localities Across West Hyderabad
              </h2>
              <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
                Manikonda • Puppalaguda • Shaikpet • Alkapur Township • Lanco Hills • OU Colony • Tolichowki • Narsingi • Kokapet • Raidurg • Gachibowli • Film Nagar • Jubilee Hills
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <button
                type="button"
                onClick={() => openBookingDrawer("Express Doorstep Visit", "15–45 mins", "₹0 Inspection Fee")}
                className="bg-[#F97316] hover:bg-orange-600 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-[10px] shadow-xs transition active:scale-95 text-center cursor-pointer"
              >
                Book Doorstep Repair →
              </button>
              <a
                href="https://share.google/U0L5BeQxKW1dBHUbJ"
                target="_blank"
                rel="noreferrer"
                className="bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold text-xs sm:text-sm px-4 py-3 rounded-[10px] border border-slate-200 transition flex items-center justify-center gap-1.5 text-center"
              >
                <span>Google Maps ↗</span>
              </a>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* 6. LOCAL FAQS                                                     */}
        {/* ================================================================= */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 space-y-4">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F97316]">
              Common Questions
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-950">Frequently Asked Questions</h2>
            <p className="text-xs text-slate-500">Everything you need to know about doorstep repair and late-night service.</p>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "Which areas are covered under your 6 km doorstep pickup and delivery?",
                a: "We cover all neighborhoods within 6 km of our Shaikpet Main Road / Puppalaguda store, including Manikonda, Alkapur Township, Lanco Hills, OU Colony, Shaikpet, Tolichowki, Narsingi, Kokapet, Raidurg, Gachibowli, Film Nagar, Jubilee Hills, and Mehdipatnam.",
              },
              {
                q: "What are your store timings? Are you open late at night?",
                a: "Yes. Famous Mobiles is open daily from 10:00 AM to 1:00 AM at Opp Friends Colony Bus Stop, Shaikpet Main Road, Puppalaguda, allowing emergency late-night screen, battery, and charging repairs.",
              },
              {
                q: "How fast can my phone be repaired?",
                a: "Most screen, battery, and charging port replacements take 30 to 60 minutes for walk-in customers and 2 to 3 hours round-trip for 6 km doorstep pickup orders.",
              },
              {
                q: "Do you offer original screens and batteries?",
                a: "Yes. We provide upfront quotes for both Original/Service-Pack parts and budget-friendly compatible options with clear warranty terms.",
              },
              {
                q: "How does doorstep pickup work for gated communities like Lanco Hills or Alkapur Township?",
                a: "Upon slot confirmation via website or WhatsApp (+91 90637 86751), we share our rider's details immediately for MyGate, NoBrokerHood, or security gate approval.",
              },
            ].map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 space-y-1.5 shadow-card">
                <h3 className="text-xs sm:text-sm font-bold text-slate-900">{faq.q}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
