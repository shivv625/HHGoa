# HH Goa 2026 Frame Generator — Architecture

## Stack
- **Framework:** Next.js 14+ (App Router) — deployed on Vercel for instant HTTPS + easy OG image support
- **Styling:** Tailwind CSS
- **Image compositing:** Client-side Canvas API (no server round-trip — required for the
  "few seconds, not a loading screen" speed requirement)
- **Crop/reposition UI:** `react-easy-crop` (lightweight, mobile-friendly pinch/drag support)
- **HEIC support:** `heic2any` — convert client-side on upload before anything touches canvas
- **Temp storage for share images:** Vercel Blob (free tier is enough for a hackathon submission)
- **Optional counter/social proof:** Vercel KV (or just a simple JSON file / Blob-based counter
  if KV setup eats too much time — don't let this block the deadline)

## Why client-side canvas, not server-side image generation
Server-side (e.g. `sharp` in an API route) is more "correct" for consistent output but adds
network round-trip latency and server compute — the requirement explicitly says "a few seconds,
not a loading screen." Client canvas gives near-instant feedback and live preview while typing.
The only thing that needs a server round-trip is uploading the *final* PNG to Blob storage
right before generating the share link — everything else stays local.

## File Structure

```
/app
  /page.tsx                  → landing + mode toggle
  /generator/page.tsx        → main upload → crop → fields → result flow (client component)
  /share/[id]/page.tsx       → dynamic OG-image page for a specific generated graphic
  /api/upload/route.ts       → POST: accepts final PNG blob, stores it, returns share id
  /layout.tsx                → global fonts, meta defaults

/components
  /UploadStep.tsx
  /CropStep.tsx               → wraps react-easy-crop
  /FieldsStep.tsx              → name/stack inputs, Mode B/C only
  /ResultPanel.tsx             → preview + download + share buttons
  /FrameCanvas.tsx             → core canvas compositing logic (the heart of the app)
  /ModeToggle.tsx

/lib
  /canvas
    /drawFrameSolo.ts          → Mode A compositing
    /drawBuilderCard.ts        → Mode B compositing
    /drawSquadFrame.ts         → Mode C compositing (2-3 photos)
    /generateBuilderTitle.ts   → procedural title logic from stack input
  /heic.ts                     → HEIC → JPEG conversion wrapper
  /twitterIntent.ts             → builds the pre-filled tweet URL

/public
  /brand
    /frame-assets/...          → SVG/PNG overlay art (border, wordmark, palm accents)
    /variants/...               → 2-3 color variant assets for "regenerate variant"
```

## Data Flow

1. User selects mode → uploads 1–3 images (client)
2. HEIC converted client-side if needed → shown in crop UI
3. User adjusts crop per photo → on every change, `FrameCanvas` redraws to an offscreen
   `<canvas>` at 2x resolution and updates the visible preview (throttled, not on every pixel
   of drag — debounce ~50ms for smoothness)
4. Fields (Mode B/C) update the canvas text layers live, same debounce approach
5. On "Download": `canvas.toBlob('image/png')` → triggers browser download, no server involved
6. On "Share to X":
   a. Canvas blob POSTed to `/api/upload` → stored in Vercel Blob → returns a short id
   b. Redirect/open `/share/[id]` in a new context is NOT needed for the user — instead,
      construct the X intent URL directly: `https://twitter.com/intent/tweet?text=...&url=<share-url>`
   c. `<share-url>` = `https://yourapp.vercel.app/share/[id]` — this page's OG meta tag points at
      the stored PNG, so X's own crawler renders it as the tweet preview image
7. `/share/[id]/page.tsx` is a lightweight server component: fetch blob metadata, set
   `og:image`, `og:title`, `twitter:card = summary_large_image`, then just show the image
   full-page with a "Make your own" CTA button (this doubles as the "how-to" surface)

## Key Technical Risks (address these first, they're the classic demo-killers)

| Risk | Mitigation |
|---|---|
| HEIC upload fails silently on some iPhones | Test with an actual iPhone photo before build day ends, not just simulator |
| Canvas export blurry on retina phones | Always render at 2x+ internal resolution, scale down only for on-screen preview |
| OG image doesn't show in tweet preview | Test with a real tweet compose box or opengraph.xyz — cached previews can lie, use a fresh id per test |
| Long names/text overflow the card | Auto-shrink font size algorithm, test with a 25+ char name |
| Off-center/odd aspect photos look bad in frame | Fixed-aspect crop mask forces good composition regardless of source photo shape |
| Squad frame with photos of very different aspect ratios | Each photo gets its own independent crop step before being placed into the combined layout |

## Environment / Deploy Notes
- Vercel free tier covers this comfortably for a hackathon submission
- No auth, no database required — Blob storage keyed by generated id is sufficient
- Keep bundle light — avoid heavy animation libraries; motion can be plain CSS transitions
