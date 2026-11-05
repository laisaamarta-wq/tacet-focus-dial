# TACET — landing page

**TACET One** is a fictional, screenless focus dial: twist the crown to start a session, the core glows under glass, and your notifications and team status go quiet until you're done. This repository is the complete marketing site for the concept brand, inspired by the interaction quality of oryzo.ai.

> TACET is a design concept. Products, prices, specifications and reviews are demonstration content; the footer says so on every page.

## Brand at a glance

| | |
|---|---|
| Name | TACET — the musical marking for "stay silent" |
| Tagline | Turn the world down. |
| Product | TACET One, a 92 mm aluminium, ceramic and glass focus dial |
| Audience | Knowledge workers, designers, engineers and teams who do deep work |
| Positioning | The anti-app: focus you don't have to open |
| Palette | Mist `#D9DCD6`, Chalk `#F2F1EC`, Basalt `#1D2124`, Graphite `#4A5157`, Ink `#15191C`, Cobalt `#3047FF` (the light of the core) |
| Type | Unbounded (display, light weights) + Onest (text) |
| Logo | An open ring — the crown, with a gap where a session starts — around a cobalt core (`src/components/brand/Logo.tsx`) |

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · Motion · Three.js + React Three Fiber · Lenis · Zod

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm run start
```

Node.js 20+.

## Where things live

| What | Where |
|---|---|
| All copy, pricing, FAQ, specs, legal text | `src/content/site.ts` |
| Colours and type scale | `src/app/globals.css` |
| Where the object lands in each section | `src/lib/stages.ts` |
| The 3D product (procedural, three finishes) | `src/components/three/TacetModel.tsx` |
| Scroll choreography of the object | `src/components/three/CoreObject.tsx` |
| Product renders used in the gallery | `public/renders/*.webp` |
| Sections | `src/components/sections/*` |

### How the 3D choreography works

Every section contains an empty "dock" box. Each frame, the object flies toward the dock of the current section and blends its pose, light and explode state with the next one. Layout decides where the object sits, so mobile works without separate animation code. The page colour also blends between light and dark chapters while you scroll.

## Reservation form

| Mode | How |
|---|---|
| Built-in endpoint (default) | `POST /api/contact` validates, rate-limits and delivers via `RESEND_API_KEY` + `CONTACT_TO` (email) or `CONTACT_WEBHOOK_URL` (Make, Zapier, n8n…). Without these, submissions are logged. |
| Any external service | Set `NEXT_PUBLIC_FORM_ENDPOINT` to a URL that accepts JSON POST (e.g. Formspree). |
| Demo | `NEXT_PUBLIC_FORM_MODE=demo` sends nothing and shows a demo confirmation. The single-file HTML uses this. |

Keep keys in your host's environment settings, never in code.

## Deploy

Vercel: import the repo, framework is detected automatically, add the form variables if you want real submissions. Live at https://tacet-focus-dial.vercel.app. If you add a custom domain, update `brand.url` in `src/content/site.ts` (used for canonical URL, sitemap and Open Graph image).

## Single-file HTML

`tacet.html` is a static export with every script, style, font and render inlined, so it opens offline by double-click and can be uploaded anywhere. Its form runs in demo mode unless it was built with `NEXT_PUBLIC_FORM_ENDPOINT`.

## Checked

Production build, TypeScript strict, ESLint. Screenshots at 1440×900 and 390×844. Form validation, honeypot and demo/endpoint modes. Respects `prefers-reduced-motion`, has a fallback without WebGL, keyboard-operable dial (arrow keys), visible focus and a skip link.
