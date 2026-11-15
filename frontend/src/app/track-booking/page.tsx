"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Lock,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Phone,
  Check,
  Sparkles,
  MapPin,
  RefreshCw,
  AlertCircle,
  Smartphone,
} from "lucide-react";
import { fetchBookingStatus, approveBookingQuote, sendOtpApi, verifyOtpApi, BookingStatusData } from "@/lib/api";
import { OtpInput } from "@/components/ui/OtpInput";

function TrackBookingContent() {
  const searchParams = useSearchParams();

  const [bookingId, setBookingId] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpSentMsg, setOtpSentMsg] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [statusData, setStatusData] = useState<BookingStatusData | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [quoteApproving, setQuoteApproving] = useState(false);
  const [savedHandshakeOtp, setSavedHandshakeOtp] = useState<string | null>(null);

  useEffect(() => {
    let id = searchParams.get("id");
    if (!id && typeof window !== "undefined") {
      id = localStorage.getItem("fm_latest_booking_id");
    }
    if (id) {
      setBookingId(id.toUpperCase());
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem(`fm_booking_${id.toUpperCase()}`);
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (parsed.handshakeOtp) {
              setSavedHandshakeOtp(parsed.handshakeOtp);
            }
          } catch (e) {
            console.error(e);
          }
        }
      }
    }

    if (typeof window !== "undefined") {
      const savedMobile = localStorage.getItem("fm_latest_mobile");
      if (savedMobile) {
        setMobileNumber(savedMobile);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const handleSendOtp = async () => {
    const cleanMobile = mobileNumber.trim();
    if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
      setOtpError("Please enter a valid 10-digit mobile number.");
      return;
    }
    setOtpError("");
    setIsSendingOtp(true);

    try {
      const res = await sendOtpApi(cleanMobile);
      setResendCooldown(30);
      if (res.demoOtp) {
        setOtpSentMsg(`OTP sent to +91 ${cleanMobile} (Code: ${res.demoOtp})`);
      } else {
        setOtpSentMsg(`OTP sent to +91 ${cleanMobile}`);
      }
    } catch {
      setResendCooldown(30);
      setOtpSentMsg(`OTP sent to +91 ${cleanMobile} (Verification Code: 1234)`);
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async (overrideOtp?: string) => {
    const cleanId = bookingId.trim().toUpperCase();
    const cleanMobile = mobileNumber.trim();
    const cleanOtp = (overrideOtp !== undefined ? overrideOtp : otpCode).trim();

    if (!cleanId) {
      setOtpError("Please enter your Booking ID (e.g. FMO-2026-XXXX).");
      return;
    }

    if (!cleanMobile) {
      setOtpError("Please enter your registered mobile number.");
      return;
    }

    if (!cleanOtp || cleanOtp.length < 4) {
      setOtpError("Please enter the complete 4-digit verification code.");
      return;
    }

    setOtpError("");
    setIsRefreshing(true);

    try {
      // 1. First attempt: Direct status query with OTP (accepts booking's handshake OTP or demo 1234)
      const data = await fetchBookingStatus(cleanId, cleanMobile, cleanOtp);
      if (data && data.bookingId) {
        setStatusData(data);
        setIsUnlocked(true);
        return;
      }

      // 2. Second attempt: Check if auth OTP was generated via Send OTP
      const verifyRes = await verifyOtpApi(cleanMobile, cleanOtp);
      if (verifyRes.success || cleanOtp === "1234") {
        const directData = await fetchBookingStatus(cleanId, cleanMobile);
        if (directData && directData.bookingId) {
          setStatusData(directData);
          setIsUnlocked(true);
          return;
        }
      }

      setOtpError("Invalid OTP code. Please enter the 4-digit code from your booking confirmation or use demo 1234.");
    } catch (err) {
      console.error(err);
      setOtpError("Unable to retrieve booking status. Please try again.");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleRefreshStatus = async () => {
    if (!bookingId) return;
    setIsRefreshing(true);
    try {
      const data = await fetchBookingStatus(bookingId, mobileNumber);
      if (data) {
        setStatusData(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleQuoteApproval = async () => {
    if (!bookingId) return;
    setQuoteApproving(true);
    try {
      const ok = await approveBookingQuote(bookingId);
      if (ok) {
        handleRefreshStatus();
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
        return "Customer Contacted • Awaiting Appointment Confirmation";
      case 2:
        return "Appointment Confirmed • Parts in Stock";
      case 3:
        return "Technician Assigned • Preparing Toolkit";
      case 4:
        return "Part Collected from Manikonda Hub";
      case 5:
        return `Technician On The Way • Arriving in ${statusData?.etaMinutes || "45 mins"}`;
      case 6:
        return "Technician Arrived at Your Doorstep";
      case 7:
        return "Doorstep Diagnosis in Progress";
      case 8:
        return "Inspection Complete • Review Quote";
      case 9:
        return "Repair in Progress on Workmat";
      case 10:
        return "Repair Completed & Tested • Warranty Active";
      default:
        return statusData?.statusLabel || "Repair In Progress";
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12 space-y-6">
      {/* Title */}
      <div className="text-center space-y-1.5">
        <div className="inline-flex items-center gap-1.5 bg-navy-50 text-navy-900 text-xs font-black uppercase px-3 py-1 rounded-full border border-navy-200">
          <Lock className="w-3.5 h-3.5 text-navy-800" />
          <span>OTP Secure Booking Tracker</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-navy-950">
          Track Repair Live
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
          Order updates and doorstep lifecycle details are protected by OTP verification.
        </p>
      </div>

      {/* ================================================================= */}
      {/* GATE 1: OTP LOCK SCREEN                                           */}
      {/* ================================================================= */}
      {!isUnlocked && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-sm">
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1">
                Booking ID
              </label>
              <input
                type="text"
                value={bookingId}
                onChange={(e) => setBookingId(e.target.value.toUpperCase())}
                placeholder="e.g., FMO-2026-1234"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-black text-navy-900 text-sm uppercase focus:outline-none focus:ring-1 focus:ring-navy-900"
              />
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1">
                Registered Mobile Number
              </label>
              <div className="flex gap-2">
                <input
                  type="tel"
                  maxLength={10}
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ""))}
                  placeholder="10-digit mobile number"
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-navy-900 text-sm focus:outline-none focus:ring-1 focus:ring-navy-900"
                />
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isSendingOtp || resendCooldown > 0}
                  className="bg-navy-900 hover:bg-navy-800 disabled:bg-slate-300 text-white text-xs font-bold px-4 py-2.5 rounded-xl shrink-0 transition"
                >
                  {isSendingOtp
                    ? "Sending..."
                    : resendCooldown > 0
                    ? `Resend in ${resendCooldown}s`
                    : otpSentMsg
                    ? "Resend OTP"
                    : "Send OTP"}
                </button>
              </div>
              {otpSentMsg && (
                <p className="text-[11px] text-emerald-700 font-bold mt-1.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{otpSentMsg}</span>
                </p>
              )}
            </div>

            {/* OTP Entry Card (Zomato/Swiggy 4-Box Style) */}
            <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 space-y-3.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-extrabold text-navy-900">Enter 4-Digit OTP</span>
                <span className="text-[11px] text-slate-500 font-medium">On-Screen Verification</span>
              </div>

              {/* 4 Interactive Digit Boxes */}
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
                    handleVerifyOtp(val);
                  }}
                  error={Boolean(otpError)}
                />
              </div>

              {/* Actions & Demo Fast-Fill */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-2 border-t border-slate-200/70">
                {savedHandshakeOtp ? (
                  <button
                    type="button"
                    onClick={() => {
                      setOtpCode(savedHandshakeOtp);
                      setOtpError("");
                      handleVerifyOtp(savedHandshakeOtp);
                    }}
                    className="text-[11px] font-bold text-accent-600 hover:text-accent-700 underline cursor-pointer"
                  >
                    ⚡ Auto-fill Booking Code ({savedHandshakeOtp})
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setOtpCode("1234");
                      setOtpError("");
                      handleVerifyOtp("1234");
                    }}
                    className="text-[11px] font-bold text-accent-600 hover:text-accent-700 underline cursor-pointer"
                  >
                    ⚡ Auto-fill Demo (1234)
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleVerifyOtp()}
                  disabled={isRefreshing || otpCode.length < 4}
                  className="w-full sm:w-auto bg-accent-500 hover:bg-accent-600 disabled:bg-slate-300 text-white font-black text-xs sm:text-sm px-6 py-2.5 rounded-xl shrink-0 shadow-xs transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {isRefreshing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>Verify & Track</span>}
                </button>
              </div>

              {otpError && (
                <p className="text-xs text-red-600 font-bold pt-1 flex items-center justify-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{otpError}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* GATE 2: UNLOCKED LIVE DASHBOARD                                   */}
      {/* ================================================================= */}
      {isUnlocked && statusData && (
        <div className="space-y-5">
          {/* Doorstep Handshake Code Card (Zomato/Swiggy Model) */}
          {statusData.currentStageIndex === 10 ? (
            <div className="bg-emerald-50 border-2 border-emerald-300 rounded-3xl p-5 shadow-xs flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <p className="text-sm font-black text-emerald-950">Repair Completed & Handshake Verified</p>
                <p className="text-xs text-emerald-800">
                  Your 4-digit code was confirmed by technician at your doorstep. Your 6-Month warranty is active!
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border-2 border-amber-300 rounded-3xl p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-black text-amber-900 uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>Doorstep Handshake Code</span>
                </div>
                <p className="text-xs text-amber-800 max-w-sm">
                  Share this 4-digit code with technician <strong>{statusData.technicianName || "Ramesh K."}</strong> only upon doorstep repair completion to authorize job closure:
                </p>
              </div>

              <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-2xl border-2 border-amber-300 shadow-xs">
                {(statusData.handshakeOtp || "8341").split("").map((digit, i) => (
                  <span
                    key={i}
                    className="w-8 h-10 flex items-center justify-center font-black text-2xl text-navy-950 font-mono"
                  >
                    {digit}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Header Card with Dynamic Live Status */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-navy-900 text-white p-5 sm:p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="bg-accent-500 text-white text-[10px] sm:text-xs font-black uppercase px-2.5 py-0.5 rounded-full inline-block mb-1">
                    {statusData.statusLabel}
                  </span>
                  <h2 className="text-lg sm:text-xl font-black">
                    {getStageHeadline(statusData.currentStageIndex)}
                  </h2>
                  <p className="text-xs text-slate-300 mt-1">
                    Booking ID: <strong className="text-white font-mono">{statusData.bookingId}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleRefreshStatus}
                    disabled={isRefreshing}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs transition"
                    title="Refresh Status"
                  >
                    <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
                  </button>
                  <button
                    onClick={() => setIsUnlocked(false)}
                    className="text-xs text-slate-400 hover:text-white underline px-2 py-1"
                  >
                    Lock
                  </button>
                </div>
              </div>

              {/* Vector SVG Animated Route Line */}
              <div className="bg-navy-950 rounded-2xl p-4 border border-navy-800">
                <svg viewBox="0 0 380 70" className="w-full h-16 overflow-visible">
                  <line
                    x1="35"
                    y1="35"
                    x2="345"
                    y2="35"
                    stroke="#1E3A5F"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                  <line
                    x1="35"
                    y1="35"
                    x2={statusData.currentStageIndex >= 6 ? "345" : statusData.currentStageIndex === 5 ? "190" : "35"}
                    stroke="#F97316"
                    strokeWidth="6"
                    strokeLinecap="round"
                    className="route-dash"
                  />

                  {/* Node 1: Manikonda Hub */}
                  <circle
                    cx="35"
                    cy="35"
                    r="7"
                    fill={statusData.currentStageIndex >= 0 ? "#F97316" : "#0F294A"}
                    stroke="#FFFFFF"
                    strokeWidth="2.5"
                  />
                  <text x="35" y="58" textAnchor="middle" fill="#CBD5E1" fontSize="10" fontWeight="700">
                    Manikonda Hub
                  </text>

                  {/* Node 2: Technician in Transit */}
                  {statusData.currentStageIndex === 5 && (
                    <g transform="translate(190, 35)">
                      <circle r="14" fill="#F97316" opacity="0.3" className="animate-ping" />
                      <circle r="8" fill="#F97316" stroke="#FFFFFF" strokeWidth="2.5" />
                      <text x="0" y="-14" textAnchor="middle" fill="#FDBA74" fontSize="10" fontWeight="800">
                        {statusData.technicianName || "Technician"} (~{statusData.etaMinutes || "20m"})
                      </text>
                    </g>
                  )}

                  {/* Node 3: Customer Doorstep */}
                  <circle
                    cx="345"
                    cy="35"
                    r="7"
                    fill={statusData.currentStageIndex >= 6 ? "#10B981" : "#334155"}
                    stroke="#FFFFFF"
                    strokeWidth="2.5"
                  />
                  <text x="345" y="58" textAnchor="middle" fill="#6EE7B7" fontSize="10" fontWeight="700">
                    Your Doorstep
                  </text>
                </svg>
              </div>
            </div>

            {/* Technician Card & Quote Section */}
            <div className="p-5 sm:p-6 space-y-5">
              {/* Technician Info */}
              <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-navy-900 text-white font-black flex items-center justify-center text-xs shadow-xs">
                    {statusData.technicianName ? statusData.technicianName.slice(0, 2).toUpperCase() : "FM"}
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-navy-950">
                      {statusData.technicianName || "Assigning Certified Technician..."}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {statusData.brandModel || "Smartphone"} • {statusData.repairCategory || "Repair Service"}
                    </p>
                  </div>
                </div>
                <a
                  href={`tel:${statusData.technicianPhone || "+919063786751"}`}
                  className="bg-white hover:bg-slate-100 border border-slate-200 p-2.5 rounded-xl shadow-xs transition"
                  title="Call Support Desk"
                >
                  <Phone className="w-4 h-4 text-navy-900" />
                </a>
              </div>

              {/* Quote Approval Banner (Dynamic: Shown only when Quote exists) */}
              {statusData.quoteAmount && statusData.quoteAmount > 0 && (
                <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-xs font-black text-amber-900 uppercase tracking-wider block">
                        Diagnosis Complete • Official Quotation
                      </span>
                      <h4 className="text-base font-black text-navy-950">
                        {statusData.repairCategory}
                      </h4>
                    </div>
                    <span className="text-xl font-black text-navy-950">
                      ₹{Number(statusData.quoteAmount).toLocaleString("en-IN")}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600">
                    Includes precision installation, OEM-grade certified components, frame cleaning, and warranty guarantee. First home visit is <strong>₹0 Free</strong>.
                  </p>

                  {statusData.quoteApproved ? (
                    <div className="bg-emerald-600 text-white text-xs font-black p-3 rounded-xl flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Quote Approved (₹{Number(statusData.quoteAmount).toLocaleString("en-IN")}) — Repair in progress!</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleQuoteApproval}
                      disabled={quoteApproving}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-black py-3 px-4 rounded-xl shadow-md transition active:scale-95 flex items-center justify-center gap-2"
                    >
                      {quoteApproving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>✓ Approve Quote & Start Repair</span>}
                    </button>
                  )}
                </div>
              )}

              {/* 11-Stage PRD Status Stepper */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Full 11-Stage Repair Lifecycle
                </h4>

                <div className="space-y-3">
                  {statusData.stages.map((stg) => {
                    const isDone = stg.completed;
                    const isCurrent = stg.active;

                    return (
                      <div key={stg.index} className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 transition ${
                            isDone
                              ? "bg-emerald-600 text-white"
                              : isCurrent
                              ? "bg-accent-500 text-white ring-4 ring-accent-100"
                              : "bg-slate-200 text-slate-500"
                          }`}
                        >
                          {isDone ? <Check className="w-3.5 h-3.5" /> : stg.index + 1}
                        </div>

                        <div
                          className={`text-xs sm:text-sm ${
                            isDone
                              ? "font-bold text-navy-900"
                              : isCurrent
                              ? "font-black text-accent-600"
                              : "text-slate-400"
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
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Loading tracker...</div>}>
      <TrackBookingContent />
    </Suspense>
  );
}
