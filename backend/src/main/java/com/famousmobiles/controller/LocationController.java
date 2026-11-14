package com.famousmobiles.controller;

import com.famousmobiles.dto.SaveLocationRequest;
import com.famousmobiles.entity.CustomerLocation;
import com.famousmobiles.repository.CustomerLocationRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/public/location")
public class LocationController {

    private static final Logger log = LoggerFactory.getLogger(LocationController.class);

    private final CustomerLocationRepository locationRepository;

    public LocationController(CustomerLocationRepository locationRepository) {
        this.locationRepository = locationRepository;
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> saveCustomerLocation(
            @RequestBody SaveLocationRequest request,
            HttpServletRequest servletRequest) {

        CustomerLocation loc = new CustomerLocation();
        loc.setLocality(request.getLocality() != null && !request.getLocality().isBlank() 
                ? request.getLocality() 
                : "Manikonda Area");
        loc.setLatitude(request.getLatitude());
        loc.setLongitude(request.getLongitude());
        loc.setDistanceKm(request.getDistanceKm() != null ? request.getDistanceKm() : 0.0);
        loc.setEligible(request.getEligible() != null ? request.getEligible() : (loc.getDistanceKm() <= 5.0));
        loc.setEta(request.getEta());
        loc.setMobileNumber(request.getMobileNumber());

        String clientIp = servletRequest.getHeader("X-Forwarded-For");
        if (clientIp == null || clientIp.isBlank()) {
            clientIp = servletRequest.getRemoteAddr();
        }
        loc.setIpAddress(clientIp);
        loc.setUserAgent(servletRequest.getHeader("User-Agent"));

        CustomerLocation saved = locationRepository.save(loc);
        log.info("Saved customer GPS location: {} ({}, {}) distance: {} km, eligible: {}, ID: {}",
                saved.getLocality(), saved.getLatitude(), saved.getLongitude(), saved.getDistanceKm(), saved.isEligible(), saved.getId());

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "success", true,
                "id", saved.getId(),
                "locality", saved.getLocality(),
                "distanceKm", saved.getDistanceKm(),
                "eligible", saved.isEligible(),
                "eta", saved.getEta() != null ? saved.getEta() : "45 mins",
                "message", "Location recorded in database successfully"
        ));
    }

    @GetMapping("/latest")
    public ResponseEntity<?> getLatestLocations() {
        return ResponseEntity.ok(locationRepository.findTop20ByOrderByCreatedAtDesc());
    }
}
