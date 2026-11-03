import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { LegalText } from "@/components/LegalText";
import legal from "@/content/legal.json";

export const metadata: Metadata = pageMeta({ title: "Terms & Conditions", description: "Terms of use for the Everest Hydro Pneumatic Solutions website.", path: "/terms" });

export default function TermsPage() {
  return <LegalText title="Terms & Conditions" rows={legal.terms} />;
}
