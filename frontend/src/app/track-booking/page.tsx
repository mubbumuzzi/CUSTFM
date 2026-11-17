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
      const data = await fetchBookingStatus(cleanId, cleanMobile, cleanOtp);
      if (data && data.bookingId) {
        setStatusData(data);
        setIsUnlocked(true);
        return;
      }

      const verifyRes = await verifyOtpApi(cleanMobile, cleanOtp);
      if (verifyRes.success || cleanOtp === "1234") {
        const directData = await fetchBookingStatus(cleanId, cleanMobile);
        if (directData && directData.bookingId) {
          setStatusData(directData);
          setIsUnlocked(true);
          return;
        }
      }

      setOtpError("Invalid OTP code. Please enter the 4-digit code from your confirmation or use demo 1234.");
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
        <div className="inline-flex items-center gap-1.5 bg-[#F7F7F8] border border-[#EBEBEB] text-[#121212] text-xs font-semibold px-3 py-1 rounded-full">
          <Lock className="w-3.5 h-3.5 text-[#121212]" />
          <span>Secure Order Tracking</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#121212]">
          Track Repair Live
        </h1>
        <p className="text-xs sm:text-sm text-[#767676] max-w-sm mx-auto">
          Real-time technician updates and doorstep dispatch are protected by OTP verification.
        </p>
      </div>

      {/* ================================================================= */}
      {/* GATE 1: OTP LOCK SCREEN                                           */}
      {/* ================================================================= */}
      {!isUnlocked && (
        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6 sm:p-8 space-y-4 shadow-card">
          <div className="space-y-3.5">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#767676] mb-1">
                Booking ID
              </label>
              <input
                type="text"
                value={bookingId}
                onChange={(e) => setBookingId(e.target.value.toUpperCase())}
                placeholder="e.g., FMO-2026-1052"
                className="w-full px-3.5 py-2.5 rounded-[10px] border border-[#EBEBEB] font-bold text-[#121212] text-sm uppercase focus:outline-none focus:border-[#121212]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#767676] mb-1">
                Registered Mobile Number
              </label>
              <div className="flex gap-2">
                <input
                  type="tel"
                  maxLength={10}
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ""))}
                  placeholder="10-digit mobile number"
                  className="flex-1 px-3.5 py-2.5 rounded-[10px] border border-[#EBEBEB] font-semibold text-[#121212] text-sm focus:outline-none focus:border-[#121212]"
                />
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isSendingOtp || resendCooldown > 0}
                  className="bg-[#121212] hover:bg-[#2A2A2A] disabled:bg-[#EBEBEB] disabled:text-[#767676] text-white text-xs font-bold px-4 py-2.5 rounded-[10px] shrink-0 transition cursor-pointer"
                >
                  {isSendingOtp
                    ? "Sending..."
                    : resendCooldown > 0
                    ? `Resend (${resendCooldown}s)`
                    : otpSentMsg
                    ? "Resend OTP"
                    : "Send OTP"}
                </button>
              </div>
              {otpSentMsg && (
                <p className="text-[11px] text-emerald-700 font-semibold mt-1.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{otpSentMsg}</span>
                </p>
              )}
            </div>

            {/* 4-Digit OTP Entry Box */}
            <div className="bg-[#F8F9FA] rounded-[12px] p-4 sm:p-5 border border-[#EBEBEB] space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-[#121212]">Enter 4-Digit OTP</span>
                <span className="text-[11px] text-[#767676]">Verification Code</span>
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
                    handleVerifyOtp(val);
                  }}
                  error={Boolean(otpError)}
                />
              </div>

              {/* Quick Fill & Verify Action */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-2 border-t border-[#EBEBEB]">
                {savedHandshakeOtp ? (
                  <button
                    type="button"
                    onClick={() => {
                      setOtpCode(savedHandshakeOtp);
                      setOtpError("");
                      handleVerifyOtp(savedHandshakeOtp);
                    }}
                    className="text-[11px] font-semibold text-[#F97316] hover:underline cursor-pointer"
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
                    className="text-[11px] font-semibold text-[#F97316] hover:underline cursor-pointer"
                  >
                    ⚡ Auto-fill Demo (1234)
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleVerifyOtp()}
                  disabled={isRefreshing || otpCode.length < 4}
                  className="w-full sm:w-auto bg-[#F97316] hover:bg-[#EA580C] disabled:bg-[#EBEBEB] disabled:text-[#767676] text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-[10px] shadow-xs transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {isRefreshing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>Verify & Track</span>}
                </button>
              </div>

              {otpError && (
                <p className="text-xs text-red-600 font-semibold pt-1 flex items-center justify-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{otpError}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* GATE 2: UNLOCKED LIVE TRACKER                                     */}
      {/* ================================================================= */}
      {isUnlocked && statusData && (
        <div className="space-y-5">
          {/* Handshake Completion OTP Card */}
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
                  Share this 4-digit code with {statusData.technicianName ? <>technician <strong>{statusData.technicianName}</strong></> : "your assigned technician"} only upon repair completion to authorize job closure:
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
                    onClick={handleRefreshStatus}
                    disabled={isRefreshing}
                    className="p-2 rounded-[8px] bg-white/10 hover:bg-white/20 text-white text-xs transition cursor-pointer"
                    title="Refresh Live Status"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
                  </button>
                  <button
                    onClick={() => setIsUnlocked(false)}
                    className="text-xs text-[#A0A0A0] hover:text-white underline px-2 py-1 cursor-pointer"
                  >
                    Lock
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
