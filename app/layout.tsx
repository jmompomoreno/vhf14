import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://vhf14.com"),
  title: {
    default: "VHF14 | Port Operations Intelligence & Verified Port Call Data",
    template: "%s | VHF14",
  },
  description: "Port operations intelligence from verified professional reports by VTS, pilots, tug operators, terminals, port agents and ship crews.",
  applicationName: "VHF14",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: "https://vhf14.com",
    siteName: "VHF14",
    title: "VHF14 | Port Operations Intelligence & Verified Port Call Data",
    description: "Port operations intelligence from verified professional reports by VTS, pilots, tug operators, terminals, port agents and ship crews.",
  },
  twitter: {
    card: "summary",
    title: "VHF14 | Port Operations Intelligence & Verified Port Call Data",
    description: "Port operations intelligence from verified professional reports by VTS, pilots, tug operators, terminals, port agents and ship crews.",
  },
  icons: {
    icon: [{ url: "/vhf14-icon.svg", type: "image/svg+xml" }],
    shortcut: "/vhf14-icon.svg",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": "https://vhf14.com/#website",
                  url: "https://vhf14.com/",
                  name: "VHF14",
                  description: "Port operations intelligence and verified port-call data built from traceable professional reports.",
                  inLanguage: "en",
                },
                {
                  "@type": "WebApplication",
                  "@id": "https://vhf14.com/#application",
                  name: "VHF14",
                  url: "https://vhf14.com/",
                  applicationCategory: "BusinessApplication",
                  operatingSystem: "Web",
                  isAccessibleForFree: true,
                  description: "Structured port-call timelines for VTS, pilots, tug crews, mooring crews, terminals, agents and ship teams.",
                  contactPoint: {
                    "@type": "ContactPoint",
                    email: "contact@vhf14.com",
                    contactType: "customer support",
                  },
                },
              ],
            }),
          }}
        />
        {children}
      </body>
    </html>
  );
}
