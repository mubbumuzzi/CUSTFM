package com.famousmobiles.controller;

import com.famousmobiles.dto.BookingEnquiryRequest;
import com.famousmobiles.dto.BookingResponse;
import com.famousmobiles.dto.BookingStatusResponse;
import com.famousmobiles.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/public/bookings")
@CrossOrigin(originPatterns = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS}, allowCredentials = "true")
public class PublicBookingController {

    private final BookingService bookingService;

    @Value("${famousmobiles.pos.api-key:famous-pos-sec-2026}")
    private String posApiKey;

    public PublicBookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    private boolean isPosAuthorized(String headerKey, String queryKey) {
        if (posApiKey == null || posApiKey.isBlank()) {
            return true;
        }
        return posApiKey.equals(headerKey) || posApiKey.equals(queryKey);
    }

    /**
     * List all customer bookings for the shop-side POS dashboard (Secured by API Key)
     */
    @GetMapping
    public ResponseEntity<?> getAllBookings(
            @RequestHeader(value = "X-POS-API-KEY", required = false) String apiKeyHeader,
            @RequestParam(value = "apiKey", required = false) String apiKeyParam) {
        if (!isPosAuthorized(apiKeyHeader, apiKeyParam)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                    "error", "Unauthorized",
                    "message", "POS API Key required. Provide 'X-POS-API-KEY' header or 'apiKey' parameter."
            ));
        }
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
     * POS staff stage advancement, technician assignment, and quote updates (Secured by API Key)
     */
    @PostMapping("/{bookingId}/pos-update")
    public ResponseEntity<?> updateBookingFromPos(
            @PathVariable String bookingId,
            @RequestHeader(value = "X-POS-API-KEY", required = false) String apiKeyHeader,
            @RequestParam(value = "apiKey", required = false) String apiKeyParam,
            @RequestBody Map<String, Object> updates) {
        if (!isPosAuthorized(apiKeyHeader, apiKeyParam)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                    "error", "Unauthorized",
                    "message", "POS API Key required."
            ));
        }
        return bookingService.updateBookingFromPos(bookingId, updates)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(null));
    }

    /**
     * Customer Booking History / Active Orders lookup by mobile number.
     */
    @GetMapping("/my-bookings")
    public ResponseEntity<?> getMyBookings(@RequestParam String mobile) {
        if (mobile == null || mobile.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Bad Request",
                    "message", "Mobile number is required."
            ));
        }
        return ResponseEntity.ok(bookingService.getBookingsForCustomer(mobile));
    }

    /**
     * Secure status lookup. Requires booking ID and matching mobile or OTP (IDOR Protected).
     */
    @GetMapping("/{bookingId}/status")
    public ResponseEntity<?> getBookingStatus(
            @PathVariable String bookingId,
            @RequestParam(required = false) String mobile,
            @RequestParam(required = false) String otp) {
        Optional<BookingStatusResponse> status = bookingService.getBookingStatus(bookingId, mobile, otp);
        if (status.isPresent()) {
            return ResponseEntity.ok(status.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                "error", "Not Found",
                "message", "No booking found matching this Booking ID."
        ));
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
     * Lifecycle simulation endpoint for demonstrating stages in test environment (Secured by API Key)
     */
    @PostMapping("/{bookingId}/simulate")
    public ResponseEntity<?> simulateStage(
            @PathVariable String bookingId,
            @RequestHeader(value = "X-POS-API-KEY", required = false) String apiKeyHeader,
            @RequestParam(value = "apiKey", required = false) String apiKeyParam,
            @RequestBody Map<String, String> body) {
        if (!isPosAuthorized(apiKeyHeader, apiKeyParam)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                    "error", "Unauthorized",
                    "message", "POS API Key required."
            ));
        }
        String scenario = body != null ? body.getOrDefault("scenario", "on_the_way") : "on_the_way";
        return bookingService.advanceStageForSimulation(bookingId, scenario)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(null));
    }

    /**
     * Delete an enquiry/booking from POS dashboard (Secured by API Key)
     */
    @DeleteMapping("/{bookingId}")
    public ResponseEntity<?> deleteBooking(
            @PathVariable String bookingId,
            @RequestHeader(value = "X-POS-API-KEY", required = false) String apiKeyHeader,
            @RequestParam(value = "apiKey", required = false) String apiKeyParam) {
        if (!isPosAuthorized(apiKeyHeader, apiKeyParam)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                    "error", "Unauthorized",
                    "message", "POS API Key required."
            ));
        }
        boolean deleted = bookingService.deleteBooking(bookingId);
        if (deleted) {
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Booking " + bookingId + " deleted successfully."
            ));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                "error", "Not Found",
                "message", "Booking not found."
        ));
    }

    @PostMapping("/{bookingId}/delete")
    public ResponseEntity<?> deleteBookingPost(
            @PathVariable String bookingId,
            @RequestHeader(value = "X-POS-API-KEY", required = false) String apiKeyHeader,
            @RequestParam(value = "apiKey", required = false) String apiKeyParam) {
        return deleteBooking(bookingId, apiKeyHeader, apiKeyParam);
    }
}
