"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, ShieldCheck, MapPin, Sparkles, AlertCircle, Navigation, RefreshCw } from "lucide-react";
import { submitBookingEnquiry } from "@/lib/api";
import { detectGpsLocation } from "@/lib/gps";

function BookRepairForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [mobileNumber, setMobileNumber] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [brandModel, setBrandModel] = useState("");
  const [repairCategory, setRepairCategory] = useState("Display Replacement");
  const [issueDescription, setIssueDescription] = useState("");
  const [address, setAddress] = useState("");
  const [preferredTime, setPreferredTime] = useState("Earliest Available (~45 mins)");
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [detectingGps, setDetectingGps] = useState(false);
  const [gpsCoords, setGpsCoords] = useState<{ latitude?: number; longitude?: number }>({});

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) {
      setRepairCategory(cat);
    }

    if (typeof window !== "undefined") {
      const savedLat = localStorage.getItem("fm_user_lat");
      const savedLng = localStorage.getItem("fm_user_lng");
      if (savedLat && savedLng) {
        const lat = parseFloat(savedLat);
        const lng = parseFloat(savedLng);
        if (!isNaN(lat) && !isNaN(lng)) {
          setGpsCoords({ latitude: lat, longitude: lng });
        }
      }
    }
  }, [searchParams]);

  const handleUseGpsAddress = async () => {
    setDetectingGps(true);
    try {
      const data = await detectGpsLocation();
      setAddress(data.locality);
      if (data.latitude && data.longitude) {
        setGpsCoords({ latitude: data.latitude, longitude: data.longitude });
      }
    } catch {
      if (typeof window !== "undefined") {
        const savedLoc = localStorage.getItem("fm_user_locality");
        if (savedLoc) {
          setAddress(savedLoc);
        }
      }
    } finally {
      setDetectingGps(false);
    }
  };

  const quickBrands = ["iPhone ", "Samsung ", "OnePlus ", "Vivo ", "Xiaomi ", "Pixel "];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanMobile = mobileNumber.trim();

    // PRD Validation: Mandatory 10-digit Indian phone number
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

      // Redirect to Booking Confirmation screen with booking ID
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
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 text-xs font-black uppercase px-3 py-1 rounded-full border border-emerald-200">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Frictionless Booking • No OTP or Registration Needed</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-navy-950 tracking-tight">
          Book Doorstep Mobile Repair
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
          Only your 10-digit mobile number is mandatory. Our technician reaches your home within 45 minutes.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* MANDATORY CARD: MOBILE NUMBER */}
        <div className="bg-white rounded-2xl border-2 border-navy-900/25 p-5 shadow-sm space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black text-navy-900 uppercase tracking-wider">
              Mobile Number <span className="text-red-600">*</span>
            </label>
            <span className="text-[10px] font-extrabold bg-accent-500 text-white px-2 py-0.5 rounded shadow-xs">
              Required
            </span>
          </div>

          <div className="flex items-center">
            <span className="px-3.5 py-3 rounded-l-xl border border-r-0 border-slate-300 bg-slate-100 text-navy-900 font-extrabold text-sm">
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
              className="w-full px-3.5 py-3 rounded-r-xl border border-slate-300 text-navy-950 font-bold text-base focus:outline-none focus:ring-2 focus:ring-accent-500"
            />
          </div>

          {errorMsg && (
            <div className="flex items-center gap-1.5 text-xs text-red-600 font-bold pt-1">
              <AlertCircle className="w-4 h-4" />
              <span>{errorMsg}</span>
            </div>
          )}

          <p className="text-[11px] text-slate-500">
            Our technician will call this number before arrival to verify parts availability.
          </p>
        </div>

        {/* OPTIONAL DETAILS CARD */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider">
              Optional Details (Saves Time)
            </span>
            <span className="text-[10px] text-slate-400">Can be confirmed on call</span>
          </div>

          {/* Customer Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Customer Name
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g., Mohammed"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium focus:outline-none focus:ring-1 focus:ring-navy-900"
            />
          </div>

          {/* Brand & Model */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Device Brand & Model
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {quickBrands.map((brand) => (
                <button
                  key={brand}
                  type="button"
                  onClick={() => setBrandModel(brand)}
                  className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-navy-900 transition"
                >
                  {brand.trim()}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={brandModel}
              onChange={(e) => setBrandModel(e.target.value)}
              placeholder="e.g., iPhone 14 Pro, Samsung Galaxy S23"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium focus:outline-none focus:ring-1 focus:ring-navy-900"
            />
          </div>

          {/* Repair Category */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Repair Category
            </label>
            <select
              value={repairCategory}
              onChange={(e) => setRepairCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold bg-white focus:outline-none focus:ring-1 focus:ring-navy-900"
            >
              <option value="Display Replacement">📱 Display Replacement (Glass, Touch, Lines)</option>
              <option value="Battery Replacement">🔋 Battery Replacement (Fast Drain, Swelling)</option>
              <option value="Charging Port Repair">⚡ Charging Port Repair (Loose Pin, Slow Charge)</option>
              <option value="Software Repair">💻 Software Repair (Boot Loop, OS Flash)</option>
              <option value="Hardware Repair">🔧 Hardware Repair (Speaker, Mic, Camera)</option>
              <option value="Water Damage Diagnosis">💧 Water Damage Diagnosis (Lab Pickup)</option>
            </select>
          </div>

          {/* Doorstep Address */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700">
                Doorstep Address in Manikonda (within 5 km)
              </label>
              <button
                type="button"
                onClick={handleUseGpsAddress}
                disabled={detectingGps}
                className="text-[11px] font-extrabold text-accent-600 hover:text-accent-700 flex items-center gap-1 transition"
              >
                {detectingGps ? (
                  <RefreshCw className="w-3 h-3 animate-spin" />
                ) : (
                  <Navigation className="w-3 h-3" />
                )}
                <span>{detectingGps ? "Locating..." : "Use GPS"}</span>
              </button>
            </div>
            <div className="relative">
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g., Flat 402, Lanco Hills Tower 8, Manikonda"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium focus:outline-none focus:ring-1 focus:ring-navy-900"
              />
              <MapPin className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
            </div>
          </div>

          {/* Issue Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Issue Symptoms (Optional)
            </label>
            <textarea
              rows={2}
              value={issueDescription}
              onChange={(e) => setIssueDescription(e.target.value)}
              placeholder="e.g., Phone screen glass cracked after drop, touch working fine."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-navy-900"
            ></textarea>
          </div>
        </div>

        {/* PRD VISIT FEE DISCLOSURE CARD */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-1.5 shadow-xs">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="font-black text-emerald-950 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>First Home Visit Offer</span>
            </span>
            <span className="font-black text-emerald-700 bg-white px-2 py-0.5 rounded-md border border-emerald-300">
              ₹0 FREE
            </span>
          </div>
          <p className="text-[11px] text-emerald-900/90 leading-relaxed">
            Your first doorstep visit is completely free! For subsequent visits, a fee of <strong>₹49</strong> applies, which is <strong>100% adjusted</strong> against your final repair bill if the repair proceeds.
          </p>
        </div>

        {/* Submit CTA */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-accent-500 hover:bg-accent-600 disabled:opacity-70 text-white font-black py-4 rounded-2xl shadow-lg text-sm sm:text-base transition active:scale-95 flex items-center justify-center gap-2"
        >
          <span>{submitting ? "Logging Enquiry..." : "Submit Repair Enquiry"}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <p className="text-[11px] text-center text-slate-500">
          Submitting an enquiry is not a binding commitment. Admin verifies parts availability with you before dispatch.
        </p>
      </form>
    </div>
  );
}

export default function BookRepairPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Loading booking form...</div>}>
      <BookRepairForm />
    </Suspense>
  );
}
