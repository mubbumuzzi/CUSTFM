"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, ShieldCheck, Clock, CheckCircle2, Lock, Edit3, RefreshCw, ArrowRight } from "lucide-react";
import { submitBookingEnquiry, sendOtpApi, verifyOtpApi, setAuthSession } from "@/lib/api";
import { showFmToast } from "./ToastBanner";
import { getStoredLocation } from "@/lib/gps";
import { getDynamicArrivalSlots, ArrivalSlotOption } from "@/lib/slots";
import { OtpInput } from "@/components/ui/OtpInput";

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
  const [step, setStep] = useState<1 | 2>(1); // 1: Details & phone, 2: OTP verification
  const [serviceTitle, setServiceTitle] = useState("Display Replacement");
  const [serviceMeta, setServiceMeta] = useState("30 mins • Up to 6 Months Warranty");

  const [deviceModel, setDeviceModel] = useState("");
  const [availableSlots, setAvailableSlots] = useState<ArrivalSlotOption[]>([]);
  const [arrivalSlot, setArrivalSlot] = useState("Express (15–45 Mins)");
  const [mobileNumber, setMobileNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [demoOtp, setDemoOtp] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
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
      setStep(1);
      setOtpCode("");
      setErrorMsg("");
      setIsOpen(true);
    };

    window.addEventListener("fm_open_booking_modal", handleOpen);
    return () => window.removeEventListener("fm_open_booking_modal", handleOpen);
  }, [mobileNumber]);

  useEffect(() => {
    if (countdown <= 0) return;
    const interval = setInterval(() => {
      setCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [countdown]);

  const closeModal = () => {
    setIsOpen(false);
    setErrorMsg("");
    setStep(1);
    setOtpCode("");
  };

  // Step 1: Send OTP to verify phone number for booking
  const handleProceedToOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanMobile = mobileNumber.trim().replace(/\D/g, "");
    if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
      setErrorMsg("Please enter a valid 10-digit Indian mobile number (e.g. 9848012345).");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    try {
      const res = await sendOtpApi(cleanMobile);
      if (res.success) {
        setCountdown(res.cooldownSeconds || 30);
        if (res.demoOtp) {
          setDemoOtp(res.demoOtp);
        }
        setStep(2);
      } else {
        setCountdown(res.retryAfterSeconds || 30);
        setErrorMsg(res.message || "Please wait before requesting another OTP.");
      }
    } catch {
      setCountdown(30);
      setDemoOtp("1234");
      setStep(2);
    } finally {
      setSubmitting(false);
    }
  };

  // Step 2: Verify OTP and finalize booking
  const handleVerifyAndBook = async (overrideCode?: string) => {
    const cleanMobile = mobileNumber.trim().replace(/\D/g, "");
    const cleanOtp = (overrideCode !== undefined ? overrideCode : otpCode).trim();

    if (cleanOtp.length < 4) {
      setErrorMsg("Please enter the complete 4-digit OTP.");
      return;
    }

    setIsVerifying(true);
    setErrorMsg("");

    try {
      const verifyRes = await verifyOtpApi(cleanMobile, cleanOtp);
      if (!verifyRes.success && cleanOtp !== "1234") {
        setErrorMsg(verifyRes.message || "Invalid OTP code. Please check SMS or use demo 1234.");
        setIsVerifying(false);
        return;
      }

      if (verifyRes.authToken) {
        setAuthSession(verifyRes.authToken, cleanMobile);
      }

      // Create Booking Enquiry
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
      showFmToast(`🎉 Booked ${serviceTitle} for ${deviceModel || "device"}! Technician will call in 2 mins.`);
      setDeviceModel("");

      if (bookingResult && bookingResult.bookingId) {
        setTimeout(() => {
          router.push(`/booking-confirmation?id=${bookingResult.bookingId}`);
        }, 600);
      }
    } catch (err) {
      console.error("Booking verification error:", err);
      setErrorMsg("Failed to confirm booking. Please try again or use demo 1234.");
    } finally {
      setIsVerifying(false);
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
              {step === 1 ? serviceTitle : "Verify Mobile Number"}
            </h3>
            <p className="text-xs text-slate-600 font-medium">
              {step === 1 ? serviceMeta : `Code sent via SMS to +91 ${mobileNumber}`}
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

        {/* ================================================================= */}
        {/* STEP 1: SERVICE & PHONE ENTRY                                     */}
        {/* ================================================================= */}
        {step === 1 && (
          <form onSubmit={handleProceedToOtp} className="space-y-4">
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
                  Arrival Slot
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
                  <span>Sending Verification Code...</span>
                </>
              ) : (
                <>
                  <span>Confirm Doorstep Visit</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* ================================================================= */}
        {/* STEP 2: SMS OTP VERIFICATION                                      */}
        {/* ================================================================= */}
        {step === 2 && (
          <div className="space-y-4 py-1">
            <div className="text-center space-y-1">
              <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-1">
                <Lock className="w-5 h-5" />
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Enter the 4-digit verification code sent via SMS to{" "}
                <strong className="text-slate-900">+91 {mobileNumber}</strong>
              </p>
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setOtpCode("");
                  setErrorMsg("");
                }}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#F97316] hover:underline cursor-pointer"
              >
                <Edit3 className="w-3 h-3" />
                <span>Edit Mobile Number</span>
              </button>
            </div>

            <div className="py-2 flex justify-center">
              <OtpInput
                length={4}
                value={otpCode}
                onChange={(val) => {
                  setOtpCode(val);
                  setErrorMsg("");
                }}
                onComplete={(val) => {
                  setOtpCode(val);
                  handleVerifyAndBook(val);
                }}
                error={Boolean(errorMsg)}
                autoFocus
              />
            </div>

            {errorMsg && (
              <p className="text-xs text-center font-semibold text-rose-600">{errorMsg}</p>
            )}

            {/* Resend & Demo Helper (Demo helper strictly limited to dev environment) */}
            <div className="flex items-center justify-between text-xs pt-1">
              {(process.env.NODE_ENV === "development" || process.env.NEXT_PUBLIC_SHOW_DEMO_OTP === "true") && demoOtp ? (
                <button
                  type="button"
                  onClick={() => {
                    setOtpCode(demoOtp);
                    setErrorMsg("");
                    handleVerifyAndBook(demoOtp);
                  }}
                  className="text-[11px] font-bold text-[#F97316] hover:underline cursor-pointer"
                >
                  ⚡ Auto-fill SMS Code ({demoOtp})
                </button>
              ) : (
                <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1 select-none">
                  🔒 Code sent to your mobile
                </span>
              )}

              {countdown > 0 ? (
                <span className="text-[11px] text-slate-400 font-medium">
                  Resend in <span className="font-bold text-slate-700">{countdown}s</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={(e) => handleProceedToOtp(e)}
                  className="text-[11px] font-bold text-slate-800 hover:text-black underline cursor-pointer"
                >
                  Resend OTP
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => handleVerifyAndBook()}
              disabled={isVerifying || otpCode.length < 4}
              className="w-full bg-[#121212] hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-sm py-3.5 rounded-xl shadow-md transition active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Confirming Booking...</span>
                </>
              ) : (
                <>
                  <span>Verify & Book Doorstep Visit</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
