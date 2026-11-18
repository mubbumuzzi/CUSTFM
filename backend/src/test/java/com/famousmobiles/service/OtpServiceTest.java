package com.famousmobiles.service;

import com.famousmobiles.dto.OtpSendResult;
import com.famousmobiles.entity.OtpToken;
import com.famousmobiles.repository.BookingRepository;
import com.famousmobiles.repository.OtpTokenRepository;
import com.famousmobiles.service.sms.SmsDeliveryResult;
import com.famousmobiles.service.sms.SmsDispatcherService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OtpServiceTest {

    @Mock
    private OtpTokenRepository otpTokenRepository;

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private SmsDispatcherService smsDispatcherService;

    @InjectMocks
    private OtpService otpService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(otpService, "cooldownSeconds", 30);
        ReflectionTestUtils.setField(otpService, "maxRequestsPer15Min", 5);
    }

    @Test
    @DisplayName("sendOtp - Dispatches SMS and saves OTP token when within limits")
    void testSendOtpSuccess() {
        String mobile = "9876543210";
        when(otpTokenRepository.findTopByMobileNumberOrderByCreatedAtDesc(mobile)).thenReturn(Optional.empty());
        when(otpTokenRepository.countByMobileNumberAndCreatedAtAfter(eq(mobile), any(LocalDateTime.class))).thenReturn(0L);
        when(smsDispatcherService.sendOtp(eq(mobile), anyString()))
                .thenReturn(SmsDeliveryResult.success("Console/Dev Simulator", "SIM-123", "Sent"));

        OtpSendResult result = otpService.sendOtp(mobile);

        assertThat(result.isSuccess()).isTrue();
        assertThat(result.isRateLimited()).isFalse();
        assertThat(result.getOtpCode()).isNotNull().hasSize(4);
        assertThat(result.getProvider()).isEqualTo("Console/Dev Simulator");
        verify(otpTokenRepository, times(1)).save(any(OtpToken.class));
        verify(smsDispatcherService, times(1)).sendOtp(eq(mobile), eq(result.getOtpCode()));
    }

    @Test
    @DisplayName("sendOtp - Returns rate limited if requested within 30-second cooldown")
    void testSendOtpCooldownRateLimit() {
        String mobile = "9876543210";
        OtpToken recentToken = new OtpToken(mobile, "5555", LocalDateTime.now().plusMinutes(10));
        recentToken.setCreatedAt(LocalDateTime.now().minusSeconds(10)); // 10s ago < 30s cooldown

        when(otpTokenRepository.findTopByMobileNumberOrderByCreatedAtDesc(mobile)).thenReturn(Optional.of(recentToken));

        OtpSendResult result = otpService.sendOtp(mobile);

        assertThat(result.isSuccess()).isFalse();
        assertThat(result.isRateLimited()).isTrue();
        assertThat(result.getRetryAfterSeconds()).isGreaterThan(0).isLessThanOrEqualTo(30);
        verify(smsDispatcherService, never()).sendOtp(anyString(), anyString());
    }

    @Test
    @DisplayName("sendOtp - Returns rate limited if max 5 requests exceeded in 15 mins")
    void testSendOtpExceeded15MinLimit() {
        String mobile = "9876543210";
        // Cooldown passed (40s ago)
        OtpToken lastToken = new OtpToken(mobile, "5555", LocalDateTime.now().plusMinutes(10));
        lastToken.setCreatedAt(LocalDateTime.now().minusSeconds(40));

        when(otpTokenRepository.findTopByMobileNumberOrderByCreatedAtDesc(mobile)).thenReturn(Optional.of(lastToken));
        when(otpTokenRepository.countByMobileNumberAndCreatedAtAfter(eq(mobile), any(LocalDateTime.class))).thenReturn(5L);

        OtpSendResult result = otpService.sendOtp(mobile);

        assertThat(result.isSuccess()).isFalse();
        assertThat(result.isRateLimited()).isTrue();
        verify(smsDispatcherService, never()).sendOtp(anyString(), anyString());
    }

    @Test
    @DisplayName("verifyOtp - Allows demo code 1234 only when allowDemoBypass is enabled")
    void testVerifyOtpUniversalDemoCode() {
        ReflectionTestUtils.setField(otpService, "allowDemoBypass", true);
        assertThat(otpService.verifyOtp("9876543210", "1234")).isTrue();

        // When disabled (production), 1234 without db record must be rejected
        ReflectionTestUtils.setField(otpService, "allowDemoBypass", false);
        assertThat(otpService.verifyOtp("9876543210", "1234")).isFalse();
    }

    @Test
    @DisplayName("verifyOtp - Successfully verifies valid database OTP code")
    void testVerifyOtpDatabaseMatch() {
        String mobile = "9876543210";
        OtpToken token = new OtpToken(mobile, "8899", LocalDateTime.now().plusMinutes(10));

        when(otpTokenRepository.findTopByMobileNumberAndVerifiedFalseAndExpiresAtAfterOrderByCreatedAtDesc(
                eq(mobile), any(LocalDateTime.class))).thenReturn(Optional.of(token));

        boolean verified = otpService.verifyOtp(mobile, "8899");

        assertThat(verified).isTrue();
        assertThat(token.isVerified()).isTrue();
        verify(otpTokenRepository, times(1)).save(token);
    }
}
