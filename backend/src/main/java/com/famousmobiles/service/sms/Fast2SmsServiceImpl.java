package com.famousmobiles.service.sms;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

@Service
public class Fast2SmsServiceImpl implements SmsService {

    private static final Logger log = LoggerFactory.getLogger(Fast2SmsServiceImpl.class);
    private static final String FAST2SMS_API_URL = "https://www.fast2sms.com/dev/bulkV2";

    private final String apiKey;
    private final HttpClient httpClient;

    public Fast2SmsServiceImpl(@Value("${famousmobiles.sms.fast2sms.api-key:}") String apiKey) {
        this.apiKey = apiKey != null ? apiKey.trim() : "";
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(5))
                .build();
    }

    @Override
    public SmsDeliveryResult sendOtp(String mobileNumber, String otpCode) {
        if (!isConfigured()) {
            return SmsDeliveryResult.failure(getProviderName(), "Fast2SMS API Key not configured.");
        }

        String cleanNumber = normalizeIndianNumber(mobileNumber);
        String jsonPayload = String.format("{\"route\":\"otp\",\"variables_values\":\"%s\",\"numbers\":\"%s\"}",
                escapeJson(otpCode), cleanNumber);

        return executeRequest(jsonPayload, "OTP");
    }

    @Override
    public SmsDeliveryResult sendBookingConfirmation(String mobileNumber, String bookingId, String handshakeOtp, String eta) {
        if (!isConfigured()) {
            return SmsDeliveryResult.failure(getProviderName(), "Fast2SMS API Key not configured.");
        }

        String cleanNumber = normalizeIndianNumber(mobileNumber);
        String message = String.format("Famous Mobiles: Doorstep repair #%s confirmed! ETA: %s. Handshake PIN: %s",
                bookingId, eta, handshakeOtp);

        String jsonPayload = String.format("{\"route\":\"q\",\"message\":\"%s\",\"language\":\"english\",\"numbers\":\"%s\"}",
                escapeJson(message), cleanNumber);

        return executeRequest(jsonPayload, "Booking Confirmation");
    }

    private SmsDeliveryResult executeRequest(String jsonBody, String context) {
        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(FAST2SMS_API_URL))
                    .timeout(Duration.ofSeconds(8))
                    .header("authorization", this.apiKey)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() >= 200 && response.statusCode() < 300 && response.body().contains("\"return\":true")) {
                log.info("Fast2SMS {} successfully dispatched: {}", context, response.body());
                return SmsDeliveryResult.success(getProviderName(), "FAST2SMS-" + System.currentTimeMillis());
            } else {
                log.warn("Fast2SMS dispatch failed (HTTP {}): {}", response.statusCode(), response.body());
                return SmsDeliveryResult.failure(getProviderName(), "Fast2SMS error: " + response.body());
            }
        } catch (Exception e) {
            log.error("Exception sending SMS via Fast2SMS: {}", e.getMessage());
            return SmsDeliveryResult.failure(getProviderName(), e.getMessage());
        }
    }

    @Override
    public String getProviderName() {
        return "FAST2SMS";
    }

    @Override
    public boolean isConfigured() {
        return !apiKey.isBlank();
    }

    private String normalizeIndianNumber(String mobile) {
        if (mobile == null) return "";
        String digits = mobile.replaceAll("\\D", "");
        if (digits.length() == 12 && digits.startsWith("91")) {
            return digits.substring(2);
        }
        if (digits.length() == 11 && digits.startsWith("0")) {
            return digits.substring(1);
        }
        return digits;
    }

    private String escapeJson(String s) {
        if (s == null) return "";
        return s.replace("\"", "\\\"").replace("\n", "\\n").replace("\r", "");
    }
}
