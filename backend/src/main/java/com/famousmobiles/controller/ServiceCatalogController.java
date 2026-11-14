package com.famousmobiles.controller;

import com.famousmobiles.dto.ServiceCategoryDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/public/services")
public class ServiceCatalogController {

    private final List<ServiceCategoryDto> services = List.of(
            new ServiceCategoryDto(
                    "display-replacement",
                    "Display Replacement",
                    "📱",
                    "Original OEM & high-grade OLED screen replacements for cracked glass, blank screen, lines, and touch failure.",
                    "30 mins",
                    "Quote on Inspection",
                    true,
                    "Up to 6 Months Warranty",
                    List.of("Cracked outer glass", "Black spots or bleeding ink", "Unresponsive touch screen", "Green / pink vertical lines")
            ),
            new ServiceCategoryDto(
                    "battery-replacement",
                    "Battery Replacement",
                    "🔋",
                    "High-health original certified batteries to fix rapid drain, random shutdowns, and physical battery swelling.",
                    "20 mins",
                    "Quote on Inspection",
                    true,
                    "Up to 6 Months Warranty",
                    List.of("Battery drains in under 3 hours", "Phone switches off at 20-30%", "Phone heats up excessively", "Back panel lifting due to swollen battery")
            ),
            new ServiceCategoryDto(
                    "charging-port-repair",
                    "Charging Port Repair",
                    "⚡",
                    "Fix loose connector pins, slow charging, moisture alerts, and burnt Type-C / Lightning ports.",
                    "25 mins",
                    "Quote on Inspection",
                    true,
                    "3 Months Warranty",
                    List.of("Charger falls out or feels loose", "Slow charging or intermittent disconnects", "False moisture in charging port warning", "Zero charging response")
            ),
            new ServiceCategoryDto(
                    "software-repair",
                    "Software Repair & OS Flashing",
                    "💻",
                    "Fix continuous boot loop, bricked devices, Google Account lock, stuck logo, and severe system freezing.",
                    "30 mins",
                    "Quote on Inspection",
                    true,
                    "Service Guarantee",
                    List.of("Stuck on Apple / Android / Brand logo", "Continuous rebooting loop", "Storage full crash", "OS update failure / corrupted firmware")
            ),
            new ServiceCategoryDto(
                    "hardware-repair",
                    "Hardware & Board-Level Repair",
                    "🔧",
                    "Ear speaker, microphone, front/rear camera module, power/volume buttons, and motherboard IC repairs.",
                    "30–45 mins",
                    "Quote on Inspection",
                    true,
                    "Up to 3 Months Warranty",
                    List.of("Callers cannot hear your voice (Mic issue)", "Muffled or crackling earpiece sound", "Camera blurry or vibrating", "Dead power button")
            ),
            new ServiceCategoryDto(
                    "water-damage-diagnosis",
                    "Water Damage Diagnosis",
                    "💧",
                    "Ultrasonic chemical board bath, corrosion cleaning, and short-circuit diagnosis in our specialized Manikonda lab.",
                    "Diagnosis First (Lab Pickup)",
                    "Inspection First",
                    false, // PRD Rule: Water damage must be described as diagnosis-first; do not guarantee doorstep repair
                    "Subject to Board Health",
                    List.of("Device dropped in pool or bucket", "Liquid spill on phone", "Phone dead after rain exposure", "Short-circuit heating")
            )
    );

    @GetMapping
    public ResponseEntity<List<ServiceCategoryDto>> getAllServices() {
        return ResponseEntity.ok(services);
    }

    @GetMapping("/{slug}")
    public ResponseEntity<ServiceCategoryDto> getServiceBySlug(@PathVariable String slug) {
        Optional<ServiceCategoryDto> match = services.stream()
                .filter(s -> s.getSlug().equalsIgnoreCase(slug.trim()))
                .findFirst();
        return match.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
