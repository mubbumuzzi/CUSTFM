package com.famousmobiles.repository;

import com.famousmobiles.entity.OtpToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface OtpTokenRepository extends JpaRepository<OtpToken, Long> {
    Optional<OtpToken> findTopByMobileNumberAndVerifiedFalseAndExpiresAtAfterOrderByCreatedAtDesc(
            String mobileNumber, LocalDateTime now);
}
