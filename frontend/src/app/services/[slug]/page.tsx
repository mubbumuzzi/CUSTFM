import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Clock, ShieldCheck, ArrowRight, CheckCircle2, AlertTriangle, ArrowLeft } from "lucide-react";
import { SERVICES_DATA } from "@/data/servicesData";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return SERVICES_DATA.map((s) => ({
    slug: s.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = SERVICES_DATA.find((s) => s.slug === slug);
  if (!service) {
    return { title: "Service Not Found" };
  }

  return {
    title: `${service.title} in Manikonda, Hyderabad — Doorstep Repair`,
    description: service.shortDesc,
    keywords: [
      `${service.title.toLowerCase()} Manikonda`,
      `doorstep ${service.title.toLowerCase()} Hyderabad`,
      `${service.title.toLowerCase()} Lanco Hills`,
    ],
  };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const service = SERVICES_DATA.find((s) => s.slug === slug);

  if (!service) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-14 space-y-8">
      {/* Back button */}
      <div>
        <Link
          href="/services"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-navy-950 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Services</span>
        </Link>
      </div>

      {/* Main Detail Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center text-3xl border border-amber-200">
            {service.icon}
          </div>
          <div>
            <span className={`text-[10px] font-extrabold text-white px-2 py-0.5 rounded ${service.tagColor}`}>
              {service.tag}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-navy-950 mt-1">
              {service.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1 font-semibold">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Turnaround: {service.turnaround}</span>
              </span>
              <span>•</span>
              <span className="text-emerald-700 font-bold">{service.warranty}</span>
              <span>•</span>
              <span className="text-amber-600 font-bold flex items-center gap-1">
                <span>⭐ 4.9</span>
                <span className="text-slate-400 font-normal">(1k+ Reviews)</span>
              </span>
            </div>
          </div>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed pt-2">
          {service.fullDesc}
        </p>

        {/* PRD Rule: Water damage warning banner */}
        {!service.doorstepFeasible && (
          <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-900 font-medium">
            <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-black block text-amber-950">
                Specialized Workshop Service (Diagnosis-First)
              </span>
              <span>
                To protect motherboard micro-components, water damage requires chemical ultrasonic baths and short-circuit microscope tracing in our Manikonda workshop. We provide free doorstep pickup and safe return.
              </span>
            </div>
          </div>
        )}

        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Link
            href={`/book-repair?category=${encodeURIComponent(service.title)}`}
            className="bg-accent-500 hover:bg-accent-600 text-white font-black text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-md transition active:scale-95 text-center flex items-center justify-center gap-2"
          >
            <span>Book {service.title} (First Visit Free)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href={`https://wa.me/919063786751?text=Hi%20Famous%20Mobiles,%20I%20need%20a%20quote%20for%20${encodeURIComponent(service.title)}`}
            target="_blank"
            rel="noreferrer"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm px-5 py-3.5 rounded-xl text-center transition"
          >
            WhatsApp Instant Quote
          </a>
        </div>
      </div>

      {/* Symptoms & Process Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Symptoms */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-xs">
          <h2 className="text-sm font-black text-navy-950 uppercase tracking-wider">
            When Do You Need This Service?
          </h2>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
            {service.symptoms.map((symptom, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent-500 shrink-0 mt-0.5" />
                <span>{symptom}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Repair Process */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-xs">
          <h2 className="text-sm font-black text-navy-950 uppercase tracking-wider">
            Our Precision Step-by-Step Process
          </h2>
          <ol className="space-y-2 text-xs sm:text-sm text-slate-700">
            {service.process.map((step, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-navy-900 text-white text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Service FAQs */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
        <h2 className="text-base font-black text-navy-950">
          Frequently Asked Questions About {service.title}
        </h2>
        <div className="space-y-3">
          {service.faqs.map((faq, i) => (
            <div key={i} className="space-y-1 border-b border-slate-100 last:border-0 pb-3 last:pb-0">
              <h3 className="text-xs sm:text-sm font-bold text-navy-900">{faq.q}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
