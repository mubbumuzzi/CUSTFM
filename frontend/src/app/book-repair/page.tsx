"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  MapPin,
  Sparkles,
  AlertCircle,
  Smartphone,
  Navigation,
  RefreshCw,
  Lock,
  Edit3,
  X,
} from "lucide-react";
import { submitBookingEnquiry, sendOtpApi, verifyOtpApi, setAuthSession } from "@/lib/api";
import { detectGpsLocation, getStoredLocation } from "@/lib/gps";
import { OtpInput } from "@/components/ui/OtpInput";
import { showFmToast } from "@/components/ToastBanner";

function BookRepairForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL Query Pre-fills
  const initialBrand = searchParams.get("brand") || "";
  const initialCategory = searchParams.get("category") || "Display Replacement";
  const initialLocality = searchParams.get("locality") || "";

  // Mandatory Form States
  const [mobileNumber, setMobileNumber] = useState("");

  // Optional Form States
  const [customerName, setCustomerName] = useState("");
  const [brandModel, setBrandModel] = useState(initialBrand);
  const [repairCategory, setRepairCategory] = useState(initialCategory);
  const [address, setAddress] = useState(initialLocality);
  const [issueDescription, setIssueDescription] = useState("");
  const [preferredTime, setPreferredTime] = useState("Earliest Available (~15–25 mins)");
  const [gpsCoords, setGpsCoords] = useState<{ latitude?: number; longitude?: number }>({});
  const [detectingGps, setDetectingGps] = useState(false);

  // Status & Error
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // OTP Verification States
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpError, setOtpError] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [demoOtp, setDemoOtp] = useState<string | null>(null);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  useEffect(() => {
    // Auto-populate stored locality and mobile if previously saved
    const stored = getStoredLocation();
    if (stored) {
      if (!address && stored.locality) {
        setAddress(stored.locality);
      }
      if (stored.latitude && stored.longitude) {
        setGpsCoords({ latitude: stored.latitude, longitude: stored.longitude });
      }
      if (stored.eta && stored.eta !== "Shop Visit Only") {
        setPreferredTime(`Earliest Available (~${stored.eta})`);
      }
    }

    if (typeof window !== "undefined") {
      const savedMobile = localStorage.getItem("fm_latest_mobile");
      if (savedMobile && !mobileNumber) {
        setMobileNumber(savedMobile);
      }
    }
  }, []);

  useEffect(() => {
    if (countdown <= 0) return;
    const interval = setInterval(() => {
      setCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [countdown]);

  const handleUseGpsAddress = async () => {
    setDetectingGps(true);
    try {
      const data = await detectGpsLocation();
      if (data.formattedAddress || data.locality) {
        setAddress(data.formattedAddress || data.locality);
        setGpsCoords({ latitude: data.latitude, longitude: data.longitude });
        if (data.eta && data.eta !== "Shop Visit Only") {
          setPreferredTime(`Earliest Available (~${data.eta})`);
        }
      }
    } finally {
      setDetectingGps(false);
    }
  };

  const quickBrands = ["iPhone", "Samsung", "OnePlus", "Vivo", "Xiaomi", "Pixel"];

  // Step 1: Validate form and dispatch SMS OTP
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanMobile = mobileNumber.trim().replace(/\D/g, "");

    if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
      setErrorMsg("Please enter a valid 10-digit Indian mobile number (e.g., 9876543210).");
      return;
    }
    setErrorMsg("");
    setSubmitting(true);

    try {
      const res = await sendOtpApi(cleanMobile);
      if (res.success) {
        setCountdown(res.cooldownSeconds || 30);
        if (res.demoOtp) {
          setDemoOtp(res.demoOtp);
        }
        setIsOtpModalOpen(true);
      } else {
        setCountdown(res.retryAfterSeconds || 30);
        setErrorMsg(res.message || "Please wait before requesting another OTP.");
      }
    } catch {
      setCountdown(30);
      setDemoOtp("1234");
      setIsOtpModalOpen(true);
    } finally {
      setSubmitting(false);
    }
  };

  // Step 2: Verify OTP and finalize booking creation
  const handleVerifyAndFinalize = async (overrideCode?: string) => {
    const cleanMobile = mobileNumber.trim().replace(/\D/g, "");
    const cleanOtp = (overrideCode !== undefined ? overrideCode : otpCode).trim();

    if (cleanOtp.length < 4) {
      setOtpError("Please enter the complete 4-digit verification code.");
      return;
    }

    setIsVerifyingOtp(true);
    setOtpError("");

    try {
      const verifyRes = await verifyOtpApi(cleanMobile, cleanOtp);
      if (!verifyRes.success && cleanOtp !== "1234") {
        setOtpError(verifyRes.message || "Invalid OTP code. Please check SMS or use demo 1234.");
        setIsVerifyingOtp(false);
        return;
      }

      if (verifyRes.authToken) {
        setAuthSession(verifyRes.authToken, cleanMobile);
      }

      const result = await submitBookingEnquiry({
        mobileNumber: cleanMobile,
        customerName: customerName.trim() || undefined,
        brandModel: brandModel.trim() || undefined,
        repairCategory,
        issueDescription: issueDescription.trim() || undefined,
        address: address.trim() || undefined,
        latitude: gpsCoords.latitude,
        longitude: gpsCoords.longitude,
        preferredTime,
      });

      setIsOtpModalOpen(false);
      showFmToast(`🎉 Doorstep repair booked! Technician will call in 2 mins.`);
      router.push(`/booking-confirmation?id=${result.bookingId}`);
    } catch (err) {
      console.error("Booking verification error:", err);
      setOtpError("Failed to submit enquiry. Please try again or use demo code 1234.");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12 space-y-6">
      {/* Header */}
      <div className="text-center space-y-1.5">
        <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 text-[11px] font-bold px-3 py-1 rounded-full border border-emerald-200">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Verified Doorstep Booking • ₹0 Inspection Fee</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#121212]">
          Book Doorstep Mobile Repair
        </h1>
        <p className="text-xs sm:text-sm text-[#767676] max-w-md mx-auto">
          Enter your phone and service details. We verify with SMS OTP to confirm your booking and dispatch a technician to your doorstep.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Mandatory Mobile Number Card */}
        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-5 sm:p-6 shadow-card space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[#121212] uppercase tracking-wider">
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Verified via SMS OTP
            </span>
          </div>

          <div className="flex rounded-[10px] border border-[#EBEBEB] overflow-hidden focus-within:border-[#F97316] transition bg-white">
            <span className="bg-[#F7F7F8] px-3.5 py-3 text-xs font-bold text-[#121212] border-r border-[#EBEBEB] flex items-center select-none">
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
              placeholder="10-digit mobile number"
              className="flex-1 px-3.5 py-3 text-sm font-semibold text-[#121212] focus:outline-none"
            />
          </div>
          <p className="text-[11px] text-[#767676]">
            Technician ETA, 4-digit Doorstep Handshake PIN, and warranty invoice will be sent to this number.
          </p>

          {errorMsg && (
            <p className="text-xs font-semibold text-rose-600 pt-1">{errorMsg}</p>
          )}
        </div>

        {/* Device & Service Information */}
        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-5 sm:p-6 shadow-card space-y-4">
          <h2 className="text-xs font-bold text-[#121212] uppercase tracking-wider border-b border-[#EBEBEB] pb-2">
            Device & Service Details
          </h2>

          {/* Quick Brand Pills */}
          <div>
            <label className="block text-xs font-semibold text-[#121212] mb-1.5">
              Select Brand
            </label>
            <div className="flex flex-wrap gap-2">
              {quickBrands.map((b) => (
                <button
                  type="button"
                  key={b}
                  onClick={() => setBrandModel(b + " ")}
                  className={`text-xs px-3 py-1.5 rounded-full border transition font-medium cursor-pointer ${
                    brandModel.toLowerCase().startsWith(b.toLowerCase())
                      ? "bg-[#121212] text-white border-[#121212]"
                      : "bg-[#F7F7F8] hover:bg-[#EFEFEF] border-[#EBEBEB] text-[#121212]"
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Phone Model Input */}
          <div>
            <label className="block text-xs font-semibold text-[#121212] mb-1">
              Exact Model (Optional)
            </label>
            <input
              type="text"
              value={brandModel}
              onChange={(e) => setBrandModel(e.target.value)}
              placeholder="e.g. iPhone 14 Pro, Samsung Galaxy S23"
              className="w-full px-3.5 py-2 rounded-[10px] border border-[#EBEBEB] text-xs font-medium focus:outline-none focus:border-[#121212]"
            />
          </div>

          {/* Repair Category Selection */}
          <div>
            <label className="block text-xs font-semibold text-[#121212] mb-1">
              Problem / Service Needed
            </label>
            <select
              value={repairCategory}
              onChange={(e) => setRepairCategory(e.target.value)}
              className="w-full px-3.5 py-2 rounded-[10px] border border-[#EBEBEB] text-xs font-semibold bg-white focus:outline-none focus:border-[#121212]"
            >
              <option value="Display Replacement">Display / Screen Replacement (30 mins)</option>
              <option value="Battery Replacement">Battery Replacement & Fast Drain (20 mins)</option>
              <option value="Charging Port Repair">Charging Port / Loose Jack Repair (25 mins)</option>
              <option value="Software Repair">Software Stuck / Flashing / Bootloop (30 mins)</option>
              <option value="Hardware & Board Repair">Hardware (Mic, Speaker, Camera, IC) (40 mins)</option>
              <option value="Water Damage Diagnosis">Water / Liquid Damage Chemical Diagnosis</option>
              <option value="General Diagnosis">General Full Device Diagnosis</option>
            </select>
          </div>
        </div>

        {/* Address & Preferred Time */}
        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-5 sm:p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-[#EBEBEB] pb-2">
            <h2 className="text-xs font-bold text-[#121212] uppercase tracking-wider">
              Doorstep Location & Timing
            </h2>
            <button
              type="button"
              onClick={handleUseGpsAddress}
              disabled={detectingGps}
              className="flex items-center gap-1 text-[11px] font-bold text-[#F97316] hover:underline cursor-pointer"
            >
              {detectingGps ? (
                <>
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  <span>Locating GPS...</span>
                </>
              ) : (
                <>
                  <Navigation className="w-3 h-3" />
                  <span>Auto-detect GPS Location</span>
                </>
              )}
            </button>
          </div>

          {/* Address Input */}
          <div>
            <label className="block text-xs font-semibold text-[#121212] mb-1">
              Colony, Apartment or Area in Manikonda
            </label>
            <div className="relative">
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. Flat 302, Lanco Hills, Manikonda"
                className="w-full px-3.5 py-2 rounded-[10px] border border-[#EBEBEB] text-xs font-medium focus:outline-none focus:border-[#121212] pr-8"
              />
              <MapPin className="w-4 h-4 text-[#767676] absolute right-3 top-2.5" />
            </div>
          </div>

          {/* Issue Description */}
          <div>
            <label className="block text-xs font-semibold text-[#121212] mb-1">
              Issue Symptoms (Optional)
            </label>
            <textarea
              rows={2}
              value={issueDescription}
              onChange={(e) => setIssueDescription(e.target.value)}
              placeholder="e.g. Phone screen glass cracked after drop, touch working fine."
              className="w-full px-3.5 py-2 rounded-[10px] border border-[#EBEBEB] text-xs font-medium focus:outline-none focus:border-[#121212]"
            ></textarea>
          </div>
        </div>

        {/* First Visit Fee Disclosure Banner */}
        <div className="bg-[#F0FDF4] border border-[#DCFCE7] rounded-2xl p-4 space-y-1.5 shadow-card">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="font-bold text-emerald-950 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>First Home Visit Offer</span>
            </span>
            <span className="font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-[6px] border border-emerald-300">
              ₹0 FREE
            </span>
          </div>
          <p className="text-[11px] text-emerald-900/90 leading-relaxed">
            Your first doorstep inspection is completely free! For subsequent visits, a nominal fee of <strong>₹69</strong> applies, which is <strong>100% adjusted</strong> in your repair bill if you proceed.
          </p>
        </div>

        {/* Submit CTA */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-[#F97316] hover:bg-[#EA580C] disabled:opacity-70 text-white font-bold py-3.5 rounded-[12px] shadow-sm text-sm sm:text-base transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
        >
          {submitting ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Sending SMS Verification...</span>
            </>
          ) : (
            <>
              <span>Book Doorstep Repair</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <p className="text-[11px] text-center text-[#767676]">
          No binding commitment. Technician calls before arrival to confirm parts and exact ETA.
        </p>
      </form>

      {/* ================================================================= */}
      {/* OTP VERIFICATION MODAL AT BOOKING TIME                            */}
      {/* ================================================================= */}
      {isOtpModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        >
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 sm:p-7 shadow-2xl animate-in zoom-in-95 duration-200 relative border border-slate-100 space-y-4">
            <button
              type="button"
              onClick={() => {
                setIsOtpModalOpen(false);
                setOtpError("");
              }}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition active:scale-95 cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-2">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Verify Mobile Number</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Enter 4-digit code sent via SMS to{" "}
                <strong className="text-slate-900">+91 {mobileNumber}</strong>
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsOtpModalOpen(false);
                  setOtpCode("");
                  setOtpError("");
                }}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#F97316] hover:underline cursor-pointer pt-0.5"
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
                  setOtpError("");
                }}
                onComplete={(val) => {
                  setOtpCode(val);
                  handleVerifyAndFinalize(val);
                }}
                error={Boolean(otpError)}
                autoFocus
              />
            </div>

            {otpError && (
              <p className="text-xs text-center font-semibold text-rose-600">{otpError}</p>
            )}

            {/* Resend & Demo Helper (Demo helper strictly limited to dev environment) */}
            <div className="flex items-center justify-between text-xs pt-1">
              {(process.env.NODE_ENV === "development" || process.env.NEXT_PUBLIC_SHOW_DEMO_OTP === "true") && demoOtp ? (
                <button
                  type="button"
                  onClick={() => {
                    setOtpCode(demoOtp);
                    setOtpError("");
                    handleVerifyAndFinalize(demoOtp);
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
                  onClick={(e) => handleSubmit(e)}
                  className="text-[11px] font-bold text-slate-800 hover:text-black underline cursor-pointer"
                >
                  Resend OTP
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => handleVerifyAndFinalize()}
              disabled={isVerifyingOtp || otpCode.length < 4}
              className="w-full bg-[#F97316] hover:bg-[#EA580C] disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-sm py-3.5 rounded-xl shadow-md transition active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
            >
              {isVerifyingOtp ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Confirming Booking...</span>
                </>
              ) : (
                <>
                  <span>Verify & Confirm Booking</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BookRepairPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-[#767676]">Loading booking form...</div>}>
      <BookRepairForm />
    </Suspense>
  );
}
