import React from "react";
import Link from "next/link";
import { Phone, MessageSquare, MapPin, Clock, ShieldCheck, Heart, Mail } from "lucide-react";
import { BUSINESS_INFO, NEIGHBORHOOD_LINKS } from "@/lib/businessInfo";

export default function Footer() {
  return (
    <footer className="bg-[#121212] text-white border-t border-[#262626] pb-24 md:pb-12 pt-14">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#262626]">
          {/* Brand Info */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-[10px] bg-[#F97316] text-white font-bold text-xs flex items-center justify-center">
                FM
              </div>
              <span className="text-[16px] font-bold tracking-tight text-white">{BUSINESS_INFO.name}</span>
            </div>
            <p className="text-xs text-[#9E9E9E] leading-relaxed">
              West Hyderabad&apos;s trusted smartphone repair workshop. Certified 30–60 min doorstep repairs within 6 km, verified genuine OEM components, and clear warranty terms.
            </p>
            <div className="flex items-center gap-2 pt-1 text-xs text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>10,000+ Phones Repaired • 4.9★ Rating</span>
            </div>
          </div>

          {/* Quick Services Links */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#9E9E9E]">
              Doorstep Repair Services
            </h4>
            <ul className="space-y-2 text-xs text-[#CCCCCC]">
              <li>
                <Link href="/services/display-replacement" className="hover:text-[#F97316] transition">
                  Screen & OLED Replacement
                </Link>
              </li>
              <li>
                <Link href="/services/battery-replacement" className="hover:text-[#F97316] transition">
                  Battery Replacement & Health
                </Link>
              </li>
              <li>
                <Link href="/services/charging-port-repair" className="hover:text-[#F97316] transition">
                  Charging Port & Jack Repair
                </Link>
              </li>
              <li>
                <Link href="/services/software-repair" className="hover:text-[#F97316] transition">
                  Software OS Recovery & Flash
                </Link>
              </li>
              <li>
                <Link href="/services/hardware-repair" className="hover:text-[#F97316] transition">
                  Mic, Speaker & Camera Repair
                </Link>
              </li>
              <li>
                <Link href="/services/water-damage-diagnosis" className="hover:text-[#F97316] transition">
                  Water Damage Diagnosis
                </Link>
              </li>
            </ul>
          </div>

          {/* Location & Hours */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#9E9E9E]">
              Physical Store & Hours
            </h4>
            <div className="space-y-2.5 text-xs text-[#CCCCCC]">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#F97316] shrink-0 mt-0.5" />
                <div>
                  <span>{BUSINESS_INFO.address.formatted}</span>
                  <a
                    href={BUSINESS_INFO.mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] font-semibold text-[#F97316] hover:underline block mt-0.5"
                  >
                    View Store on Google Maps →
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#F97316] shrink-0" />
                <span>Open Daily: {BUSINESS_INFO.hoursDisplay} (365 Days)</span>
              </div>
              <div className="text-[11px] text-[#A3E635] bg-[#1E291B] p-2.5 rounded-[10px] border border-[#2D3E28]">
                🚲 6 km Doorstep Radius: Manikonda, Shaikpet, Puppalaguda, Lanco Hills, Alkapur, Tolichowki, Gachibowli, Narsingi, Kokapet.
              </div>
            </div>
          </div>

          {/* Quick Contact & Legal */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#9E9E9E]">
              Customer Support
            </h4>
            <div className="space-y-2">
              <a
                href={`tel:${BUSINESS_INFO.phoneE164}`}
                className="flex items-center gap-2 w-full px-3.5 py-2.5 rounded-[10px] bg-[#1F1F1F] hover:bg-[#2A2A2A] border border-[#333333] text-xs font-semibold text-white transition"
              >
                <Phone className="w-3.5 h-3.5 text-[#F97316]" />
                <span>Call Desk: {BUSINESS_INFO.phoneDisplay}</span>
              </a>
              <a
                href={`${BUSINESS_INFO.whatsappBase}?text=Hi%20Famous%20Mobiles,%20I%20need%20a%20doorstep%20repair%20quote`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 w-full px-3.5 py-2.5 rounded-[10px] bg-[#15803D] hover:bg-[#16A34A] text-xs font-bold text-white transition"
              >
                <MessageSquare className="w-3.5 h-3.5 text-white" />
                <span>WhatsApp Instant Quote</span>
              </a>
              <a
                href={`mailto:${BUSINESS_INFO.email}`}
                className="flex items-center gap-2 w-full px-3.5 py-2.5 rounded-[10px] bg-[#1F1F1F] hover:bg-[#2A2A2A] border border-[#333333] text-xs font-semibold text-white transition"
              >
                <Mail className="w-3.5 h-3.5 text-[#F97316]" />
                <span>{BUSINESS_INFO.email}</span>
              </a>
            </div>

            <div className="pt-2 text-[11px] text-[#888888] space-x-3">
              <Link href="/warranty" className="hover:underline">Warranty Terms</Link>
              <span>•</span>
              <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
              <span>•</span>
              <Link href="/terms" className="hover:underline">Terms of Service</Link>
            </div>
          </div>
        </div>

        {/* Hyperlocal Neighborhood Landing Pages for SEO */}
        <div className="pt-6 border-t border-[#262626] text-xs text-[#888888] space-y-2">
          <div className="font-bold text-[#CCCCCC] uppercase tracking-wider text-[11px]">
            Hyperlocal Doorstep Service Areas:
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs">
            {NEIGHBORHOOD_LINKS.map((nh, idx) => (
              <React.Fragment key={nh.href}>
                {idx > 0 && <span className="text-[#444444]">•</span>}
                <Link href={nh.href} className="hover:text-[#F97316] transition">
                  📍 {nh.name}
                </Link>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#767676] gap-2 text-center sm:text-left">
          <p>© {new Date().getFullYear()} {BUSINESS_INFO.name}. Verified smartphone service center in Manikonda, Hyderabad.</p>
          <p className="flex items-center gap-1 justify-center">
            <span>Precision repair at your doorstep</span>
            <Heart className="w-3 h-3 text-[#F97316] fill-[#F97316] inline" />
          </p>
        </div>
      </div>
    </footer>
  );
}
