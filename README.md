# Betri Bílar — website

Website for Betri Bílar ehf., an automotive repair workshop at Skeifan 5c, Reykjavík.
One page in Icelandic, built with Next.js, Tailwind CSS, GSAP and React Three Fiber.
It deploys to Vercel with no paid services required.

> **Status: sales demo.** Facts that could not be verified, and every photo slot, must be
> confirmed by the owner before publishing. See [Before publishing](#before-publishing).

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run start      # serve the production build
```

Copy `.env.example` to `.env.local` and fill it in. Every variable is explained there.

## Where things are

| What | File |
|---|---|
| Company facts, opening hours, all website text | `src/content/site.ts` |
| Photo slots (what each photo should show, alt text) | `src/content/photo-slots.json` |
| Research notes and sources | `docs/FACT-SHEET.md` |
| Colours, type scale | `src/app/globals.css` (top of file) |
| Page sections | `src/components/site/*` |
| 3D brake assembly (hero) | `src/components/three/brake-scene.tsx` |
| Appointment-request form handler | `src/app/actions/request.ts` |
| SEO: metadata, structured data, sitemap, robots, share image | `src/app/layout.tsx`, `src/components/site/json-ld.tsx`, `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/opengraph-image.tsx` |
| Privacy page | `src/app/personuvernd/page.tsx` |

Most updates (phone number, hours, a service, a sentence) are a one-line change in
`src/content/site.ts`. Anything marked `verified: false` there shows a small
*til staðfestingar* marker while demo mode is on.

## Photos (Myndir)

The site is designed around Betri Bílar's own photographs from their Facebook page. They
could not be downloaded from the build environment, so every slot currently shows a
labelled placeholder. **No stock photos are used.**

1. Pick 6–12 strong photos from facebook.com/Betribilar, such as the workshop, cars on the
   lift, mechanics at work and close-ups. Use the largest version: open the photo, then
   right-click and save.
2. Rename each one to the slot it belongs to and put it in `photos-inbox/`:

   | Slot | Shows | Shape |
   |---|---|---|
   | `hero-workshop` | Wide shot of the workshop interior, ideally a car on a lift. **Most important.** | 16:9 |
   | `intro-detail` | Close-up of hands, tools or a component | 4:5 |
   | `service-repairs` | Mechanic working on a car | 4:3 |
   | `service-diagnostics` | Diagnostic computer connected to a car | 4:3 |
   | `service-maintenance` | Oil change, filters, engine bay | 4:3 |
   | `service-brakes` | Wheel off, brake disc or suspension | 4:3 |
   | `gallery-1` … `gallery-6` | Strongest workshop shot, a car worked on, a close-up, staff (with consent), a car on the lift, the building or sign | mixed |

3. Run:

   ```bash
   npm run photos
   ```

   Each photo is smart-cropped to its slot, given the same light grade (slightly lower
   saturation and a touch more contrast, with nothing added or removed), resized, and written
   to `public/images/<folder>/`. The site picks it up automatically. Use
   `npm run photos -- --no-grade` to keep the original colours.
4. Update the `alt` text in `src/content/photo-slots.json` so it describes the actual photo,
   then run `npm run photos` again to refresh.

Photos under ~1200 px wide trigger a warning. They'll work, but look soft on large screens.

## Appointment-request form

The form is real. It validates on the server, has spam protection (a hidden honeypot field,
a minimum fill time and a per-IP rate limit), and delivers by email through
[Resend](https://resend.com). The free tier covers far more than a workshop needs.

1. Create a Resend account and verify a sending domain, e.g. `betribilar.is`.
2. Set `RESEND_API_KEY`, `CONTACT_FROM_EMAIL` and optionally `CONTACT_TO_EMAIL` in Vercel.
3. Redeploy, because the "not connected" notice is decided at build time.

Until `RESEND_API_KEY` is set, the form says clearly that it is not connected and nothing is
sent. It never shows a fake success message. The button says "Biðja um tíma" (request a
time), not "Bóka tíma", because there is no booking calendar. The workshop confirms by
phone or email.

## Deploy to Vercel

1. Push this repository to GitHub, then import it at vercel.com/new. The framework is
   detected automatically.
2. Add the environment variables from `.env.example`.
3. Connect the domain and set `NEXT_PUBLIC_SITE_URL` to it.
4. When the owner has approved everything, set `NEXT_PUBLIC_DEMO_MODE=false` and redeploy.
   This removes the demo markers and photo captions, and lets search engines index the site.

## Before publishing

Owner approval needed for the following:

- [ ] **Photos.** Written permission to use every Facebook photo, and consent from anyone
      recognisable in them.
- [ ] **Opening hours.** Sources disagree (see `docs/FACT-SHEET.md`). The site shows
      Mon–Thu 08–17, Fri 08–15.
- [ ] **Founding year 1991.** Taken from the company registration date (kt. 580491-1629).
      Confirm the workshop has operated since then.
- [ ] **Services.** Only "repairs" is verified. Confirm or edit *Bilanagreining*,
      *Smurþjónusta og viðhald* and *Hemlar og fjöðrun*.
- [ ] **Intro text.** "We find the fault and tell you what needs doing before we start."
      Confirm this matches how they work.
- [ ] **Trust points.** The "Miðsvæðis" wording about location and easy drop-off.
- [ ] **Address.** "Skeifan 5c", with one directory saying "Skeifunni 5". Also the map
      coordinates in `site.ts`.
- [ ] **Logo and brand colour.** Not available. The site uses a wordmark in Geist and a
      lift-yellow accent. Swap in their logo if they have one.
- [ ] **Reviews.** None shown. Only add genuine reviews, with the reviewer's permission and
      source (`trust.reviews` in `site.ts`).
- [ ] **Privacy page.** Review the text in `/personuvernd`.
- [ ] **Domain.** Confirm the domain and update `NEXT_PUBLIC_SITE_URL`.
- [ ] **Email delivery.** Configure Resend as described above.

Deliberately **not** on the site because it couldn't be verified: manufacturer logos or any
suggestion of official authorisation, staff names, ratings, statistics, BGS membership and
the summer-closure dates.

## Technical notes

- **3D:** the brake assembly is modelled procedurally in code, so there are no model files
  or licences. It loads after first paint, pauses rendering once scrolled past, and uses
  lower detail and resolution on phones. A static SVG drawing is shown first, and stays if
  WebGL is unavailable or the visitor prefers reduced motion.
- **Motion:** GSAP ScrollTrigger with Lenis smooth scrolling. There's one sticky scroll
  sequence in the hero (about one extra screen of scroll) and no scroll-jacking. With
  `prefers-reduced-motion`, Lenis is off and movement becomes simple cross-fades.
- **Accessibility:** semantic landmarks and headings, a skip link, visible focus, a
  keyboard- and swipe-friendly lightbox built on `<dialog>`, labelled form fields with
  inline errors, and nothing that's only available on hover.
- **SEO:** Icelandic metadata, Open Graph image, `AutoRepair` structured data with verified
  facts only (no ratings), sitemap and robots. Robots block indexing while in demo mode.
