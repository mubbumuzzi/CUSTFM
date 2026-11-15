package com.famousmobiles.service;

import com.famousmobiles.dto.BookingEnquiryRequest;
import com.famousmobiles.dto.BookingResponse;
import com.famousmobiles.dto.BookingStatusResponse;
import com.famousmobiles.entity.Booking;
import com.famousmobiles.entity.BookingStatus;
import com.famousmobiles.entity.Customer;
import com.famousmobiles.repository.BookingRepository;
import com.famousmobiles.repository.CustomerRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BookingServiceTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private CustomerRepository customerRepository;

    @InjectMocks
    private BookingService bookingService;

    private BookingEnquiryRequest standardRequest;

    @BeforeEach
    void setUp() {
        standardRequest = new BookingEnquiryRequest();
        standardRequest.setMobileNumber("9876543210");
        standardRequest.setCustomerName("Mohammed");
        standardRequest.setBrandModel("iPhone 14");
        standardRequest.setRepairCategory("Display Replacement");
        standardRequest.setAddress("Lanco Hills, Manikonda");
    }

    @Test
    @DisplayName("PRD Business Rule: New customer receives First Home Visit FREE (₹0)")
    void testNewCustomerGetsFirstVisitFree() {
        when(customerRepository.findByMobileNumber("9876543210")).thenReturn(Optional.empty());
        when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> invocation.getArgument(0));

        BookingResponse response = bookingService.createEnquiry(standardRequest);

        assertThat(response).isNotNull();
        assertThat(response.isFirstVisitFree()).isTrue();
        assertThat(response.getVisitCharge()).isEqualByComparingTo(BigDecimal.ZERO);
        assertThat(response.getBookingId()).startsWith("FMO-2026-");
        assertThat(response.getStatus()).isEqualTo("NEW_ENQUIRY");

        ArgumentCaptor<Customer> customerCaptor = ArgumentCaptor.forClass(Customer.class);
        verify(customerRepository).save(customerCaptor.capture());
        Customer savedCustomer = customerCaptor.getValue();
        assertThat(savedCustomer.isFirstVisitFreeClaimed()).isTrue();
        assertThat(savedCustomer.getTotalBookings()).isEqualTo(1);
    }

    @Test
    @DisplayName("PRD Business Rule: Returning customer who already claimed free visit is charged subsequent ₹69 fee")
    void testReturningCustomerChargedSubsequentVisitFee() {
        Customer existingCustomer = new Customer("9876543210");
        existingCustomer.setTotalBookings(1);
        existingCustomer.setFirstVisitFreeClaimed(true);

        when(customerRepository.findByMobileNumber("9876543210")).thenReturn(Optional.of(existingCustomer));
        when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> invocation.getArgument(0));

        BookingResponse response = bookingService.createEnquiry(standardRequest);

        assertThat(response.isFirstVisitFree()).isFalse();
        assertThat(response.getVisitCharge()).isEqualByComparingTo(new BigDecimal("69.00"));
    }

    @Test
    @DisplayName("PRD 6.3 Rule: Incomplete enquiries with ONLY mobile number are permitted and saved")
    void testIncompleteEnquiryAllowedWithOnlyMobile() {
        BookingEnquiryRequest minimalRequest = new BookingEnquiryRequest();
        minimalRequest.setMobileNumber("9988776655");

        when(customerRepository.findByMobileNumber("9988776655")).thenReturn(Optional.empty());
        when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> invocation.getArgument(0));

        BookingResponse response = bookingService.createEnquiry(minimalRequest);

        assertThat(response).isNotNull();
        assertThat(response.getMobileNumber()).isEqualTo("9988776655");
        assertThat(response.getCustomerName()).isEqualTo("Valued Customer");
        assertThat(response.getRepairCategory()).isEqualTo("General Diagnosis");
        assertThat(response.getAddress()).isEqualTo("Manikonda, Hyderabad");
    }

    @Test
    @DisplayName("Dynamic GPS-Linked ETA: 0.2 km Manikonda coordinates assign ~10-15 mins ETA")
    void testDynamicGpsLinkedEtaAssigned() {
        BookingEnquiryRequest gpsRequest = new BookingEnquiryRequest();
        gpsRequest.setMobileNumber("9876543210");
        gpsRequest.setLatitude(17.4050);
        gpsRequest.setLongitude(78.3880); // ~0.1 km from new shop hub (17.4058, 78.3879)

        ArgumentCaptor<Booking> captor = ArgumentCaptor.forClass(Booking.class);
        when(customerRepository.findByMobileNumber("9876543210")).thenReturn(Optional.empty());
        when(bookingRepository.save(captor.capture())).thenAnswer(invocation -> invocation.getArgument(0));

        bookingService.createEnquiry(gpsRequest);

        Booking saved = captor.getValue();
        assertThat(saved.getEtaMinutes()).isEqualTo("Dispatching (~10-15 mins)");
    }

    @Test
    @DisplayName("PRD 6.5 Rule: Booking status lookup returns exactly 11 lifecycle stages with correct active stage")
    void testGetBookingStatusReturnsAll11PrdStages() {
        Booking booking = new Booking();
        booking.setBookingId("FM-2026-1234");
        booking.setMobileNumber("9876543210");
        booking.setCustomerName("Mohammed");
        booking.setStatus(BookingStatus.TECHNICIAN_ON_THE_WAY);

        when(bookingRepository.findByBookingId("FM-2026-1234")).thenReturn(Optional.of(booking));

        Optional<BookingStatusResponse> resultOpt = bookingService.getBookingStatus("FM-2026-1234", "9876543210");

        assertThat(resultOpt).isPresent();
        BookingStatusResponse status = resultOpt.get();
        assertThat(status.getTotalStages()).isEqualTo(11);
        assertThat(status.getStages()).hasSize(11);
        assertThat(status.getCurrentStageIndex()).isEqualTo(5); // TECHNICIAN_ON_THE_WAY is stage index 5

        // Check stage 5 is active
        assertThat(status.getStages().get(5).isActive()).isTrue();
        assertThat(status.getStages().get(5).getName()).isEqualTo("Technician On The Way");

        // Prior stages should be marked completed
        assertThat(status.getStages().get(0).isCompleted()).isTrue();
        assertThat(status.getStages().get(4).isCompleted()).isTrue();

        // Future stages should not be completed
        assertThat(status.getStages().get(6).isCompleted()).isFalse();
    }

    @Test
    @DisplayName("Security / IDOR Rule: Mismatched mobile number prevents exposure of private booking details")
    void testIdorProtectionMobileMismatchReturnsEmpty() {
        Booking booking = new Booking();
        booking.setBookingId("FM-2026-1234");
        booking.setMobileNumber("9876543210");

        when(bookingRepository.findByBookingId("FM-2026-1234")).thenReturn(Optional.of(booking));

        // Attacker attempts lookup with a different mobile number
        Optional<BookingStatusResponse> resultOpt = bookingService.getBookingStatus("FM-2026-1234", "9111111111");

        assertThat(resultOpt).isEmpty();
    }

    @Test
    @DisplayName("Customer Quote Approval transitions status to REPAIR_IN_PROGRESS")
    void testApproveQuoteUpdatesStatusToRepairInProgress() {
        Booking booking = new Booking();
        booking.setBookingId("FM-2026-5555");
        booking.setMobileNumber("9876543210");
        booking.setStatus(BookingStatus.AWAITING_CUSTOMER_APPROVAL);
        booking.setQuoteApproved(false);

        when(bookingRepository.findByBookingId("FM-2026-5555")).thenReturn(Optional.of(booking));
        when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Optional<BookingStatusResponse> resultOpt = bookingService.approveQuote("FM-2026-5555");

        assertThat(resultOpt).isPresent();
        assertThat(booking.isQuoteApproved()).isTrue();
        assertThat(booking.getStatus()).isEqualTo(BookingStatus.REPAIR_IN_PROGRESS);
    }

    @Test
    @DisplayName("Get Directions Google Maps URL is generated correctly with GPS coordinates and address fallback")
    void testGoogleMapsUrlGeneration() {
        // 1. With GPS coordinates
        Booking gpsBooking = new Booking();
        gpsBooking.setBookingId("FMO-2026-9999");
        gpsBooking.setMobileNumber("9876543210");
        gpsBooking.setLatitude(17.4045);
        gpsBooking.setLongitude(78.3752);
        gpsBooking.setAddress("Lanco Hills, Manikonda");

        BookingStatusResponse gpsResponse = bookingService.mapBookingToResponse(gpsBooking, true);
        assertThat(gpsResponse.getGoogleMapsUrl())
                .isEqualTo("https://www.google.com/maps/dir/?api=1&destination=17.4045,78.3752");
        assertThat(gpsResponse.getLatitude()).isEqualTo(17.4045);
        assertThat(gpsResponse.getLongitude()).isEqualTo(78.3752);

        // 2. Without GPS coordinates, fallback to address
        Booking addrBooking = new Booking();
        addrBooking.setBookingId("FMO-2026-8888");
        addrBooking.setMobileNumber("9876543210");
        addrBooking.setAddress("Puppalguda Main Road");

        BookingStatusResponse addrResponse = bookingService.mapBookingToResponse(addrBooking, true);
        assertThat(addrResponse.getGoogleMapsUrl())
                .contains("https://www.google.com/maps/dir/?api=1&destination=")
                .contains("Puppalguda");
    }

    @Test
    @DisplayName("deleteBooking returns true and removes record when booking exists")
    void testDeleteBookingSuccess() {
        Booking booking = new Booking();
        booking.setBookingId("FM-2026-1234");
        when(bookingRepository.findByBookingId("FM-2026-1234")).thenReturn(Optional.of(booking));

        boolean result = bookingService.deleteBooking("FM-2026-1234");

        assertThat(result).isTrue();
        verify(bookingRepository).delete(booking);
    }

    @Test
    @DisplayName("deleteBooking returns false when booking does not exist or id is blank")
    void testDeleteBookingNotFoundOrBlank() {
        when(bookingRepository.findByBookingId("FM-NONEXISTENT")).thenReturn(Optional.empty());

        assertThat(bookingService.deleteBooking("FM-NONEXISTENT")).isFalse();
        assertThat(bookingService.deleteBooking("   ")).isFalse();
        assertThat(bookingService.deleteBooking(null)).isFalse();
        verify(bookingRepository, never()).delete(any());
    }
}
