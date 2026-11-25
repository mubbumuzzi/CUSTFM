"use client";

import React, { useState, useEffect } from "react";
import {
  Smartphone,
  ChevronDown,
  ShieldCheck,
  Check,
  Plus,
  ArrowRight,
  MessageSquare,
  MapPin,
  Search,
  XCircle,
  Clock,
} from "lucide-react";
import { SERVICES_DATA, ServiceItem } from "@/data/servicesData";
import {
  DEVICE_CATALOG,
  BrandKey,
  PART_GRADES,
  PartGrade,
  formatDeviceLabel,
  searchDeviceModels,
} from "@/data/deviceCatalog";
import { BUSINESS_INFO } from "@/lib/businessInfo";
import { getStoredLocation } from "@/lib/gps";
import ModelPickerModal from "./ModelPickerModal";
import ServiceDetailsDrawer from "./ServiceDetailsDrawer";
import CheckoutSheetModal from "./CheckoutSheetModal";

const CATEGORY_TABS = [
  { id: "all", label: "All" },
  { id: "display-replacement", label: "Screen" },
  { id: "battery-replacement", label: "Battery" },
  { id: "charging-port-repair", label: "Charging" },
  { id: "software-repair", label: "Software" },
  { id: "hardware-repair", label: "Mic & Cam" },
  { id: "water-damage-diagnosis", label: "Water" },
] as const;

export default function SplitPaneBookingBuilder() {
  const [brand, setBrand] = useState<BrandKey>("apple");
  const [model, setModel] = useState<string>("iPhone 16 Pro Max");
  const [isCustomModel, setIsCustomModel] = useState(false);
  const [partGrade, setPartGrade] = useState<PartGrade>("OEM Service Pack");

  const [category, setCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [cartSlugs, setCartSlugs] = useState<string[]>(["display-replacement"]);

  const [isModelPickerOpen, setIsModelPickerOpen] = useState(false);
  const [activeDetailsService, setActiveDetailsService] = useState<ServiceItem | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  useEffect(() => {
    try {
      const pending = sessionStorage.getItem("fm_pending_device");
      if (pending) {
        const parsed = JSON.parse(pending) as { brandKey?: BrandKey; model?: string };
        if (parsed.brandKey && DEVICE_CATALOG[parsed.brandKey] && parsed.model) {
          setBrand(parsed.brandKey);
          setModel(parsed.model);
          setIsCustomModel(false);
        }
        sessionStorage.removeItem("fm_pending_device");
      }
    } catch {
      // ignore malformed storage
    }

    const handleHeaderSearch = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      if (typeof detail === "string") {
        setSearchQuery(detail);
      }
    };
    const handleOpenSplitCheckout = () => {
      setIsCheckoutOpen(true);
    };
    const handleSelectDevice = (e: Event) => {
      const detail = (e as CustomEvent<{ brandKey: BrandKey; model: string }>).detail;
      if (detail?.brandKey && DEVICE_CATALOG[detail.brandKey] && detail?.model) {
        setBrand(detail.brandKey);
        setModel(detail.model);
        setIsCustomModel(false);
        setSearchQuery("");
        sessionStorage.removeItem("fm_pending_device");
      }
    };
    const handleSelectCategory = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      if (typeof detail === "string") {
        setCategory(detail);
        setSearchQuery("");
      }
    };

    window.addEventListener("fm_search_query", handleHeaderSearch);
    window.addEventListener("fm_open_split_checkout", handleOpenSplitCheckout);
    window.addEventListener("fm_select_device", handleSelectDevice);
    window.addEventListener("fm_select_category", handleSelectCategory);
    return () => {
      window.removeEventListener("fm_search_query", handleHeaderSearch);
      window.removeEventListener("fm_open_split_checkout", handleOpenSplitCheckout);
      window.removeEventListener("fm_select_device", handleSelectDevice);
      window.removeEventListener("fm_select_category", handleSelectCategory);
    };
  }, []);

  const deviceLabel = formatDeviceLabel(brand, model, isCustomModel);

  const selectedServices = cartSlugs
    .map((slug) => SERVICES_DATA.find((s) => s.slug === slug))
    .filter((s): s is ServiceItem => Boolean(s));

  useEffect(() => {
    const titles = cartSlugs
      .map((slug) => SERVICES_DATA.find((s) => s.slug === slug)?.title)
      .filter((t): t is string => Boolean(t));
    window.dispatchEvent(
      new CustomEvent("fm_builder_context", {
        detail: {
          deviceLabel,
          partGrade,
          services: titles,
        },
      })
    );
  }, [deviceLabel, partGrade, cartSlugs]);

  const modelMatches = searchQuery.trim() ? searchDeviceModels(searchQuery, 4) : [];

  const filteredServices = SERVICES_DATA.filter((service) => {
    const matchesCat = category === "all" || service.slug === category;
    if (!matchesCat) return false;
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    const haystack = [
      service.title,
      service.shortDesc,
      service.tag,
      service.turnaround,
      ...service.symptoms,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });

  const handleSelectBrand = (bKey: BrandKey) => {
    setBrand(bKey);
    setIsCustomModel(false);
    setModel(DEVICE_CATALOG[bKey].series[0].models[0]);
  };

  const handleToggleService = (slug: string) => {
    setCartSlugs((prev) =>
      prev.includes(slug) ? prev.filter((item) => item !== slug) : [...prev, slug]
    );
  };

  const handleOpenWhatsApp = () => {
    const storedLoc = getStoredLocation();
    const locLabel = storedLoc?.locality || "Manikonda, Hyderabad";
    const serviceNames =
      selectedServices.length > 0
        ? selectedServices.map((s) => s.title).join(", ")
        : "Free Doorstep Inspection";
    const msg =
      `Hi Famous Mobiles (${BUSINESS_INFO.url}),\n` +
      `Device: ${deviceLabel} (${partGrade})\n` +
      `Services: ${serviceNames}\n` +
      `Locality: ${locLabel}\n` +
      `Requesting ₹0 First Home Visit & upfront quote.`;
    window.open(
      `${BUSINESS_INFO.whatsappBase}?text=${encodeURIComponent(msg)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <>
      {/* ================================================================= */}
      {/* COMPACT 2-ROW DEVICE SELECTOR                                     */}
      {/* ================================================================= */}
      <div className="bg-[#F8F9FA] border border-slate-200/80 rounded-2xl p-3 sm:p-4 space-y-3">
        {/* Row 1: 7 Brand Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {(Object.entries(DEVICE_CATALOG) as [BrandKey, (typeof DEVICE_CATALOG)[BrandKey]][]).map(
            ([bKey, bObj]) => {
              const active = brand === bKey && !isCustomModel;
              return (
                <button
                  key={bKey}
                  type="button"
                  onClick={() => handleSelectBrand(bKey)}
                  className={`shrink-0 h-9 px-3 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                    active
                      ? "bg-slate-950 text-white border-slate-950"
                      : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {bObj.label}
                </button>
              );
            }
          )}
        </div>

        {/* Row 2: Model Picker + Part Grade Toggle */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
          <button
            type="button"
            onClick={() => setIsModelPickerOpen(true)}
            aria-label="Select your phone model"
            className="sm:col-span-7 h-11 bg-white border border-slate-200 hover:border-slate-900 rounded-xl px-3.5 flex items-center justify-between gap-2 text-left transition cursor-pointer"
          >
            <div className="min-w-0 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-[#F97316] shrink-0" />
              <span className="text-xs sm:text-sm font-bold text-slate-950 truncate">
                {deviceLabel}
              </span>
            </div>
            <span className="text-[11px] font-semibold text-slate-500 inline-flex items-center gap-1 shrink-0">
              <span>Change</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </span>
          </button>

          <div className="sm:col-span-5 grid grid-cols-2 p-1 bg-white border border-slate-200 rounded-xl h-11">
            {PART_GRADES.map((grade) => {
              const active = partGrade === grade;
              const shortLabel = grade === "OEM Service Pack" ? "OEM Pack" : "Premium Grade";
              return (
                <button
                  key={grade}
                  type="button"
                  onClick={() => setPartGrade(grade)}
                  className={`rounded-lg text-xs font-bold transition cursor-pointer ${
                    active
                      ? "bg-slate-950 text-white"
                      : "text-slate-600 hover:text-slate-950"
                  }`}
                >
                  <span className="sm:hidden">{shortLabel}</span>
                  <span className="hidden sm:inline">{grade}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ================================================================= */}
      {/* 12-COLUMN SPLIT-PANE CATALOG & SUMMARY SIDEBAR                    */}
      {/* ================================================================= */}
      <div id="services-section" className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start scroll-mt-20">
        {/* LEFT 7 COLUMNS: CLEAN REPAIR CATALOG */}
        <section className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 shadow-card overflow-hidden">
          {/* Header + Inline Filter Tabs */}
          <div className="px-4 sm:px-5 pt-4 pb-3 border-b border-slate-100 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm sm:text-base font-bold text-slate-950 truncate">
                Repairs for {deviceLabel}
              </h2>

              <div className="relative hidden sm:block shrink-0">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search model or repair..."
                  aria-label="Search phone model or repair package"
                  className="h-8 pl-8 pr-7 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#F97316] text-xs font-medium text-slate-900 outline-none w-44 transition"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear filter"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Clean Category Pill Bar */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {CATEGORY_TABS.map((tab) => {
                const active = category === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setCategory(tab.id)}
                    className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                      active
                        ? "bg-[#FFF7ED] text-[#F97316] border border-[#FFEDD5] font-bold"
                        : "bg-slate-50 text-slate-600 border border-transparent hover:bg-slate-100"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {modelMatches.length > 0 && (
            <div className="px-4 py-2.5 bg-orange-50/60 border-b border-orange-100 flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-600 mr-1">
                Switch device:
              </span>
              {modelMatches.map((hit) => (
                <button
                  key={`${hit.brandKey}-${hit.model}`}
                  type="button"
                  onClick={() => {
                    setBrand(hit.brandKey);
                    setModel(hit.model);
                    setIsCustomModel(false);
                    setSearchQuery("");
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white border border-orange-200 hover:border-[#F97316] text-[11px] font-bold text-slate-900 transition cursor-pointer"
                >
                  {formatDeviceLabel(hit.brandKey, hit.model, false)}
                </button>
              ))}
            </div>
          )}

          {filteredServices.length === 0 ? (
            <div className="p-8 text-center space-y-3">
              <p className="font-bold text-sm text-slate-900">
                {modelMatches.length > 0
                  ? `Tap a device chip above or show all repairs for ${deviceLabel}`
                  : `No repair packages match "${searchQuery}"`}
              </p>
              <button
                type="button"
                onClick={() => {
                  setCategory("all");
                  setSearchQuery("");
                }}
                className="h-9 px-4 rounded-lg border border-slate-200 text-xs font-semibold text-slate-800 hover:bg-slate-50 cursor-pointer"
              >
                Show All Services
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredServices.map((service) => {
                const isAdded = cartSlugs.includes(service.slug);
                return (
                  <div
                    key={service.slug}
                    className="p-4 flex items-center justify-between gap-3.5 hover:bg-slate-50/60 transition"
                  >
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center text-xl shrink-0 mt-0.5">
                        {service.icon}
                      </div>

                      <div className="min-w-0 space-y-1">
                        <h3 className="font-bold text-sm text-slate-950 leading-snug">
                          {service.title}
                        </h3>
                        <p className="text-[11.5px] text-slate-500 flex flex-wrap items-center gap-1.5">
                          <span className="inline-flex items-center gap-1 font-medium">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {service.turnaround}
                          </span>
                          <span>·</span>
                          <span className="text-emerald-700 font-semibold">{service.warranty}</span>
                        </p>
                        <p className="text-xs text-slate-600 line-clamp-1">
                          {service.shortDesc}
                        </p>
                        <button
                          type="button"
                          onClick={() => setActiveDetailsService(service)}
                          className="text-[11.5px] font-bold text-[#F97316] hover:underline cursor-pointer"
                        >
                          View details
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleService(service.slug)}
                      className={`min-h-[40px] px-3.5 rounded-xl text-xs font-bold transition shrink-0 inline-flex items-center gap-1 cursor-pointer ${
                        isAdded
                          ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                          : "bg-white hover:bg-[#FFF7ED] text-[#F97316] border border-[#FFEDD5]"
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Mobile Inline Summary Trigger (Inside Catalog Bottom — No Double Sticky Bar!) */}
          <div className="lg:hidden p-4 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-950 truncate">
                {selectedServices.length > 0
                  ? `${selectedServices.length} selected · ₹0 First Visit`
                  : "₹0 Free Doorstep Inspection"}
              </p>
              <p className="text-[11px] text-slate-500 truncate">{deviceLabel}</p>
            </div>
            <button
              type="button"
              onClick={() => setIsCheckoutOpen(true)}
              className="shrink-0 min-h-[42px] px-4 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-bold transition inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>Book Slot</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>

        {/* RIGHT 5 COLUMNS: UNIFIED STICKY SUMMARY CARD */}
        <aside className="lg:col-span-5 lg:sticky lg:top-24">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="min-w-0">
                <h2 className="font-bold text-base text-slate-950">
                  Repair Summary
                </h2>
                <p className="text-xs text-slate-500 mt-0.5 truncate">
                  {deviceLabel} · {partGrade}
                </p>
              </div>
              <span className="text-xs font-bold text-[#F97316] bg-[#FFF7ED] border border-[#FFEDD5] px-2.5 py-1 rounded-lg shrink-0">
                {selectedServices.length} added
              </span>
            </div>

            {selectedServices.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 p-3.5 text-center">
                <p className="text-xs text-slate-600">
                  Select services on the left or book a <strong>₹0 Doorstep Inspection</strong>.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {selectedServices.map((item) => (
                  <div
                    key={item.slug}
                    className="flex items-center justify-between gap-3 py-2 px-3 rounded-xl bg-slate-50 border border-slate-200/70"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {item.turnaround} · {item.warranty}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggleService(item.slug)}
                      className="text-xs font-semibold text-rose-600 hover:underline shrink-0 cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="rounded-xl bg-[#F0FDF4] border border-[#DCFCE7] px-3.5 py-2.5 text-[11.5px] text-emerald-900 space-y-0.5">
              <p className="font-bold flex items-center justify-between">
                <span>First Home Visit</span>
                <span className="text-emerald-700">₹0 FREE</span>
              </p>
              <p className="text-emerald-900/80">
                Upfront quote after check (subsequent visits ₹69, adjusted in bill).
              </p>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setIsCheckoutOpen(true)}
                className="w-full min-h-[46px] bg-[#F97316] hover:bg-[#EA580C] active:scale-[0.99] transition text-white font-bold text-sm rounded-xl px-4 flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <span>Select Slot &amp; Address</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleOpenWhatsApp}
                className="w-full min-h-[42px] bg-white hover:bg-slate-50 border border-slate-200 transition text-slate-900 font-bold text-xs rounded-xl px-4 flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-[#15803D]" />
                <span>WhatsApp Quote ({BUSINESS_INFO.phoneDisplay})</span>
              </button>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-[11px] text-slate-500">
              <span className="inline-flex items-center gap-1 truncate">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Zero Passcode • Famous Cover</span>
              </span>
              <a
                href={BUSINESS_INFO.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-slate-700 hover:text-[#F97316] shrink-0"
              >
                <MapPin className="w-3 h-3" />
                <span>Shaikpet Hub</span>
              </a>
            </div>
          </div>
        </aside>
      </div>

      {/* Modals & Drawers */}
      <ModelPickerModal
        isOpen={isModelPickerOpen}
        onClose={() => setIsModelPickerOpen(false)}
        activeBrand={brand}
        selectedModel={model}
        isCustomModel={isCustomModel}
        onSelectModel={(chosenModel, chosenBrand, custom) => {
          setBrand(chosenBrand);
          setModel(chosenModel);
          setIsCustomModel(custom);
        }}
      />

      <ServiceDetailsDrawer
        service={activeDetailsService}
        deviceLabel={deviceLabel}
        partGrade={partGrade}
        isAdded={
          activeDetailsService ? cartSlugs.includes(activeDetailsService.slug) : false
        }
        onClose={() => setActiveDetailsService(null)}
        onToggleService={handleToggleService}
        onWhatsApp={handleOpenWhatsApp}
      />

      <CheckoutSheetModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        deviceLabel={deviceLabel}
        partGrade={partGrade}
        selectedServiceTitles={selectedServices.map((s) => s.title)}
      />
    </>
  );
}
