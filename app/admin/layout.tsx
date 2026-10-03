import type { Metadata } from "next";
import { NativeLink as Link } from "../native-link";

export const metadata: Metadata = {
  title: "Administration",
  robots: { index: false, follow: false, noarchive: true },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <><nav className="adminSectionNav" aria-label="Administration"><Link href="/admin">Verification</Link><Link href="/admin/users">Users &amp; Profiles</Link></nav>{children}</>;
}
