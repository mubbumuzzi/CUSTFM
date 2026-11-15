package com.famousmobiles.controller;

import com.famousmobiles.dto.BookingEnquiryRequest;
import com.famousmobiles.dto.BookingResponse;
import com.famousmobiles.dto.BookingStatusResponse;
import com.famousmobiles.service.BookingService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(PublicBookingController.class)
class PublicBookingControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private BookingService bookingService;

    @Test
    @DisplayName("POST /api/public/bookings - Valid mobile number creates enquiry (201 Created)")
    void testSubmitEnquiryValidMobileReturns201Created() throws Exception {
        BookingEnquiryRequest request = new BookingEnquiryRequest();
        request.setMobileNumber("9876543210");
        request.setCustomerName("Mohammed");
        request.setRepairCategory("Display Replacement");

        BookingResponse mockResponse = new BookingResponse();
        mockResponse.setBookingId("FM-2026-9812");
        mockResponse.setStatus("NEW_ENQUIRY");
        mockResponse.setDisplayStatus("New Enquiry Logged");
        mockResponse.setMobileNumber("9876543210");
        mockResponse.setVisitCharge(BigDecimal.ZERO);
        mockResponse.setFirstVisitFree(true);
        mockResponse.setTimestamp(LocalDateTime.now());

        when(bookingService.createEnquiry(any(BookingEnquiryRequest.class))).thenReturn(mockResponse);

        mockMvc.perform(post("/api/public/bookings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.bookingId").value("FM-2026-9812"))
                .andExpect(jsonPath("$.firstVisitFree").value(true))
                .andExpect(jsonPath("$.status").value("NEW_ENQUIRY"));
    }

    @Test
    @DisplayName("POST /api/public/bookings - Invalid mobile number (short, non-digit or wrong prefix) fails with 400 Bad Request")
    void testSubmitEnquiryInvalidMobileReturns400BadRequest() throws Exception {
        BookingEnquiryRequest request = new BookingEnquiryRequest();
        request.setMobileNumber("12345"); // Invalid: not 10 digits, does not start with 6-9

        mockMvc.perform(post("/api/public/bookings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("POST /api/public/bookings - Empty mobile number fails with 400 Bad Request")
    void testSubmitEnquiryBlankMobileReturns400BadRequest() throws Exception {
        BookingEnquiryRequest request = new BookingEnquiryRequest();
        request.setMobileNumber("");

        mockMvc.perform(post("/api/public/bookings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("GET /api/public/bookings/{id}/status - Existing ID returns 200 OK")
    void testGetBookingStatusSuccessReturns200Ok() throws Exception {
        BookingStatusResponse statusRes = new BookingStatusResponse();
        statusRes.setBookingId("FM-2026-9812");
        statusRes.setStatusCode("TECHNICIAN_ON_THE_WAY");
        statusRes.setStatusLabel("Technician On The Way");
        statusRes.setCurrentStageIndex(5);
        statusRes.setTotalStages(11);
        statusRes.setStages(Collections.emptyList());

        when(bookingService.getBookingStatus(eq("FM-2026-9812"), any(), any())).thenReturn(Optional.of(statusRes));

        mockMvc.perform(get("/api/public/bookings/FM-2026-9812/status?mobile=9876543210"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.bookingId").value("FM-2026-9812"))
                .andExpect(jsonPath("$.currentStageIndex").value(5))
                .andExpect(jsonPath("$.statusCode").value("TECHNICIAN_ON_THE_WAY"));
    }

    @Test
    @DisplayName("GET /api/public/bookings/{id}/status - Non-existent ID returns 404 Not Found")
    void testGetBookingStatusNotFoundReturns404() throws Exception {
        when(bookingService.getBookingStatus(eq("FM-INVALID-ID"), any(), any())).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/public/bookings/FM-INVALID-ID/status"))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("POST /api/public/bookings/{id}/approve-quote - Approves quote and returns updated 200 OK")
    void testApproveQuoteReturns200Ok() throws Exception {
        BookingStatusResponse statusRes = new BookingStatusResponse();
        statusRes.setBookingId("FM-2026-9812");
        statusRes.setQuoteApproved(true);
        statusRes.setStatusCode("REPAIR_IN_PROGRESS");

        when(bookingService.approveQuote("FM-2026-9812")).thenReturn(Optional.of(statusRes));

        mockMvc.perform(post("/api/public/bookings/FM-2026-9812/approve-quote"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.quoteApproved").value(true))
                .andExpect(jsonPath("$.statusCode").value("REPAIR_IN_PROGRESS"));
    }

    @Test
    @DisplayName("DELETE /api/public/bookings/{id} - Fails 401 when POS API Key is missing")
    void testDeleteBookingWithoutApiKeyReturns401() throws Exception {
        mockMvc.perform(delete("/api/public/bookings/FM-2026-9812"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Unauthorized"));
    }

    @Test
    @DisplayName("DELETE /api/public/bookings/{id} - Succeeds 200 when POS API Key is valid and record exists")
    void testDeleteBookingWithValidApiKeyReturns200() throws Exception {
        when(bookingService.deleteBooking("FM-2026-9812")).thenReturn(true);

        mockMvc.perform(delete("/api/public/bookings/FM-2026-9812")
                        .header("X-POS-API-KEY", "famous-pos-sec-2026"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Booking FM-2026-9812 deleted successfully."));
    }

    @Test
    @DisplayName("DELETE /api/public/bookings/{id} - Returns 404 when booking does not exist")
    void testDeleteBookingNotFoundReturns404() throws Exception {
        when(bookingService.deleteBooking("FM-UNKNOWN")).thenReturn(false);

        mockMvc.perform(delete("/api/public/bookings/FM-UNKNOWN")
                        .header("X-POS-API-KEY", "famous-pos-sec-2026"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error").value("Not Found"));
    }

    @Test
    @DisplayName("POST /api/public/bookings/{id}/delete - POST fallback endpoint succeeds with query param apiKey")
    void testDeleteBookingPostFallbackWithQueryParam() throws Exception {
        when(bookingService.deleteBooking("FM-2026-9812")).thenReturn(true);

        mockMvc.perform(post("/api/public/bookings/FM-2026-9812/delete?apiKey=famous-pos-sec-2026"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }
}
