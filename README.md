# martinadechevska.com

Personal site for Martina Dechevska — journalist and real estate broker.

- **Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · Keystatic CMS (content in Git) · Vercel
- **Running cost:** $0 (Vercel Hobby, Keystatic in GitHub mode, no database, no paid services)
- **Pages:** Home · About · Journalism · Literature · Real Estate · Contact

```bash
npm install
npm run dev        # http://localhost:3000  — content editor at /keystatic
npm run build      # production build
npm run lint
```

---

## Design — "Ivory & Ink"

| Token | Hex | Use |
| --- | --- | --- |
| Ivory | `#f6f3ec` | Page background |
| Paper | `#fbfaf6` | Raised bands |
| Ink | `#141412` | Text, dark sections |
| Stone | `#5e5a51` | Secondary text (6.2:1 on ivory) |
| Olive | `#56631a` | Accent on light (5.9:1 on ivory) |
| Lime | `#c5d24a` | Accent on dark only (11.2:1 on ink) — the nod to flowersinagun.com |

Type: **Cormorant Garamond** (display, weight 500, roman + italic) and **Manrope** (text, small caps labels).
Signature details: oversized serif name, italic surname, hairline rules, numbered sections (01 / 02), olive offset frame on the portrait.

An alternative direction ("Noir Editorial": dark-first, ink background throughout, lime used for links) was not built. Switching is mostly a token swap in `app/globals.css`.

---

## Editing content (for Martina)

1. Go to `https://martinadechevska.com/keystatic` and sign in with GitHub.
2. Pick a page on the left, edit, press **Save**.
3. The site rebuilds itself on Vercel in about a minute.

Anything shown as `[in brackets]` on the site is a placeholder still waiting for real content. Placeholders are underlined with a dotted line and are never sent to Google (search descriptions, structured data).

| Where in the editor | What it controls |
| --- | --- |
| Site settings & contact details | Name, role line, email, phone, city, LinkedIn, Instagram, archive URL, default search description |
| Home page | Tagline, intro, portrait, statement, the two paths, highlight figures |
| About page | Heading, opening paragraph, photo, full biography (rich text) |
| Journalism page + Articles & publications | Intro, archive block, video section heading, one entry per article (title, outlet, date, link, summary, featured) |
| Video reports | One entry per report: title, outlet, when, language, duration, video file *or* link, cover image, summary, copyright credit, order |
| Real estate page | Services, areas, brokerage, license, Equal Housing toggle, disclosures, call to action |
| Literature page | Heading, opening line, text, books (title, year, note, cover, link), YouTube videos |
| Contact page | Heading and intro |

Content files live in `content/en/`; uploaded images in `public/images/`.

---

## Deploying to Vercel

### 1. Create the project

1. Push this repository to GitHub (already done if you are reading this there).
2. In Vercel: **Add New → Project → Import** `SimoSabev/Martina_Dechevska.com`. Framework preset: Next.js. No build settings to change.
3. Environment variable: `NEXT_PUBLIC_SITE_URL=https://martinadechevska.com`.
4. Deploy. The site works immediately; the editor needs step 2.

### 2. Turn on the online editor (Keystatic GitHub mode)

Locally the editor writes to files on disk. In production it commits to GitHub, which triggers a redeploy.

1. Create `.env` locally with `NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO=SimoSabev/Martina_Dechevska.com`.
2. `npm run dev`, open `http://localhost:3000/keystatic` and follow the **Create GitHub App** wizard. It writes these into `.env`:
   `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET`, `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`.
3. Copy all five variables (including `NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO`) into Vercel → Project → Settings → Environment Variables, then redeploy.
4. In the GitHub App's settings add the callback URL
   `https://martinadechevska.com/api/keystatic/github/oauth/callback`
   (keep the localhost one for development).
5. Install the GitHub App on the repository, and invite Martina's GitHub account as a collaborator with **Write** access.

If Martina should not need a GitHub account, Keystatic Cloud (free tier) is the alternative — confirm current pricing/limits before choosing it.

### 3. Connect martinadechevska.com

1. Vercel → Project → **Settings → Domains** → add `martinadechevska.com` and `www.martinadechevska.com`; set one to redirect to the other (apex recommended as primary).
2. At the domain registrar, create the DNS records Vercel shows. Typically:
   - `A` record, host `@` → `76.76.21.21`
   - `CNAME` record, host `www` → `cname.vercel-dns.com`
   Use the exact values Vercel displays for the project if they differ.
   Alternatively, switch the domain's nameservers to Vercel's and let Vercel manage DNS.
3. Wait for Vercel to show **Valid Configuration**; HTTPS is issued automatically.
4. Submit `https://martinadechevska.com/sitemap.xml` in Google Search Console.

---

## Technical notes

- **SEO:** per-page metadata and canonicals, generated Open Graph image (`app/opengraph-image.tsx`), `sitemap.xml`, `robots.txt` (editor excluded), JSON-LD `Person` (Home, About) and `RealEstateAgent` (Real Estate).
- **Performance:** every page is statically generated; CSS is inlined (`experimental.inlineCss`), one serif weight is loaded, the body font uses `display: optional`. Local Lighthouse (production build): desktop 100/100/100/100 on all pages; mobile performance 93–98, accessibility/best practices/SEO 100. Vercel's CDN with Brotli is typically faster than the local test server.
- **Accessibility:** semantic landmarks, skip link, visible focus rings, AA contrast on every text pairing, alt text fields for every image, reduced-motion respected.
- **Video:** reports are served from `public/videos/` through Vercel's CDN, behind a click-to-play cover image, so the Journalism page downloads no video until a visitor presses play. Keep each file small (H.264 MP4, ≤720p, roughly 20 MB max): every upload is committed to Git and stays in the repository's history for good. To compress a file before uploading: `ffmpeg -i in.mp4 -c:v libx264 -crf 26 -preset slow -vf "scale='min(1280,iw)':-2" -c:a aac -b:a 96k -movflags +faststart out.mp4`. For long pieces or a large library, link to a hosted copy instead (the "link to the published video" field) rather than uploading the file. The grid shows the first video large, so it fills evenly with 2, 5 or 8 entries.
- **Contact form:** zero-service `mailto:` form that opens the visitor's email app with the message pre-filled. To receive messages directly instead, add a server action + Resend (free tier: 3,000 emails/month) — the form markup stays the same.
- **Adding a language later:** content already lives under `content/<locale>/` and all loaders take a locale (`lib/i18n.ts`, `lib/content.ts`). Steps: add the locale to `lib/i18n.ts`, register its schema in `keystatic.config.ts` (see comment there), copy `content/en/` to the new folder, move `app/(site)/*` under `app/[locale]/`, and add `alternates.languages` to metadata. If the language is Bulgarian, add the `cyrillic` subset to both fonts in `app/layout.tsx`.

---

## Content status

**Done (from Martina's answers, Nov 2026):** biography, journalism, literature and real estate copy; license, brokerage, team, office, areas; 10 selected articles; contact email/phone; Facebook; home and real estate photos; 8 video reports.

**Still needed:**

- [ ] Brokerage office phone (shown in the footer and Real Estate credentials; required in NY advertising)
- [ ] NY Fair Housing Notice and Standard Operating Procedures: links or wording from Find Real Estate (placeholder in the footer)
- [ ] Official Equal Housing Opportunity logo file (replace the glyph in `components/equal-housing.tsx`)
- [ ] LinkedIn and Instagram URLs
- [ ] Higher-resolution original of the solo portrait (the current file is 645 px wide) and a second solo photo for About. The three Getty Images event photos cannot be used: they are watermarked and licensed by Getty.
- [ ] Zillow reviews to publish: paste the text and reviewer names (Zillow could not be fetched from the build environment)
- [ ] Titles for the YouTube videos `QLyCdtdveBg` (Journalism) and `NZWQxdlFTpQ` (Real Estate)
- [ ] Cover of S@MOT@, and a purchase link if one should be shown
- [ ] Book videos (premiere, "Часът на Милен Цветков" 05.03.2015, promo) and the remaining bTV and ZoomIn.TV reports Martina chose (Drew Barrymore/Madeline Stuart, Keira Knightley, Jeremy Scott, Goodfellas reunion, all bTV recordings). These files are over the 10 MB the Drive connector can download. Recommended: upload them to Martina's YouTube channel and paste each link into Keystatic (Video reports → "YouTube link", or Literature → Videos).
- [ ] Contact form choice; recommended: direct delivery via a free form service, because a `mailto:` form loses visitors who have no email app set up
- [ ] Domain registrar access, and a GitHub account for Martina

**To confirm:**

- [ ] "Founder & Managing Director of The Empire Team" (Martina's correction), next to the earlier bio's "co-leads with Dimitar Nikolov". Also confirm the colleague in the Real Estate photo and whether to name him in the alt text.
- [ ] Brokerage name exactly as on the license ("Find Real Estate" vs "FIND REAL ESTATE LLC")
- [ ] Article dates: The Rocket is shown as April 2013 (Tribeca 2013); the Bernini piece has no date. Titles of these two and of the VICE piece come from Martina's list, not the published pages.
- [ ] Footage rights for the ZoomIn.TV and bTV videos (credited on every entry). Gal Gadot clip retitled "…her online trolls" to match the Keira Knightley rename.
