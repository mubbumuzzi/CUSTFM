package com.famousmobiles.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/public/eligibility")
public class EligibilityController {

    private static final double SHOP_LAT = 17.4058;
    private static final double SHOP_LNG = 78.3879;
    private static final double MAX_RADIUS_KM = 6.0;

    @GetMapping
    public ResponseEntity<Map<String, Object>> checkEligibility(
            @RequestParam(required = false) String locality,
            @RequestParam(required = false) Double km) {

        double distance = km != null ? km : 1.4;
        String name = locality != null ? locality : "Lanco Hills, Manikonda";

        if (locality != null) {
            String lower = locality.toLowerCase();
            if (lower.contains("kondapur") || lower.contains("hitec city")) {
                distance = 7.2;
            } else if (lower.contains("gachibowli")) {
                distance = 4.8;
            } else if (lower.contains("puppalaguda")) {
                distance = 0.8;
            } else if (lower.contains("alkapoor")) {
                distance = 2.1;
            } else if (lower.contains("ou colony") || lower.contains("shaikpet")) {
                distance = 1.2;
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
                        ? "Great news! Your location is within our 6 km doorstep repair zone. 1st visit is ₹0 FREE!"
                        : "Your location exceeds 6 km (" + distance + " km). Doorstep is not available, but you can bring it to our Shaikpet / Puppalaguda shop or request lab pickup."
        ));
    }
}
