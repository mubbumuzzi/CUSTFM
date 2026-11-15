import test from "node:test";
import assert from "node:assert";
import {
  calculateDistanceKm,
  getEtaForDistance,
  reverseGeocode,
  searchPlacesApi,
  SHOP_LAT,
  SHOP_LNG,
  MAX_RADIUS_KM,
} from "../src/lib/gps.ts";

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
  assert.strictEqual(getEtaForDistance(0.2), "10-15 mins");
  assert.strictEqual(getEtaForDistance(0.4), "10-15 mins");
  assert.strictEqual(getEtaForDistance(1.2), "15-25 mins");
  assert.strictEqual(getEtaForDistance(2.2), "25-35 mins");
  assert.strictEqual(getEtaForDistance(4.5), "35-45 mins");
});

test("reverseGeocode resolves coordinates to clean locality without administrative ward noise", async () => {
  const result = await reverseGeocode(17.4045, 78.3752);
  assert.ok(result, "Result should be returned");
  assert.ok(result.areaTitle, "areaTitle should be present");
  assert.doesNotMatch(result.areaTitle, /^Ward\s*\d+/i, "areaTitle must not contain municipal ward noise");
  assert.ok(result.distanceKm <= MAX_RADIUS_KM, "Lanco Hills is within doorstep radius");
  assert.strictEqual(result.eligible, true);
});

test("searchPlacesApi finds matching locality suggestions", async () => {
  const results = await searchPlacesApi("Lanco");
  assert.ok(results.length > 0, "Should find at least 1 suggestion for Lanco");
  assert.match(results[0].title, /Lanco/i, "Top suggestion matches query");
});
