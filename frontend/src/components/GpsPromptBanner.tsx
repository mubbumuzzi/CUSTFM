"use client";

import React, { useState, useEffect } from "react";
import { Navigation, MapPin, X, CheckCircle2, RefreshCw, Sparkles, ShieldCheck } from "lucide-react";
import { detectGpsLocation, GpsLocationData } from "@/lib/gps";
import LocationModal from "./LocationModal";

export default function GpsPromptBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [successData, setSuccessData] = useState<GpsLocationData | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if user already granted GPS location or dismissed
    const isGpsApproved = localStorage.getItem("fm_user_is_gps") === "true";
    const isDismissed = sessionStorage.getItem("fm_gps_prompt_dismissed") === "true";

    if (!isGpsApproved && !isDismissed) {
      // Show prompt banner on 1st page
      const timer = setTimeout(() => setIsVisible(true), 600);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAllowGps = async () => {
    setIsDetecting(true);
    setErrorMsg("");

    try {
      const data = await detectGpsLocation();
      setSuccessData(data);
      setIsDetecting(false);

      // Auto-hide success badge after 4 seconds
      setTimeout(() => {
        setIsVisible(false);
      }, 4000);
    } catch (err: unknown) {
      setIsDetecting(false);
      const msg = err instanceof Error ? err.message : "Unable to acquire location.";
      setErrorMsg(msg);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("fm_gps_prompt_dismissed", "true");
    }
  };

  if (!isVisible) return null;

  return (
    <>
      <div className="bg-gradient-to-r from-orange-600 via-accent-500 to-amber-500 text-white shadow-lg border-b border-orange-700/30 transition-all animate-fade-in">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6">
          {successData ? (
            /* Success State upon Customer Approval */
            <div className="flex items-center justify-between gap-3 text-xs sm:text-sm font-bold">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-white text-emerald-600 flex items-center justify-center shrink-0 shadow-xs">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-extrabold text-white">
                    GPS Location Approved & Recorded:
                  </span>{" "}
                  <span className="bg-black/20 px-2 py-0.5 rounded text-amber-100 font-black">
                    {successData.locality} ({successData.distanceKm} km)
                  </span>{" "}
                  <span>
                    • Doorstep Dispatch Active (~{successData.eta})
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsVisible(false)}
                className="text-white/80 hover:text-white p-1"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Initial Prompt State */
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-start sm:items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                  {isDetecting ? (
                    <RefreshCw className="w-5 h-5 text-white animate-spin" />
                  ) : (
                    <Navigation className="w-5 h-5 text-white animate-pulse" />
                  )}
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] uppercase font-black tracking-wider bg-white text-navy-950 px-2 py-0.5 rounded-full shadow-xs">
                      📍 Live Doorstep Dispatch
                    </span>
                    <span className="text-xs sm:text-sm font-black text-white">
                      Allow GPS Location Access
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-orange-100 font-medium">
                    Detect your doorstep distance in Manikonda to verify 45-min technician arrival and unlock your <strong className="text-white underline decoration-white font-extrabold">₹0 Free First Visit</strong>.
                  </p>
                  {errorMsg && (
                    <p className="text-[11px] font-bold text-amber-200 pt-0.5">
                      ⚠️ {errorMsg}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={handleAllowGps}
                  disabled={isDetecting}
                  className="bg-navy-950 hover:bg-navy-900 active:scale-95 disabled:bg-navy-950/60 text-white font-black text-xs px-4 py-2 rounded-xl shadow-md transition flex items-center gap-1.5"
                >
                  {isDetecting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Detecting GPS...</span>
                    </>
                  ) : (
                    <>
                      <Navigation className="w-3.5 h-3.5 fill-accent-400 text-accent-400" />
                      <span>Allow GPS Location</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="text-white hover:text-navy-950 hover:bg-white/20 text-xs font-bold px-3 py-2 rounded-xl transition"
                >
                  Pick Area
                </button>

                <button
                  type="button"
                  onClick={handleDismiss}
                  className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition"
                  title="Dismiss notification"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <LocationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentLocality="Manikonda"
        onSelectLocality={(name, km, eligible) => {
          setIsModalOpen(false);
          setIsVisible(false);
        }}
      />
    </>
  );
}
