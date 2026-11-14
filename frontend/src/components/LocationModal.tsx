"use client";

import React from "react";
import { MapPin, X, CheckCircle2, AlertTriangle } from "lucide-react";

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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl p-5 space-y-4 shadow-2xl">
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

        <div className="space-y-2 max-h-[60vh] overflow-y-auto">
          {LOCALITIES.map((loc) => {
            const isSelected = currentLocality.includes(loc.name.split(",")[0]);
            return (
              <button
                key={loc.name}
                onClick={() => {
                  onSelectLocality(loc.name, loc.km, loc.eligible);
                  onClose();
                }}
                className={`w-full text-left p-3.5 rounded-xl border transition flex items-center justify-between ${
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
                    {loc.eligible ? (
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.2 rounded">
                        {loc.km} km
                      </span>
                    ) : (
                      <span className="text-[9px] bg-amber-100 text-amber-800 font-extrabold px-1.5 py-0.2 rounded">
                        {loc.km} km
                      </span>
                    )}
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
            Main Shop: <span className="font-bold text-navy-900">Main Road, Near Marrichettu Junction, Manikonda</span>
          </p>
        </div>
      </div>
    </div>
  );
}
