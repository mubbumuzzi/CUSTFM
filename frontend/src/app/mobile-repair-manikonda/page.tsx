import React from "react";
import { Metadata } from "next";
import NeighborhoodLandingTemplate, {
  NeighborhoodConfig,
} from "@/components/NeighborhoodLandingTemplate";

export const metadata: Metadata = {
  title: "Mobile Repair in Manikonda | 60-Min Doorstep (Open Till 1 AM)",
  description:
    "Fast 60-min doorstep mobile repair in Manikonda, Lanco Hills & Secretariat Colony. Open 10 AM to 1 AM daily! Screen, battery & charging fix. Call +91 9063786751.",
  keywords: [
    "mobile repair in Manikonda",
    "iPhone repair Manikonda",
    "doorstep mobile screen replacement Manikonda",
    "Samsung phone repair Manikonda",
    "mobile repair Lanco Hills",
    "late night phone repair Manikonda",
  ],
  alternates: {
    canonical: "https://famousmobiles.com/mobile-repair-manikonda",
  },
  openGraph: {
    title: "Mobile Repair in Manikonda | 60-Min Doorstep (Open Till 1 AM)",
    description:
      "Doorstep mobile repair across Manikonda, Lanco Hills, and Secretariat Colony. 10 AM to 1 AM emergency service with up to 8 months warranty.",
    url: "https://famousmobiles.com/mobile-repair-manikonda",
  },
};

const MANIKONDA_CONFIG: NeighborhoodConfig = {
  slug: "mobile-repair-manikonda",
  name: "Manikonda",
  subTitle: "Doorstep Repair for Lanco Hills, Alkapur & Secretariat Colony",
  distanceFromStore: "1.4 km",
  eta: "15-25 Mins",
  heroHeadline: "Fast Doorstep Mobile Repair in Manikonda (Open Till 1 AM)",
  heroDescription:
    "Cracked your screen or battery draining fast in Manikonda? Our in-house technicians dispatch straight from our Puppalaguda workshop to Lanco Hills, Secretariat Colony, Alkapur Township, and Panchavati in 15–25 minutes—fixing your phone live in front of you with zero passcode access.",
  dispatchCorridorTitle: "Manikonda Rider Route & Gated Society Dispatch",
  dispatchCorridorCopy:
    "From Opp Friends Colony Bus Stop on Shaikpet Main Road, our riders cross Puppalaguda Main Road and Marrichettu Junction directly into Lanco Hills Towers, Golf View Apartments, and Secretariat Colony within 15–25 minutes. For high-rise apartments using MyGate or NoBrokerHood, we share technician photo ID and vehicle registration immediately after booking so lobby arrival is seamless.",
  localInsightsTitle: "Most Common Repairs for Manikonda Families & WFH Residents",
  localInsightsCopy:
    "Manikonda residential complexes see the highest demand for evening iPhone OLED screen replacements (after accidental drops on tile floors), swollen battery swaps for work-from-home devices, and fast USB-C port cleaning. Because we carry calibrated OEM assemblies in our mobile kit, you avoid Marrichettu evening traffic and keep all banking and WhatsApp data untouched.",
  localReview: {
    author: "Vikram R.",
    locality: "Lanco Hills, Manikonda",
    device: "iPhone 14 Pro Max • Display",
    quote:
      "Technician Ramesh arrived in 35 minutes! Replaced my cracked OLED screen right at my dining table in 30 mins. Display colors and 120Hz ProMotion feel 100% original. First visit was completely free.",
  },
  landmarks: [
    "Marrichettu Junction",
    "Lanco Hills Tower Area",
    "Puppalaguda Main Road",
    "Secretariat Colony",
  ],
  gatedSocieties: [
    "Lanco Hills Mega Township",
    "Panchavati Residency",
    "Golf View Apartments",
    "Golden Tulip Layout",
  ],
  popularRepairs: [
    {
      title: "iPhone Display Replacement",
      description:
        "OLED and original-spec glass replacement for iPhone 11 through iPhone 16 Pro Max. True Tone restored.",
      time: "30 Mins",
      warranty: "Up to 6 Months Warranty",
      tag: "Most Popular",
    },
    {
      title: "High-Capacity Battery Replacement",
      description:
        "High-density certified lithium polymer cells with instant health calibration and thermal safety testing.",
      time: "20 Mins",
      warranty: "Up to 8 Months Warranty",
      tag: "Quick Fix",
    },
    {
      title: "Samsung OLED & Foldable Care",
      description:
        "Dynamic AMOLED 2X panel replacements for Galaxy S21 through S24 Ultra and Z Fold/Flip series.",
      time: "45 Mins",
      warranty: "Up to 6 Months Warranty",
    },
    {
      title: "Charging Port & Mic Repair",
      description:
        "Fix loose type-C / lightning ports, fast-charging disconnection, and noisy microphones.",
      time: "25 Mins",
      warranty: "3 Months Warranty",
    },
  ],
  faqs: [
    {
      question: "How fast can a technician arrive at Lanco Hills or Secretariat Colony in Manikonda?",
      answer:
        "Because our workshop is located right at Shaikpet Main Road / Puppalaguda, our riders reach any gated community in Manikonda within 15 to 25 minutes after your booking confirmation.",
    },
    {
      question: "Are you open for late-night emergency mobile repairs in Manikonda?",
      answer:
        "Yes! Famous Mobiles operates daily from 10:00 AM to 1:00 AM past midnight. Whether you have an urgent presentation tomorrow morning or dropped your phone late, call +91 9063786751 for doorstep service.",
    },
    {
      question: "Can I walk into your physical store instead of doorstep service?",
      answer:
        "Absolutely. Our physical store is located Opp Friends Colony Bus Stop, Shaikpet Main Road, Puppalaguda, Manikonda. Walk-in customers receive express 30–60 minute on-the-spot repairs.",
    },
    {
      question: "How do your technicians enter gated communities like Lanco Hills?",
      answer:
        "Our riders carry official Famous Mobiles ID badges and vehicle numbers. We immediately share these details upon booking for seamless MyGate, NoBrokerHood, or security gate pre-approval.",
    },
  ],
};

export default function ManikondaPage() {
  return <NeighborhoodLandingTemplate config={MANIKONDA_CONFIG} />;
}
