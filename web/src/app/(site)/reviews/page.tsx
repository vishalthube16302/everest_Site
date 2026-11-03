import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { ContactPanel, PageHero, ReviewCard } from "@/components/ui";
import { getReviews, getSite } from "@/lib/data";

export const metadata: Metadata = pageMeta({ title: "Customer reviews", description: "What customers say about Everest, with reviews from IndiaMART.", path: "/reviews" });

export default async function ReviewsPage() {
  const [reviews, { ratings }] = await Promise.all([getReviews(), getSite()]);
  const scores = [
    { score: ratings.google.score, label: `${ratings.google.count} Google reviews`, dark: true },
    { score: ratings.indiamart.score, label: `${ratings.indiamart.count} IndiaMART reviews`, dark: false },
  ];
  return (
    <>
      <section className="page">
        <PageHero kicker="Reviews" title="What customers say" intro="Reviews from our customers." />
        <div className="mt-8 grid max-w-[760px] grid-cols-1 gap-4 sm:grid-cols-2">
          {scores.map((s) => (
            <div key={s.label} className={`rounded-card p-6 md:p-7 ${s.dark ? "on-ink bg-ink text-white" : "bg-surface"}`}>
              <p className="display tabular text-[clamp(44px,5vw,64px)] font-extrabold leading-none">
                {s.score}
                <span className={`ml-1 text-[22px] font-bold ${s.dark ? "text-muted-on-dark" : "text-muted"}`}>/ 5</span>
              </p>
              <p className={`mt-2 ${s.dark ? "text-muted-on-dark" : "text-muted"}`}>{s.label}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => <ReviewCard key={review.id} review={review} />)}
        </div>
      </section>
      <ContactPanel />
    </>
  );
}
