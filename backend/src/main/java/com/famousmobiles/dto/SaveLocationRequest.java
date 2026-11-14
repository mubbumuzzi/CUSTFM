package com.famousmobiles.dto;

public class SaveLocationRequest {
    private String locality;
    private Double latitude;
    private Double longitude;
    private Double distanceKm;
    private Boolean eligible;
    private String eta;
    private String mobileNumber;

    public SaveLocationRequest() {}

    public String getLocality() { return locality; }
    public void setLocality(String locality) { this.locality = locality; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public Double getDistanceKm() { return distanceKm; }
    public void setDistanceKm(Double distanceKm) { this.distanceKm = distanceKm; }

    public Boolean getEligible() { return eligible; }
    public void setEligible(Boolean eligible) { this.eligible = eligible; }

    public String getEta() { return eta; }
    public void setEta(String eta) { this.eta = eta; }

    public String getMobileNumber() { return mobileNumber; }
    public void setMobileNumber(String mobileNumber) { this.mobileNumber = mobileNumber; }
}
