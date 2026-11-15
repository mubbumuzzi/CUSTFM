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
    @DisplayName("GET /api/public/eligibility - Lanco Hills within 6 km is eligible for doorstep (200 OK)")
    void testLancoHillsEligibleForDoorstep() throws Exception {
        mockMvc.perform(get("/api/public/eligibility?locality=Lanco%20Hills"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.doorstepEligible").value(true))
                .andExpect(jsonPath("$.distanceKm").value(1.4))
                .andExpect(jsonPath("$.maxRadiusKm").value(6.0));
    }

    @Test
    @DisplayName("GET /api/public/eligibility - Puppalaguda within 6 km is eligible for doorstep (200 OK)")
    void testPuppalagudaEligibleForDoorstep() throws Exception {
        mockMvc.perform(get("/api/public/eligibility?locality=Puppalaguda"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.doorstepEligible").value(true))
                .andExpect(jsonPath("$.distanceKm").value(0.8));
    }

    @Test
    @DisplayName("GET /api/public/eligibility - Kondapur (7.2 km) exceeds 6 km radius, shop pickup only")
    void testKondapurExceedsRadius() throws Exception {
        mockMvc.perform(get("/api/public/eligibility?locality=Kondapur"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.doorstepEligible").value(false))
                .andExpect(jsonPath("$.distanceKm").value(7.2))
                .andExpect(jsonPath("$.serviceMessage").value(org.hamcrest.Matchers.containsString("exceeds 6 km")));
    }
}
