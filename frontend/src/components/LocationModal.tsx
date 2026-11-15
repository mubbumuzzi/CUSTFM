"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  MapPin,
  X,
  CheckCircle2,
  AlertTriangle,
  Navigation,
  RefreshCw,
  Search,
  ArrowLeft,
  Clock,
  Sparkles,
  ExternalLink,
  History,
} from "lucide-react";
import {
  detectGpsLocation,
  searchPlacesApi,
  reverseGeocode,
  calculateDistanceKm,
  getEtaForDistance,
  GpsLocationData,
  PlaceSuggestion,
  MAX_RADIUS_KM,
  SHOP_LAT,
  SHOP_LNG,
} from "@/lib/gps";

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocality: string;
  onSelectLocality: (name: string, km: number, eligible: boolean) => void;
}

interface SavedLocationItem {
  id: string;
  title: string;
  address: string;
  latitude: number;
  longitude: number;
  distanceKm: number;
  eligible: boolean;
  isGps?: boolean;
}

const POPULAR_HUBS = [
  { name: "Puppalaguda Main Rd", suburb: "Manikonda", lat: 17.4000, lng: 78.3862, km: 0.7, eligible: true, note: "Doorstep Eligible • 15-25 mins" },
  { name: "OU Colony / Shaikpet", suburb: "Shaikpet", lat: 17.4085, lng: 78.3980, km: 1.1, eligible: true, note: "Doorstep Eligible • 15-25 mins" },
  { name: "Lanco Hills", suburb: "Manikonda", lat: 17.4045, lng: 78.3752, km: 1.4, eligible: true, note: "Doorstep Eligible • 15-25 mins" },
  { name: "Secretariat Colony", suburb: "Manikonda", lat: 17.4055, lng: 78.3768, km: 1.2, eligible: true, note: "Doorstep Eligible • 15-25 mins" },
  { name: "Alkapoor Township", suburb: "Manikonda", lat: 17.3967, lng: 78.3717, km: 2.0, eligible: true, note: "Doorstep Eligible • 25-35 mins" },
  { name: "Tolichowki", suburb: "Hyderabad", lat: 17.4020, lng: 78.4110, km: 2.5, eligible: true, note: "Doorstep Eligible • 25-35 mins" },
  { name: "Khajaguda", suburb: "Gachibowli", lat: 17.4200, lng: 78.3680, km: 2.6, eligible: true, note: "Doorstep Eligible • 25-35 mins" },
  { name: "Gachibowli", suburb: "Cyberabad", lat: 17.4400, lng: 78.3489, km: 5.6, eligible: true, note: "Doorstep Eligible • 45-60 mins" },
  { name: "Kondapur", suburb: "Cyberabad", lat: 17.4650, lng: 78.3580, km: 7.3, eligible: false, note: "Exceeds 6 km • Free In-Store Visit" },
];

export default function LocationModal({
  isOpen,
  onClose,
  currentLocality,
  onSelectLocality,
}: LocationModalProps) {
  // Step: "SEARCH" (search & quick picks) or "CONFIRM" (map pin confirmation)
  const [step, setStep] = useState<"SEARCH" | "CONFIRM">("SEARCH");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<PlaceSuggestion[]>([]);
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsError, setGpsError] = useState("");
  const [savedLocations, setSavedLocations] = useState<SavedLocationItem[]>([]);

  // Selected candidate awaiting user confirmation on map view
  const [selectedLoc, setSelectedLoc] = useState<GpsLocationData | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Reset step to SEARCH whenever modal opens
    setStep("SEARCH");
    setSearchQuery("");
    setSearchResults([]);
    setGpsError("");

    // Load recent locations from localStorage
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("fm_recent_locations");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setSavedLocations(parsed.slice(0, 3));
          }
        }
      } catch (err) {
        console.warn("Could not parse saved locations:", err);
      }
    }

    // Auto-focus search input
    const timer = setTimeout(() => searchInputRef.current?.focus(), 150);
    return () => clearTimeout(timer);
  }, [isOpen]);

  // Debounced search query with race-condition prevention
  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (!trimmed || trimmed.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    let isCurrent = true;

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const results = await searchPlacesApi(trimmed);
        if (isCurrent) {
          setSearchResults(results);
        }
      } catch (err) {
        if (isCurrent) {
          console.warn("Place search failed:", err);
        }
      } finally {
        if (isCurrent) {
          setIsSearching(false);
        }
      }
    }, 280);

    return () => {
      isCurrent = false;
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [searchQuery]);

  if (!isOpen) return null;

  // 1. Trigger GPS Auto-Detection (Zomato/Swiggy "Use Current Location")
  const handleDetectGps = async () => {
    setGpsError("");
    setIsDetectingGps(true);

    try {
      const result = await detectGpsLocation();
      setIsDetectingGps(false);
      setSelectedLoc(result);
      setStep("CONFIRM");
    } catch (err: unknown) {
      setIsDetectingGps(false);
      const msg = err instanceof Error ? err.message : "Could not determine GPS position.";
      setGpsError(msg);
    }
  };

  // 2. Select a search result or popular hub -> go to map confirm view
  const handlePickPlace = (
    title: string,
    formattedAddress: string,
    lat: number,
    lng: number,
    distKm?: number,
    isGps = false
  ) => {
    const distanceKm = typeof distKm === "number" ? distKm : calculateDistanceKm(lat, lng);
    const eligible = distanceKm <= MAX_RADIUS_KM;
    const eta = getEtaForDistance(distanceKm);

    setSelectedLoc({
      areaTitle: title.split(",")[0]?.trim(),
      locality: title,
      formattedAddress,
      latitude: lat,
      longitude: lng,
      distanceKm,
      eligible,
      eta,
      source: isGps ? "GPS" : "SEARCH",
    });

    setStep("CONFIRM");
  };

  // 3. User taps "Confirm Location"
  const handleConfirmLocation = () => {
    if (!selectedLoc) return;

    if (typeof window !== "undefined") {
      const areaTitle = selectedLoc.areaTitle || selectedLoc.locality.split(",")[0]?.trim();
      localStorage.setItem("fm_user_locality", selectedLoc.locality);
      localStorage.setItem("fm_user_area_title", areaTitle);
      localStorage.setItem("fm_user_distance", String(selectedLoc.distanceKm));
      localStorage.setItem("fm_user_lat", String(selectedLoc.latitude));
      localStorage.setItem("fm_user_lng", String(selectedLoc.longitude));
      localStorage.setItem("fm_user_is_gps", selectedLoc.source === "GPS" ? "true" : "false");
      localStorage.setItem("fm_user_eligible", String(selectedLoc.eligible));
      localStorage.setItem("fm_user_eta", selectedLoc.eta);

      // Save to recent locations history
      try {
        const item: SavedLocationItem = {
          id: `saved-${Date.now()}`,
          title: areaTitle,
          address: selectedLoc.formattedAddress || selectedLoc.locality,
          latitude: selectedLoc.latitude,
          longitude: selectedLoc.longitude,
          distanceKm: selectedLoc.distanceKm,
          eligible: selectedLoc.eligible,
          isGps: selectedLoc.source === "GPS",
        };
        const currentList: SavedLocationItem[] = JSON.parse(
          localStorage.getItem("fm_recent_locations") || "[]"
        );
        const filtered = currentList.filter(
          (x) => Math.abs(x.latitude - selectedLoc.latitude) > 0.001
        );
        const updated = [item, ...filtered].slice(0, 4);
        localStorage.setItem("fm_recent_locations", JSON.stringify(updated));
      } catch (err) {
        console.warn("Could not save to recent locations:", err);
      }

      // Broadcast update to Header and all components
      window.dispatchEvent(
        new CustomEvent("fm_location_updated", { detail: selectedLoc })
      );
    }

    onSelectLocality(selectedLoc.locality, selectedLoc.distanceKm, selectedLoc.eligible);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-2xl p-5 space-y-4 shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
          <div className="flex items-center gap-2">
            {step === "CONFIRM" && (
              <button
                type="button"
                onClick={() => setStep("SEARCH")}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition"
                title="Back to search"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div className="w-8 h-8 rounded-full bg-accent-50 text-accent-600 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-navy-900">
                {step === "CONFIRM" ? "Confirm Delivery Location" : "Select Location"}
              </h3>
              <p className="text-[11px] text-slate-500">
                Famous Mobiles Manikonda (6 km doorstep service area)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* STEP 1: SEARCH & QUICK SELECT VIEW */}
        {step === "SEARCH" && (
          <div className="space-y-4 overflow-y-auto pr-1">
            {/* 1. Place Search Bar (Zomato/Swiggy style) */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='Search for area, apartment, street (e.g. "Lanco Hills")...'
                className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs font-semibold text-navy-950 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 transition shadow-2xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* 2. Live Search Results Dropdown */}
            {searchQuery.trim().length >= 2 && (
              <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 bg-white shadow-xs max-h-56 overflow-y-auto">
                {isSearching ? (
                  <div className="p-4 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-accent-500" />
                    <span>Searching Hyderabad localities...</span>
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-500">
                    No matching areas found. Try a nearby landmark or apartment name.
                  </div>
                ) : (
                  searchResults.map((result) => (
                    <button
                      key={result.placeId}
                      type="button"
                      onClick={() =>
                        handlePickPlace(
                          result.title,
                          result.subtitle,
                          result.latitude,
                          result.longitude,
                          result.distanceKm
                        )
                      }
                      className="w-full text-left p-3 hover:bg-slate-50 transition flex items-center justify-between group"
                    >
                      <div className="min-w-0 pr-2">
                        <p className="text-xs font-bold text-navy-950 truncate group-hover:text-accent-600 transition-colors">
                          {result.title}
                        </p>
                        <p className="text-[10px] text-slate-500 truncate mt-0.5">
                          {result.subtitle}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <span
                          className={`inline-block text-[9px] font-extrabold px-1.5 py-0.5 rounded ${
                            result.eligible
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {result.distanceKm} km
                        </span>
                        <p className="text-[9px] text-slate-400 mt-0.5">
                          {result.eligible ? "Doorstep" : "Shop Visit"}
                        </p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}

            {/* 3. Primary GPS Button ("Use Current Location") */}
            <div className="space-y-1.5">
              <button
                type="button"
                onClick={handleDetectGps}
                disabled={isDetectingGps}
                className="w-full bg-gradient-to-r from-accent-500 via-orange-500 to-amber-500 hover:from-accent-600 hover:to-orange-600 text-white p-3 rounded-xl shadow-sm transition active:scale-[0.99] flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
                    {isDetectingGps ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    ) : (
                      <Navigation className="w-4 h-4 text-white group-hover:rotate-12 transition-transform" />
                    )}
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-black flex items-center gap-1.5">
                      <span>{isDetectingGps ? "Acquiring Device GPS..." : "Use Current Location"}</span>
                      <span className="text-[9px] font-bold bg-white/20 px-1 rounded uppercase">GPS</span>
                    </div>
                    <div className="text-[10px] text-white/90 font-medium">
                      {isDetectingGps ? "Resolving precise street address..." : "Using device GPS • High accuracy"}
                    </div>
                  </div>
                </div>
                <span className="text-[11px] font-extrabold bg-white text-navy-950 px-2.5 py-1 rounded-lg shrink-0 shadow-2xs">
                  {isDetectingGps ? "..." : "Detect"}
                </span>
              </button>

              {gpsError && (
                <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-800 font-semibold flex items-start gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-600 mt-0.5" />
                  <span>{gpsError}</span>
                </div>
              )}
            </div>

            {/* 4. Recent / Saved Locations (if user has any) */}
            {savedLocations.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 px-0.5">
                  <History className="w-3 h-3" />
                  <span>Recently Used Locations</span>
                </div>
                <div className="grid grid-cols-1 gap-1.5">
                  {savedLocations.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() =>
                        handlePickPlace(
                          item.title,
                          item.address,
                          item.latitude,
                          item.longitude,
                          item.distanceKm,
                          item.isGps
                        )
                      }
                      className="text-left p-2.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition flex items-center justify-between"
                    >
                      <div className="min-w-0 pr-2">
                        <p className="text-xs font-bold text-navy-950 truncate flex items-center gap-1.5">
                          <span>{item.title}</span>
                          {item.isGps && (
                            <span className="text-[9px] bg-emerald-100 text-emerald-800 font-extrabold px-1 rounded">
                              GPS
                            </span>
                          )}
                        </p>
                        <p className="text-[10px] text-slate-500 truncate">{item.address}</p>
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 shrink-0">
                        {item.distanceKm} km
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 5. Popular Manikonda Hubs */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <span className="h-px bg-slate-200 flex-1"></span>
                <span>Or Select Neighborhood Hub</span>
                <span className="h-px bg-slate-200 flex-1"></span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-1">
                {POPULAR_HUBS.map((loc) => {
                  const isSelected = currentLocality.toLowerCase().includes(loc.name.toLowerCase());
                  return (
                    <button
                      key={loc.name}
                      type="button"
                      onClick={() =>
                        handlePickPlace(
                          `${loc.name}, ${loc.suburb}`,
                          `${loc.name}, ${loc.suburb}, Hyderabad`,
                          loc.lat,
                          loc.lng,
                          loc.km
                        )
                      }
                      className={`text-left p-2.5 rounded-xl border transition flex items-center justify-between ${
                        isSelected
                          ? "border-accent-500 bg-accent-50/40 ring-1 ring-accent-500"
                          : loc.eligible
                          ? "border-slate-200 hover:border-navy-900 hover:bg-slate-50"
                          : "border-slate-200 bg-slate-50/70 hover:bg-slate-100 opacity-80"
                      }`}
                    >
                      <div className="min-w-0 pr-1">
                        <div className="text-xs font-bold text-navy-900 truncate">
                          {loc.name}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">{loc.note}</div>
                      </div>
                      <span
                        className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded shrink-0 ${
                          loc.eligible ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {loc.km} km
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Shop Hub Footer with Direct Google Maps Link */}
            <div className="p-2.5 bg-slate-50 rounded-xl text-[11px] text-slate-600 flex items-center justify-between border border-slate-200/80">
              <div className="flex items-center gap-1.5 truncate">
                <span className="text-accent-600 font-extrabold">📍 Physical Workshop:</span>
                <span className="truncate">Manikonda Main Road</span>
              </div>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Famous+Mobiles+Manikonda+Hyderabad"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-black text-blue-600 hover:text-blue-700 underline flex items-center gap-0.5 shrink-0 cursor-pointer"
                title="Open verified Famous Mobiles shop on Google Maps"
              >
                <span>Google Maps ↗</span>
              </a>
            </div>
          </div>
        )}

        {/* STEP 2: INTERACTIVE MAP PIN & "CONFIRM LOCATION" VIEW (Zomato/Swiggy Style) */}
        {step === "CONFIRM" && selectedLoc && (
          <div className="space-y-3 flex-1 flex flex-col min-h-0 overflow-y-auto">
            {/* Map Preview Container */}
            <div className="relative w-full h-48 sm:h-56 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-inner">
              <iframe
                title="Location Map"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${selectedLoc.longitude - 0.007}%2C${selectedLoc.latitude - 0.005}%2C${selectedLoc.longitude + 0.007}%2C${selectedLoc.latitude + 0.005}&layer=mapnik&marker=${selectedLoc.latitude}%2C${selectedLoc.longitude}`}
                className="w-full h-full border-0 pointer-events-auto"
                loading="lazy"
              />

              {/* Center Map Pin Graphic (Zomato/Swiggy Style) */}
              <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                <div className="relative -mt-6 flex flex-col items-center">
                  <div className="bg-navy-950 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-lg mb-1 whitespace-nowrap animate-bounce">
                    Your Doorstep Pin
                  </div>
                  <div className="w-8 h-8 rounded-full bg-accent-500 text-white flex items-center justify-center shadow-lg ring-4 ring-white">
                    <MapPin className="w-5 h-5 fill-white text-accent-500" />
                  </div>
                  <div className="w-2.5 h-1 rounded-full bg-black/40 blur-2xs mt-0.5"></div>
                </div>
              </div>

              {/* Re-center GPS trigger */}
              <button
                type="button"
                onClick={handleDetectGps}
                className="absolute top-2.5 right-2.5 bg-white hover:bg-slate-50 text-navy-900 p-2 rounded-lg shadow-md border border-slate-200 text-xs font-bold flex items-center gap-1 transition"
                title="Re-acquire live GPS"
              >
                <Navigation className="w-3.5 h-3.5 text-accent-500" />
                <span className="hidden sm:inline text-[10px]">Recenter GPS</span>
              </button>
            </div>

            {/* Address Confirmation Card */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2 shadow-2xs">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-sm font-black text-navy-950 flex items-center gap-1.5">
                    <span>{selectedLoc.areaTitle || selectedLoc.locality.split(",")[0]}</span>
                    {selectedLoc.source === "GPS" && (
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.2 rounded">
                        GPS Verified
                      </span>
                    )}
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5 font-medium leading-relaxed">
                    {selectedLoc.formattedAddress || selectedLoc.locality}
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  <span className="text-xs font-black text-navy-900 block">
                    {selectedLoc.distanceKm} km
                  </span>
                  <span className="text-[10px] text-slate-400 block leading-tight">
                    from shop hub
                  </span>
                </div>
              </div>

              {/* Doorstep Eligibility Status Banner */}
              <div
                className={`p-2.5 rounded-lg text-xs font-bold flex items-center gap-2 ${
                  selectedLoc.eligible
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-amber-50 text-amber-800 border border-amber-200"
                }`}
              >
                {selectedLoc.eligible ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      Doorstep Service Available (~{selectedLoc.eta}) • ₹0 Free 1st Visit
                    </span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>
                      Outside 6 km doorstep zone ({selectedLoc.distanceKm} km) • Free Shop Visit Available
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setStep("SEARCH")}
                className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-xs font-bold text-navy-900 transition"
              >
                Change
              </button>

              <button
                type="button"
                onClick={handleConfirmLocation}
                className="flex-1 bg-navy-950 hover:bg-black text-white py-2.5 px-4 rounded-xl text-xs font-black shadow-md transition active:scale-[0.99] flex items-center justify-center gap-1.5"
              >
                <span>Confirm Location</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
