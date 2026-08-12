# HH Goa 2026 Frame Generator — Implementation Guide

Use this as the working task list inside Antigravity. Each section is scoped to be handed to
the agent as a self-contained chunk of work. Build in this order — later steps depend on earlier
ones working.

## Step 0 — Scaffold & Deploy Empty Shell
- `npx create-next-app@latest` with App Router + Tailwind + TypeScript
- Push to GitHub, connect to Vercel, confirm a live URL works before writing any feature code
- Add placeholder brand color variables in `globals.css` (from `01-design.md` §1) so styling is
  consistent from the first component onward

## Step 1 — Upload + HEIC + Crop (highest-risk part, do this first)
- Install `heic2any`, `react-easy-crop`
- Build `UploadStep.tsx`: file input (accept `image/*,.heic`), on select:
  - if file type is HEIC → convert via `heic2any` → get JPEG blob → create object URL
  - else → create object URL directly
- Build `CropStep.tsx` wrapping `react-easy-crop`:
  - fixed aspect ratio based on mode (1:1 for PFP, portrait ratio for Card)
  - `onCropComplete` callback stores crop pixel coordinates in parent state
- **Test explicitly on a real phone with a real iPhone photo before moving on** — this is the
  step most likely to silently break in a way that only shows up on real devices

## Step 2 — Canvas Compositing Core
- Build `lib/canvas/drawFrameSolo.ts`:
  - takes: source image + crop coords + variant index
  - draws to an offscreen canvas at 2160x2160 (2x target 1080x1080)
  - draws cropped photo first, then layers frame overlay PNG/SVG on top
  - frame overlay art itself should be pre-made assets in `/public/brand/frame-assets/` —
    generate these once brand kit colors are known (simple gradient border + wordmark + palm
    accent works fine, doesn't need to be elaborate)
- Wire this into `FrameCanvas.tsx` — a component that owns the visible `<canvas>` element and
  re-runs the draw function whenever crop or variant changes (debounce redraws ~50ms)
- Get Mode A fully working end-to-end (upload → crop → live preview → download) before touching
  Mode B or C — this is your fallback minimum-viable submission if time runs out

## Step 3 — Download
- Simple: `canvas.toBlob(blob => { trigger download via <a> element with URL.createObjectURL })`
- Filename convention: `hhgoa2026-frame-[mode]-[timestamp].png`

## Step 4 — Builder Card Mode (Mode B)
- Build `FieldsStep.tsx`: name input, stack/role input
- Build `lib/canvas/generateBuilderTitle.ts`:
  - simple keyword-matching: if stack contains "backend"/"infra"/"devops" → pick from a pool of
    titles like "Infra Architect", "Systems Alchemist"; "frontend"/"design" → "Pixel Sorcerer",
    "Interface Artisan"; "ai"/"ml" → "Model Whisperer", "Neural Cartographer"; fallback pool for
    unmatched input → generic but still fun titles ("Chaos Engineer", "Full-Stack Nomad")
  - keep this deterministic-ish (same input → same title) rather than fully random, feels more
    "generated for you" than "random"
- Build `lib/canvas/drawBuilderCard.ts`: photo + name (auto-shrink font if long) + generated
  title + stack tag + HH Goa wordmark/dates footer, portrait layout ~1080x1350
- Live-update canvas as fields are typed (debounced)

## Step 5 — Squad Frame Mode (Mode C)
- Extend `UploadStep.tsx` to accept 2–3 images when this mode is active
- Each photo gets its own `CropStep` instance (can be a simple carousel/stepper: "Photo 1 of 3")
- Build `lib/canvas/drawSquadFrame.ts`:
  - 2 photos: side-by-side split within the frame
  - 3 photos: triangular/cluster arrangement
  - reuse the same frame border/wordmark treatment as Mode A for visual consistency

## Step 6 — Share to X + OG Image
- Build `/api/upload/route.ts`: accepts POST with PNG blob, stores via Vercel Blob, returns
  `{ id }`
- Build `/share/[id]/page.tsx` (server component):
  - fetch stored image URL by id
  - set metadata: `og:image`, `og:image:width`, `og:image:height`, `twitter:card =
    summary_large_image`
  - render the image + a "Make your own HH Goa frame →" button linking back to `/generator`
- Build `lib/twitterIntent.ts`:
  - `buildTweetUrl({ shareUrl }) => `https://twitter.com/intent/tweet?text=${encodeURIComponent('Just made my HH Goa 2026 frame 🌴☀️ #FrameInGoa')}&url=${encodeURIComponent(shareUrl)}``
- Wire "Share to X" button: on click → upload blob → get id → open tweet intent URL in new tab
- **Test the OG preview for real** — paste the share URL into an actual tweet compose box (or
  https://opengraph.xyz) before considering this step done. Cached previews can lie, use a
  fresh id per test.

## Step 7 — Variant Cycling
- Prepare 2–3 frame asset variants (differ by accent color/pattern only, reuse layout)
- Small "cycle variant" button in `ResultPanel.tsx` that increments a variant index and re-runs
  the draw function

## Step 8 — Mobile Pass
- Test the full flow on an actual phone (not just devtools responsive mode):
  - upload from camera roll
  - pinch-zoom crop gesture works smoothly
  - buttons are thumb-reachable, not tiny
  - Share to X actually opens the X app or mobile web compose correctly
- Fix whatever breaks — this is where most of the remaining bugs will be

## Step 9 — Final QA Checklist Before Submission
- [ ] Works with zero login/signup at any point
- [ ] Upload → result feels like seconds, not a spinner
- [ ] Tested with portrait, landscape, and off-center source photos
- [ ] Tested with a genuinely long name (card mode doesn't overflow)
- [ ] Download produces an actual openable PNG file
- [ ] Share to X opens with caption + #FrameInGoa pre-filled
- [ ] OG image preview confirmed working in a real tweet compose box
- [ ] Tested on an actual phone, not just desktop browser resize
- [ ] Squad Frame mode works with 2 and 3 photos
- [ ] Live URL is publicly accessible (no Vercel preview/auth wall)
- [ ] Submit via https://forms.gle/jM5hTaGvsrfEfixPA before **11:59 pm, 13 Aug 2026**
