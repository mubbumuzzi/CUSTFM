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
    handshakeOtp?: string;
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
    <div className="max-w-xl mx-auto px-4 py-8 sm:py-14 space-y-6">
      {/* Top Banner Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 text-center space-y-3.5 shadow-card border border-[#EBEBEB]">
        <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center border border-emerald-200">
          <CheckCircle2 className="w-7 h-7" />
        </div>

        <span className="inline-block bg-[#F7F7F8] border border-[#EBEBEB] text-[#121212] text-[11px] font-semibold px-3 py-1 rounded-full">
          Status: New Enquiry Logged
        </span>

        <h1 className="text-2xl sm:text-3xl font-bold text-[#121212] tracking-tight">
          Enquiry Received!
        </h1>
        <p className="text-xs sm:text-sm text-[#767676] max-w-sm mx-auto leading-relaxed">
          Famous Mobiles support team has received your request. We will call you within ~10 minutes to verify parts availability and dispatch a technician.
        </p>

        {/* Unique Booking ID Box with Copy Button */}
        <div className="inline-flex items-center gap-3 bg-[#F7F7F8] border border-[#EBEBEB] text-[#121212] px-4 py-2.5 rounded-[12px] text-sm font-bold shadow-xs mt-2">
          <span>{bookingId || "FMO-2026-LIVE"}</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs bg-white hover:bg-[#EFEFEF] border border-[#EBEBEB] text-[#121212] px-2.5 py-1 rounded-[8px] transition cursor-pointer"
            title="Copy Booking ID"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-bold">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#767676]" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Doorstep Handshake Code Card */}
      {bookingData?.handshakeOtp && (
        <div className="bg-[#FFF7ED] border border-[#FFEDD5] rounded-2xl p-5 text-center space-y-2 shadow-card">
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-[#F97316] uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-[#F97316]" />
            <span>Doorstep Handshake Code</span>
          </div>
          <p className="text-[11px] text-[#9A3412] leading-relaxed max-w-xs mx-auto">
            Share this 4-digit security code with technician only after repair is completed to your satisfaction:
          </p>
          <div className="flex justify-center items-center gap-2 pt-1">
            {bookingData.handshakeOtp.split("").map((digit, i) => (
              <div
                key={i}
                className="w-10 h-12 bg-white rounded-[10px] border border-[#FDBA74] flex items-center justify-center text-xl font-bold text-[#121212] shadow-xs"
              >
                {digit}
              </div>
            ))}
          </div>
          <p className="text-[10px] text-[#C2410C]">
            🔒 Protects your repair • Prevents unauthorized completion
          </p>
        </div>
      )}

      {/* Booking Summary Card */}
      {bookingData && (
        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-5 shadow-card space-y-3">
          <h2 className="text-xs font-bold text-[#121212] uppercase tracking-wider border-b border-[#EBEBEB] pb-2">
            Enquiry Summary
          </h2>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-[#F7F7F8]">
              <span className="text-[#767676]">Device</span>
              <span className="font-semibold text-[#121212]">{bookingData.brandModel || "Smartphone"}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#F7F7F8]">
              <span className="text-[#767676]">Service</span>
              <span className="font-semibold text-[#121212]">{bookingData.repairCategory}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#F7F7F8]">
              <span className="text-[#767676]">Registered Mobile</span>
              <span className="font-semibold text-[#121212]">+91 {bookingData.mobileNumber}</span>
            </div>
            {bookingData.address && (
              <div className="flex justify-between py-1 border-b border-[#F7F7F8]">
                <span className="text-[#767676]">Address</span>
                <span className="font-semibold text-[#121212] text-right max-w-[200px] truncate">{bookingData.address}</span>
              </div>
            )}
            <div className="flex justify-between py-1">
              <span className="text-[#767676]">First Visit Fee</span>
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-[6px] border border-emerald-200">
                ₹0 FREE
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-2.5">
        <Link
          href={`/track-booking?id=${bookingId}`}
          className="w-full bg-[#121212] hover:bg-[#F97316] text-white font-bold py-3.5 rounded-[12px] text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-xs"
        >
          <Package className="w-4 h-4" />
          <span>Track Live Order Status</span>
        </Link>

        <a
          href={`https://wa.me/919063786751?text=Hi%20Famous%20Mobiles,%20I%20just%20submitted%20enquiry%20${bookingId}.%20Can%20we%20confirm%20my%20slot?`}
          target="_blank"
          rel="noreferrer"
          className="w-full bg-[#15803D] hover:bg-[#16A34A] text-white font-bold py-3.5 rounded-[12px] text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-xs"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Confirm on WhatsApp Desk</span>
        </a>

        <div className="text-center pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#767676] hover:text-[#121212]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Homepage</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function BookingConfirmationPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-[#767676]">Loading confirmation...</div>}>
      <BookingConfirmationContent />
    </Suspense>
  );
}
