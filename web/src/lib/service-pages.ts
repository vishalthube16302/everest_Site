// Service pages (Phase 6 step 2). Claims about Everest stay inside docs/content/verified-facts.md.
// General advice (how compressors work, what to check) is plain know-how, not a claim about us.
// No prices, no response times, no warranty, no AMC: none of these are approved.

export type Faq = { q: string; a: string };

export type ServicePage = {
  slug: string;
  name: string; // short name for cards and breadcrumbs
  title: string; // page <title> and h1
  description: string; // meta description, under 160 characters
  answer: string; // direct answer at the top: who, what, where
  serviceType: string; // schema.org Service type
  points: { title: string; text: string }[];
  ask: string[]; // what to tell us for a quick quote
  links: { href: string; label: string }[];
  faq: Faq[];
  whatsapp: string; // first line of the WhatsApp message
};

const place = "Pimpri-Chinchwad, Pune";

export const servicePages: ServicePage[] = [
  {
    slug: "air-compressor-repair-and-servicing",
    name: "Repair and servicing",
    title: "Air compressor repair and on-site servicing in Pune",
    description: "On-site air compressor repair and servicing from Everest in Pimpri-Chinchwad, Pune. Spare parts supplied. Call or WhatsApp +91 88558 20105.",
    answer: `Everest repairs and services air compressors on site, from our base in ${place}. Call or WhatsApp us with the model and the problem, and we tell you the next step.`,
    serviceType: "Air compressor repair and servicing",
    points: [
      { title: "On-site repair", text: "We come to your factory, workshop or clinic, find the fault and fix it there when we can." },
      { title: "Servicing", text: "Regular checks keep a compressor running: air filter, oil (for oil-lubricated units), drain valve, belts, pressure switch and safety valve." },
      { title: "Spare parts", text: "We supply spare parts, so a repair does not wait on a part from somewhere else." },
    ],
    ask: [
      "Compressor type: oil-free, reciprocating or screw",
      "Power (HP or kW) and tank size, from the nameplate",
      "What happens: will not start, low pressure, noise, oil in the air, trips, leaks",
      "Your site address",
    ],
    links: [
      { href: "/services/compressor-spare-parts", label: "Compressor spare parts" },
      { href: "/categories/reciprocating-compressors", label: "Reciprocating compressors" },
      { href: "/categories/screw-air-compressors", label: "Screw air compressors" },
    ],
    faq: [
      { q: "Do you repair air compressors at my site?", a: "Yes. Everest offers on-site compressor repair and servicing. Call or WhatsApp +91 88558 20105 with your address and the problem." },
      { q: "Why will my air compressor not start?", a: "Common causes are no power or a tripped breaker, a faulty pressure switch, a starter or capacitor fault, a tank that is still full, or a motor fault. Switch it off and call us if a basic check does not show the cause." },
      { q: "Why does my compressor take too long to fill?", a: "Usually an air leak, a blocked intake filter, worn valves or rings, or more air demand than the compressor can supply. A check on site finds which one." },
      { q: "How much does a repair cost?", a: "It depends on the fault and the parts. Tell us the model and what is wrong, and we give you a quote." },
      { q: "Where are you based?", a: "PAP G-64, Ajantha Nagar, Kasturi Market, Chikhali Akurdi Rd, Thermax Chauk, Pimpri-Chinchwad, Maharashtra 411019. Open Monday to Saturday, 9:00 AM to 7:30 PM." },
    ],
    whatsapp: "Hello Everest, I need compressor repair or servicing.",
  },
  {
    slug: "compressor-pallet-truck-stacker-on-rent",
    name: "On rent",
    title: "Air compressors, pallet trucks and stackers on rent in Pune",
    description: "Rent large air compressors, hand pallet trucks and stackers from Everest, Pimpri-Chinchwad, Pune. Tell us what you need and for how long.",
    answer: `Everest gives large air compressors, hand pallet trucks and stackers on rent, from ${place}. Tell us what you need, where and for how long, and we send a quote.`,
    serviceType: "Equipment rental",
    points: [
      { title: "Large air compressors", text: "For a project, a shutdown, a breakdown cover or a short peak in air demand." },
      { title: "Hand pallet trucks", text: "For moving pallets in a warehouse, shop floor or loading bay without a forklift." },
      { title: "Stackers", text: "For lifting pallets onto racks when you need it for a season or a project." },
    ],
    ask: [
      "What you need: compressor, hand pallet truck or stacker",
      "For a compressor: air needed (CFM or LPM) and pressure (bar), if you know it",
      "For a pallet truck or stacker: load in kg, and lift height for a stacker",
      "Start date, how long, and the site address",
    ],
    links: [
      { href: "/categories/pallet-trucks", label: "Pallet trucks" },
      { href: "/categories/stackers-and-lifting-tables", label: "Stackers and lifting tables" },
      { href: "/categories/screw-air-compressors", label: "Screw air compressors" },
    ],
    faq: [
      { q: "What can I rent from Everest?", a: "Large air compressors, hand pallet trucks and stackers." },
      { q: "How long can I rent for?", a: "Tell us the dates you need and we quote for that period." },
      { q: "Should I rent or buy a compressor?", a: "Renting suits a short job, a breakdown or a trial of the size you need. If you need air every day for years, buying usually costs less over time. We can quote both." },
      { q: "Do you also sell pallet trucks and stackers?", a: "Yes. See our pallet trucks and stackers pages for models and specifications." },
    ],
    whatsapp: "Hello Everest, I would like equipment on rent.",
  },
  {
    slug: "second-hand-air-compressors",
    name: "Second-hand compressors",
    title: "Second-hand air compressors in Pune",
    description: "Second-hand air compressors for sale from Everest, Pimpri-Chinchwad, Pune. Tell us the size you need and we tell you what is available.",
    answer: `Everest sells second-hand air compressors from ${place}. Stock changes, so call or WhatsApp us with the size you need and we tell you what is available.`,
    serviceType: "Used air compressor sales",
    points: [
      { title: "Lower cost", text: "A used compressor can suit a workshop or a second line where a new one is not needed." },
      { title: "Service and parts nearby", text: "We also repair and service compressors and supply spare parts." },
      { title: "New if you prefer", text: "If nothing used fits, we can quote a new Everest compressor of the right size." },
    ],
    ask: [
      "Air needed (CFM or LPM) and pressure (bar), or the tools you will run",
      "Power supply: single phase or three phase",
      "Oil-free or oil-lubricated",
      "Your town",
    ],
    links: [
      { href: "/categories/reciprocating-compressors", label: "New reciprocating compressors" },
      { href: "/categories/oil-free-silent-air-compressors", label: "New oil-free silent compressors" },
      { href: "/services/air-compressor-repair-and-servicing", label: "Repair and servicing" },
    ],
    faq: [
      { q: "Do you sell used air compressors?", a: "Yes. Everest sells second-hand air compressors. Stock changes, so ask us what is available now." },
      { q: "What should I check in a used compressor?", a: "Running hours, how fast it fills the tank, oil in the air or leaks, tank condition, noise, and that the safety valve and pressure switch work. See it run before you buy." },
      { q: "Used or new: which is better?", a: "Used costs less to buy. New suits daily heavy use and a clinic or lab that needs clean, oil-free air. Tell us the job and we suggest both options." },
    ],
    whatsapp: "Hello Everest, I am looking for a second-hand air compressor.",
  },
  {
    slug: "compressor-spare-parts",
    name: "Spare parts",
    title: "Air compressor spare parts in Pune",
    description: "Air compressor spare parts from Everest, Pimpri-Chinchwad, Pune. Send the model or a photo of the part on WhatsApp and we check it for you.",
    answer: `Everest supplies air compressor spare parts from ${place}. Send the model and a photo of the part on WhatsApp, and we check it for you.`,
    serviceType: "Air compressor spare parts",
    points: [
      { title: "Send a photo", text: "A photo of the old part and the compressor nameplate is the quickest way to match a part." },
      { title: "Fitting", text: "We also repair and service compressors on site, so we can fit the part for you." },
      { title: "Motors", text: "Oil-free compressor motors are in our catalogue with full specifications." },
    ],
    ask: [
      "Compressor model, power and tank size (nameplate photo)",
      "Photo of the part you need",
      "How many you need",
      "Your town, for delivery",
    ],
    links: [
      { href: "/categories/oil-free-compressor-motors", label: "Oil-free compressor motors" },
      { href: "/services/air-compressor-repair-and-servicing", label: "Repair and servicing" },
    ],
    faq: [
      { q: "Do you sell compressor spare parts?", a: "Yes. Everest supplies spare parts for air compressors. Send the model and a photo of the part on WhatsApp +91 88558 20105." },
      { q: "Which parts wear out first?", a: "Air filters, valves, piston rings, gaskets, belts, drain valves and pressure switches wear with use. Oil-lubricated units also need oil and oil filters." },
      { q: "Can you fit the part?", a: "Yes. We offer on-site repair and servicing." },
    ],
    whatsapp: "Hello Everest, I need a compressor spare part.",
  },
  {
    slug: "air-compressor-installation",
    name: "Installation",
    title: "Air compressor installation in Pune",
    description: "Air compressor installation from Everest, Pimpri-Chinchwad, Pune. Installation and nearby delivery offered with your purchase.",
    answer: `Everest installs the air compressors we supply, and offers nearby delivery, from ${place}. Tell us your site and we plan it with you.`,
    serviceType: "Air compressor installation",
    points: [
      { title: "Delivery", text: "Nearby delivery is offered. Ask us for delivery further away." },
      { title: "Placement", text: "A compressor needs a firm level floor, fresh air around it and room to service it. We help you choose the spot." },
      { title: "First run", text: "Before the first start, the power supply, pressure settings and pipe joints should be checked. Ask us to go through the daily checks with your team." },
    ],
    ask: [
      "Which compressor you are buying or already have",
      "Power supply: single phase or three phase",
      "Where it will stand and how far the air must go",
      "Your site address",
    ],
    links: [
      { href: "/products", label: "All products" },
      { href: "/services/air-compressor-repair-and-servicing", label: "Repair and servicing" },
    ],
    faq: [
      { q: "Do you install the compressor?", a: "Yes. Installation and nearby delivery are offered. Ask us about your site." },
      { q: "Where should a compressor stand?", a: "On a firm level floor, in a dry place with fresh air, away from heat and dust, with space on all sides to service it." },
      { q: "What should I check every day?", a: "Drain water from the tank, listen for leaks, check the pressure gauge, and for oil-lubricated units check the oil level." },
    ],
    whatsapp: "Hello Everest, I need compressor installation.",
  },
];

// Service areas listed on our Google Business Profile (owner, checked 2026-11-13).
export const serviceAreas = [
  "Pimpri-Chinchwad",
  "Pune",
  "Mumbai",
  "Raigad",
  "Nashik",
  "Satara",
  "Solapur",
  "Ahilyanagar",
  "Chhatrapati Sambhajinagar",
  "Beed",
  "Latur",
];
