import Link from "next/link";
import { SiteFrame } from "@/components/SiteFrame";
import { PageTitle } from "@/components/ui";

export default function NotFound() {
  return (
    <SiteFrame>
      <section className="page pb-10">
        <PageTitle title="Page not found." intro="This page does not exist or has moved." />
        <div className="mt-6 flex flex-wrap gap-3">
          <Link prefetch={false} href="/products" className="btn btn-primary">See all products</Link>
          <Link prefetch={false} href="/" className="btn btn-outline">Go to the home page</Link>
          <Link prefetch={false} href="/contact" className="btn btn-outline">Contact us</Link>
        </div>
      </section>
    </SiteFrame>
  );
}
