package com.famousmobiles.service;

import com.famousmobiles.config.IstTime;
import com.famousmobiles.dto.OtpSendResult;
import com.famousmobiles.entity.Booking;
import com.famousmobiles.entity.OtpToken;
import com.famousmobiles.repository.BookingRepository;
import com.famousmobiles.repository.OtpTokenRepository;
import com.famousmobiles.service.sms.SmsDeliveryResult;
import com.famousmobiles.service.sms.SmsDispatcherService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class OtpService {

    private static final Logger log = LoggerFactory.getLogger(OtpService.class);
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    private final OtpTokenRepository otpTokenRepository;
    private final BookingRepository bookingRepository;
    private final SmsDispatcherService smsDispatcherService;

    @Value("${famousmobiles.sms.cooldown-seconds:30}")
    private int cooldownSeconds = 30;

    @Value("${famousmobiles.sms.max-requests-per-15min:5}")
    private int maxRequestsPer15Min = 5;

    @Value("${famousmobiles.sms.allow-demo-bypass:false}")
    private boolean allowDemoBypass = false;

    public OtpService(OtpTokenRepository otpTokenRepository,
                      BookingRepository bookingRepository,
                      SmsDispatcherService smsDispatcherService) {
        this.otpTokenRepository = otpTokenRepository;
        this.bookingRepository = bookingRepository;
        this.smsDispatcherService = smsDispatcherService;
    }

    @Transactional
    public OtpSendResult sendOtp(String mobileNumber) {
        String cleanMobile = mobileNumber != null ? mobileNumber.trim() : "";

        // 1. Check rate limit: Cooldown between consecutive OTP requests (default 30 seconds)
        Optional<OtpToken> lastTokenOpt = otpTokenRepository.findTopByMobileNumberOrderByCreatedAtDesc(cleanMobile);
        if (lastTokenOpt.isPresent()) {
            OtpToken lastToken = lastTokenOpt.get();
            long secondsSinceLast = Duration.between(lastToken.getCreatedAt(), IstTime.now()).getSeconds();
            if (secondsSinceLast < cooldownSeconds) {
                int retryAfter = (int) (cooldownSeconds - secondsSinceLast);
                log.warn("Rate limited OTP request for {}: cooldown active, retry in {}s", cleanMobile, retryAfter);
                return OtpSendResult.rateLimited(
                        retryAfter,
                        "Please wait " + retryAfter + " seconds before requesting another OTP."
                );
            }
        }

        // 2. Check rate limit: Max OTP requests in a 15-minute sliding window (default 5)
        LocalDateTime windowStart = IstTime.now().minusMinutes(15);
        long recentCount = otpTokenRepository.countByMobileNumberAndCreatedAtAfter(cleanMobile, windowStart);
        if (recentCount >= maxRequestsPer15Min) {
            log.warn("Rate limited OTP request for {}: exceeded {} requests in 15 mins", cleanMobile, maxRequestsPer15Min);
            return OtpSendResult.rateLimited(
                    60,
                    "Too many OTP requests. Please wait a few minutes before trying again."
            );
        }

        // 3. Generate cryptographically secure 4-digit numeric OTP (1000 - 9999)
        int code = 1000 + SECURE_RANDOM.nextInt(9000);
        String otpCode = String.valueOf(code);

        // 4. Persist OTP token with 10-minute expiry
        LocalDateTime expiresAt = IstTime.now().plusMinutes(10);
        OtpToken token = new OtpToken(cleanMobile, otpCode, expiresAt);
        otpTokenRepository.save(token);

        // 5. Dispatch OTP via multi-provider SMS gateway (Fast2SMS, Twilio, Console/Dev)
        SmsDeliveryResult deliveryResult = smsDispatcherService.sendOtp(cleanMobile, otpCode);
        log.info("OTP dispatched to {} via provider '{}': success={}",
                cleanMobile, deliveryResult.getProviderName(), deliveryResult.isSuccess());

        String message = "OTP sent via SMS to +91 " + maskMobile(cleanMobile);
        return OtpSendResult.success(otpCode, deliveryResult.getProviderName(), cooldownSeconds, message);
    }

    @Transactional
    public String generateAndSaveOtp(String mobileNumber) {
        OtpSendResult result = sendOtp(mobileNumber);
        return result.getOtpCode() != null ? result.getOtpCode() : "1234";
    }

    @Transactional
    public boolean verifyOtp(String mobileNumber, String inputOtp) {
        if (inputOtp == null || inputOtp.isBlank()) {
            return false;
        }

        String cleanOtp = inputOtp.trim();

        // 1. Universal developer demo bypass for local testing (disabled in production)
        if (allowDemoBypass && "1234".equals(cleanOtp)) {
            return true;
        }

        // 2. Customer's 4-digit doorstep handshake code for their active booking
        if (mobileNumber != null && !mobileNumber.isBlank()) {
            String cleanMobile = mobileNumber.trim();
            List<Booking> bookings = bookingRepository.findByMobileNumberOrderByCreatedAtDesc(cleanMobile);
            for (Booking b : bookings) {
                if (b.getHandshakeOtp() != null && b.getHandshakeOtp().equals(cleanOtp)) {
                    return true;
                }
            }
        }

        // 3. Database token verification (from Send OTP)
        Optional<OtpToken> tokenOpt = otpTokenRepository
                .findTopByMobileNumberAndVerifiedFalseAndExpiresAtAfterOrderByCreatedAtDesc(
                        mobileNumber, IstTime.now());

        if (tokenOpt.isEmpty()) {
            return false;
        }

        OtpToken token = tokenOpt.get();
        token.setAttempts(token.getAttempts() + 1);

        if (token.getOtpCode().equals(cleanOtp)) {
            token.setVerified(true);
            otpTokenRepository.save(token);
            return true;
        }

        otpTokenRepository.save(token);
        return false;
    }

    private String maskMobile(String mobile) {
        if (mobile == null || mobile.length() < 10) return mobile;
        return mobile.substring(0, 2) + "******" + mobile.substring(mobile.length() - 2);
    }
}
