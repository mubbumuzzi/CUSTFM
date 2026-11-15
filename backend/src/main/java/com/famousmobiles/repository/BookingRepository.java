package com.famousmobiles.repository;

import com.famousmobiles.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    Optional<Booking> findByBookingId(String bookingId);
    boolean existsByBookingId(String bookingId);
    Optional<Booking> findByBookingIdAndMobileNumber(String bookingId, String mobileNumber);
    List<Booking> findByMobileNumberOrderByCreatedAtDesc(String mobileNumber);
    List<Booking> findAllByOrderByCreatedAtDesc();
    long countByMobileNumber(String mobileNumber);
}
