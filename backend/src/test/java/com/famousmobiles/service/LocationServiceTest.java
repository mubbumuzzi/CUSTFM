package com.famousmobiles.service;

import com.famousmobiles.dto.PlaceSearchResult;
import com.famousmobiles.dto.ReverseGeocodeResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class LocationServiceTest {

    private LocationService locationService;

    @BeforeEach
    void setUp() {
        locationService = new LocationService();
    }

    @Test
    @DisplayName("Haversine distance calculation matches expected km")
    void testCalculateDistanceKm() {
        // Distance from Manikonda shop to itself is 0
        double selfDist = LocationService.calculateDistanceKm(
                LocationService.SHOP_LAT, LocationService.SHOP_LNG,
                LocationService.SHOP_LAT, LocationService.SHOP_LNG);
        assertThat(selfDist).isEqualTo(0.0);

        // Distance to Lanco Hills (17.4045, 78.3752) is ~1.5 km
        double lancoDist = LocationService.calculateDistanceKm(
                LocationService.SHOP_LAT, LocationService.SHOP_LNG,
                17.4045, 78.3752);
        assertThat(lancoDist).isBetween(1.0, 2.0);
    }

    @Test
    @DisplayName("Doorstep arrival ETA correctly maps to distance buckets")
    void testGetEtaForDistance() {
        assertThat(LocationService.getEtaForDistance(0.2)).isEqualTo("10-15 mins");
        assertThat(LocationService.getEtaForDistance(0.5)).isEqualTo("10-15 mins");
        assertThat(LocationService.getEtaForDistance(1.2)).isEqualTo("15-25 mins");
        assertThat(LocationService.getEtaForDistance(2.2)).isEqualTo("25-35 mins");
        assertThat(LocationService.getEtaForDistance(4.2)).isEqualTo("35-45 mins");
        assertThat(LocationService.getEtaForDistance(5.5)).isEqualTo("45-60 mins");
        assertThat(LocationService.getEtaForDistance(6.5)).isEqualTo("Shop Visit Only");
    }

    @Test
    @DisplayName("Reverse geocoding resolves coordinates to clean locality without administrative ward noise")
    void testReverseGeocodeReturnsCleanLocality() {
        // Test near Lanco Hills coordinates
        ReverseGeocodeResponse response = locationService.reverseGeocode(17.4045, 78.3752);

        assertThat(response).isNotNull();
        assertThat(response.getAreaTitle()).isNotEmpty();
        assertThat(response.getAreaTitle()).doesNotContainIgnoringCase("ward");
        assertThat(response.getDistanceKm()).isLessThanOrEqualTo(LocationService.MAX_RADIUS_KM);
        assertThat(response.isEligible()).isTrue();
        assertThat(response.getEta()).isNotEmpty();
    }

    @Test
    @DisplayName("Place search matches verified local hubs instantly")
    void testSearchPlacesFindsLocalHubs() {
        List<PlaceSearchResult> results = locationService.searchPlaces("Lanco");

        assertThat(results).isNotEmpty();
        PlaceSearchResult top = results.get(0);
        assertThat(top.getTitle()).containsIgnoringCase("Lanco Hills");
        assertThat(top.getDistanceKm()).isLessThanOrEqualTo(LocationService.MAX_RADIUS_KM);
        assertThat(top.isEligible()).isTrue();
    }

    @Test
    @DisplayName("Place search with query under 2 characters returns empty list")
    void testSearchPlacesShortQueryReturnsEmpty() {
        List<PlaceSearchResult> results = locationService.searchPlaces("a");
        assertThat(results).isEmpty();
    }
}
