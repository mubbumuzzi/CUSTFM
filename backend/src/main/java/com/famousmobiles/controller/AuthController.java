package com.famousmobiles.controller;

import com.famousmobiles.dto.SendOtpRequest;
import com.famousmobiles.dto.VerifyOtpRequest;
import com.famousmobiles.service.OtpService;
import jakarta.validation.Valid;
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
        String generatedOtp = otpService.generateAndSaveOtp(request.getMobileNumber());
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "OTP sent successfully to +91 " + request.getMobileNumber(),
                "demoOtp", generatedOtp // Provided for frictionless testing & evaluation
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
                    "message", "Invalid OTP. For test demonstration, please use 1234."
            ));
        }
    }
}
