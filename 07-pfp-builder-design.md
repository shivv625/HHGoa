# PFP Builder Screen — Polish & Alignment Design Spec

## Diagnosis: why it currently looks generic and unaligned

1. **No live "true preview."** The user only sees the raw crop tool (a bare circle/square over
   their photo). They never see the actual branded frame overlaid until after they confirm —
   so "is this actually going to look right" is invisible until too late. This is very likely
   the root cause of "photo not properly adjusted."
2. **Unstyled crop library defaults.** `react-easy-crop` ships with a plain grid overlay, a
   thin default drag handle feel, and no visual relationship to the brand — it looks bolted on,
   not designed.
3. **Inconsistent fit-mode on load.** If the initial zoom/position isn't computed from the
   photo's actual aspect ratio, portrait photos, landscape photos, and square photos all land
   differently — sometimes with letterboxing gaps, sometimes over-zoomed, sometimes off-center.
   The fix is a deterministic initial-fit calculation, not user luck.
4. **No layout grid.** Controls (zoom slider, buttons, labels) are likely placed ad hoc rather
   than on a consistent spacing/alignment system, so nothing lines up with anything else on the
   page — including the polished landing page it now has to live up to.
5. **Visual disconnect from the landing page.** If this screen drops the aurora background,
   fonts, and glass-panel language established on the landing page, it reads as a different,
   less-finished app bolted onto a nice hero. Continuity matters as much as the screen itself.

## 1. Layout — Desktop (≥1024px): split-pane, not stacked

```
┌─────────────────────────────────────────────────────────────┐
│  [progress: Upload → Adjust → Details → Share]  ← thin, top   │
├───────────────────────────┬───────────────────────────────────┤
│                           │                                   │
│   CROP / ADJUST PANE      │   LIVE FRAMED PREVIEW             │
│   (glass panel)           │   (glass panel, sticky)           │
│                           │                                   │
│   - photo with mask       │   - the actual composited output  │
│     overlay (frame-       │     at reduced size, updating in  │
│     shaped, not a bare    │     real time as user adjusts     │
│     circle/rect)          │     zoom/position                 │
│   - zoom slider (custom   │   - this IS what downloads, shown │
│     styled)               │     honestly, not a preview of a  │
│   - drag-to-reposition    │     preview                       │
│   - "Reset" + "Center"    │                                   │
│     quick actions         │                                   │
│                           │                                   │
├───────────────────────────┴───────────────────────────────────┤
│              [ ← Back ]                [ Continue → ]          │
└─────────────────────────────────────────────────────────────┘
```

The core fix: **the crop pane and the true preview pane sit side by side and update in sync.**
The user is never guessing what the final frame will look like — they're looking straight at it
while they adjust. This alone resolves most "photo not properly adjusted" complaints, because
misalignment becomes visible and correctable in real time instead of a surprise on the result
screen.

## 2. Layout — Mobile (<1024px): stacked but preview-first

```
┌───────────────────┐
│  progress dots     │
├───────────────────┤
│  LIVE FRAMED       │  ← preview on top, always visible while
│  PREVIEW           │     scrolling/adjusting below — this is
│  (compact, sticky  │     the part that matters most on a small
│  under progress)   │     screen, so it gets priority position
├───────────────────┤
│  CROP / ADJUST     │
│  - drag directly   │
│    on photo         │
│  - zoom slider      │
│    (large touch      │
│    target, full-    │
│    width)            │
├───────────────────┤
│  [ Continue → ]    │  ← full-width, thumb reachable, fixed to
│                     │     bottom of viewport
└───────────────────┘
```

## 3. Crop mask treatment — make it look intentional, not like a raw tool

- The crop mask (the circle/square the user drags their photo behind) should be drawn as the
  **actual frame shape with actual frame art at reduced opacity** overlaid on top of the crop
  area — not a plain dashed circle. The user should see roughly where the branded border will
  sit while they're still adjusting, not just a generic crop guide.
- Darken/dim everything **outside** the mask (semi-transparent dark overlay on the
  non-selected photo area) so the eye is drawn to what will actually appear — standard photo-
  editor convention, and it alone makes the tool look considered rather than default.
- Replace the default drag handles/grid lines from the crop library with a custom minimal
  overlay: a thin brand-colored ring around the mask edge, no visible grid lines cluttering the
  photo itself.

## 4. Deterministic initial fit (fixes "photo not properly adjusted" directly)

On photo load, before the user touches anything:
1. Compute the photo's natural aspect ratio
2. Compute the crop mask's target aspect ratio (1:1 for PFP)
3. Set initial zoom so the **shorter** dimension of the photo exactly fills the mask (i.e.
   `cover` behavior, never `contain` — there should never be visible gaps/letterboxing inside
   the mask on first load, regardless of source photo shape)
4. Center the photo in the mask on both axes by default
5. This calculation must run fresh per-upload — don't carry over zoom/position state from a
   previously uploaded photo if the user re-uploads

This removes the "different result depending on what photo you happened to pick" problem
entirely — every photo starts from a correctly-filled, centered position, and dragging/zooming
from there is a refinement, not a rescue.

## 5. Controls — styled, not default

- **Zoom slider:** custom-styled range input — thin track using a brand gradient fill up to
  the thumb position, larger circular thumb with a subtle shadow (not the default OS slider
  look). Label it plainly: "Zoom" with a small in/out icon on each end, not a bare number.
- **Reposition:** drag directly on the photo itself (not a separate control) — most intuitive,
  matches every modern photo-crop UX pattern (Instagram, Twitter/X avatar upload, etc.)
- **Quick actions:** "Center" (resets position, keeps zoom) and "Reset" (resets both) as small
  ghost-button text links under the slider, not competing visually with the primary Continue
  button
- **Rotate (if supported):** small icon button, top-right corner of the crop pane, not mixed
  in with zoom controls

## 6. Alignment system — put this screen on the same grid as the landing page

- Reuse the landing page's spacing scale, corner radius scale, and glass-panel treatment
  (`backdrop-blur`, gradient border, same light-source direction) — this screen should feel like
  the same product, not a different one bolted on after a nice hero
- Content max-width should match the landing page's content container, not stretch full-bleed
  or float independently — everything lines up to the same vertical column across the whole app
- Keep the aurora background from the landing page running underneath, at reduced blob opacity
  so it doesn't fight with the photo/UI for attention, but the continuity is felt

## 7. Motion — subtle, functional, not decorative here

Unlike the landing hero, this screen is a *tool* — motion should clarify, not perform:
- Live preview pane updates should feel instant but not jarring: debounce redraws ~50ms, no
  animated transition on the actual pixel content, just direct redraw
- Panel entrance (on arriving at this step from upload): single clean fade+slight-slide, once,
  not staggered/showy
- Continue button: disabled/inactive state until a valid crop exists, with a simple opacity +
  cursor change — no need for anything elaborate here, clarity beats flair on a functional step

## 8. Empty/edge states (currently likely missing, contributing to "unpolished" feel)
- While the photo is loading/decoding (especially HEIC conversion): a skeleton/shimmer in the
  shape of the crop mask, not a blank white box or a generic spinner
- If HEIC conversion fails: a clear inline message with a retry/re-upload action, styled
  consistently with the rest of the panel, not a raw browser alert
- If the photo is very small (below the mask's target resolution): a small non-blocking warning
  ("This photo may look blurry when zoomed") rather than silently producing a soft output
