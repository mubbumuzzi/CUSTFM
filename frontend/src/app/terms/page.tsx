import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions — Famous Mobiles",
  description: "Terms and conditions for doorstep mobile repair services provided by Famous Mobiles Manikonda, Hyderabad.",
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-14 space-y-6">
      <h1 className="text-2xl sm:text-4xl font-black text-navy-950">Terms and Conditions</h1>
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed shadow-xs">
        <h2 className="text-base font-bold text-navy-950">1. Service Area & Dispatch</h2>
        <p>Doorstep service is offered within a verified 5 km perimeter around our Manikonda shop. Locations beyond 5 km are eligible for shop walk-in or courier pickup.</p>
        <h2 className="text-base font-bold text-navy-950">2. Home Visit Pricing Rules</h2>
        <p>First home visit is FREE (₹0) for eligible new customers. For subsequent visits, a fee of ₹49 applies. If the customer proceeds with the repair, the ₹49 fee is 100% adjusted against the final repair bill. If the repair is declined after diagnosis, the ₹49 fee is retained as the visit/diagnosis charge.</p>
        <h2 className="text-base font-bold text-navy-950">3. Quote Approval Guarantee</h2>
        <p>No repair is started without customer quotation approval. You have the right to inspect parts and approve pricing before technician begins repair work.</p>
      </div>
    </div>
  );
}
