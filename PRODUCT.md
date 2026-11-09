# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Astro (latest stable, static output). No UI framework, no Tailwind, no GSAP; add other dependencies only after asking. Fonts self-hosted through `@fontsource` (Shippori Mincho, Barlow Semi Condensed). The pine island appears as quiet layered ink-wash shapes on a light rice-paper ground; no real-time 3D and no `three` (decided by Iman, November 2026). Deployed to GitHub Pages at botchan.tech through GitHub Actions (`withastro/action`, Node 24), with `public/CNAME`. DNS is on Cloudflare and must not be changed. Source is already set to GitHub Actions in the repository's Pages settings.

## Users

Fellow makers who arrive from a link or profile. They come to see what Botchan is and what gets built here, and should leave impressed by the site itself before any project exists.

## Product Purpose

botchan.tech is the home for Botchan's technology projects. At launch it intentionally holds no projects; project work begins after the site is finished. The site reads like a quiet museum page on rice paper: light ground, ink-wash pine island, calm serif typography, the catalog presented as a shelf of objects with dignity, and one restrained red accent (the towel's red). Success is a visitor understanding the name's origin, feeling the seriousness of the craft, and remembering the island.

## Positioning

A workshop for things that don't exist yet. The site's craft is the first proof of work, and its emptiness is stated honestly rather than filled with placeholders.

## Operating Context

Visitors scan a single home page: the ink island opening, **The Name** (about), **The Pail** (projects catalog as a shelf), and **Two Doors** (elsewhere). Project pages at `/projects/[slug]/` appear only once real projects exist. The site has one light theme: rice-paper ground, warm ink, hairline rules, red used sparingly. The site ships no client-side scene code.

## Capabilities and Constraints

- No personal information: no real name, campus, major, city, photo, or personal email in text, metadata, or JSON-LD. `author` and copyright use "Botchan". Intentional exceptions: links to `imansetia.page` and `github.com/imansetia`.
- Hermes and its infrastructure are never shown, including VMs, IPs, tokens, bot names, and cron.
- Do not fabricate projects, commits, logs, statistics, quotes, or skills. Empty sections stay honestly empty.
- No email address is shown until the owner activates one.
- The pine island and red towel come from Natsume Sōseki's *Botchan* (1906); the pail is an invention and the site says so.
- The visual world is the light paper-and-ink direction extracted from Iman's own references (motionsites.ai "ink-dynasty" and "vasari-vhs-hero", November 2026) and recorded in DESIGN.md; one world owns the page.
- Motion respects `prefers-reduced-motion`; the page is nearly motionless by design — restraint is the effect.

## Brand Commitments

- Name: Botchan, a stage name borrowed from the novel.
- Voice: calm, honest, a little playful. No claims of expertise.
- Plain-spoken nickname labels for sections (The Name, The Pail, Two Doors), in the novel's nickname tradition.
- Catalog numbering `No. 001`–`No. 003` where the sequence is real information.
- One accent color: the towel's red, used sparingly on a light paper ground. Warm ink does the rest.
- Same family as imansetia.page (IBM Plex Mono there, tracked micro-caps labels here), not a duplicate.

## Evidence on Hand

- The direction is extracted from Iman's own references (2026-11-09) after they rejected the earlier matchbook direction as "norak, kelihatan murahan" — Iman confirmed the light paper-and-ink rendering: "sudah mulai benar".
- [CREDITS.md](./CREDITS.md) records asset provenance, including the self-authored ink-wash SVG art.
- [public/CNAME](./public/CNAME) records the custom domain `botchan.tech`.
- No projects, testimonials, or metrics exist yet; future work must not invent them.

## Product Principles

1. Impress through craft, not claims.
2. Stay honest: empty is better than fake.
3. One world owns the page; everything else stays quiet.
4. Every piece of content and function works without client-side JavaScript.
5. Keep it simple enough for the owner to understand and maintain.

## Accessibility & Inclusion

Semantic HTML with one `h1` per page, visible focus rings (`2px` red, offset `3px`), themed text selection and scrollbars, text always at sufficient contrast on the walnut ground, touch targets of at least 44px, and motion that honors `prefers-reduced-motion`.
