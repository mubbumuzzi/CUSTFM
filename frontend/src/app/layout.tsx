import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import GoogleReviewsModal from "@/components/GoogleReviewsModal";
import ToastBanner from "@/components/ToastBanner";
import InteractiveBookingModal from "@/components/InteractiveBookingModal";
import TrackOrderModal from "@/components/TrackOrderModal";
import FloatingWhatsAppButton from "@/components/FloatingWhatsAppButton";
import { BUSINESS_INFO, buildLocalBusinessJsonLd } from "@/lib/businessInfo";

export const metadata: Metadata = {
  metadataBase: new URL(BUSINESS_INFO.url),
  title: {
    default: "Mobile Repair Open Till 1 AM in Manikonda | Famous Mobiles",
    template: "%s | Famous Mobiles Manikonda",
  },
  description:
    "Late-night mobile repair in Manikonda, Shaikpet & Gachibowli—open 10 AM to 1 AM! 60-min screen & battery repair + 6 km doorstep pickup. Call +91 9063786751.",
  keywords: [
    "mobile repair open till 1 am Hyderabad",
    "late night phone repair Manikonda",
    "doorstep mobile repair Manikonda",
    "doorstep phone screen replacement Gachibowli",
    "mobile repair Shaikpet",
    "mobile pickup and drop repair Narsingi",
    "doorstep iPhone repair Tolichowki",
    "mobile repair Lanco Hills",
    "mobile repair Alkapur Township",
    "iPhone screen repair Manikonda",
    "Samsung screen repair Gachibowli",
  ],
  authors: [{ name: BUSINESS_INFO.name }],
  creator: BUSINESS_INFO.name,
  publisher: BUSINESS_INFO.name,
  alternates: {
    canonical: BUSINESS_INFO.url,
  },
  formatDetection: {
    telephone: true,
    address: true,
  },
  openGraph: {
    title: "Mobile Repair Open Till 1 AM in Manikonda | Famous Mobiles",
    description:
      "Late-night mobile repair in Manikonda, Shaikpet & Gachibowli—open 10 AM to 1 AM! 60-min screen & battery repair + 6 km doorstep pickup. Call +91 9063786751.",
    url: BUSINESS_INFO.url,
    siteName: BUSINESS_INFO.name,
    locale: "en_IN",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = buildLocalBusinessJsonLd();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="font-sans bg-[#F8FAFC] text-slate-900 antialiased min-h-screen flex flex-col selection:bg-orange-500 selection:text-white"
      >
        <ToastBanner />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingWhatsAppButton />
        <MobileBottomNav />
        <GoogleReviewsModal />
        <InteractiveBookingModal />
        <TrackOrderModal />
      </body>
    </html>
  );
}
