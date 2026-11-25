"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  MapPin,
  Phone,
  Package,
  Search,
  ChevronDown,
  Navigation,
  RefreshCw,
  ExternalLink,
  Star,
  Box,
  PhoneCall,
  XCircle,
  LogOut,
  Smartphone,
  Wrench,
} from "lucide-react";
import LocationModal from "./LocationModal";
import AuthModal from "./AuthModal";
import StoreStatusText from "./StoreStatusText";
import { getStoredUserMobile, clearAuthSession } from "@/lib/api";
import { detectGpsLocation, getStoredLocation, getEtaForDistance, GpsLocationData } from "@/lib/gps";
import { searchDeviceModels, formatDeviceLabel, BrandKey } from "@/data/deviceCatalog";
import { SERVICES_DATA } from "@/data/servicesData";
import { openTrackModal } from "./TrackOrderModal";
import { showFmToast } from "./ToastBanner";

interface HeaderProps {
  onSearch?: (query: string) => void;
}

export default function Header({ onSearch }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [locality, setLocality] = useState<string>("Locating via GPS...");
  const [distance, setDistance] = useState<number | null>(null);
  const [isGps, setIsGps] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [loggedInMobile, setLoggedInMobile] = useState<string | null>(null);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  const applyGpsData = useCallback((data: GpsLocationData) => {
    setLocality(data.locality);
    setDistance(data.distanceKm);
    setIsGps(true);
    setIsDetecting(false);
  }, []);

  const triggerGpsDetection = useCallback(async () => {
    setIsDetecting(true);
    try {
      const data = await detectGpsLocation();
      applyGpsData(data);
    } catch {
      setIsDetecting(false);
      const stored = getStoredLocation();
      if (stored && stored.locality) {
        setLocality(stored.locality);
        setDistance(stored.distanceKm ?? 0);
      } else {
        setLocality("Manikonda Hub");
        setDistance(0.0);
      }
    }
  }, [applyGpsData]);

  useEffect(() => {
    const stored = getStoredLocation();
    const isSavedGps = typeof window !== "undefined" && localStorage.getItem("fm_user_is_gps") === "true";

    if (stored && stored.locality) {
      setLocality(stored.locality);
      setDistance(stored.distanceKm ?? 0);
      setIsGps(isSavedGps);
    } else {
      triggerGpsDetection();
    }

    const handleLocationChange = (e: Event) => {
      const detail = (e as CustomEvent<GpsLocationData>).detail;
      if (detail) {
        applyGpsData(detail);
      }
    };

    window.addEventListener("fm_location_updated", handleLocationChange);
    return () => window.removeEventListener("fm_location_updated", handleLocationChange);
  }, [triggerGpsDetection, applyGpsData]);

  useEffect(() => {
    setLoggedInMobile(getStoredUserMobile());

    const handleAuthChange = (e: Event) => {
      const detail = (e as CustomEvent<{ mobile: string | null }>).detail;
      setLoggedInMobile(detail?.mobile || null);
    };

    window.addEventListener("fm_auth_changed", handleAuthChange);
    return () => window.removeEventListener("fm_auth_changed", handleAuthChange);
  }, []);

  const handleLocSelect = (name: string, km: number) => {
    setLocality(name);
    setDistance(km);
    if (typeof window !== "undefined") {
      setIsGps(localStorage.getItem("fm_user_is_gps") === "true");
    }
  };

  const navLinks = [
    { name: "Services", href: "/services" },
    { name: "Book Repair", href: "/book-repair" },
    { name: "Track Order", href: "/track-booking" },
    { name: "About Us", href: "/about" },
    { name: "Reviews", href: "/reviews" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-[#EBEBEB] transition-all">
        {/* Sleek Urban Company Top Utility Bar (Hidden on Mobile to Maximize Screen Real Estate) */}
        <div className="hidden sm:block bg-[#121212] text-white text-[11px] font-medium py-1.5 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <StoreStatusText variant="dark-bar" />
            <div className="flex items-center gap-5 text-[#B0B0B0]">
              <a
                href="tel:+919063786751"
                className="hover:text-white transition flex items-center gap-1.5"
              >
                <Phone className="w-3 h-3 text-emerald-400" />
                <span>+91 90637 86751</span>
              </a>
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    window.dispatchEvent(new CustomEvent("fm_open_reviews_modal"));
                  }
                }}
                className="hover:text-white transition flex items-center gap-1 cursor-pointer"
                title="View verified customer reviews & Google rating"
              >
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span>4.9/5 (1k+ Google Reviews)</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-60" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Desktop Navbar */}
        <div className="hidden md:flex items-center justify-between max-w-7xl mx-auto px-6 h-16">
          {/* Logo & Location Pill */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-[10px] bg-[#121212] text-white font-bold text-xs flex items-center justify-center shadow-xs group-hover:bg-[#F97316] transition">
                FM
              </div>
              <div className="flex flex-col">
                <span className="text-[15px] font-bold tracking-tight text-[#121212] leading-tight">
                  Famous Mobiles
                </span>
                <span className="text-[10px] font-medium text-[#767676] tracking-tight">
                  Doorstep Repair • Manikonda
                </span>
              </div>
            </Link>

            {/* Urban Company-style Location Selector Pill */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsLocationModalOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-[10px] bg-[#F7F7F8] hover:bg-[#EFEFEF] border border-[#EBEBEB] text-left transition group cursor-pointer"
                title="Select delivery location within 6 km radius"
              >
                {isDetecting ? (
                  <RefreshCw className="w-3.5 h-3.5 text-[#F97316] animate-spin shrink-0" />
                ) : isGps ? (
                  <Navigation className="w-3.5 h-3.5 text-[#16A34A] fill-[#16A34A] shrink-0" />
                ) : (
                  <MapPin className="w-3.5 h-3.5 text-[#F97316] shrink-0" />
                )}
                <div className="text-xs">
                  <span className="font-semibold text-[#121212] block leading-tight flex items-center gap-1">
                    <span className="max-w-[130px] truncate">{isDetecting ? "Detecting GPS..." : locality.split(",")[0]}</span>
                    {isGps && (
                      <span className="text-[9px] bg-emerald-50 text-emerald-800 font-bold px-1 py-0.2 rounded border border-emerald-200">
                        GPS
                      </span>
                    )}
                  </span>
                  <span className="text-[10px] text-[#767676] block leading-none mt-0.5">
                    {isDetecting ? (
                      "Acquiring position..."
                    ) : distance !== null ? (
                      `${distance} km • ${distance > 6.0 ? "Shop Visit Only" : `${getEtaForDistance(distance)} doorstep`}`
                    ) : (
                      "Set location"
                    )}
                  </span>
                </div>
                <ChevronDown className="w-3 h-3 text-[#767676] ml-0.5 group-hover:text-[#121212] transition" />
              </button>

              <button
                type="button"
                onClick={triggerGpsDetection}
                disabled={isDetecting}
                title="Detect Current Location via Device GPS"
                className="p-2 rounded-[10px] bg-[#F7F7F8] hover:bg-[#EFEFEF] border border-[#EBEBEB] text-[#767676] hover:text-[#121212] transition cursor-pointer"
              >
                <Navigation
                  className={`w-3.5 h-3.5 ${
                    isDetecting ? "animate-spin text-[#F97316]" : isGps ? "text-[#16A34A] fill-[#16A34A]" : ""
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Clean Navigation Links */}
          <nav className="flex items-center gap-6 text-[13px] font-medium text-[#555555]">
            {navLinks.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`transition hover:text-[#121212] relative py-1 ${
                    active ? "text-[#121212] font-bold" : ""
                  }`}
                >
                  {item.name}
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F97316] rounded-full"></span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action CTAs */}
          <div className="flex items-center gap-2.5">
            {loggedInMobile ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-[10px] text-[12px] font-bold text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <Package className="w-3.5 h-3.5 text-slate-700" />
                  <span>My Orders</span>
                  <ChevronDown className="w-3 h-3 text-slate-500" />
                </button>

                {isAccountMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Signed In Customer</p>
                      <p className="text-xs font-bold text-slate-900 mt-0.5">+91 {loggedInMobile}</p>
                    </div>

                    <div className="py-1">
                      <Link
                        href="/track-booking"
                        onClick={() => setIsAccountMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-100 transition"
                      >
                        <Package className="w-4 h-4 text-[#F97316]" />
                        <span>Active & Past Repairs</span>
                      </Link>
                    </div>

                    <div className="pt-1 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => {
                          clearAuthSession();
                          setIsAccountMenuOpen(false);
                          showFmToast("Logged out successfully");
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Log out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/track-booking"
                className="flex items-center gap-1.5 px-3 py-2 rounded-[10px] text-[12px] font-medium text-[#121212] hover:bg-[#F7F7F8] border border-[#EBEBEB] transition cursor-pointer"
              >
                <Package className="w-3.5 h-3.5 text-[#767676]" />
                <span>Track Order</span>
              </Link>
            )}

            <Link
              href="/book-repair"
              className="flex items-center gap-1.5 px-4 py-2 rounded-[10px] text-[12px] font-bold bg-[#F97316] hover:bg-[#EA580C] text-white shadow-xs transition active:scale-95"
            >
              <span>Book Doorstep</span>
              <span className="bg-white/20 text-[10px] px-1.5 py-0.2 rounded font-black">₹0 Fee</span>
            </Link>
          </div>
        </div>

        {/* Mobile Minimalist Header (Urban Company Style) */}
        <div className="md:hidden px-4 py-2.5 space-y-2 bg-white">
          <div className="flex items-center justify-between gap-2">
            {/* Left: Brand Identity & Location */}
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <Link href="/" className="font-extrabold text-sm text-[#121212] tracking-tight shrink-0 flex items-center">
                <span>Famous Mobiles</span>
                <span className="text-[#F97316] text-base leading-none">.</span>
              </Link>

              {/* Location Pill Button */}
              <button
                type="button"
                onClick={() => {
                  setIsLocationModalOpen(true);
                  showFmToast("Serving 6 km radius around Manikonda Hub, Hyderabad");
                }}
                className="flex items-center gap-1 text-left min-w-0 bg-[#F7F7F8] hover:bg-[#EFEFEF] border border-[#EBEBEB] px-2.5 py-1 rounded-full text-[11px] transition cursor-pointer"
              >
                <div
                  className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 ${
                    isDetecting
                      ? "text-[#F97316]"
                      : isGps
                      ? "text-[#16A34A]"
                      : "text-[#767676]"
                  }`}
                >
                  {isDetecting ? (
                    <RefreshCw className="w-3 h-3 animate-spin" />
                  ) : isGps ? (
                    <Navigation className="w-3 h-3 fill-[#16A34A]" />
                  ) : (
                    <MapPin className="w-3 h-3 text-slate-500" />
                  )}
                </div>
                <span className="truncate max-w-[100px] font-semibold text-[#121212]">
                  {isDetecting ? "Locating..." : locality.split(",")[0]}
                </span>
                <ChevronDown className="w-3 h-3 text-[#767676] shrink-0" />
              </button>
            </div>

            {/* Right: Quick Action Icons (Track & Call) */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={openTrackModal}
                className="w-8 h-8 rounded-full bg-[#F7F7F8] hover:bg-slate-200 border border-[#EBEBEB] flex items-center justify-center text-[#121212] text-xs transition active:scale-95 cursor-pointer"
                title="Track Repair"
                aria-label="Track Repair"
              >
                <Box className="w-4 h-4 text-[#555555]" />
              </button>
              <a
                href="tel:+919063786751"
                onClick={() => showFmToast("Calling Famous Mobiles Manikonda Dispatch (+91 90637 86751)...")}
                className="w-8 h-8 rounded-full bg-slate-950 hover:bg-slate-800 text-white flex items-center justify-center text-xs transition active:scale-95 shadow-sm"
                title="Call Manikonda Dispatch (+91 90637 86751)"
                aria-label="Call Now"
              >
                <PhoneCall className="w-3.5 h-3.5 text-white" />
              </a>
            </div>
          </div>

          {/* Smart Device & Service Search Input */}
          <div className="relative">
            <div className="relative flex items-center gap-2 bg-[#F7F7F8] rounded-[10px] border border-[#EBEBEB] px-3 py-2 transition focus-within:border-[#F97316] focus-within:bg-white">
              <Search className="w-3.5 h-3.5 text-[#767676] shrink-0" />
              <input
                type="text"
                id="serviceSearch"
                value={searchVal}
                onFocus={() => setIsSearchOpen(true)}
                onChange={(e) => {
                  const val = e.target.value;
                  setSearchVal(val);
                  setIsSearchOpen(true);
                  if (onSearch) onSearch(val);
                  if (typeof window !== "undefined") {
                    window.dispatchEvent(new CustomEvent("fm_search_query", { detail: val }));
                  }
                }}
                placeholder='Search "iPhone 15", "battery", "screen"...'
                className="w-full bg-transparent text-base md:text-xs font-normal text-[#121212] placeholder-[#767676] focus:outline-none pr-5"
              />
              {searchVal && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchVal("");
                    setIsSearchOpen(false);
                    if (onSearch) onSearch("");
                    if (typeof window !== "undefined") {
                      window.dispatchEvent(new CustomEvent("fm_search_query", { detail: "" }));
                    }
                  }}
                  className="absolute right-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  aria-label="Clear search"
                >
                  <XCircle className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {isSearchOpen && searchVal.trim().length > 0 && (() => {
              const q = searchVal.trim().toLowerCase();
              const modelHits = searchDeviceModels(q, 5);
              const serviceHits = SERVICES_DATA.filter(
                (s) =>
                  s.title.toLowerCase().includes(q) ||
                  s.shortDesc.toLowerCase().includes(q) ||
                  s.symptoms.some((sym) => sym.toLowerCase().includes(q))
              ).slice(0, 4);

              if (modelHits.length === 0 && serviceHits.length === 0) return null;

              const handlePickDevice = (brandKey: BrandKey, modelName: string) => {
                setIsSearchOpen(false);
                setSearchVal("");
                if (typeof window !== "undefined") {
                  sessionStorage.setItem("fm_pending_device", JSON.stringify({ brandKey, model: modelName }));
                  window.dispatchEvent(
                    new CustomEvent("fm_select_device", { detail: { brandKey, model: modelName } })
                  );
                  window.dispatchEvent(new CustomEvent("fm_search_query", { detail: "" }));
                }
                showFmToast(`Selected ${formatDeviceLabel(brandKey, modelName, false)}`);
                if (pathname === "/") {
                  document.getElementById("services-section")?.scrollIntoView({ behavior: "smooth" });
                } else {
                  router.push("/#services-section");
                }
              };

              const handlePickService = (slug: string) => {
                setIsSearchOpen(false);
                setSearchVal("");
                if (typeof window !== "undefined") {
                  window.dispatchEvent(new CustomEvent("fm_search_query", { detail: "" }));
                  if (pathname === "/") {
                    window.dispatchEvent(new CustomEvent("fm_select_category", { detail: slug }));
                    document.getElementById("services-section")?.scrollIntoView({ behavior: "smooth" });
                    return;
                  }
                }
                router.push(`/services/${slug}`);
              };

              return (
                <div className="absolute left-0 right-0 mt-1.5 bg-white border border-[#EBEBEB] rounded-xl shadow-xl z-50 max-h-72 overflow-y-auto divide-y divide-slate-100">
                  {modelHits.length > 0 && (
                    <div className="p-2 space-y-1">
                      <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Phone Models
                      </p>
                      {modelHits.map((hit) => (
                        <button
                          key={`${hit.brandKey}-${hit.model}`}
                          type="button"
                          onClick={() => handlePickDevice(hit.brandKey, hit.model)}
                          className="w-full px-2.5 py-2 rounded-lg hover:bg-orange-50 flex items-center justify-between text-left transition cursor-pointer"
                        >
                          <span className="flex items-center gap-2 text-xs font-bold text-slate-900">
                            <Smartphone className="w-3.5 h-3.5 text-[#F97316] shrink-0" />
                            <span>{formatDeviceLabel(hit.brandKey, hit.model, false)}</span>
                          </span>
                          <span className="text-[10.5px] font-semibold text-[#F97316]">Select</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {serviceHits.length > 0 && (
                    <div className="p-2 space-y-1">
                      <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Repair Services
                      </p>
                      {serviceHits.map((srv) => (
                        <button
                          key={srv.slug}
                          type="button"
                          onClick={() => handlePickService(srv.slug)}
                          className="w-full px-2.5 py-2 rounded-lg hover:bg-slate-50 flex items-center justify-between text-left transition cursor-pointer"
                        >
                          <span className="flex items-center gap-2 text-xs font-bold text-slate-900">
                            <Wrench className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                            <span>{srv.title}</span>
                          </span>
                          <span className="text-[10.5px] font-medium text-slate-500">{srv.turnaround}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      </header>

      {/* Location Modal */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        currentLocality={locality}
        onSelectLocality={handleLocSelect}
      />

      {/* Reusable Global Auth Modal */}
      <AuthModal />
    </>
  );
}
