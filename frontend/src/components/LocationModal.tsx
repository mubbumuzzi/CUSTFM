"use client";

import React, { useState } from "react";
import { MapPin, X, CheckCircle2, AlertTriangle, Navigation, RefreshCw } from "lucide-react";
import { calculateDistanceKm, reverseGeocode, MAX_RADIUS_KM } from "@/lib/gps";

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocality: string;
  onSelectLocality: (name: string, km: number, eligible: boolean) => void;
}

const LOCALITIES = [
  { name: "Lanco Hills, Manikonda", km: 1.4, eligible: true, note: "Doorstep Eligible • ₹0 Free 1st Visit" },
  { name: "Puppalaguda Main Rd", km: 2.6, eligible: true, note: "Doorstep Eligible • 30-45 mins" },
  { name: "Alkapoor Township", km: 3.3, eligible: true, note: "Doorstep Eligible • 40 mins" },
  { name: "OU Colony / Shaikpet", km: 2.9, eligible: true, note: "Doorstep Eligible • 35 mins" },
  { name: "Financial District (Gachibowli)", km: 6.8, eligible: false, note: "Exceeds 5 km radius • Shop Pickup Only" },
];

export default function LocationModal({
  isOpen,
  onClose,
  currentLocality,
  onSelectLocality,
}: LocationModalProps) {
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsError, setGpsError] = useState("");

  if (!isOpen) return null;

  const handleDetectGps = () => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      setGpsError("Geolocation is not supported by your browser.");
      return;
    }

    setGpsError("");
    setIsDetectingGps(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const km = calculateDistanceKm(latitude, longitude);
          const name = await reverseGeocode(latitude, longitude);
          const eligible = km <= MAX_RADIUS_KM;

          localStorage.setItem("fm_user_locality", name);
          localStorage.setItem("fm_user_distance", String(km));
          localStorage.setItem("fm_user_lat", String(latitude));
          localStorage.setItem("fm_user_lng", String(longitude));
          localStorage.setItem("fm_user_is_gps", "true");

          onSelectLocality(name, km, eligible);
          setIsDetectingGps(false);
          onClose();
        } catch {
          setIsDetectingGps(false);
          setGpsError("Could not calculate distance. Please pick a locality below.");
        }
      },
      (err) => {
        setIsDetectingGps(false);
        if (err.code === 1) {
          setGpsError("Location permission denied. Please allow location in your browser or select below.");
        } else {
          setGpsError("Could not determine GPS position. Please select a locality below.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl p-5 space-y-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-accent-50 text-accent-600 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-navy-900">Select Doorstep Location</h3>
              <p className="text-[11px] text-slate-500">5 km radius from Manikonda shop</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* GPS Location Button */}
        <div className="space-y-1.5">
          <button
            type="button"
            onClick={handleDetectGps}
            disabled={isDetectingGps}
            className="w-full bg-gradient-to-r from-accent-500 to-orange-500 hover:from-accent-600 hover:to-orange-600 text-white p-3.5 rounded-xl shadow-sm transition active:scale-98 flex items-center justify-between"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                {isDetectingGps ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <Navigation className="w-4 h-4 text-white" />
                )}
              </div>
              <div className="text-left">
                <div className="text-xs font-black">
                  {isDetectingGps ? "Detecting GPS Position..." : "Use Current Location (GPS)"}
                </div>
                <div className="text-[10px] text-white/90 font-medium">
                  {isDetectingGps ? "Acquiring coordinates & distance..." : "Auto-detect distance from Manikonda shop"}
                </div>
              </div>
            </div>
            <span className="text-[10px] font-extrabold bg-white text-navy-950 px-2.5 py-1 rounded-lg shrink-0">
              {isDetectingGps ? "..." : "Detect"}
            </span>
          </button>

          {gpsError && (
            <p className="text-[11px] text-amber-700 font-semibold px-1 pt-1 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>{gpsError}</span>
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider py-1">
          <span className="h-px bg-slate-200 flex-1"></span>
          <span>Or Choose Neighborhood</span>
          <span className="h-px bg-slate-200 flex-1"></span>
        </div>

        {/* Neighborhood List */}
        <div className="space-y-2 max-h-[50vh] overflow-y-auto">
          {LOCALITIES.map((loc) => {
            const isSelected = currentLocality.includes(loc.name.split(",")[0]);
            return (
              <button
                key={loc.name}
                onClick={() => {
                  if (typeof window !== "undefined") {
                    localStorage.setItem("fm_user_locality", loc.name);
                    localStorage.setItem("fm_user_distance", String(loc.km));
                    localStorage.setItem("fm_user_is_gps", "false");
                  }
                  onSelectLocality(loc.name, loc.km, loc.eligible);
                  onClose();
                }}
                className={`w-full text-left p-3 rounded-xl border transition flex items-center justify-between ${
                  isSelected
                    ? "border-accent-500 bg-accent-50/40 ring-1 ring-accent-500"
                    : loc.eligible
                    ? "border-slate-200 hover:border-navy-900 hover:bg-slate-50"
                    : "border-amber-200 bg-amber-50/40"
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-navy-900 flex items-center gap-1.5">
                    <span>{loc.name}</span>
                    <span
                      className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded ${
                        loc.eligible ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {loc.km} km
                    </span>
                  </div>
                  <div
                    className={`text-[10px] font-semibold mt-0.5 ${
                      loc.eligible ? "text-emerald-700" : "text-amber-800"
                    }`}
                  >
                    {loc.note}
                  </div>
                </div>

                <div>
                  {loc.eligible ? (
                    <CheckCircle2
                      className={`w-4 h-4 ${
                        isSelected ? "text-accent-500" : "text-slate-300"
                      }`}
                    />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="pt-2 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-500">
            Main Hub: <span className="font-bold text-navy-900">Main Road, Near Marrichettu Junction, Manikonda</span>
          </p>
        </div>
      </div>
    </div>
  );
}
