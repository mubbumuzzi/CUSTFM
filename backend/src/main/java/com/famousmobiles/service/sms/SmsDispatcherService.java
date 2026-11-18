package com.famousmobiles.service.sms;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class SmsDispatcherService {

    private static final Logger log = LoggerFactory.getLogger(SmsDispatcherService.class);

    private final Fast2SmsServiceImpl fast2SmsService;
    private final TwilioSmsServiceImpl twilioSmsService;
    private final ConsoleDevSmsServiceImpl consoleDevSmsService;
    private final String providerPreference;

    public SmsDispatcherService(
            Fast2SmsServiceImpl fast2SmsService,
            TwilioSmsServiceImpl twilioSmsService,
            ConsoleDevSmsServiceImpl consoleDevSmsService,
            @Value("${famousmobiles.sms.provider:auto}") String providerPreference) {
        this.fast2SmsService = fast2SmsService;
        this.twilioSmsService = twilioSmsService;
        this.consoleDevSmsService = consoleDevSmsService;
        this.providerPreference = providerPreference != null ? providerPreference.trim().toLowerCase() : "auto";
    }

    public SmsDeliveryResult sendOtp(String mobileNumber, String otpCode) {
        SmsService primary = determinePrimaryProvider();
        log.info("Dispatching OTP to {} using primary SMS provider: {}", mobileNumber, primary.getProviderName());

        SmsDeliveryResult result = primary.sendOtp(mobileNumber, otpCode);

        // Fallback to Console/Dev if primary network gateway fails
        if (!result.isSuccess() && primary != consoleDevSmsService) {
            log.warn("Primary SMS gateway {} failed: {}. Falling back to Console / Dev logger.",
                    primary.getProviderName(), result.getErrorMessage());
            return consoleDevSmsService.sendOtp(mobileNumber, otpCode);
        }

        return result;
    }

    public SmsDeliveryResult sendBookingConfirmation(String mobileNumber, String bookingId, String handshakeOtp, String eta) {
        SmsService primary = determinePrimaryProvider();
        log.info("Dispatching booking confirmation for #{} to {} via provider: {}", bookingId, mobileNumber, primary.getProviderName());

        SmsDeliveryResult result = primary.sendBookingConfirmation(mobileNumber, bookingId, handshakeOtp, eta);

        if (!result.isSuccess() && primary != consoleDevSmsService) {
            log.warn("Primary SMS gateway {} failed for booking #{}. Falling back to Console / Dev logger.",
                    primary.getProviderName(), bookingId);
            return consoleDevSmsService.sendBookingConfirmation(mobileNumber, bookingId, handshakeOtp, eta);
        }

        return result;
    }

    public SmsService determinePrimaryProvider() {
        if ("fast2sms".equals(providerPreference) && fast2SmsService.isConfigured()) {
            return fast2SmsService;
        }
        if ("twilio".equals(providerPreference) && twilioSmsService.isConfigured()) {
            return twilioSmsService;
        }

        // Auto selection
        if (fast2SmsService.isConfigured()) {
            return fast2SmsService;
        }
        if (twilioSmsService.isConfigured()) {
            return twilioSmsService;
        }

        return consoleDevSmsService;
    }

    public String getActiveProviderName() {
        return determinePrimaryProvider().getProviderName();
    }
}
