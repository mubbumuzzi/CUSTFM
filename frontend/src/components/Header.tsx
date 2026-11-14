"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, Phone, Package, Search, Mic, ChevronDown } from "lucide-react";
import LocationModal from "./LocationModal";

interface HeaderProps {
  onSearch?: (query: string) => void;
}

export default function Header({ onSearch }: HeaderProps) {
  const pathname = usePathname();
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [locality, setLocality] = useState("Lanco Hills, Manikonda");
  const [distance, setDistance] = useState(1.4);
  const [searchVal, setSearchVal] = useState("");
  const [oemOnly, setOemOnly] = useState(true);

  const handleLocSelect = (name: string, km: number) => {
    setLocality(name);
    setDistance(km);
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "Book Repair", href: "/book-repair" },
    { name: "Track Order", href: "/track-booking" },
    { name: "About", href: "/about" },
    { name: "Reviews", href: "/reviews" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        {/* Top Express Dispatch Strip */}
        <div className="bg-gradient-to-r from-purple-950 via-navy-900 to-indigo-950 text-white text-[11px] font-bold py-1 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2 mx-auto sm:mx-0">
            <span className="w-2 h-2 rounded-full bg-accent-500 animate-ping"></span>
            <span>⚡ Express Doorstep Mode • Manikonda Shop Active (9 AM – 9 PM)</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-[11px] text-slate-300">
            <span>📞 Call Desk: +91 90637 86751</span>
            <span>⭐ 4.9/5 Rating (657 Reviews)</span>
          </div>
        </div>

        {/* Main Desktop Navbar */}
        <div className="hidden md:flex items-center justify-between max-w-7xl mx-auto px-6 py-3.5">
          {/* Logo & Location */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-accent-500 text-white font-black text-sm flex items-center justify-center shadow-sm">
                FM
              </div>
              <div>
                <span className="text-base font-black tracking-tight text-navy-950 block leading-tight">
                  Famous Mobiles
                </span>
                <span className="text-[10px] font-bold text-accent-600 block leading-none">
                  Doorstep Repair • Manikonda
                </span>
              </div>
            </Link>

            {/* Location selector dropdown */}
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-left transition"
            >
              <MapPin className="w-4 h-4 text-accent-500" />
              <div className="text-xs">
                <span className="font-extrabold text-navy-900 block leading-tight">
                  {locality.split(",")[0]}
                </span>
                <span className="text-[10px] text-slate-500 block leading-none">
                  {distance} km • 45 min
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
            </button>
          </div>

          {/* Navigation links */}
          <nav className="flex items-center gap-5 text-xs font-bold text-slate-600">
            {navLinks.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`transition hover:text-accent-600 py-1 ${
                    active ? "text-accent-600 font-extrabold border-b-2 border-accent-500" : ""
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action CTAs */}
          <div className="flex items-center gap-3">
            <Link
              href="/track-booking"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border border-slate-200 text-navy-900 hover:bg-slate-50"
            >
              <Package className="w-4 h-4 text-slate-600" />
              <span>Track Order</span>
            </Link>
            <Link
              href="/book-repair"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold bg-accent-500 hover:bg-accent-600 text-white shadow-sm transition active:scale-95"
            >
              <span>Book Doorstep Visit</span>
              <span className="bg-white/20 text-[10px] px-1.5 py-0.5 rounded font-black">₹0</span>
            </Link>
          </div>
        </div>

        {/* Mobile Quick-Commerce Header (Blinkit / Zomato style) */}
        <div className="md:hidden px-4 py-2.5 space-y-2 bg-gradient-to-r from-amber-50/60 via-white to-orange-50/60">
          <div className="flex items-center justify-between gap-2">
            {/* Location Selector */}
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="flex items-center gap-2 text-left min-w-0 flex-1"
            >
              <div className="w-8 h-8 rounded-full bg-accent-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1 text-xs font-extrabold text-navy-900">
                  <span className="truncate">{locality.split(",")[0]}</span>
                  <ChevronDown className="w-3 h-3 text-slate-500" />
                </div>
                <div className="text-[10px] font-medium text-slate-500 truncate">
                  {distance} km • 45 min doorstep
                </div>
              </div>
            </button>

            {/* Quick Actions */}
            <div className="flex items-center gap-1.5 shrink-0">
              <Link
                href="/track-booking"
                className="w-8 h-8 rounded-full bg-white border border-amber-300 shadow-xs flex items-center justify-center text-navy-900 text-xs font-bold"
                title="Track Booking"
              >
                <Package className="w-4 h-4 text-navy-900" />
              </Link>
              <a
                href="tel:+919063786751"
                className="w-8 h-8 rounded-full bg-navy-900 text-white shadow-xs flex items-center justify-center text-xs font-bold"
                title="Call Shop"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Search Bar with Voice and OEM Toggle */}
          <div className="flex items-center gap-2 bg-white rounded-2xl border border-amber-300/80 px-3 py-2 shadow-xs">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchVal}
              onChange={(e) => {
                setSearchVal(e.target.value);
                if (onSearch) onSearch(e.target.value);
              }}
              placeholder='Search "iPhone display", "battery"...'
              className="w-full bg-transparent text-xs font-medium text-navy-900 placeholder-slate-400 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => alert('Voice search ready: Try saying "iPhone display repair"')}
              className="text-accent-500 hover:text-accent-600 shrink-0"
              title="Voice Search"
            >
              <Mic className="w-4 h-4" />
            </button>
            <div className="h-3.5 w-px bg-slate-200"></div>
            <label className="flex items-center gap-1 cursor-pointer" title="Original Equipment Manufacturer Parts">
              <span className="text-[9px] font-extrabold text-slate-600 uppercase">OEM</span>
              <input
                type="checkbox"
                checked={oemOnly}
                onChange={(e) => setOemOnly(e.target.checked)}
                className="w-3.5 h-3.5 accent-accent-500 rounded"
              />
            </label>
          </div>
        </div>
      </header>

      {/* Location Modal Sheet */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        currentLocality={locality}
        onSelectLocality={handleLocSelect}
      />
    </>
  );
}
