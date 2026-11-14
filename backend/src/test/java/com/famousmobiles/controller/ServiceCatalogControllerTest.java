package com.famousmobiles.controller;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ServiceCatalogController.class)
class ServiceCatalogControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("GET /api/public/services - Returns all 6 PRD defined service categories")
    void testGetAllServicesReturns6Categories() throws Exception {
        mockMvc.perform(get("/api/public/services"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(6)))
                .andExpect(jsonPath("$[0].slug").value("display-replacement"))
                .andExpect(jsonPath("$[1].slug").value("battery-replacement"))
                .andExpect(jsonPath("$[2].slug").value("charging-port-repair"))
                .andExpect(jsonPath("$[3].slug").value("software-repair"))
                .andExpect(jsonPath("$[4].slug").value("hardware-repair"))
                .andExpect(jsonPath("$[5].slug").value("water-damage-diagnosis"));
    }

    @Test
    @DisplayName("GET /api/public/services/{slug} - Display replacement returns 200 with 30 min turnaround")
    void testGetDisplayReplacementBySlugReturns200() throws Exception {
        mockMvc.perform(get("/api/public/services/display-replacement"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Display Replacement"))
                .andExpect(jsonPath("$.turnaroundTime").value("30 mins"))
                .andExpect(jsonPath("$.doorstepFeasible").value(true));
    }

    @Test
    @DisplayName("PRD Section 6.2 Rule: Water damage must be diagnosis-first and NOT guaranteed for doorstep")
    void testWaterDamageServiceMarkedAsDiagnosisFirstNotDoorstep() throws Exception {
        mockMvc.perform(get("/api/public/services/water-damage-diagnosis"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.doorstepFeasible").value(false))
                .andExpect(jsonPath("$.turnaroundTime").value(org.hamcrest.Matchers.containsString("Lab Pickup")));
    }

    @Test
    @DisplayName("GET /api/public/services/{slug} - Invalid slug returns 404 Not Found")
    void testGetInvalidSlugReturns404NotFound() throws Exception {
        mockMvc.perform(get("/api/public/services/non-existent-service"))
                .andExpect(status().isNotFound());
    }
}
