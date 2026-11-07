# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Astro (latest stable, static output). No UI framework, no Tailwind, no GSAP; add other dependencies only after asking. Fonts self-hosted through `@fontsource` (Grand Hotel, Barlow Semi Condensed). The pine island, pail, and red towel appear as **printed cover art** inside the chosen "matchbook drawer" visual world — Blender test renders reused as prints; no real-time 3D and no `three` (decided by Iman, November 2026). Deployed to GitHub Pages at botchan.tech through GitHub Actions (`withastro/action`, Node 24), with `public/CNAME`. DNS is on Cloudflare and must not be changed. Source is already set to GitHub Actions in the repository's Pages settings.

## Users

Fellow makers who arrive from a link or profile. They come to see what Botchan is and what gets built here, and should leave impressed by the site itself before any project exists.

## Product Purpose

botchan.tech is the home for Botchan's technology projects. At launch it intentionally holds no projects; project work begins after the site is finished. The site presents itself as a matchbook drawer from a vanished Shōwa-era café: every project is one matchbook whose cover is printed before the fire exists, and the unstruck stack is the honest empty pail. Success is a visitor understanding the name's origin, feeling the seriousness of the craft, and remembering the drawer.

## Positioning

A workshop for things that don't exist yet. The site's craft is the first proof of work, and its emptiness is stated honestly rather than filled with placeholders.

## Operating Context

Visitors scan a single home page: the drawer (hero), **The Name** (about), **The Pail** (projects catalog), and **Two Doors** (elsewhere). Project pages at `/projects/[slug]/` appear only once real projects exist. The site has one dark theme: walnut counter, foil gold, oxblood and bottle green covers, match-head red as the only accent. The site ships no client-side scene code.

## Capabilities and Constraints

- No personal information: no real name, campus, major, city, photo, or personal email in text, metadata, or JSON-LD. `author` and copyright use "Botchan". Intentional exceptions: links to `imansetia.page` and `github.com/imansetia`.
- Hermes and its infrastructure are never shown, including VMs, IPs, tokens, bot names, and cron.
- Do not fabricate projects, commits, logs, statistics, quotes, or skills. Empty sections stay honestly empty.
- No email address is shown until the owner activates one.
- The pine island and red towel come from Natsume Sōseki's *Botchan* (1906); the pail is an invention and the site says so.
- The visual world is the matchbook drawer recorded in the surface brief (`.impeccable/surfaces/src-pages-index-astro.md`); one world owns the page.
- Motion respects `prefers-reduced-motion`; the foil sheen is the single authored motion moment.

## Brand Commitments

- Name: Botchan, a stage name borrowed from the novel.
- Voice: calm, honest, a little playful. No claims of expertise.
- Plain-spoken nickname labels for sections (The Name, The Pail, Two Doors), in the novel's nickname tradition.
- Catalog numbering `No. 001`–`No. 003` where the sequence is real information.
- One accent color: match-head red, the towel-red lineage. Gold foil is material, not an accent.
- Same family as imansetia.page (IBM Plex Mono there, honest small-caps labels here), not a duplicate.

## Evidence on Hand

- The direction is locked: challenger `vernacular-ephemera-matchbook-drawer`, chosen by Iman from the bolder hand of 2026-11-07; contract in the surface brief; seed `seed:93ba5402aa70d988`.
- [CREDITS.md](./CREDITS.md) records asset provenance, including the reused Blender test renders in `public/art/`.
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
