import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Famous Mobiles",
  description: "Privacy policy for Famous Mobiles doorstep repair service in Manikonda, Hyderabad.",
  alternates: {
    canonical: "https://famousmobiles.com/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-14 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#121212]">Privacy Policy</h1>
        <p className="text-xs text-[#767676]">Last updated: November 2026</p>
      </div>
      <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6 sm:p-8 space-y-4 text-xs sm:text-sm text-[#555555] leading-relaxed shadow-card">
        <h2 className="text-base font-bold text-[#121212]">1. Data We Collect</h2>
        <p>To provide doorstep repair service, we collect only your contact number, preferred address, and device model. We do NOT ask for, store, or view your device screen passcodes or personal files.</p>
        <h2 className="text-base font-bold text-[#121212]">2. Security & Verification</h2>
        <p>Public lookup of order details requires 2-Factor OTP verification sent to your registered mobile number. A bare booking ID alone can never expose customer address or repair information.</p>
        <h2 className="text-base font-bold text-[#121212]">3. Contact</h2>
        <p>For data inquiries, contact Famous Mobiles at support@famousmobiles.com or call +91 90637 86751.</p>
      </div>
    </div>
  );
}
