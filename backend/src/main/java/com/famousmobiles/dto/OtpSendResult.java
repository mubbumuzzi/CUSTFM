package com.famousmobiles.dto;

public class OtpSendResult {

    private boolean success;
    private String message;
    private String otpCode;
    private String provider;
    private int cooldownSeconds;
    private boolean rateLimited;
    private int retryAfterSeconds;

    public OtpSendResult() {
    }

    public static OtpSendResult success(String otpCode, String provider, int cooldownSeconds, String message) {
        OtpSendResult res = new OtpSendResult();
        res.success = true;
        res.otpCode = otpCode;
        res.provider = provider;
        res.cooldownSeconds = cooldownSeconds;
        res.rateLimited = false;
        res.retryAfterSeconds = 0;
        res.message = message;
        return res;
    }

    public static OtpSendResult rateLimited(int retryAfterSeconds, String message) {
        OtpSendResult res = new OtpSendResult();
        res.success = false;
        res.otpCode = null;
        res.provider = null;
        res.rateLimited = true;
        res.retryAfterSeconds = retryAfterSeconds;
        res.cooldownSeconds = retryAfterSeconds;
        res.message = message;
        return res;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getOtpCode() {
        return otpCode;
    }

    public void setOtpCode(String otpCode) {
        this.otpCode = otpCode;
    }

    public String getProvider() {
        return provider;
    }

    public void setProvider(String provider) {
        this.provider = provider;
    }

    public int getCooldownSeconds() {
        return cooldownSeconds;
    }

    public void setCooldownSeconds(int cooldownSeconds) {
        this.cooldownSeconds = cooldownSeconds;
    }

    public boolean isRateLimited() {
        return rateLimited;
    }

    public void setRateLimited(boolean rateLimited) {
        this.rateLimited = rateLimited;
    }

    public int getRetryAfterSeconds() {
        return retryAfterSeconds;
    }

    public void setRetryAfterSeconds(int retryAfterSeconds) {
        this.retryAfterSeconds = retryAfterSeconds;
    }
}
