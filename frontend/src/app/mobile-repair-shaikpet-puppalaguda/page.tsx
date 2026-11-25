import React from "react";
import { Metadata } from "next";
import NeighborhoodLandingTemplate, {
  NeighborhoodConfig,
} from "@/components/NeighborhoodLandingTemplate";

export const metadata: Metadata = {
  title: "Mobile Repair in Shaikpet & Puppalaguda | Open Till 1 AM Hub",
  description:
    "Famous Mobiles flagship store at Opp Friends Colony Bus Stop, Shaikpet Main Road, Puppalaguda. 10–15 min doorstep & walk-in repair open 10 AM to 1 AM! Call +91 9063786751.",
  keywords: [
    "mobile repair Shaikpet",
    "phone repair Puppalaguda",
    "mobile repair Puppalaguda Main Road",
    "mobile repair OU Colony",
    "mobile shop open till 1 AM Shaikpet",
    "Famous Mobiles Shaikpet",
  ],
  alternates: {
    canonical: "https://famousmobiles.com/mobile-repair-shaikpet-puppalaguda",
  },
  openGraph: {
    title: "Mobile Repair in Shaikpet & Puppalaguda | Open Till 1 AM Hub",
    description:
      "Physical repair hub & express doorstep dispatch across Shaikpet, Puppalaguda, and OU Colony. Open 10 AM to 1 AM daily.",
    url: "https://famousmobiles.com/mobile-repair-shaikpet-puppalaguda",
  },
};

const SHAIKPET_PUPPALAGUDA_CONFIG: NeighborhoodConfig = {
  slug: "mobile-repair-shaikpet-puppalaguda",
  name: "Shaikpet & Puppalaguda",
  subTitle: "Flagship Physical Workshop & 10–15 Min Zone",
  distanceFromStore: "0.2 km",
  eta: "10-15 Mins",
  heroHeadline: "Express Mobile Repair in Shaikpet & Puppalaguda (Open Till 1 AM)",
  heroDescription:
    "Visit our physical repair lab located directly Opp Friends Colony Bus Stop on Shaikpet Main Road, Puppalaguda—or book immediate 10–15 minute doorstep dispatch across OU Colony, Friends Colony, and Shaikpet Flyover. Open every single day until 1:00 AM.",
  dispatchCorridorTitle: "Walk-In Lab Advantage on Shaikpet Main Road",
  dispatchCorridorCopy:
    "Unlike online-only repair aggregators without a street address, Shaikpet and Puppalaguda residents can walk straight into our counter opposite Friends Colony Bus Stop. Our lab houses ultrasonic chemical cleaning baths for monsoon water damage, microscope stations for motherboard IC soldering, and OEM display bonding tools—meaning complex board and green-line fixes happen right on site.",
  localInsightsTitle: "Instant 10-Minute Doorstep & Counter Turnaround in OU Colony",
  localInsightsCopy:
    "Because our rider fleet starts at Shaikpet Main Road, homes and offices in OU Colony, Al-Saba Residency, and Puppalaguda Royal Palms receive priority 10–15 minute pickup. Walk-in customers routinely wait 20–30 minutes at our counter while watching the battery swap or display transfer happen transparently.",
  localReview: {
    author: "Dr. Srinivas Rao",
    locality: "OU Colony, Shaikpet",
    device: "Vivo X90 Pro • OS Recovery",
    quote:
      "Phone was stuck in an endless reboot loop after an Android update. Famous Mobiles recovered the bootloader without losing my contacts or hospital data. Highly recommended local shop.",
  },
  showWorkshopMap: true,
  landmarks: [
    "Opp Friends Colony Bus Stop",
    "Shaikpet Main Road",
    "Puppalaguda Junction",
    "Shaikpet Flyover Entry",
    "OU Colony Main Road",
  ],
  gatedSocieties: [
    "Friends Colony Enclave",
    "Puppalaguda Royal Palms",
    "OU Colony Officers Quarters",
    "Al-Saba Residency",
  ],
  popularRepairs: [
    {
      title: "Walk-In 30-Minute Screen Replacement",
      description:
        "Watch our master technicians fix cracked glass or AMOLED display right at our Shaikpet counter.",
      time: "30 Mins",
      warranty: "Up to 6 Months Warranty",
      tag: "Flagship Hub",
    },
    {
      title: "OnePlus Green Line Repair",
      description:
        "Specialized display bonding and screen replacement for OnePlus 8/9/10/11 series phones.",
      time: "40 Mins",
      warranty: "Up to 6 Months Warranty",
      tag: "Specialized",
    },
    {
      title: "Quick Battery Health Swap",
      description:
        "Tested OEM-grade batteries for iPhone, OnePlus, and Xiaomi with zero data reset required.",
      time: "15 Mins",
      warranty: "Up to 8 Months Warranty",
    },
    {
      title: "Motherboard Diagnostics & Liquid Treatment",
      description:
        "In-store ultrasonic chemical bath and microscopic chip inspection for wet or dead smartphones.",
      time: "60-90 Mins",
      warranty: "Store Lab Only",
    },
  ],
  faqs: [
    {
      question: "Where is the Famous Mobiles store located in Shaikpet / Puppalaguda?",
      answer:
        "Our physical store and lab is located at Opp Friends Colony Bus Stop, Shaikpet Main Road, Puppalaguda, Manikonda, Hyderabad 500089. Walk-in customers have easy roadside access.",
    },
    {
      question: "How quickly can your technician reach me in Shaikpet or Puppalaguda?",
      answer:
        "Because this is our base hub, doorstep dispatch takes only 10 to 15 minutes across Puppalaguda, Shaikpet Main Road, and OU Colony.",
    },
    {
      question: "Can I bring my phone for late-night repair at 11:30 PM or 12:30 AM?",
      answer:
        "Yes! We are open every single night until 1:00 AM. You can walk in directly or call +91 9063786751 for doorstep technician arrival.",
    },
    {
      question: "Are parts covered by an authentic warranty?",
      answer:
        "Yes, all screens carry up to 6 Months Warranty and batteries carry up to 8 Months Warranty with physical and digital warranty receipts.",
    },
  ],
};

export default function ShaikpetPuppalagudaPage() {
  return <NeighborhoodLandingTemplate config={SHAIKPET_PUPPALAGUDA_CONFIG} />;
}
