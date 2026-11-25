import test from "node:test";
import assert from "node:assert/strict";
import { getIstStoreStatus } from "../src/lib/businessInfo.ts";
import { searchDeviceModels } from "../src/data/deviceCatalog.ts";

test("getIstStoreStatus reports open between 10:00 AM and 1:00 AM IST", () => {
  // 10:00 AM IST = 04:30 UTC
  assert.deepEqual(getIstStoreStatus(new Date("2026-11-25T04:30:00Z")), {
    isOpen: true,
    label: "Open Now • Closes 1:00 AM",
  });
  // 11:30 PM IST = 18:00 UTC
  assert.deepEqual(getIstStoreStatus(new Date("2026-11-25T18:00:00Z")), {
    isOpen: true,
    label: "Open Now • Closes 1:00 AM",
  });
  // 12:30 AM IST = 19:00 UTC
  assert.deepEqual(getIstStoreStatus(new Date("2026-11-25T19:00:00Z")), {
    isOpen: true,
    label: "Open Now • Closes 1:00 AM",
  });
});

test("getIstStoreStatus reports closed between 1:00 AM and 9:59 AM IST", () => {
  // 1:00 AM IST = 19:30 UTC
  assert.deepEqual(getIstStoreStatus(new Date("2026-11-25T19:30:00Z")), {
    isOpen: false,
    label: "Opens Today at 10:00 AM",
  });
  // 9:59 AM IST = 04:29 UTC
  assert.deepEqual(getIstStoreStatus(new Date("2026-11-25T04:29:00Z")), {
    isOpen: false,
    label: "Opens Today at 10:00 AM",
  });
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
