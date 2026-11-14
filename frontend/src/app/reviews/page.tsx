import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { Star, ShieldCheck, ExternalLink, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Customer Reviews & Ratings — Famous Mobiles Manikonda",
  description: "Read genuine customer reviews for Famous Mobiles Manikonda. Rated 4.9/5 by 657 customers across Lanco Hills, Puppalaguda, and Alkapoor Township.",
};

const REVIEWS = [
  {
    name: "Vikram R.",
    locality: "Lanco Hills, Manikonda",
    device: "iPhone 14 Pro Max",
    service: "Display Replacement",
    rating: 5,
    date: "November 2026",
    comment: "Technician Ramesh arrived in 35 minutes! Replaced my cracked OLED screen right at my dining table in 30 mins. Display colors and 120Hz ProMotion feel 100% original. First visit was completely free.",
  },
  {
    name: "Ananya Sharma",
    locality: "Puppalaguda Main Rd",
    device: "Samsung Galaxy S23",
    service: "Battery Replacement",
    rating: 5,
    date: "October 2026",
    comment: "My S23 battery was swelling and pushing out the back cover. Famous Mobiles technician brought the genuine Samsung battery pack, tested the charging current, and sealed it back perfectly with warranty.",
  },
  {
    name: "Karthik Reddy",
    locality: "Alkapoor Township",
    device: "OnePlus 11",
    service: "Charging Port Repair",
    rating: 5,
    date: "October 2026",
    comment: "Super transparent service. The technician inspected the port with a microscope tool and showed me that it only had compacted pocket lint. Cleaned it up without charging for part replacement. Very honest!",
  },
  {
    name: "Dr. Srinivas Rao",
    locality: "OU Colony, Shaikpet",
    device: "Vivo X90 Pro",
    service: "Software Repair",
    rating: 5,
    date: "September 2026",
    comment: "Phone was stuck in an endless reboot loop after an Android update. Famous Mobiles recovered the bootloader without losing my contacts or hospital data. Highly recommended local shop.",
  },
];

export default function ReviewsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-14 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-black uppercase tracking-wider text-accent-600 bg-accent-50 px-3 py-1 rounded-full border border-accent-200">
          Verified Customer Feedback
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-navy-950">
          657+ Genuine Customer Reviews
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          See why residents across Manikonda and Lanco Hills rate Famous Mobiles 4.9/5 stars.
        </p>
      </div>

      {/* Aggregate Score Card */}
      <div className="bg-gradient-to-r from-navy-950 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="text-4xl sm:text-5xl font-black text-amber-400">4.9</div>
          <div>
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-300 mt-1 font-semibold">
              Overall rating based on 657 Google Business reviews
            </p>
          </div>
        </div>

        <a
          href="https://share.google/U0L5BeQxKW1dBHUbJ"
          target="_blank"
          rel="noreferrer"
          className="bg-white hover:bg-slate-100 text-navy-950 text-xs font-black px-4 py-3 rounded-xl shadow-md transition flex items-center gap-1.5 shrink-0"
        >
          <span>View on Google Profile</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Review Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {REVIEWS.map((rev, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-xs">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-black text-navy-950">{rev.name}</h3>
                <span className="text-[11px] text-slate-500 font-medium">{rev.locality}</span>
              </div>
              <div className="flex items-center gap-0.5 text-amber-500">
                {[...Array(rev.rating)].map((_, idx) => (
                  <Star key={idx} className="w-3.5 h-3.5 fill-amber-500" />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
              <span>{rev.device}</span>
              <span>•</span>
              <span className="text-accent-600">{rev.service}</span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed italic">
              &quot;{rev.comment}&quot;
            </p>

            <div className="text-[10px] text-slate-400 text-right">
              Verified Repair • {rev.date}
            </div>
          </div>
        ))}
      </div>

      {/* Book CTA */}
      <div className="text-center pt-4">
        <Link
          href="/book-repair"
          className="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white font-black text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-md transition active:scale-95"
        >
          <span>Experience 5-Star Doorstep Repair Now</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
