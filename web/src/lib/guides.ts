// Buying and care guides (Phase 6 step 4). Plain know-how that answers what people ask Google and AI chat.
// Claims about Everest stay inside docs/content/verified-facts.md. No prices, no other brands.

import type { Faq } from "./service-pages";

export type Guide = {
  slug: string;
  title: string;
  description: string;
  answer: string; // the short answer, first on the page
  sections: { h: string; p: string[] }[];
  faq: Faq[];
  links: { href: string; label: string }[];
};

export const guides: Guide[] = [
  {
    slug: "what-size-air-compressor-do-i-need",
    title: "What size air compressor do I need?",
    description: "How to size an air compressor: add up the air your tools use (LPM or CFM), check the pressure in bar, then pick the tank. A simple guide from Everest, Pune.",
    answer: "Add up the air (LPM or CFM) of every tool that runs at the same time, add about a quarter for leaks and growth, and choose a compressor that delivers at least that at the pressure (bar) your tools need. Tank size comes last.",
    sections: [
      { h: "1. Air delivery (LPM or CFM)", p: ["Every air tool uses a set amount of air, shown as LPM (litres per minute) or CFM (cubic feet per minute). 1 CFM is about 28.3 LPM.", "Add the tools that run together, not every tool you own. Then add about 25% so the compressor is not running flat out."] },
      { h: "2. Pressure (bar)", p: ["Most air tools work at 6 to 7 bar, so a compressor rated 8 bar covers them. Some jobs need more. Check the tool's label."] },
      { h: "3. Tank size", p: ["The tank stores air for short bursts and lets the motor rest. A bigger tank does not make more air. Spray painting and sandblasting benefit from a bigger tank."] },
      { h: "4. How long it runs", p: ["For on-off use, a reciprocating or oil-free piston compressor is usually enough. For air all day, a screw compressor suits better."] },
      { h: "5. Power supply", p: ["Smaller units run on single phase. Larger units need three phase. Check your site supply before you buy."] },
    ],
    faq: [
      { q: "Is HP enough to size a compressor?", a: "No. Two compressors with the same HP can deliver different air. Compare air delivery (LPM or CFM) at the pressure you need." },
      { q: "What size compressor for a dental chair?", a: "It depends on the chair. Tell us how many chairs run together and we suggest a model." },
    ],
    links: [
      { href: "/categories/oil-free-silent-air-compressors", label: "Oil-free silent compressors" },
      { href: "/categories/reciprocating-compressors", label: "Reciprocating compressors" },
      { href: "/categories/screw-air-compressors", label: "Screw compressors" },
    ],
  },
  {
    slug: "oil-free-vs-oil-lubricated-air-compressor",
    title: "Oil-free vs oil-lubricated air compressor",
    description: "Oil-free or oil-lubricated compressor? Oil-free gives air without oil for clinics, labs, food and painting; oil-lubricated suits heavy workshop use.",
    answer: "Choose oil-free when the air touches people, food, medicine or paint, or when you want less upkeep. Choose oil-lubricated for heavy workshop use where a little oil in the air does not matter.",
    sections: [
      { h: "Oil-free", p: ["The pump compresses air without oil in the chamber, so the air carries no oil from the pump.", "Suits dental and medical clinics, labs, food packing, painting and electronics. No oil to check or change in the pump."] },
      { h: "Oil-lubricated", p: ["Oil lubricates and cools the pump. These pumps are common in garages and workshops.", "Needs oil level checks and oil changes. Fit filters if the air must be clean."] },
      { h: "Cost over time", p: ["An oil-lubricated pump needs oil and oil filters. An oil-free pump skips these, but its parts are designed for its duty, so pick the size that fits your air use and do not overrun it."] },
      { h: "Which one for which job", p: ["Dental chair, lab, food packing, painting: oil-free.", "Garage, tyre shop, fabrication, heavy air tools: either works; oil-lubricated is common.", "Air all day in a factory: a screw compressor."] },
      { h: "Both need", p: ["Daily draining of water from the tank, a clean intake filter, and a check for leaks."] },
    ],
    faq: [
      { q: "Is oil-free air also dry air?", a: "No. Oil-free means no oil from the pump. Water still forms in the tank, so drain it daily, and use an air dryer where dry air is needed." },
      { q: "Which is quieter?", a: "It depends on the model. Check the dB figure. Our silent oil-free models list their noise in the specifications." },
    ],
    links: [
      { href: "/categories/oil-free-silent-air-compressors", label: "Oil-free silent compressors" },
      { href: "/categories/dental-lab-air-compressors", label: "Dental and lab compressors" },
      { href: "/categories/reciprocating-compressors", label: "Reciprocating compressors" },
    ],
  },
  {
    slug: "air-compressor-maintenance-checklist",
    title: "Air compressor maintenance checklist",
    description: "Daily, weekly and monthly air compressor checks: drain the tank, clean the filter, check oil, belts, leaks and the safety valve. From Everest, Pune.",
    answer: "Drain the tank every day, clean or change the intake filter regularly, check oil on oil-lubricated pumps, look for leaks, and test the safety valve. Book a service when you see a change in noise, pressure or fill time.",
    sections: [
      { h: "Every day", p: ["Drain water from the tank.", "Listen for leaks and unusual noise.", "Check the pressure gauge reaches its normal cut-out."] },
      { h: "Every week", p: ["Clean the intake filter, more often in dusty places.", "Check the oil level on oil-lubricated pumps.", "Check belt tension on belt-driven units."] },
      { h: "Every month", p: ["Test the safety valve by pulling its ring briefly.", "Check pipes, hoses and joints for leaks with soapy water.", "Clean cooling fins so the pump does not overheat."] },
      { h: "Every year", p: ["Get a full service: valves, piston rings or rotor condition, motor, pressure switch, safety valve, pipes and tank inspection.", "Replace worn hoses, gaskets and filters before they fail in the middle of a job."] },
      { h: "Keep a log", p: ["Note the date of each drain, filter change, oil change and service. A log shows when fill time or running hours start to change, which is the first sign of wear."] },
      { h: "Call for service when", p: ["It takes longer to fill, trips, gets very hot, shows oil in the air, or makes a new noise."] },
    ],
    faq: [
      { q: "Why drain the tank every day?", a: "Compressing air squeezes out water, which collects in the tank. Left there, it rusts the tank and reaches your tools." },
      { q: "Do you service compressors on site?", a: "Yes. Everest offers on-site repair and servicing. Call or WhatsApp +91 88558 20105." },
    ],
    links: [
      { href: "/services/air-compressor-repair-and-servicing", label: "Repair and servicing" },
      { href: "/services/compressor-spare-parts", label: "Spare parts" },
    ],
  },
  {
    slug: "why-air-compressor-will-not-start",
    title: "Why will my air compressor not start?",
    description: "Air compressor not starting? Check power, the pressure switch, tank pressure, the starter or capacitor, and motor protection. When to call for repair.",
    answer: "Most often the tank is still above cut-in pressure, the power or breaker is off, the pressure switch or capacitor has failed, or the motor's thermal protection has tripped. Check the simple things first, then call for repair.",
    sections: [
      { h: "Check first", p: ["Is there power at the socket and is the breaker on?", "Is the tank still full? The compressor starts only when pressure falls below cut-in.", "Has the motor overheated? Many motors have thermal protection. Let it cool for 30 minutes."] },
      { h: "Common faults", p: ["Pressure switch: contacts worn or stuck.", "Capacitor or starter fault on single phase motors: the motor hums but does not turn.", "Unloader valve stuck: the motor tries to start against full pressure.", "Low voltage at the site, often with long, thin extension cables."] },
      { h: "Stop and call", p: ["If you smell burning, see sparks, or the breaker trips again, switch off and call for repair."] },
    ],
    faq: [
      { q: "My compressor hums but does not start. Why?", a: "Often a failed capacitor, a stuck unloader valve, or low voltage. Switch off to protect the motor and get it checked." },
      { q: "Can you repair it at my site?", a: "Yes. Everest offers on-site repair. Call or WhatsApp +91 88558 20105 with the model and the problem." },
    ],
    links: [
      { href: "/services/air-compressor-repair-and-servicing", label: "Repair and servicing" },
      { href: "/services/compressor-spare-parts", label: "Spare parts" },
    ],
  },
  {
    slug: "how-to-choose-a-pallet-truck",
    title: "How to choose a pallet truck",
    description: "Choose a pallet truck by load capacity, fork width and length, lift height, wheel type and hand or semi-electric drive. Everest, Pimpri-Chinchwad, Pune.",
    answer: "Pick a capacity above your heaviest pallet, match fork width and length to your pallets, and choose hand or semi-electric by how far and how often you move loads. Add a weighing scale if you weigh goods as you move them.",
    sections: [
      { h: "Capacity", p: ["Choose a rating above your heaviest pallet. Overloading wears the pump and wheels."] },
      { h: "Forks", p: ["Measure your pallet openings. Fork spread (outside width) and length must fit them."] },
      { h: "Wheels", p: ["PU wheels are quiet and kind to floors. Nylon wheels roll easily on rough floors."] },
      { h: "Hand or semi-electric", p: ["A hand truck suits short moves. A semi-electric truck drives itself, which helps on long or frequent moves."] },
      { h: "Floor and space", p: ["Check the floor is smooth and the aisles are wide enough for the turning radius listed in each model's table. Ramps and rough floors need more effort and better wheels."] },
      { h: "Care", p: ["Do not load above capacity, keep the wheels free of strapping and debris, and check the pump for oil leaks. Lower the forks fully when parked."] },
      { h: "Weighing scale", p: ["A scale pallet truck shows the load weight while you move it, so you skip a trip to a floor scale."] },
    ],
    faq: [
      { q: "Can I rent a pallet truck?", a: "Yes. Everest gives hand pallet trucks and stackers on rent." },
      { q: "Pallet truck or stacker?", a: "A pallet truck lifts just off the floor to move loads. A stacker lifts pallets up onto racks." },
    ],
    links: [
      { href: "/categories/pallet-trucks", label: "Pallet trucks" },
      { href: "/categories/stackers-and-lifting-tables", label: "Stackers and lifting tables" },
      { href: "/services/compressor-pallet-truck-stacker-on-rent", label: "On rent" },
    ],
  },
];

// Glossary: short, exact definitions AI answers can quote.
export const glossary: { term: string; text: string }[] = [
  { term: "CFM", text: "Cubic feet per minute. How much air a compressor delivers. 1 CFM is about 28.3 LPM." },
  { term: "LPM", text: "Litres per minute. Air delivery in metric units. 100 LPM is about 3.5 CFM." },
  { term: "Bar", text: "Unit of pressure. 1 bar is about 14.5 PSI. Most air tools work at 6 to 7 bar." },
  { term: "PSI", text: "Pounds per square inch. 116 PSI is about 8 bar." },
  { term: "dB", text: "Decibels, a measure of noise. Every 10 dB lower sounds about half as loud." },
  { term: "Duty cycle", text: "The share of time a compressor can run without overheating. Piston units need rest; screw units are built to run long hours." },
  { term: "Oil-free", text: "A pump that compresses air without oil in the chamber, so the air carries no oil from the pump." },
  { term: "Reciprocating compressor", text: "A piston compressor. A piston moves in a cylinder to push air into a tank." },
  { term: "Screw compressor", text: "Two meshing rotors squeeze air continuously. Suits long, steady use." },
  { term: "Air receiver", text: "A tank that stores compressed air and steadies the pressure." },
  { term: "Air dryer", text: "Removes water vapour from compressed air where dry air is needed." },
  { term: "Cut-in and cut-out pressure", text: "The compressor starts at cut-in pressure and stops at cut-out pressure, set by the pressure switch." },
  { term: "Pallet truck", text: "A hand or powered truck with forks that lifts a pallet just off the floor to move it." },
  { term: "Stacker", text: "A truck with a mast that lifts pallets up to rack height." },
  { term: "Lifting table", text: "A table that raises a load to a working height." },
];
