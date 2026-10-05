import type { Metadata } from "next";
import { NativeLink as Link } from "../native-link";

export const metadata: Metadata = {
  title: "Administration",
  robots: { index: false, follow: false, noarchive: true },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <><nav className="adminSectionNav" aria-label="Administration"><Link href="/admin">Operations &amp; Verification</Link><Link href="/admin/users">Users &amp; Profiles</Link><Link href="/admin/audit">Audit Log</Link></nav>{children}</>;
}
