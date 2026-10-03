import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Beta and Port Call Contribution Credits",
  description: "Join the VHF14 free beta, contribute verified port-call events and build contribution credits for future platform access.",
  alternates: { canonical: "/pricing" },
};

export default function BetaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
