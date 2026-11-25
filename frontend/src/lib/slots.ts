import { getIstParts } from "./businessInfo.ts";

/**
 * Smart Dynamic Arrival Slot Generator for Famous Mobiles (Strictly IST / Asia/Kolkata)
 * Operating Hours: 10:00 AM – 1:00 AM IST Daily (Capped at 1:00 AM IST)
 * Filters out all expired past slots and intelligently adds future slots + tomorrow options.
 */

export interface ArrivalSlotOption {
  label: string;
  value: string;
  isExpress?: boolean;
}

export function getDynamicArrivalSlots(now: Date = new Date()): ArrivalSlotOption[] {
  const { hour: currentHour, minute: currentMinute } = getIstParts(now);
  const currentTimeDec = currentHour + currentMinute / 60;

  const slots: ArrivalSlotOption[] = [];

  // 1. Operating Window Check: 10:00 AM to 01:00 AM IST (Next Day)
  const isOperating = currentHour >= 10 || currentHour < 1;

  if (isOperating) {
    slots.push({
      label: "⚡ Express (15–45 Mins)",
      value: "Express (15–45 Mins)",
      isExpress: true,
    });
  } else {
    slots.push({
      label: "🌅 Store Opens at 10:00 AM (First Available)",
      value: "Today, 10:00 AM – 12:00 PM",
    });
  }

  // 2. Standard 2-hour window definitions for Today in IST (up to 1:00 AM IST)
  const todaySlotDefs = [
    { start: 10, end: 12, label: "Today, 10:00 AM – 12:00 PM" },
    { start: 12, end: 14, label: "Today, 12:00 PM – 2:00 PM" },
    { start: 14, end: 16, label: "Today, 2:00 PM – 4:00 PM" },
    { start: 16, end: 18, label: "Today, 4:00 PM – 6:00 PM" },
    { start: 18, end: 20, label: "Today, 6:00 PM – 8:00 PM" },
    { start: 20, end: 22, label: "Tonight, 8:00 PM – 10:00 PM" },
    { start: 22, end: 25, label: "Late Night (10:00 PM – 1:00 AM)" }, // 25 = 1:00 AM IST next day
  ];

  // If late night midnight to 1 AM IST (00:00 to 00:59)
  if (currentHour === 0) {
    const virtualHour = 24 + currentMinute / 60;
    todaySlotDefs.forEach((slot) => {
      if (slot.end > virtualHour + 0.33) {
        slots.push({ label: slot.label, value: slot.label });
      }
    });
  } else if (currentHour >= 10) {
    // Normal daytime / evening IST (10:00 to 23:59)
    todaySlotDefs.forEach((slot) => {
      if (slot.end > currentTimeDec + 0.4) {
        slots.push({ label: slot.label, value: slot.label });
      }
    });
  }

  // 3. If evening (>= 19:00 IST), closed hours, or fewer than 4 slots remaining, offer Tomorrow slots
  if (slots.length < 4 || currentTimeDec >= 19 || currentHour < 10) {
    slots.push({
      label: "Tomorrow, 10:00 AM – 12:00 PM",
      value: "Tomorrow, 10:00 AM – 12:00 PM",
    });
    slots.push({
      label: "Tomorrow, 2:00 PM – 4:00 PM",
      value: "Tomorrow, 2:00 PM – 4:00 PM",
    });
    slots.push({
      label: "Tomorrow, 6:00 PM – 8:00 PM",
      value: "Tomorrow, 6:00 PM – 8:00 PM",
    });
  }

  return slots;
}
