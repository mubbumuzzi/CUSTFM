import React from "react";
import { Metadata } from "next";
import NeighborhoodLandingTemplate, {
  NeighborhoodConfig,
} from "@/components/NeighborhoodLandingTemplate";

export const metadata: Metadata = {
  title: "Doorstep Mobile Repair in Gachibowli | Open Till 1 AM Tech Care",
  description:
    "Fast doorstep mobile repair in Gachibowli, Telecom Nagar, DLF & Raidurg within 6 km. Open 10 AM to 1 AM! 60-min screen & battery replacement. Call +91 9063786751.",
  keywords: [
    "doorstep mobile repair Gachibowli",
    "midnight iPhone screen repair Gachibowli",
    "Samsung screen repair Gachibowli",
    "mobile repair Telecom Nagar",
    "phone repair DLF Cybercity",
    "mobile pickup and drop repair Gachibowli",
  ],
  alternates: {
    canonical: "https://famousmobiles.com/doorstep-mobile-repair-gachibowli",
  },
  openGraph: {
    title: "Doorstep Mobile Repair in Gachibowli | Open Till 1 AM Tech Care",
    description:
      "On-demand doorstep smartphone repair for IT corridors across Gachibowli, Telecom Nagar, and DLF Cybercity. Open daily until 1:00 AM.",
    url: "https://famousmobiles.com/doorstep-mobile-repair-gachibowli",
  },
};

const GACHIBOWLI_CONFIG: NeighborhoodConfig = {
  slug: "doorstep-mobile-repair-gachibowli",
  name: "Gachibowli",
  subTitle: "Express Doorstep Mobile Repair for IT Professionals & Residents",
  distanceFromStore: "4.8 km",
  eta: "35-45 Mins",
  heroHeadline: "Doorstep Mobile Repair in Gachibowli (Open Till 1 AM)",
  heroDescription:
    "Working late in Gachibowli, Telecom Nagar, or DLF Cybercity? Get your iPhone, Samsung Galaxy, or OnePlus repaired at your desk or home flat. Open 10:00 AM to 1:00 AM past midnight with zero data access required.",
  landmarks: [
    "Bio-Diversity Park",
    "Telecom Nagar",
    "Indira Nagar",
    "DLF Cybercity",
    "IIIT Hyderabad Junction",
    "Raidurg Metro",
  ],
  gatedSocieties: [
    "Prestige High Fields",
    "My Home Bhooja",
    "Aparna Sarovar Zenith",
    "Golf View Heights",
  ],
  popularRepairs: [
    {
      title: "iPhone 13 / 14 / 15 / 16 Screen Replacement",
      description:
        "Complete OLED assembly replacement with True Tone transfer and original glass touch sensitivity.",
      time: "35 Mins",
      warranty: "Up to 6 Months Warranty",
      tag: "IT Favorite",
    },
    {
      title: "Samsung S23 / S24 Ultra Glass & Display",
      description:
        "Factory-certified dynamic AMOLED screen replacement with high refresh rate & fingerprint sensor calibration.",
      time: "45 Mins",
      warranty: "Up to 6 Months Warranty",
      tag: "Premium Care",
    },
    {
      title: "Emergency Late-Night Battery Replacement",
      description:
        "Restore all-day battery life for busy executives and developers with premium tested high-capacity cells.",
      time: "20 Mins",
      warranty: "Up to 8 Months Warranty",
    },
    {
      title: "Type-C Fast Charging Port Repair",
      description:
        "Clean, solder, or replace worn-out charging daughterboards causing slow charge and heating.",
      time: "30 Mins",
      warranty: "3 Months Warranty",
    },
  ],
  faqs: [
    {
      question: "Is Gachibowli within your 6 km doorstep service radius?",
      answer:
        "Yes! Our store at Shaikpet Main Road / Puppalaguda is located 4.8 km from Gachibowli and Telecom Nagar, safely inside our strict 6 km dedicated doorstep service perimeter.",
    },
    {
      question: "Can technicians come to IT offices in DLF Cybercity or Gachibowli?",
      answer:
        "Yes, our technicians frequently service IT campuses, co-working spaces, and tech parks across Gachibowli. Repairs are conducted in your office reception or lobby area within 30 to 45 minutes.",
    },
    {
      question: "Do you operate during late night shifts in Gachibowli?",
      answer:
        "Yes, New Famous Mobile is open until 1:00 AM every night. Whether you work US or UK shifts or have an emergency at 1:30 AM, our dispatch desk (+91 9063786751) is active.",
    },
    {
      question: "How does gate security clearance work for apartments like My Home Bhooja or Prestige?",
      answer:
        "We share our technician's photo ID, name, and registered two-wheeler number immediately upon booking for instant MyGate or NoBrokerHood approval.",
    },
  ],
};

export default function GachibowliPage() {
  return <NeighborhoodLandingTemplate config={GACHIBOWLI_CONFIG} />;
}
