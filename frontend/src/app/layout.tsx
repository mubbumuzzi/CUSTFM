import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://famousmobiles.com"),
  title: {
    default: "Famous Mobiles — Doorstep Mobile Repair in Manikonda, Hyderabad",
    template: "%s | Famous Mobiles Manikonda",
  },
  description:
    "Fast 45-minute doorstep mobile repair within 5 km of Manikonda shop. Display replacement, battery fix, charging port repair, and software solutions. Your First Home Visit is FREE!",
  keywords: [
    "mobile repair in Manikonda",
    "doorstep mobile repair Hyderabad",
    "display replacement Manikonda",
    "battery replacement Manikonda",
    "charging repair near me",
    "iPhone screen repair Manikonda",
    "Samsung mobile repair Lanco Hills",
  ],
  authors: [{ name: "Famous Mobiles" }],
  creator: "Famous Mobiles",
  publisher: "Famous Mobiles",
  formatDetection: {
    telephone: true,
    address: true,
  },
  openGraph: {
    title: "Famous Mobiles — Doorstep Mobile Repair in Manikonda, Hyderabad",
    description:
      "Doorstep smartphone repair in 45 minutes. 10,000+ phones repaired, 4.9★ rating. First Home Visit is FREE (₹0)!",
    url: "https://famousmobiles.com",
    siteName: "Famous Mobiles",
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
    "@type": "LocalBusiness",
    "name": "Famous Mobiles",
    "image": "https://famousmobiles.com/logo.png",
    "telephone": "+919063786751",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Main Road, Near Marrichettu Junction",
      "addressLocality": "Manikonda, Hyderabad",
      "addressRegion": "Telangana",
      "postalCode": "500089",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 17.4022,
      "longitude": 78.3888
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        "opens": "09:00",
        "closes": "21:00"
      }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "657"
    },
    "hasMap": "https://share.google/U0L5BeQxKW1dBHUbJ",
    "priceRange": "₹₹"
  };

  return (
    <html lang="en" className={plusJakartaSans.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans bg-slate-50 text-navy-950 antialiased min-h-screen flex flex-col selection:bg-accent-500 selection:text-white">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <MobileBottomNav />
      </body>
    </html>
  );
}
