package com.famousmobiles.controller;

import com.famousmobiles.dto.OtpSendResult;
import com.famousmobiles.dto.SendOtpRequest;
import com.famousmobiles.dto.VerifyOtpRequest;
import com.famousmobiles.service.OtpService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final OtpService otpService;

    public AuthController(OtpService otpService) {
        this.otpService = otpService;
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

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", result.getMessage(),
                "provider", result.getProvider() != null ? result.getProvider() : "SMS",
                "cooldownSeconds", result.getCooldownSeconds(),
                "demoOtp", result.getOtpCode() != null ? result.getOtpCode() : "1234"
        ));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<Map<String, Object>> verifyOtp(@Valid @RequestBody VerifyOtpRequest request) {
        boolean valid = otpService.verifyOtp(request.getMobileNumber(), request.getOtpCode());
        if (valid) {
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "OTP verified successfully",
                    "authToken", "DEMO-JWT-" + System.currentTimeMillis()
            ));
        } else {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Invalid OTP. Please check the SMS or use test code 1234."
            ));
        }
    }
}
