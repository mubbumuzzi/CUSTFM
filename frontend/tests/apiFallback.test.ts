import test from "node:test";
import assert from "node:assert/strict";
import { submitBookingEnquiry, fetchBookingStatus } from "../src/lib/api.ts";

test("submitBookingEnquiry fallback returns valid FM-2026-XXXX booking structure", async () => {
  const result = await submitBookingEnquiry({
    mobileNumber: "9876543210",
    customerName: "Mohammed",
    brandModel: "iPhone 14",
    repairCategory: "Display Replacement",
    address: "Lanco Hills, Manikonda",
  });

  assert.ok(result, "Result should be returned");
  assert.match(result.bookingId, /^FM-2026-\d{4}$/, "Booking ID must follow FM-2026-XXXX format");
  assert.equal(result.mobileNumber, "9876543210");
  assert.equal(result.customerName, "Mohammed");
  assert.equal(result.firstVisitFree, true, "New booking defaults to first visit free");
  assert.equal(result.visitCharge, 0);
  assert.ok(result.confirmationMessage.length > 10);
});

test("fetchBookingStatus fallback returns all 11 stages with Ramesh K technician card", async () => {
  const status = await fetchBookingStatus("FM-2026-9812", "9876543210");

  assert.ok(status, "Status data should be returned");
  assert.equal(status.bookingId, "FM-2026-9812");
  assert.equal(status.totalStages, 11);
  assert.equal(status.stages.length, 11);
  assert.equal(status.statusCode, "TECHNICIAN_ON_THE_WAY");
  assert.match(status.technicianName, /Ramesh K/);
  assert.match(status.technicianPhone, /\+91/);
  assert.equal(status.quoteAmount, 3499);
});
