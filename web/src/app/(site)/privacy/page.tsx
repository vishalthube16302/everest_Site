import type { Metadata } from "next";
import { LegalText } from "@/components/LegalText";
import legal from "@/content/legal.json";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return <LegalText title="Privacy Policy" rows={legal.privacy} />;
}
