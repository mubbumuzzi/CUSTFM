package com.famousmobiles.service.sms;

public class SmsDeliveryResult {
    private final boolean success;
    private final String provider;
    private final String messageId;
    private final String errorMessage;
    private final long timestamp;

    public SmsDeliveryResult(boolean success, String provider, String messageId, String errorMessage) {
        this.success = success;
        this.provider = provider;
        this.messageId = messageId;
        this.errorMessage = errorMessage;
        this.timestamp = System.currentTimeMillis();
    }

    public static SmsDeliveryResult success(String provider, String messageId) {
        return new SmsDeliveryResult(true, provider, messageId, null);
    }

    public static SmsDeliveryResult success(String provider, String messageId, String details) {
        return new SmsDeliveryResult(true, provider, messageId, details);
    }

    public static SmsDeliveryResult failure(String provider, String errorMessage) {
        return new SmsDeliveryResult(false, provider, null, errorMessage);
    }

    public boolean isSuccess() {
        return success;
    }

    public String getProvider() {
        return provider;
    }

    public String getProviderName() {
        return provider;
    }

    public String getMessageId() {
        return messageId;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public long getTimestamp() {
        return timestamp;
    }
}
