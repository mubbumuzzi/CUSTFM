import test from "node:test";
import assert from "node:assert/strict";
import {
  DEVICE_CATALOG,
  type BrandKey,
  getBrandModelCount,
  formatDeviceLabel,
} from "../src/data/deviceCatalog.ts";

test("DEVICE_CATALOG covers all 7 brand groups with non-empty series and popular models", () => {
  const keys = Object.keys(DEVICE_CATALOG) as BrandKey[];
  assert.equal(keys.length, 7);
  for (const key of keys) {
    const brand = DEVICE_CATALOG[key];
    assert.ok(brand.label.length > 0);
    assert.ok(brand.popular.length >= 4, `${key} has at least 4 popular models`);
    assert.ok(getBrandModelCount(key) >= 10, `${key} has at least 10 models`);
  }
});

test("formatDeviceLabel prefixes Apple, Samsung, and Google Pixel cleanly", () => {
  assert.equal(formatDeviceLabel("apple", "iPhone 16 Pro Max", false), "Apple iPhone 16 Pro Max");
  assert.equal(formatDeviceLabel("samsung", "Galaxy S24 Ultra", false), "Samsung Galaxy S24 Ultra");
  assert.equal(formatDeviceLabel("pixel", "Pixel 9 Pro", false), "Google Pixel 9 Pro");
  assert.equal(formatDeviceLabel("oneplus", "OnePlus 13", false), "OnePlus 13");
  assert.equal(formatDeviceLabel("apple", "iPhone 17 Custom", true), "iPhone 17 Custom");
});
