# Istabot homepage design system audit

Source: `https://demo.istabot.com`  
Audit date: 2026-10-25 (Europe/Istanbul)  
Evidence: Chrome 154 at 1440×1000, 1280×900, 768×1024 and 390×844; computed styles, DOM, CSSOM, resource timing, image intrinsic sizes, and runtime animation inspection.

## Evidence conventions

- **Verified** means read from computed CSS, CSSOM, the rendered DOM, or a public loaded resource.
- **Observed** means confirmed in the captured render but not exposed as a named token.
- **Unknown** means the implementation could not be proven from the public page. No design-tool provenance is inferred.
- The raw, reproducible evidence is in `raw-browser-audit.json`; `extract.mjs` reruns the browser capture.

## Design philosophy

Istabot uses a restrained, product-led SaaS language: a warm light-gray canvas, white inset surfaces, strong royal-blue actions, near-black editorial headings, and large amounts of vertical breathing room. Trust is communicated through product UI mockups, university marks, quantitative proof, transparent comparison, and an understated pricing system. Repeated double-surface cards—translucent outer shell plus solid white inner panel—provide depth without a dark or glass-heavy aesthetic.

The page is deliberately monochromatic outside the blue brand range. Most content is functional product demonstration rather than decorative illustration. On desktop, layouts are wide and grid-driven; below 1024px, multi-column systems collapse; below 768px spacing tightens and content becomes a single linear story.

## Foundations

### Color

The verified root tokens are `--bg-primary: #f0f0f0`, `--text-primary: #18181b`, `--page-max: 1440px`, and `--header-height: 80px`. Repeated page colors are:

| Role | Value | Use |
|---|---:|---|
| Canvas | `#f0f0f0` | Body and nearly every marketing section |
| Surface | `#ffffff` | Cards, internal product frames, footer |
| Translucent shell | `#ffffff8c` | FAQ and pricing outer panels |
| Heading | `#0a0a0a` | Section and card headings |
| Body | `#18181b` | Default foreground |
| Secondary | `#52525b` | Supporting copy |
| Muted | `#6b6b6b` / `#71717a` | Captions and metadata |
| Primary action | `#003cbd` | CTA background |
| Link blue | `#0047db` | Brand/link foreground |
| Accent blue | `#1d4ed8` | Badges and emphasis |
| Bright accent | `#3b6ef5` | CTA gradients/highlights |
| Soft blue | `#eef2ff` | Selected/subtle backgrounds |
| Default line | `#e5e7eb` | Dividers and controls |

The final CTA uses a saturated blue field and the hero visual uses a white radial glow. Exact gradient strings are preserved in the loaded CSS and raw CSSOM evidence. No global dark theme was found.

### Typography

The rendered family is `Inter, "Inter Fallback", Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`. Two same-origin WOFF2 resources are preloaded. The wordmark uses the separate `--font-family-sans-alt` stack beginning with `Sans`; the public resource names do not prove a commercial typeface identity, so it remains labeled only as `Sans`.

Typography is semibold and tightly tracked rather than heavy:

- Section display heading: computed `54.4px / 58.752px`, weight `600`, tracking `-2.448px` at 1440px; authored as `clamp(2.3rem, 1.4rem + 2.6vw, 3.7rem)` with line-height `1.04` and letter-spacing `-.045em`.
- Feature/card headings: typically `18.4–20px`, weight `600`, line-height `1.5`, tracking about `-.02em`.
- Lead/hero paragraph: `clamp(1.1rem, 1rem + .2vw, 1.2rem)`, line-height `1.6`, tracking `-.01em`.
- Controls and CTAs: usually `14px`, medium or semibold.
- Default body: computed `16px / 24px`, weight `400`.

The semantic `h1` is screen-reader-only while the visible animated hero title is assembled from other elements. This is an accessibility-oriented structure, not a visual type exception.

### Layout and spacing

- Maximum content width: `1440px` (`--page-max`).
- Header height: `80px`.
- Desktop section padding: `96px 24px 112px`.
- Mobile section padding: `72px 16px 80px`.
- Desktop hero grid: `minmax(0,580px) minmax(0,1fr)` with `3.5rem` gap.
- Feature grid: six equal columns on desktop, two at ≤1023px, one on mobile.
- Stats: four columns, then two at ≤1023px, then one at ≤480px.
- Process: two columns, one at ≤1023px.
- Pricing: three columns, two at ≤1023px, one on narrow screens.
- Blog: three columns, then two, then one.

Rendered page heights were 11,715px at 1440, 11,680px at 1280, 15,326px at 768, and 18,965px at 390. This confirms the responsive strategy is content reflow, not hiding major sections.

### Shape, border, and depth

Controls use 8–12px radii; ordinary product cards use about 14px; prominent marketing shells use 21–28px nested radii; badges are fully pill-shaped (`999px`). The visual hierarchy is created by fine one-pixel alpha borders and long, low-opacity shadows rather than thick borders. Verified shadow recipes are in `design-tokens.json`.

## Reusable patterns

1. **Section heading:** centered eyebrow or small badge, large tight display title, restrained muted description.
2. **Primary CTA:** royal-blue fill, white 14px text, 8–12px radius, layered blue shadow, 150ms material-style easing.
3. **Secondary CTA:** white surface, dark text, subtle border/neutral hover.
4. **Inset shell:** translucent white outer panel with 6–7px padding and large radius; opaque white inner panel with a smaller matching radius.
5. **Product proof card:** white UI fragment, thin alpha outline, tight 14px radius, practical data visualization.
6. **Trust badge/pill:** compact blue or neutral capsule, usually 12px semibold.
7. **FAQ accordion:** stacked inset shells; 40×40 neutral rounded toggle; content expands by animating grid rows.

## Responsive strategy

The main breakpoints evidenced in CSS are 1280px (desktop navigation and hero change), 1024px/1023px (grid collapse), 768px/767px (mobile typography and spacing), and 480px (single-column statistics). At 1280px and above the full nav is shown; below it, the mobile brand/actions replace the desktop links. At 768px the hero becomes vertically stacked and its top padding rises to 136px to clear the fixed mobile header. At 390px sections use 16px gutters and 72/80px vertical padding.

## Essential characteristics to reproduce

- Preserve the `#f0f0f0` continuous canvas and white inset surfaces.
- Use only a narrow blue spectrum for action and emphasis.
- Keep headings semibold, very tightly tracked, and large but not ultra-bold.
- Use long section spacing and wide desktop grids, then collapse predictably at 1023/767/480px.
- Demonstrate the product with credible miniature UI, not generic illustration.
- Reuse double-surface shells, fine alpha borders, and soft long shadows.
- Keep motion calm: staged entry, slow floating product devices, small hover shifts, and a restrained marquee.

## Limitations

Hover rules were inspected from CSS, but every possible pointer path was not exhaustively replayed. The public page exposed no source maps, design files, or authoring metadata. Analytics scripts were not treated as design dependencies. Screenshots represent the site as served during the audit and may differ if the live site changes.
