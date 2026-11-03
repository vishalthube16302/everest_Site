import Link from "next/link";
import { SiteFrame } from "@/components/SiteFrame";
import { PageTitle } from "@/components/ui";

export default function NotFound() {
  return (
    <SiteFrame>
      <section className="page pb-10">
        <PageTitle title="Page not found." intro="This page does not exist or has moved." />
        <Link prefetch={false} href="/products" className="btn btn-primary mt-6">See all products</Link>
      </section>
    </SiteFrame>
  );
}
