import React from "react";
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
  Building2,
  Car,
  Wrench,
  BadgeCheck,
} from "lucide-react";

export interface NeighborhoodConfig {
  slug: string;
  name: string;
  subTitle: string;
  distanceFromStore: string;
  eta: string;
  heroHeadline: string;
  heroDescription: string;
  landmarks: string[];
  gatedSocieties: string[];
  popularRepairs: {
    title: string;
    description: string;
    time: string;
    warranty: string;
    tag?: string;
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
}

const ALL_NEIGHBORHOODS = [
  { name: "Manikonda & Lanco Hills", slug: "/mobile-repair-manikonda" },
  { name: "Shaikpet & Puppalaguda (Store Hub)", slug: "/mobile-repair-shaikpet-puppalaguda" },
  { name: "Gachibowli & Telecom Nagar", slug: "/doorstep-mobile-repair-gachibowli" },
  { name: "Narsingi & Kokapet", slug: "/mobile-repair-narsingi-kokapet" },
  { name: "Tolichowki & Paramount Hills", slug: "/mobile-repair-tolichowki" },
];

export default function NeighborhoodLandingTemplate({
  config,
}: {
  config: NeighborhoodConfig;
}) {
  const whatsappUrl = `https://wa.me/919063786751?text=${encodeURIComponent(
    `Hi New Famous Mobile, I need doorstep mobile repair in ${config.name}`
  )}`;

  const bookingUrl = `/book-repair?locality=${encodeURIComponent(config.name)}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MobilePhoneStore",
    "name": `New Famous Mobile - ${config.name}`,
    "url": `https://famousmobiles.com/${config.slug}`,
    "telephone": "+919063786751",
    "priceRange": "₹₹",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Opp Friends Colony Bus Stop, Shaikpet Main Road, Puppalaguda",
      "addressLocality": "Manikonda, Hyderabad",
      "addressRegion": "Telangana",
      "postalCode": "500089",
      "addressCountry": "IN",
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 17.4058,
      "longitude": 78.3879,
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        "opens": "10:00",
        "closes": "03:00",
      },
    ],
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://famousmobiles.com",
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": `${config.name} Mobile Repair`,
        "item": `https://famousmobiles.com/${config.slug}`,
      },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": config.faqs.map((f) => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.answer,
      },
    })),
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="space-y-10 md:space-y-16 pb-16">
        {/* Breadcrumb Navigation */}
        <div className="bg-slate-100/80 border-b border-slate-200 py-2.5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1.5 text-xs text-slate-500">
            <Link href="/" className="hover:text-navy-950 transition">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-bold text-navy-900">{config.name}</span>
          </div>
        </div>

        {/* ================================================================= */}
        {/* 1. HERO SECTION                                                  */}
        {/* ================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-gradient-to-br from-amber-50/80 via-white to-slate-50 border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column */}
              <div className="lg:col-span-7 space-y-4 sm:space-y-6">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex items-center gap-1.5 bg-navy-950 text-amber-300 text-xs font-black uppercase px-3 py-1 rounded-full shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-accent-500 animate-ping"></span>
                    <span>{config.distanceFromStore} from Shaikpet Hub • {config.eta} ETA</span>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-2.5 py-1 rounded-full border border-emerald-200">
                    Open Till 3:00 AM Daily
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-navy-950 leading-[1.15]">
                  {config.heroHeadline}
                </h1>

                <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
                  {config.heroDescription}
                </p>

                {/* Local Landmarks Tags */}
                <div className="space-y-2 pt-1">
                  <div className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                    Serving Local Landmarks & Gated Communities:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {config.landmarks.concat(config.gatedSocieties).map((lm, idx) => (
                      <span
                        key={idx}
                        className="bg-white border border-slate-200 text-navy-900 text-xs font-bold px-2.5 py-1 rounded-lg shadow-2xs flex items-center gap-1"
                      >
                        <Building2 className="w-3 h-3 text-accent-500" />
                        <span>{lm}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Primary CTAs */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                  <Link
                    href={bookingUrl}
                    className="bg-accent-500 hover:bg-accent-600 text-white font-extrabold text-sm sm:text-base px-6 py-3.5 rounded-2xl shadow-lg transition active:scale-95 flex items-center justify-center gap-2 text-center"
                  >
                    <span>Book 6 km Doorstep Visit</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm sm:text-base px-5 py-3.5 rounded-2xl shadow-md transition active:scale-95 flex items-center justify-center gap-2 text-center"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp Quote (+91 9063786751)</span>
                  </a>
                </div>

                {/* Trust Badges */}
                <div className="pt-2 flex flex-wrap items-center gap-2.5 text-xs font-bold text-slate-700">
                  <div className="flex items-center gap-1.5 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-2xs">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>10,000+ Phones Repaired</span>
                  </div>
                  <div className="flex items-center gap-1 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-2xs">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span className="text-navy-950 font-black">4.9 / 5</span>
                    <span className="text-slate-500 font-medium">(1k+ Google Reviews)</span>
                  </div>
                </div>
              </div>

              {/* Right Fast Quote / Offer Box */}
              <div className="lg:col-span-5">
                <div className="bg-navy-950 text-white rounded-3xl p-6 sm:p-7 space-y-4 shadow-xl border border-slate-800 relative overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-36 h-36 bg-accent-500/10 rounded-full pointer-events-none"></div>

                  <div className="inline-flex items-center gap-1.5 bg-accent-500/20 text-accent-400 text-xs font-black uppercase px-2.5 py-1 rounded-full border border-accent-500/30">
                    <Sparkles className="w-3.5 h-3.5 text-accent-400" />
                    <span>Fast Doorstep Dispatch</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black">
                    Doorstep Phone Repair in {config.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Our verified technician arrives with certified tools, OEM / compatible screens, and genuine batteries directly to your flat, gated society, or office.
                  </p>

                  <div className="bg-slate-900/90 rounded-2xl p-4 space-y-2 border border-slate-800 text-xs">
                    <div className="flex justify-between items-center text-slate-300">
                      <span>Store Hub</span>
                      <span className="font-bold text-white">Opp Friends Colony Bus Stop</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-300">
                      <span>Operating Hours</span>
                      <span className="font-bold text-amber-300">10:00 AM – 3:00 AM Daily</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-300">
                      <span>First Home Visit</span>
                      <span className="font-black text-emerald-400">₹0 FREE</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-300">
                      <span>Society Gate Pass</span>
                      <span className="font-bold text-slate-200">Instant MyGate / NoBroker</span>
                    </div>
                  </div>

                  <Link
                    href={bookingUrl}
                    className="w-full bg-accent-500 hover:bg-accent-600 text-white font-black py-3 px-4 rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-2 text-center shadow-md"
                  >
                    <span>Schedule Repair in {config.name} →</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* 2. POPULAR REPAIRS IN THIS NEIGHBORHOOD                           */}
        {/* ================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-navy-950">
                Most Requested Repairs in {config.name}
              </h2>
              <p className="text-xs text-slate-500">
                Completed on-site inside 30–60 minutes or walk in to our Shaikpet workshop.
              </p>
            </div>
            <span className="text-xs font-black text-accent-600 bg-accent-50 px-3 py-1 rounded-full border border-accent-200 self-start sm:self-auto">
              Up to 8 Months Warranty
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {config.popularRepairs.map((r, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-5 border border-slate-200 space-y-3 shadow-xs hover:border-slate-300 transition flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      {r.time}
                    </span>
                    {r.tag && (
                      <span className="text-[10px] font-black text-accent-700 bg-accent-50 px-2 py-0.5 rounded-full border border-accent-200">
                        {r.tag}
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-extrabold text-navy-950">{r.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{r.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-bold">{r.warranty}</span>
                  <Link
                    href={bookingUrl}
                    className="font-black text-accent-600 hover:text-accent-700 inline-flex items-center gap-1"
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
        {/* 3. 3-STEP CONVERSION FLOW                                         */}
        {/* ================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-navy-950 text-white rounded-3xl p-6 sm:p-10 space-y-6 shadow-xl">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-xs font-black uppercase tracking-widest text-accent-400">
                Doorstep Booking Flow
              </span>
              <h2 className="text-2xl sm:text-3xl font-black">
                How Mobile Repair Works in {config.name}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                Transparent quotes, zero advance payment, and all repairs done before your eyes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
              <div className="bg-navy-900 border border-slate-800 rounded-2xl p-5 space-y-2">
                <div className="text-accent-400 font-black text-xl">01</div>
                <h3 className="text-sm font-extrabold text-white">Share Brand, Model & Issue</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Select your iPhone, Samsung, OnePlus, Vivo, Oppo, Redmi, or Pixel device to get an instant upfront quote.
                </p>
              </div>

              <div className="bg-navy-900 border border-slate-800 rounded-2xl p-5 space-y-2">
                <div className="text-accent-400 font-black text-xl">02</div>
                <h3 className="text-sm font-extrabold text-white">Choose Doorstep or Store Walk-In</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Schedule express doorstep arrival within our 6 km radius or visit our Shaikpet Main Road store anytime between 10:00 AM and 3:00 AM.
                </p>
              </div>

              <div className="bg-navy-900 border border-slate-800 rounded-2xl p-5 space-y-2">
                <div className="text-accent-400 font-black text-xl">03</div>
                <h3 className="text-sm font-extrabold text-white">60-Min Precision Repair & QA</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Multi-point diagnostics (touch response, True Tone/fingerprint, camera, charging) before you test and pay via UPI or Cash.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* 4. LOCAL NEIGHBORHOOD FAQS                                        */}
        {/* ================================================================= */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 space-y-4">
          <div className="text-center space-y-1">
            <span className="text-xs font-black uppercase tracking-wider text-accent-600 bg-accent-50 px-3 py-1 rounded-full border border-accent-200">
              Hyper-Local FAQs
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-navy-950">
              Common Questions for {config.name}
            </h2>
            <p className="text-xs text-slate-500">
              Coverage, turnaround times, and late-night emergency repairs.
            </p>
          </div>

          <div className="space-y-3">
            {config.faqs.map((f, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2 shadow-xs"
              >
                <h3 className="text-xs sm:text-sm font-black text-navy-950 flex items-start gap-2">
                  <BadgeCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{f.question}</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-6">
                  {f.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ================================================================= */}
        {/* 5. OTHER 6 KM NEIGHBORHOOD ZONES                                  */}
        {/* ================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-slate-100 rounded-3xl p-6 sm:p-8 space-y-4 border border-slate-200">
            <h3 className="text-sm font-black text-navy-950 uppercase tracking-wider">
              Explore Our Other 6 km Doorstep Service Areas:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
              {ALL_NEIGHBORHOODS.map((nh, i) => (
                <Link
                  key={i}
                  href={nh.slug}
                  className={`px-3 py-2.5 rounded-xl text-xs font-extrabold border transition flex items-center justify-between ${
                    nh.slug === `/${config.slug}`
                      ? "bg-navy-950 text-white border-navy-950"
                      : "bg-white text-navy-900 border-slate-200 hover:border-accent-400 hover:bg-slate-50"
                  }`}
                >
                  <span>{nh.name}</span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
