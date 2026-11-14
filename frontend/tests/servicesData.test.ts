import test from "node:test";
import assert from "node:assert/strict";
import { SERVICES_DATA } from "../src/data/servicesData.ts";

test("SERVICES_DATA contains exactly 6 specialized repair services as per PRD", () => {
  assert.equal(SERVICES_DATA.length, 6);
});

test("Water Damage service must have doorstepFeasible set to false (PRD Section 6.2)", () => {
  const waterService = SERVICES_DATA.find((s) => s.slug === "water-damage-diagnosis");
  assert.ok(waterService, "Water damage service exists");
  assert.equal(waterService.doorstepFeasible, false, "Water damage must be diagnosis-first (lab pickup)");
  assert.match(waterService.turnaround, /Lab Pickup/i);
});

test("Display and Battery replacements must be doorstep feasible", () => {
  const display = SERVICES_DATA.find((s) => s.slug === "display-replacement");
  const battery = SERVICES_DATA.find((s) => s.slug === "battery-replacement");

  assert.ok(display && display.doorstepFeasible, "Display is doorstep feasible");
  assert.ok(battery && battery.doorstepFeasible, "Battery is doorstep feasible");
  assert.match(display.turnaround, /30 mins/);
  assert.match(battery.turnaround, /20 mins/);
});

test("Every service item has required SEO and UX properties", () => {
  for (const s of SERVICES_DATA) {
    assert.ok(s.slug, "Has slug");
    assert.ok(s.title, "Has title");
    assert.ok(s.icon, "Has icon");
    assert.ok(s.shortDesc, "Has short description");
    assert.ok(s.fullDesc, "Has full description");
    assert.ok(s.warranty, "Has warranty statement");
    assert.ok(s.symptoms.length >= 3, `${s.title} has at least 3 symptoms`);
    assert.ok(s.process.length >= 3, `${s.title} has at least 3 process steps`);
    assert.ok(s.faqs.length >= 2, `${s.title} has at least 2 FAQs`);
  }
});
