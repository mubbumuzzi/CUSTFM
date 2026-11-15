package com.famousmobiles.controller;

import com.famousmobiles.dto.PlaceSearchResult;
import com.famousmobiles.dto.ReverseGeocodeResponse;
import com.famousmobiles.dto.SaveLocationRequest;
import com.famousmobiles.entity.CustomerLocation;
import com.famousmobiles.repository.CustomerLocationRepository;
import com.famousmobiles.service.LocationService;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/public/location")
public class LocationController {

    private static final Logger log = LoggerFactory.getLogger(LocationController.class);

    private final CustomerLocationRepository locationRepository;
    private final LocationService locationService;

    public LocationController(CustomerLocationRepository locationRepository, LocationService locationService) {
        this.locationRepository = locationRepository;
        this.locationService = locationService;
    }

    /**
     * Zomato/Swiggy-style high accuracy reverse geocoding with custom User-Agent,
     * in-memory coordinate caching, and verified locality centroid fallback.
     */
    @GetMapping("/reverse")
    public ResponseEntity<ReverseGeocodeResponse> reverseGeocode(
            @RequestParam double lat,
            @RequestParam(name = "lng", required = false) Double lng,
            @RequestParam(name = "lon", required = false) Double lon) {

        double actualLng = (lng != null) ? lng : (lon != null ? lon : 78.3888);
        ReverseGeocodeResponse response = locationService.reverseGeocode(lat, actualLng);
        return ResponseEntity.ok(response);
    }

    /**
     * Zomato/Swiggy-style live search autocomplete for places, apartments, landmarks.
     */
    @GetMapping("/search")
    public ResponseEntity<List<PlaceSearchResult>> searchPlaces(@RequestParam String query) {
        List<PlaceSearchResult> results = locationService.searchPlaces(query);
        return ResponseEntity.ok(results);
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
        loc.setEligible(request.getEligible() != null ? request.getEligible() : (loc.getDistanceKm() <= LocationService.MAX_RADIUS_KM));
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
