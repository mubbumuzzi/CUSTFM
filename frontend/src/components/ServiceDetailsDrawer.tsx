"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import {
  X,
  CheckCircle2,
  Clock,
  ShieldCheck,
  MessageSquare,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import { ServiceItem } from "@/data/servicesData";
import { BUSINESS_INFO } from "@/lib/businessInfo";

interface ServiceDetailsDrawerProps {
  service: ServiceItem | null;
  deviceLabel: string;
  partGrade: string;
  isAdded: boolean;
  onClose: () => void;
  onToggleService: (slug: string) => void;
  onWhatsApp: () => void;
}

export default function ServiceDetailsDrawer({
  service,
  deviceLabel,
  partGrade,
  isAdded,
  onClose,
  onToggleService,
  onWhatsApp,
}: ServiceDetailsDrawerProps) {
  useEffect(() => {
    if (!service) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [service, onClose]);

  if (!service) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${service.title} details`}
      onClick={onClose}
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex justify-end"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white h-full border-l border-[#EBEBEB] shadow-2xl flex flex-col animate-in slide-in-from-right duration-200"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#EBEBEB] flex items-center justify-between shrink-0">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#F97316]">
              {service.tag}
            </span>
            <h3 className="font-bold text-lg text-[#121212] mt-0.5">
              {service.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close service details"
            className="w-9 h-9 rounded-lg border border-[#EBEBEB] hover:bg-[#F7F7F8] flex items-center justify-center text-[#121212] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1 text-xs sm:text-sm">
          <div className="rounded-xl border border-[#EBEBEB] bg-[#F8F9FA] p-4 flex items-center gap-3.5">
            <span className="text-3xl w-14 h-14 rounded-xl bg-white border border-[#EBEBEB] flex items-center justify-center shrink-0">
              {service.icon}
            </span>
            <p className="text-xs text-[#555555] leading-relaxed">
              {service.fullDesc}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-md bg-[#F8F9FA] border border-[#EBEBEB] font-semibold text-[#121212] inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#767676]" />
              {service.turnaround}
            </span>
            <span className="px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 font-semibold text-emerald-800 inline-flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              {service.warranty}
            </span>
            <span className="px-2.5 py-1 rounded-md bg-[#FFF7ED] border border-[#FFEDD5] font-semibold text-[#F97316]">
              ★ {service.rating.replace(" ★", "")} ({service.reviewsCount})
            </span>
          </div>

          {!service.doorstepFeasible && (
            <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-[#92400E]">
              <AlertTriangle className="w-4 h-4 text-[#B45309] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-[#78350F]">
                  Lab Pickup Required (Diagnosis-First)
                </p>
                <p className="mt-0.5 leading-relaxed">
                  Liquid damage requires ultrasonic chemical cleaning in our Shaikpet Main Road lab. Doorstep pickup &amp; safe return are included.
                </p>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <h4 className="font-bold text-sm text-[#121212]">
              Repair Process &amp; Checks
            </h4>
            <ul className="space-y-2">
              {service.process.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-[#121212]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl bg-[#F0FDF4] border border-[#DCFCE7] p-3.5 space-y-1">
            <p className="text-xs font-bold text-emerald-950">
              ₹0 First Home Visit • Upfront Quote
            </p>
            <p className="text-xs text-emerald-900/90 leading-relaxed">
              For <strong>{deviceLabel}</strong> ({partGrade}), your first doorstep inspection is ₹0 free (subsequent visits ₹69, 100% adjusted against final repair bill).
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-sm text-[#121212]">Common Questions</h4>
            {service.faqs.map((item, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-[#EBEBEB] p-3.5 space-y-1"
              >
                <p className="text-xs font-bold text-[#121212]">{item.q}</p>
                <p className="text-xs text-[#555555] leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>

          <Link
            href={`/services/${service.slug}`}
            onClick={onClose}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F97316] hover:underline"
          >
            <span>Open full {service.title} guide</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Footer Actions */}
        <div className="p-4 pb-[max(1rem,env(safe-area-inset-bottom))] border-t border-[#EBEBEB] bg-white shrink-0 space-y-2.5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <span className="block text-xs font-bold text-[#121212]">
                First Home Visit Free (₹0)
              </span>
              <span className="block text-[11px] text-[#767676]">
                {BUSINESS_INFO.hoursDisplay} Daily · {BUSINESS_INFO.phoneDisplay}
              </span>
            </div>
            <button
              type="button"
              onClick={() => onToggleService(service.slug)}
              className={`min-h-[44px] px-5 rounded-lg font-bold text-xs sm:text-sm transition cursor-pointer ${
                isAdded
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                  : "bg-[#F97316] hover:bg-[#EA580C] text-white"
              }`}
            >
              {isAdded ? "Added ✓" : "+ Add"}
            </button>
          </div>

          <button
            type="button"
            onClick={onWhatsApp}
            className="w-full min-h-[42px] rounded-lg border border-[#EBEBEB] hover:bg-[#F7F7F8] text-[#121212] font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 text-[#15803D]" />
            <span>Chat on WhatsApp ({BUSINESS_INFO.phoneDisplay})</span>
          </button>
        </div>
      </div>
    </div>
  );
}
