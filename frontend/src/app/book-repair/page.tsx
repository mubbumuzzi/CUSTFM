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
  X,
} from "lucide-react";
import { submitBookingEnquiry, setAuthSession } from "@/lib/api";
import { detectGpsLocation, getStoredLocation } from "@/lib/gps";
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

  // Direct 1-Step Booking Submission (OTP paused)
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
      setAuthSession(`FM-SESSION-${cleanMobile}`, cleanMobile);

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

      showFmToast(`🎉 Doorstep repair booked! Technician will call in 2 mins.`);
      router.push(`/booking-confirmation?id=${result.bookingId}`);
    } catch (err) {
      console.error("Booking submission error:", err);
      setErrorMsg("Failed to submit enquiry. Please try again.");
    } finally {
      setSubmitting(false);
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
              Technician Calls to Confirm
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
              <span>Confirming Doorstep Visit...</span>
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
