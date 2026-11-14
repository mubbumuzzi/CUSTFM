"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Copy, Check, Package, MessageSquare, ArrowLeft, Clock, ShieldCheck } from "lucide-react";

function BookingConfirmationContent() {
  const searchParams = useSearchParams();
  const [bookingId, setBookingId] = useState(searchParams.get("id") || "");

  const [copied, setCopied] = useState(false);
  const [bookingData, setBookingData] = useState<{
    mobileNumber: string;
    customerName: string;
    brandModel: string;
    repairCategory: string;
    address: string;
    timestamp: string;
  } | null>(null);

  useEffect(() => {
    let id = searchParams.get("id");
    if (!id && typeof window !== "undefined") {
      id = localStorage.getItem("fm_latest_booking_id");
    }
    if (id) {
      setBookingId(id);
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem(`fm_booking_${id}`);
        if (stored) {
          try {
            setBookingData(JSON.parse(stored));
          } catch (e) {
            console.error(e);
          }
        }
      }
    }
  }, [searchParams]);

  const handleCopy = () => {
    navigator.clipboard.writeText(bookingId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8 sm:py-12 space-y-6">
      {/* Top Banner Card */}
      <div className="bg-navy-950 text-white rounded-3xl p-6 sm:p-8 text-center space-y-3.5 shadow-xl border border-navy-900 relative overflow-hidden">
        <div className="w-14 h-14 rounded-full bg-emerald-500 text-white mx-auto flex items-center justify-center shadow-md">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <span className="inline-block bg-white/10 text-amber-300 text-[11px] font-black uppercase px-3 py-1 rounded-full">
          Status: New Enquiry Logged
        </span>

        <h1 className="text-2xl sm:text-3xl font-black">Enquiry Submitted!</h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-sm mx-auto leading-relaxed">
          Famous Mobiles Manikonda desk has received your request. Our support team will call you in ~10 mins to confirm parts and technician dispatch.
        </p>

        {/* Unique Booking ID Box with Copy */}
        <div className="inline-flex items-center gap-3 bg-white text-navy-950 px-4 py-2.5 rounded-2xl text-sm font-black shadow-md mt-2">
          <span>{bookingId}</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs bg-slate-100 hover:bg-slate-200 text-navy-900 px-2.5 py-1 rounded-lg transition"
            title="Copy Booking ID"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-bold">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-600" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Booking Details Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3.5 text-xs sm:text-sm shadow-xs">
        <h3 className="font-black text-navy-900 border-b border-slate-100 pb-2">
          Enquiry Summary
        </h3>

        <div className="flex justify-between items-center text-slate-600">
          <span>Registered Mobile</span>
          <span className="font-extrabold text-navy-900">
            {bookingData?.mobileNumber ? `+91 ${bookingData.mobileNumber}` : "+91 Customer Registered"}
          </span>
        </div>

        <div className="flex justify-between items-center text-slate-600">
          <span>Device / Brand</span>
          <span className="font-extrabold text-navy-900">
            {bookingData?.brandModel || "Smartphone"}
          </span>
        </div>

        <div className="flex justify-between items-center text-slate-600">
          <span>Repair Service</span>
          <span className="font-extrabold text-navy-900">
            {bookingData?.repairCategory || "Display Replacement"}
          </span>
        </div>

        <div className="flex justify-between items-center text-slate-600">
          <span>Doorstep Location</span>
          <span className="font-extrabold text-navy-900 text-right truncate max-w-[200px]">
            {bookingData?.address || "Lanco Hills, Manikonda"}
          </span>
        </div>

        <div className="flex justify-between items-center text-slate-600 pt-1 border-t border-slate-100">
          <span>Visit Fee Promotion</span>
          <span className="font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            ₹0 FREE (First Visit)
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Link
          href={`/track-booking?id=${bookingId}`}
          className="w-full bg-accent-500 hover:bg-accent-600 text-white font-extrabold py-3.5 px-4 rounded-2xl shadow-md text-sm transition active:scale-95 flex items-center justify-center gap-2"
        >
          <Package className="w-4 h-4" />
          <span>Track Booking Status Live →</span>
        </Link>

        <a
          href={`https://wa.me/919063786751?text=Hi%20Famous%20Mobiles,%20I%20just%20submitted%20booking%20enquiry%20${bookingId}.`}
          target="_blank"
          rel="noreferrer"
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-3 px-4 rounded-2xl shadow-xs text-sm transition flex items-center justify-center gap-2"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Notify Store on WhatsApp</span>
        </a>

        <Link
          href="/"
          className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-2xl text-xs transition flex items-center justify-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Homepage</span>
        </Link>
      </div>
    </div>
  );
}

export default function BookingConfirmationPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Loading confirmation...</div>}>
      <BookingConfirmationContent />
    </Suspense>
  );
}
