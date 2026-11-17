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
    `Hi Famous Mobiles, I need doorstep mobile repair in ${config.name}`
  )}`;

  const bookingUrl = `/book-repair?locality=${encodeURIComponent(config.name)}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MobilePhoneStore",
    "name": `Famous Mobiles - ${config.name}`,
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
        <div className="bg-[#F7F7F8] border-b border-[#EBEBEB] py-2.5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1.5 text-xs text-[#767676]">
            <Link href="/" className="hover:text-[#121212] transition">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#A0A0A0]" />
            <span className="font-semibold text-[#121212]">{config.name}</span>
          </div>
        </div>

        {/* ================================================================= */}
        {/* 1. HERO SECTION                                                  */}
        {/* ================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-white border border-[#EBEBEB] rounded-2xl p-6 sm:p-10 shadow-card">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column */}
              <div className="lg:col-span-7 space-y-4 sm:space-y-5">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex items-center gap-1.5 bg-[#F7F7F8] border border-[#EBEBEB] text-[#121212] text-xs font-semibold px-3 py-1 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>{config.distanceFromStore} from Hub • {config.eta} ETA</span>
                  </div>
                  <span className="bg-emerald-50 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-200">
                    Open Till 3:00 AM Daily
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#121212] leading-[1.15]">
                  {config.heroHeadline}
                </h1>

                <p className="text-xs sm:text-sm text-[#555555] font-normal leading-relaxed">
                  {config.heroDescription}
                </p>

                {/* Local Landmarks Tags */}
                <div className="space-y-2 pt-1">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#767676]">
                    Serving Landmarks & Gated Societies in {config.name}:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {config.landmarks.concat(config.gatedSocieties).map((lm, idx) => (
                      <span
                        key={idx}
                        className="bg-[#F8F9FA] border border-[#EBEBEB] text-[#121212] text-xs font-medium px-2.5 py-1 rounded-[8px] flex items-center gap-1"
                      >
                        <Building2 className="w-3 h-3 text-[#F97316]" />
                        <span>{lm}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Primary CTAs */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                  <Link
                    href={bookingUrl}
                    className="bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-[10px] shadow-xs transition active:scale-95 flex items-center justify-center gap-2 text-center"
                  >
                    <span>Book Doorstep Visit (₹0 Free)</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-[#15803D] hover:bg-[#16A34A] text-white font-bold text-xs sm:text-sm px-5 py-3.5 rounded-[10px] shadow-xs transition active:scale-95 flex items-center justify-center gap-2 text-center"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp Quote</span>
                  </a>
                </div>

                {/* Trust Badges */}
                <div className="pt-2 flex flex-wrap items-center gap-2.5 text-xs text-[#555555]">
                  <div className="flex items-center gap-1.5 bg-[#F8F9FA] px-3 py-1.5 rounded-[8px] border border-[#EBEBEB]">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>10,000+ Phones Repaired</span>
                  </div>
                  <div className="flex items-center gap-1 bg-[#F8F9FA] px-3 py-1.5 rounded-[8px] border border-[#EBEBEB]">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span className="text-[#121212] font-bold">4.9 / 5</span>
                    <span className="text-[#767676]">(1k+ Reviews)</span>
                  </div>
                </div>
              </div>

              {/* Right Fast Quote Card */}
              <div className="lg:col-span-5">
                <div className="bg-[#121212] text-white rounded-2xl p-6 sm:p-7 space-y-4 shadow-card">
                  <div className="inline-flex items-center gap-1.5 bg-[#2A2A2A] text-amber-300 text-xs font-bold uppercase px-2.5 py-1 rounded-[6px]">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Fast Doorstep Dispatch</span>
                  </div>

                  <h3 className="text-xl font-bold">
                    Doorstep Mobile Repair in {config.name}
                  </h3>

                  <p className="text-xs text-[#A0A0A0] leading-relaxed">
                    Our verified technician arrives with diagnostic tools, OEM displays, and fresh battery packs directly to your home, gated community, or workplace.
                  </p>

                  <div className="bg-[#1C1C1E] rounded-[10px] p-4 space-y-2 border border-[#2C2C2E] text-xs">
                    <div className="flex justify-between items-center text-[#CCCCCC]">
                      <span>Store Hub</span>
                      <span className="font-semibold text-white">Opp Friends Colony Bus Stop</span>
                    </div>
                    <div className="flex justify-between items-center text-[#CCCCCC]">
                      <span>Operating Hours</span>
                      <span className="font-semibold text-amber-300">10:00 AM – 3:00 AM Daily</span>
                    </div>
                    <div className="flex justify-between items-center text-[#CCCCCC]">
                      <span>First Home Visit</span>
                      <span className="font-bold text-emerald-400">₹0 FREE</span>
                    </div>
                    <div className="flex justify-between items-center text-[#CCCCCC]">
                      <span>Society Gate Pass</span>
                      <span className="font-semibold text-[#CCCCCC]">Instant MyGate / NoBroker</span>
                    </div>
                  </div>

                  <Link
                    href={bookingUrl}
                    className="w-full bg-[#F97316] hover:bg-[#EA580C] text-white font-bold py-3 px-4 rounded-[10px] text-xs sm:text-sm transition flex items-center justify-center gap-2 text-center shadow-xs"
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EBEBEB] pb-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#121212]">
                Most Requested Repairs in {config.name}
              </h2>
              <p className="text-xs text-[#767676]">
                Completed on-site in 30–60 minutes or walk into our Shaikpet workshop.
              </p>
            </div>
            <span className="text-xs font-bold text-[#F97316] bg-[#FFF7ED] px-3 py-1 rounded-full border border-[#FFEDD5] self-start sm:self-auto">
              Up to 6 Months Warranty
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {config.popularRepairs.map((r, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-5 border border-[#EBEBEB] space-y-3 shadow-card hover:shadow-card-hover transition flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-[6px] border border-emerald-200">
                      {r.time}
                    </span>
                    {r.tag && (
                      <span className="text-[10px] font-bold text-[#F97316] bg-[#FFF7ED] px-2 py-0.5 rounded-full border border-[#FFEDD5]">
                        {r.tag}
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-[#121212]">{r.title}</h3>
                  <p className="text-xs text-[#767676] leading-relaxed">{r.description}</p>
                </div>

                <div className="pt-3 border-t border-[#EBEBEB] flex items-center justify-between text-xs">
                  <span className="text-[#555555] font-medium">{r.warranty}</span>
                  <Link
                    href={bookingUrl}
                    className="font-bold text-[#F97316] hover:text-[#EA580C] inline-flex items-center gap-1"
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
        {/* 3. LOCAL NEIGHBORHOOD FAQS                                        */}
        {/* ================================================================= */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 space-y-4">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F97316]">
              Hyper-Local FAQs
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#121212]">
              Common Questions for {config.name}
            </h2>
            <p className="text-xs text-[#767676]">
              Coverage, turnaround times, and late-night emergency repairs.
            </p>
          </div>

          <div className="space-y-3">
            {config.faqs.map((f, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-[#EBEBEB] p-5 space-y-2 shadow-card"
              >
                <h3 className="text-xs sm:text-sm font-bold text-[#121212] flex items-start gap-2">
                  <BadgeCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{f.question}</span>
                </h3>
                <p className="text-xs text-[#555555] leading-relaxed pl-6">
                  {f.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ================================================================= */}
        {/* 4. OTHER 6 KM NEIGHBORHOOD ZONES                                  */}
        {/* ================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-2xl p-6 sm:p-8 space-y-4 border border-[#EBEBEB] shadow-card">
            <h3 className="text-xs font-bold text-[#121212] uppercase tracking-wider">
              Explore Our Other 6 km Doorstep Service Areas:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
              {ALL_NEIGHBORHOODS.map((nh, i) => (
                <Link
                  key={i}
                  href={nh.slug}
                  className={`px-3 py-2.5 rounded-[10px] text-xs font-semibold border transition flex items-center justify-between ${
                    nh.slug === `/${config.slug}`
                      ? "bg-[#121212] text-white border-[#121212]"
                      : "bg-[#F8F9FA] text-[#121212] border-[#EBEBEB] hover:border-[#F97316] hover:bg-[#FFF7ED]"
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
