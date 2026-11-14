package com.famousmobiles.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class LocationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("POST /api/public/location stores GPS location into DB successfully")
    void testSaveCustomerLocation() throws Exception {
        Map<String, Object> req = Map.of(
                "locality", "Ward 94 Shaikpet, Hyderabad",
                "latitude", 17.404,
                "longitude", 78.375,
                "distanceKm", 0.4,
                "eligible", true,
                "eta", "25-30 mins"
        );

        mockMvc.perform(post("/api/public/location")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.locality").value("Ward 94 Shaikpet, Hyderabad"))
                .andExpect(jsonPath("$.distanceKm").value(0.4))
                .andExpect(jsonPath("$.eligible").value(true));
    }

    @Test
    @DisplayName("GET /api/public/location/latest returns saved locations")
    void testGetLatestLocations() throws Exception {
        mockMvc.perform(get("/api/public/location/latest"))
                .andExpect(status().isOk());
    }
}
