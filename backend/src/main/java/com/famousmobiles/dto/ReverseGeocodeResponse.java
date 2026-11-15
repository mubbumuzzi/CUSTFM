package com.famousmobiles.dto;

public class ReverseGeocodeResponse {
    private String areaTitle;
    private String locality;
    private String formattedAddress;
    private Double latitude;
    private Double longitude;
    private Double distanceKm;
    private boolean eligible;
    private String eta;
    private String postalCode;
    private String source;

    public ReverseGeocodeResponse() {
    }

    public ReverseGeocodeResponse(String areaTitle, String locality, String formattedAddress,
                                  Double latitude, Double longitude, Double distanceKm,
                                  boolean eligible, String eta, String postalCode, String source) {
        this.areaTitle = areaTitle;
        this.locality = locality;
        this.formattedAddress = formattedAddress;
        this.latitude = latitude;
        this.longitude = longitude;
        this.distanceKm = distanceKm;
        this.eligible = eligible;
        this.eta = eta;
        this.postalCode = postalCode;
        this.source = source;
    }

    public String getAreaTitle() { return areaTitle; }
    public void setAreaTitle(String areaTitle) { this.areaTitle = areaTitle; }

    public String getLocality() { return locality; }
    public void setLocality(String locality) { this.locality = locality; }

    public String getFormattedAddress() { return formattedAddress; }
    public void setFormattedAddress(String formattedAddress) { this.formattedAddress = formattedAddress; }

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

    public String getPostalCode() { return postalCode; }
    public void setPostalCode(String postalCode) { this.postalCode = postalCode; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
}
