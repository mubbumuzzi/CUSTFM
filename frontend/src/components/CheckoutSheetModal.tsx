"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  Navigation,
  RefreshCw,
  ShieldCheck,
  ArrowRight,
  Clock,
} from "lucide-react";
import { SOCIETY_QUICK_CHIPS } from "@/data/deviceCatalog";
import { submitBookingEnquiry, setAuthSession } from "@/lib/api";
import { detectGpsLocation, getStoredLocation } from "@/lib/gps";
import { getDynamicArrivalSlots, ArrivalSlotOption } from "@/lib/slots";
import { BUSINESS_INFO } from "@/lib/businessInfo";
import { showFmToast } from "./ToastBanner";

interface CheckoutSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  deviceLabel: string;
  partGrade: string;
  selectedServiceTitles: string[];
}

export default function CheckoutSheetModal({
  isOpen,
  onClose,
  deviceLabel,
  partGrade,
  selectedServiceTitles,
}: CheckoutSheetModalProps) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);

  const [mobileNumber, setMobileNumber] = useState("");
  const [address, setAddress] = useState("");
  const [gpsCoords, setGpsCoords] = useState<{ latitude?: number; longitude?: number }>({});
  const [detectingGps, setDetectingGps] = useState(false);
  const [mygateRequested, setMygateRequested] = useState(true);

  const [slots, setSlots] = useState<ArrivalSlotOption[]>([]);
  const [selectedSlot, setSelectedSlot] = useState("Express (15–45 Mins)");

  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setStep(1);
    setErrorMsg("");

    const freshSlots = getDynamicArrivalSlots();
    setSlots(freshSlots);
    if (freshSlots.length > 0) {
      setSelectedSlot(freshSlots[0].value);
    }

    const storedLoc = getStoredLocation();
    if (storedLoc) {
      if (storedLoc.formattedAddress || storedLoc.locality) {
        setAddress((prev) => prev || storedLoc.formattedAddress || storedLoc.locality || "");
      }
      if (storedLoc.latitude && storedLoc.longitude) {
        setGpsCoords({ latitude: storedLoc.latitude, longitude: storedLoc.longitude });
      }
    }

    if (typeof window !== "undefined") {
      const savedMobile = localStorage.getItem("fm_latest_mobile");
      if (savedMobile) {
        setMobileNumber((prev) => prev || savedMobile);
      }
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const servicesSummary =
    selectedServiceTitles.length > 0
      ? selectedServiceTitles.join(", ")
      : "Free Doorstep Inspection";

  const handleUseGps = async () => {
    setDetectingGps(true);
    try {
      const data = await detectGpsLocation();
      if (data.formattedAddress || data.locality) {
        setAddress(data.formattedAddress || data.locality);
        setGpsCoords({ latitude: data.latitude, longitude: data.longitude });
      }
    } catch {
      setErrorMsg("Unable to auto-detect GPS. Please type your address or pick a society chip.");
    } finally {
      setDetectingGps(false);
    }
  };

  const handleContinueStep2 = () => {
    const cleanMobile = mobileNumber.trim().replace(/\D/g, "");
    if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
      setErrorMsg("Please enter a valid 10-digit Indian mobile number (e.g., 98480 12345).");
      return;
    }
    if (address.trim().length < 4) {
      setErrorMsg("Please enter your doorstep address or tap a society chip below.");
      return;
    }
    setErrorMsg("");
    setStep(2);
  };

  const handleConfirmBooking = async () => {
    const cleanMobile = mobileNumber.trim().replace(/\D/g, "");
    if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
      setStep(1);
      setErrorMsg("Please enter a valid 10-digit Indian mobile number.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");
    try {
      setAuthSession(`FM-SESSION-${cleanMobile}`, cleanMobile);

      const result = await submitBookingEnquiry({
        mobileNumber: cleanMobile,
        brandModel: `${deviceLabel} (${partGrade})`,
        repairCategory: servicesSummary,
        address: address.trim(),
        latitude: gpsCoords.latitude,
        longitude: gpsCoords.longitude,
        preferredTime: selectedSlot,
        issueDescription: mygateRequested
          ? `Part Grade: ${partGrade} | MyGate / NoBrokerHood gate pass requested`
          : `Part Grade: ${partGrade}`,
      });

      onClose();
      showFmToast("🎉 Doorstep visit booked! Technician will call in 2 mins.");
      router.push(`/booking-confirmation?id=${result.bookingId}`);
    } catch (err) {
      console.error("Booking submission error:", err);
      setErrorMsg("Failed to confirm booking. Please try again or call +91 90637 86751.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Doorstep visit checkout"
      onClick={onClose}
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-end sm:items-center justify-center sm:p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-2xl border border-[#EBEBEB] shadow-2xl overflow-hidden flex flex-col max-h-[92dvh]"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#EBEBEB] flex items-center justify-between shrink-0">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#F97316]">
              {step === 1
                ? "Step 1 of 2 · Address & Gate Pass"
                : "Step 2 of 2 · Arrival Window"}
            </span>
            <h3 className="font-bold text-lg text-[#121212] mt-0.5">
              {step === 1 ? "Doorstep Visit Details" : "Select Arrival Slot"}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close checkout modal"
            className="w-9 h-9 rounded-lg border border-[#EBEBEB] hover:bg-[#F7F7F8] flex items-center justify-center text-[#121212] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] overflow-y-auto space-y-4 flex-1">
          {/* Device + Service Pill */}
          <div className="rounded-xl bg-[#F8F9FA] border border-[#EBEBEB] px-3.5 py-2.5 text-xs space-y-0.5">
            <p className="font-bold text-[#121212]">
              {deviceLabel} · <span className="text-[#F97316]">{partGrade}</span>
            </p>
            <p className="text-[#767676] truncate">{servicesSummary}</p>
          </div>

          {step === 1 ? (
            <div className="space-y-4">
              {/* Mobile */}
              <div>
                <label
                  htmlFor="splitCheckoutPhone"
                  className="block text-xs font-bold text-[#121212] mb-1.5"
                >
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="flex rounded-lg border border-[#EBEBEB] overflow-hidden focus-within:border-[#F97316] transition bg-white">
                  <span className="inline-flex items-center px-3.5 bg-[#F8F9FA] border-r border-[#EBEBEB] text-[#121212] font-bold text-xs sm:text-sm">
                    +91
                  </span>
                  <input
                    id="splitCheckoutPhone"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={mobileNumber}
                    onChange={(e) => {
                      setMobileNumber(e.target.value.replace(/\D/g, ""));
                      setErrorMsg("");
                    }}
                    placeholder="10-digit mobile number"
                    className="w-full h-11 px-3.5 text-base sm:text-sm font-semibold text-[#121212] outline-none"
                  />
                </div>
              </div>

              {/* Address + GPS */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="splitCheckoutAddress"
                    className="block text-xs font-bold text-[#121212]"
                  >
                    Doorstep Address / Apartment / Landmark
                  </label>
                  <button
                    type="button"
                    onClick={handleUseGps}
                    disabled={detectingGps}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#F97316] hover:underline cursor-pointer"
                  >
                    {detectingGps ? (
                      <>
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        <span>Locating...</span>
                      </>
                    ) : (
                      <>
                        <Navigation className="w-3 h-3" />
                        <span>Auto-detect GPS</span>
                      </>
                    )}
                  </button>
                </div>
                <input
                  id="splitCheckoutAddress"
                  type="text"
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    setErrorMsg("");
                  }}
                  placeholder="e.g., Block B, Flat 402, Lanco Hills, Manikonda"
                  className="w-full h-11 px-3.5 border border-[#EBEBEB] focus:border-[#F97316] rounded-lg text-base sm:text-sm font-medium text-[#121212] outline-none"
                />
              </div>

              {/* Society Quick Chips */}
              <div className="space-y-2">
                <span className="block text-[11px] font-bold uppercase tracking-wider text-[#767676]">
                  Quick Society &amp; Hub Chips
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {SOCIETY_QUICK_CHIPS.map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => {
                        setAddress(chip);
                        setErrorMsg("");
                      }}
                      className="px-2.5 py-1.5 rounded-lg border border-[#EBEBEB] hover:border-[#F97316] bg-[#F8F9FA] text-xs font-semibold text-[#121212] transition cursor-pointer"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>

              {/* MyGate Checkbox */}
              <label className="flex items-start gap-3 p-3.5 rounded-xl border border-[#EBEBEB] bg-[#F8F9FA] cursor-pointer">
                <input
                  type="checkbox"
                  checked={mygateRequested}
                  onChange={(e) => setMygateRequested(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-[#F97316] rounded"
                />
                <div className="text-xs">
                  <span className="block font-bold text-[#121212]">
                    MyGate / NoBrokerHood technician gate pass needed
                  </span>
                  <span className="block text-[#767676] mt-0.5">
                    We share technician ID &amp; vehicle details right after confirmation.
                  </span>
                </div>
              </label>

              {errorMsg && (
                <p className="text-xs font-semibold text-rose-600">{errorMsg}</p>
              )}

              <button
                type="button"
                onClick={handleContinueStep2}
                className="w-full min-h-[48px] bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-sm rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Continue to Arrival Slot</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#121212] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#F97316]" />
                  <span>Select Arrival Window (IST)</span>
                </span>
                <span className="text-[11px] font-semibold text-emerald-700">
                  Open {BUSINESS_INFO.hoursDisplay}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {slots.map((slot) => {
                  const active = selectedSlot === slot.value;
                  return (
                    <button
                      key={slot.value}
                      type="button"
                      onClick={() => setSelectedSlot(slot.value)}
                      className={`min-h-[44px] px-3 py-2 rounded-xl border text-left text-xs font-semibold transition cursor-pointer ${
                        active
                          ? "border-[#F97316] bg-[#FFF7ED] text-[#F97316] font-bold"
                          : "border-[#EBEBEB] bg-white text-[#121212] hover:bg-[#F8F9FA]"
                      }`}
                    >
                      {slot.label}
                    </button>
                  );
                })}
              </div>

              {/* First Visit Free / ₹69 PRD Disclosure */}
              <div className="rounded-xl bg-[#F0FDF4] border border-[#DCFCE7] p-3.5 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>First Home Visit Offer</span>
                  </span>
                  <span className="font-bold text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200">
                    ₹0 FREE
                  </span>
                </div>
                <p className="text-[11px] text-emerald-900/90 leading-relaxed">
                  First doorstep inspection is ₹0 free! Subsequent visits cost <strong>₹69</strong> (100% adjusted against final repair bill). Pay via UPI/cash only after testing.
                </p>
              </div>

              {errorMsg && (
                <p className="text-xs font-semibold text-rose-600">{errorMsg}</p>
              )}

              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="col-span-1 min-h-[48px] rounded-xl border border-[#EBEBEB] hover:bg-[#F7F7F8] text-[#121212] font-semibold text-xs sm:text-sm transition cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleConfirmBooking}
                  className="col-span-2 min-h-[48px] rounded-xl bg-[#F97316] hover:bg-[#EA580C] disabled:opacity-70 text-white font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Confirming...</span>
                    </>
                  ) : (
                    <span>Confirm Free Doorstep Visit</span>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
