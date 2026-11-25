import React from "react";
import { Metadata } from "next";
import NeighborhoodLandingTemplate, {
  NeighborhoodConfig,
} from "@/components/NeighborhoodLandingTemplate";

export const metadata: Metadata = {
  title: "Mobile Repair in Narsingi & Kokapet | Doorstep Pickup (Till 1 AM)",
  description:
    "Express doorstep phone repair in Narsingi, Kokapet & My Home Avatar. Open 10 AM to 1 AM daily! 60-min screen, battery & camera fix. Call +91 9063786751.",
  keywords: [
    "mobile repair Narsingi",
    "doorstep mobile repair Kokapet",
    "My Home Avatar mobile repair",
    "iPhone screen repair Narsingi",
    "Samsung repair Kokapet",
    "mobile repair GAR Infobahn",
  ],
  alternates: {
    canonical: "https://famousmobiles.com/mobile-repair-narsingi-kokapet",
  },
  openGraph: {
    title: "Mobile Repair in Narsingi & Kokapet | Doorstep Pickup (Till 1 AM)",
    description:
      "Rapid doorstep smartphone repair across Narsingi, Kokapet, and high-rise communities like My Home Avatar. Open 10 AM to 1 AM.",
    url: "https://famousmobiles.com/mobile-repair-narsingi-kokapet",
  },
};

const NARSINGI_KOKAPET_CONFIG: NeighborhoodConfig = {
  slug: "mobile-repair-narsingi-kokapet",
  name: "Narsingi & Kokapet",
  subTitle: "High-Rise Towers, ORR Exit & GAR Infobahn Zone",
  distanceFromStore: "3.7 km",
  eta: "30-40 Mins",
  heroHeadline: "Doorstep Mobile Repair in Narsingi & Kokapet (Open Till 1 AM)",
  heroDescription:
    "Living in My Home Avatar, NCC Urban One, Jayabheri The Peak, or working near Kokapet Golden Mile & GAR Infobahn? Skip Outer Ring Road traffic—our certified mobile technician reaches your tower lobby in 30–40 minutes with OEM screens, batteries, and precision tools.",
  dispatchCorridorTitle: "Puppalaguda – Narsingi Junction & Golden Mile Dispatch",
  dispatchCorridorCopy:
    "At just 3.7 km west of our Puppalaguda hub along the Narsingi–Puppalaguda link road, Narsingi and Kokapet high-rise communities enjoy fast two-wheeler dispatch even during peak ORR rush hours. For multi-tower complexes like My Home Avatar (22 towers) and Aparna CyberLife, riders coordinate tower-specific lobby handoffs via WhatsApp and MyGate.",
  localInsightsTitle: "Top Smartphone Repairs in Kokapet & Narsingi High-Rises",
  localInsightsCopy:
    "Residents along Kokapet Golden Mile and Neopolis approaches frequently book rear camera sapphire glass replacements, OnePlus green-line AMOLED swaps, and BIS-certified battery replacements for overheating phones. Simple hardware fixes happen right at your dining table or tower lounge; ultrasonic liquid recovery uses free round-trip workshop pickup.",
  localReview: {
    author: "Karthik Reddy",
    locality: "Alkapoor / Narsingi Corridor",
    device: "OnePlus 11 • Charging Port Inspection",
    quote:
      "Super transparent service. The technician inspected the port with a microscope tool and showed me that it only had compacted pocket lint. Cleaned it up without charging for part replacement. Very honest!",
  },
  landmarks: [
    "Narsingi Main Junction",
    "My Home Avatar Community",
    "GAR Infobahn Tech Park",
    "Kokapet Golden Mile Road",
    "Gandipet ORR Exit",
  ],
  gatedSocieties: [
    "My Home Avatar (22 Towers)",
    "NCC Urban One",
    "Jayabheri The Peak",
    "Vertex Panache",
    "Aparna CyberLife",
  ],
  popularRepairs: [
    {
      title: "Doorstep Screen Replacement (iPhone & Pixel)",
      description:
        "High-definition OLED display panels with scratch-resistant glass and complete touch calibration.",
      time: "35 Mins",
      warranty: "Up to 6 Months Warranty",
      tag: "High Demand",
    },
    {
      title: "OnePlus Green Line & Display Swap",
      description:
        "Fast resolution for display lines, black screen, or touch unresponsiveness across OnePlus and Xiaomi models.",
      time: "40 Mins",
      warranty: "Up to 6 Months Warranty",
    },
    {
      title: "High-Drain Battery Replacement",
      description:
        "Certified BIS batteries solving sudden shutdowns, slow charging, and battery swelling issues.",
      time: "20 Mins",
      warranty: "Up to 8 Months Warranty",
      tag: "Long Life",
    },
    {
      title: "Camera Lens & Glass Fix",
      description:
        "Replace scratched or shattered back camera lenses without needing expensive camera module changes.",
      time: "25 Mins",
      warranty: "3 Months Warranty",
    },
  ],
  faqs: [
    {
      question: "Do your riders provide doorstep service to My Home Avatar in Puppalaguda / Narsingi?",
      answer:
        "Yes! Our technicians visit My Home Avatar and surrounding Narsingi towers daily. We are fully equipped with MyGate entry credentials for rapid access.",
    },
    {
      question: "How long does round-trip doorstep repair take for Narsingi & Kokapet?",
      answer:
        "For on-site repairs (screens, batteries, charging ports), our technician arrives in 30 to 40 minutes and completes the service in 30 minutes right in front of you. Round-trip lab pickups take 2 to 3 hours.",
    },
    {
      question: "What are your operating hours in Narsingi & Kokapet?",
      answer:
        "We operate daily from 10:00 AM to 1:00 AM past midnight, 7 days a week. Late-night emergency requests are accepted via phone or WhatsApp at +91 9063786751.",
    },
    {
      question: "Is there a doorstep fee for Narsingi residents?",
      answer:
        "Your first home visit is 100% FREE (₹0)! If subsequent visits are required, the nominal ₹69 visit fee is 100% deducted from your repair bill if you proceed.",
    },
  ],
};

export default function NarsingiKokapetPage() {
  return <NeighborhoodLandingTemplate config={NARSINGI_KOKAPET_CONFIG} />;
}
