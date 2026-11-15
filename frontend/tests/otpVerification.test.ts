import { test } from "node:test";
import assert from "node:assert";
import { sendOtpApi, verifyOtpApi, verifyHandshakeOtpApi } from "../src/lib/api.ts";

test("sendOtpApi provides demo OTP '1234' on local simulation", async () => {
  const res = await sendOtpApi("9063786751");
  assert.strictEqual(res.success, true);
  assert.strictEqual(res.demoOtp, "1234");
});

test("verifyOtpApi accepts demo code '1234' without backend", async () => {
  const res = await verifyOtpApi("9063786751", "1234");
  assert.strictEqual(res.success, true);
});

test("verifyOtpApi rejects invalid OTP codes in fallback mode", async () => {
  const res = await verifyOtpApi("9063786751", "9999");
  assert.strictEqual(res.success, false);
});
