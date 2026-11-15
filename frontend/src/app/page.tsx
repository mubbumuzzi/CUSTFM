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
} from "lucide-react";
import { SERVICES_DATA, ServiceItem } from "@/data/servicesData";
import GpsPromptBanner from "@/components/GpsPromptBanner";
import { GoogleIcon } from "@/components/GoogleReviewsModal";
import { getStoredLocation, GpsLocationData } from "@/lib/gps";

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [userLoc, setUserLoc] = useState<Partial<GpsLocationData> | null>(null);

  useEffect(() => {
    // 1. Initial stored GPS data
    const stored = getStoredLocation();
    if (stored) {
      setUserLoc(stored);
    }

    // 2. Listen for real-time location updates (from GPS detection, LocationModal, etc.)
    const handleLocationChange = (e: Event) => {
      const detail = (e as CustomEvent<GpsLocationData>).detail;
      if (detail) {
        setUserLoc(detail);
      }
    };

    window.addEventListener("fm_location_updated", handleLocationChange);
    return () => window.removeEventListener("fm_location_updated", handleLocationChange);
  }, []);

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

  const handleOpenReviews = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("fm_open_reviews_modal"));
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
                  "text": "Yes. New Famous Mobile is open daily from 10:00 AM to 3:00 AM at Opp Friends Colony Bus Stop, Shaikpet Main Road, Puppalaguda, allowing emergency late-night screen, battery, and charging repairs."
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
                  "text": "Upon slot confirmation via website or WhatsApp (+91 9063786751), we share our rider's details immediately for MyGate, NoBrokerHood, or security gate approval."
                }
              }
            ]
          }),
        }}
      />

      {/* 1st Page GPS Permission Notification */}
      <GpsPromptBanner />

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
                <span>
                  {userLoc && userLoc.eligible && userLoc.eta && userLoc.eta !== "Shop Visit Only"
                    ? `Hyperlocal 6 km Service • ~${userLoc.eta} Arrival (${userLoc.areaTitle || userLoc.locality?.split(",")[0] || "Manikonda"})`
                    : "Hyperlocal 6 km Service • 10-60 Mins Doorstep Arrival"}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-navy-950 leading-[1.15]">
                <span>Express & Late-Night</span>{" "}
                <span className="bg-gradient-to-r from-accent-600 to-orange-500 bg-clip-text text-transparent">
                  Mobile Repair
                </span>
                <span className="block text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-navy-900 mt-2">
                  Open 10 AM – 3 AM in Manikonda & Shaikpet
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 max-w-xl font-medium leading-relaxed">
                Dropped your phone late at night? We are open daily from <strong>10:00 AM to 3:00 AM</strong> at Shaikpet Main Road, Puppalaguda—offering 30–60 minute walk-in repairs and on-demand doorstep pickup & delivery anywhere within 6 km, including Manikonda, Alkapur Township, Lanco Hills, Gachibowli, Narsingi, Tolichowki, and Jubilee Hills.
              </p>

              {/* Primary Call-to-actions */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <a
                  href="#services-grid"
                  className="bg-accent-500 hover:bg-accent-600 text-white font-extrabold text-sm sm:text-base px-6 py-3.5 rounded-2xl shadow-lg transition active:scale-95 flex items-center justify-center gap-2 text-center"
                >
                  <span>Get Instant Repair Quote</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <Link
                  href="/book-repair"
                  className="bg-navy-950 hover:bg-navy-900 text-white font-extrabold text-sm sm:text-base px-6 py-3.5 rounded-2xl shadow-md transition active:scale-95 flex items-center justify-center gap-2 text-center"
                >
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>Book 6 km Doorstep Pickup</span>
                </Link>

                <a
                  href="https://wa.me/919063786751?text=Hi%20New%20Famous%20Mobile,%20I%20need%20emergency%20repair%20service"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm sm:text-base px-4 py-3.5 rounded-2xl shadow-md transition active:scale-95 flex items-center justify-center gap-2 text-center"
                  title="Chat directly on WhatsApp (+91 9063786751)"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span className="hidden xl:inline">WhatsApp Quote</span>
                </a>
              </div>

              {/* Trust Indicators Strip with Interactive Google Modal Trigger */}
              <div className="pt-2 flex flex-wrap items-center gap-2.5 text-xs font-bold text-slate-700">
                <div className="flex items-center gap-1.5 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>10,000+ Phones Repaired</span>
                </div>

                <button
                  type="button"
                  onClick={handleOpenReviews}
                  className="flex items-center gap-2 bg-white hover:bg-amber-50/50 px-3 py-2 rounded-xl border border-slate-200 hover:border-amber-300 hover:shadow-md shadow-xs transition group cursor-pointer text-left active:scale-[0.98]"
                  title="Open Google verified ratings & customer reviews"
                >
                  <GoogleIcon className="w-4 h-4 shrink-0" />
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span className="text-navy-950 font-black">4.9 / 5</span>
                  </div>
                  <span className="text-slate-500 font-medium hidden sm:inline">(1k+ Google Reviews)</span>
                  <span className="text-slate-500 font-medium sm:hidden">(1k+)</span>
                  <span className="text-[10px] font-black bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                    Verified ↗
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenReviews}
                  className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100/80 text-emerald-900 border border-emerald-200 hover:border-emerald-300 hover:shadow-md px-3 py-2 rounded-xl shadow-xs transition group cursor-pointer text-left active:scale-[0.98]"
                  title="View physical workshop details, hours & directions"
                >
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Physical Shop: Opp Friends Colony Bus Stop</span>
                  <span className="text-[11px] font-black text-emerald-700 underline flex items-center gap-0.5 ml-0.5">
                    Directions ↗
                  </span>
                </button>
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
                    Doorstep inspection within 6 km of Shaikpet / Puppalaguda shop. No call-out fee for your first eligible enquiry.
                  </p>

                  <div className="p-3 bg-white/80 rounded-xl text-xs space-y-1">
                    <div className="flex justify-between font-bold text-navy-950">
                      <span>First Visit Fee</span>
                      <span className="text-emerald-700 font-extrabold">₹0 FREE</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-600">
                      <span>Subsequent Visits</span>
                      <span>₹69 (100% adjusted if repair proceeds)</span>
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
      <section id="services-grid" className="max-w-7xl mx-auto px-4 sm:px-6 space-y-5 scroll-mt-20">
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
            ⚡ {userLoc?.eta && userLoc.eta !== "Shop Visit Only" ? `Near you • ~${userLoc.eta} arrival` : "Near & Fast (10-45 min arrival)"}
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 text-[11px] font-bold shrink-0 flex items-center gap-1">
            🛡️ 1st Home Visit Free (₹0)
          </span>
          <button
            type="button"
            onClick={handleOpenReviews}
            className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 text-[11px] font-bold shrink-0 flex items-center gap-1 cursor-pointer transition"
          >
            ⭐ 4.9 ★ Rating (1k+ Reviews)
          </button>
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
                  <button
                    type="button"
                    onClick={handleOpenReviews}
                    className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-extrabold px-1.5 py-0.5 rounded flex items-center gap-1 transition cursor-pointer"
                    title="View 1k+ Google Reviews"
                  >
                    <span>{service.rating}</span>
                    <span className="text-[10px] text-emerald-600 font-bold">(1k+)</span>
                  </button>
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
                    {service.warranty.replace(/ Warranty$/, "")}
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
      {/* 3. 3-STEP CUSTOMER CONVERSION FLOW (Section 4 of Brief)           */}
      {/* ================================================================= */}
      <section className="bg-navy-950 text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-accent-400">
              Friction-Free Process
            </span>
            <h2 className="text-2xl sm:text-3xl font-black">3-Step Customer Conversion Flow</h2>
            <p className="text-xs sm:text-sm text-slate-300">
              No advance payment, zero hidden fees, and transparent pricing with prior approval.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                step: "01",
                title: "Share Brand, Model & Issue",
                desc: "Select your device (iPhone, Samsung, OnePlus, Vivo, Oppo, Redmi, Realme, Pixel, Nothing) to receive an upfront quote.",
              },
              {
                step: "02",
                title: "Choose Doorstep Pickup or Store Walk-In",
                desc: "Schedule pickup within our 6 km radius or visit our Shaikpet Main Road store anytime between 10:00 AM and 3:00 AM.",
              },
              {
                step: "03",
                title: "60-Minute Precision Repair & Quality Check",
                desc: "Multi-point diagnostics (touch response, True Tone/fingerprint sensor, camera, charging) before handover.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-navy-900 border border-slate-800 rounded-2xl p-5 space-y-3 relative shadow-md"
              >
                <div className="text-accent-400 font-black text-xl">{item.step}</div>
                <h3 className="text-base font-extrabold text-white">{item.title}</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 4. CORE VALUE PROPOSITIONS (Trust & Conversion Blocks)            */}
      {/* ================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-widest text-accent-600 font-black">
            Why West Hyderabad Trusts New Famous Mobile
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-navy-950">
            Real Workshop. Genuine Parts. Open Till 3 AM.
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Unlike anonymous aggregator apps, we operate an authentic physical workshop at Opp Friends Colony Bus Stop, Shaikpet Main Road.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-2.5 shadow-xs hover:border-accent-400 transition">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-black">
              🌙
            </div>
            <h3 className="text-base font-extrabold text-navy-950">Open Late Until 3:00 AM Daily</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Built for IT professionals, students, and night-shift workers—get broken screens or dead batteries fixed tonight so your phone is ready by morning.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-2.5 shadow-xs hover:border-emerald-400 transition">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
              📍
            </div>
            <h3 className="text-base font-extrabold text-navy-950">Real Store, Zero Aggregators</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Visit our physical store at Opp Friends Colony Bus Stop, Shaikpet Main Road, Puppalaguda—know exactly where your device is serviced.
            </p>
            <a
              href="https://share.google/U0L5BeQxKW1dBHUbJ"
              target="_blank"
              rel="noreferrer"
              className="text-[11px] font-bold text-emerald-700 hover:underline inline-flex items-center gap-1 pt-1"
            >
              <span>View Store on Google Maps →</span>
            </a>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-2.5 shadow-xs hover:border-blue-400 transition">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black">
              🛡️
            </div>
            <h3 className="text-base font-extrabold text-navy-950">6 km Pickup & Gated-Society Ready</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Seamless pickup and delivery across Lanco Hills, Alkapur Township, OU Colony, Gachibowli, and Narsingi with instant rider details for MyGate/NoBrokerHood approval.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-2.5 shadow-xs hover:border-purple-400 transition">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-black">
              ⚖️
            </div>
            <h3 className="text-base font-extrabold text-navy-950">OEM vs Compatible Transparency</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Compare pricing between 100% Original/OEM-grade displays and batteries versus high-grade compatible options before repair begins, backed by warranty and strict data privacy.
            </p>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 5. SERVICE AREA RADIUS (Strict 6 km Coverage)                    */}
      {/* ================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-navy-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 bg-accent-500 text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-full">
              <MapPin className="w-3.5 h-3.5" />
              <span>Strict 6 km Dedicated Coverage Area</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black">
              Serving All 13 Major Localities Across West Hyderabad
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Manikonda • Puppalaguda • Shaikpet • Alkapur Township • Lanco Hills • OU Colony • Tolichowki • Narsingi • Kokapet • Raidurg • Gachibowli • Film Nagar • Jubilee Hills • Mehdipatnam
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              href="/book-repair"
              className="bg-accent-500 hover:bg-accent-600 text-white font-extrabold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-md transition active:scale-95 text-center"
            >
              Book 6 km Doorstep Repair →
            </Link>
            <a
              href="https://share.google/U0L5BeQxKW1dBHUbJ"
              target="_blank"
              rel="noreferrer"
              className="bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs sm:text-sm px-4 py-3 rounded-xl border border-white/20 transition flex items-center justify-center gap-1.5 text-center"
            >
              <span>View Store on Google Maps ↗</span>
            </a>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 6. LOCAL SEO FAQS (Section 5 with FAQPage Schema)                 */}
      {/* ================================================================= */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 space-y-4">
        <div className="text-center space-y-1">
          <span className="text-xs font-black uppercase tracking-wider text-accent-600 bg-accent-50 px-3 py-1 rounded-full border border-accent-200">
            Hyper-Local FAQs
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-navy-950">Frequently Asked Questions</h2>
          <p className="text-xs text-slate-500">Everything you need to know about our 6 km doorstep repair service and late-night store hours.</p>
        </div>

        <div className="space-y-2.5">
          {[
            {
              q: "Which areas are covered under your 6 km doorstep pickup and delivery?",
              a: "We cover all neighborhoods within 6 km of our Shaikpet Main Road / Puppalaguda store, including Manikonda, Alkapur Township, Lanco Hills, OU Colony, Shaikpet, Tolichowki, Narsingi, Kokapet, Raidurg, Gachibowli, Film Nagar, Jubilee Hills, and Mehdipatnam.",
            },
            {
              q: "What are your store timings? Are you open late at night?",
              a: "Yes. New Famous Mobile is open daily from 10:00 AM to 3:00 AM at Opp Friends Colony Bus Stop, Shaikpet Main Road, Puppalaguda, allowing emergency late-night screen, battery, and charging repairs.",
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
              a: "Upon slot confirmation via website or WhatsApp (+91 9063786751), we share our rider's details immediately for MyGate, NoBrokerHood, or security gate approval.",
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
    </>
  );
}
