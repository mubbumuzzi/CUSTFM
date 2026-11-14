"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Wrench, CalendarPlus, Package, PhoneCall } from "lucide-react";

export default function MobileBottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Services", href: "/services", icon: Wrench },
    { name: "Book Repair", href: "/book-repair", icon: CalendarPlus, highlight: true },
    { name: "Track", href: "/track-booking", icon: Package },
    { name: "Contact", href: "/contact", icon: PhoneCall },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-2 px-3 flex items-center justify-around z-40 shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
      {navItems.map((item) => {
        const active = pathname === item.href;
        const Icon = item.icon;

        if (item.highlight) {
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center -mt-5"
            >
              <div className="w-12 h-12 rounded-full bg-accent-500 text-white flex items-center justify-center shadow-lg border-2 border-white transition active:scale-90">
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black text-accent-600 mt-0.5">
                {item.name}
              </span>
            </Link>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-0.5 transition ${
              active ? "text-accent-600 font-extrabold" : "text-slate-400 hover:text-navy-900"
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-bold">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
