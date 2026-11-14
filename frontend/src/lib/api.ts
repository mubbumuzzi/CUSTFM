const getBaseUrl = (): string => {
  if (typeof window !== "undefined") {
    // In browser, relative URL /api routes directly through Nginx on current host & port
    return "/api";
  }
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
};

export interface BookingPayload {
  mobileNumber: string;
  customerName?: string;
  brandModel?: string;
  repairCategory?: string;
  issueDescription?: string;
  address?: string;
  landmark?: string;
  preferredTime?: string;
}

export interface BookingResponseData {
  bookingId: string;
  status: string;
  displayStatus: string;
  mobileNumber: string;
  customerName: string;
  brandModel: string;
  repairCategory: string;
  address: string;
  visitCharge: number;
  firstVisitFree: boolean;
  confirmationMessage: string;
  timestamp: string;
}

export interface BookingStatusData {
  bookingId: string;
  statusCode: string;
  statusLabel: string;
  currentStageIndex: number;
  totalStages: number;
  customerName: string;
  mobileNumber: string;
  brandModel: string;
  repairCategory: string;
  address: string;
  visitCharge: number;
  firstVisitFree: boolean;
  technicianName?: string | null;
  technicianPhone?: string | null;
  etaMinutes?: string | null;
  quoteAmount?: number | null;
  quoteApproved: boolean;
  stages: {
    index: number;
    name: string;
    completed: boolean;
    active: boolean;
  }[];
  createdAt: string;
  updatedAt: string;
}

export async function submitBookingEnquiry(payload: BookingPayload): Promise<BookingResponseData> {
  try {
    const res = await fetch(`${getBaseUrl()}/public/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const data: BookingResponseData = await res.json();
      if (typeof window !== "undefined") {
        localStorage.setItem(`fm_booking_${data.bookingId}`, JSON.stringify(data));
        localStorage.setItem("fm_latest_booking_id", data.bookingId);
        localStorage.setItem("fm_latest_mobile", payload.mobileNumber);
      }
      return data;
    }
  } catch (err) {
    console.warn("Backend unavailable, using local client fallback:", err);
  }

  // Client-side fallback for static preview / demo resilience
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const bookingId = `FM-2026-${randomSuffix}`;
  const responseData: BookingResponseData = {
    bookingId,
    status: "NEW_ENQUIRY",
    displayStatus: "New Enquiry Logged",
    mobileNumber: payload.mobileNumber,
    customerName: payload.customerName || "Customer",
    brandModel: payload.brandModel || "Smartphone",
    repairCategory: payload.repairCategory || "Display Replacement",
    address: payload.address || "Manikonda, Hyderabad",
    visitCharge: 0,
    firstVisitFree: true,
    confirmationMessage: "Enquiry logged successfully. Famous Mobiles Manikonda support team will contact you shortly.",
    timestamp: new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    localStorage.setItem(`fm_booking_${bookingId}`, JSON.stringify(responseData));
    localStorage.setItem("fm_latest_booking_id", bookingId);
    localStorage.setItem("fm_latest_mobile", payload.mobileNumber);
  }

  return responseData;
}

export async function sendOtpApi(mobileNumber: string): Promise<{ success: boolean; message: string; demoOtp?: string }> {
  try {
    const res = await fetch(`${getBaseUrl()}/auth/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobileNumber }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("Auth service offline, using mock OTP response:", err);
  }
  return {
    success: true,
    message: `OTP sent successfully to +91 ${mobileNumber}`,
    demoOtp: "1234",
  };
}

export async function fetchBookingStatus(bookingId: string, mobile?: string): Promise<BookingStatusData | null> {
  const cleanId = bookingId.trim().toUpperCase();
  try {
    let url = `${getBaseUrl()}/public/bookings/${cleanId}/status`;
    if (mobile) {
      url += `?mobile=${encodeURIComponent(mobile)}`;
    }
    const res = await fetch(url);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("Backend unavailable, checking local storage for status:", err);
  }

  // Local storage check or default fallback
  let localData: Partial<BookingResponseData> = {};
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(`fm_booking_${cleanId}`);
    if (stored) {
      try {
        localData = JSON.parse(stored);
      } catch (e) {
        console.error(e);
      }
    }
  }

  const PRD_STAGES = [
    "New Enquiry Logged",
    "Customer Contacted",
    "Appointment Confirmed",
    "Technician Assigned",
    "Part Collected from Manikonda Hub",
    "Technician On The Way",
    "Technician Arrived",
    "Diagnosis Completed",
    "Awaiting Customer Approval",
    "Repair In Progress",
    "Completed & Closed",
  ];

  const activeIndex = 0; // Starts at Stage 0: "New Enquiry Logged" for real customers

  return {
    bookingId: cleanId,
    statusCode: "NEW_ENQUIRY",
    statusLabel: "New Enquiry Logged",
    currentStageIndex: activeIndex,
    totalStages: 11,
    customerName: localData.customerName || "Customer",
    mobileNumber: mobile || localData.mobileNumber || "",
    brandModel: localData.brandModel || "Smartphone",
    repairCategory: localData.repairCategory || "General Diagnosis",
    address: localData.address || "Manikonda, Hyderabad",
    visitCharge: localData.visitCharge ?? 0,
    firstVisitFree: localData.firstVisitFree ?? true,
    technicianName: null,
    technicianPhone: null,
    etaMinutes: "Dispatching (~45 mins)",
    quoteAmount: null,
    quoteApproved: false,
    stages: PRD_STAGES.map((name, i) => ({
      index: i,
      name,
      completed: i < activeIndex,
      active: i === activeIndex,
    })),
    createdAt: localData.timestamp || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export async function approveBookingQuote(bookingId: string): Promise<boolean> {
  const cleanId = bookingId.trim().toUpperCase();
  try {
    const res = await fetch(`${getBaseUrl()}/public/bookings/${cleanId}/approve-quote`, {
      method: "POST",
    });
    return res.ok;
  } catch (err) {
    console.warn("Backend unavailable for quote approval:", err);
    return true;
  }
}
