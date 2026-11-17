import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { Star, ShieldCheck, ExternalLink, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Customer Reviews & Ratings — Famous Mobiles Manikonda",
  description: "Read genuine customer reviews for Famous Mobiles Manikonda. Rated 4.9/5 by 1k+ customers across Lanco Hills, Puppalaguda, and Alkapoor Township.",
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
      <div className="text-center space-y-1.5">
        <span className="text-xs font-bold uppercase tracking-wider text-[#F97316] bg-[#FFF7ED] px-3 py-1 rounded-full border border-[#FFEDD5]">
          Verified Customer Feedback
        </span>
        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#121212]">
          1k+ Genuine Customer Reviews
        </h1>
        <p className="text-xs sm:text-sm text-[#767676]">
          See why residents across Manikonda and Lanco Hills rate Famous Mobiles 4.9/5 stars.
        </p>
      </div>

      {/* Aggregate Score Card */}
      <div className="bg-white border border-[#EBEBEB] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-card">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="text-4xl sm:text-5xl font-bold text-[#121212]">4.9</div>
          <div>
            <div className="flex items-center gap-1 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-500" />
              ))}
            </div>
            <p className="text-xs text-[#767676] mt-1 font-medium">
              Overall rating based on 1k+ Google Business reviews
            </p>
          </div>
        </div>

        <a
          href="https://share.google/U0L5BeQxKW1dBHUbJ"
          target="_blank"
          rel="noreferrer"
          className="bg-[#121212] hover:bg-[#F97316] text-white text-xs font-bold px-4 py-3 rounded-[10px] shadow-xs transition flex items-center gap-1.5 shrink-0"
        >
          <span>View on Google Profile</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Review Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {REVIEWS.map((rev, i) => (
          <div key={i} className="bg-white rounded-2xl border border-[#EBEBEB] p-5 space-y-3 shadow-card">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-bold text-[#121212]">{rev.name}</h3>
                <span className="text-[11px] text-[#767676]">{rev.locality}</span>
              </div>
              <div className="flex items-center gap-0.5 text-amber-500">
                {[...Array(rev.rating)].map((_, idx) => (
                  <Star key={idx} className="w-3.5 h-3.5 fill-amber-500" />
                ))}
              </div>
            </div>

            <p className="text-xs text-[#555555] leading-relaxed">
              &quot;{rev.comment}&quot;
            </p>

            <div className="pt-2 border-t border-[#EBEBEB] flex items-center justify-between text-[11px] text-[#767676]">
              <span className="font-medium text-[#121212]">{rev.device} • {rev.service}</span>
              <span>{rev.date}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center pt-4">
        <Link
          href="/book-repair"
          className="inline-flex items-center gap-2 bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-[10px] shadow-xs transition"
        >
          <span>Experience It Yourself — Book Repair</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
