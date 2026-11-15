package com.famousmobiles.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.famousmobiles.dto.PlaceSearchResult;
import com.famousmobiles.dto.ReverseGeocodeResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class LocationService {

    private static final Logger log = LoggerFactory.getLogger(LocationService.class);

    public static final double SHOP_LAT = 17.4058;
    public static final double SHOP_LNG = 78.3879;
    public static final double MAX_RADIUS_KM = 6.0;

    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;
    private final Map<String, ReverseGeocodeResponse> cache = new ConcurrentHashMap<>();

    // Curated high-precision geographic centroids for Hyderabad / Cyberabad / Manikonda localities
    private static final List<LocalityCentroid> VERIFIED_LOCALITIES = List.of(
            new LocalityCentroid("Lanco Hills", "Manikonda", 17.4045, 78.3752, "500089"),
            new LocalityCentroid("Secretariat Colony", "Manikonda", 17.4055, 78.3768, "500089"),
            new LocalityCentroid("Manikonda Main Road", "Manikonda", 17.4022, 78.3888, "500089"),
            new LocalityCentroid("Puppalaguda", "Manikonda", 17.4000, 78.3862, "500089"),
            new LocalityCentroid("Alkapoor Township", "Manikonda", 17.3967, 78.3717, "500089"),
            new LocalityCentroid("Neknampur", "Manikonda", 17.3892, 78.3812, "500089"),
            new LocalityCentroid("OU Colony", "Shaikpet", 17.4085, 78.3980, "500008"),
            new LocalityCentroid("Shaikpet", "Hyderabad", 17.4120, 78.4050, "500008"),
            new LocalityCentroid("Tolichowki", "Hyderabad", 17.4020, 78.4110, "500008"),
            new LocalityCentroid("Khajaguda", "Gachibowli", 17.4200, 78.3680, "500075"),
            new LocalityCentroid("Nanakramguda", "Financial District", 17.4150, 78.3480, "500032"),
            new LocalityCentroid("Financial District", "Gachibowli", 17.4180, 78.3380, "500032"),
            new LocalityCentroid("Gachibowli", "Hyderabad", 17.4400, 78.3489, "500032"),
            new LocalityCentroid("Raidurg", "Knowledge City", 17.4350, 78.3800, "500081"),
            new LocalityCentroid("Hitec City", "Hyderabad", 17.4504, 78.3808, "500081"),
            new LocalityCentroid("Madhapur", "Hyderabad", 17.4485, 78.3908, "500081"),
            new LocalityCentroid("Jubilee Hills", "Hyderabad", 17.4319, 78.4073, "500033"),
            new LocalityCentroid("Banjara Hills", "Hyderabad", 17.4156, 78.4352, "500034"),
            new LocalityCentroid("Film Nagar", "Jubilee Hills", 17.4185, 78.4120, "500096"),
            new LocalityCentroid("Narsingi", "Hyderabad", 17.3820, 78.3640, "500075"),
            new LocalityCentroid("Kokapet", "Gandipet", 17.3980, 78.3280, "500075"),
            new LocalityCentroid("Gandipet", "Hyderabad", 17.3900, 78.3150, "500075"),
            new LocalityCentroid("Mehdipatnam", "Hyderabad", 17.3916, 78.4414, "500028"),
            new LocalityCentroid("Attapur", "Hyderabad", 17.3680, 78.4280, "500048"),
            new LocalityCentroid("Kondapur", "Hyderabad", 17.4650, 78.3580, "500084")
    );

    public LocationService() {
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(3))
                .build();
        this.objectMapper = new ObjectMapper();
    }

    public static double calculateDistanceKm(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Earth radius in km
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return Math.round(R * c * 10.0) / 10.0;
    }

    public static String getEtaForDistance(double distanceKm) {
        if (distanceKm > MAX_RADIUS_KM) {
            return "Shop Visit Only";
        }
        if (distanceKm <= 0.5) {
            return "10-15 mins";
        }
        if (distanceKm <= 1.5) {
            return "15-25 mins";
        }
        if (distanceKm <= 3.0) {
            return "25-35 mins";
        }
        if (distanceKm <= 5.0) {
            return "35-45 mins";
        }
        return "45-60 mins";
    }

    public ReverseGeocodeResponse reverseGeocode(double lat, double lon) {
        String cacheKey = String.format(Locale.US, "%.4f,%.4f", lat, lon);
        if (cache.containsKey(cacheKey)) {
            return cache.get(cacheKey);
        }

        double distanceKm = calculateDistanceKm(lat, lon, SHOP_LAT, SHOP_LNG);
        boolean eligible = distanceKm <= MAX_RADIUS_KM;
        String eta = getEtaForDistance(distanceKm);

        try {
            String url = String.format(Locale.US,
                    "https://nominatim.openstreetmap.org/reverse?lat=%.6f&lon=%.6f&format=json&addressdetails=1",
                    lat, lon);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("User-Agent", "FamousMobiles-CustFM/1.0 (contact@famousmobiles.com)")
                    .header("Accept-Language", "en")
                    .timeout(Duration.ofSeconds(4))
                    .GET()
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200 && response.body() != null && !response.body().isBlank()) {
                JsonNode root = objectMapper.readTree(response.body());
                JsonNode addr = root.path("address");

                String rawArea = extractBestAreaName(addr);
                String cleanArea = sanitizeAdministrativeWard(rawArea);
                String suburb = addr.path("suburb").asText("");
                String city = addr.has("city") ? addr.path("city").asText()
                        : addr.has("town") ? addr.path("town").asText() : "Hyderabad";
                String postcode = addr.path("postcode").asText("500089");

                String locality = buildLocalityLabel(cleanArea, suburb, city);
                String formattedAddress = root.path("display_name").asText(locality);

                ReverseGeocodeResponse res = new ReverseGeocodeResponse(
                        cleanArea,
                        locality,
                        formattedAddress,
                        lat,
                        lon,
                        distanceKm,
                        eligible,
                        eta,
                        postcode,
                        "NOMINATIM"
                );
                cache.put(cacheKey, res);
                return res;
            }
        } catch (Exception e) {
            log.warn("Nominatim reverse geocode error for {},{}: {}. Using verified centroid fallback.", lat, lon, e.getMessage());
        }

        // Geometric Centroid Fallback: Find closest verified locality by coordinate distance
        ReverseGeocodeResponse fallback = findClosestVerifiedLocality(lat, lon, distanceKm, eligible, eta);
        cache.put(cacheKey, fallback);
        return fallback;
    }

    public List<PlaceSearchResult> searchPlaces(String query) {
        if (query == null || query.trim().length() < 2) {
            return Collections.emptyList();
        }

        String cleanQuery = query.trim().toLowerCase();
        List<PlaceSearchResult> results = new ArrayList<>();

        // 1. Instant match from verified localities list
        for (LocalityCentroid c : VERIFIED_LOCALITIES) {
            if (c.area.toLowerCase().contains(cleanQuery) || c.suburb.toLowerCase().contains(cleanQuery)) {
                double dist = calculateDistanceKm(c.lat, c.lng, SHOP_LAT, SHOP_LNG);
                results.add(new PlaceSearchResult(
                        "local-" + c.area.toLowerCase().replace(" ", "-"),
                        c.area + ", " + c.suburb,
                        "Hyderabad, Telangana " + c.postcode,
                        c.lat,
                        c.lng,
                        dist,
                        dist <= MAX_RADIUS_KM,
                        getEtaForDistance(dist)
                ));
            }
        }

        // 2. Query Nominatim Search with Hyderabad bounding box
        try {
            String encodedQuery = URLEncoder.encode(query.trim() + " Hyderabad", StandardCharsets.UTF_8);
            String url = "https://nominatim.openstreetmap.org/search?q=" + encodedQuery
                    + "&format=json&addressdetails=1&limit=5&viewbox=78.25,17.55,78.55,17.30&bounded=0";

            HttpRequest req = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("User-Agent", "FamousMobiles-CustFM/1.0 (contact@famousmobiles.com)")
                    .header("Accept-Language", "en")
                    .timeout(Duration.ofSeconds(4))
                    .GET()
                    .build();

            HttpResponse<String> resp = httpClient.send(req, HttpResponse.BodyHandlers.ofString());

            if (resp.statusCode() == 200 && resp.body() != null) {
                JsonNode array = objectMapper.readTree(resp.body());
                if (array.isArray()) {
                    for (JsonNode item : array) {
                        double itemLat = item.path("lat").asDouble();
                        double itemLng = item.path("lon").asDouble();
                        double dist = calculateDistanceKm(itemLat, itemLng, SHOP_LAT, SHOP_LNG);
                        boolean eligible = dist <= MAX_RADIUS_KM;

                        String displayName = item.path("display_name").asText();
                        String name = item.path("name").asText();
                        if (name == null || name.isBlank()) {
                            name = item.path("address").path("neighbourhood").asText();
                        }
                        if (name == null || name.isBlank()) {
                            name = item.path("address").path("suburb").asText("Hyderabad Area");
                        }
                        name = sanitizeAdministrativeWard(name);

                        // Avoid duplicate place titles
                        final String finalName = name;
                        boolean alreadyAdded = results.stream().anyMatch(r -> r.getTitle().equalsIgnoreCase(finalName));
                        if (!alreadyAdded) {
                            results.add(new PlaceSearchResult(
                                    "osm-" + item.path("place_id").asText(UUID.randomUUID().toString()),
                                    name,
                                    displayName,
                                    itemLat,
                                    itemLng,
                                    dist,
                                    eligible,
                                    getEtaForDistance(dist)
                            ));
                        }
                    }
                }
            }
        } catch (Exception e) {
            log.warn("Place search failed for '{}': {}", query, e.getMessage());
        }

        // Sort by distance from Manikonda shop so nearest doorstep options appear first
        results.sort(Comparator.comparingDouble(PlaceSearchResult::getDistanceKm));
        return results.subList(0, Math.min(results.size(), 8));
    }

    private String extractBestAreaName(JsonNode addr) {
        if (addr.hasNonNull("neighbourhood") && !addr.path("neighbourhood").asText().isBlank()) {
            return addr.path("neighbourhood").asText();
        }
        if (addr.hasNonNull("suburb") && !addr.path("suburb").asText().isBlank()) {
            return addr.path("suburb").asText();
        }
        if (addr.hasNonNull("residential") && !addr.path("residential").asText().isBlank()) {
            return addr.path("residential").asText();
        }
        if (addr.hasNonNull("road") && !addr.path("road").asText().isBlank()) {
            return addr.path("road").asText();
        }
        if (addr.hasNonNull("quarter") && !addr.path("quarter").asText().isBlank()) {
            return addr.path("quarter").asText();
        }
        return "Manikonda Area";
    }

    private String sanitizeAdministrativeWard(String raw) {
        if (raw == null) return "Manikonda Area";
        // Convert "Ward 94 Shaikpet" -> "Shaikpet", "Ward 105 Gachibowli" -> "Gachibowli"
        String cleaned = raw.replaceAll("(?i)^Ward\\s*\\d+\\s*", "").trim();
        cleaned = cleaned.replaceAll("(?i)\\s+mandal$", "").trim();
        cleaned = cleaned.replaceAll("(?i)\\s+circle$", "").trim();
        return cleaned.isBlank() ? "Manikonda Area" : cleaned;
    }

    private String buildLocalityLabel(String cleanArea, String suburb, String city) {
        if (suburb != null && !suburb.isBlank() && !cleanArea.equalsIgnoreCase(suburb)) {
            return cleanArea + ", " + suburb;
        }
        if (city != null && !city.isBlank() && !cleanArea.equalsIgnoreCase(city)) {
            return cleanArea + ", " + city;
        }
        return cleanArea + ", Hyderabad";
    }

    private ReverseGeocodeResponse findClosestVerifiedLocality(double lat, double lon, double distFromShop, boolean eligible, String eta) {
        LocalityCentroid best = VERIFIED_LOCALITIES.get(0);
        double minDistance = Double.MAX_VALUE;

        for (LocalityCentroid c : VERIFIED_LOCALITIES) {
            double d = calculateDistanceKm(lat, lon, c.lat, c.lng);
            if (d < minDistance) {
                minDistance = d;
                best = c;
            }
        }

        String areaTitle = best.area;
        String locality = best.area + ", " + best.suburb;
        String formatted = String.format("%s, %s, Hyderabad, Telangana %s", best.area, best.suburb, best.postcode);

        return new ReverseGeocodeResponse(
                areaTitle,
                locality,
                formatted,
                lat,
                lon,
                distFromShop,
                eligible,
                eta,
                best.postcode,
                "CENTROID_FALLBACK"
        );
    }

    private static class LocalityCentroid {
        final String area;
        final String suburb;
        final double lat;
        final double lng;
        final String postcode;

        LocalityCentroid(String area, String suburb, double lat, double lng, String postcode) {
            this.area = area;
            this.suburb = suburb;
            this.lat = lat;
            this.lng = lng;
            this.postcode = postcode;
        }
    }
}
