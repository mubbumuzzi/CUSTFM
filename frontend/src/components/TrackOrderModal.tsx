"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Box, Search, ArrowRight } from "lucide-react";
import { showFmToast } from "./ToastBanner";

export function openTrackModal() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("fm_open_track_modal"));
  }
}

export default function TrackOrderModal() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [trackQuery, setTrackQuery] = useState("");

  useEffect(() => {
    const handleOpen = () => {
      // Auto-populate latest booking id or mobile
      const latestId = localStorage.getItem("fm_latest_booking_id");
      const latestMobile = localStorage.getItem("fm_latest_mobile");
      if (latestId) {
        setTrackQuery(latestId);
      } else if (latestMobile) {
        setTrackQuery(latestMobile);
      }
      setIsOpen(true);
    };

    window.addEventListener("fm_open_track_modal", handleOpen);
    return () => window.removeEventListener("fm_open_track_modal", handleOpen);
  }, []);

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = trackQuery.trim();
    if (!query) return;

    closeModal();
    showFmToast(`Locating live technician for "${query}"...`);
    
    // Check if it's 10-digit mobile or booking ID
    if (/^\d{10}$/.test(query)) {
      router.push(`/track-booking?mobile=${encodeURIComponent(query)}`);
    } else {
      router.push(`/track-booking?id=${encodeURIComponent(query)}`);
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
      <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-[#F97316]">
              <Box className="w-4 h-4" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900">Track Live Technician</h3>
          </div>
          <button
            type="button"
            onClick={closeModal}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 transition active:scale-95 cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-500 mb-3.5 leading-relaxed">
          Enter your Booking ID (e.g. FM-8492) or 10-digit registered mobile number to view live technician ETA and repair stages.
        </p>

        <form onSubmit={handleTrackSubmit} className="space-y-3">
          <div className="relative">
            <input
              type="text"
              required
              value={trackQuery}
              onChange={(e) => setTrackQuery(e.target.value)}
              placeholder="e.g., FM-8492 or 98480 XXXXX"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#F97316] focus:bg-white text-slate-900 transition"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-slate-900 hover:bg-slate-800 active:scale-[0.99] transition text-white text-xs font-bold py-3 rounded-xl shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Track Status</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
