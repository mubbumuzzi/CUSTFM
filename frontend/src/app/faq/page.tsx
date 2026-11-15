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
    q: "Which areas are covered under your 6 km doorstep pickup and delivery?",
    a: "We cover all neighborhoods within 6 km of our Shaikpet Main Road / Puppalaguda store, including Manikonda, Alkapur Township, Lanco Hills, OU Colony, Shaikpet, Tolichowki, Narsingi, Kokapet, Raidurg, Gachibowli, Film Nagar, Jubilee Hills, and Mehdipatnam.",
  },
  {
    q: "What are your store timings? Are you open late at night?",
    a: "Yes. New Famous Mobile is open daily from 10:00 AM to 3:00 AM at Opp Friends Colony Bus Stop, Shaikpet Main Road, Puppalaguda, allowing emergency late-night screen, battery, and charging repairs.",
  },
  {
    q: "How does the 'First Home Visit is FREE' offer work?",
    a: "For all eligible new customers located within our 6 km service perimeter, our technician visits your doorstep for ₹0. If you decline the repair after diagnosis, you pay ₹0. Subsequent visits cost ₹69, which is 100% adjusted against your final repair bill if the repair proceeds.",
  },
  {
    q: "How fast can my phone be repaired?",
    a: "Most screen, battery, and charging port replacements take 30 to 60 minutes for walk-in customers and 2 to 3 hours round-trip for 6 km doorstep pickup orders.",
  },
  {
    q: "Do you offer original screens and batteries?",
    a: "Yes. We provide upfront quotes for both Original/Service-Pack parts and budget-friendly compatible options with clear warranty terms.",
  },
  {
    q: "How does doorstep pickup work for gated communities like Lanco Hills or Alkapur Township?",
    a: "Upon slot confirmation via website or WhatsApp (+91 9063786751), we share our rider's details immediately for MyGate, NoBrokerHood, or security gate approval.",
  },
  {
    q: "Do I need to give my phone passcode / PIN to the technician?",
    a: "Never! All repairs are performed in front of you. We test touch functionality, camera, and display without unlocking your private apps. Your personal photos, chats, and banking apps remain completely private.",
  },
  {
    q: "What warranty do you provide on replacement parts?",
    a: "Display panels carry up to 6 Months Warranty, while battery replacements carry an extended up to 8 Months Warranty. Charging ports and secondary board repairs carry 3 Months Warranty. If any covered defect arises, our technician revisits your doorstep to replace it free of charge.",
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
