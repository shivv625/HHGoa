# HH Goa 2026 Frame Generator — Roadmap to Deadline

**Deadline: 11:59 pm, 13 August 2026** — build against this, not an abstract "36 hours."

## Priority Order (if time runs short, stop after any checkpoint and you still have a submittable product)

**Checkpoint 1 — Bare minimum submittable (Mode A only):**
Upload → crop → frame overlay → download → share to X with working OG image.
This alone satisfies the PDF's core requirements.

**Checkpoint 2 — Competitive submission:**
Checkpoint 1 + Builder Card mode (Mode B) + procedural builder title.

**Checkpoint 3 — Standout submission:**
Checkpoint 2 + Squad Frame mode (Mode C) + variant cycling + polished mobile pass.
This is what actually matches the live site's stated task (combined teammate frame) and is
where the "unique touch" differentiation lives.

## Suggested Timeline

| Time block | Focus |
|---|---|
| Now – +3h | Scaffold, deploy empty shell, confirm live URL works |
| +3h – +8h | Upload + HEIC handling + crop UI, tested on real phone |
| +8h – +14h | Canvas compositing core + frame art assets (Mode A) |
| +14h – +16h | Download working, Checkpoint 1 reached — you have a submittable fallback |
| +16h – +20h | Share to X + OG image, tested for real in a tweet compose box |
| +20h – +26h | Builder Card mode + procedural title generator — Checkpoint 2 |
| +26h – +32h | Squad Frame mode (2–3 photos) — Checkpoint 3 |
| +32h – +36h | Variant cycling, mobile pass on real device, fix what breaks |
| +36h – +40h | Final QA checklist from `03-implementation.md`, then submit early |

**Buffer rule:** aim to have Checkpoint 2 done with at least 12 hours of margin before the
deadline. Squad Frame (Checkpoint 3) is the differentiator but Checkpoint 2 alone is a solid
submission — don't let Mode C block you from submitting something polished.

## What To Do Once You Have the Brand Kit
1. Swap the placeholder CSS variables in `01-design.md` §1 with real hex codes/fonts
2. Replace placeholder frame overlay art in `/public/brand/frame-assets/` with anything using
   the real logo/wordmark
3. No other code changes needed if the design system is followed — colors/fonts/assets are
   referenced, not hardcoded, throughout

## What To Do Once You Have the Correct Repo
- Check for any existing scaffold, shared components, or a design system already in progress —
  reuse rather than rebuild if the repo has a head start
- Re-run Step 0 in `03-implementation.md` as "audit existing structure" instead of "scaffold
  from scratch" if there's meaningful existing code
