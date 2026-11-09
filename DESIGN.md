---
name: Botchan
description: A quiet ink museum on rice paper — the home of Botchan's projects.
colors:
  paper: "#f5f0e6"
  paper-deep: "#ede5d6"
  ink: "#26221c"
  ink-soft: "#6e675c"
  ink-faint: "#a79e8e"
  rule: "#d9d0c0"
  red: "#a83c2c"
  spine-paper: "#fbf8f1"
typography:
  display:
    fontFamily: "'Shippori Mincho', Georgia, serif"
    fontSize: "clamp(64px, 10vw, 132px)"
    fontWeight: 500
    lineHeight: 1.05
    letterSpacing: "0.04em"
  heading:
    fontFamily: "'Shippori Mincho', Georgia, serif"
    fontSize: "clamp(34px, 4.5vw, 52px)"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "0.03em"
  body:
    fontFamily: "'Shippori Mincho', Georgia, serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.9
  label:
    fontFamily: "'Barlow Semi Condensed', 'Arial Narrow', sans-serif"
    fontSize: "11px"
    fontWeight: 500
    letterSpacing: "0.28em"
spacing:
  sm: "16px"
  md: "32px"
  lg: "64px"
components:
  catalog-spine:
    backgroundColor: "{colors.spine-paper}"
    textColor: "{colors.ink-faint}"
    height: "clamp(170px, 24vw, 230px)"
    width: "clamp(56px, 7vw, 84px)"
  door-row:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
  micro-label:
    textColor: "{colors.ink-soft}"
    typography: "{typography.label}"
---

# Design System: Botchan

## Overview

**Creative North Star: "Museum kertas tinta" — a quiet ink museum on rice paper.**

The whole site is one calm exhibition wall: warm rice-paper ground, ink that darkens
only where it must, and objects (a pine island, a shelf of spines) presented with the
dignity of museum pieces. The style was extracted from Iman's own references — an
ink-wash culture page and a portfolio of media spines on paper — after an earlier
dark, foil-and-glow direction was rejected as tacky. Loud is the failure state:
no glows, no gradient text, no heavy shadows, no script fonts. The retro feeling
lives in the objects, never in vintage effects applied to the page.

**Key Characteristics:**
- Light rice-paper ground with warm near-black ink; one restrained red accent.
- Typographic hierarchy carried almost entirely by a single Japanese mincho serif.
- Layered flat ink-wash silhouettes (mountains, pines) — geometry, not texture fakery.
- The catalog is a physical shelf: spines stand on a real rule line; the reserved
  slot is pulled forward with a red ribbon.
- Tiny tracked uppercase micro-labels name everything; body copy stays under 62ch.

## Colors

The palette is paper and ink: warm off-whites carry the page, warm near-black does
all the talking, and a single ink-red marks the one thing that matters.

### Primary
- **Ink** (#26221c): all headings, body text, rules that must be seen, and the
  ink-wash illustration layers. It is the page's only loud voice.

### Secondary
- **Towel Red** (#a83c2c): the single accent, from the novel's Red Towel. Used only
  for the reserved ribbon, hover color, and the focus ring. If red appears twice on
  one screen, look again.

### Neutral
- **Paper** (#f5f0e6): the page ground.
- **Paper Deep** (#ede5d6): code blocks and quiet fill bands.
- **Ink Soft** (#6e675c): secondary text, tagline, meta rows.
- **Ink Faint** (#a79e8e): spine numbers, footer labels — the quietest voice.
- **Rule** (#d9d0c0): hairline borders and dividers; never darker than this for
  decorative lines.
- **Spine Paper** (#fbf8f1): the catalog spines' card ground, a step brighter than
  the page so objects lift without shadows.

### Named Rules
**The One Red Rule.** Red is the towel: it marks the reserved slot, hovers, and
focus — nothing else, never as decoration, never as a large field.

**The Ink Gradient Rule.** Depth in the illustration comes from stacking the same
ink at opacities (0.1 → 0.18 → 0.85), never from gradients or textures.

## Typography

**Display Font:** Shippori Mincho (Georgia fallback) — a Japanese mincho serif that
carries the novel's heritage natively and reads elegantly in Latin.
**Body Font:** Shippori Mincho, one family for nearly everything.
**Label Font:** Barlow Semi Condensed, only for micro-labels and meta.

**Character:** quiet, literary, museum-label precision. The mincho's thin horizontals
and sharp serifs do the decoration so nothing else has to.

### Hierarchy
- **Display** (500, clamp(64px–132px), 1.05): the wordmark "Botchan" only.
- **Heading** (500, clamp(34px–52px), 1.3): section titles ("The name",
  "Nothing in the pail yet.").
- **Body** (400, 17px, 1.9): prose, max 62ch.
- **Label** (Barlow Semi Condensed 500, 10–11px, 0.24–0.34em, uppercase): section
  markers, meta rows, footer. Every label is information, never an eyebrow.

### Named Rules
**The Museum Label Rule.** Micro-labels are placed like wall labels — small, tracked,
muted — and always name real information, never introduce a heading.

## Layout

One centered column of content on full-bleed paper, side padding clamp(20px–72px).
Sections are separated by hairline rules (`--rule`) with generous vertical air
(clamp 48–84px above, 40–64px below) — more space above a heading than below it.
The hero is typographic: kicker, wordmark, tagline, then the ink-wash island
bleeding off the page's bottom edge (full-bleed, negative margins). The catalog is
a physical shelf: objects aligned to a 2px ink baseline that reads as the shelf
edge. Breakpoint at 640px: the vertical Japanese credit hides, door rows stack,
spine gaps tighten.

## Elevation & Depth

Flat by conviction. The page has no drop shadows except one: the reserved spine,
lifted 10px off the shelf with a single soft shadow (0 12px 24px rgba(38,34,28,.1))
— because a pulled-forward object genuinely casts one. All other depth comes from
ink-wash opacity layering in the illustration and hairline rules.

### Named Rules
**The One Shadow Rule.** A shadow exists only where an object physically lifts.
Flat surfaces get borders, never shadows.

## Shapes

Everything is square or nearly so: spines are rectangles with 1px hairline borders,
rules are 1px lines, the shelf edge is 2px. The only soft shape in the system is
the focus outline's 2px radius. This squareness is the print-shop heritage — no
rounded cards anywhere.

## Components

### Catalog Spine
- **Shape:** vertical rectangle, 1px hairline border, square corners (56–84px wide,
  170–230px tall).
- **Ground:** Spine Paper (#fbf8f1); number set vertically (writing-mode: vertical-rl)
  in micro-label style, anchored bottom-center.
- **Reserved state:** pulled 10px above the shelf line, brighter card, soft shadow,
  and the red ribbon (9×46px) hanging over its top edge.
- **Shelf:** all spines align to a 2px ink bottom border; gaps clamp(14–28px).

### Door Row
- **Shape:** full-width baseline row, hairline top and bottom borders, 20px padding.
- **Content:** title (mincho 18px, left) and tracked meta with a drawn 12px arrow
  (right). Hover turns both to Towel Red — color only, no movement.

### Micro Label
- **Style:** Barlow Semi Condensed 500, 10–11px, 0.24–0.34em tracking, uppercase,
  Ink Soft. Used as section markers, meta rows, and the masthead — always factual.

### Navigation
- **Style:** brand name (mincho 19px) left; three tracked uppercase links right,
  with the hairline rule under the masthead. Hover: red. No backgrounds, no pills.

## Do's and Don'ts

### Do:
- **Do** stack the same ink at opacities (0.1 / 0.18 / 0.85) for any illustration
  depth; keep shapes flat and geometric.
- **Do** keep body measure under 62ch and let hairline rules (`#d9d0c0`) separate
  sections.
- **Do** use red only for the ribbon, hover, and focus ring (2px solid, offset 3px).
- **Do** set every label in tracked uppercase micro-caps and keep it factual.

### Don't:
- **Don't** introduce dark grounds, gold foil, glows, or script/foil fonts — the
  earlier direction was rejected by the owner as tacky; these are its fingerprints.
- **Don't** add gradient text, drop shadows on flat surfaces, or rounded cards.
- **Don't** use more than one red element per screen, and never red as a field.
- **Don't** fake ink texture with filters (feTurbulence, brush strokes); layering
  flat opacity is the ink.
