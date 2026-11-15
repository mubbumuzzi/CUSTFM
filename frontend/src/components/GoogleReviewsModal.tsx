"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Star,
  X,
  MapPin,
  Clock,
  Phone,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  ArrowRight,
  MessageSquare,
  Sparkles,
} from "lucide-react";

interface GoogleReviewsModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function GoogleIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

interface CustomerReview {
  id: string;
  author: string;
  initials: string;
  avatarBg: string;
  badge: string;
  rating: number;
  date: string;
  service: string;
  comment: string;
  verified: boolean;
}

const REVIEWS: CustomerReview[] = [
  {
    id: "rev-1",
    author: "Syed M.",
    initials: "SM",
    avatarBg: "bg-blue-600",
    badge: "Local Guide • 42 reviews",
    rating: 5,
    date: "2 days ago",
    service: "iPhone 15 Pro Display Replacement",
    comment:
      "Called Famous Mobiles at 8 PM for an iPhone 15 Pro display replacement. The technician Ramesh arrived at my flat in Lanco Hills within 35 minutes! He opened the tool kit in front of me, transferred the screen, tested True Tone and Face ID, and handed over the invoice with 6 months warranty. Unbelievable doorstep service!",
    verified: true,
  },
  {
    id: "rev-2",
    author: "Priya Sharma",
    initials: "PS",
    avatarBg: "bg-emerald-600",
    badge: "Manikonda Resident",
    rating: 5,
    date: "1 week ago",
    service: "Samsung S23 Battery & Clean",
    comment:
      "Was worried about handing over phone passwords to physical service centers. Famous Mobiles fixed my Samsung S23 battery right at my living room table while I watched. Did not even ask for my passcode. 100% transparent and genuine.",
    verified: true,
  },
  {
    id: "rev-3",
    author: "Mohammed Arif",
    initials: "MA",
    avatarBg: "bg-purple-600",
    badge: "Verified Customer",
    rating: 5,
    date: "2 weeks ago",
    service: "Late-Night Water Damage Recovery",
    comment:
      "Dropped phone in water while raining. Their shop was open late night (around 1 AM). They dried and ultrasonically cleaned the motherboard and saved my family photos. Very honest pricing, did not charge unnecessary fees.",
    verified: true,
  },
  {
    id: "rev-4",
    author: "Karthik Reddy",
    initials: "KR",
    avatarBg: "bg-amber-600",
    badge: "Shaikpet / Manikonda",
    rating: 5,
    date: "3 weeks ago",
    service: "OnePlus 11 Display & Mic",
    comment:
      "Best doorstep phone repair in Manikonda. Reached in 20 minutes, 100% original OEM screen with 6 months warranty card. Saved me a trip to the crowded service center. Highly recommend Famous Mobiles!",
    verified: true,
  },
];

export default function GoogleReviewsModal({
  isOpen: propIsOpen,
  onClose: propOnClose,
}: GoogleReviewsModalProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"ALL" | "DISPLAY" | "BATTERY" | "DOORSTEP">("ALL");

  const isOpen = propIsOpen !== undefined ? propIsOpen : internalIsOpen;

  const handleClose = useCallback(() => {
    setInternalIsOpen(false);
    if (propOnClose) {
      propOnClose();
    }
  }, [propOnClose]);

  // Listen for global event to open reviews modal from anywhere
  useEffect(() => {
    const handleOpenEvent = () => {
      setInternalIsOpen(true);
    };

    window.addEventListener("fm_open_reviews_modal", handleOpenEvent);
    return () => window.removeEventListener("fm_open_reviews_modal", handleOpenEvent);
  }, []);

  // Handle ESC key & scroll locking
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  const filteredReviews = REVIEWS.filter((r) => {
    if (activeTab === "ALL") return true;
    if (activeTab === "DISPLAY") return r.service.toLowerCase().includes("display");
    if (activeTab === "BATTERY") return r.service.toLowerCase().includes("battery");
    if (activeTab === "DOORSTEP") return r.comment.toLowerCase().includes("doorstep") || r.comment.toLowerCase().includes("flat");
    return true;
  });

  const mapsUrl = "https://www.google.com/maps/search/?api=1&query=Famous+Mobiles+Manikonda+Hyderabad";

  return (
    <div
      className="fixed inset-0 z-50 bg-navy-950/75 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="google-modal-title"
    >
      <div
        className="bg-white w-full max-w-2xl rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-amber-50/50 via-white to-blue-50/40 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-center shrink-0">
              <GoogleIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 id="google-modal-title" className="text-sm sm:text-base font-black text-navy-950">
                  Famous Mobiles
                </h3>
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3 text-blue-600" />
                  Google Verified
                </span>
              </div>
              <p className="text-[11px] font-semibold text-slate-500">
                Physical Workshop & Doorstep Repair Hub • Manikonda, Hyderabad
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs transition"
            title="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body Content */}
        <div className="p-5 space-y-5 overflow-y-auto flex-1 text-navy-950">
          {/* Rating Breakdown Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-xs">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              {/* Left Score Block */}
              <div className="sm:col-span-5 text-center sm:text-left sm:border-r border-slate-200 sm:pr-4">
                <div className="flex items-baseline justify-center sm:justify-start gap-1.5">
                  <span className="text-4xl sm:text-5xl font-black text-navy-950 tracking-tight">4.9</span>
                  <span className="text-slate-400 font-bold text-lg">/ 5.0</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-1 my-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-500 fill-amber-500" />
                  ))}
                </div>
                <div className="text-xs font-bold text-slate-600">
                  Based on <span className="text-navy-950 font-black">1k+ Google Reviews</span>
                </div>
                <div className="text-[11px] text-emerald-700 font-bold flex items-center justify-center sm:justify-start gap-1 mt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>100% Verified Customer Feedback</span>
                </div>
              </div>

              {/* Right Rating Bars */}
              <div className="sm:col-span-7 space-y-1.5 text-xs font-bold text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="w-8 text-[11px]">5 ★</span>
                  <div className="flex-1 h-2.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: "94%" }}></div>
                  </div>
                  <span className="w-8 text-[11px] text-right text-slate-500 font-semibold">94%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-8 text-[11px]">4 ★</span>
                  <div className="flex-1 h-2.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full" style={{ width: "5%" }}></div>
                  </div>
                  <span className="w-8 text-[11px] text-right text-slate-500 font-semibold">5%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-8 text-[11px]">3 ★</span>
                  <div className="flex-1 h-2.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: "1%" }}></div>
                  </div>
                  <span className="w-8 text-[11px] text-right text-slate-500 font-semibold">1%</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="w-8 text-[11px]">2 ★</span>
                  <div className="flex-1 h-2.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-300 rounded-full" style={{ width: "0%" }}></div>
                  </div>
                  <span className="w-8 text-[11px] text-right text-slate-400 font-semibold">0%</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="w-8 text-[11px]">1 ★</span>
                  <div className="flex-1 h-2.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-300 rounded-full" style={{ width: "0%" }}></div>
                  </div>
                  <span className="w-8 text-[11px] text-right text-slate-400 font-semibold">0%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Physical Workshop Card */}
          <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/50 space-y-2.5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-navy-950 flex items-center gap-1.5">
                    <span>Physical Workshop: Manikonda Main Road</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.2 rounded-full border border-emerald-200">
                      Open to Public
                    </span>
                  </h4>
                  <p className="text-xs text-slate-600 font-medium mt-0.5 leading-relaxed">
                    Main Road, Near Marrichettu Junction, Manikonda, Hyderabad, Telangana 500089
                  </p>
                </div>
              </div>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 text-[11px] font-black text-emerald-800 bg-white hover:bg-emerald-100/60 border border-emerald-200 px-2.5 py-1.5 rounded-xl shadow-2xs transition flex items-center gap-1"
                title="Open in Google Maps"
              >
                <span>Navigate</span>
                <ExternalLink className="w-3 h-3 text-emerald-700" />
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px] font-bold text-slate-700">
              <div className="flex items-center gap-1.5 bg-white/80 p-2 rounded-xl border border-emerald-100">
                <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>9:30 AM – 3:30 AM Daily</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/80 p-2 rounded-xl border border-emerald-100">
                <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>+91 90637 86751</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/80 p-2 rounded-xl border border-emerald-100">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Zero Password Required</span>
              </div>
            </div>
          </div>

          {/* Customer Reviews Showcase */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
                Recent Customer Reviews
              </h4>
              <div className="flex items-center gap-1">
                {(["ALL", "DISPLAY", "BATTERY", "DOORSTEP"] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`text-[10px] font-bold px-2 py-1 rounded-lg transition ${
                      activeTab === tab
                        ? "bg-navy-950 text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {tab === "ALL" ? "All" : tab === "DISPLAY" ? "Display" : tab === "BATTERY" ? "Battery" : "Doorstep"}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {filteredReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-3.5 rounded-xl border border-slate-200/90 bg-white hover:border-slate-300 transition space-y-2 shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-8 h-8 rounded-full ${rev.avatarBg} text-white font-black text-xs flex items-center justify-center shrink-0 shadow-2xs`}
                      >
                        {rev.initials}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-black text-navy-950">{rev.author}</span>
                          <span className="text-[10px] text-slate-400 font-semibold">• {rev.date}</span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 block leading-tight">
                          {rev.badge}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-0.5">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-amber-500 fill-amber-500" />
                      ))}
                    </div>
                  </div>

                  <div className="inline-block bg-slate-100 text-slate-700 text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                    🔧 {rev.service}
                  </div>

                  <p className="text-xs text-slate-700 font-medium leading-relaxed">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Sticky Bottom Action Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/90 shrink-0 space-y-2.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Open Google Maps in New Tab */}
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-white hover:bg-slate-100 border border-slate-300 text-navy-950 font-extrabold text-xs py-3 px-4 rounded-xl shadow-xs transition flex items-center justify-center gap-1.5"
            >
              <GoogleIcon className="w-4 h-4" />
              <span>View 1k+ on Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
            </a>

            {/* Book Doorstep Service (Converts immediately!) */}
            <Link
              href="/book-repair"
              onClick={handleClose}
              className="w-full bg-accent-500 hover:bg-accent-600 text-white font-extrabold text-xs py-3 px-4 rounded-xl shadow-md transition flex items-center justify-center gap-1.5 active:scale-[0.99]"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Book ₹0 Free Doorstep Visit</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium pt-1 px-1">
            <span>📞 Call Desk: +91 90637 86751</span>
            <span className="text-emerald-700 font-bold">🛵 45-Min Arrival in Manikonda</span>
          </div>
        </div>
      </div>
    </div>
  );
}
