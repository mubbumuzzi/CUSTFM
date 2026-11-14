import test from "node:test";
import assert from "node:assert/strict";

const INDIAN_MOBILE_REGEX = /^[6-9]\d{9}$/;

test("Valid Indian 10-digit mobile numbers pass regex validation", () => {
  const validNumbers = [
    "9876543210",
    "8123456789",
    "7012345678",
    "6234567890",
    "9063786751",
  ];

  for (const num of validNumbers) {
    assert.ok(
      INDIAN_MOBILE_REGEX.test(num),
      `Valid number ${num} should pass regex`
    );
  }
});

test("Invalid mobile numbers fail regex validation", () => {
  const invalidNumbers = [
    "1234567890", // Starts with 1
    "0987654321", // Starts with 0
    "5555555555", // Starts with 5
    "987654321",  // 9 digits (too short)
    "98765432100", // 11 digits (too long)
    "abcdefghij", // Alphabetic
    "+919876543210", // Prefix not allowed in raw input
    " 9876543210 ", // Trailing whitespace
    "", // Empty
  ];

  for (const num of invalidNumbers) {
    assert.equal(
      INDIAN_MOBILE_REGEX.test(num),
      false,
      `Invalid number '${num}' should fail regex`
    );
  }
});
