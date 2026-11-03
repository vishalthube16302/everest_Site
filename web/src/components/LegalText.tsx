import { PageTitle } from "@/components/ui";

// Wording comes unchanged from the live site, stored in src/content/legal.json.
export function LegalText({ title, rows }: { title: string; rows: string[][] }) {
  return (
    <section className="page">
      <div className="max-w-[760px]">
        <PageTitle title={title} />
        <div className="mt-6 space-y-3 text-muted">
          {rows
            .filter(([tag]) => tag !== "h1")
            .map(([tag, text]) => {
              if (tag === "h2") return <h2 key={text} className="pt-4 text-xl font-semibold text-ink">{text}</h2>;
              if (tag === "h3") return <h3 key={text} className="font-semibold text-ink">{text}</h3>;
              if (tag === "li") return <p key={text} className="pl-4">• {text}</p>;
              return <p key={text}>{text}</p>;
            })}
        </div>
      </div>
    </section>
  );
}
