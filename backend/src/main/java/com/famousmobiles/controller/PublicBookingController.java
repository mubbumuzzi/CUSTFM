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

@RestController
@RequestMapping("/api/public/bookings")
public class PublicBookingController {

    private final BookingService bookingService;

    public PublicBookingController(BookingService bookingService) {
        this.bookingService = bookingService;
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
     * Secure status lookup. Requires booking ID and optionally verified mobile.
     */
    @GetMapping("/{bookingId}/status")
    public ResponseEntity<?> getBookingStatus(
            @PathVariable String bookingId,
            @RequestParam(required = false) String mobile) {
        return bookingService.getBookingStatus(bookingId, mobile)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(null));
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
