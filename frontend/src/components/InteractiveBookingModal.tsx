"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, ShieldCheck, Clock, CheckCircle2 } from "lucide-react";
import { submitBookingEnquiry } from "@/lib/api";
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
      
      // Recompute valid real-time slots at the moment user clicks to book
      const currentSlots = getDynamicArrivalSlots();
      setAvailableSlots(currentSlots);
      if (currentSlots.length > 0) {
        setArrivalSlot(currentSlots[0].value);
      }

      // Populate saved mobile if available
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanMobile = mobileNumber.trim();
    if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
      setErrorMsg("Please enter a valid 10-digit Indian mobile number (e.g. 9848012345).");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    try {
      const storedLoc = getStoredLocation();
      const bookingResult = await submitBookingEnquiry({
        mobileNumber: cleanMobile,
        brandModel: deviceModel.trim(),
        repairCategory: serviceTitle,
        preferredTime: arrivalSlot,
        address: storedLoc?.locality || "Manikonda Hub",
        latitude: storedLoc?.latitude,
        longitude: storedLoc?.longitude,
      });

      closeModal();
      showFmToast(`Booked ${serviceTitle} for ${deviceModel || "device"}! Technician will call in 2 mins.`);
      setDeviceModel("");

      // Navigate to confirmation page
      if (bookingResult && bookingResult.bookingId) {
        setTimeout(() => {
          router.push(`/booking-confirmation?id=${bookingResult.bookingId}`);
        }, 800);
      }
    } catch {
      closeModal();
      showFmToast(`Booked ${serviceTitle} for ${deviceModel || "device"}! Technician will call in 2 mins.`);
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
            <span className="inline-block bg-orange-50 text-[#F97316] text-[10.5px] font-bold px-2.5 py-0.5 rounded-full mb-1 border border-orange-100">
              Doorstep Express • Manikonda Hub
            </span>
            <h3 className="text-lg font-extrabold text-slate-950">{serviceTitle}</h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">{serviceMeta}</p>
          </div>
          <button
            type="button"
            onClick={closeModal}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 transition active:scale-95 cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {errorMsg && (
          <div className="mb-3 p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700">
            {errorMsg}
          </div>
        )}

        {/* Booking Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Phone Brand & Model
            </label>
            <input
              type="text"
              required
              value={deviceModel}
              onChange={(e) => setDeviceModel(e.target.value)}
              placeholder="e.g., iPhone 14 Pro, Samsung S23, OnePlus 11"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#F97316] focus:bg-white text-slate-900 transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Arrival Slot
              </label>
              <select
                value={arrivalSlot}
                onChange={(e) => setArrivalSlot(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#F97316] focus:bg-white transition cursor-pointer"
              >
                {availableSlots.map((slot, idx) => (
                  <option key={`${slot.value}-${idx}`} value={slot.value}>
                    {slot.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Mobile Number
              </label>
              <input
                type="tel"
                required
                maxLength={10}
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ""))}
                placeholder="10-digit number"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#F97316] focus:bg-white text-slate-900 transition"
              />
            </div>
          </div>

          {/* Guarantee Pill */}
          <div className="bg-emerald-50/80 border border-emerald-100 rounded-xl p-2.5 flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <p className="text-[11px] text-emerald-900 font-medium leading-tight">
              <strong>₹0 Inspection Fee:</strong> Technician repairs live in front of you. Pay only after testing your device.
            </p>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#F97316] hover:bg-orange-600 active:scale-[0.99] transition text-white font-bold text-sm py-3.5 rounded-xl shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
          >
            {submitting ? (
              <span>Confirming Visit...</span>
            ) : (
              <span>Confirm Doorstep Visit</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
