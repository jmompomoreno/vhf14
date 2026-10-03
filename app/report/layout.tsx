import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Report a Port Call Event",
  description: "Submit an observed or estimated UTC port-call event to VHF14 through a structured professional reporting workflow.",
  alternates: { canonical: "/report" },
};

export default function ReportLayout({ children }: { children: React.ReactNode }) {
  return children;
}
