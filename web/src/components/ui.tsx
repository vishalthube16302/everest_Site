import Link from "next/link";
import { getSite, keySpecs, type CategoryTile as CategoryTileData, type Product, type Review, type SpecRow } from "@/lib/data";
import { whatsappLink } from "@/lib/site";

export function Photo({
  src,
  alt,
  className = "",
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <img
      src={src}
      alt={alt}
      width={1200}
      height={900}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : undefined}
      className={className}
    />
  );
}

export function PageTitle({ title, intro }: { title: string; intro?: string }) {
  return (
    <div className="pt-6 md:pt-10">
      <h1 className="display section-title">{title}</h1>
      {intro && <p className="mt-3 max-w-[60ch] text-muted">{intro}</p>}
    </div>
  );
}

export function StatBlock({ value, label, dark = false }: { value: string; label: string; dark?: boolean }) {
  return (
    <div>
      <p className="display tabular text-[28px] font-bold leading-tight md:text-[40px]">{value}</p>
      <p className={`mt-1 text-[15px] ${dark ? "text-muted-on-dark" : "text-muted"}`}>{label}</p>
    </div>
  );
}

// One category tile. The whole card is one link.
export function CategoryTile({ category, wide = false }: { category: CategoryTileData; wide?: boolean }) {
  return (
    <div className={`tile relative flex flex-col rounded-card bg-surface p-5 md:p-6 ${wide ? "sm:col-span-2" : ""}`}>
      <h3 className="display card-title">
        <Link prefetch={false} href={category.href} className="after:absolute after:inset-0 after:rounded-card">
          {category.name}
        </Link>
      </h3>
      <p className="mt-1 text-[15px] text-muted">
        {category.count} {category.count === 1 ? "model" : "models"}
      </p>
      {category.image && (
        <Photo
          src={category.image}
          alt=""
          className={`on-ground pointer-events-none mt-auto h-auto w-full object-contain pt-3 ${wide ? "sm:mx-auto sm:max-w-[62%]" : ""}`}
        />
      )}
    </div>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const specs = keySpecs(product, 2);
  return (
    <Link prefetch={false} href={`/products/${product.slug}`} className="tile flex flex-col rounded-card bg-surface p-5">
      {product.image_url && <Photo src={product.image_url} alt={product.name} className="h-auto w-full object-contain" />}
      <h3 className="mt-3 font-semibold leading-snug">{product.name}</h3>
      {specs.length > 0 && (
        <p className="mt-1 text-[15px] text-muted">{specs.map((s) => `${s.label}: ${s.value}`).join(" · ")}</p>
      )}
    </Link>
  );
}

export function ReviewCard({ review }: { review: Review }) {
  return (
    <figure className="m-0 rounded-card bg-surface p-6 md:p-7">
      <blockquote className="text-lg leading-snug md:text-[19px]">&ldquo;{review.content}&rdquo;</blockquote>
      <figcaption className="mt-3 text-[15px] text-muted">
        {review.author_name}
        {review.author_company ? `, ${review.author_company}` : ""}, on {review.source}
      </figcaption>
    </figure>
  );
}

const headCell = "border border-ink px-3 py-[6px] text-left font-semibold";
const labelCell = "border border-line-strong px-3 py-[5px] text-left align-top font-normal text-muted";
const valueCell = "tabular border border-line-strong px-3 py-[5px] align-top font-semibold";

// One Parameter / Value table. On wide screens a long list is split into two side-by-side
// pairs, like a spec sheet, so photos, every spec and the buttons fit one screen.
export function SpecTable({ rows }: { rows: SpecRow[] }) {
  if (rows.length === 0) return <p className="text-muted">Ask us for the full specifications.</p>;
  const split = rows.length > 8;
  const half = Math.ceil(rows.length / 2);
  return (
    <>
      <table className={`w-full border-collapse bg-surface text-[14px] ${split ? "lg:hidden" : ""}`}>
        <thead>
          <tr className="bg-ink text-[12px] uppercase tracking-[0.06em] text-white">
            <th scope="col" className={`w-1/2 ${headCell}`}>Parameter</th>
            <th scope="col" className={`w-1/2 ${headCell}`}>Value</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="even:bg-ground">
              <th scope="row" className={labelCell}>{row.label}</th>
              <td className={valueCell}>{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {split && (
        <table className="hidden w-full border-collapse bg-surface text-[13px] lg:table">
          <thead>
            <tr className="bg-ink text-[11px] uppercase tracking-[0.06em] text-white">
              <th className={`w-[30%] ${headCell}`}>Parameter</th>
              <th className={`w-[20%] ${headCell}`}>Value</th>
              <th className={`w-[30%] ${headCell}`}>Parameter</th>
              <th className={`w-[20%] ${headCell}`}>Value</th>
            </tr>
          </thead>
          <tbody>
            {rows.slice(0, half).map((row, i) => {
              const other = rows[i + half];
              return (
                <tr key={row.label} className="even:bg-ground">
                  <th className={labelCell}>{row.label}</th>
                  <td className={valueCell}>{row.value}</td>
                  <th className={labelCell}>{other?.label ?? ""}</th>
                  <td className={valueCell}>{other?.value ?? ""}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </>
  );
}

export function PriceBlock({ price }: { price: string | null }) {
  return price ? (
    <p className="display tabular text-[28px] font-bold">{price}</p>
  ) : (
    <p className="text-muted">Price on request</p>
  );
}

export async function ContactPanel({ productName }: { productName?: string }) {
  const site = await getSite();
  return (
    <section className="page section">
      <div className="on-ink flex flex-wrap items-center justify-between gap-7 rounded-panel bg-brand p-8 text-white md:p-16">
        <div>
          <h2 className="display section-title">Tell us what you need.</h2>
          <p className="mt-3 text-lg">We reply within 24 hours.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a href={whatsappLink(site.whatsappNumber, productName)} className="btn btn-white">WhatsApp us</a>
          <a href={site.phoneHref} className="btn btn-outline-white tabular">{site.phoneDisplay}</a>
        </div>
      </div>
    </section>
  );
}
