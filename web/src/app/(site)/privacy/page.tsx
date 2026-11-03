import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { LegalText } from "@/components/LegalText";
import legal from "@/content/legal.json";

export const metadata: Metadata = pageMeta({ title: "Privacy Policy", description: "How Everest Hydro Pneumatic Solutions handles the details you share with us.", path: "/privacy" });

export default function PrivacyPage() {
  return <LegalText title="Privacy Policy" rows={legal.privacy} />;
}
