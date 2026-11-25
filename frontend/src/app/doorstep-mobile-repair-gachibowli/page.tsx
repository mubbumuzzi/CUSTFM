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
  subTitle: "IT Corridor, Telecom Nagar & Late-Shift Dispatch",
  distanceFromStore: "4.8 km",
  eta: "35-45 Mins",
  heroHeadline: "Doorstep Mobile Repair in Gachibowli (Open Till 1 AM)",
  heroDescription:
    "Working late in Gachibowli, Telecom Nagar, Raidurg, or DLF Cybercity? Our mobile technicians ride directly to your office lobby, co-working desk, or apartment in 35–45 minutes—open daily 10:00 AM to 1:00 AM with strict zero-passcode data privacy.",
  dispatchCorridorTitle: "Khajaguda – Bio-Diversity Corridor to Gachibowli IT Parks",
  dispatchCorridorCopy:
    "Our Shaikpet Main Road workshop sits 4.8 km east of Gachibowli via Khajaguda and Bio-Diversity Junction—inside our strict 6 km free-first-visit service zone. Riders regularly service tech campuses around DLF Cybercity, IIIT Hyderabad Junction, Telecom Nagar, Indira Nagar, and Raidurg Metro without pulling developers or analysts out of sprint calls.",
  localInsightsTitle: "Built for US/UK Shift Schedules & Flagship Devices",
  localInsightsCopy:
    "Unlike traditional Gachibowli shops that shut at 9:00 PM, we stay active until 1:00 AM for night-shift teams needing urgent iPhone 15/16 Pro OLED replacements, Galaxy S23/S24 Ultra glass fixes, or Type-C fast-charging repairs before morning stand-ups. Corporate MFA/authenticator apps stay safe because we never ask for your screen unlock PIN.",
  localReview: {
    author: "Ananya S.",
    locality: "Telecom Nagar, Gachibowli",
    device: "iPhone 15 Pro • Screen & True Tone",
    quote:
      "Dropped my phone outside DLF Cybercity around 10:30 PM. The technician met me at my apartment gate in Telecom Nagar within 40 minutes and swapped the OLED panel live with True Tone intact.",
  },
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
        "Yes, Famous Mobiles is open until 1:00 AM every night. Whether you work US or UK shifts or have a late-evening emergency at 11:30 PM or 12:30 AM, our dispatch desk (+91 9063786751) is active.",
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
