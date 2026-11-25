"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, ShieldCheck, Clock, CheckCircle2, RefreshCw, ArrowRight } from "lucide-react";
import { submitBookingEnquiry, setAuthSession } from "@/lib/api";
import { showFmToast } from "./ToastBanner";
import { getStoredLocation } from "@/lib/gps";
import { getDynamicArrivalSlots, ArrivalSlotOption } from "@/lib/slots";

export interface BookingDrawerDetail {
  service: string;
  turnaround?: string;
  warranty?: string;
}

export function openBookingDrawer(service = "Display Replacement", turnaround = "30 mins", warranty = "Up to 6 Months Warranty") {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("fm_open_booking_modal", {
        detail: { service, turnaround, warranty },
      })
    );
  }
}

export default function InteractiveBookingModal() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [serviceTitle, setServiceTitle] = useState("Display Replacement");
  const [serviceMeta, setServiceMeta] = useState("30 mins • Up to 6 Months Warranty");

  const [deviceModel, setDeviceModel] = useState("");
  const [availableSlots, setAvailableSlots] = useState<ArrivalSlotOption[]>([]);
  const [arrivalSlot, setArrivalSlot] = useState("Express (15–45 Mins)");
  const [mobileNumber, setMobileNumber] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    // Generate fresh dynamic slots on mount and on modal open
    const freshSlots = getDynamicArrivalSlots();
    setAvailableSlots(freshSlots);
    if (freshSlots.length > 0) {
      setArrivalSlot(freshSlots[0].value);
    }

    const handleOpen = (e: Event) => {
      const detail = (e as CustomEvent<BookingDrawerDetail>).detail;
      if (detail) {
        setServiceTitle(detail.service || "Display Replacement");
        setServiceMeta(
          `${detail.turnaround || "30 mins"} • ${detail.warranty || "Up to 6 Months Warranty"}`
        );
      }
      
      const currentSlots = getDynamicArrivalSlots();
      setAvailableSlots(currentSlots);
      if (currentSlots.length > 0) {
        setArrivalSlot(currentSlots[0].value);
      }

      const savedMobile = localStorage.getItem("fm_latest_mobile");
      if (savedMobile && !mobileNumber) {
        setMobileNumber(savedMobile);
      }
      setErrorMsg("");
      setIsOpen(true);
    };

    window.addEventListener("fm_open_booking_modal", handleOpen);
    return () => window.removeEventListener("fm_open_booking_modal", handleOpen);
  }, [mobileNumber]);

  const closeModal = () => {
    setIsOpen(false);
    setErrorMsg("");
  };

  // Direct 1-Step Booking (OTP paused)
  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanMobile = mobileNumber.trim().replace(/\D/g, "");
    if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
      setErrorMsg("Please enter a valid 10-digit Indian mobile number (e.g. 98480 12345).");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    try {
      setAuthSession(`FM-SESSION-${cleanMobile}`, cleanMobile);

      const storedLoc = getStoredLocation();
      const bookingResult = await submitBookingEnquiry({
        mobileNumber: cleanMobile,
        brandModel: deviceModel.trim() || undefined,
        repairCategory: serviceTitle,
        preferredTime: arrivalSlot,
        address: storedLoc?.locality || "Manikonda Hub",
        latitude: storedLoc?.latitude,
        longitude: storedLoc?.longitude,
      });

      closeModal();
      showFmToast(`🎉 Booked ${serviceTitle} for ${deviceModel || "device"}! Technician will call in 2 mins.`);
      setDeviceModel("");

      if (bookingResult && bookingResult.bookingId) {
        router.push(`/booking-confirmation?id=${bookingResult.bookingId}`);
      }
    } catch (err) {
      console.error("Booking error:", err);
      setErrorMsg("Failed to confirm booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeModal();
      }}
    >
      <div className="w-full max-w-md bg-white rounded-t-3xl p-5 shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[90vh] overflow-y-auto">
        {/* Grab Handle */}
        <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-4" />

        {/* Modal Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="inline-block bg-orange-100 text-[#F97316] text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full mb-1">
              Doorstep Express • Manikonda Hub
            </span>
            <h3 className="text-lg font-black text-slate-900 tracking-tight">
              {serviceTitle}
            </h3>
            <p className="text-xs text-slate-600 font-medium">
              {serviceMeta}
            </p>
          </div>
          <button
            type="button"
            onClick={closeModal}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 transition active:scale-95 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 1-Step Service & Phone Entry */}
        <form onSubmit={handleSubmitBooking} className="space-y-4">
            {/* Phone Model */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Phone Brand & Model
              </label>
              <input
                type="text"
                value={deviceModel}
                onChange={(e) => setDeviceModel(e.target.value)}
                placeholder="e.g., iPhone 14 Pro, Samsung S23, OnePlus 11"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:border-[#F97316] focus:bg-white transition"
              />
            </div>

            {/* Arrival Slot & Mobile Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Arrival Slot (IST)
                </label>
                <select
                  value={arrivalSlot}
                  onChange={(e) => setArrivalSlot(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#F97316] focus:bg-white transition"
                >
                  {availableSlots.map((slot) => (
                    <option key={slot.value} value={slot.value}>
                      {slot.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Mobile Number <span className="text-[#F97316]">*</span>
                </label>
                <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 focus-within:border-[#F97316] focus-within:bg-white transition overflow-hidden">
                  <span className="px-2.5 py-2.5 bg-slate-100 text-[11px] font-bold text-slate-600 border-r border-slate-200 select-none">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={mobileNumber}
                    onChange={(e) => {
                      setMobileNumber(e.target.value.replace(/\D/g, ""));
                      setErrorMsg("");
                    }}
                    placeholder="98480 12345"
                    className="w-full px-2.5 py-2 text-xs font-bold text-slate-900 bg-transparent focus:outline-none tracking-wide"
                  />
                </div>
              </div>
            </div>

            {errorMsg && (
              <p className="text-xs font-semibold text-rose-600">{errorMsg}</p>
            )}

            {/* Trust Pill */}
            <div className="flex items-center gap-2 p-3 bg-emerald-50/80 rounded-xl border border-emerald-100">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <p className="text-[11px] text-emerald-800 font-medium leading-tight">
                <strong>₹0 Inspection Fee:</strong> technician repairs live in front of you. Pay only after testing your device.
              </p>
            </div>

            {/* Primary CTA */}
            <button
              type="submit"
              disabled={submitting || mobileNumber.length < 10}
              className="w-full bg-[#F97316] hover:bg-[#EA580C] disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-sm py-3.5 rounded-xl shadow-md shadow-orange-500/20 transition active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
            >
              {submitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Confirming Doorstep Visit...</span>
                </>
              ) : (
                <>
                  <span>Confirm Doorstep Visit</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
      </div>
    </div>
  );
}
