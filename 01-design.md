# HH Goa 2026 — Frame / ID Card Generator — Design Spec

## 1. Brand Theme (from hhgoa.com — swap in exact assets once Brand Kit is in hand)

**Vibe:** Not a cutesy hackathon badge. Not corporate. High-signal, blunt, "we build, no fluff"
energy — mirrors copy like *"Less Noise. More Signal"* and *"lock in and build your legacy."*

**Visual motifs from the site:**
- Sunrise over water — warm gradient (deep navy/ocean → amber/orange sunrise) as the dominant palette direction
- Palm trees / coastline silhouettes as accent shapes, not literal clipart
- "2:47 pm Studio" — a specific timestamp is part of their identity; consider working a time-stamp / coordinate-style detail into the frame (e.g. small "28–31 OCT 2026 · GOA, INDIA" tag, mono-spaced)
- Minimal, confident typography — large bold headline type + a monospace/technical secondary font (terminal/dev culture nod — "developers who live in their terminals")
- Dates: **28–31 OCT 2026, GOA, INDIA**
- Task name in-product: **"🌴 Builder ID"**
- Hashtag: **#FrameInGoa**

**Placeholder tokens (replace once Brand Kit downloaded):**
```
--hhg-navy:      #0B1A2B   /* deep ocean/night */
--hhg-sunrise-1: #FF7A45   /* amber */
--hhg-sunrise-2: #FFC857   /* gold */
--hhg-sand:      #F4E8D8   /* light neutral */
--hhg-accent:    #2FBF9F   /* palm/teal, tentative */
--font-display:  'Space Grotesk' or similar bold geometric sans
--font-mono:     'JetBrains Mono' or 'IBM Plex Mono'
```
Once you have the real Brand Kit, replace this block 1:1 — nothing else in the app should need
to change since colors/fonts are referenced as CSS variables throughout.

## 2. Two Modes (per official task, both required conceptually)

### Mode A — Solo PFP Frame
- Upload one photo → reposition/zoom inside a circular or square crop → frame overlay wraps it
  in HH Goa branding (sunrise gradient border, small "GOA 2026" wordmark, palm accent corner)
- Output: 1080x1080 PNG, ready as a profile picture

### Mode B — Builder ID Card
- Upload photo + fields: **Name**, **Stack/Role** (free text, e.g. "Full-stack, Rust/TS")
- App **auto-generates a "Builder Title"** from the stack input (procedural, fun — e.g. someone
  typing "backend, Go" might get "Infra Architect" / "Systems Alchemist")
- Laid out like an event badge: photo top, name large, generated title as a tagline, small
  stack tag, HH Goa 2026 wordmark + dates footer
- Output: portrait card, e.g. 1080x1350 (good for X image preview)

### Mode C — Squad Frame (the extra requirement from the live site, not in the PDF)
The site's actual task copy says: *"Use that same generator to bring your teammates into one
combined frame."* This is a differentiator most submissions will miss since it's only on the
site, not the PDF. Build it as a natural extension of Mode A:
- Allow 2–3 photo uploads instead of 1
- Frame template dynamically adjusts layout: solo = single circle/square; 2 people = side-by-side
  split frame; 3 people = triangle/cluster layout (nice callback to their "Day 02 - day of
  triangle" agenda copy — subtle but a judge who reads their own site closely will notice)
- Same download + share flow

## 3. Screen Flow (mobile-first, single page, no routing needed)

```
[Landing / Hero]
   - HH Goa 2026 sunrise gradient background
   - Big headline: "Make Your #FrameInGoa"
   - Mode toggle: [ PFP Frame ] [ Builder ID ] [ Squad Frame ]
        ↓
[Upload Step]
   - Drag/tap to upload (1–3 images depending on mode)
   - Auto-converts HEIC client-side, shows thumbnail immediately
   - Crop/reposition control (pinch-zoom + drag on mobile, scroll+drag on desktop)
        ↓
[Fields Step] (Mode B/C only)
   - Name, Stack/Role inputs
   - Live preview updates as they type — no separate "generate" click
        ↓
[Result]
   - Full-size preview of final graphic
   - [ Download ] — real PNG file
   - [ Share to X ] — opens pre-filled tweet, caption + #FrameInGoa auto-included
   - Small "Regenerate variant" button — cycles 2–3 frame color/pattern variants
```

## 4. Layout Details

- **Canvas size:** work at 2x final resolution internally (e.g. render at 2160x2160, export
  at 1080x1080) so downloads look crisp on retina/high-DPI phone screens
- **Crop handling:** never assume a square input. Use a fixed-aspect crop window (circle/square
  mask) that the user drags their photo behind — this is what actually satisfies "off-center
  crops, different aspect ratios" from the requirements, not fancy cropping UI
- **Safe zone:** keep faces/subject inside the inner ~80% of the frame — outer 20% reserved for
  the branded border so cropped subjects never get clipped by frame art
- **Text on Card mode:** name should auto-shrink font size if long (avoid overflow — test with
  a genuinely long name, not just "Alex")

## 5. Share Card / OG Image

- Every generated graphic gets a unique share URL: `/share/[id]`
- That page's `<meta property="og:image">` points directly to the generated PNG (stored via
  Vercel Blob or similar) — this is what makes the link preview show the actual graphic instead
  of a blank default thumbnail
- Pre-filled tweet text template:
  `"Just made my HH Goa 2026 frame 🌴☀️ #FrameInGoa [link]"` — keep it short, let the image do
  the work, since the Radar feature on hhgoa.com/radar pulls from the hashtag

## 6. Unique/Differentiating Touches (ranked by effort vs. impact)

1. **Squad Frame mode** — matches the site's actual (not PDF's) requirement, most teams will miss this
2. **Procedural Builder Title generator** — cheap to build, memorable, judges notice playful details
3. **Live preview, no "Generate" button** — feels instant, meets the speed requirement naturally
4. **"How-to" micro-flow baked into the share caption** — the site literally asks for *"a quick
   how-to on generating your own #FrameInGoa post"* — add a tiny "?" tooltip/step that, when
   shared, includes a short line like "made with [your-app-url] — try yours" so the share itself
   IS the how-to, satisfying that requirement without extra work
5. **Frame variant cycling** — feels customizable without needing a full theme system
