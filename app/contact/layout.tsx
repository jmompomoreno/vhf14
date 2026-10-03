import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact VHF14",
  description: "Contact VHF14 about structured professional participation, port-call data, operational corrections and data governance.",
  alternates: { canonical: "/contact" },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
