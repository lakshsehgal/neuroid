# Neuroid — Design System

**Neuroid** is an integrated growth & creative studio for D2C / DTC brands. The positioning is *full-brain*: as strong on the **left brain** (analytics, data, performance media) as on the **right brain** (content, IPs, creative, storytelling). The work is **psychology-backed advertising**, and the guiding line is the brand's own mission —

> **Rebuilding Neural Pathways.**

This repository is the machine-readable design system: typography, color, spacing, effects, brand assets, reusable React components, and sample slides. A compiler bundles the components into a runtime library and indexes the tokens; consumers link a single `styles.css`.

---

## Sources provided

The system was built from a brand sheet supplied as four screenshots (logo lockups, typography spec, textures/patterns, moodboard) plus four font binaries. No codebase or Figma file was provided. If you have the originals, keep these references:

- Brand fonts: `FH Lecturis (Bold)`, `DM Sans (variable + italic)`, `PP Editorial New (Italic)` — see `assets/fonts/`.
- Logo & moodboard imagery extracted into `assets/brand/`.
- There is **no product UI codebase** — the "product" surface demonstrated here is Neuroid's **deck / poster** system (`slides/`).

> ⚠️ **Font caveats:** Only **FH Lecturis Bold** (single weight) and **PP Editorial New Italic** (single style) were supplied. Upright PP Editorial New and lighter/other FH Lecturis weights are **not** available — DM Sans covers the missing display weights via the fallback stack. If you have the full families, drop them into `assets/fonts/` and extend `tokens/fonts.css`.

---

## CONTENT FUNDAMENTALS — how Neuroid writes

**Voice.** Confident, sharp, a little brash. Speaks like an operator, not a vendor. Pairs hard numbers with a human, almost editorial cadence. Never corporate-soft, never hypey-emoji.

**Person.** Mostly **"we"** (the studio) and **"you / your brand"** (the client). It's a partnership voice — *"We rebuilt how we think about growth."*

**Casing.** Headlines are **sentence case**, not Title Case — `Not just an agency. A full-brain partner.` Eyebrows / overlines are **ALL-CAPS** with wide tracking (`POSITIONING`, `OUTCOMES`). Labels on UI are short and punchy.

**Punctuation as identity.** A **red period** terminates the signature headline (`Rebuilding Neural Pathways.`) — the full stop is a brand device. Ampersands (`&`) are preferred over "and" in taglines. Em-dashes set up payoffs.

**Italic serif for emphasis.** Single words or short phrases are dropped into *PP Editorial New italic* inside an otherwise sans sentence to add warmth and rhythm — `scale profitably, predictably & with clarity`.

**Numbers.** Always concrete and outcome-framed: `4.8×` ROAS, `+213%` revenue, `38% lower CAC`. Vanity metrics are avoided; everything ties to profit.

**Vocabulary.** full-funnel · full-brain · psychology-backed · incrementality · compounding · profit-first · creative system · neural pathways · signal vs. noise.

**Emoji.** **None.** The brand never uses emoji. Iconography is geometric or typographic instead (see ICONOGRAPHY).

**Examples (verbatim brand copy):**
- "Custom built for DTC brands wanting to scale *profitably, predictably* & with clarity"
- "Your *Full-Funnel* DTC Growth Partner"
- "Rebuilding Neural Pathways."

---

## VISUAL FOUNDATIONS

**Overall feel.** Brutalist Swiss-grid meets rave-flyer. High-contrast, loud, technical, a touch lo-fi. Think halftone print, 8-bit pixel glitch, isometric blocks, and heavy grotesque type on pure black.

**Color (STRICT — never introduce any other color).**
- **Black** `#0C0C0C` — primary background for dark pages, footer bars, fee blocks
- **Acid Yellow** `#FEEF24` — the hero accent: highlights, section-number chips, cover panel, key figures (matches the logo artwork exactly)
- **Signal Red** `#FF2600` — **used very sparingly.** Reserved for: the square full stop at the end of a headline, one square in a pixel cluster, the occasional micro-label, and the "/-" after prices. **Not a UI fill** — buttons, focus rings, numerals, and list bullets are ink/yellow, never red. Error states are the one functional exception.
- **White** `#FFFFFF` — light page backgrounds
- **Grey** `#8A8A8A` (light pages) / `#B5B5B5` (dark pages) — secondary body text
Structural hairlines and sunken fills are alpha tints of black/white only. The legacy `--gray-*` aliases map onto this strict palette.

**Type (STRICT).** Three families, rigid jobs (`tokens/typography.css`):
- **FH Lecturis Bold** — **COVER HEADLINE ONLY.** Large (~50pt at print scale), tight leading (~0.98), yellow on black, ends with a red full stop. Never used for any other heading. **Always set alone** — `font-family: "FH Lecturis"` with no fallback fonts in the stack.
- **DM Sans** — everything else. Headlines: Bold, tracking −0.035em (25–32pt print). Body: Regular 9.5–11.5pt, line-height 1.4–1.55. Micro-labels: Bold, 7.5–9pt, letter-spacing 0.18–0.22em, ALL CAPS.
- **PP Editorial New Italic** — accent serif only for: (a) **highlighted words** — any word on a yellow highlight block always switches to PP Editorial New Italic, (b) italic emphasis phrases in body copy, (c) single-line pull-quote banners, (d) the back-cover sign-off line.

**Signature moves (these make it "Neuroid").**
- **Yellow-highlight words:** 1–2 key words per headline get a solid yellow background block and **always switch to PP Editorial New Italic** (`.nrd-highlight`).
- **Square red full stop:** display headlines end with a small **red square block** (not a round period) — block-focused per the moodboard (`.nrd-stop`).
- **Pixel squares:** the motif ■ ■ ■ (yellow, yellow, red) appears in footers and as small punctuation on cards/banners (`.nrd-pixels`).
- **Halftone texture:** a coarse black-and-white halftone bleeding off one edge of the cover and back cover, ~35–50% opacity, never behind body text.

**Backgrounds & texture.** **Content slides and pages with text are FLAT black or white — no texture, ever.** The halftone appears ONLY as a masked edge-bleed on the cover and back cover: `assets/textures/halftone-coarse.png`, one edge, 35–50% opacity, `background-size: cover` (never tiled — the scan repeats visibly), never behind text (`.nrd-halftone-bleed`). Other accents — technical dot-grids, line-grids, voxel/pixel clusters — are small, deliberate elements, not page fills. Imagery is high-contrast **black & white with heavy grain/halftone**, occasionally a single image in a **rule-of-thirds yellow grid overlay**. No soft photographic gradients; no purple/blue tech gradients — *ever*.

**Moodboard motifs** (see `assets/brand/moodboard-2026.png`):
- **Halftone-filled display type** — huge headlines whose letterforms are filled with a checkered/halftone texture instead of a solid, set on a dotted black field ("Rewriting Neural Pathways").
- **Constructivist block sculpture** — isometric 3D assemblies of black/red/yellow slabs and rods on grainy grey; Bauhaus color-block grids (red/yellow/black/white).
- **Pixel glitch** — solid yellow panels with 8-bit corroded/eroded edges over B&W photographic noise; scattered pixel-cluster constellations on white.
- **Photo grid overlay** — portraits in B&W or warm tone under a yellow rule-of-thirds grid, captioned with tiny micro-labels.
- **Pixel-corrupted glyphs** — display words where a few letters decay into pixels (use sparingly, for posters only).
- **Ticker bars** — repeating ALL-CAPS micro-label strips ("BUILD HUMAN BRANDS · …") stacked in ink-on-yellow / yellow-on-ink pairs (`.nrd-ticker`, `.nrd-ticker--yellow`).

**Corners & borders.** **Sharp by default** — `--radius-0` (0px) is the norm. Rounding (≤8px, or pill for chips) is a rare exception. Borders are **heavy hairlines** in ink: 1.5–3px. Dividers are full-strength ink rules, not light grays.

**Elevation.** **Flat, printed.** Depth is expressed as **hard offset shadows** (`3px 3px 0`, `6px 6px 0`) in ink, yellow, or red — never soft blur. Soft blur (`--shadow-pop`) is reserved strictly for floating UI (menus, toasts). Cards are a hairline box; the "block" card adds the offset shadow.

**Motion.** Snappy and mechanical. Short durations (120–360ms), crisp clipped easing (`--ease-snap`). Buttons **translate into their shadow** on press. Fades are quick; no bounce, no decorative loops on content.

**Hover / press.**
- *Hover:* subtle — darken the fill or lift into a hard shadow.
- *Press:* the element **moves down-right into its offset shadow** (block buttons) or nudges 1px (flat buttons). Tactile, like pressing a key.

**Focus.** Red 2px outline (`--focus-ring`), 2px offset — loud and accessible.

**Transparency & blur.** Used rarely. Halftone fields use low-opacity white dots over ink; otherwise the system is opaque. No frosted glass.

**Layout.** Generous 8px grid, wide gutters, large left/right padding on slides (~72px at 1280). Eyebrow → headline → body rhythm. Asymmetric, grid-broken compositions are encouraged (a block bleeding off the edge, a number in the corner).

---

## ICONOGRAPHY

Neuroid's icon language is **geometric and typographic, not pictographic**:

- **The mark.** The Neuroid logo is an **isometric voxel "N"** (stacked yellow cubes). It's the primary brand glyph and lives in `assets/brand/` in three lockups (on ink / on yellow / on paper) plus an isolated transparent mark.
- **Pixel / voxel blocks.** Square 8-bit cells in yellow-red-black-white stand in for "iconography" — see the **Voxel motif** card and `tokens/effects.css`.
- **Typographic markers.** Numbers (`01 — 04`), the **red full stop**, the `▪` square bullet, `×` and `&` are used as iconographic accents.
- **No emoji. No icon font shipped.** When functional UI icons are genuinely needed (chevrons, checks, close), use **inline SVG with square line-caps and ~2px stroke in ink** — see the chevron in `Select` and the check in `Checkbox` for the house style. If a broader UI icon set is required, substitute **[Lucide](https://lucide.dev)** at 2px stroke and square joins as the closest match, and **flag the substitution** — no brand icon set was supplied.

---

## INDEX — what's in this repo

**Foundations**
- `styles.css` — the single entry point (imports only). Consumers link this.
- `tokens/fonts.css` — `@font-face` for FH Lecturis, DM Sans, PP Editorial New.
- `tokens/colors.css` — brand + neutral ramp + semantic aliases.
- `tokens/typography.css` — families, weights, fluid scale, tracking, leading.
- `tokens/spacing.css` — 8px scale, containers, radii, stroke widths.
- `tokens/effects.css` — hard-shadow elevation, motion, signature textures (+ `.nrd-*` utility classes).
- `tokens/base.css` — element defaults wiring tokens to the document.

**Components** (`components/`) — React primitives, bundled to `window.NeuroidDesignSystem_257bac`:
- `core/` — `Button`, `Badge`, `Tag`, `Card`, `Avatar`
- `forms/` — `Input`, `Select`, `Checkbox`, `Switch`

**Brand assets** (`assets/`)
- `assets/brand/` — **vector logos (canonical)**: `neuroid-logo.svg` (white wordmark — dark backgrounds), `neuroid-logo-black.svg` (black wordmark, yellow mark — white backgrounds), `neuroid-logo-on-yellow.svg` (black wordmark, black-and-white voxel mark — **ALWAYS use this on yellow backgrounds**), `neuroid-icon.svg` (the voxel-N mark alone). The logo's yellow is the system's Acid Yellow `#FEEF24`. Legacy raster extractions (`neuroid-logo-*.png`, `neuroid-mark.png`) and `neuroid-logo-all-black.svg` remain for reference. Also `moodboard.png`, `moodboard-2026.png` (primary art-direction reference), `textures-patterns.png`.
- `assets/textures/` — `halftone-coarse.png`: the ONE halftone scan, for cover/back-cover edge bleeds only. Content surfaces stay flat.
- `assets/fonts/` — the four supplied font binaries.

**Slides** (`slides/`) — 1280×720 deck specimens: `TitleSlide`, `SectionSlide`, `ComparisonSlide`, `StatSlide`, `QuoteSlide`, `ContentSlide`.

**Specimen cards** (`guidelines/cards/`) — the small HTML cards that populate the Design System tab (Type, Colors, Spacing, Brand).

**Skill** — `SKILL.md` makes this folder usable as a downloadable Agent Skill.

---

## Using the system

Link the stylesheet and read components off the namespace:

```html
<link rel="stylesheet" href="styles.css" />
<script src="_ds_bundle.js"></script>
<script>
  const { Button, Card, Badge } = window.NeuroidDesignSystem_257bac;
</script>
```

Build on tokens, not hard-coded values: `var(--neuroid-yellow)`, `var(--font-display)`, `var(--space-6)`, `var(--shadow-hard)`. Keep corners sharp, lead with ink + yellow, and let the red period do the talking.
