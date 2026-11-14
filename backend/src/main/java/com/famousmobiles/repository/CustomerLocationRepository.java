package com.famousmobiles.repository;

import com.famousmobiles.entity.CustomerLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomerLocationRepository extends JpaRepository<CustomerLocation, Long> {
    List<CustomerLocation> findTop20ByOrderByCreatedAtDesc();
}
