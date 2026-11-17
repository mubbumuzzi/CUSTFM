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
    { name: "Book Visit", href: "/book-repair", icon: CalendarPlus, highlight: true },
    { name: "Track", href: "/track-booking", icon: Package },
    { name: "Contact", href: "/contact", icon: PhoneCall },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#EBEBEB] py-2 px-2 flex items-center justify-around z-40 shadow-card">
      {navItems.map((item) => {
        const active = pathname === item.href;
        const Icon = item.icon;

        if (item.highlight) {
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-0.5"
            >
              <div className="w-10 h-10 rounded-[12px] bg-[#F97316] text-white flex items-center justify-center shadow-xs transition active:scale-95">
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-[#F97316]">
                {item.name}
              </span>
            </Link>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 transition ${
              active ? "text-[#121212] font-bold" : "text-[#767676] hover:text-[#121212]"
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-medium leading-none">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
