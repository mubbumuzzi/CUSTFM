import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { ArrowRight, HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Frequently Asked Questions — Famous Mobiles",
  description: "Common questions about doorstep mobile repair in Manikonda, Hyderabad. Pricing, warranty, parts quality, and turnaround times.",
};

const FAQS = [
  {
    q: "How does the 'First Home Visit is FREE' offer work?",
    a: "For all eligible new customers located within our 5 km Manikonda service perimeter, our technician visits your doorstep for ₹0. If you decline the repair after diagnosis, you pay ₹0. Subsequent visits cost ₹49, which is 100% adjusted against your final repair bill if the repair proceeds.",
  },
  {
    q: "Do I need to give my phone passcode / PIN to the technician?",
    a: "Never! All repairs are performed in front of you. We test touch functionality, camera, and display without unlocking your private apps. Your personal photos, chats, and banking apps remain completely private.",
  },
  {
    q: "What warranty do you provide on replacement parts?",
    a: "Display panels and battery replacements carry up to 6 Months Warranty. Charging ports and secondary board repairs carry 3 Months Warranty. If any covered defect arises, our technician revisits your doorstep to replace it free of charge.",
  },
  {
    q: "What areas in Manikonda do you cover for 45-minute doorstep repair?",
    a: "We cover all residential and commercial communities within 5 km of our shop, including Lanco Hills, Puppalaguda Main Rd, Alkapoor Township, OU Colony, Shaikpet, Secretariat Colony, and Manikonda Main Rd.",
  },
  {
    q: "Why can't water damage be repaired at doorstep?",
    a: "Liquid damage causes corrosion under motherboard micro-chips that requires an ultrasonic chemical bath and thermal microscope in our Manikonda workshop. We provide free doorstep pickup and safe return.",
  },
  {
    q: "What payment modes do you accept upon repair completion?",
    a: "We accept UPI (Google Pay, PhonePe, Paytm), cash, and digital net-banking only after you thoroughly test your repaired device.",
  },
];

export default function FaqPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-14 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-black uppercase tracking-wider text-accent-600 bg-accent-50 px-3 py-1 rounded-full border border-accent-200">
          Got Questions?
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-navy-950">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Clear answers about doorstep mobile repair, pricing, and warranty policies.
        </p>
      </div>

      <div className="space-y-3">
        {FAQS.map((faq, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2 shadow-xs">
            <h2 className="text-sm font-extrabold text-navy-950 flex items-start gap-2">
              <HelpCircle className="w-4 h-4 text-accent-500 shrink-0 mt-0.5" />
              <span>{faq.q}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-6">
              {faq.a}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-amber-50 border border-amber-300 rounded-3xl p-6 text-center space-y-3">
        <h3 className="text-base font-black text-navy-950">Have a specific question?</h3>
        <p className="text-xs text-slate-600">Call our Manikonda workshop desk directly at +91 90637 86751 or book a free doorstep visit.</p>
        <Link
          href="/book-repair"
          className="inline-flex items-center gap-1.5 bg-accent-500 hover:bg-accent-600 text-white font-black text-xs px-5 py-3 rounded-xl transition"
        >
          <span>Book Free Doorstep Visit →</span>
        </Link>
      </div>
    </div>
  );
}
