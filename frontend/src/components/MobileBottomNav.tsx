"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Wrench, CalendarPlus, Box, Phone } from "lucide-react";
import { openBookingDrawer } from "./InteractiveBookingModal";
import { openTrackModal } from "./TrackOrderModal";
import { showFmToast } from "./ToastBanner";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleHomeClick = (e: React.MouseEvent) => {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleServicesClick = (e: React.MouseEvent) => {
    if (pathname === "/") {
      e.preventDefault();
      const el = document.getElementById("services-section") || document.getElementById("services-grid");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleBookVisitClick = (e: React.MouseEvent) => {
    e.preventDefault();
    openBookingDrawer("Express Doorstep Visit", "15–45 mins Arrival", "₹0 Inspection Fee");
  };

  const handleTrackClick = (e: React.MouseEvent) => {
    e.preventDefault();
    openTrackModal();
  };

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    showFmToast("WhatsApp / Call Support: +91 90637 86751 (Open till 1:00 AM)");
    window.location.href = "tel:+919063786751";
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-100 shadow-nav px-2 pt-1.5 pb-2.5 pb-[max(0.6rem,env(safe-area-inset-bottom))] z-40">
      <div className="grid grid-cols-5 items-end text-center max-w-md mx-auto">
        {/* Home */}
        <Link
          href="/"
          onClick={handleHomeClick}
          className={`flex flex-col items-center justify-center gap-1 py-1 active:scale-95 transition ${
            pathname === "/" ? "text-slate-950 font-bold" : "text-slate-400 hover:text-slate-700 font-medium"
          }`}
        >
          <Home className={`w-5 h-5 ${pathname === "/" ? "stroke-[2.2]" : "stroke-[1.8]"}`} />
          <span className="text-[10.5px]">Home</span>
        </Link>

        {/* Services */}
        <Link
          href="/services"
          onClick={handleServicesClick}
          className={`flex flex-col items-center justify-center gap-1 py-1 active:scale-95 transition ${
            pathname === "/services" ? "text-slate-950 font-bold" : "text-slate-400 hover:text-slate-700 font-medium"
          }`}
        >
          <Wrench className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[10.5px]">Services</span>
        </Link>

        {/* Center Floating Orange CTA: Book Visit */}
        <div className="flex flex-col items-center justify-center -mt-6">
          <button
            type="button"
            onClick={handleBookVisitClick}
            aria-label="Book Doorstep Visit"
            className="w-12 h-12 rounded-full bg-[#F97316] hover:bg-orange-600 active:scale-95 transition text-white shadow-lg shadow-orange-500/30 flex items-center justify-center border-4 border-white cursor-pointer"
          >
            <CalendarPlus className="w-6 h-6 stroke-[2.2]" />
          </button>
          <span className="text-[10.5px] font-extrabold text-[#F97316] mt-0.5 leading-tight">
            Book Visit
          </span>
        </div>

        {/* Track */}
        <button
          type="button"
          onClick={handleTrackClick}
          className={`flex flex-col items-center justify-center gap-1 py-1 active:scale-95 transition cursor-pointer ${
            pathname === "/track-booking" ? "text-slate-950 font-bold" : "text-slate-400 hover:text-slate-700 font-medium"
          }`}
        >
          <Box className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[10.5px]">Track</span>
        </button>

        {/* Contact */}
        <button
          type="button"
          onClick={handleContactClick}
          className="flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-slate-700 py-1 active:scale-95 transition cursor-pointer font-medium"
        >
          <Phone className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[10.5px]">Contact</span>
        </button>
      </div>
    </nav>
  );
}
