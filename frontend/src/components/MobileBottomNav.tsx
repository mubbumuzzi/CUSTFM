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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-[#EBEBEB] pt-1.5 pb-2 pb-[max(0.6rem,env(safe-area-inset-bottom))] px-3 flex items-center justify-around z-40 shadow-lg">
      {navItems.map((item) => {
        const active = pathname === item.href;
        const Icon = item.icon;

        if (item.highlight) {
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center -mt-3 group"
            >
              <div className="w-11 h-11 rounded-full bg-[#F97316] text-white flex items-center justify-center shadow-md transition active:scale-90 group-hover:bg-[#EA580C]">
                <Icon className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="text-[10px] font-bold text-[#F97316] mt-0.5 leading-tight">
                {item.name}
              </span>
            </Link>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition active:scale-95 ${
              active ? "text-[#121212] font-bold" : "text-[#767676] hover:text-[#121212]"
            }`}
          >
            <Icon className={`w-5 h-5 ${active ? "stroke-[2.5] text-[#121212]" : "stroke-[1.75]"}`} />
            <span className="text-[10px] font-medium mt-1 leading-tight">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
