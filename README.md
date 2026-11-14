# Famous Mobiles — Customer Facing Platform (`CustFM`)

Doorstep smartphone repair web application for **Famous Mobiles**, serving Manikonda, Hyderabad within a 5 km service perimeter. Built to the exact specifications of **PRD v1.2** and modeled after quick-commerce (Blinkit / Zomato) high-converting UX.

---

## Architecture Overview

```
CustFM/
├── backend/                  # Java Spring Boot 3 + Spring Data JPA + H2 / PostgreSQL
│   ├── src/main/java/com/famousmobiles/
│   │   ├── config/           # CORS & Security configurations
│   │   ├── controller/       # PublicBookingController, AuthController, ServiceCatalogController, EligibilityController
│   │   ├── dto/              # BookingEnquiryRequest, BookingResponse, BookingStatusResponse, etc.
│   │   ├── entity/           # Booking, Customer, OtpToken, BookingStatus (11 PRD Stages)
│   │   ├── repository/       # JpaRepositories
│   │   └── service/          # BookingService (Free-visit eligibility logic), OtpService
│   └── pom.xml
└── frontend/                 # Next.js 15 (App Router) + TypeScript + Tailwind CSS
    ├── src/
    │   ├── app/              # SSR / SSG SEO-optimized routes (/, /services, /book-repair, /track-booking, etc.)
    │   ├── components/       # Responsive Header, Footer, LocationModal, MobileBottomNav
    │   ├── data/             # 6 specialized repair services catalog
    │   └── lib/              # Client API layer with fallback resilience
    ├── package.json
    └── tailwind.config.ts
```

---

## Key Features & PRD v1.2 Compliance

1. **Hyperlocal 5 km Service Area**: Dedicated coverage for Lanco Hills, Puppalaguda, Alkapoor Township, OU Colony, and Shaikpet.
2. **First Visit FREE (₹0)**: Verified through customer identity & booking history. Subsequent home visits cost ₹49 (100% adjusted against final repair bill).
3. **Zero-Friction Intake**: On `/book-repair`, **only the 10-digit mobile number is mandatory**. No OTP or account registration is required to submit an enquiry.
4. **OTP-Gated Live Tracking**: On `/track-booking`, customer order details are protected by OTP verification. Includes the **11 standard PRD lifecycle stages**, an animated vector route map, technician direct call, and in-app quote approval widget.
5. **SEO & Multi-Page Architecture**: Full Server-Side Rendered (SSR) routes with LocalBusiness JSON-LD schema, openGraph tags, and dedicated service landing pages.
6. **Dual Responsive Viewport**: Desktop wide corporate/service layout + mobile quick-commerce bottom-nav feel.

---

## Running the Platform Locally

### 1. Java Spring Boot Backend
```bash
cd backend
mvn spring-boot:run
# Server runs on http://localhost:8080
# H2 Console available at http://localhost:8080/h2-console
```

### 2. Next.js Frontend
```bash
cd frontend
npm run dev
# Web app runs on http://localhost:3000
```
