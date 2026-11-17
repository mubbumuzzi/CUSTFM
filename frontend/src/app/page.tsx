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
} from "lucide-react";
import { SERVICES_DATA, ServiceItem } from "@/data/servicesData";
import GpsPromptBanner from "@/components/GpsPromptBanner";
import { GoogleIcon } from "@/components/GoogleReviewsModal";
import { getStoredLocation, GpsLocationData } from "@/lib/gps";

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [userLoc, setUserLoc] = useState<Partial<GpsLocationData> | null>(null);

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

    window.addEventListener("fm_location_updated", handleLocationChange);
    return () => window.removeEventListener("fm_location_updated", handleLocationChange);
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

      {/* GPS Prompt Banner */}
      <GpsPromptBanner />

      <div className="space-y-12 md:space-y-20 pb-16">
        {/* ================================================================= */}
        {/* 1. HERO SECTION (Urban Company Minimalism)                        */}
        {/* ================================================================= */}
        <section className="bg-white border-b border-[#EBEBEB] pt-8 pb-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              
              {/* Left Column: Headlines & CTAs */}
              <div className="lg:col-span-7 space-y-5 text-left">
                {/* Hyperlocal ETA Pill */}
                <div className="inline-flex items-center gap-2 bg-[#F7F7F8] border border-[#EBEBEB] text-[#121212] text-xs font-semibold px-3 py-1.5 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>
                    {userLoc && userLoc.eligible && userLoc.eta && userLoc.eta !== "Shop Visit Only"
                      ? `~${userLoc.eta} Doorstep Arrival in ${userLoc.areaTitle || userLoc.locality?.split(",")[0] || "Manikonda"}`
                      : "15–45 Mins Express Arrival • 6 km Radius"}
                  </span>
                </div>

                <div className="space-y-2">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#121212] leading-[1.15]">
                    Express Mobile Repair <br className="hidden sm:inline" />
                    <span className="text-[#F97316]">at Your Doorstep</span>
                  </h1>
                  <p className="text-base sm:text-lg font-medium text-[#555555]">
                    Open Daily 10:00 AM – 3:00 AM • Manikonda & Shaikpet
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-[#767676] max-w-xl font-normal leading-relaxed">
                  Cracked screen or fast battery drain? Our certified technician arrives at your home or office in <strong>15–45 minutes</strong> with genuine OEM parts. Repairs completed in 30 minutes in front of you.
                </p>

                {/* Primary Action Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                  <Link
                    href="/book-repair"
                    className="bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-sm sm:text-base px-6 py-3.5 rounded-[12px] shadow-sm transition active:scale-95 flex items-center justify-center gap-2 text-center"
                  >
                    <span>Book Doorstep Visit</span>
                    <span className="bg-white/20 text-xs px-2 py-0.5 rounded font-black">₹0 Fee</span>
                    <ArrowRight className="w-4 h-4 ml-0.5" />
                  </Link>

                  <a
                    href="https://wa.me/919063786751?text=Hi%20Famous%20Mobiles,%20I%20need%20a%20doorstep%20repair%20quote"
                    target="_blank"
                    rel="noreferrer"
                    className="bg-[#15803D] hover:bg-[#16A34A] text-white font-bold text-sm sm:text-base px-5 py-3.5 rounded-[12px] shadow-sm transition active:scale-95 flex items-center justify-center gap-2 text-center"
                    title="Get upfront price quote on WhatsApp"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp Quote</span>
                  </a>

                  <a
                    href="#services-grid"
                    className="bg-[#F7F7F8] hover:bg-[#EFEFEF] border border-[#EBEBEB] text-[#121212] font-semibold text-sm sm:text-base px-5 py-3.5 rounded-[12px] transition flex items-center justify-center gap-1.5 text-center"
                  >
                    <span>View Pricing</span>
                  </a>
                </div>

                {/* Trust Strip */}
                <div className="pt-2 flex flex-wrap items-center gap-2.5 text-xs text-[#555555]">
                  <div className="flex items-center gap-1.5 bg-[#F7F7F8] px-3 py-1.5 rounded-[10px] border border-[#EBEBEB] font-medium">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>10,000+ Phones Repaired</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleOpenReviews}
                    className="flex items-center gap-1.5 bg-[#F7F7F8] hover:bg-[#EFEFEF] px-3 py-1.5 rounded-[10px] border border-[#EBEBEB] transition cursor-pointer font-medium"
                  >
                    <GoogleIcon className="w-3.5 h-3.5" />
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span className="text-[#121212] font-bold">4.9 / 5</span>
                    <span className="text-[#767676]">(1k+ Google Reviews)</span>
                  </button>

                  <a
                    href="https://share.google/U0L5BeQxKW1dBHUbJ"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-[10px] font-medium hover:bg-emerald-100 transition"
                  >
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Opp Friends Colony, Shaikpet</span>
                    <span className="text-[10px] font-bold underline ml-0.5">Directions ↗</span>
                  </a>
                </div>
              </div>

              {/* Right Column: Clean Urban Company Quick Booking Card */}
              <div className="lg:col-span-5">
                <div className="bg-[#FFFFFF] border border-[#EBEBEB] rounded-2xl p-6 shadow-card space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#EBEBEB]">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        First Visit Offer
                      </span>
                      <h2 className="text-lg font-bold text-[#121212] mt-1.5">
                        Free Doorstep Inspection (₹0)
                      </h2>
                    </div>
                    <span className="text-xl font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-[10px] border border-emerald-200">
                      ₹0
                    </span>
                  </div>

                  <p className="text-xs text-[#767676] leading-relaxed">
                    Zero call-out charges for your first repair booking within our 6 km coverage radius.
                  </p>

                  {/* Popular Brand Selectors */}
                  <div className="space-y-2 pt-1">
                    <label className="text-xs font-semibold text-[#121212] block">
                      Select Your Phone Brand:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {["iPhone", "Samsung", "OnePlus", "Vivo", "Pixel", "Xiaomi"].map((brand) => (
                        <Link
                          key={brand}
                          href={`/book-repair?brand=${encodeURIComponent(brand)}`}
                          className="px-2.5 py-2 text-center text-xs font-semibold rounded-[10px] bg-[#F7F7F8] hover:bg-[#FFF7ED] hover:text-[#F97316] hover:border-[#FFEDD5] border border-[#EBEBEB] text-[#121212] transition"
                        >
                          {brand}
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Visit Charge Transparency Box */}
                  <div className="bg-[#F7F7F8] rounded-[12px] p-3 border border-[#EBEBEB] text-xs space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-[#555555]">First Home Visit</span>
                      <span className="font-bold text-emerald-700">₹0 FREE</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px] text-[#767676]">
                      <span>Subsequent Visits</span>
                      <span>₹69 (Adjusted in repair bill)</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px] text-[#767676]">
                      <span>Repair Warranty</span>
                      <span className="font-semibold text-[#121212]">Up to 6 Months</span>
                    </div>
                  </div>

                  <Link
                    href="/book-repair"
                    className="w-full bg-[#121212] hover:bg-[#F97316] text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-[12px] shadow-xs transition flex items-center justify-center gap-2"
                  >
                    <span>Continue with Booking</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* 2. REPAIR CATEGORIES & SERVICES GRID (Urban Company Style)       */}
        {/* ================================================================= */}
        <section id="services-grid" className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6 scroll-mt-20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EBEBEB] pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#121212]">
                Smartphone Repair Services
              </h2>
              <p className="text-xs text-[#767676] mt-0.5">
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
                      ? "bg-[#121212] text-white"
                      : "bg-white border border-[#EBEBEB] text-[#555555] hover:text-[#121212] hover:bg-[#F7F7F8]"
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
                className="bg-white rounded-2xl border border-[#EBEBEB] p-5 shadow-card hover:shadow-card-hover transition flex flex-col justify-between group"
              >
                <div className="space-y-3.5">
                  {/* Top Icon & Tag */}
                  <div className="flex items-center justify-between">
                    <span className="text-3xl p-2 rounded-[12px] bg-[#F7F7F8] border border-[#EBEBEB]">
                      {service.icon}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-[6px]">
                      {service.tag}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-[#121212] group-hover:text-[#F97316] transition leading-snug">
                      {service.title}
                    </h3>
                    <p className="text-xs text-[#767676] mt-1 line-clamp-2 leading-relaxed">
                      {service.shortDesc}
                    </p>
                  </div>

                  {/* Metadata: Turnaround & Warranty */}
                  <div className="flex items-center justify-between text-xs py-2 border-y border-[#EBEBEB] text-[#555555]">
                    <div className="flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5 text-[#767676]" />
                      <span>{service.turnaround}</span>
                    </div>
                    <div className="flex items-center gap-1 font-semibold text-[#121212]">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{service.warranty.replace(/ Warranty$/, "")}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="mt-4 pt-2 flex items-center justify-between">
                  <Link
                    href={`/services/${service.slug}`}
                    className="text-xs font-semibold text-[#767676] hover:text-[#121212] underline"
                  >
                    View Details
                  </Link>

                  <Link
                    href={`/book-repair?category=${encodeURIComponent(service.title)}`}
                    className="bg-[#121212] hover:bg-[#F97316] text-white text-xs font-bold px-3.5 py-2 rounded-[10px] shadow-xs transition active:scale-95 flex items-center gap-1"
                  >
                    <span>Book Service</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================================================================= */}
        {/* 3. 3-STEP CONVERSION PROCESS                                      */}
        {/* ================================================================= */}
        <section className="bg-white border-y border-[#EBEBEB] py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
            <div className="text-center max-w-xl mx-auto space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#F97316]">
                Simple & Transparent
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#121212]">
                How Doorstep Mobile Repair Works
              </h2>
              <p className="text-xs sm:text-sm text-[#767676]">
                Zero advance payment, upfront quotation, and verified technician dispatch.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  step: "01",
                  title: "Book in 30 Seconds",
                  desc: "Enter your mobile number and select your phone brand & issue. No registration or OTP required.",
                },
                {
                  step: "02",
                  title: "Technician Arrives at Doorstep",
                  desc: "Our verified technician reaches your location within 15–45 minutes with diagnostic tools and parts.",
                },
                {
                  step: "03",
                  title: "Repair in 30 Mins & Pay on Delivery",
                  desc: "Watch the repair happen live. Verify the device, share your 4-digit Handshake OTP, and pay with UPI or cash.",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="bg-[#F8F9FA] border border-[#EBEBEB] rounded-2xl p-6 space-y-3 relative"
                >
                  <div className="text-xs font-bold text-[#F97316] bg-[#FFF7ED] border border-[#FFEDD5] inline-block px-2.5 py-1 rounded-[8px]">
                    Step {item.step}
                  </div>
                  <h3 className="text-base font-bold text-[#121212]">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-[#767676] leading-relaxed">{item.desc}</p>
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
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#121212]">
              Why West Hyderabad Trusts Famous Mobiles
            </h2>
            <p className="text-xs sm:text-sm text-[#767676]">
              Unlike faceless aggregator apps, we run a real physical workshop at Opp Friends Colony Bus Stop, Shaikpet Main Road.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white rounded-2xl p-6 border border-[#EBEBEB] space-y-2.5 shadow-card hover:border-[#F97316] transition">
              <div className="w-9 h-9 rounded-[10px] bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-sm">
                🌙
              </div>
              <h3 className="text-base font-bold text-[#121212]">Open Till 3:00 AM Daily</h3>
              <p className="text-xs text-[#767676] leading-relaxed">
                Emergency late-night screen or battery repair. Get your device fixed tonight so you are ready by morning.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#EBEBEB] space-y-2.5 shadow-card hover:border-emerald-500 transition">
              <div className="w-9 h-9 rounded-[10px] bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm">
                📍
              </div>
              <h3 className="text-base font-bold text-[#121212]">Authentic Store Hub</h3>
              <p className="text-xs text-[#767676] leading-relaxed">
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

            <div className="bg-white rounded-2xl p-6 border border-[#EBEBEB] space-y-2.5 shadow-card hover:border-blue-500 transition">
              <div className="w-9 h-9 rounded-[10px] bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-sm">
                🛡️
              </div>
              <h3 className="text-base font-bold text-[#121212]">Gated Community Ready</h3>
              <p className="text-xs text-[#767676] leading-relaxed">
                Seamless entry into Lanco Hills, Alkapur Township, and OU Colony with technician details shared for MyGate / NoBrokerHood.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#EBEBEB] space-y-2.5 shadow-card hover:border-purple-500 transition">
              <div className="w-9 h-9 rounded-[10px] bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-sm">
                🔒
              </div>
              <h3 className="text-base font-bold text-[#121212]">Zero Passcode Policy</h3>
              <p className="text-xs text-[#767676] leading-relaxed">
                Your data stays 100% private. Hardware repairs are completed in front of you without ever asking for your screen lock code.
              </p>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* 5. 6 KM COVERAGE RADIUS                                           */}
        {/* ================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-white border border-[#EBEBEB] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-card">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 bg-[#F7F7F8] border border-[#EBEBEB] text-[#121212] text-xs font-semibold px-2.5 py-1 rounded-full">
                <MapPin className="w-3.5 h-3.5 text-[#F97316]" />
                <span>Strict 6 km Dedicated Radius</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#121212]">
                Serving All 13 Localities Across West Hyderabad
              </h2>
              <p className="text-xs text-[#767676] max-w-2xl leading-relaxed">
                Manikonda • Puppalaguda • Shaikpet • Alkapur Township • Lanco Hills • OU Colony • Tolichowki • Narsingi • Kokapet • Raidurg • Gachibowli • Film Nagar • Jubilee Hills
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link
                href="/book-repair"
                className="bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-[10px] shadow-xs transition active:scale-95 text-center"
              >
                Book Doorstep Repair →
              </Link>
              <a
                href="https://share.google/U0L5BeQxKW1dBHUbJ"
                target="_blank"
                rel="noreferrer"
                className="bg-[#F7F7F8] hover:bg-[#EFEFEF] text-[#121212] font-semibold text-xs sm:text-sm px-4 py-3 rounded-[10px] border border-[#EBEBEB] transition flex items-center justify-center gap-1.5 text-center"
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
            <h2 className="text-xl sm:text-2xl font-bold text-[#121212]">Frequently Asked Questions</h2>
            <p className="text-xs text-[#767676]">Everything you need to know about doorstep repair and late-night service.</p>
          </div>

          <div className="space-y-3">
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
              <div key={i} className="bg-white rounded-2xl border border-[#EBEBEB] p-4 sm:p-5 space-y-1.5 shadow-card">
                <h3 className="text-xs sm:text-sm font-bold text-[#121212]">{faq.q}</h3>
                <p className="text-xs text-[#767676] leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
