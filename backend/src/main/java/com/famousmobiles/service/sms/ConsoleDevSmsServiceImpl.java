package com.famousmobiles.service.sms;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class ConsoleDevSmsServiceImpl implements SmsService {

    private static final Logger log = LoggerFactory.getLogger(ConsoleDevSmsServiceImpl.class);

    @Override
    public SmsDeliveryResult sendOtp(String mobileNumber, String otpCode) {
        String cleanMobile = mobileNumber != null ? mobileNumber.trim() : "";
        String message = "Your Famous Mobiles repair tracking OTP is: " + otpCode 
                + ". Valid for 10 minutes. Do not share with anyone.";

        log.info("\n" +
                "================================================================================\n" +
                " [SMS OTP DISPATCH] (Dev Mode / Simulated Gateway)\n" +
                " To: +91 {}\n" +
                " Message: {}\n" +
                " Status: DELIVERED (Simulated)\n" +
                " Tip: Set FAST2SMS_API_KEY or TWILIO_ACCOUNT_SID to route via real cellular SMS.\n" +
                "================================================================================",
                cleanMobile, message);

        return SmsDeliveryResult.success(getProviderName(), "DEV-OTP-" + System.currentTimeMillis());
    }

    @Override
    public SmsDeliveryResult sendBookingConfirmation(String mobileNumber, String bookingId, String handshakeOtp, String eta) {
        String cleanMobile = mobileNumber != null ? mobileNumber.trim() : "";
        String message = "Famous Mobiles: Doorstep repair #" + bookingId + " confirmed! Technician ETA: " + eta 
                + ". Your 4-Digit Handshake PIN is: " + handshakeOtp + ". Test device before sharing PIN.";

        log.info("\n" +
                "================================================================================\n" +
                " [SMS BOOKING DISPATCH] (Dev Mode / Simulated Gateway)\n" +
                " To: +91 {}\n" +
                " Message: {}\n" +
                " Status: DELIVERED (Simulated)\n" +
                "================================================================================",
                cleanMobile, message);

        return SmsDeliveryResult.success(getProviderName(), "DEV-BOOK-" + System.currentTimeMillis());
    }

    @Override
    public String getProviderName() {
        return "CONSOLE_DEV";
    }

    @Override
    public boolean isConfigured() {
        return true;
    }
}
