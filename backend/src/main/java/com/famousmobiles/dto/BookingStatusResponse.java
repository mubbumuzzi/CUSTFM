package com.famousmobiles.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class BookingStatusResponse {
    private String bookingId;
    private String statusCode;
    private String statusLabel;
    private int currentStageIndex;
    private int totalStages = 11;
    private String customerName;
    private String mobileNumber;
    private String brandModel;
    private String repairCategory;
    private String address;
    private Double latitude;
    private Double longitude;
    private String googleMapsUrl;
    private BigDecimal visitCharge;
    private boolean firstVisitFree;
    private String technicianName;
    private String technicianPhone;
    private String etaMinutes;
    private BigDecimal quoteAmount;
    private boolean quoteApproved;
    private String handshakeOtp;
    private List<StageInfo> stages;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static class StageInfo {
        private int index;
        private String name;
        private boolean completed;
        private boolean active;

        public StageInfo(int index, String name, boolean completed, boolean active) {
            this.index = index;
            this.name = name;
            this.completed = completed;
            this.active = active;
        }

        public int getIndex() { return index; }
        public String getName() { return name; }
        public boolean isCompleted() { return completed; }
        public boolean isActive() { return active; }
    }

    public BookingStatusResponse() {
    }

    public String getBookingId() { return bookingId; }
    public void setBookingId(String bookingId) { this.bookingId = bookingId; }

    public String getStatusCode() { return statusCode; }
    public void setStatusCode(String statusCode) { this.statusCode = statusCode; }

    public String getStatusLabel() { return statusLabel; }
    public void setStatusLabel(String statusLabel) { this.statusLabel = statusLabel; }

    public int getCurrentStageIndex() { return currentStageIndex; }
    public void setCurrentStageIndex(int currentStageIndex) { this.currentStageIndex = currentStageIndex; }

    public int getTotalStages() { return totalStages; }
    public void setTotalStages(int totalStages) { this.totalStages = totalStages; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getMobileNumber() { return mobileNumber; }
    public void setMobileNumber(String mobileNumber) { this.mobileNumber = mobileNumber; }

    public String getBrandModel() { return brandModel; }
    public void setBrandModel(String brandModel) { this.brandModel = brandModel; }

    public String getRepairCategory() { return repairCategory; }
    public void setRepairCategory(String repairCategory) { this.repairCategory = repairCategory; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public String getGoogleMapsUrl() { return googleMapsUrl; }
    public void setGoogleMapsUrl(String googleMapsUrl) { this.googleMapsUrl = googleMapsUrl; }

    public BigDecimal getVisitCharge() { return visitCharge; }
    public void setVisitCharge(BigDecimal visitCharge) { this.visitCharge = visitCharge; }

    public boolean isFirstVisitFree() { return firstVisitFree; }
    public void setFirstVisitFree(boolean firstVisitFree) { this.firstVisitFree = firstVisitFree; }

    public String getTechnicianName() { return technicianName; }
    public void setTechnicianName(String technicianName) { this.technicianName = technicianName; }

    public String getTechnicianPhone() { return technicianPhone; }
    public void setTechnicianPhone(String technicianPhone) { this.technicianPhone = technicianPhone; }

    public String getEtaMinutes() { return etaMinutes; }
    public void setEtaMinutes(String etaMinutes) { this.etaMinutes = etaMinutes; }

    public BigDecimal getQuoteAmount() { return quoteAmount; }
    public void setQuoteAmount(BigDecimal quoteAmount) { this.quoteAmount = quoteAmount; }

    public boolean isQuoteApproved() { return quoteApproved; }
    public void setQuoteApproved(boolean quoteApproved) { this.quoteApproved = quoteApproved; }

    public String getHandshakeOtp() { return handshakeOtp; }
    public void setHandshakeOtp(String handshakeOtp) { this.handshakeOtp = handshakeOtp; }

    public List<StageInfo> getStages() { return stages; }
    public void setStages(List<StageInfo> stages) { this.stages = stages; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
