package com.famousmobiles.config;

import java.time.LocalDateTime;
import java.time.ZoneId;

/**
 * Shared IST (Asia/Kolkata) clock helper so all persisted timestamps and OTP windows
 * run in Indian Standard Time regardless of host or container timezone.
 */
public final class IstTime {
    public static final ZoneId ZONE = ZoneId.of("Asia/Kolkata");

    private IstTime() {
    }

    public static LocalDateTime now() {
        return LocalDateTime.now(ZONE);
    }
}
