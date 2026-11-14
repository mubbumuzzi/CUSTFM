package com.famousmobiles.controller;

import com.famousmobiles.dto.SendOtpRequest;
import com.famousmobiles.dto.VerifyOtpRequest;
import com.famousmobiles.service.OtpService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private OtpService otpService;

    @Test
    @DisplayName("POST /api/auth/send-otp - Valid mobile sends OTP (200 OK)")
    void testSendOtpValidMobileReturns200() throws Exception {
        SendOtpRequest request = new SendOtpRequest();
        request.setMobileNumber("9876543210");
        request.setBookingId("FM-2026-9812");

        when(otpService.generateAndSaveOtp("9876543210")).thenReturn("1234");

        mockMvc.perform(post("/api/auth/send-otp")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.demoOtp").value("1234"));
    }

    @Test
    @DisplayName("POST /api/auth/verify-otp - Valid OTP code verifies successfully (200 OK)")
    void testVerifyOtpValidCodeReturns200() throws Exception {
        VerifyOtpRequest request = new VerifyOtpRequest();
        request.setMobileNumber("9876543210");
        request.setBookingId("FM-2026-9812");
        request.setOtpCode("1234");

        when(otpService.verifyOtp("9876543210", "1234")).thenReturn(true);

        mockMvc.perform(post("/api/auth/verify-otp")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.authToken").exists());
    }

    @Test
    @DisplayName("POST /api/auth/verify-otp - Wrong OTP code rejected with 400 Bad Request")
    void testVerifyOtpWrongCodeReturns400() throws Exception {
        VerifyOtpRequest request = new VerifyOtpRequest();
        request.setMobileNumber("9876543210");
        request.setBookingId("FM-2026-9812");
        request.setOtpCode("9999");

        when(otpService.verifyOtp("9876543210", "9999")).thenReturn(false);

        mockMvc.perform(post("/api/auth/verify-otp")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }
}
