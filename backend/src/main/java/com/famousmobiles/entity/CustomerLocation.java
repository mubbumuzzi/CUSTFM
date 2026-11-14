package com.famousmobiles.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "customer_locations", indexes = {
        @Index(name = "idx_loc_created", columnList = "createdAt")
})
public class CustomerLocation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 250)
    private String locality;

    private Double latitude;

    private Double longitude;

    private Double distanceKm;

    private boolean eligible;

    @Column(length = 50)
    private String eta;

    @Column(length = 20)
    private String mobileNumber;

    @Column(length = 64)
    private String ipAddress;

    @Column(length = 255)
    private String userAgent;

    private LocalDateTime createdAt = LocalDateTime.now();

    public CustomerLocation() {}

    public CustomerLocation(String locality, Double latitude, Double longitude, Double distanceKm, boolean eligible, String eta) {
        this.locality = locality;
        this.latitude = latitude;
        this.longitude = longitude;
        this.distanceKm = distanceKm;
        this.eligible = eligible;
        this.eta = eta;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getLocality() { return locality; }
    public void setLocality(String locality) { this.locality = locality; }

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

    public String getMobileNumber() { return mobileNumber; }
    public void setMobileNumber(String mobileNumber) { this.mobileNumber = mobileNumber; }

    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }

    public String getUserAgent() { return userAgent; }
    public void setUserAgent(String userAgent) { this.userAgent = userAgent; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
