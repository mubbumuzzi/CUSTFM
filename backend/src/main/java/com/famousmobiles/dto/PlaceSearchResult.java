package com.famousmobiles.dto;

public class PlaceSearchResult {
    private String placeId;
    private String title;
    private String subtitle;
    private Double latitude;
    private Double longitude;
    private Double distanceKm;
    private boolean eligible;
    private String eta;

    public PlaceSearchResult() {
    }

    public PlaceSearchResult(String placeId, String title, String subtitle,
                             Double latitude, Double longitude, Double distanceKm,
                             boolean eligible, String eta) {
        this.placeId = placeId;
        this.title = title;
        this.subtitle = subtitle;
        this.latitude = latitude;
        this.longitude = longitude;
        this.distanceKm = distanceKm;
        this.eligible = eligible;
        this.eta = eta;
    }

    public String getPlaceId() { return placeId; }
    public void setPlaceId(String placeId) { this.placeId = placeId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getSubtitle() { return subtitle; }
    public void setSubtitle(String subtitle) { this.subtitle = subtitle; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public Double getDistanceKm() { return distanceKm; }
    public void setDistanceKm(Double distanceKm) { this.distanceKm = distanceKm; }

    public boolean isEligible() { return eligible; }
    public void setEligible(boolean eligible) { this.eligible = eligible; }

    public String getEta() { return eta; }
    public void setEta(String eta) { this.eta = eta; }
}
