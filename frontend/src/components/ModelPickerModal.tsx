"use client";

import React, { useState, useEffect } from "react";
import { Search, X, Check } from "lucide-react";
import {
  DEVICE_CATALOG,
  BrandKey,
  getBrandModelCount,
  searchDeviceModels,
} from "@/data/deviceCatalog";

interface ModelPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeBrand: BrandKey;
  selectedModel: string;
  isCustomModel: boolean;
  onSelectModel: (model: string, brand: BrandKey, isCustom: boolean) => void;
}

export default function ModelPickerModal({
  isOpen,
  onClose,
  activeBrand,
  selectedModel,
  isCustomModel,
  onSelectModel,
}: ModelPickerModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSeriesTab, setActiveSeriesTab] = useState<string>("all");
  const [customInput, setCustomInput] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    setSearchQuery("");
    setActiveSeriesTab("all");
    setCustomInput(isCustomModel ? selectedModel : "");

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, isCustomModel, selectedModel, onClose]);

  if (!isOpen) return null;

  const brandObj = DEVICE_CATALOG[activeBrand];
  const modelCount = getBrandModelCount(activeBrand);
  const query = searchQuery.trim().toLowerCase();

  const crossBrandMatches = query ? searchDeviceModels(query, 40) : [];

  const visibleSeries =
    activeSeriesTab === "all"
      ? brandObj.series
      : brandObj.series.filter((_, idx) => String(idx) === activeSeriesTab);

  const handleApplyCustom = () => {
    const trimmed = customInput.trim();
    if (!trimmed) return;
    onSelectModel(trimmed, activeBrand, true);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Select your phone model"
      onClick={onClose}
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-end sm:items-center justify-center sm:p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-white rounded-t-3xl sm:rounded-2xl border border-[#EBEBEB] shadow-2xl overflow-hidden flex flex-col max-h-[90dvh]"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#EBEBEB] flex items-center justify-between shrink-0">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#F97316]">
              {brandObj.label} · {modelCount} Models
            </span>
            <h3 className="font-bold text-lg text-[#121212] mt-0.5">
              Select Your Phone Model
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close model picker"
            className="w-9 h-9 rounded-lg border border-[#EBEBEB] hover:bg-[#F7F7F8] flex items-center justify-center text-[#121212] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search + Series Filter Tabs */}
        <div className="px-5 pt-3.5 pb-3 border-b border-[#EBEBEB] space-y-3 bg-white shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 text-[#767676] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search any model across brands (e.g., iPhone 16, S24 Ultra, Nord 4)..."
              className="w-full h-11 pl-10 pr-16 rounded-lg border border-[#EBEBEB] bg-[#F8F9FA] focus:bg-white focus:border-[#F97316] text-base sm:text-sm font-medium text-[#121212] placeholder:text-[#767676] outline-none transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 px-2 py-1 rounded text-[11px] font-semibold text-[#767676] hover:text-[#121212] hover:bg-[#EBEBEB]/60 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {!query && (
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {[
                { key: "all", label: "All Series" },
                ...brandObj.series.map((s, idx) => ({
                  key: String(idx),
                  label: s.name,
                })),
              ].map((tab) => {
                const active = activeSeriesTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveSeriesTab(tab.key)}
                    className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                      active
                        ? "bg-[#121212] text-white border-[#121212]"
                        : "bg-[#F8F9FA] text-[#121212] border-[#EBEBEB] hover:bg-[#EFEFEF]"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {query ? (
            crossBrandMatches.length === 0 ? (
              <div className="text-center py-6 space-y-2">
                <p className="text-sm font-bold text-[#121212]">
                  No matching model for &ldquo;{searchQuery}&rdquo;
                </p>
                <p className="text-xs text-[#767676]">
                  Type your exact phone model below and tap <strong>Use Model</strong>.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#767676]">
                  Search Results ({crossBrandMatches.length})
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {crossBrandMatches.map((item) => {
                    const isCurrent =
                      !isCustomModel &&
                      activeBrand === item.brandKey &&
                      selectedModel === item.model;
                    return (
                      <button
                        key={`${item.brandKey}-${item.model}`}
                        type="button"
                        onClick={() => {
                          onSelectModel(item.model, item.brandKey, false);
                          onClose();
                        }}
                        className={`p-3 rounded-xl border text-left transition flex items-center justify-between gap-2 cursor-pointer ${
                          isCurrent
                            ? "border-[#F97316] bg-[#FFF7ED] text-[#121212]"
                            : "border-[#EBEBEB] hover:border-[#121212] bg-white text-[#121212]"
                        }`}
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-bold truncate">{item.model}</p>
                          <p className="text-[11px] text-[#767676] truncate">{item.brandLabel}</p>
                        </div>
                        {isCurrent && <Check className="w-4 h-4 text-[#F97316] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )
          ) : (
            visibleSeries.map((group) => (
              <div key={group.name} className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#767676]">
                  {group.name}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {group.models.map((modelName) => {
                    const isCurrent = !isCustomModel && selectedModel === modelName;
                    return (
                      <button
                        key={modelName}
                        type="button"
                        onClick={() => {
                          onSelectModel(modelName, activeBrand, false);
                          onClose();
                        }}
                        className={`px-3.5 py-2.5 rounded-xl border text-left text-xs font-semibold transition flex items-center justify-between gap-2 cursor-pointer ${
                          isCurrent
                            ? "border-[#F97316] bg-[#FFF7ED] text-[#F97316] font-bold"
                            : "border-[#EBEBEB] hover:border-[#121212] bg-white text-[#121212]"
                        }`}
                      >
                        <span className="truncate">{modelName}</span>
                        {isCurrent && <Check className="w-3.5 h-3.5 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Custom Model Fallback */}
        <div className="p-4 pb-[max(1rem,env(safe-area-inset-bottom))] border-t border-[#EBEBEB] bg-[#F8F9FA] shrink-0 space-y-2">
          <label
            htmlFor="customModelInput"
            className="block text-[11px] font-semibold text-[#767676]"
          >
            Model not listed? Type your exact model name
          </label>
          <div className="flex items-center gap-2">
            <input
              id="customModelInput"
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleApplyCustom();
                }
              }}
              placeholder="e.g., Galaxy A55 5G, OnePlus 12R, Pixel 9a..."
              className="flex-1 h-11 px-3 rounded-lg border border-[#EBEBEB] bg-white focus:border-[#F97316] text-base sm:text-sm font-medium text-[#121212] outline-none"
            />
            <button
              type="button"
              onClick={handleApplyCustom}
              className="h-11 px-4 rounded-lg bg-[#121212] hover:bg-slate-800 text-white font-bold text-xs shrink-0 transition cursor-pointer"
            >
              Use Model
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
