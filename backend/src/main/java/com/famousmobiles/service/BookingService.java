package com.famousmobiles.service;

import com.famousmobiles.dto.BookingEnquiryRequest;
import com.famousmobiles.dto.BookingResponse;
import com.famousmobiles.dto.BookingStatusResponse;
import com.famousmobiles.entity.Booking;
import com.famousmobiles.entity.BookingStatus;
import com.famousmobiles.entity.Customer;
import com.famousmobiles.repository.BookingRepository;
import com.famousmobiles.repository.CustomerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final CustomerRepository customerRepository;

    private static final String[] PRD_STAGE_NAMES = {
            "New Enquiry Logged",
            "Customer Contacted",
            "Appointment Confirmed",
            "Technician Assigned",
            "Part Collected from Manikonda Hub",
            "Technician On The Way",
            "Technician Arrived",
            "Diagnosis Completed",
            "Awaiting Customer Approval",
            "Repair In Progress",
            "Completed & Closed"
    };

    public BookingService(BookingRepository bookingRepository, CustomerRepository customerRepository) {
        this.bookingRepository = bookingRepository;
        this.customerRepository = customerRepository;
    }

    @Transactional
    public BookingResponse createEnquiry(BookingEnquiryRequest request) {
        String cleanMobile = request.getMobileNumber().trim();

        // Business Rule: Check first-visit-free eligibility based on customer identity & booking history
        Optional<Customer> existingCustomer = customerRepository.findByMobileNumber(cleanMobile);
        boolean isEligibleForFreeVisit = true;

        if (existingCustomer.isPresent() && existingCustomer.get().isFirstVisitFreeClaimed()) {
            isEligibleForFreeVisit = false;
        }

        BigDecimal visitCharge = isEligibleForFreeVisit ? BigDecimal.ZERO : new BigDecimal("49.00");

        // Unique Booking ID: FM-2026-XXXX
        int randomSuffix = 1000 + new Random().nextInt(9000);
        String bookingId = "FM-2026-" + randomSuffix;

        Booking booking = new Booking();
        booking.setBookingId(bookingId);
        booking.setMobileNumber(cleanMobile);
        booking.setCustomerName(request.getCustomerName() != null ? request.getCustomerName().trim() : "Valued Customer");
        booking.setBrandModel(request.getBrandModel() != null ? request.getBrandModel().trim() : "Smartphone");
        booking.setRepairCategory(request.getRepairCategory() != null ? request.getRepairCategory().trim() : "General Diagnosis");
        booking.setIssueDescription(request.getIssueDescription());
        booking.setAddress(request.getAddress() != null ? request.getAddress().trim() : "Manikonda, Hyderabad");
        booking.setLandmark(request.getLandmark());
        booking.setPreferredTime(request.getPreferredTime() != null ? request.getPreferredTime() : "Earliest Available (45 Mins)");
        booking.setStatus(BookingStatus.NEW_ENQUIRY);
        booking.setFirstVisitFree(isEligibleForFreeVisit);
        booking.setVisitCharge(visitCharge);
        booking.setQuoteAmount(null);
        booking.setTechnicianName(null);
        booking.setTechnicianPhone(null);
        booking.setEtaMinutes("Dispatching (~45 mins)");

        bookingRepository.save(booking);

        // Update Customer Record
        Customer customer = existingCustomer.orElseGet(() -> new Customer(cleanMobile));
        if (request.getCustomerName() != null && !request.getCustomerName().isBlank()) {
            customer.setName(request.getCustomerName().trim());
        }
        customer.setTotalBookings(customer.getTotalBookings() + 1);
        if (isEligibleForFreeVisit) {
            customer.setFirstVisitFreeClaimed(true);
        }
        customerRepository.save(customer);

        // Map to Response
        BookingResponse response = new BookingResponse();
        response.setBookingId(bookingId);
        response.setStatus(booking.getStatus().name());
        response.setDisplayStatus(booking.getStatus().getDisplayLabel());
        response.setMobileNumber(cleanMobile);
        response.setCustomerName(booking.getCustomerName());
        response.setBrandModel(booking.getBrandModel());
        response.setRepairCategory(booking.getRepairCategory());
        response.setAddress(booking.getAddress());
        response.setVisitCharge(visitCharge);
        response.setFirstVisitFree(isEligibleForFreeVisit);
        response.setTimestamp(booking.getCreatedAt());
        response.setConfirmationMessage("Your repair enquiry has been logged successfully. Famous Mobiles Manikonda support team will contact you shortly to confirm parts and appointment details.");

        return response;
    }

    public Optional<BookingStatusResponse> getBookingStatus(String bookingId, String mobileNumber) {
        Optional<Booking> bookingOpt = bookingRepository.findByBookingId(bookingId.trim().toUpperCase());
        if (bookingOpt.isEmpty()) {
            return Optional.empty();
        }

        Booking booking = bookingOpt.get();
        // IDOR Prevention: Verify mobile matches if supplied
        if (mobileNumber != null && !mobileNumber.isBlank()) {
            if (!booking.getMobileNumber().endsWith(mobileNumber.trim())) {
                return Optional.empty();
            }
        }

        BookingStatusResponse res = new BookingStatusResponse();
        res.setBookingId(booking.getBookingId());
        res.setStatusCode(booking.getStatus().name());
        res.setStatusLabel(booking.getStatus().getDisplayLabel());
        res.setCustomerName(booking.getCustomerName());
        res.setMobileNumber(booking.getMobileNumber());
        res.setBrandModel(booking.getBrandModel());
        res.setRepairCategory(booking.getRepairCategory());
        res.setAddress(booking.getAddress());
        res.setVisitCharge(booking.getVisitCharge());
        res.setFirstVisitFree(booking.isFirstVisitFree());
        int currentStageIdx = booking.getStatus().getStageIndex();
        if (currentStageIdx < 0) {
            currentStageIdx = 0; // Negative for alternative outcomes
        }
        res.setCurrentStageIndex(currentStageIdx);

        // Stage-aware visibility: only expose technician and quote at relevant lifecycle stages
        if (currentStageIdx < 3) {
            // Before technician is assigned (Stages 0-2):
            res.setTechnicianName(null);
            res.setTechnicianPhone(null);
            res.setEtaMinutes("Dispatching (~45 mins)");
        } else {
            res.setTechnicianName(booking.getTechnicianName());
            res.setTechnicianPhone(booking.getTechnicianPhone());
            res.setEtaMinutes(booking.getEtaMinutes());
        }

        if (currentStageIdx < 8) {
            // Quote only visible once diagnosis is completed (Stage 8+: AWAITING_CUSTOMER_APPROVAL)
            res.setQuoteAmount(null);
            res.setQuoteApproved(false);
        } else {
            res.setQuoteAmount(booking.getQuoteAmount());
            res.setQuoteApproved(booking.isQuoteApproved());
        }

        res.setCreatedAt(booking.getCreatedAt());
        res.setUpdatedAt(booking.getUpdatedAt());

        List<BookingStatusResponse.StageInfo> stages = new ArrayList<>();
        for (int i = 0; i < PRD_STAGE_NAMES.length; i++) {
            boolean completed = i < currentStageIdx;
            boolean active = i == currentStageIdx;
            stages.add(new BookingStatusResponse.StageInfo(i, PRD_STAGE_NAMES[i], completed, active));
        }
        res.setStages(stages);

        return Optional.of(res);
    }

    @Transactional
    public Optional<BookingStatusResponse> approveQuote(String bookingId) {
        Optional<Booking> bookingOpt = bookingRepository.findByBookingId(bookingId.trim().toUpperCase());
        if (bookingOpt.isEmpty()) {
            return Optional.empty();
        }

        Booking booking = bookingOpt.get();
        booking.setQuoteApproved(true);
        booking.setStatus(BookingStatus.REPAIR_IN_PROGRESS);
        bookingRepository.save(booking);

        return getBookingStatus(bookingId, null);
    }

    @Transactional
    public Optional<BookingStatusResponse> advanceStageForSimulation(String bookingId, String targetScenario) {
        Optional<Booking> bookingOpt = bookingRepository.findByBookingId(bookingId.trim().toUpperCase());
        if (bookingOpt.isEmpty()) {
            return Optional.empty();
        }

        Booking booking = bookingOpt.get();
        if ("on_the_way".equalsIgnoreCase(targetScenario)) {
            booking.setStatus(BookingStatus.TECHNICIAN_ON_THE_WAY);
        } else if ("approval".equalsIgnoreCase(targetScenario)) {
            booking.setStatus(BookingStatus.AWAITING_CUSTOMER_APPROVAL);
        } else if ("completed".equalsIgnoreCase(targetScenario)) {
            booking.setStatus(BookingStatus.COMPLETED_AND_CLOSED);
        }
        bookingRepository.save(booking);

        return getBookingStatus(bookingId, null);
    }
}
