import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Track Repair Booking — Famous Mobiles",
  description:
    "Track live technician arrival and repair progress for your Famous Mobiles doorstep or walk-in smartphone repair order.",
  alternates: {
    canonical: "https://famousmobiles.com/track-booking",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function TrackBookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
