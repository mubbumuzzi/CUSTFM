package com.famousmobiles.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class BookingResponse {
    private String bookingId;
    private String status;
    private String displayStatus;
    private String mobileNumber;
    private String customerName;
    private String brandModel;
    private String repairCategory;
    private String address;
    private BigDecimal visitCharge;
    private boolean firstVisitFree;
    private String confirmationMessage;
    private LocalDateTime timestamp;

    public BookingResponse() {
    }

    public String getBookingId() { return bookingId; }
    public void setBookingId(String bookingId) { this.bookingId = bookingId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getDisplayStatus() { return displayStatus; }
    public void setDisplayStatus(String displayStatus) { this.displayStatus = displayStatus; }

    public String getMobileNumber() { return mobileNumber; }
    public void setMobileNumber(String mobileNumber) { this.mobileNumber = mobileNumber; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getBrandModel() { return brandModel; }
    public void setBrandModel(String brandModel) { this.brandModel = brandModel; }

    public String getRepairCategory() { return repairCategory; }
    public void setRepairCategory(String repairCategory) { this.repairCategory = repairCategory; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public BigDecimal getVisitCharge() { return visitCharge; }
    public void setVisitCharge(BigDecimal visitCharge) { this.visitCharge = visitCharge; }

    public boolean isFirstVisitFree() { return firstVisitFree; }
    public void setFirstVisitFree(boolean firstVisitFree) { this.firstVisitFree = firstVisitFree; }

    public String getConfirmationMessage() { return confirmationMessage; }
    public void setConfirmationMessage(String confirmationMessage) { this.confirmationMessage = confirmationMessage; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
