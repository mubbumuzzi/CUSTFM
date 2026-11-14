package com.famousmobiles.controller;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(EligibilityController.class)
class EligibilityControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("GET /api/public/eligibility - Lanco Hills within 5 km is eligible for doorstep (200 OK)")
    void testLancoHillsEligibleForDoorstep() throws Exception {
        mockMvc.perform(get("/api/public/eligibility?locality=Lanco%20Hills"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.doorstepEligible").value(true))
                .andExpect(jsonPath("$.distanceKm").value(1.4))
                .andExpect(jsonPath("$.maxRadiusKm").value(5.0));
    }

    @Test
    @DisplayName("GET /api/public/eligibility - Puppalaguda within 5 km is eligible for doorstep (200 OK)")
    void testPuppalagudaEligibleForDoorstep() throws Exception {
        mockMvc.perform(get("/api/public/eligibility?locality=Puppalaguda"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.doorstepEligible").value(true))
                .andExpect(jsonPath("$.distanceKm").value(2.6));
    }

    @Test
    @DisplayName("GET /api/public/eligibility - Financial District (6.8 km) exceeds 5 km radius, shop pickup only")
    void testFinancialDistrictExceedsRadius() throws Exception {
        mockMvc.perform(get("/api/public/eligibility?locality=Financial%20District"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.doorstepEligible").value(false))
                .andExpect(jsonPath("$.distanceKm").value(6.8))
                .andExpect(jsonPath("$.serviceMessage").value(org.hamcrest.Matchers.containsString("exceeds 5 km")));
    }
}
