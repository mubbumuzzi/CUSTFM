package com.famousmobiles.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings", indexes = {
        @Index(name = "idx_booking_id", columnList = "bookingId", unique = true),
        @Index(name = "idx_mobile_number", columnList = "mobileNumber")
})
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 32)
    private String bookingId;

    @Column(nullable = false, length = 15)
    private String mobileNumber;

    @Column(length = 100)
    private String customerName;

    @Column(length = 100)
    private String brandModel;

    @Column(length = 100)
    private String repairCategory;

    @Column(columnDefinition = "TEXT")
    private String issueDescription;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(length = 150)
    private String landmark;

    @Column(length = 100)
    private String preferredTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    private BookingStatus status = BookingStatus.NEW_ENQUIRY;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal visitCharge = BigDecimal.ZERO;

    @Column(nullable = false)
    private boolean firstVisitFree = true;

    @Column(precision = 10, scale = 2)
    private BigDecimal quoteAmount;

    @Column(nullable = false)
    private boolean quoteApproved = false;

    @Column(length = 100)
    private String technicianName;

    @Column(length = 20)
    private String technicianPhone;

    @Column(length = 50)
    private String etaMinutes;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();

    public Booking() {
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getBookingId() { return bookingId; }
    public void setBookingId(String bookingId) { this.bookingId = bookingId; }

    public String getMobileNumber() { return mobileNumber; }
    public void setMobileNumber(String mobileNumber) { this.mobileNumber = mobileNumber; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getBrandModel() { return brandModel; }
    public void setBrandModel(String brandModel) { this.brandModel = brandModel; }

    public String getRepairCategory() { return repairCategory; }
    public void setRepairCategory(String repairCategory) { this.repairCategory = repairCategory; }

    public String getIssueDescription() { return issueDescription; }
    public void setIssueDescription(String issueDescription) { this.issueDescription = issueDescription; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getLandmark() { return landmark; }
    public void setLandmark(String landmark) { this.landmark = landmark; }

    public String getPreferredTime() { return preferredTime; }
    public void setPreferredTime(String preferredTime) { this.preferredTime = preferredTime; }

    public BookingStatus getStatus() { return status; }
    public void setStatus(BookingStatus status) { this.status = status; }

    public BigDecimal getVisitCharge() { return visitCharge; }
    public void setVisitCharge(BigDecimal visitCharge) { this.visitCharge = visitCharge; }

    public boolean isFirstVisitFree() { return firstVisitFree; }
    public void setFirstVisitFree(boolean firstVisitFree) { this.firstVisitFree = firstVisitFree; }

    public BigDecimal getQuoteAmount() { return quoteAmount; }
    public void setQuoteAmount(BigDecimal quoteAmount) { this.quoteAmount = quoteAmount; }

    public boolean isQuoteApproved() { return quoteApproved; }
    public void setQuoteApproved(boolean quoteApproved) { this.quoteApproved = quoteApproved; }

    public String getTechnicianName() { return technicianName; }
    public void setTechnicianName(String technicianName) { this.technicianName = technicianName; }

    public String getTechnicianPhone() { return technicianPhone; }
    public void setTechnicianPhone(String technicianPhone) { this.technicianPhone = technicianPhone; }

    public String getEtaMinutes() { return etaMinutes; }
    public void setEtaMinutes(String etaMinutes) { this.etaMinutes = etaMinutes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
