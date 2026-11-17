import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Clock, ShieldCheck, ArrowRight, CheckCircle2, AlertTriangle, ArrowLeft, Star, MessageSquare } from "lucide-react";
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
      {/* Back navigation */}
      <div>
        <Link
          href="/services"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#767676] hover:text-[#121212] transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Services</span>
        </Link>
      </div>

      {/* Main Detail Header Card */}
      <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6 sm:p-8 space-y-4 shadow-card">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#F7F7F8] border border-[#EBEBEB] flex items-center justify-center text-3xl shrink-0">
            {service.icon}
          </div>
          <div>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-[6px]">
              {service.tag}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#121212] mt-1">
              {service.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#767676] mt-1 font-medium">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#767676]" />
                <span>Turnaround: {service.turnaround}</span>
              </span>
              <span>•</span>
              <span className="text-emerald-700 font-semibold">{service.warranty}</span>
              <span>•</span>
              <span className="text-[#121212] font-semibold flex items-center gap-1">
                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                <span>4.9 (1k+ Reviews)</span>
              </span>
            </div>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-[#555555] leading-relaxed pt-1">
          {service.fullDesc}
        </p>

        {/* Diagnostic-first notice for Water damage */}
        {!service.doorstepFeasible && (
          <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-xl p-4 flex items-start gap-3 text-xs text-[#92400E] font-medium">
            <AlertTriangle className="w-5 h-5 text-[#B45309] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-[#78350F]">
                Specialized Workshop Service (Diagnosis-First)
              </span>
              <span>
                To protect motherboard micro-components, water damage requires chemical ultrasonic baths and short-circuit microscope tracing in our Shaikpet / Puppalaguda workshop. We provide free doorstep pickup and safe return.
              </span>
            </div>
          </div>
        )}

        {/* Booking CTA Bar */}
        <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Link
            href={`/book-repair?category=${encodeURIComponent(service.title)}`}
            className="bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-[10px] shadow-xs transition active:scale-95 text-center flex items-center justify-center gap-2"
          >
            <span>Book {service.title} (First Visit Free)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href={`https://wa.me/919063786751?text=Hi%20Famous%20Mobiles,%20I%20need%20a%20quote%20for%20${encodeURIComponent(service.title)}`}
            target="_blank"
            rel="noreferrer"
            className="bg-[#15803D] hover:bg-[#16A34A] text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-[10px] text-center transition flex items-center justify-center gap-1.5"
          >
            <MessageSquare className="w-4 h-4" />
            <span>WhatsApp Instant Quote</span>
          </a>
        </div>
      </div>

      {/* Symptoms & Process Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Symptoms */}
        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6 space-y-3 shadow-card">
          <h2 className="text-xs font-bold text-[#121212] uppercase tracking-wider">
            When Do You Need This Service?
          </h2>
          <ul className="space-y-2 text-xs text-[#555555]">
            {service.symptoms.map((symptom, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#F97316] shrink-0 mt-0.5" />
                <span>{symptom}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Repair Process */}
        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6 space-y-3 shadow-card">
          <h2 className="text-xs font-bold text-[#121212] uppercase tracking-wider">
            Our Step-by-Step Repair Process
          </h2>
          <ol className="space-y-2 text-xs text-[#555555]">
            {service.process.map((step, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-[6px] bg-[#121212] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Service FAQs */}
      <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6 space-y-4 shadow-card">
        <h2 className="text-base font-bold text-[#121212]">
          Frequently Asked Questions About {service.title}
        </h2>
        <div className="space-y-3">
          {service.faqs.map((faq, i) => (
            <div key={i} className="space-y-1 border-b border-[#EBEBEB] last:border-0 pb-3 last:pb-0">
              <h3 className="text-xs sm:text-sm font-semibold text-[#121212]">{faq.q}</h3>
              <p className="text-xs text-[#767676] leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
