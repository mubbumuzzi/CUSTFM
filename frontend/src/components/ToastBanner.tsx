"use client";

import React, { useState, useEffect } from "react";

export function showFmToast(message: string) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("fm_show_toast", { detail: { message } }));
  }
}

export default function ToastBanner() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const handleToast = (e: Event) => {
      const detail = (e as CustomEvent<{ message: string }>).detail;
      if (detail && detail.message) {
        setToastMessage(detail.message);
        setVisible(true);

        clearTimeout(timeout);
        timeout = setTimeout(() => {
          setVisible(false);
        }, 3400);
      }
    };

    window.addEventListener("fm_show_toast", handleToast);
    return () => {
      window.removeEventListener("fm_show_toast", handleToast);
      clearTimeout(timeout);
    };
  }, []);

  if (!toastMessage && !visible) return null;

  return (
    <div
      className={`fixed top-4 sm:top-16 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm pointer-events-none transition-all duration-300 transform ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
      }`}
    >
      <div className="bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 border border-slate-800">
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F97316] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F97316]"></span>
        </span>
        <span className="leading-snug">{toastMessage}</span>
      </div>
    </div>
  );
}
