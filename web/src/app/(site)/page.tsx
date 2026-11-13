import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { ScrollFilm } from "@/components/ScrollFilm";
import { CategoryTile, ContactPanel, Photo, ReviewCard } from "@/components/ui";
import { getCategoryTiles, getProducts, getReviews, getSite } from "@/lib/data";
import { companyJsonLd, pageMeta } from "@/lib/seo";
import { whatsappLink } from "@/lib/site";

const storage = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/Product%20Images`;

const heroStats = [
  { value: "≤60 dB", label: "0.75 and 1 HP models" },
  { value: "8 bar", label: "Oil-free working pressure" },
  { value: "8–120 L", label: "Silent compressor tanks" },
  { value: "3 ton", label: "Pallet truck capacity" },
];

// Electric stacker EES-15-30, from the database specs.
const stackerStats = [
  { value: "1,500 kg", label: "Load capacity" },
  { value: "3,000 mm", label: "Lifting height" },
  { value: "24 V", label: "120 Ah battery" },
];

export const metadata: Metadata = {
  ...pageMeta({
    title: "Everest Hydro Pneumatic | Air Compressors, Pallet Trucks, Pune",
    description: "Oil-free silent, dental, screw and reciprocating air compressors, pallet trucks, stackers and lifting tables from Everest, Pimpri-Chinchwad. Get a quote.",
    path: "/",
  }),
  title: { absolute: "Everest Hydro Pneumatic | Air Compressors, Pallet Trucks, Pune" },
};

export default async function HomePage() {
  const [categories, products, reviews, site] = await Promise.all([getCategoryTiles(), getProducts(), getReviews(), getSite()]);
  const { ratings } = site;
  const buyers = [
    { title: "My business", text: "Quotes and full specs for your plant or clinic.", href: "/contact", dark: true },
    { title: "My home or workshop", text: "One unit, the right size. Ask us on WhatsApp.", href: whatsappLink(site.whatsappNumber), dark: false },
    { title: "My dealership", text: "Stock Everest. Talk to us about trade supply.", href: "/dealers", dark: false },
  ];

  const proof = [
    { title: `Since ${site.established}`, text: "Based in Pimpri-Chinchwad, Maharashtra" },
    { title: "Maker and supplier", text: "Manufacturer, dealer and direct supply" },
    { title: "IndiaMART TrustSEAL", text: `${ratings.google.score} from ${ratings.google.count} Google reviews` },
    { title: "GST registered", text: site.gstin },
  ];

  return (
    <>
      <JsonLd data={companyJsonLd(site)} />
      {/* Hero: title, buttons, both machines and the numbers fit one screen. */}
      <section className="page flex flex-col overflow-hidden pb-6 pt-3 md:min-h-[calc(100svh-92px)] md:max-h-[880px] md:pb-8 md:pt-4">
        <div className="grid flex-1 items-center gap-5 md:grid-cols-[0.8fr_1.2fr] md:gap-8">
          <div>
            <h1 className="display whitespace-nowrap text-[clamp(42px,4.7vw,76px)] font-extrabold leading-[0.95]">
              <span className="rise rise-1 block">Quiet power.</span>
              <span className="rise rise-2 block">Clean air.</span>
            </h1>
            <p className="rise rise-3 mt-4 max-w-[420px] text-[17px] text-muted md:text-xl">
              Supplied direct to factories, clinics, dealers and homes.
            </p>
            <div className="rise rise-3 mt-5 flex flex-wrap gap-3 md:mt-7">
              <a href="#categories" className="btn btn-primary">See the products</a>
              <a href={whatsappLink(site.whatsappNumber)} className="btn btn-outline">WhatsApp us</a>
            </div>
          </div>
          {/* Pallet truck rolls in from the left, compressor from the right. */}
          <div className="relative aspect-[1.75/1] w-full">
            <div
              aria-hidden="true"
              className="shadow-in absolute inset-x-[2%] bottom-[1%] h-[14%] rounded-[50%] bg-[radial-gradient(closest-side,rgba(17,19,22,0.10),transparent)]"
            />
            <Link prefetch={false} href="/categories/pallet-trucks" className="absolute bottom-0 left-[-2%] block w-[66%]">
              <Photo
                priority
                src="/img/hero-pallet-truck.webp"
                srcSet="/img/hero-pallet-truck-600.webp 600w, /img/hero-pallet-truck.webp 1200w"
                sizes="(min-width: 900px) 45vw, 66vw"
                alt="Everest yellow hydraulic hand pallet truck"
                className="on-ground roll-left h-auto w-full"
              />
            </Link>
            <Link prefetch={false} href="/products/2-hp-50l-portable-oil-free-silent-air-compressor" className="absolute bottom-[-1%] right-[-4%] block w-[44%]">
              <Photo
                priority
                src="/img/hero-compressor.webp"
                srcSet="/img/hero-compressor-600.webp 600w, /img/hero-compressor.webp 1200w"
                sizes="(min-width: 900px) 30vw, 44vw"
                alt="Everest 2 HP 50 litre portable oil-free silent air compressor"
                className="on-ground roll-right h-auto w-full"
              />
            </Link>
          </div>
        </div>
        <dl className="rise rise-4 mt-4 grid grid-cols-2 gap-x-5 gap-y-3 border-t border-line pt-4 md:mt-6 md:grid-cols-4 md:pt-5">
          {heroStats.map((s) => (
            <div key={s.value}>
              <dt className="sr-only">{s.label}</dt>
              <dd className="display tabular text-[22px] font-bold leading-tight md:text-[30px]">{s.value}</dd>
              <dd className="text-[14px] text-muted md:text-[15px]">{s.label}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="page section pb-6">
        <h2 className="display section-title">See how it is built.</h2>
        <p className="mt-3 max-w-[520px] text-muted">Scroll slowly. Each machine opens part by part, then closes again.</p>
      </section>
      <ScrollFilm
        name="pallet"
        kicker="Material handling"
        title="Hand pallet truck"
        quoteHref="/contact"
        parts={[
          { name: "Load rollers", from: 0.8 },
          { name: "Steering wheels", from: 1.5 },
          { name: "Handle", from: 2.3 },
          { name: "Hydraulic pump", from: 3.1 },
          { name: "Pump ram", from: 5.0 },
        ]}
      />
      <ScrollFilm
        name="compressor"
        kicker="Air compressors"
        title="Portable air compressor"
        quoteHref="/contact"
        parts={[
          { name: "Push handle", from: 0.8 },
          { name: "Pressure switch", from: 1.3 },
          { name: "Head covers", from: 2.0 },
          { name: "Cylinder heads", from: 2.5 },
          { name: "Motor", from: 3.3 },
          { name: "Pistons", from: 3.6 },
        ]}
      />

      <section id="categories" className="page section scroll-mt-4">
        <h2 className="display section-title mb-6">
          {categories.length} categories. {products.length} models.
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category, i) => (
            <CategoryTile key={category.name} category={category} wide={i === 0} />
          ))}
        </div>
      </section>

      <section className="page section">
        <h2 className="display section-title mb-6">Who are you buying for?</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {buyers.map((buyer) => (
            <a
              key={buyer.title}
              href={buyer.href}
              className={`tile block rounded-card p-6 md:p-7 ${buyer.dark ? "on-ink bg-ink text-white" : "bg-surface"}`}
            >
              <h3 className="display card-title">{buyer.title}</h3>
              <p className={`mt-2 ${buyer.dark ? "text-muted-on-dark" : "text-muted"}`}>{buyer.text}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="page section">
        <div className="on-ink grid items-center gap-8 rounded-panel bg-ink p-7 text-white md:grid-cols-2 md:p-16">
          <div>
            <p className="display text-[clamp(68px,10vw,136px)] font-extrabold leading-none">≤60 dB</p>
            <p className="mt-2 text-muted-on-dark">On our 0.75 and 1 HP models.</p>
            <h2 className="display mt-4 text-[clamp(26px,3vw,38px)] font-bold leading-tight">
              Made for rooms where people work.
            </h2>
            <p className="mt-3 max-w-[460px] text-muted-on-dark">Oil-free air for clinics, labs and workshops.</p>
          </div>
          <Link prefetch={false} href="/products/0-75hp-25l-dental-air-compressor" className="tile block rounded-card bg-surface p-4">
            <Photo src={`${storage}/dental-000.webp`} alt="Everest 0.75 HP 25 litre dental air compressor" className="h-auto w-full" />
          </Link>
        </div>
      </section>

      <section className="page pt-4">
        <div className="grid items-center overflow-hidden rounded-panel bg-surface md:grid-cols-2">
          <div className="p-7 md:p-16">
            <p className="text-[15px] font-semibold text-brand">Electric stackers</p>
            <h2 className="display mt-2 text-[clamp(38px,5vw,68px)] font-extrabold leading-none">
              Lift 1,500 kg to 3 metres.
            </h2>
            <p className="mt-4 max-w-[440px] text-muted">
              Battery-powered lifting. Semi electric and manual stackers too.
            </p>
            <dl className="mt-6 grid grid-cols-3 gap-4">
              {stackerStats.map((s) => (
                <div key={s.value}>
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="display tabular text-[22px] font-bold leading-tight md:text-[28px]">{s.value}</dd>
                  <dd className="text-[14px] text-muted">{s.label}</dd>
                </div>
              ))}
            </dl>
            <Link prefetch={false} href="/categories/stackers-and-lifting-tables" className="btn btn-dark mt-7">
              See stackers and lifting tables
            </Link>
          </div>
          <Link prefetch={false} href="/products/electric-stacker-ees-15-30" className="block">
            <Photo
              src={`${storage}/estacker-024.webp`}
              alt="Everest electric stacker EES-15-30"
              className="h-auto w-full object-contain p-4 md:p-8"
            />
          </Link>
        </div>
      </section>

      <section className="page section">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {proof.map((item) => (
            <div key={item.title}>
              <p className="display text-[22px] font-bold">{item.title}</p>
              <p className="mt-1 text-muted">{item.text}</p>
            </div>
          ))}
        </div>
        <h2 className="display section-title mb-5 mt-12">
          Rated {ratings.indiamart.score} / 5 from {ratings.indiamart.count} IndiaMART reviews.
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {reviews.slice(0, 3).map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
        <Link prefetch={false} href="/reviews" className="btn btn-outline mt-5">All reviews</Link>
      </section>

      <ContactPanel />
    </>
  );
}
