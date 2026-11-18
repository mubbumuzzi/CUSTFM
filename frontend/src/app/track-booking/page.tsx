"use client";

import React, { useState, useEffect, Suspense, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Search,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Phone,
  Check,
  MapPin,
  RefreshCw,
  AlertCircle,
  Smartphone,
  ArrowRight,
  Package,
  Sparkles,
} from "lucide-react";
import {
  fetchBookingStatus,
  fetchMyBookings,
  approveBookingQuote,
  BookingStatusData,
} from "@/lib/api";
import { showFmToast } from "@/components/ToastBanner";

function TrackBookingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusData, setStatusData] = useState<BookingStatusData | null>(null);
  const [customerBookings, setCustomerBookings] = useState<BookingStatusData[]>([]);
  const [selectedBookingId, setSelectedBookingId] = useState<string>("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [quoteApproving, setQuoteApproving] = useState(false);

  // Load a booking by ID directly without OTP
  const loadBookingById = useCallback(async (bookingId: string) => {
    const cleanId = bookingId.trim().toUpperCase();
    if (!cleanId) return;

    setIsLoading(true);
    setErrorMessage("");

    try {
      const data = await fetchBookingStatus(cleanId);
      if (data && data.bookingId) {
        setStatusData(data);
        setSelectedBookingId(data.bookingId);
        setCustomerBookings([data]);
      } else {
        setErrorMessage(`No booking found matching "${cleanId}". Please check your ID.`);
        setStatusData(null);
      }
    } catch (e) {
      console.error(e);
      setErrorMessage("Unable to retrieve booking. Please try again.");
      setStatusData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load bookings by mobile number directly without OTP
  const loadBookingsByMobile = useCallback(async (mobile: string) => {
    const cleanMobile = mobile.trim().replace(/\D/g, "");
    if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
      setErrorMessage("Please enter a valid 10-digit Indian mobile number.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const bookings = await fetchMyBookings(cleanMobile);
      if (bookings && bookings.length > 0) {
        setCustomerBookings(bookings);
        setSelectedBookingId(bookings[0].bookingId);
        setStatusData(bookings[0]);
      } else {
        setErrorMessage(`No repairs found registered under +91 ${cleanMobile}.`);
        setStatusData(null);
      }
    } catch (e) {
      console.error(e);
      setErrorMessage("Unable to load repairs. Please try again.");
      setStatusData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle direct tracking form submit
  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    // Check if user entered a 10-digit mobile or a booking ID
    const digitsOnly = query.replace(/\D/g, "");
    if (digitsOnly.length === 10 && /^[6-9]\d{9}$/.test(digitsOnly)) {
      loadBookingsByMobile(digitsOnly);
    } else {
      loadBookingById(query);
    }
  };

  // Check URL query parameters or localStorage on mount
  useEffect(() => {
    const idParam = searchParams.get("id");
    const mobileParam = searchParams.get("mobile");

    if (idParam) {
      setSearchQuery(idParam.toUpperCase());
      loadBookingById(idParam);
      return;
    }

    if (mobileParam) {
      setSearchQuery(mobileParam);
      loadBookingsByMobile(mobileParam);
      return;
    }

    // Auto-load latest booking from browser cache if available
    if (typeof window !== "undefined") {
      const latestId = localStorage.getItem("fm_latest_booking_id");
      const latestMobile = localStorage.getItem("fm_latest_mobile");

      if (latestId) {
        setSearchQuery(latestId);
        loadBookingById(latestId);
      } else if (latestMobile) {
        setSearchQuery(latestMobile);
        loadBookingsByMobile(latestMobile);
      }
    }
  }, [searchParams, loadBookingById, loadBookingsByMobile]);

  // Refresh status
  const handleRefresh = async () => {
    if (!selectedBookingId) return;
    setIsLoading(true);
    try {
      const refreshed = await fetchBookingStatus(selectedBookingId);
      if (refreshed) {
        setStatusData(refreshed);
        showFmToast("Status refreshed with live hub updates.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Quote approval
  const handleQuoteApproval = async () => {
    if (!selectedBookingId) return;
    setQuoteApproving(true);
    try {
      const ok = await approveBookingQuote(selectedBookingId);
      if (ok) {
        handleRefresh();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setQuoteApproving(false);
    }
  };

  const getStageHeadline = (stageIdx: number): string => {
    switch (stageIdx) {
      case 0:
        return "Enquiry Received • Preparing Dispatch";
      case 1:
        return "Customer Contacted • Appointment Confirmation";
      case 2:
        return "Appointment Confirmed • Parts in Stock";
      case 3:
        return "Technician Assigned • Preparing Toolkit";
      case 4:
        return "Part Collected from Hub";
      case 5:
        return `Technician On The Way • Arriving in ~${statusData?.etaMinutes || "25 mins"}`;
      case 6:
        return "Technician Arrived at Your Doorstep";
      case 7:
        return "Doorstep Diagnosis in Progress";
      case 8:
        return "Diagnosis Complete • Review Quotation";
      case 9:
        return "Precision Repair in Progress";
      case 10:
        return "Repair Completed & Tested • Warranty Active";
      default:
        return statusData?.statusLabel || "Repair In Progress";
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12 space-y-6">
      {/* Header */}
      <div className="text-center space-y-1.5">
        <div className="inline-flex items-center gap-1.5 bg-orange-50 border border-orange-100 text-[#F97316] text-xs font-bold px-3 py-1 rounded-full">
          <Package className="w-3.5 h-3.5" />
          <span>Direct Live Tracking</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#121212]">
          Track Repair Live
        </h1>
        <p className="text-xs sm:text-sm text-[#767676] max-w-sm mx-auto">
          Enter your Booking ID or registered mobile number to track technician ETA and repair stages in real-time.
        </p>
      </div>

      {/* Direct Search Bar (No OTP gate!) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-lg">
        <form onSubmit={handleTrackSubmit} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                required
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setErrorMessage("");
                }}
                placeholder="e.g. FMO-2026-1955 or 98480 12345"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 font-bold text-sm text-slate-900 focus:outline-none focus:border-[#F97316] focus:bg-white transition uppercase placeholder:normal-case placeholder:font-normal placeholder:text-slate-400"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !searchQuery.trim()}
              className="bg-[#F97316] hover:bg-[#EA580C] disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-md transition active:scale-[0.99] flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Tracking...</span>
                </>
              ) : (
                <>
                  <span>Track Status</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {errorMessage && (
            <p className="text-xs text-rose-600 font-semibold flex items-center gap-1.5 pt-1">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </p>
          )}
        </form>
      </div>

      {/* ================================================================= */}
      {/* LIVE TRACKING TIMELINE DISPLAY                                    */}
      {/* ================================================================= */}
      {statusData && (
        <div className="space-y-5 animate-in fade-in duration-300">
          {/* Multi-Booking Tabs Switcher (if customer has multiple repairs) */}
          {customerBookings.length > 1 && (
            <div className="space-y-1.5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-1">
                Found Repairs ({customerBookings.length})
              </p>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {customerBookings.map((b) => {
                  const isSelected = b.bookingId === selectedBookingId;
                  return (
                    <button
                      key={b.bookingId}
                      type="button"
                      onClick={() => {
                        setSelectedBookingId(b.bookingId);
                        setStatusData(b);
                      }}
                      className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition flex items-center gap-1.5 cursor-pointer border ${
                        isSelected
                          ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                          : "bg-white text-slate-700 border-slate-200 hover:border-slate-400"
                      }`}
                    >
                      <span>{b.brandModel || "Device"}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${isSelected ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-600"}`}>
                        {b.statusLabel}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Doorstep Handshake Code Card */}
          {statusData.currentStageIndex === 10 ? (
            <div className="bg-[#F0FDF4] border border-[#DCFCE7] rounded-2xl p-5 shadow-card flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-[10px] bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <p className="text-sm font-bold text-emerald-950">Repair Completed & Handshake Verified</p>
                <p className="text-xs text-emerald-800">
                  Your security handshake code was confirmed by the technician. Store warranty is active!
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-[#FFF7ED] border border-[#FFEDD5] rounded-2xl p-5 shadow-card flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-bold text-[#F97316] uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-[#F97316]" />
                  <span>Doorstep Handshake Code</span>
                </div>
                <p className="text-xs text-[#9A3412] max-w-sm">
                  Share this 4-digit code with {statusData.technicianName ? <>technician <strong>{statusData.technicianName}</strong></> : "your assigned technician"} only upon repair completion:
                </p>
              </div>

              <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-[12px] border border-[#FDBA74] shadow-xs">
                {(statusData.handshakeOtp || "1443").split("").map((digit, i) => (
                  <span
                    key={i}
                    className="w-8 h-10 flex items-center justify-center font-bold text-2xl text-[#121212] font-mono"
                  >
                    {digit}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Main Status Timeline Card */}
          <div className="bg-white rounded-2xl border border-[#EBEBEB] shadow-card overflow-hidden">
            {/* Header Strip */}
            <div className="bg-[#121212] text-white p-5 sm:p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="bg-[#F97316] text-white text-[10px] sm:text-xs font-bold uppercase px-2.5 py-0.5 rounded-[6px] inline-block mb-1.5">
                    {statusData.statusLabel}
                  </span>
                  <h2 className="text-base sm:text-xl font-bold">
                    {getStageHeadline(statusData.currentStageIndex)}
                  </h2>
                  <p className="text-xs text-[#A0A0A0] mt-1">
                    Booking ID: <strong className="text-white font-mono">{statusData.bookingId}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleRefresh}
                    disabled={isLoading}
                    className="p-2 rounded-[8px] bg-white/10 hover:bg-white/20 text-white text-xs transition cursor-pointer"
                    title="Refresh Live Status"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
                  </button>
                </div>
              </div>

              {/* Transit Route Visualization */}
              <div className="bg-[#1C1C1E] rounded-[12px] p-3 border border-[#2C2C2E]">
                <div className="flex items-center justify-between text-xs text-[#CCCCCC] px-2">
                  <span className="flex items-center gap-1 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-[#F97316]"></span>
                    <span>Shaikpet Hub</span>
                  </span>
                  <span className="text-[11px] text-[#A0A0A0]">
                    {statusData.currentStageIndex >= 6
                      ? "Technician on site"
                      : statusData.currentStageIndex >= 3
                      ? `Dispatched (~${statusData.etaMinutes || "20 mins"})`
                      : "Awaiting dispatch"}
                  </span>
                  <span className="flex items-center gap-1 font-semibold">
                    <span className={`w-2 h-2 rounded-full ${statusData.currentStageIndex >= 6 ? "bg-emerald-400" : "bg-[#555555]"}`}></span>
                    <span>Doorstep</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Technician Info & Quote Section */}
            <div className="p-5 sm:p-6 space-y-5">
              {/* Technician Info */}
              <div className="flex items-center justify-between bg-[#F8F9FA] p-4 rounded-[12px] border border-[#EBEBEB]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[10px] bg-[#121212] text-white font-bold flex items-center justify-center text-xs shrink-0">
                    {statusData.technicianName ? statusData.technicianName.slice(0, 2).toUpperCase() : "FM"}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#121212]">
                      {statusData.technicianName ? `Technician: ${statusData.technicianName}` : "Assigning Certified Technician..."}
                    </h3>
                    <p className="text-xs text-[#767676]">
                      {statusData.technicianName
                        ? `${statusData.brandModel || "Smartphone"} • Certified Hardware Expert`
                        : `${statusData.brandModel || "Smartphone"} • ${statusData.repairCategory}`}
                    </p>
                  </div>
                </div>
                <a
                  href={`tel:${statusData.technicianPhone || "+919063786751"}`}
                  className="bg-white hover:bg-[#EFEFEF] border border-[#EBEBEB] p-2.5 rounded-[10px] shadow-xs transition"
                  title="Call Technician Desk"
                >
                  <Phone className="w-4 h-4 text-[#121212]" />
                </a>
              </div>

              {/* Quote Approval Banner */}
              {statusData.quoteAmount && statusData.quoteAmount > 0 && (
                <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-2xl p-5 space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-[11px] font-bold text-[#92400E] uppercase tracking-wider block">
                        Diagnosis Complete • Quotation
                      </span>
                      <h4 className="text-base font-bold text-[#121212]">
                        {statusData.repairCategory}
                      </h4>
                    </div>
                    <span className="text-xl font-bold text-[#121212]">
                      ₹{Number(statusData.quoteAmount).toLocaleString("en-IN")}
                    </span>
                  </div>

                  <p className="text-xs text-[#767676]">
                    Includes OEM components, precision repair, and store warranty. First home inspection is <strong>₹0 Free</strong>.
                  </p>

                  {statusData.quoteApproved ? (
                    <div className="bg-[#15803D] text-white text-xs font-bold p-3 rounded-[10px] flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Quote Approved (₹{Number(statusData.quoteAmount).toLocaleString("en-IN")}) — Repair in progress!</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleQuoteApproval}
                      disabled={quoteApproving}
                      className="w-full bg-[#15803D] hover:bg-[#16A34A] text-white text-xs sm:text-sm font-bold py-3 px-4 rounded-[10px] shadow-xs transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {quoteApproving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>✓ Approve Quote & Authorize Repair</span>}
                    </button>
                  )}
                </div>
              )}

              {/* 11-Stage Progress Tracker */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#767676]">
                  11-Stage Repair Lifecycle
                </h4>

                <div className="space-y-3">
                  {statusData.stages.map((stg) => {
                    const isDone = stg.completed;
                    const isCurrent = stg.active;

                    return (
                      <div key={stg.index} className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition ${
                            isDone
                              ? "bg-emerald-600 text-white"
                              : isCurrent
                              ? "bg-[#F97316] text-white ring-4 ring-orange-100"
                              : "bg-[#EBEBEB] text-[#767676]"
                          }`}
                        >
                          {isDone ? <Check className="w-3.5 h-3.5" /> : stg.index + 1}
                        </div>

                        <div
                          className={`text-xs sm:text-sm ${
                            isDone
                              ? "font-semibold text-[#121212]"
                              : isCurrent
                              ? "font-bold text-[#F97316]"
                              : "text-[#767676]"
                          }`}
                        >
                          {stg.name}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackBookingPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-[#767676]">Loading tracker...</div>}>
      <TrackBookingContent />
    </Suspense>
  );
}
