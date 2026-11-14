import React from "react";
import Link from "next/link";
import { Phone, MessageSquare, MapPin, Clock, ShieldCheck, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-white border-t border-slate-800 pb-20 md:pb-8 pt-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-accent-500 text-white font-black text-sm flex items-center justify-center">
                FM
              </div>
              <span className="text-base font-black tracking-tight text-white">Famous Mobiles</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Manikonda&apos;s trusted doorstep smartphone repair specialist. Fast 45-minute arrival within 5 km of our shop, verified genuine OEM parts, and 6-month warranty.
            </p>
            <div className="flex items-center gap-2 pt-1 text-xs text-amber-300 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>10,000+ Repairs • 4.9/5 Rating (657 Reviews)</span>
            </div>
          </div>

          {/* Quick Services Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
              Doorstep Repair Services
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <Link href="/services/display-replacement" className="hover:text-accent-400 transition">
                  📱 Display & OLED Replacement
                </Link>
              </li>
              <li>
                <Link href="/services/battery-replacement" className="hover:text-accent-400 transition">
                  🔋 Battery Replacement
                </Link>
              </li>
              <li>
                <Link href="/services/charging-port-repair" className="hover:text-accent-400 transition">
                  ⚡ Charging Port Repair
                </Link>
              </li>
              <li>
                <Link href="/services/software-repair" className="hover:text-accent-400 transition">
                  💻 Software & Boot Loop Recovery
                </Link>
              </li>
              <li>
                <Link href="/services/hardware-repair" className="hover:text-accent-400 transition">
                  🔧 Mic, Speaker & Camera Repair
                </Link>
              </li>
              <li>
                <Link href="/services/water-damage-diagnosis" className="hover:text-accent-400 transition">
                  💧 Water Damage Diagnosis
                </Link>
              </li>
            </ul>
          </div>

          {/* Location & Hours */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
              Shop Location & Hours
            </h4>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-accent-500 shrink-0 mt-0.5" />
                <div>
                  <span>Main Road, Near Marrichettu Junction, Manikonda, Hyderabad, Telangana 500089</span>
                  <a
                    href="https://share.google/U0L5BeQxKW1dBHUbJ"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] font-bold text-accent-400 hover:underline block mt-0.5"
                  >
                    View Store on Google Maps →
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-accent-500 shrink-0" />
                <span>Operating Hours: 9:00 AM – 9:00 PM (Everyday)</span>
              </div>
              <div className="text-[11px] text-emerald-400 font-bold bg-emerald-950/60 p-2 rounded-lg border border-emerald-800/40">
                🚲 Service Area: 5 km radius (Lanco Hills, Puppalaguda, Alkapoor Township, OU Colony, Shaikpet)
              </div>
            </div>
          </div>

          {/* Quick Contact & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
              Direct Assistance
            </h4>
            <div className="space-y-2">
              <a
                href="tel:+919063786751"
                className="flex items-center gap-2 w-full px-3 py-2 rounded-xl bg-navy-900 hover:bg-navy-800 border border-slate-700 text-xs font-bold text-white transition"
              >
                <Phone className="w-3.5 h-3.5 text-accent-400" />
                <span>Call: +91 90637 86751</span>
              </a>
              <a
                href="https://wa.me/919063786751?text=Hi%20Famous%20Mobiles,%20I%20need%20a%20doorstep%20repair%20quote"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 w-full px-3 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-xs font-bold text-white transition"
              >
                <MessageSquare className="w-3.5 h-3.5 text-white" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>

            <div className="pt-2 text-[11px] text-slate-400 space-x-3">
              <Link href="/warranty" className="hover:underline">Warranty Policy</Link>
              <span>•</span>
              <Link href="/privacy" className="hover:underline">Privacy</Link>
              <span>•</span>
              <Link href="/terms" className="hover:underline">Terms</Link>
            </div>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2 text-center sm:text-left">
          <p>© {new Date().getFullYear()} Famous Mobiles. All rights reserved. Registered repair facility in Manikonda, Hyderabad.</p>
          <p className="flex items-center gap-1 justify-center">
            <span>Crafted for high-converting doorstep mobile care</span>
            <Heart className="w-3 h-3 text-red-500 fill-red-500 inline" />
          </p>
        </div>
      </div>
    </footer>
  );
}
