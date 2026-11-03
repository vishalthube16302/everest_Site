import type { Metadata } from "next";
import { LegalText } from "@/components/LegalText";
import legal from "@/content/legal.json";

export const metadata: Metadata = { title: "Terms & Conditions" };

export default function TermsPage() {
  return <LegalText title="Terms & Conditions" rows={legal.terms} />;
}
