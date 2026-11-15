import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import GoogleReviewsModal from "@/components/GoogleReviewsModal";

export const metadata: Metadata = {
  metadataBase: new URL("https://famousmobiles.com"),
  title: {
    default: "Mobile Repair Open Till 3 AM in Manikonda | Famous Mobiles",
    template: "%s | Famous Mobiles Manikonda",
  },
  description:
    "Late-night mobile repair in Manikonda, Shaikpet & Gachibowli—open 10 AM to 3 AM! 60-min screen & battery repair + 6 km doorstep pickup. Call +91 9063786751.",
  keywords: [
    "mobile repair open till 3 am Hyderabad",
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
  authors: [{ name: "New Famous Mobile" }],
  creator: "New Famous Mobile",
  publisher: "New Famous Mobile",
  formatDetection: {
    telephone: true,
    address: true,
  },
  openGraph: {
    title: "Mobile Repair Open Till 3 AM in Manikonda | Famous Mobiles",
    description:
      "Late-night mobile repair in Manikonda, Shaikpet & Gachibowli—open 10 AM to 3 AM! 60-min screen & battery repair + 6 km doorstep pickup. Call +91 9063786751.",
    url: "https://famousmobiles.com",
    siteName: "New Famous Mobile",
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
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MobilePhoneStore",
    "@id": "https://famousmobiles.com/#organization",
    "name": "New Famous Mobile",
    "alternateName": "Famous Mobiles",
    "url": "https://famousmobiles.com",
    "telephone": "+919063786751",
    "priceRange": "₹₹",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Opp Friends Colony Bus Stop, Shaikpet Main Road, Puppalaguda",
      "addressLocality": "Manikonda, Hyderabad",
      "addressRegion": "Telangana",
      "postalCode": "500089",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 17.4058,
      "longitude": 78.3879
    },
    "areaServed": [
      {
        "@type": "GeoCircle",
        "geoMidpoint": {
          "@type": "GeoCoordinates",
          "latitude": 17.4058,
          "longitude": 78.3879
        },
        "geoRadius": "6000"
      },
      { "@type": "Place", "name": "Manikonda, Hyderabad" },
      { "@type": "Place", "name": "Puppalaguda, Hyderabad" },
      { "@type": "Place", "name": "Shaikpet, Hyderabad" },
      { "@type": "Place", "name": "Alkapur Township, Hyderabad" },
      { "@type": "Place", "name": "Lanco Hills, Manikonda" },
      { "@type": "Place", "name": "Tolichowki, Hyderabad" },
      { "@type": "Place", "name": "Narsingi, Hyderabad" },
      { "@type": "Place", "name": "Kokapet, Hyderabad" },
      { "@type": "Place", "name": "Raidurg, Hyderabad" },
      { "@type": "Place", "name": "Gachibowli, Hyderabad" },
      { "@type": "Place", "name": "Film Nagar, Hyderabad" },
      { "@type": "Place", "name": "Jubilee Hills, Hyderabad" },
      { "@type": "Place", "name": "Mehdipatnam, Hyderabad" }
    ],
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday"
        ],
        "opens": "10:00",
        "closes": "03:00"
      }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "1000"
    },
    "hasMap": "https://share.google/U0L5BeQxKW1dBHUbJ"
  };

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
        className="font-sans bg-slate-50 text-navy-950 antialiased min-h-screen flex flex-col selection:bg-accent-500 selection:text-white"
      >
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <MobileBottomNav />
        <GoogleReviewsModal />
      </body>
    </html>
  );
}
