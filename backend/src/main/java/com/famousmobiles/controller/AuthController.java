package com.famousmobiles.controller;

import com.famousmobiles.dto.BookingStatusResponse;
import com.famousmobiles.dto.OtpSendResult;
import com.famousmobiles.dto.SendOtpRequest;
import com.famousmobiles.dto.VerifyOtpRequest;
import com.famousmobiles.service.BookingService;
import com.famousmobiles.service.OtpService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final OtpService otpService;
    private final BookingService bookingService;

    @Value("${famousmobiles.sms.expose-demo-otp:false}")
    private boolean exposeDemoOtp = false;

    @Value("${famousmobiles.sms.allow-demo-bypass:false}")
    private boolean allowDemoBypass = false;

    public AuthController(OtpService otpService, BookingService bookingService) {
        this.otpService = otpService;
        this.bookingService = bookingService;
    }

    @PostMapping("/send-otp")
    public ResponseEntity<Map<String, Object>> sendOtp(@Valid @RequestBody SendOtpRequest request) {
        OtpSendResult result = otpService.sendOtp(request.getMobileNumber());
        if (result.isRateLimited()) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body(Map.of(
                    "success", false,
                    "message", result.getMessage(),
                    "retryAfterSeconds", result.getRetryAfterSeconds()
            ));
        }

        Map<String, Object> response = new java.util.HashMap<>();
        response.put("success", true);
        response.put("message", result.getMessage());
        response.put("provider", result.getProvider() != null ? result.getProvider() : "SMS");
        response.put("cooldownSeconds", result.getCooldownSeconds());

        // In production, exposeDemoOtp is false, so demoOtp is NEVER leaked to clients
        if (exposeDemoOtp && result.getOtpCode() != null) {
            response.put("demoOtp", result.getOtpCode());
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<Map<String, Object>> verifyOtp(@Valid @RequestBody VerifyOtpRequest request) {
        boolean valid = otpService.verifyOtp(request.getMobileNumber(), request.getOtpCode());
        if (valid) {
            String cleanMobile = request.getMobileNumber().trim();
            List<BookingStatusResponse> bookings = bookingService.getBookingsForCustomer(cleanMobile);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "OTP verified successfully",
                    "authToken", "FM-TOKEN-" + System.currentTimeMillis(),
                    "mobileNumber", cleanMobile,
                    "bookings", bookings
            ));
        } else {
            String errorMsg = allowDemoBypass
                    ? "Invalid OTP. Please check the SMS or use test code 1234."
                    : "Invalid or expired OTP. Please check the 4-digit code sent to your phone.";
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", errorMsg
            ));
        }
    }
}
