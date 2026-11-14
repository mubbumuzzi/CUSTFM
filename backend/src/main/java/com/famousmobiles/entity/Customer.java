package com.famousmobiles.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "customers", indexes = {
        @Index(name = "idx_cust_mobile", columnList = "mobileNumber", unique = true)
})
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 15)
    private String mobileNumber;

    @Column(length = 100)
    private String name;

    private int totalBookings = 0;

    private boolean firstVisitFreeClaimed = false;

    private LocalDateTime createdAt = LocalDateTime.now();

    public Customer() {
    }

    public Customer(String mobileNumber) {
        this.mobileNumber = mobileNumber;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getMobileNumber() { return mobileNumber; }
    public void setMobileNumber(String mobileNumber) { this.mobileNumber = mobileNumber; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public int getTotalBookings() { return totalBookings; }
    public void setTotalBookings(int totalBookings) { this.totalBookings = totalBookings; }

    public boolean isFirstVisitFreeClaimed() { return firstVisitFreeClaimed; }
    public void setFirstVisitFreeClaimed(boolean firstVisitFreeClaimed) { this.firstVisitFreeClaimed = firstVisitFreeClaimed; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
