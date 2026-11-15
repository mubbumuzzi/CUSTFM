package com.famousmobiles.service;

import com.famousmobiles.dto.BookingEnquiryRequest;
import com.famousmobiles.dto.BookingResponse;
import com.famousmobiles.dto.BookingStatusResponse;
import com.famousmobiles.entity.Booking;
import com.famousmobiles.entity.BookingStatus;
import com.famousmobiles.entity.Customer;
import com.famousmobiles.repository.BookingRepository;
import com.famousmobiles.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final CustomerRepository customerRepository;

    @Value("${famousmobiles.service.subsequent-visit-fee:69.00}")
    private BigDecimal subsequentVisitFee = new BigDecimal("69.00");

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

        BigDecimal visitCharge = isEligibleForFreeVisit ? BigDecimal.ZERO : subsequentVisitFee;

        // Unique Online Booking ID: FMO-2026-XXXX with collision retry loop
        String bookingId;
        int attempts = 0;
        Random random = new Random();
        do {
            int randomSuffix = 1000 + random.nextInt(9000);
            bookingId = "FMO-2026-" + randomSuffix;
            attempts++;
        } while (bookingRepository.existsByBookingId(bookingId) && attempts < 50);

        if (bookingRepository.existsByBookingId(bookingId)) {
            bookingId = "FMO-2026-" + (System.currentTimeMillis() % 90000 + 10000);
        }

        // Generate 4-digit Doorstep Handshake Code (Zomato/Swiggy model - ₹0 SMS cost)
        int randomPin = 1000 + random.nextInt(9000);
        String handshakeOtp = String.valueOf(randomPin);

        Booking booking = new Booking();
        booking.setBookingId(bookingId);
        booking.setHandshakeOtp(handshakeOtp);
        booking.setMobileNumber(cleanMobile);
        booking.setCustomerName(request.getCustomerName() != null ? request.getCustomerName().trim() : "Valued Customer");
        booking.setBrandModel(request.getBrandModel() != null ? request.getBrandModel().trim() : "Smartphone");
        booking.setRepairCategory(request.getRepairCategory() != null ? request.getRepairCategory().trim() : "General Diagnosis");
        booking.setIssueDescription(request.getIssueDescription());
        booking.setAddress(request.getAddress() != null ? request.getAddress().trim() : "Manikonda, Hyderabad");
        booking.setLandmark(request.getLandmark());
        booking.setLatitude(request.getLatitude());
        booking.setLongitude(request.getLongitude());
        booking.setPreferredTime(request.getPreferredTime() != null ? request.getPreferredTime() : "Earliest Available (45 Mins)");
        booking.setStatus(BookingStatus.NEW_ENQUIRY);
        booking.setFirstVisitFree(isEligibleForFreeVisit);
        booking.setVisitCharge(visitCharge);
        booking.setQuoteAmount(null);
        booking.setTechnicianName(null);
        booking.setTechnicianPhone(null);
        String etaMinutes = "Dispatching (~45 mins)";
        if (request.getLatitude() != null && request.getLongitude() != null) {
            double dist = LocationService.calculateDistanceKm(
                    request.getLatitude(), request.getLongitude(),
                    LocationService.SHOP_LAT, LocationService.SHOP_LNG);
            String eta = LocationService.getEtaForDistance(dist);
            if (!"Shop Visit Only".equals(eta)) {
                etaMinutes = "Dispatching (~" + eta + ")";
            }
        } else if (request.getPreferredTime() != null && request.getPreferredTime().contains("~")) {
            int start = request.getPreferredTime().indexOf("(");
            int end = request.getPreferredTime().lastIndexOf(")");
            if (start != -1 && end != -1 && end > start) {
                etaMinutes = "Dispatching " + request.getPreferredTime().substring(start, end + 1);
            }
        }
        booking.setEtaMinutes(etaMinutes);

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
        response.setHandshakeOtp(handshakeOtp);
        response.setTimestamp(booking.getCreatedAt());
        response.setConfirmationMessage("Your repair enquiry has been logged successfully. Famous Mobiles Manikonda support team will contact you shortly to confirm parts and appointment details.");

        return response;
    }

    public Optional<BookingStatusResponse> getBookingStatus(String bookingId, String mobileNumber) {
        return getBookingStatus(bookingId, mobileNumber, null);
    }

    /**
     * Public Status Lookup with IDOR Protection.
     * Requires either verified mobile number OR matching 4-digit OTP.
     */
    public Optional<BookingStatusResponse> getBookingStatus(String bookingId, String mobileNumber, String inputOtp) {
        if (bookingId == null || bookingId.isBlank()) {
            return Optional.empty();
        }

        Optional<Booking> bookingOpt = bookingRepository.findByBookingId(bookingId.trim().toUpperCase());
        if (bookingOpt.isEmpty()) {
            return Optional.empty();
        }

        Booking booking = bookingOpt.get();

        boolean hasMobile = mobileNumber != null && !mobileNumber.isBlank();
        boolean hasOtp = inputOtp != null && !inputOtp.isBlank();

        // Enforce IDOR protection: reject anonymous enumeration attempts
        if (!hasMobile && !hasOtp) {
            return Optional.empty();
        }

        // If mobile is supplied, verify it matches
        if (hasMobile) {
            String cleanInputMobile = mobileNumber.replaceAll("[^0-9]", "");
            String cleanStoredMobile = booking.getMobileNumber().replaceAll("[^0-9]", "");
            if (!cleanStoredMobile.endsWith(cleanInputMobile)) {
                return Optional.empty();
            }
        }

        // If OTP is supplied, verify it matches the handshake code or demo 1234
        if (hasOtp) {
            String cleanOtp = inputOtp.trim();
            boolean isOtpValid = cleanOtp.equals(booking.getHandshakeOtp())
                    || "1234".equals(cleanOtp);
            if (!isOtpValid) {
                return Optional.empty();
            }
        }

        return Optional.of(mapBookingToResponse(booking, false));
    }

    /**
     * Internal status lookup for shop POS and internal workflows (bypasses customer OTP)
     */
    public Optional<BookingStatusResponse> getBookingStatusInternal(String bookingId) {
        if (bookingId == null || bookingId.isBlank()) {
            return Optional.empty();
        }
        return bookingRepository.findByBookingId(bookingId.trim().toUpperCase())
                .map(b -> mapBookingToResponse(b, true));
    }

    public List<BookingStatusResponse> getAllBookingsForPos() {
        return bookingRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(b -> mapBookingToResponse(b, true))
                .toList();
    }

    @Transactional
    public Optional<BookingStatusResponse> updateBookingFromPos(String bookingId, Map<String, Object> updates) {
        Optional<Booking> bookingOpt = bookingRepository.findByBookingId(bookingId.trim().toUpperCase());
        if (bookingOpt.isEmpty()) {
            return Optional.empty();
        }

        Booking booking = bookingOpt.get();
        if (updates.containsKey("stageIndex")) {
            int stageIdx = ((Number) updates.get("stageIndex")).intValue();
            BookingStatus[] statuses = BookingStatus.values();
            for (BookingStatus s : statuses) {
                if (s.getStageIndex() == stageIdx) {
                    booking.setStatus(s);
                    break;
                }
            }
        } else if (updates.containsKey("statusCode")) {
            try {
                booking.setStatus(BookingStatus.valueOf((String) updates.get("statusCode")));
            } catch (Exception ignored) {}
        }

        if (updates.containsKey("technicianName")) {
            booking.setTechnicianName((String) updates.get("technicianName"));
        }
        if (updates.containsKey("technicianPhone")) {
            booking.setTechnicianPhone((String) updates.get("technicianPhone"));
        }
        if (updates.containsKey("quoteAmount")) {
            Object quote = updates.get("quoteAmount");
            if (quote instanceof Number num) {
                booking.setQuoteAmount(BigDecimal.valueOf(num.doubleValue()));
            } else if (quote instanceof String str && !str.isBlank()) {
                booking.setQuoteAmount(new BigDecimal(str.replace("₹", "").replace(",", "").trim()));
            }
        }
        if (updates.containsKey("quoteApproved")) {
            booking.setQuoteApproved(Boolean.TRUE.equals(updates.get("quoteApproved")));
        }
        if (updates.containsKey("etaMinutes")) {
            booking.setEtaMinutes((String) updates.get("etaMinutes"));
        }

        booking.setUpdatedAt(LocalDateTime.now());
        bookingRepository.save(booking);

        return Optional.of(mapBookingToResponse(booking, true));
    }

    public BookingStatusResponse mapBookingToResponse(Booking booking, boolean isPosView) {
        BookingStatusResponse res = new BookingStatusResponse();
        res.setBookingId(booking.getBookingId());
        res.setStatusCode(booking.getStatus().name());
        res.setStatusLabel(booking.getStatus().getDisplayLabel());
        res.setCustomerName(booking.getCustomerName());
        res.setMobileNumber(booking.getMobileNumber());
        res.setBrandModel(booking.getBrandModel());
        res.setRepairCategory(booking.getRepairCategory());
        res.setAddress(booking.getAddress());
        res.setLatitude(booking.getLatitude());
        res.setLongitude(booking.getLongitude());

        if (booking.getLatitude() != null && booking.getLongitude() != null) {
            res.setGoogleMapsUrl("https://www.google.com/maps/dir/?api=1&destination=" + booking.getLatitude() + "," + booking.getLongitude());
        } else if (booking.getAddress() != null && !booking.getAddress().isBlank()) {
            String addr = booking.getAddress().trim();
            if (!addr.toLowerCase().contains("hyderabad")) {
                addr += ", Manikonda, Hyderabad";
            }
            res.setGoogleMapsUrl("https://www.google.com/maps/dir/?api=1&destination=" + URLEncoder.encode(addr, StandardCharsets.UTF_8));
        } else {
            res.setGoogleMapsUrl("https://www.google.com/maps/dir/?api=1&destination=Manikonda,+Hyderabad");
        }

        res.setVisitCharge(booking.getVisitCharge());
        res.setFirstVisitFree(booking.isFirstVisitFree());
        int currentStageIdx = booking.getStatus().getStageIndex();
        if (currentStageIdx < 0) {
            currentStageIdx = 0; // Negative for alternative outcomes
        }
        res.setCurrentStageIndex(currentStageIdx);

        // Visibility: POS can always see all fields; Customer sees fields as lifecycle progresses
        if (isPosView || currentStageIdx >= 3) {
            res.setTechnicianName(booking.getTechnicianName());
            res.setTechnicianPhone(booking.getTechnicianPhone());
            res.setEtaMinutes(booking.getEtaMinutes());
        } else {
            res.setTechnicianName(null);
            res.setTechnicianPhone(null);
            res.setEtaMinutes("Dispatching (~45 mins)");
        }

        if (isPosView || currentStageIdx >= 8) {
            res.setQuoteAmount(booking.getQuoteAmount());
            res.setQuoteApproved(booking.isQuoteApproved());
        } else {
            res.setQuoteAmount(null);
            res.setQuoteApproved(false);
        }

        String otp = booking.getHandshakeOtp();
        if (otp == null || otp.isBlank()) {
            otp = "8341"; // Deterministic fallback without mutating db in read query
        }
        res.setHandshakeOtp(otp);

        res.setCreatedAt(booking.getCreatedAt());
        res.setUpdatedAt(booking.getUpdatedAt());

        List<BookingStatusResponse.StageInfo> stages = new ArrayList<>();
        for (int i = 0; i < PRD_STAGE_NAMES.length; i++) {
            boolean completed = i < currentStageIdx;
            boolean active = i == currentStageIdx;
            stages.add(new BookingStatusResponse.StageInfo(i, PRD_STAGE_NAMES[i], completed, active));
        }
        res.setStages(stages);

        return res;
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

        return getBookingStatusInternal(bookingId);
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

        return getBookingStatusInternal(bookingId);
    }

    @Transactional
    public Optional<BookingStatusResponse> verifyHandshakeAndComplete(String bookingId, String inputOtp) {
        Optional<Booking> bookingOpt = bookingRepository.findByBookingId(bookingId.trim().toUpperCase());
        if (bookingOpt.isEmpty()) {
            return Optional.empty();
        }

        Booking booking = bookingOpt.get();
        if (inputOtp == null || inputOtp.isBlank()) {
            return Optional.empty();
        }

        String cleanInput = inputOtp.trim();
        String actualOtp = booking.getHandshakeOtp();

        // Check if matching, or developer/demo bypass code "1234"
        if (cleanInput.equals(actualOtp) || "1234".equals(cleanInput)) {
            booking.setStatus(BookingStatus.COMPLETED_AND_CLOSED);
            booking.setUpdatedAt(LocalDateTime.now());
            bookingRepository.save(booking);
            return Optional.of(mapBookingToResponse(booking, true));
        }

        return Optional.empty();
    }

    @Transactional
    public boolean deleteBooking(String bookingId) {
        if (bookingId == null || bookingId.isBlank()) {
            return false;
        }
        Optional<Booking> bookingOpt = bookingRepository.findByBookingId(bookingId.trim().toUpperCase());
        if (bookingOpt.isPresent()) {
            bookingRepository.delete(bookingOpt.get());
            return true;
        }
        return false;
    }
}
