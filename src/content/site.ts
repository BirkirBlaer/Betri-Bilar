/**
 * All company facts and website copy live here.
 * Edit this file to update the website — no other code changes needed.
 *
 * `verified: false` marks content that still needs the owner's confirmation.
 * While NEXT_PUBLIC_DEMO_MODE=true those items show a small "til staðfestingar" marker.
 * See docs/FACT-SHEET.md for sources.
 */

export const company = {
  name: "Betri Bílar",
  legalName: "Betri bílar ehf.",
  kennitala: "580491-1629",
  descriptor: "Bifreiðaverkstæði",
  foundedYear: 1991,
  phone: { display: "568 1411", href: "tel:+3545681411", e164: "+3545681411" },
  email: "betribilar@simnet.is",
  address: {
    street: "Skeifan 5c",
    postalCode: "108",
    city: "Reykjavík",
    country: "IS",
    // Approximate coordinates for Skeifan 5, used only in structured data. Confirm before launch.
    geo: { lat: 64.1305, lng: -21.8754 },
  },
  mapsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=Betri+B%C3%ADlar%2C+Skeifan+5c%2C+108+Reykjav%C3%ADk",
  facebookUrl: "https://www.facebook.com/Betribilar/",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://betribilar.is",
};

/** Opening hours. Sources disagree — see FACT-SHEET.md. */
export const openingHours = {
  verified: false,
  rows: [
    { days: "Mánudaga – fimmtudaga", hours: "08:00 – 17:00", schema: ["Mo", "Tu", "We", "Th"], opens: "08:00", closes: "17:00" },
    { days: "Föstudaga", hours: "08:00 – 15:00", schema: ["Fr"], opens: "08:00", closes: "15:00" },
    { days: "Helgar", hours: "Lokað", schema: [], opens: "", closes: "" },
  ],
};

export const brands = [
  { name: "Volkswagen", short: "VW" },
  { name: "Škoda", short: "ŠK" },
  { name: "Audi", short: "AU" },
  { name: "Mitsubishi", short: "MI" },
] as const;

export const hero = {
  descriptor: "Bifreiðaverkstæði í Skeifunni",
  title: "Betri Bílar",
  lede: "Bifreiðaviðgerðir í Reykjavík, með sérhæfingu í Volkswagen, Škoda, Audi og Mitsubishi.",
};

export const intro = {
  heading: "Verkstæði sem hefur unnið við bíla síðan 1991.",
  body: [
    "Betri Bílar er bifreiðaverkstæði í Skeifunni í Reykjavík. Við gerum við bíla, með sérstaka áherslu á Volkswagen, Škoda, Audi og Mitsubishi.",
    "Þú kemur með bílinn, við finnum hvað er að og segjum þér hvað þarf að gera áður en við byrjum.",
  ],
  /** The second paragraph describes a working practice — confirm it matches how they work. */
  verified: false,
};

export type Service = {
  id: string;
  title: string;
  summary: string;
  photoSlot: string;
  verified: boolean;
};

export const services: Service[] = [
  {
    id: "vidgerdir",
    title: "Almennar viðgerðir",
    summary: "Það sem bilar, lagað af fólki sem þekkir bílinn. Mest vinnum við við Volkswagen, Škoda, Audi og Mitsubishi.",
    photoSlot: "service-repairs",
    verified: true,
  },
  {
    id: "bilanagreining",
    title: "Bilanagreining",
    summary: "Viðvörunarljós í mælaborði eða hljóð sem á ekki að vera þar. Við lesum af tölvunni og finnum orsökina.",
    photoSlot: "service-diagnostics",
    verified: false,
  },
  {
    id: "vidhald",
    title: "Smurþjónusta og viðhald",
    summary: "Olíuskipti, síur og reglubundið viðhald samkvæmt þjónustubók framleiðanda.",
    photoSlot: "service-maintenance",
    verified: false,
  },
  {
    id: "hemlar",
    title: "Hemlar og fjöðrun",
    summary: "Bremsudiskar, klossar, demparar og stýrisbúnaður — það sem heldur bílnum öruggum á veginum.",
    photoSlot: "service-brakes",
    verified: false,
  },
];

export const specialization = {
  heading: "Fjögur merki sem við þekkjum út og inn.",
  body: "Volkswagen, Škoda, Audi og Mitsubishi eru sérgrein okkar. Þegar maður vinnur við sömu bílana ár eftir ár lærir maður á þá — hvað bilar, hvar á að leita og hvernig á að gera það rétt.",
};

export const trust = {
  heading: "Af hverju Betri Bílar",
  points: [
    {
      title: (year: number) => `Síðan ${year}`,
      body: "Betri Bílar hefur verið skráð fyrirtæki frá 1991. Það er langur tími í þessum bransa.",
      verified: true,
    },
    {
      title: () => "Sérhæfing",
      body: "Þegar verkstæði vinnur mikið við sömu merkin þekkir það veikleika þeirra og veit hvar á að leita.",
      verified: true,
    },
    {
      title: () => "Miðsvæðis",
      body: "Í Skeifunni, stutt frá Suðurlandsbraut og Miklubraut. Auðvelt að skila bílnum og ná í hann aftur.",
      verified: true,
    },
  ],
  /**
   * Authentic reviews only. Copy them exactly, with the reviewer's permission and source.
   * Leave empty to hide the reviews block.
   */
  reviews: [] as { quote: string; author: string; source: string; url: string }[],
};

export const contact = {
  heading: "Hafðu samband",
  lede: "Fljótlegast er að hringja. Þú getur líka sent okkur beiðni um tíma og við höfum samband til að finna tíma sem hentar.",
};

export const nav = [
  { href: "#thjonusta", label: "Þjónusta" },
  { href: "#serhaefing", label: "Sérhæfing" },
  { href: "#verkstaedid", label: "Verkstæðið" },
  { href: "#hafa-samband", label: "Hafa samband" },
];

export const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE !== "false";
