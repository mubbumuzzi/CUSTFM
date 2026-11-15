import React from "react";
import { Metadata } from "next";
import NeighborhoodLandingTemplate, {
  NeighborhoodConfig,
} from "@/components/NeighborhoodLandingTemplate";

export const metadata: Metadata = {
  title: "Mobile Repair in Tolichowki | 60-Min Doorstep (Open Till 3 AM)",
  description:
    "Fast doorstep mobile repair in Tolichowki, Paramount Hills & Seven Tombs area within 6 km. Open 10 AM to 3 AM daily! Genuine screens & batteries. Call +91 9063786751.",
  keywords: [
    "doorstep iPhone repair Tolichowki",
    "mobile repair Tolichowki",
    "6 km mobile pickup Tolichowki",
    "mobile repair Paramount Hills",
    "phone screen replacement Tolichowki",
    "emergency mobile repair open now Tolichowki",
  ],
  alternates: {
    canonical: "https://famousmobiles.com/mobile-repair-tolichowki",
  },
  openGraph: {
    title: "Mobile Repair in Tolichowki | 60-Min Doorstep (Open Till 3 AM)",
    description:
      "Certified doorstep mobile repair across Tolichowki and Paramount Hills. Open daily until 3:00 AM past midnight.",
    url: "https://famousmobiles.com/mobile-repair-tolichowki",
  },
};

const TOLICHOWKI_CONFIG: NeighborhoodConfig = {
  slug: "mobile-repair-tolichowki",
  name: "Tolichowki",
  subTitle: "Fast Doorstep Smartphone Care for Tolichowki & Paramount Hills",
  distanceFromStore: "2.5 km",
  eta: "20-30 Mins",
  heroHeadline: "Fast Doorstep Mobile Repair in Tolichowki (Open Till 3 AM)",
  heroDescription:
    "Located just down the road on Shaikpet Main Road, our expert technicians reach Tolichowki, Paramount Hills, and Galaxy Junction within 20–30 minutes. 100% transparent pricing with OEM and certified compatible parts.",
  landmarks: [
    "Tolichowki Main Flyover",
    "Galaxy Theater Junction",
    "Paramount Hills",
    "Seven Tombs Road",
    "Rethi Bowli Link Road",
  ],
  gatedSocieties: [
    "Paramount Colony",
    "Al-Hamra Residency",
    "Salams Enclave",
    "Diamond Hills Layout",
  ],
  popularRepairs: [
    {
      title: "iPhone Display & OLED Replacement",
      description:
        "High-precision screen changes for iPhone 11, 12, 13, 14, 15, and 16 with True Tone matching.",
      time: "30 Mins",
      warranty: "Up to 6 Months Warranty",
      tag: "Best Seller",
    },
    {
      title: "High-Capacity Battery Replacement",
      description:
        "Long-lasting certified battery replacement that eliminates unexpected battery drops and overheating.",
      time: "20 Mins",
      warranty: "Up to 8 Months Warranty",
      tag: "Express",
    },
    {
      title: "Water Damage Ultrasonic Treatment",
      description:
        "Safe lab pickup from Tolichowki to our Shaikpet workshop for chemical ultrasonic de-oxidation.",
      time: "2 Hours Roundtrip",
      warranty: "Workshop Lab Only",
    },
    {
      title: "Speaker, Mic & Receiver Repair",
      description:
        "Clear sound restoration for earpiece low volume, cracked loudspeaker audio, and mute microphone.",
      time: "25 Mins",
      warranty: "3 Months Warranty",
    },
  ],
  faqs: [
    {
      question: "How close is your physical store to Tolichowki?",
      answer:
        "Our physical store is located just 2.5 km away at Opp Friends Colony Bus Stop, Shaikpet Main Road, Puppalaguda—a straight 5 to 7 minute drive via the Shaikpet flyover.",
    },
    {
      question: "How long does doorstep technician dispatch take to Tolichowki?",
      answer:
        "Our riders reach Tolichowki, Paramount Hills, and Seven Tombs within 20 to 30 minutes from your confirmed booking.",
    },
    {
      question: "Can I get my phone repaired after midnight in Tolichowki?",
      answer:
        "Yes! New Famous Mobile is open every day until 3:00 AM. You can book doorstep service or drive over to our Shaikpet store for immediate late-night service.",
    },
    {
      question: "What if I choose not to get the repair done?",
      answer:
        "Your first home inspection visit is 100% FREE (₹0). There is no pressure or surprise diagnostic charge.",
    },
  ],
};

export default function TolichowkiPage() {
  return <NeighborhoodLandingTemplate config={TOLICHOWKI_CONFIG} />;
}
