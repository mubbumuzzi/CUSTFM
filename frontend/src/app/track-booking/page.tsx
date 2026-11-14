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
} from "lucide-react";
import { fetchBookingStatus, approveBookingQuote, BookingStatusData } from "@/lib/api";

function TrackBookingContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get("id") || "FM-2026-9812";

  const [bookingId, setBookingId] = useState(initialId);
  const [mobileNumber, setMobileNumber] = useState("9876543210");
  const [otpCode, setOtpCode] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [statusData, setStatusData] = useState<BookingStatusData | null>(null);
  const [scenario, setScenario] = useState<"on_the_way" | "approval">("on_the_way");
  const [quoteApproved, setQuoteApproved] = useState(false);

  const handleVerifyOtp = async (codeToVerify?: string) => {
    const code = (codeToVerify || otpCode).trim();
    if (code !== "1234" && code.length !== 4) {
      setOtpError("Please enter demo OTP: 1234");
      return;
    }
    setOtpError("");

    const data = await fetchBookingStatus(bookingId, mobileNumber);
    if (data) {
      setStatusData(data);
      setIsUnlocked(true);
    }
  };

  const handleAutoFillAndVerify = () => {
    setOtpCode("1234");
    handleVerifyOtp("1234");
  };

  const handleQuoteApproval = async () => {
    setQuoteApproved(true);
    await approveBookingQuote(bookingId);
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
          Private booking details are protected by OTP verification as per PRD security standards.
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
                placeholder="FM-2026-XXXX"
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
                  onClick={() => alert("Demo OTP '1234' is ready to use!")}
                  className="bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shrink-0 transition"
                >
                  Send OTP
                </button>
              </div>
            </div>

            {/* OTP Entry Card */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-extrabold text-navy-900">Enter 4-Digit OTP</span>
                <button
                  type="button"
                  onClick={handleAutoFillAndVerify}
                  className="text-xs font-black text-accent-600 hover:underline"
                >
                  Auto-fill Demo (1234)
                </button>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={4}
                  value={otpCode}
                  onChange={(e) => {
                    setOtpCode(e.target.value);
                    setOtpError("");
                  }}
                  placeholder="1234"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-center font-black tracking-[0.4em] text-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
                />
                <button
                  type="button"
                  onClick={() => handleVerifyOtp()}
                  className="bg-accent-500 hover:bg-accent-600 text-white font-black text-xs sm:text-sm px-6 py-2.5 rounded-xl shrink-0 shadow-sm transition active:scale-95"
                >
                  Verify
                </button>
              </div>

              {otpError && (
                <p className="text-xs text-red-600 font-bold pt-1">{otpError}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* GATE 2: UNLOCKED LIVE DASHBOARD                                   */}
      {/* ================================================================= */}
      {isUnlocked && (
        <div className="space-y-5">
          {/* Top Status & Scenario Simulator */}
          <div className="bg-navy-950 text-white rounded-2xl p-3 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="font-bold text-slate-300">Live Stage Simulation:</span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setScenario("on_the_way")}
                className={`px-3 py-1.5 rounded-lg font-extrabold text-xs transition ${
                  scenario === "on_the_way"
                    ? "bg-accent-500 text-white shadow-xs"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                1. On The Way
              </button>
              <button
                type="button"
                onClick={() => setScenario("approval")}
                className={`px-3 py-1.5 rounded-lg font-extrabold text-xs transition ${
                  scenario === "approval"
                    ? "bg-accent-500 text-white shadow-xs"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                2. Quote Approval
              </button>
            </div>
          </div>

          {/* Schematic Animated Route Map Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-navy-900 text-white p-5 sm:p-6 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <span className="bg-accent-500 text-white text-[10px] sm:text-xs font-black uppercase px-2.5 py-0.5 rounded-full">
                    {scenario === "on_the_way"
                      ? "Technician On The Way"
                      : "Awaiting Quote Approval"}
                  </span>
                  <h2 className="text-lg sm:text-xl font-black mt-1">
                    {scenario === "on_the_way"
                      ? "Arriving in ~18 mins (Doorstep)"
                      : "Inspection Complete • Review Quote"}
                  </h2>
                </div>

                <button
                  onClick={() => setIsUnlocked(false)}
                  className="text-xs text-slate-400 hover:text-white underline"
                >
                  Lock
                </button>
              </div>

              {/* Vector SVG Animated Route Line */}
              <div className="bg-navy-950 rounded-2xl p-4 border border-navy-800">
                <svg viewBox="0 0 380 70" className="w-full h-16 overflow-visible">
                  {/* Base Route Track */}
                  <line
                    x1="35"
                    y1="35"
                    x2="345"
                    y2="35"
                    stroke="#1E3A5F"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                  {/* Animated Active Route */}
                  <line
                    x1="35"
                    y1="35"
                    x2={scenario === "on_the_way" ? "225" : "345"}
                    y2="35"
                    stroke="#F97316"
                    strokeWidth="5"
                    strokeLinecap="round"
                    className="route-dash"
                  />

                  {/* Node 1: Manikonda Shop */}
                  <circle cx="35" cy="35" r="7" fill="#0F294A" stroke="#FFFFFF" strokeWidth="2.5" />
                  <text x="35" y="58" textAnchor="middle" fill="#CBD5E1" fontSize="10" fontWeight="700">
                    Manikonda Hub
                  </text>

                  {/* Node 2: Technician in Transit */}
                  {scenario === "on_the_way" && (
                    <g transform="translate(225, 35)">
                      <circle r="14" fill="#F97316" opacity="0.3" className="animate-ping" />
                      <circle r="8" fill="#F97316" stroke="#FFFFFF" strokeWidth="2.5" />
                      <text x="0" y="-14" textAnchor="middle" fill="#FDBA74" fontSize="10" fontWeight="800">
                        Ramesh K. (~18m)
                      </text>
                    </g>
                  )}

                  {/* Node 3: Customer Doorstep */}
                  <circle
                    cx="345"
                    cy="35"
                    r="7"
                    fill={scenario === "approval" ? "#10B981" : "#334155"}
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
                  <div className="w-11 h-11 rounded-2xl bg-navy-900 text-white font-black flex items-center justify-center text-sm shadow-xs">
                    RK
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-navy-950">Ramesh K. (4.9 ★)</h3>
                    <p className="text-xs text-slate-500">
                      iPhone 14 • Display Replacement • Manikonda Zone
                    </p>
                  </div>
                </div>
                <a
                  href="tel:+919063786751"
                  className="bg-white hover:bg-slate-100 border border-slate-200 p-2.5 rounded-xl shadow-xs transition"
                  title="Call Technician"
                >
                  <Phone className="w-4 h-4 text-navy-900" />
                </a>
              </div>

              {/* Quote Approval Banner (When in Quote Approval Scenario) */}
              {scenario === "approval" && (
                <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-xs font-black text-amber-900 uppercase tracking-wider block">
                        Diagnosis Complete • Quote Ready
                      </span>
                      <h4 className="text-base font-black text-navy-950">
                        OLED Display Replacement
                      </h4>
                    </div>
                    <span className="text-xl font-black text-navy-950">₹3,499</span>
                  </div>

                  <p className="text-xs text-slate-600">
                    Includes Original OEM OLED panel, precision installation, frame cleaning, and 6-Month Warranty. First home visit is <strong>₹0 Free</strong>.
                  </p>

                  {quoteApproved ? (
                    <div className="bg-emerald-600 text-white text-xs font-black p-3 rounded-xl flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Quote Approved (₹3,499) — Repair in progress now!</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleQuoteApproval}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-black py-3 px-4 rounded-xl shadow-md transition active:scale-95"
                    >
                      ✓ Approve Quote & Start Repair
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
                  {[
                    "New Enquiry Logged",
                    "Customer Contacted",
                    "Appointment Confirmed",
                    "Technician Assigned",
                    "Part Collected from Manikonda Hub",
                    "Technician On The Way",
                    "Technician Arrived",
                    "Diagnosis Completed",
                    "Awaiting Customer Approval",
                    "Repair In Progress",
                    "Completed & Closed",
                  ].map((stageName, idx) => {
                    const activeIdx = scenario === "on_the_way" ? 5 : quoteApproved ? 9 : 8;
                    const isDone = idx < activeIdx;
                    const isCurrent = idx === activeIdx;

                    return (
                      <div key={stageName} className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 transition ${
                            isDone
                              ? "bg-emerald-600 text-white"
                              : isCurrent
                              ? "bg-accent-500 text-white ring-4 ring-accent-100"
                              : "bg-slate-200 text-slate-500"
                          }`}
                        >
                          {isDone ? <Check className="w-3.5 h-3.5" /> : idx + 1}
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
                          {stageName}
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
