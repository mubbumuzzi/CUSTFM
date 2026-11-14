import test from "node:test";
import assert from "node:assert";
import { calculateDistanceKm, getEtaForDistance, SHOP_LAT, SHOP_LNG, MAX_RADIUS_KM } from "../src/lib/gps.ts";

test("Haversine distance from Manikonda shop hub to itself is 0.0 km", () => {
  const dist = calculateDistanceKm(SHOP_LAT, SHOP_LNG);
  assert.strictEqual(dist, 0);
});

test("Haversine distance to Lanco Hills (~17.404, 78.375) is within 1.0 - 2.0 km", () => {
  const dist = calculateDistanceKm(17.404, 78.375);
  assert.ok(dist >= 1.0 && dist <= 2.0, `Expected ~1.4 km, got ${dist}`);
});

test("Locations beyond 5 km are correctly marked as Shop Visit Only", () => {
  const distFar = calculateDistanceKm(17.4400, 78.3489); // Financial District
  assert.ok(distFar > MAX_RADIUS_KM, `Expected > 5 km, got ${distFar}`);
  const eta = getEtaForDistance(distFar);
  assert.strictEqual(eta, "Shop Visit Only");
});

test("Locations within 5 km receive valid arrival time ETAs", () => {
  assert.strictEqual(getEtaForDistance(1.2), "30 mins");
  assert.strictEqual(getEtaForDistance(2.8), "45 mins");
  assert.strictEqual(getEtaForDistance(4.5), "45-60 mins");
});
