/**
 * TACET — site content.
 * Every word on the page lives here. TACET is a fictional design-concept brand:
 * product, pricing, specifications and reviews are demonstration content.
 */

export const brand = {
  name: "TACET",
  product: "TACET One",
  tagline: "Turn the world down.",
  description:
    "TACET One is a focus dial for your desk. One twist silences your phone, blocks your calendar and tells your team you're focused — for exactly as long as you choose. No screen. No app to open.",
  url: "https://tacet-focus-dial.vercel.app",
  locale: "en_US",
  disclaimer:
    "TACET is a fictional brand created as a design concept. Products, prices, specifications and reviews on this page are for demonstration only. Nothing is for sale.",
};

export const nav = [
  { id: "twist", label: "The twist" },
  { id: "does", label: "What it does" },
  { id: "light", label: "The light" },
  { id: "value", label: "Why €189" },
  { id: "pricing", label: "Pricing" },
];

export const hero = {
  title: ["Turn the", "world", "down."],
  lead: "TACET One is a focus dial for your desk. One twist silences your phone, blocks your calendar and tells your team you're in focus — for exactly as long as you choose.",
  chips: ["Phone silenced", "Calendar blocked", "Team status: in focus"],
  ctaPrimary: "Reserve from €189",
  ctaSecondary: "See the twist",
  hint: "Drag to turn",
  badge: "TACET One — reservations open",
};

export const reveal = {
  phases: [
    {
      title: "Not just a timer.",
      text: "TACET One is a switch for your attention: a weighted dial that silences your phone, blocks your calendar and tells your team — in one twist.",
    },
    {
      title: "Every side, considered.",
      text: "A machined aluminium base. Ceramic and aluminium rings. A knurled crown with 72 detents. A borosilicate dome over a light that speaks.",
    },
  ],
  views: ["Top", "Three-quarter", "Profile", "Underside", "Detail"],
};

export const twist = {
  phases: [
    { kicker: "Right now", title: "It never stops.", text: "Pings, threads, invites, “quick question?” Every one of them costs you the next twenty minutes." },
    { kicker: "Then", title: "One twist.", text: "Turn the crown to the length you need. Each click is five minutes. Let go." },
    { kicker: "And", title: "The world goes quiet.", text: "Everything waits outside the glass until the light says you're done." },
  ],
  notifications: [
    { app: "Team chat", text: "#design — 12 new messages", x: -34, y: -26, r: -6 },
    { app: "Mail", text: "Re: Re: Re: quick question", x: 30, y: -30, r: 5 },
    { app: "Calendar", text: "Sync moved to 10:30", x: -40, y: 2, r: 4 },
    { app: "Team chat", text: "@you can you take a look?", x: 38, y: 0, r: -4 },
    { app: "News", text: "Breaking: you won't believe…", x: -14, y: -40, r: -3 },
    { app: "Shop", text: "Your cart misses you", x: 26, y: 18, r: 6 },
    { app: "Mail", text: "Invoice #2041 is ready", x: 14, y: -42, r: 2 },
    { app: "Social", text: "3 people reacted to your post", x: -26, y: 12, r: -5 },
    { app: "Calendar", text: "Standup in 5 minutes", x: 44, y: -16, r: 3 },
  ],
  heldLabel: "notifications held",
  note: "Illustrative demonstration",
};

export const does = {
  title: "One twist. Four things happen.",
  lead: "TACET One isn't a timer you look at. It's a switch for your whole working environment.",
  items: [
    {
      title: "Your phone goes silent",
      text: "Focus mode switches on for exactly the session. Calls from favourites still get through.",
      ui: { label: "Phone", state: "Focus on", detail: "until 11:40" },
    },
    {
      title: "Your calendar is blocked",
      text: "A “Focus” event appears for the length you set, so nobody books over your best hour.",
      ui: { label: "Calendar", state: "Blocked", detail: "10:55 – 11:40" },
    },
    {
      title: "Your team knows",
      text: "Your chat status turns to “In focus” with the time you'll be back. No message needed.",
      ui: { label: "Team chat", state: "In focus", detail: "back at 11:40" },
    },
    {
      title: "It ends with light, not an alarm",
      text: "The core fades from blue to amber, then to mint. One soft pulse under your fingers. Done.",
      ui: { label: "TACET One", state: "Done", detail: "45 min focused" },
    },
  ],
};

export const how = {
  title: "Inside the object",
  lead: "Scroll — it opens up, layer by layer.",
  steps: [
    {
      part: "Crown dial",
      title: "A crown with 72 detents",
      text: "Machined aluminium with a knurled edge. One click is five minutes, from 5 to 90. You can set it with your eyes closed.",
    },
    {
      part: "Haptic ring",
      title: "A pulse you feel, not hear",
      text: "A linear motor taps once at each quarter of the session, so you know where you are without looking.",
    },
    {
      part: "Light core",
      title: "A light that speaks",
      text: "A diffused LED core under a borosilicate dome. Readable from across the room, never harsh up close.",
    },
  ],
};

export const light = {
  title: "The light speaks.",
  lead: "Three colours. Everyone in the room understands them on day one.",
  states: [
    { id: "focus", color: "#3d5bff", name: "Blue", title: "You're in it.", text: "The session is running. Your phone, calendar and team chat are holding everything for you." },
    { id: "warn", color: "#ffad3d", name: "Amber", title: "Five minutes left.", text: "The core warms up so you can land the thought instead of being cut off mid-sentence." },
    { id: "done", color: "#3dffb0", name: "Mint", title: "Done. Go outside.", text: "Notifications return, your status clears, and the dial is ready for the next round." },
  ],
};

export const showcase = {
  title: "From your desk to your team",
  lead: "The same object, wherever your attention goes — on the desk, in your hand, and as a quiet status everyone can see.",
  images: [
    { src: "/renders/studio.webp", alt: "TACET One in Basalt finish on a dark studio surface, core glowing blue", caption: "TACET One in Basalt" },
    { src: "/renders/crown.webp", alt: "Close-up of the knurled brass crown on the Moss finish", caption: "Moss, with a brass crown" },
    { src: "/renders/top.webp", alt: "TACET One in Fog finish seen from a raised three-quarter angle, glass dome over a glowing core", caption: "Fog, at three-quarters" },
  ],
  card: {
    app: "Team status",
    name: "Alex Moreno",
    state: "In focus",
    until: "until 11:40",
    rows: [
      { label: "Notifications held", value: "37" },
      { label: "Session", value: "2 of 4" },
      { label: "Calendar", value: "Blocked" },
    ],
    note: "Interface shown for illustration",
  },
};

export const value = {
  title: "Why it costs €189",
  lead: "Because it's built like a watch, not like a gadget — and because you'll never pay for it again.",
  items: [
    { n: "1", unit: "billet", title: "Solid aluminium", text: "The base and crown are machined from one block of 6061 aluminium, then bead-blasted and anodised." },
    { n: "72", unit: "detents", title: "Hand-tuned crown", text: "Each click is tuned for the same weight and sound, so five minutes always feels like five minutes." },
    { n: "3", unit: "materials", title: "Metal, ceramic, glass", text: "A glazed ceramic ring and a borosilicate dome. No plastic you can see or touch." },
    { n: "30", unit: "days", title: "Per charge", text: "Four sessions a day for a month. The battery is a standard cell you can replace yourself." },
    { n: "€0", unit: "per month", title: "No subscription", text: "One and Pair work fully without one. The price you pay is the whole price." },
    { n: "5", unit: "years", title: "Of updates", text: "New integrations and light patterns arrive over the air. The object stays the same." },
  ],
  note: "Concept specifications, shown for demonstration.",
};

export const tryIt = {
  title: "Try it",
  lead: "Drag around the dial to set a session and pick a finish. The object follows.",
  minMinutes: 5,
  maxMinutes: 90,
  step: 5,
  defaultMinutes: 45,
  finishes: [
    { id: "basalt", label: "Basalt", swatch: "#2f3539" },
    { id: "fog", label: "Fog", swatch: "#c9ccc6" },
    { id: "moss", label: "Moss", swatch: "#2f3b33" },
  ],
  specsTitle: "Concept specifications",
  specs: [
    { label: "Dimensions", value: "92 × 58 mm" },
    { label: "Weight", value: "340 g" },
    { label: "Materials", value: "Aluminium, ceramic, borosilicate glass" },
    { label: "Battery", value: "Up to 30 days, replaceable" },
    { label: "Charging", value: "Magnetic puck, USB-C" },
    { label: "Connectivity", value: "Wi-Fi, Bluetooth LE" },
    { label: "Works with", value: "Major calendars and team chat apps" },
  ],
};

export const testimonials = {
  title: "Field notes",
  note: "Fictional demonstration reviews. TACET is a concept product and has no real customers.",
  items: [
    { quote: "I stopped announcing that I was busy. People just look at the light.", name: "Demo persona", role: "Product designer", rating: 5 },
    { quote: "It's the first productivity tool I own that I never have to open.", name: "Demo persona", role: "Writer", rating: 5 },
    { quote: "The fade to amber is the best part. I finish the sentence instead of losing it.", name: "Demo persona", role: "Software engineer", rating: 4.5 },
    { quote: "Heavy, quiet, and it looks good on an oak desk. That's the review.", name: "Demo persona", role: "Architect", rating: 5 },
  ],
};

export const pricing = {
  title: "Choose your TACET",
  lead: "Demonstration pricing. Reserve now, pay nothing until your batch ships.",
  currency: "€",
  tiers: [
    {
      id: "one",
      name: "One",
      price: "189",
      unit: "one-time",
      summary: "One dial for one desk. Everything you need to start.",
      features: ["TACET One in any finish", "Magnetic charging puck", "Phone, calendar and chat sync", "2-year warranty"],
      cta: "Reserve One",
    },
    {
      id: "pair",
      name: "Pair",
      price: "339",
      unit: "one-time",
      featured: true,
      summary: "Home and office, or one for each of you. Save €39.",
      features: ["Two TACET One dials", "Two charging pucks", "Shared household focus mode", "2-year warranty"],
      cta: "Reserve Pair",
    },
    {
      id: "studio",
      name: "Studio",
      price: "890",
      unit: "for 5 dials",
      summary: "For teams who want quiet to be normal, not negotiated.",
      features: ["Five TACET One dials", "Team focus dashboard, first year included", "Bulk setup and SSO", "Priority support"],
      cta: "Talk to us",
    },
  ],
};

export const faq = {
  title: "Questions",
  items: [
    { q: "What exactly is TACET One?", a: "A 92 mm dial for your desk. You twist the crown to set a focus session from 5 to 90 minutes. While it runs, it silences your phone, blocks your calendar and sets your team chat status. The light in the core shows how the session is going." },
    { q: "Do I need my phone to use it?", a: "No. Twist the crown and a session starts. The app is only used once, to connect your phone, calendar and team chat." },
    { q: "What happens if I need to stop early?", a: "Press the dome once. The light fades out, your status returns to normal and the session is saved as finished early." },
    { q: "Is there a subscription?", a: "Not for One or Pair. Studio includes the team dashboard for the first year, then it's optional." },
    { q: "How long does the battery last?", a: "Up to 30 days with four sessions a day. It charges on a magnetic puck and the cell is replaceable." },
    { q: "Is TACET a real product?", a: "No. TACET is a fictional brand created as a design concept. Nothing on this site is for sale and no reservation data is stored." },
  ],
};

export const finalCta = {
  title: "Reserve your quiet",
  lead: "No payment today. We'll write once, when your batch is ready.",
  form: {
    name: "Name",
    email: "Email",
    tier: "Package",
    finish: "Finish",
    message: "Anything we should know? (optional)",
    consent: "I agree to the privacy policy",
    submit: "Reserve now",
    sending: "Sending…",
    successTitle: "Reservation received",
    success: "Thanks — we'll email you when your batch is ready.",
    demoSuccess: "This is a concept site running in demo mode, so nothing was sent or stored. Connect a form endpoint to collect real reservations.",
    again: "Make another reservation",
    error: "We couldn't send your reservation. Check your connection and try again.",
  },
};

export const footer = {
  columns: [
    { title: "Product", links: [{ label: "The twist", href: "#twist" }, { label: "The light", href: "#light" }, { label: "Try it", href: "#specs" }] },
    { title: "Buy", links: [{ label: "Why €189", href: "#value" }, { label: "Pricing", href: "#pricing" }, { label: "Reserve", href: "#contact" }] },
  ],
  contact: { email: "hello@tacet.example" },
  socials: [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "LinkedIn", href: "https://linkedin.com" },
  ],
};

export const legal = {
  privacy: {
    title: "Privacy policy",
    body: [
      "TACET is a design concept. In demo mode, the reservation form does not send, store or share any personal data.",
      "If a form endpoint is connected, submitted details (name, email, package, finish and message) are used only to reply to your reservation and are never sold or shared for advertising.",
      "You can ask for your data to be deleted at any time by writing to the contact address on this page.",
    ],
  },
  terms: {
    title: "Terms",
    body: [
      "This website presents a fictional product for demonstration purposes. No product is offered for sale and no contract is formed by submitting the form.",
      "All names, prices, specifications and reviews are illustrative.",
    ],
  },
};
