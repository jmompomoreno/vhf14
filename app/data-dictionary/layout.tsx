import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Port Call Data Dictionary",
  description: "Definitions used by VHF14 for port-call milestones, time bases, evidence status and data visibility.",
  alternates: { canonical: "/data-dictionary" },
};

export default function DataDictionaryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
