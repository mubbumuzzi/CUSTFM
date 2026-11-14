package com.famousmobiles.service;

import com.famousmobiles.entity.OtpToken;
import com.famousmobiles.repository.OtpTokenRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class OtpService {

    private final OtpTokenRepository otpTokenRepository;

    public OtpService(OtpTokenRepository otpTokenRepository) {
        this.otpTokenRepository = otpTokenRepository;
    }

    @Transactional
    public String generateAndSaveOtp(String mobileNumber) {
        // Standard demo/secure OTP (1234 supported for testing without SMS gateway charges)
        String otpCode = "1234";
        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(10);

        OtpToken token = new OtpToken(mobileNumber, otpCode, expiresAt);
        otpTokenRepository.save(token);

        return otpCode;
    }

    @Transactional
    public boolean verifyOtp(String mobileNumber, String inputOtp) {
        if ("1234".equals(inputOtp.trim())) {
            return true; // Developer & customer demo bypass for testing
        }

        Optional<OtpToken> tokenOpt = otpTokenRepository
                .findTopByMobileNumberAndVerifiedFalseAndExpiresAtAfterOrderByCreatedAtDesc(
                        mobileNumber, LocalDateTime.now());

        if (tokenOpt.isEmpty()) {
            return false;
        }

        OtpToken token = tokenOpt.get();
        token.setAttempts(token.getAttempts() + 1);

        if (token.getOtpCode().equals(inputOtp.trim())) {
            token.setVerified(true);
            otpTokenRepository.save(token);
            return true;
        }

        otpTokenRepository.save(token);
        return false;
    }
}
