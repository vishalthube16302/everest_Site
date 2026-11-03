import type { Metadata } from "next";
import { ContactPanel, PageTitle, ReviewCard, StatBlock } from "@/components/ui";
import { getReviews, getSite } from "@/lib/data";

export const metadata: Metadata = { title: "Reviews" };

export default async function ReviewsPage() {
  const [reviews, { ratings }] = await Promise.all([getReviews(), getSite()]);
  return (
    <>
      <section className="page">
        <PageTitle title="What customers say" />
        <div className="mt-6 grid max-w-[640px] grid-cols-2 gap-5">
          <StatBlock value={`${ratings.google.score} / 5`} label={`${ratings.google.count} Google reviews`} />
          <StatBlock value={`${ratings.indiamart.score} / 5`} label={`${ratings.indiamart.count} IndiaMART reviews`} />
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => <ReviewCard key={review.id} review={review} />)}
        </div>
      </section>
      <ContactPanel />
    </>
  );
}
