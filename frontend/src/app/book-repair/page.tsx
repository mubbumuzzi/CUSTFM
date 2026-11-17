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
} from "lucide-react";
import { submitBookingEnquiry } from "@/lib/api";
import { detectGpsLocation, getStoredLocation, getEtaForDistance } from "@/lib/gps";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanMobile = mobileNumber.trim();

    if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
      setErrorMsg("Please enter a valid 10-digit Indian mobile number (e.g., 9876543210).");
      return;
    }
    setErrorMsg("");
    setSubmitting(true);

    try {
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

      router.push(`/booking-confirmation?id=${result.bookingId}`);
    } catch (err) {
      console.error("Booking error:", err);
      setErrorMsg("Failed to submit enquiry. Please try again or call +91 90637 86751 directly.");
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12 space-y-6">
      {/* Header */}
      <div className="text-center space-y-1.5">
        <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 text-[11px] font-bold px-3 py-1 rounded-full border border-emerald-200">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Frictionless Booking • No Account or Passwords Required</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#121212]">
          Book Doorstep Mobile Repair
        </h1>
        <p className="text-xs sm:text-sm text-[#767676] max-w-md mx-auto">
          Only your 10-digit mobile number is mandatory. Our technician reaches your doorstep in {preferredTime.includes("~") ? preferredTime.split("~")[1].replace(")", "") : "15-45 minutes"}.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Mandatory Mobile Number Card */}
        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-5 sm:p-6 shadow-card space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[#121212] uppercase tracking-wider">
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <span className="text-[10px] font-bold bg-[#F97316] text-white px-2 py-0.5 rounded-[6px]">
              Required
            </span>
          </div>

          <div className="flex items-center">
            <span className="px-3.5 py-2.5 rounded-l-[10px] border border-r-0 border-[#EBEBEB] bg-[#F7F7F8] text-[#121212] font-bold text-sm">
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
              placeholder="Enter 10-digit mobile number"
              className="w-full px-3.5 py-2.5 rounded-r-[10px] border border-[#EBEBEB] text-[#121212] font-semibold text-sm sm:text-base focus:outline-none focus:border-[#121212] focus:ring-1 focus:ring-[#121212]"
            />
          </div>

          {errorMsg && (
            <div className="flex items-center gap-1.5 text-xs text-red-600 font-semibold pt-1">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <p className="text-[11px] text-[#767676]">
            Our technician will call this number before arrival to confirm parts and dispatch.
          </p>
        </div>

        {/* Optional Repair Details Card */}
        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-5 sm:p-6 shadow-card space-y-4">
          <div className="border-b border-[#EBEBEB] pb-2.5 flex items-center justify-between">
            <span className="text-xs font-bold text-[#767676] uppercase tracking-wider">
              Optional Details (Saves Time)
            </span>
            <span className="text-[11px] text-[#767676]">Can confirm on call</span>
          </div>

          {/* Customer Name */}
          <div>
            <label className="block text-xs font-semibold text-[#121212] mb-1">
              Your Name
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. Mohammed"
              className="w-full px-3.5 py-2.5 rounded-[10px] border border-[#EBEBEB] text-xs sm:text-sm font-medium focus:outline-none focus:border-[#121212]"
            />
          </div>

          {/* Device Brand & Model */}
          <div>
            <label className="block text-xs font-semibold text-[#121212] mb-1">
              Device Brand & Model
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {quickBrands.map((brand) => (
                <button
                  key={brand}
                  type="button"
                  onClick={() => setBrandModel(brand)}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-[8px] border transition cursor-pointer ${
                    brandModel.startsWith(brand)
                      ? "bg-[#121212] text-white border-[#121212]"
                      : "bg-[#F7F7F8] hover:bg-[#EFEFEF] text-[#555555] border-[#EBEBEB]"
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={brandModel}
              onChange={(e) => setBrandModel(e.target.value)}
              placeholder="e.g., iPhone 14 Pro, Samsung Galaxy S23"
              className="w-full px-3.5 py-2.5 rounded-[10px] border border-[#EBEBEB] text-xs sm:text-sm font-medium focus:outline-none focus:border-[#121212]"
            />
          </div>

          {/* Repair Category */}
          <div>
            <label className="block text-xs font-semibold text-[#121212] mb-1">
              Issue / Repair Category
            </label>
            <select
              value={repairCategory}
              onChange={(e) => setRepairCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-[10px] border border-[#EBEBEB] text-xs sm:text-sm font-medium bg-white focus:outline-none focus:border-[#121212]"
            >
              <option value="Display Replacement">📱 Screen & OLED Replacement (Glass, Touch, Lines)</option>
              <option value="Battery Replacement">🔋 Battery Replacement (Fast Drain, Swelling)</option>
              <option value="Charging Port Repair">⚡ Charging Port & Jack Repair</option>
              <option value="Software Repair">💻 Software OS Recovery & Boot Loop</option>
              <option value="Hardware Repair">🔧 Hardware Repair (Speaker, Mic, Camera)</option>
              <option value="Water Damage Diagnosis">💧 Water Damage Diagnosis (Workshop Lab)</option>
            </select>
          </div>

          {/* Doorstep Address */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-[#121212]">
                Doorstep Address (within 6 km)
              </label>
              <button
                type="button"
                onClick={handleUseGpsAddress}
                disabled={detectingGps}
                className="text-[11px] font-bold text-[#F97316] hover:text-[#EA580C] flex items-center gap-1 transition cursor-pointer"
              >
                {detectingGps ? (
                  <RefreshCw className="w-3 h-3 animate-spin" />
                ) : (
                  <Navigation className="w-3 h-3" />
                )}
                <span>{detectingGps ? "Locating..." : "Auto-Fill GPS"}</span>
              </button>
            </div>
            <div className="relative">
              <input
                type="text"
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  setGpsCoords({ latitude: undefined, longitude: undefined });
                }}
                placeholder="e.g., Flat 402, Lanco Hills Tower 8, Manikonda"
                className="w-full px-3.5 py-2.5 rounded-[10px] border border-[#EBEBEB] text-xs sm:text-sm font-medium focus:outline-none focus:border-[#121212]"
              />
              <MapPin className="w-4 h-4 text-[#767676] absolute right-3 top-3" />
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
          <span>{submitting ? "Submitting Booking..." : "Book Doorstep Repair"}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <p className="text-[11px] text-center text-[#767676]">
          No binding commitment. Our team calls to confirm parts and exact pricing before technician dispatch.
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
