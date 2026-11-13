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
  steps: { title: string; text: string }[]; // how it works, plain steps
  more: { h: string; p: string }[]; // extra know-how for this service
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
    steps: [
      { title: "Tell us", text: "Call or WhatsApp with the compressor type, a nameplate photo, what is going wrong and your address." },
      { title: "We check", text: "We look at the fault on site and tell you what needs repair or which part has to change." },
      { title: "Quote and repair", text: "You get the price before the work. Parts we supply are fitted on site when possible." },
      { title: "Keep it running", text: "We tell you the daily and weekly checks that stop the same fault coming back." },
    ],
    more: [
      { h: "Signs your compressor needs service", p: "It takes longer to fill the tank, the motor trips or gets very hot, there is oil or water in the air, a new knocking or hissing noise, the pressure does not reach its normal cut-out, or the safety valve lets air out. Any of these is a reason to call before a small fault becomes a bigger repair." },
      { h: "Oil-free, reciprocating and screw compressors", p: "Oil-free pumps need clean filters and checks on valves and seals. Oil-lubricated reciprocating pumps also need oil changes and belt checks. Screw compressors need regular filter, oil and separator service on running hours. Tell us which type you have so we come prepared." },
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
      { q: "Do you service screw compressors too?", a: "Yes. Tell us the HP and running hours, and we plan the service." },
      { q: "How often should a compressor be serviced?", a: "Daily drain and weekly filter checks by your team, plus a full service at least once a year, or sooner with heavy use or dust." },
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
    steps: [
      { title: "Tell us what you need", text: "Equipment, load or air need, start date, how long and the site address." },
      { title: "Quote", text: "We confirm what is available and send a quote for that period." },
      { title: "Delivery and start", text: "Nearby delivery is offered. We agree the handover with you." },
      { title: "Return or extend", text: "Tell us early if the job runs longer and we quote the extra time." },
    ],
    more: [
      { h: "Sizing a rental compressor", p: "Add up the air (CFM or LPM) of the tools that run together and add about a quarter for leaks. Check the pressure in bar your tools need. Sandblasting, painting booths and several grinders at once need much more air than a single tool. If you are unsure, tell us the tools and we suggest a size." },
      { h: "Choosing a rental pallet truck or stacker", p: "Check the heaviest pallet, your pallet size, and for a stacker the top rack height. Smooth floors suit standard wheels. Tell us about ramps or rough floors." },
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
      { q: "Can I rent a compressor for a breakdown?", a: "Yes. A rental compressor can keep the plant running while your own compressor is repaired. We also repair compressors on site." },
      { q: "What do I need to tell you for a quote?", a: "What you need, the load or air need, the dates and the site address." },
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
    steps: [
      { title: "Tell us the job", text: "The tools you will run, the pressure, your power supply and your town." },
      { title: "We check stock", text: "Second-hand stock changes, so we tell you what is available now." },
      { title: "See it run", text: "Ask to see the compressor running before you decide." },
      { title: "Service and parts", text: "We repair and service compressors and supply spare parts after you buy." },
    ],
    more: [
      { h: "Who buys a second-hand compressor", p: "Small workshops, garages, tyre shops and plants that need a second or standby compressor often choose used. For daily heavy use, or clean air for a clinic or lab, a new oil-free or screw compressor may suit better." },
      { h: "Running costs matter too", p: "A compressor's power bill over a year can be more than its price. Compare the air it delivers (CFM or LPM) against its motor power, and check for leaks in your pipes, which waste air whatever compressor you buy." },
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
      { q: "Can I see the compressor before buying?", a: "Ask us. We suggest seeing any used compressor run before you buy." },
      { q: "Do you service the second-hand compressors you sell?", a: "We repair and service air compressors on site and supply spare parts." },
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
    steps: [
      { title: "Send details", text: "Model, power, tank size and a photo of the old part on WhatsApp." },
      { title: "We match it", text: "We check the part against your compressor and tell you what fits." },
      { title: "Quote", text: "You get the price for the part, and for fitting if you want it." },
      { title: "Delivery or fitting", text: "Nearby delivery is offered, or we fit it during an on-site repair." },
    ],
    more: [
      { h: "Common compressor spare parts", p: "Air filter elements, valve plates and reed valves, piston rings, gaskets, belts, pressure switches, safety valves, drain valves, check valves, unloader valves, capacitors, gauges and couplings. Oil-lubricated pumps also use oil and oil filters." },
      { h: "Why the nameplate matters", p: "Parts differ between models of the same power. The nameplate shows model, power, pressure and voltage, which is what we need to match the right part the first time." },
    ],
    links: [
      { href: "/categories/oil-free-compressor-motors", label: "Oil-free compressor motors" },
      { href: "/services/air-compressor-repair-and-servicing", label: "Repair and servicing" },
    ],
    faq: [
      { q: "Do you sell compressor spare parts?", a: "Yes. Everest supplies spare parts for air compressors. Send the model and a photo of the part on WhatsApp +91 88558 20105." },
      { q: "Which parts wear out first?", a: "Air filters, valves, piston rings, gaskets, belts, drain valves and pressure switches wear with use. Oil-lubricated units also need oil and oil filters." },
      { q: "Can you fit the part?", a: "Yes. We offer on-site repair and servicing." },
      { q: "Do you have motors for oil-free compressors?", a: "Yes. Our oil-free compressor motors are listed in the catalogue with full specifications." },
      { q: "What if I do not know the model?", a: "Send photos of the compressor, its nameplate and the part. We work it out from there." },
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
    steps: [
      { title: "Plan", text: "Tell us the compressor, your power supply and where it will stand." },
      { title: "Delivery", text: "Nearby delivery is offered. Ask us for places further away." },
      { title: "Install", text: "We place and connect the compressor and set it up for the first run." },
      { title: "Hand over", text: "Ask us to show your team the daily checks." },
    ],
    more: [
      { h: "Choosing the spot", p: "A compressor needs a firm level floor, fresh cool air, and space around it for cooling and service. Keep it away from dust, rain and heat. A short, wide main pipe with few bends loses less pressure than a long thin one." },
      { h: "Power supply", p: "Small compressors run on single phase. Larger ones need three phase with the right cable size and protection. Check this before the compressor arrives." },
    ],
    links: [
      { href: "/products", label: "All products" },
      { href: "/services/air-compressor-repair-and-servicing", label: "Repair and servicing" },
    ],
    faq: [
      { q: "Do you install the compressor?", a: "Yes. Installation and nearby delivery are offered. Ask us about your site." },
      { q: "Where should a compressor stand?", a: "On a firm level floor, in a dry place with fresh air, away from heat and dust, with space on all sides to service it." },
      { q: "What should I check every day?", a: "Drain water from the tank, listen for leaks, check the pressure gauge, and for oil-lubricated units check the oil level." },
      { q: "Do you install compressors bought elsewhere?", a: "Ask us with the model and your site details." },
      { q: "Is installation free?", a: "Installation is offered. Ask for the price with your quote." },
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
