package com.famousmobiles.service;

import com.famousmobiles.entity.Booking;
import com.famousmobiles.entity.OtpToken;
import com.famousmobiles.repository.BookingRepository;
import com.famousmobiles.repository.OtpTokenRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class OtpService {

    private final OtpTokenRepository otpTokenRepository;
    private final BookingRepository bookingRepository;

    public OtpService(OtpTokenRepository otpTokenRepository, BookingRepository bookingRepository) {
        this.otpTokenRepository = otpTokenRepository;
        this.bookingRepository = bookingRepository;
    }

    @Transactional
    public String generateAndSaveOtp(String mobileNumber) {
        String cleanMobile = mobileNumber.trim();
        List<Booking> bookings = bookingRepository.findByMobileNumberOrderByCreatedAtDesc(cleanMobile);

        // If customer has a booking, synchronize with their handshake OTP code
        String otpCode = "1234";
        if (!bookings.isEmpty() && bookings.get(0).getHandshakeOtp() != null) {
            otpCode = bookings.get(0).getHandshakeOtp();
        }

        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(10);
        OtpToken token = new OtpToken(cleanMobile, otpCode, expiresAt);
        otpTokenRepository.save(token);

        return otpCode;
    }

    @Transactional
    public boolean verifyOtp(String mobileNumber, String inputOtp) {
        if (inputOtp == null || inputOtp.isBlank()) {
            return false;
        }

        String cleanOtp = inputOtp.trim();

        // 1. Universal developer & customer demo bypass for testing
        if ("1234".equals(cleanOtp)) {
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
                        mobileNumber, LocalDateTime.now());

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
}
