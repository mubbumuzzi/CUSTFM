import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book Doorstep Mobile Repair — Free First Home Visit",
  description:
    "Book a 30–60 minute doorstep mobile repair in Manikonda, Shaikpet, Puppalaguda & Gachibowli. First home visit ₹0 free. Open 10 AM – 1 AM daily.",
  alternates: {
    canonical: "https://famousmobiles.com/book-repair",
  },
};

export default function BookRepairLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
