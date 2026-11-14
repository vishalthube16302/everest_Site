# Sales plan (war room, 2026-11-14)

Made by 4 expert agents (local search, conversion, content, sales channels) and 1 red-team agent, from live data.
Status: point 5 (website change) built on branch `feature/sales-quick-wins` (2026-11-14). The rest waits for the owner. Record each approved item in `../DECISIONS.md`.

## What the data says

| Channel | Numbers | Source |
|---|---|---|
| Google profile (Maps and Search) | 4,033 views, 347 calls, chats, directions and site visits (Jun to mid-Nov 2026). Top searches: "compressor" 239, "air compressor" 153, "air compressor machine" 70 | Profile Performance, 2026-11-14 |
| Website | 89 visitors in 28 days; 5 quote, 3 WhatsApp, 2 call taps | GA4, Oct 17 to Nov 13 |
| Google search for the website | 142 clicks in 7 months, almost all for the name "everest" | Search Console |
| Buying searches in Pune | Page 1 is IndiaMART, Justdial, TradeIndia and other directories | Agent web check |

**Main point:** sales come from the Google profile, IndiaMART and Justdial, not from the website. So the plan is: lose no lead
that already comes, get more reviews, and be listed where buyers already look. The website turns those visitors into chats and calls.

## Next 30 days (owner about 2 hours a week)

1. **Lead safety.** Owner, 30 min. Send one test enquiry from a phone and find it in Salesforce. Turn on an email alert
   for each new lead. Log in to Salesforce at least every 30 days: the form runs on a free Developer Edition org, and
   Salesforce closes idle orgs and later deletes them. Call back missed calls at lunch and at closing time.
2. **Google profile.** Owner 20 min, or Claude in the owner's browser. Cut the service area from all of Maharashtra to
   about 2 hours' drive (Google rule). Add a tracking tag to the website link
   (`?utm_source=google&utm_medium=organic&utm_campaign=gbp`). Check the name (see Owner decisions).
3. **Reviews from every customer.** Claude makes a QR card and one neutral message; owner sends it after every sale,
   repair and rental. Also message last year's buyers once about service, spares and rental, with the review link.
   Ask everyone, never only happy customers, and do not tell people what to write (Google policy).
4. **IndiaMART and Justdial.** Claude writes the texts; owner adds listings for repair, compressor on rent, pallet truck
   and stacker on rent, second-hand and spare parts (own photos, no other brand). Fix the Justdial Chakan address, add
   the website link, rename the two pallet listings that show another brand. Reply to every IndiaMART enquiry the
   same working day. Ask every caller "Where did you find us?"
5. **One small website change.** Built 2026-11-14 (branch `feature/sales-quick-wins`), owner approves the PR:
   - Call button in the phone bar and on product pages
   - WhatsApp and Call above the slow enquiry form on the contact page
   - Contact panel at the end of product pages
   - WhatsApp messages name the model and say "(website)"
   - "Get latest price on WhatsApp" in place of "Price on request"

## Later (months 2 to 3), only after the 30 days

- WhatsApp Business: greeting and away messages, quick replies (/price /rent /repair /dealer /review), labels by source.
- Website: split the rent page (compressor vs pallet truck and stacker); comparison tables on category pages
  (HP, tank, LPM, bar, dB, phase); dealer page as "Manufacturer and trade supply"; real lead tracking in GA4.
- Dealer kit (catalogue PDF without prices, share images, films) and 20 dealer calls outside Pune.
- QR service sticker on every machine sold or repaired; 1 to 2 WhatsApp broadcasts a month to saved contacts.
- Google Ads test for repair and rent searches only, once lead tracking works. Google's ad credit needs spend first.
- YouTube for the 6 films (owner skipped it before; the content agent would bring it back).

## Owner decisions

- **Google profile name.** Google shows "EVEREST Air Compressor & Material Handling Equipment". If the shop board does not
  say this, a rival can report it and Google can suspend the profile, which hides all reviews. Keep it only if the board matches.
- **Pneumatic fittings and hoses.** Google shows Everest for "pneumatic parts / fittings near me". Do you sell them?
- **Prices.** Optional 6-week test: show the price on 1 or 2 models (for example the 1 HP motor) with the admin switch.

## "Hacks": what works

| Works | Myth | Risky (can get you banned or fined) |
|---|---|---|
| WhatsApp message with the model filled in | The Search Console regex makes you rank first (it only shows what people ask) | Fake, paid, family or "happy only" reviews |
| Ratings next to the buttons | Geotagged photos (Google strips the location) | Keywords added to the profile name |
| Review QR, asking every customer | Wide service area to rank in Mumbai | Virtual office or moving the map pin |
| Broadcast lists to saved contacts | Exit pop-ups, A/B tests at this traffic | One page per city, mass AI posts, bought links |
| QR sticker on machines, factory walk-ins | Guest posts, paid press releases, llms.txt as a boost | WhatsApp bulk senders, bought number lists, fake urgency, "lowest price" |

## Measure every month

Profile calls and actions; IndiaMART response rate; enquiries and orders by source ("Where did you find us?").
Search Console filters are in `seo-monthly.md`.
