"use client";

import React from "react";
import Link from "next/link";
import { Star, CheckCircle2, MapPin } from "lucide-react";
import SplitPaneBookingBuilder from "@/components/SplitPaneBookingBuilder";
import StoreStatusText from "@/components/StoreStatusText";
import { openBookingDrawer } from "@/components/InteractiveBookingModal";
import { BUSINESS_INFO } from "@/lib/businessInfo";

export default function HomePage() {
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
            mainEntity: [
              {
                "@type": "Question",
                name: "Which areas are covered under your 6 km doorstep pickup and delivery?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "We cover all neighborhoods within 6 km of our Shaikpet Main Road / Puppalaguda store, including Manikonda, Alkapur Township, Lanco Hills, OU Colony, Shaikpet, Tolichowki, Narsingi, Kokapet, Raidurg, Gachibowli, Film Nagar, Jubilee Hills, and Mehdipatnam.",
                },
              },
              {
                "@type": "Question",
                name: "What are your store timings? Are you open late at night?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes. Famous Mobiles is open daily from 10:00 AM to 1:00 AM at Opp Friends Colony Bus Stop, Shaikpet Main Road, Puppalaguda, allowing emergency late-night screen, battery, and charging repairs.",
                },
              },
              {
                "@type": "Question",
                name: "How fast can my phone be repaired?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Most screen, battery, and charging port replacements take 30 to 60 minutes for walk-in customers and 2 to 3 hours round-trip for 6 km doorstep pickup orders.",
                },
              },
              {
                "@type": "Question",
                name: "Do you offer original screens and batteries?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes. We provide upfront quotes for both Original/Service-Pack parts and budget-friendly compatible options with clear warranty terms.",
                },
              },
              {
                "@type": "Question",
                name: "How does doorstep pickup work for gated communities like Lanco Hills or Alkapur Township?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Upon slot confirmation via website or WhatsApp (+91 90637 86751), we share our rider's details immediately for MyGate, NoBrokerHood, or security gate approval.",
                },
              },
            ],
          }),
        }}
      />

      <div className="space-y-10 pb-20">
        {/* ================================================================= */}
        {/* 1. CLEAN HERO + SPLIT-PANE BOOKING BUILDER                        */}
        {/* ================================================================= */}
        <section className="bg-white border-b border-[#EBEBEB] pt-5 pb-8 sm:py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-5">
            {/* Compact Hero Header */}
            <div className="space-y-1.5">
              <h1 className="text-2xl sm:text-4xl leading-tight font-extrabold tracking-tight text-slate-950">
                Doorstep Mobile Repair{" "}
                <span className="text-[#F97316]">in Manikonda, Shaikpet &amp; Gachibowli</span>
              </h1>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-slate-500 font-medium">
                <button
                  type="button"
                  onClick={handleOpenReviews}
                  className="inline-flex items-center gap-1 font-semibold text-slate-900 hover:text-[#F97316] cursor-pointer"
                >
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>4.9 (1k+ Reviews)</span>
                </button>
                <span>•</span>
                <StoreStatusText />
                <span>•</span>
                <span>₹0 First Visit</span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline">Zero Passcode</span>
              </div>
            </div>

            {/* Interactive Split-Pane Booking Builder */}
            <SplitPaneBookingBuilder />
          </div>
        </section>

        {/* ================================================================= */}
        {/* 2. HOW IT WORKS                                                   */}
        {/* ================================================================= */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-5">
          <div className="space-y-1">
            <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-slate-950">
              How Doorstep Repair Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Zero advance payment, upfront quotation, and in-house technician dispatch.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                step: "01",
                title: "Pick Model & Issue",
                desc: "Choose your phone model, part grade, and repair service. Book with just your mobile number.",
              },
              {
                step: "02",
                title: "15–45 Min Doorstep Arrival",
                desc: "Our technician arrives at your home, office, or society gate with MyGate/NoBroker details ready.",
              },
              {
                step: "03",
                title: "Live Repair & Pay After Check",
                desc: "Watch the repair happen in front of you without sharing your passcode. Pay via UPI or cash after testing.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-2 shadow-card"
              >
                <span className="text-[11px] font-bold text-[#F97316] bg-orange-50 border border-orange-200 inline-block px-2 py-0.5 rounded-md">
                  Step {item.step}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-slate-950">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ================================================================= */}
        {/* 3. TESTIMONIAL + 6 KM LOCALITY LINKS                              */}
        {/* ================================================================= */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 space-y-3 shadow-card">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F97316]">
              <MapPin className="w-3.5 h-3.5" />
              <span>Strict 6 km Radius from Shaikpet Main Road</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-950">
              Serving 13 Localities Across West Hyderabad
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              <Link href="/mobile-repair-manikonda" className="font-semibold text-slate-800 hover:text-[#F97316] underline">
                Manikonda
              </Link>{" "}
              •{" "}
              <Link href="/mobile-repair-shaikpet-puppalaguda" className="font-semibold text-slate-800 hover:text-[#F97316] underline">
                Puppalaguda &amp; Shaikpet
              </Link>{" "}
              •{" "}
              <Link href="/mobile-repair-manikonda" className="hover:text-[#F97316] underline">
                Alkapur Township &amp; Lanco Hills
              </Link>{" "}
              •{" "}
              <Link href="/mobile-repair-shaikpet-puppalaguda" className="hover:text-[#F97316] underline">
                OU Colony
              </Link>{" "}
              •{" "}
              <Link href="/mobile-repair-tolichowki" className="font-semibold text-slate-800 hover:text-[#F97316] underline">
                Tolichowki
              </Link>{" "}
              •{" "}
              <Link href="/mobile-repair-narsingi-kokapet" className="font-semibold text-slate-800 hover:text-[#F97316] underline">
                Narsingi &amp; Kokapet
              </Link>{" "}
              •{" "}
              <Link href="/doorstep-mobile-repair-gachibowli" className="font-semibold text-slate-800 hover:text-[#F97316] underline">
                Gachibowli &amp; Raidurg
              </Link>{" "}
              • Film Nagar • Jubilee Hills
            </p>
            <div className="flex flex-wrap gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => openBookingDrawer("Express Doorstep Visit", "15–45 mins", "₹0 Inspection Fee")}
                className="bg-[#F97316] hover:bg-orange-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer"
              >
                Book Doorstep Repair →
              </button>
              <a
                href={BUSINESS_INFO.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold text-xs px-4 py-2.5 rounded-xl border border-slate-200 transition"
              >
                Google Maps ↗
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 bg-slate-50 border border-slate-200/80 rounded-2xl p-5 sm:p-6 flex flex-col justify-between space-y-3">
            <p className="text-xs sm:text-sm text-slate-800 italic leading-relaxed">
              &ldquo;Fixed my iPhone screen in 20 minutes right at my office desk in Manikonda. Super transparent process and genuine quality!&rdquo;
            </p>
            <div className="flex items-center justify-between gap-2 text-xs pt-2 border-t border-slate-200/70">
              <div>
                <span className="font-bold text-slate-950 block">Rahul M., Lanco Hills</span>
                <span className="text-[11px] text-emerald-700 font-semibold inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Doorstep Screen Repair
                </span>
              </div>
              <Link
                href="/reviews"
                className="text-xs font-bold bg-white border border-slate-200 text-slate-800 px-3 py-2 rounded-xl hover:bg-slate-100 transition shrink-0"
              >
                All Stories →
              </Link>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* 4. LOCAL FAQS                                                     */}
        {/* ================================================================= */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 space-y-4">
          <div className="text-center space-y-1">
            <h2 className="text-lg sm:text-2xl font-bold text-slate-950">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-slate-500">
              Doorstep coverage, late-night hours, and warranty details.
            </p>
          </div>

          <div className="space-y-2.5">
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
              <div
                key={i}
                className="bg-white rounded-xl border border-slate-200/80 p-4 space-y-1 shadow-card"
              >
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
