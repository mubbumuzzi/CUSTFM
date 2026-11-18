package com.famousmobiles.service.sms;

public interface SmsService {
    SmsDeliveryResult sendOtp(String mobileNumber, String otpCode);
    SmsDeliveryResult sendBookingConfirmation(String mobileNumber, String bookingId, String handshakeOtp, String eta);
    String getProviderName();
    boolean isConfigured();
}
