package com.famousmobiles.dto;

import java.util.List;

public class ServiceCategoryDto {
    private String slug;
    private String title;
    private String icon;
    private String shortDescription;
    private String turnaroundTime;
    private String startingPrice;
    private boolean doorstepFeasible;
    private String warrantyTerm;
    private List<String> commonSymptoms;

    public ServiceCategoryDto() {
    }

    public ServiceCategoryDto(String slug, String title, String icon, String shortDescription,
                              String turnaroundTime, String startingPrice, boolean doorstepFeasible,
                              String warrantyTerm, List<String> commonSymptoms) {
        this.slug = slug;
        this.title = title;
        this.icon = icon;
        this.shortDescription = shortDescription;
        this.turnaroundTime = turnaroundTime;
        this.startingPrice = startingPrice;
        this.doorstepFeasible = doorstepFeasible;
        this.warrantyTerm = warrantyTerm;
        this.commonSymptoms = commonSymptoms;
    }

    public String getSlug() { return slug; }
    public String getTitle() { return title; }
    public String getIcon() { return icon; }
    public String getShortDescription() { return shortDescription; }
    public String getTurnaroundTime() { return turnaroundTime; }
    public String getStartingPrice() { return startingPrice; }
    public boolean isDoorstepFeasible() { return doorstepFeasible; }
    public String getWarrantyTerm() { return warrantyTerm; }
    public List<String> getCommonSymptoms() { return commonSymptoms; }
}
