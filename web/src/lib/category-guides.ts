// Buying guide and questions for each category (Phase 6 step 3). Shown on the category page and on every
// product page in it. Claims about Everest stay inside docs/content/verified-facts.md; the rest is general
// know-how. Model numbers come from the database, never from this file. No prices, no other brands.

import type { Faq } from "./service-pages";

export type CategoryGuide = {
  who: string; // one line: who buys this
  uses: string[]; // where it is used
  choose: { title: string; text: string }[]; // how to choose
  faq: Faq[];
  reviews: RegExp; // matches testimonials.product_mentioned
  services: { href: string; label: string }[];
};

const repair = { href: "/services/air-compressor-repair-and-servicing", label: "Repair and on-site servicing" };
const parts = { href: "/services/compressor-spare-parts", label: "Spare parts" };
const rent = { href: "/services/compressor-pallet-truck-stacker-on-rent", label: "On rent" };
const install = { href: "/services/air-compressor-installation", label: "Installation" };

export const categoryGuides: Record<string, CategoryGuide> = {
  "oil-free-silent-air-compressors": {
    who: "For clinics, labs, workshops, small factories and homes that need clean air with low noise.",
    uses: ["Dental and medical clinics", "Labs and testing", "Painting and spray work", "Air tools and tyre inflation", "Food packing and small production lines", "Home and hobby workshops"],
    choose: [
      { title: "Air delivery first", text: "Add up the air (LPM or CFM) your tools use at the same time and pick a compressor that gives more than that. Air delivery matters more than tank size." },
      { title: "Tank size", text: "A bigger tank smooths short bursts of use and lets the motor rest. It does not make more air." },
      { title: "Noise", text: "Silent oil-free units suit rooms where people work. Check the dB figure of each model in its table." },
      { title: "Power supply", text: "Check single phase or three phase, and the voltage, against your site supply." },
    ],
    faq: [
      { q: "What is an oil-free air compressor?", a: "A compressor whose pump runs without oil in the compression chamber, so the air carries no oil. It suits clinics, labs, painting and food work." },
      { q: "Does an oil-free compressor need oil changes?", a: "No oil changes in the pump. It still needs a clean intake filter and daily draining of water from the tank." },
      { q: "Which size do I need?", a: "Pick by the air your tools use (LPM or CFM) and the pressure (bar). Send us the tools you will run and we suggest a model." },
    ],
    reviews: /oil ?free|portable|silent/i,
    services: [repair, parts, install],
  },
  "dental-lab-air-compressors": {
    who: "For dental clinics and dental labs that need clean, dry, quiet air for chairs and lab work.",
    uses: ["Dental chairs", "Dental labs", "Small medical and lab equipment", "Clinics with more than one chair"],
    choose: [
      { title: "Chairs per compressor", text: "Each chair uses air when it runs. Tell us how many chairs run at the same time and we match the air delivery." },
      { title: "Clean, dry air", text: "Oil-free air is the norm for dental work. Drain the tank daily so water does not reach the handpieces." },
      { title: "Noise and place", text: "A quiet unit can sit closer to the clinic. Give it fresh air around it and room to service it." },
    ],
    faq: [
      { q: "Why do dental clinics use oil-free compressors?", a: "So no oil can reach the patient or the handpieces. Oil-free pumps compress air without oil in the chamber." },
      { q: "How often should I drain the tank?", a: "Every day. Water collects in every compressor tank and can reach the chair if it is not drained." },
      { q: "Can one compressor run two chairs?", a: "It depends on the model's air delivery. Tell us the number of chairs and we suggest the size." },
    ],
    reviews: /oil ?free|dental/i,
    services: [repair, parts, install],
  },
  "screw-air-compressors": {
    who: "For factories and workshops that use air all day.",
    uses: ["Production lines", "Fabrication and engineering shops", "Sandblasting and painting booths", "Plants that run several air tools at once"],
    choose: [
      { title: "Use all day or now and then", text: "Screw compressors suit long running hours. For short, now-and-then use, a reciprocating compressor is often enough." },
      { title: "Air and pressure", text: "Total the air of all machines that run together, add room for growth, and check the working pressure they need." },
      { title: "Tank and dryer", text: "A receiver tank steadies the pressure. An air dryer removes water where the air must be dry." },
      { title: "Space and supply", text: "Check three phase supply, floor space and fresh air for cooling." },
    ],
    faq: [
      { q: "Screw or reciprocating compressor?", a: "Screw compressors suit long, steady use. Reciprocating compressors suit shorter, on-off use and cost less to buy. Tell us your running hours and we suggest one." },
      { q: "What sizes do you have?", a: "Our screw compressors are listed by HP on this page with their specifications. Ask us for the one that fits your air need." },
      { q: "Do you install and service screw compressors?", a: "Installation is offered, and we do on-site repair and servicing." },
    ],
    reviews: /industrial|screw|^air compressor$/i,
    services: [install, repair, rent],
  },
  "reciprocating-compressors": {
    who: "For workshops, garages, small factories and service centres.",
    uses: ["Garages and tyre shops", "Air tools and spray painting", "Small production lines", "Service centres and workshops"],
    choose: [
      { title: "Air delivery and pressure", text: "Check the LPM or CFM and bar your tools need. Spray guns and grinders use more air than a tyre inflator." },
      { title: "Tank size", text: "A larger tank helps with short heavy use, such as spray painting. Many models come in several tank sizes." },
      { title: "On-off use", text: "Reciprocating compressors work best with rest between runs. For all-day use, look at screw compressors." },
    ],
    faq: [
      { q: "What is a reciprocating compressor?", a: "A piston compressor. A piston moves in a cylinder to squeeze air into a tank. It is simple, strong and easy to service." },
      { q: "Do you supply air receiver tanks?", a: "Yes, air receivers are in this category with their specifications." },
      { q: "How do I keep it running well?", a: "Drain the tank daily, keep the intake filter clean, check the oil level on oil-lubricated pumps, and check belts and leaks." },
    ],
    reviews: /reciprocating|air compressor$/i,
    services: [repair, parts, install],
  },
  "oil-free-compressor-motors": {
    who: "For compressor makers, dealers and workshops that build or repair oil-free compressors.",
    uses: ["Building oil-free compressors", "Replacing a worn motor unit", "Dealers who assemble their own units"],
    choose: [
      { title: "Match the air", text: "Each motor lists its power, air delivery (LPM or CFM) and pressure. Match these to the tank and the job." },
      { title: "Supply", text: "Check single phase or three phase and the voltage." },
      { title: "Fittings", text: "Each model's table lists what comes with it. Check it against your build." },
    ],
    faq: [
      { q: "Can I buy just the motor?", a: "Yes. These oil-free compressor motors are sold on their own, to end users and to dealers." },
      { q: "Do you sell to dealers?", a: "Yes. See the Dealers page or call us." },
    ],
    reviews: /oil ?free/i,
    services: [parts, repair],
  },
  "pallet-trucks": {
    who: "For warehouses, shops, factories and loading bays that move pallets by hand or with battery help.",
    uses: ["Warehouses and godowns", "Loading and unloading trucks", "Shop floors and stores", "Weighing loads while moving them (scale models)"],
    choose: [
      { title: "Load", text: "Pick a capacity above your heaviest pallet." },
      { title: "Fork width and length", text: "Measure your pallets. Fork spread and length must fit the pallet openings." },
      { title: "Hand or semi-electric", text: "Hand trucks suit short moves. Semi-electric trucks reduce effort for long or frequent moves." },
      { title: "Weighing", text: "A weighing-scale truck shows the load weight while you move it." },
    ],
    faq: [
      { q: "What capacity pallet truck do I need?", a: "One rated above your heaviest pallet. The capacity of each model is in its table." },
      { q: "Can I rent a pallet truck?", a: "Yes. Everest gives hand pallet trucks on rent." },
      { q: "How do I look after a hand pallet truck?", a: "Keep wheels clean, check for oil leaks at the pump, and do not load it above its capacity." },
    ],
    reviews: /pallet/i,
    services: [rent],
  },
  "stackers-and-lifting-tables": {
    who: "For warehouses and workshops that lift pallets onto racks or raise loads to working height.",
    uses: ["Stacking pallets on racks", "Loading machines at working height", "Stores and small warehouses"],
    choose: [
      { title: "Load and height", text: "Check the load at the height you need. Each model lists capacity and lift height." },
      { title: "Manual or powered", text: "Manual stackers suit light, short use. Semi-electric and electric stackers save effort for frequent lifts." },
      { title: "Table size", text: "For lifting tables, match the table size to the load you place on it." },
    ],
    faq: [
      { q: "What is the difference between a stacker and a lifting table?", a: "A stacker lifts pallets onto racks with forks. A lifting table raises a load on a flat table to a working height." },
      { q: "Can I rent a stacker?", a: "Yes. Everest gives stackers on rent." },
    ],
    reviews: /stacker|lift/i,
    services: [rent],
  },
};
