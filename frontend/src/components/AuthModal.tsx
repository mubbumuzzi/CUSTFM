"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, ShieldCheck, ArrowRight, ArrowLeft, RefreshCw, CheckCircle2, Lock, Smartphone, Edit3 } from "lucide-react";
import { sendOtpApi, verifyOtpApi, setAuthSession, getStoredUserMobile } from "@/lib/api";
import { OtpInput } from "@/components/ui/OtpInput";
import { showFmToast } from "@/components/ToastBanner";

export function openAuthModal() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("fm_open_auth_modal"));
  }
}

export default function AuthModal() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<1 | 2>(1); // 1: Mobile input, 2: OTP verification
  const [mobileNumber, setMobileNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [demoCode, setDemoCode] = useState<string | null>(null);

  useEffect(() => {
    const handleOpen = () => {
      const stored = getStoredUserMobile();
      if (stored && !mobileNumber) {
        setMobileNumber(stored);
      }
      setStep(1);
      setOtpCode("");
      setErrorMsg("");
      setIsOpen(true);
    };

    window.addEventListener("fm_open_auth_modal", handleOpen);
    return () => window.removeEventListener("fm_open_auth_modal", handleOpen);
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
  };

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanMobile = mobileNumber.trim().replace(/\D/g, "");
    if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
      setErrorMsg("Please enter a valid 10-digit Indian mobile number.");
      return;
    }

    setErrorMsg("");
    setIsSending(true);

    try {
      const res = await sendOtpApi(cleanMobile);
      if (res.success) {
        setCountdown(res.cooldownSeconds || 30);
        if (res.demoOtp) {
          setDemoCode(res.demoOtp);
        }
        setStep(2);
      } else {
        setCountdown(res.retryAfterSeconds || 30);
        setErrorMsg(res.message || "Please wait before requesting another OTP.");
      }
    } catch {
      setCountdown(30);
      setDemoCode("1234");
      setStep(2);
    } finally {
      setIsSending(false);
    }
  };

  const handleVerifyOtp = async (codeToVerify?: string) => {
    const cleanOtp = (codeToVerify !== undefined ? codeToVerify : otpCode).trim();
    const cleanMobile = mobileNumber.trim().replace(/\D/g, "");

    if (cleanOtp.length < 4) {
      setErrorMsg("Please enter the complete 4-digit OTP.");
      return;
    }

    setErrorMsg("");
    setIsVerifying(true);

    try {
      const res = await verifyOtpApi(cleanMobile, cleanOtp);
      if (res.success) {
        closeModal();
        showFmToast(`Logged in successfully (+91 ${cleanMobile})`);
        router.push("/track-booking");
      } else {
        setErrorMsg(res.message || "Invalid OTP code. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Unable to verify OTP. Please try test code 1234.");
    } finally {
      setIsVerifying(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeModal();
      }}
    >
      <div className="w-full max-w-sm bg-white rounded-3xl p-6 sm:p-7 shadow-2xl animate-in zoom-in-95 duration-200 relative border border-slate-100">
        {/* Close Button */}
        <button
          type="button"
          onClick={closeModal}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition active:scale-95 cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* ================================================================= */}
        {/* STEP 1: MOBILE NUMBER ENTRY                                       */}
        {/* ================================================================= */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-1 text-center">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 text-[#F97316] mx-auto flex items-center justify-center mb-2">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Login / Track Order</h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                Enter your mobile number to view live technician ETA, repair stages, and active warranties.
              </p>
            </div>

            <form onSubmit={handleSendOtp} className="space-y-3.5 pt-1">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Mobile Number
                </label>
                <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50/70 focus-within:border-[#F97316] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#F97316]/10 transition overflow-hidden">
                  <div className="flex items-center gap-1.5 px-3 py-2.5 bg-slate-100/70 border-r border-slate-200 text-xs font-bold text-slate-800 select-none">
                    <span>🇮🇳</span>
                    <span>+91</span>
                  </div>
                  <input
                    type="tel"
                    maxLength={10}
                    autoFocus
                    required
                    value={mobileNumber}
                    onChange={(e) => {
                      setMobileNumber(e.target.value.replace(/\D/g, ""));
                      setErrorMsg("");
                    }}
                    placeholder="98480 12345"
                    className="w-full px-3 py-2.5 text-sm font-bold text-slate-900 bg-transparent focus:outline-none tracking-wider placeholder:font-normal placeholder:tracking-normal placeholder:text-slate-400"
                  />
                  {mobileNumber && (
                    <button
                      type="button"
                      onClick={() => setMobileNumber("")}
                      className="px-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                {errorMsg && <p className="text-[11px] font-semibold text-rose-600 mt-1.5">{errorMsg}</p>}
              </div>

              <button
                type="submit"
                disabled={isSending || mobileNumber.length < 10}
                className="w-full bg-[#F97316] hover:bg-[#EA580C] disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-sm py-3 rounded-xl shadow-md shadow-orange-500/15 transition active:scale-[0.99] flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isSending ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Sending OTP via SMS...</span>
                  </>
                ) : (
                  <>
                    <span>Get OTP via SMS</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-[10px] text-center text-slate-400">
                🔒 Secured by Indian Telecom SMS • Zero Spam Guarantee
              </p>
            </form>
          </div>
        )}

        {/* ================================================================= */}
        {/* STEP 2: 4-DIGIT OTP VERIFICATION                                  */}
        {/* ================================================================= */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-1 text-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-2">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Verify with OTP</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Enter 4-digit code sent via SMS to{" "}
                <span className="font-bold text-slate-900">+91 {mobileNumber}</span>
              </p>
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setOtpCode("");
                  setErrorMsg("");
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
                  setErrorMsg("");
                }}
                onComplete={(val) => {
                  setOtpCode(val);
                  handleVerifyOtp(val);
                }}
                error={Boolean(errorMsg)}
                autoFocus
              />
            </div>

            {errorMsg && (
              <p className="text-[11px] text-center font-semibold text-rose-600">{errorMsg}</p>
            )}

            {/* Quick Demo Fill Helper */}
            <div className="flex items-center justify-between text-xs pt-1">
              {demoCode ? (
                <button
                  type="button"
                  onClick={() => {
                    setOtpCode(demoCode);
                    setErrorMsg("");
                    handleVerifyOtp(demoCode);
                  }}
                  className="text-[11px] font-bold text-[#F97316] hover:underline cursor-pointer"
                >
                  ⚡ Auto-fill SMS Code ({demoCode})
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setOtpCode("1234");
                    setErrorMsg("");
                    handleVerifyOtp("1234");
                  }}
                  className="text-[11px] font-bold text-[#F97316] hover:underline cursor-pointer"
                >
                  ⚡ Auto-fill Demo (1234)
                </button>
              )}

              {/* Resend Countdown */}
              {countdown > 0 ? (
                <span className="text-[11px] text-slate-400 font-medium">
                  Resend in <span className="font-bold text-slate-700">{countdown}s</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSendOtp()}
                  className="text-[11px] font-bold text-slate-800 hover:text-black underline cursor-pointer"
                >
                  Resend OTP
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => handleVerifyOtp()}
              disabled={isVerifying || otpCode.length < 4}
              className="w-full bg-[#121212] hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-sm py-3 rounded-xl shadow-md transition active:scale-[0.99] flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying Code...</span>
                </>
              ) : (
                <>
                  <span>Verify & View Orders</span>
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
