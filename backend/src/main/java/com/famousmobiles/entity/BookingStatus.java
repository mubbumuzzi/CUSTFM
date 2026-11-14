package com.famousmobiles.entity;

public enum BookingStatus {
    // 11 PRD Stages
    NEW_ENQUIRY("New Enquiry Logged", 0),
    CUSTOMER_CONTACTED("Customer Contacted", 1),
    APPOINTMENT_CONFIRMED("Appointment Confirmed", 2),
    TECHNICIAN_ASSIGNED("Technician Assigned", 3),
    PART_COLLECTED("Part Collected from Manikonda Hub", 4),
    TECHNICIAN_ON_THE_WAY("Technician On The Way", 5),
    TECHNICIAN_ARRIVED("Technician Arrived", 6),
    DIAGNOSIS_COMPLETED("Diagnosis Completed", 7),
    AWAITING_CUSTOMER_APPROVAL("Awaiting Customer Approval", 8),
    REPAIR_IN_PROGRESS("Repair In Progress", 9),
    COMPLETED_AND_CLOSED("Repair Completed and Closed", 10),

    // Alternative outcomes
    CANCELLED("Enquiry Cancelled", -1),
    SHOP_PICKUP_REQUIRED("Shop Pickup Required", -2),
    REPAIR_DECLINED("Repair Declined", -3);

    private final String displayLabel;
    private final int stageIndex;

    BookingStatus(String displayLabel, int stageIndex) {
        this.displayLabel = displayLabel;
        this.stageIndex = stageIndex;
    }

    public String getDisplayLabel() {
        return displayLabel;
    }

    public int getStageIndex() {
        return stageIndex;
    }
}
