import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your VHF14 account.",
  robots: { index: false, follow: false, noarchive: true },
};

export default function SignInLayout({ children }: { children: React.ReactNode }) {
  return children;
}
