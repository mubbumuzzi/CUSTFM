import test from "node:test";
import assert from "node:assert/strict";
import { getIstStoreStatus, formatIstDateTime } from "../src/lib/businessInfo.ts";
import { searchDeviceModels } from "../src/data/deviceCatalog.ts";
import { getDynamicArrivalSlots } from "../src/lib/slots.ts";

test("getIstStoreStatus reports open between 10:00 AM and 1:00 AM IST", () => {
  // 10:00 AM IST = 04:30 UTC
  assert.deepEqual(getIstStoreStatus(new Date("2026-11-25T04:30:00Z")), {
    isOpen: true,
    label: "Open Now • Closes 1:00 AM IST",
  });
  // 11:30 PM IST = 18:00 UTC
  assert.deepEqual(getIstStoreStatus(new Date("2026-11-25T18:00:00Z")), {
    isOpen: true,
    label: "Open Now • Closes 1:00 AM IST",
  });
  // 12:30 AM IST = 19:00 UTC
  assert.deepEqual(getIstStoreStatus(new Date("2026-11-25T19:00:00Z")), {
    isOpen: true,
    label: "Open Now • Closes 1:00 AM IST",
  });
});

test("getIstStoreStatus reports closed between 1:00 AM and 9:59 AM IST", () => {
  // 1:00 AM IST = 19:30 UTC
  assert.deepEqual(getIstStoreStatus(new Date("2026-11-25T19:30:00Z")), {
    isOpen: false,
    label: "Opens Today at 10:00 AM IST",
  });
  // 9:59 AM IST = 04:29 UTC
  assert.deepEqual(getIstStoreStatus(new Date("2026-11-25T04:29:00Z")), {
    isOpen: false,
    label: "Opens Today at 10:00 AM IST",
  });
});

test("getDynamicArrivalSlots evaluates arrival slots strictly in IST", () => {
  // 11:30 PM IST = 18:00 UTC -> should offer Express + Late Night (10:00 PM – 1:00 AM IST) + Tomorrow IST slots
  const lateNightSlots = getDynamicArrivalSlots(new Date("2026-11-25T18:00:00Z"));
  assert.equal(lateNightSlots[0].isExpress, true);
  assert.ok(lateNightSlots.some((s) => s.value.includes("1:00 AM IST")));
  assert.ok(lateNightSlots.some((s) => s.value.startsWith("Tomorrow, 10:00 AM")));

  // 8:00 AM IST = 02:30 UTC -> closed hours, first slot should be Store Opens at 10:00 AM IST
  const morningClosedSlots = getDynamicArrivalSlots(new Date("2026-11-25T02:30:00Z"));
  assert.match(morningClosedSlots[0].label, /10:00 AM IST/);
});

test("formatIstDateTime formats UTC timestamps in Asia/Kolkata IST", () => {
  const formatted = formatIstDateTime("2026-11-25T18:00:00Z"); // 11:30 PM IST on 25 Nov 2026
  assert.match(formatted, /25 Nov 2026/);
  assert.match(formatted, /11:30/i);
  assert.match(formatted, /IST$/);
});

test("searchDeviceModels matches phone models across brands cleanly", () => {
  const iphone15Hits = searchDeviceModels("iPhone 15", 5);
  assert.ok(iphone15Hits.length >= 4);
  assert.equal(iphone15Hits[0].brandKey, "apple");
  assert.match(iphone15Hits[0].model, /iPhone 15/);

  const s24Hits = searchDeviceModels("S24 Ultra", 5);
  assert.equal(s24Hits.length, 1);
  assert.equal(s24Hits[0].brandKey, "samsung");
  assert.equal(s24Hits[0].model, "Galaxy S24 Ultra");
});
