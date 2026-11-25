"use client";

import React, { useState, useEffect } from "react";
import { getIstStoreStatus, IstStoreStatus, BUSINESS_INFO } from "@/lib/businessInfo";

interface StoreStatusTextProps {
  variant?: "dark-bar" | "inline";
}

export default function StoreStatusText({ variant = "inline" }: StoreStatusTextProps) {
  const [status, setStatus] = useState<IstStoreStatus | null>(null);

  useEffect(() => {
    setStatus(getIstStoreStatus());
    const id = setInterval(() => {
      setStatus(getIstStoreStatus());
    }, 60_000);
    return () => clearInterval(id);
  }, []);

  const isOpen = status ? status.isOpen : true;
  const label = status ? status.label : `Open Daily ${BUSINESS_INFO.hoursDisplay}`;

  if (variant === "dark-bar") {
    return (
      <div className="flex items-center gap-2">
        <span
          className={`w-2 h-2 rounded-full ${
            isOpen ? "bg-emerald-400" : "bg-amber-400"
          }`}
        />
        <span className="text-[#E0E0E0]">
          Express Doorstep Repair <span className="text-white/40">•</span>{" "}
          <span className={isOpen ? "text-emerald-300 font-semibold" : "text-amber-300 font-semibold"}>
            {label}
          </span>
        </span>
      </div>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold ${
        isOpen ? "text-emerald-700" : "text-amber-700"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          isOpen ? "bg-emerald-500" : "bg-amber-500"
        }`}
      />
      <span>{label}</span>
    </span>
  );
}
