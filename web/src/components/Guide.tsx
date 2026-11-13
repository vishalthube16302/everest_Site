import Link from "next/link";
import { FaqList, ReviewCard } from "@/components/ui";
import type { Review } from "@/lib/data";
import type { CategoryGuide } from "@/lib/category-guides";
import type { Faq } from "@/lib/service-pages";

// Reviews that name this kind of product, word for word, at most three.
export function matchingReviews(reviews: Review[], guide: CategoryGuide | undefined, max = 3) {
  if (!guide) return [];
  return reviews.filter((r) => r.product_mentioned && guide.reviews.test(r.product_mentioned.trim())).slice(0, max);
}

// Buying guide block shared by category and product pages: uses, how to choose, reviews, questions, services.
export function GuideSections({ guide, name, faq, reviews }: { guide: CategoryGuide; name: string; faq: Faq[]; reviews: Review[] }) {
  return (
    <>
      <section className="page section">
        <div className="grid gap-4 md:grid-cols-[0.8fr_1.2fr]">
          <div className="on-ink rounded-card bg-ink p-6 text-white md:p-8">
            <h2 className="display card-title">Who it is for</h2>
            <p className="mt-3 text-muted-on-dark">{guide.who}</p>
            <h3 className="mt-6 font-semibold">Where it is used</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-on-dark">
              {guide.uses.map((u) => (
                <li key={u}>{u}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-card bg-surface p-6 md:p-8">
            <h2 className="display card-title">How to choose {name.toLowerCase()}</h2>
            <dl className="mt-4 space-y-4">
              {guide.choose.map((c) => (
                <div key={c.title}>
                  <dt className="font-semibold">{c.title}</dt>
                  <dd className="mt-1 text-muted">{c.text}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-5 flex flex-wrap gap-x-5">
              {guide.services.map((s) => (
                <Link key={s.href} prefetch={false} href={s.href} className="inline-block py-2 font-semibold text-brand hover:underline">{s.label} →</Link>
              ))}
              <Link prefetch={false} href="/guides" className="inline-block py-2 font-semibold text-brand hover:underline">Buying guides →</Link>
            </p>
          </div>
        </div>
      </section>

      {reviews.length > 0 && (
        <section className="page section">
          <h2 className="display section-title mb-6">What customers say.</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {reviews.map((r) => (
              <ReviewCard key={r.id} review={r} />
            ))}
          </div>
          <Link prefetch={false} href="/reviews" className="mt-4 inline-block py-2 font-semibold hover:text-brand">All reviews →</Link>
        </section>
      )}

      <section className="page section">
        <h2 className="display section-title mb-6">Questions.</h2>
        <FaqList faq={faq} />
      </section>
    </>
  );
}
