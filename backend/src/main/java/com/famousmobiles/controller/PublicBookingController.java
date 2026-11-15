package com.famousmobiles.controller;

import com.famousmobiles.dto.BookingEnquiryRequest;
import com.famousmobiles.dto.BookingResponse;
import com.famousmobiles.dto.BookingStatusResponse;
import com.famousmobiles.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/public/bookings")
public class PublicBookingController {

    private final BookingService bookingService;

    public PublicBookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    /**
     * List all customer bookings for the shop-side POS dashboard
     */
    @GetMapping
    public ResponseEntity<?> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookingsForPos());
    }

    /**
     * Submit an enquiry. Only 10-digit mobile number is mandatory.
     */
    @PostMapping
    public ResponseEntity<BookingResponse> submitEnquiry(@Valid @RequestBody BookingEnquiryRequest request) {
        BookingResponse response = bookingService.createEnquiry(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * POS staff stage advancement, technician assignment, and quote updates
     */
    @PostMapping("/{bookingId}/pos-update")
    public ResponseEntity<?> updateBookingFromPos(
            @PathVariable String bookingId,
            @RequestBody Map<String, Object> updates) {
        return bookingService.updateBookingFromPos(bookingId, updates)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(null));
    }

    /**
     * Secure status lookup. Requires booking ID and optionally verified mobile.
     */
    @GetMapping("/{bookingId}/status")
    public ResponseEntity<?> getBookingStatus(
            @PathVariable String bookingId,
            @RequestParam(required = false) String mobile,
            @RequestParam(required = false) String otp) {
        if (otp != null && !otp.isBlank()) {
            return bookingService.getBookingStatus(bookingId, mobile, otp)
                    .map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(null));
        }
        return bookingService.getBookingStatus(bookingId, mobile)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(null));
    }

    /**
     * Technician Doorstep Handshake Verification (Zomato/Swiggy model - ₹0 SMS cost)
     * Validates 4-digit completion code provided by customer upon job finish
     */
    @PostMapping("/{bookingId}/verify-handshake")
    public ResponseEntity<?> verifyHandshake(
            @PathVariable String bookingId,
            @RequestBody Map<String, String> body) {
        String otp = body != null ? body.get("otp") : null;
        Optional<BookingStatusResponse> result = bookingService.verifyHandshakeAndComplete(bookingId, otp);
        if (result.isPresent()) {
            return ResponseEntity.ok(result.get());
        }
        return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Invalid 4-digit completion OTP. Please ask customer to check their live tracking screen."
        ));
    }

    /**
     * Customer Quote Approval
     */
    @PostMapping("/{bookingId}/approve-quote")
    public ResponseEntity<?> approveQuote(@PathVariable String bookingId) {
        return bookingService.approveQuote(bookingId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(null));
    }

    /**
     * Lifecycle simulation endpoint for demonstrating stages in test environment
     */
    @PostMapping("/{bookingId}/simulate")
    public ResponseEntity<?> simulateStage(
            @PathVariable String bookingId,
            @RequestBody Map<String, String> body) {
        String scenario = body.getOrDefault("scenario", "on_the_way");
        return bookingService.advanceStageForSimulation(bookingId, scenario)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(null));
    }
}
