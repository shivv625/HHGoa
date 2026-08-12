# HH Goa 2026 — Landing Page Premium Redesign Spec

## Why the current version reads as generic/AI-made
Being specific about the tells matters because fixing them is the whole job:
- Perfectly centered, symmetric single-column stack — nothing off-grid
- Flat static gradient background, no depth, no movement
- Three cards, identical size, identical layout (icon-left, text-right), identical rounded-2xl
  treatment — no visual hierarchy between them
- Generic emoji/lucide icons in flat colored squares
- Default drop-shadow-free flat surfaces, no light source, no material feel
- Static — nothing moves until you interact, and nothing reacts to interaction

Everything below targets one of these directly.

## 1. Typography — stop using the default pairing
Drop generic Inter/Space Grotesk-everywhere. Use:
- **Display/headline:** `Clash Display` (Fontshare, free, geometric-bold, distinctive weight
  contrast) — this single swap does more to kill the "AI generated" look than anything else
- **Body/UI:** `General Sans` (Fontshare, free, warm humanist sans)
- **Mono/eyebrow/dates:** keep `JetBrains Mono` — it's already doing good work signaling
  "builder/dev culture"

Headline should NOT be perfectly centered as one block. Break "Make Your" and "#FrameInGoa"
into two lines with **different left-edge alignment** (slight offset, not full justify) —
asymmetry reads as designed, not generated.

## 2. Background — layered aurora mesh, not a flat gradient
Replace the single linear/radial gradient with:
- 3–4 large blurred color blobs (`filter: blur(100–140px)`, radial-gradient fills using the
  sunrise/ocean palette), each with its own slow independent drift animation
  (`translate` + subtle `scale` over 18–30s loops, staggered, `ease-in-out infinite alternate`)
- A fixed SVG grain/noise overlay (`feTurbulence` + `feColorMatrix`, opacity 3–5%,
  `mix-blend-mode: overlay`) on top of everything — this single layer is what makes flat digital
  gradients look like a physical, designed surface instead of a CSS default
- Mouse-driven parallax: blobs shift ±15–25px opposite to cursor position (cheap, just a
  `transform: translate3d` tied to pointer position with easing/lerp, no physics engine needed)
- Subtle vignette (radial dark overlay at the edges) to keep focus centered on content

## 3. Hero headline — kinetic entrance, not static text
- Eyebrow date pill (`28–31 OCT 2026 · GOA, INDIA`): give it an actual pill container with a
  1px border, faint background, and a small pulsing "live" dot to its left (scale+opacity pulse
  loop, 2s)
- Headline lines animate in on load: each line starts `opacity:0, blur(8px), translateY(20px)`
  and resolves to sharp/visible, staggered ~120ms per line (framer-motion `variants` +
  `staggerChildren`)
- `#FrameInGoa` gets an animated gradient text fill — `background-clip: text` with a
  amber→gold→amber gradient, `background-size: 200%`, slowly animating `background-position`
  left-to-right on loop (subtle, ~6s cycle, not flashy)
- Subhead line fades in last, after headline settles

## 4. Mode cards — break the uniformity, add real material feel
Current: 3 identical rows. New treatment:
- **Give Squad Frame visual priority** (it's the differentiator per the actual task) — make it
  wider or positioned first/featured, not the same size as the other two. Breaking the "3 equal
  rows" pattern alone kills a lot of the templated feel.
- **Glass material, not flat fill:** `backdrop-filter: blur(20px)`, semi-transparent background,
  a 1px border using a gradient (via a pseudo-element or `border-image`) that's brighter at the
  top-left (simulated light source) and fades toward bottom-right
- **Cursor-reactive 3D tilt:** on mouse move within a card, compute cursor position relative to
  card center and apply `rotateX`/`rotateY` (small range, ±6deg) via
  `transform: perspective(800px) rotateX() rotateY()` — this is the single highest-impact "feels
  premium" effect and is pure CSS/JS, no 3D library required
- **Cursor-follow glow:** a radial-gradient spotlight positioned at the cursor's coordinates
  inside the card (masked to the card bounds), so hovering feels like light is following you
- **Icon treatment:** replace flat lucide-in-a-box icons with line-draw SVGs that animate their
  stroke on scroll-into-view (`stroke-dasharray`/`stroke-dashoffset` transition) — or at minimum
  give icons a subtle idle animation (gentle float/rotate loop, different phase per card so they
  don't move in sync)
- **Staggered scroll-reveal:** cards enter with `opacity + translateY + blur` resolving,
  staggered by ~100ms, triggered by `IntersectionObserver` (or framer-motion `whileInView`)

## 5. Optional Tier 2 — true 3D element (only if time allows, has a CSS fallback)
A small `react-three-fiber` scene behind/beside the headline: a slowly rotating abstract
low-poly form (think a faceted sun/wave shape, not a literal palm tree — literal 3D palm trees
read as clip-art) lit with warm/cool rim lighting matching the brand gradient. Subtle
scroll-linked rotation, nothing that demands GPU-heavy specs.

**Fallback if this risks the deadline:** a large soft-edged radial-gradient "orb" with a fake
specular highlight (a smaller, brighter, blurred white-ish ellipse offset toward one corner) and
a slow rotation/breathing animation — gets 70% of the visual richness with 5% of the build risk.
Default to the fallback unless Checkpoint 2 (see `04-roadmap.md`) is already done with real
margin left before the deadline.

## 6. Micro-details that read as "designed," not generated
- Custom cursor on desktop only: small circular blob (mix-blend-mode: difference) trailing the
  real cursor with slight lag/easing — disable entirely on touch devices
- Small live counter chip, bottom corner: "N builders have made their frame" with an animated
  count-up on load (don't overthink the backend — a simple incrementing stored number is enough)
- Section transition: as user scrolls from hero into the generator flow, the aurora background
  blobs should shift color temperature slightly (warmer → cooler) rather than hard-cutting to a
  new background — continuity of the background across sections is a strong premium signal

## 7. Motion tech choices
- **Framer Motion** for all React-driven entrance/stagger/hover animations — lightweight, no
  reason to hand-roll this
- **CSS keyframes** for the ambient/looping background blob drift (cheaper than JS-driven loops,
  runs on the compositor thread, won't jank on mobile)
- **react-three-fiber + drei** only for the optional Tier 2 3D element — do not pull this in for
  anything the CSS/Framer Motion approach already handles well
- Respect `prefers-reduced-motion`: provide a static fallback (no drift, no tilt, no parallax)
  for anyone with that OS setting — required for accessibility, also a sign of a considered build

## 8. What NOT to do (common overcorrections)
- Don't make everything rounded-3xl with the exact same radius — vary it slightly by element
  hierarchy (larger radius on the featured card, tighter on chips/pills)
- Don't add motion to everything at once — the aurora background should be the only thing
  always-moving; card tilt/glow should be interaction-only; entrance animations should run once,
  not loop
- Don't use a literal 3D palm tree, sunglasses, or beach-emoji-style clipart — abstract
  geometric/light-based 3D reads premium, literal illustrated icons read like a template
- Keep the copy exactly as-is (`Make Your #FrameInGoa`, the mode names/descriptions, the date
  line) — this spec is about visual/motion treatment, not new content
