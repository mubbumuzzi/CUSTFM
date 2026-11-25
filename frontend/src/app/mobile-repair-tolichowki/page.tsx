import React from "react";
import { Metadata } from "next";
import NeighborhoodLandingTemplate, {
  NeighborhoodConfig,
} from "@/components/NeighborhoodLandingTemplate";

export const metadata: Metadata = {
  title: "Mobile Repair in Tolichowki | 60-Min Doorstep (Open Till 1 AM)",
  description:
    "Fast doorstep mobile repair in Tolichowki, Paramount Hills & Seven Tombs area within 6 km. Open 10 AM to 1 AM daily! Genuine screens & batteries. Call +91 9063786751.",
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
    title: "Mobile Repair in Tolichowki | 60-Min Doorstep (Open Till 1 AM)",
    description:
      "Certified doorstep mobile repair across Tolichowki and Paramount Hills. Open daily until 1:00 AM past midnight.",
    url: "https://famousmobiles.com/mobile-repair-tolichowki",
  },
};

const TOLICHOWKI_CONFIG: NeighborhoodConfig = {
  slug: "mobile-repair-tolichowki",
  name: "Tolichowki",
  subTitle: "Shaikpet Flyover, Galaxy & Paramount Hills",
  distanceFromStore: "2.5 km",
  eta: "20-30 Mins",
  heroHeadline: "Fast Doorstep Mobile Repair in Tolichowki (Open Till 1 AM)",
  heroDescription:
    "Located just 2.5 km east of our Shaikpet Main Road workshop, Tolichowki, Paramount Hills, and Seven Tombs Road receive rapid 20–30 minute technician dispatch until 1:00 AM—or drive 5 minutes across the Shaikpet flyover for express walk-in service.",
  dispatchCorridorTitle: "Straight 5-Minute Corridor via Shaikpet Flyover & Galaxy",
  dispatchCorridorCopy:
    "Our Puppalaguda store connects directly onto Shaikpet Main Road toward Tolichowki Main Flyover, Galaxy Theater Junction, and Rethi Bowli Link Road. That short 2.5 km hop lets our technicians reach Paramount Colony, Al-Hamra Residency, and Diamond Hills Layout in 20–30 minutes—and makes 2-hour round-trip lab pickups easy when motherboard water recovery is needed.",
  localInsightsTitle: "Late-Evening Commuter, Student & Family Repairs in Tolichowki",
  localInsightsCopy:
    "Tolichowki customers value upfront Original-vs-Compatible part comparisons before work starts. We bring both factory-spec OLED panels and budget-friendly certified displays to your home, test earpiece clarity, microphone pickup, and fast-charging current in front of you, and back every repair with written warranty coverage.",
  localReview: {
    author: "Mohammed Arif",
    locality: "Paramount Hills / Shaikpet Corridor",
    device: "Android Phone • Water Damage Lab Recovery",
    quote:
      "Dropped phone in water while raining. Their shop was open late night. They dried and ultrasonically cleaned the motherboard and saved my family photos. Very honest pricing, did not charge unnecessary fees.",
  },
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
      question: "Can I get my phone repaired late at night in Tolichowki?",
      answer:
        "Yes! Famous Mobiles is open every day until 1:00 AM. You can book doorstep service or drive over to our Shaikpet store for immediate late-night service.",
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
