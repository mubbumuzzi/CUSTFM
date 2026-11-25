"use client";

import React, { useState, useEffect } from "react";
import { BUSINESS_INFO } from "@/lib/businessInfo";
import { getStoredLocation } from "@/lib/gps";

interface BuilderContext {
  deviceLabel?: string;
  partGrade?: string;
  services?: string[];
}

export default function FloatingWhatsAppButton() {
  const [builderCtx, setBuilderCtx] = useState<BuilderContext | null>(null);

  useEffect(() => {
    const handleContext = (e: Event) => {
      const detail = (e as CustomEvent<BuilderContext>).detail;
      if (detail) {
        setBuilderCtx(detail);
      }
    };
    window.addEventListener("fm_builder_context", handleContext);
    return () => window.removeEventListener("fm_builder_context", handleContext);
  }, []);

  const storedLoc = typeof window !== "undefined" ? getStoredLocation() : null;
  const locality = storedLoc?.locality || "Manikonda, Hyderabad";

  const message = builderCtx?.deviceLabel
    ? `Hi Famous Mobiles (${BUSINESS_INFO.url}),\nDevice: ${builderCtx.deviceLabel} (${builderCtx.partGrade || "OEM Service Pack"})\nServices: ${
        builderCtx.services && builderCtx.services.length > 0
          ? builderCtx.services.join(", ")
          : "Free Doorstep Inspection"
      }\nLocality: ${locality}\nRequesting ₹0 First Home Visit & quote.`
    : `Hi Famous Mobiles, I need a doorstep mobile repair quote (${locality}).`;

  const href = `${BUSINESS_INFO.whatsappBase}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp with Famous Mobiles"
      title={`WhatsApp Instant Quote (${BUSINESS_INFO.phoneDisplay})`}
      className="fixed bottom-[78px] left-3.5 md:bottom-6 md:left-6 z-30 w-12 h-12 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] active:scale-95 text-white shadow-lg shadow-emerald-600/25 border-2 border-white flex items-center justify-center transition"
    >
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.52 3.48A11.86 11.86 0 0012.06 0C5.5 0 .16 5.34.16 11.9c0 2.1.55 4.15 1.59 5.96L0 24l6.31-1.65a11.87 11.87 0 005.75 1.47h.01c6.56 0 11.9-5.34 11.9-11.9 0-3.18-1.24-6.17-3.45-8.44zM12.07 21.8h-.01a9.87 9.87 0 01-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 01-1.51-5.27c0-5.45 4.44-9.89 9.9-9.89 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 012.89 7c0 5.45-4.44 9.89-9.89 9.89zm5.43-7.41c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35z" />
      </svg>
    </a>
  );
}
