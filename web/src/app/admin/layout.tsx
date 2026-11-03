import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";

// The admin panel runs in the browser and is never indexed.
export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Everest admin" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
