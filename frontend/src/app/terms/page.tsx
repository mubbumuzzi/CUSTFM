import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions — Famous Mobiles",
  description: "Terms and conditions for doorstep mobile repair services provided by Famous Mobiles Manikonda, Hyderabad.",
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-14 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#121212]">Terms and Conditions</h1>
        <p className="text-xs text-[#767676]">Last updated: November 2026</p>
      </div>
      <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6 sm:p-8 space-y-4 text-xs sm:text-sm text-[#555555] leading-relaxed shadow-card">
        <h2 className="text-base font-bold text-[#121212]">1. Service Area & Dispatch</h2>
        <p>Doorstep service is offered within a verified 6 km perimeter around our Shaikpet / Puppalaguda workshop. Locations beyond 6 km are eligible for shop walk-in.</p>
        <h2 className="text-base font-bold text-[#121212]">2. Home Visit Pricing Rules</h2>
        <p>First home visit is FREE (₹0) for eligible new customers. For subsequent visits, a fee of ₹69 applies. If the customer proceeds with the repair, the ₹69 fee is 100% adjusted against the final repair bill. If the repair is declined after diagnosis, the ₹69 fee is retained as the visit/diagnosis charge.</p>
        <h2 className="text-base font-bold text-[#121212]">3. Quote Approval Guarantee</h2>
        <p>No repair is started without customer quotation approval. You have the right to inspect parts and approve pricing before technician begins repair work.</p>
      </div>
    </div>
  );
}
