package com.famousmobiles.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/public/eligibility")
public class EligibilityController {

    private static final double SHOP_LAT = 17.4022;
    private static final double SHOP_LNG = 78.3888;
    private static final double MAX_RADIUS_KM = 5.0;

    @GetMapping
    public ResponseEntity<Map<String, Object>> checkEligibility(
            @RequestParam(required = false) String locality,
            @RequestParam(required = false) Double km) {

        double distance = km != null ? km : 1.4;
        String name = locality != null ? locality : "Lanco Hills, Manikonda";

        if (locality != null) {
            String lower = locality.toLowerCase();
            if (lower.contains("financial") || lower.contains("gachibowli") || lower.contains("hitec") || lower.contains("kondapur")) {
                distance = 6.8;
            } else if (lower.contains("puppalaguda")) {
                distance = 2.6;
            } else if (lower.contains("alkapoor")) {
                distance = 3.3;
            } else if (lower.contains("ou colony") || lower.contains("shaikpet")) {
                distance = 2.9;
            } else if (lower.contains("lanco")) {
                distance = 1.4;
            }
        }

        boolean isDoorstepEligible = distance <= MAX_RADIUS_KM;

        return ResponseEntity.ok(Map.of(
                "locality", name,
                "distanceKm", distance,
                "doorstepEligible", isDoorstepEligible,
                "maxRadiusKm", MAX_RADIUS_KM,
                "serviceMessage", isDoorstepEligible
                        ? "Great news! Your location is within our 5 km doorstep repair zone. 1st visit is ₹0 FREE!"
                        : "Your location exceeds 5 km (" + distance + " km). Doorstep is not available, but you can bring it to our Manikonda shop or request lab pickup."
        ));
    }
}
