package com.famousmobiles.service.sms;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Base64;

@Service
public class TwilioSmsServiceImpl implements SmsService {

    private static final Logger log = LoggerFactory.getLogger(TwilioSmsServiceImpl.class);

    private final String accountSid;
    private final String authToken;
    private final String fromNumber;
    private final HttpClient httpClient;

    public TwilioSmsServiceImpl(
            @Value("${famousmobiles.sms.twilio.account-sid:}") String accountSid,
            @Value("${famousmobiles.sms.twilio.auth-token:}") String authToken,
            @Value("${famousmobiles.sms.twilio.from-number:}") String fromNumber) {
        this.accountSid = accountSid != null ? accountSid.trim() : "";
        this.authToken = authToken != null ? authToken.trim() : "";
        this.fromNumber = fromNumber != null ? fromNumber.trim() : "";
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(5))
                .build();
    }

    @Override
    public SmsDeliveryResult sendOtp(String mobileNumber, String otpCode) {
        if (!isConfigured()) {
            return SmsDeliveryResult.failure(getProviderName(), "Twilio credentials not configured.");
        }

        String fullMobile = formatE164IndianNumber(mobileNumber);
        String body = "Your Famous Mobiles repair tracking OTP is: " + otpCode + ". Valid for 10 minutes.";
        return executeTwilioSend(fullMobile, body);
    }

    @Override
    public SmsDeliveryResult sendBookingConfirmation(String mobileNumber, String bookingId, String handshakeOtp, String eta) {
        if (!isConfigured()) {
            return SmsDeliveryResult.failure(getProviderName(), "Twilio credentials not configured.");
        }

        String fullMobile = formatE164IndianNumber(mobileNumber);
        String body = "Famous Mobiles: Doorstep repair #" + bookingId + " confirmed! Technician ETA: " + eta
                + ". Handshake PIN: " + handshakeOtp;
        return executeTwilioSend(fullMobile, body);
    }

    private SmsDeliveryResult executeTwilioSend(String toMobile, String textMessage) {
        try {
            String url = "https://api.twilio.com/2010-04-01/Accounts/" + accountSid + "/Messages.json";
            String form = "To=" + URLEncoder.encode(toMobile, StandardCharsets.UTF_8)
                    + "&From=" + URLEncoder.encode(fromNumber, StandardCharsets.UTF_8)
                    + "&Body=" + URLEncoder.encode(textMessage, StandardCharsets.UTF_8);

            String authHeader = "Basic " + Base64.getEncoder().encodeToString((accountSid + ":" + authToken).getBytes(StandardCharsets.UTF_8));

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .timeout(Duration.ofSeconds(8))
                    .header("Authorization", authHeader)
                    .header("Content-Type", "application/x-www-form-urlencoded")
                    .POST(HttpRequest.BodyPublishers.ofString(form))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                log.info("Twilio SMS dispatched successfully: {}", response.body());
                return SmsDeliveryResult.success(getProviderName(), "TWILIO-" + System.currentTimeMillis());
            } else {
                log.warn("Twilio SMS failed (HTTP {}): {}", response.statusCode(), response.body());
                return SmsDeliveryResult.failure(getProviderName(), "Twilio error: " + response.body());
            }
        } catch (Exception e) {
            log.error("Exception sending SMS via Twilio: {}", e.getMessage());
            return SmsDeliveryResult.failure(getProviderName(), e.getMessage());
        }
    }

    @Override
    public String getProviderName() {
        return "TWILIO";
    }

    @Override
    public boolean isConfigured() {
        return !accountSid.isBlank() && !authToken.isBlank() && !fromNumber.isBlank();
    }

    private String formatE164IndianNumber(String mobile) {
        if (mobile == null) return "";
        String digits = mobile.replaceAll("\\D", "");
        if (digits.length() == 10) {
            return "+91" + digits;
        }
        if (digits.length() == 12 && digits.startsWith("91")) {
            return "+" + digits;
        }
        return "+" + digits;
    }
}
