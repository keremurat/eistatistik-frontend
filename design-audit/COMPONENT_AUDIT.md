# Component audit

All dimensions below are verified at 1440px unless a breakpoint is named. Section screenshots are in `screenshots/component-*.png`.

## Navbar

Fixed, z-index 50, 80px high. The container is `calc(1440px + 3rem)` maximum with 24px horizontal padding. At ≥1280px it presents logo, six links, language switcher, login, and primary CTA in one row. Link grouping uses 4px internal gap; actions use 16px. The CTA is 12px radius. Under 1280px the desktop pill is hidden and a compact logo/login/menu row appears; the expandable menu is fixed below the 64px mobile header. The header wrapper itself contributes no document height because it is fixed.

## Hero

Rendered 1440×1000 with `80px 24px 72px` padding, clipped overflow, and two-column grid (`580px + flexible`, 56px gap). It combines an AI/APA badge, animated display title, body copy, two CTAs, university trust marquee, and a perspective product-device composition. The visual uses `aspect-ratio:100/96`, a 3600px perspective, a white radial glow, and slow device floating. At 1280 it still occupies the 900px viewport; at 768 it stacks and reaches 1484px with `136px 24px 96px`; at 390 it becomes a long single-column opening.

## Features

Rendered 1301px high; section padding `96px 24px 112px`. Content maxes at 1440px. Six feature modules form a six-column desktop grid with `56px 40px` gaps. At ≤1023px this becomes two columns (`48px 24px` gaps), then one column on mobile. Cards prioritize product UI demonstrations: analysis orbit, report interface, privacy shield, reliable R results, and chart/report examples. Heading computed at 54.4/58.75px, 600.

## Statistical proof

Rendered 833px high. Four equal KPI tiles in a 20px-gap grid, followed by a wide white proof panel. At ≤1023px KPIs become 2×2; at ≤480px a single column. UI fragments use 14px radius, 12px padding, white surface, one-pixel alpha outline, and `0 14px 30px -18px #0f172a59` depth.

## Process

Rendered 1403px high. A centered section heading precedes a 2×2 process grid with 24px gaps. Steps combine numbered labels, short copy, and miniature application screens for upload, cleaning, test selection, and report viewing. It collapses to one column at ≤1023px; the 768px render is about 2006px high.

## Comparison

Rendered 1908px high. The section uses a clear Istabot-versus-traditional table, supporting benefit cards, a cost comparison tool, and horizontal bar visualization. Blue consistently indicates the product/preferred state; gray represents the traditional baseline. White panels, 14–28px radii, subtle dividers, and sparse green outcome labels keep it analytic rather than promotional. At tablet/mobile widths table content reflows into a taller linear arrangement instead of being removed.

## Pricing

Rendered 1066px high. Three equal plan cards use 24px gaps. Every plan card has a 28px translucent outer shell with 7px padding and 22px white inner panel; outer shadow is `0 0 0 1px #ffffffe6, 0 1px 2px #0000000a, 0 24px 48px -32px #0000002e`. Card interiors use roughly 28px × 25.6px padding. Plan name is 20.8px/600; badges are 12px/600 pills. A side/custom plan sits beneath/alongside the main offering. Grid becomes two columns at ≤1023px and one column on mobile.

## FAQ

Rendered 1701px high with an 880px max-width list and 14.4px vertical gap. Each item is a 26px translucent shell with 6px padding and a 21px white inner surface. Question rows use `20px 20px 20px 25.6px` padding, 17.6px/600 text, and a 40×40, 11px-radius toggle. Hover changes the toggle from `#f1f1f3` to `#e7e7ea`. The first item was open in the captured DOM. Answers animate grid rows over 350ms and fade/pad over 250–350ms.

## Blog/editorial cards

Rendered 1338px high. A featured article is followed by supporting cards in a three-column grid with 28px gaps. The visual system stays product-like: blue chart/table imagery, white surfaces, restrained metadata, and blue text accents. Grid drops to two then one column; at 390px the section is about 2354px high.

## Final CTA

Rendered 658px high including `0 24px 96px` outer padding. The inner CTA is a large saturated blue rounded field with centered inverse heading/copy, a white action, and small proof chips. This is the page's highest-chroma moment and closes the acquisition narrative.

## Footer

Rendered 507px high on desktop and 1034px on mobile. White background, 24px desktop/16px mobile gutters, brand block, grouped navigation columns, social icons, legal/copyright line, and eistatistik affiliation mark. Mobile stacks the columns; desktop keeps a broad multi-column information architecture.

## Interaction states

- Primary CTA: 150ms `cubic-bezier(.4,0,.2,1)` transition; layered blue shadow. CSS provides hover styling, but the exact final computed hover matrix was not exhaustively captured.
- Navbar: fixed throughout; desktop/mobile visibility changes at 1280px. Language trigger exposes ARIA listbox semantics.
- FAQ: click toggles `is-open`; question hover lightens the toggle surface.
- Pricing/cards: reveal from 18px down with opacity 0 using 700ms easing and 90ms per-card staggering.
- Mobile menu: explicit menu button and fixed dropdown below the header; closed in screenshots.

## Screenshot index

`component-navbar.png`, `component-hero.png`, `component-features.png`, `component-stats.png`, `component-process.png`, `component-comparison.png`, `component-pricing.png`, `component-faq.png`, `component-blog.png`, `component-cta.png`, and `component-footer.png`.
