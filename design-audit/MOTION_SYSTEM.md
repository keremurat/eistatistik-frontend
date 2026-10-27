# Motion system

Motion evidence comes from `document.getAnimations()` after load/scroll plus CSSOM keyframes. Seventy-seven animation instances were observed; repeated character/caret instances account for most of that count.

| Motion | Verified timing | Trigger / purpose |
|---|---|---|
| `hero-fade-up` | 1000ms; delays 0/80/160/240/320ms | Staged badge, title, description, actions, trust row on initial load |
| `hero-char-in` | 520ms | Character-level visible hero title entrance |
| `hero-visual-in` | 1000ms, 200ms delay | Product device composition entrance |
| `hero-cue-in` | 800ms, 1400ms delay | Delayed scroll prompt entrance |
| `hero-cue-bounce` | 1800ms infinite | Scroll cue emphasis |
| `hero-caret` | 1100ms infinite | Type/caret treatment within hero text |
| `hero-marquee` | 32000ms linear infinite | University/social-proof logo track |
| `device-float` | 6000ms linear infinite | Phone body slow float |
| `device-shadow-float` | 6000ms linear infinite | Synchronized shadow response |
| `ft-float` | 5000ms infinite; delays 0, -1200, -2400, -3600ms | Offset feature-orbit pills |
| `ft-pulse` | 4000ms infinite; delays 0/400/800ms | Privacy shield rings |
| Pricing reveal | 700ms `cubic-bezier(.22,1,.36,1)`; 90ms stagger | Intersection/visible class; opacity + translateY(18px) |
| FAQ expansion | 350ms `cubic-bezier(.22,1,.36,1)` | `grid-template-rows: 0fr → 1fr` |
| FAQ answer | 250ms opacity / 350ms padding | Synchronized accordion content reveal |
| Common CTA transition | 150ms `cubic-bezier(.4,0,.2,1)` | Hover/focus feedback |
| Header/container | 300ms ease | General responsive/state transition |

## Behavior model

The initial hero is the most animated area. Motion then becomes ambient (marquee, floating device, orbit pills, pulsing rings) and scroll-reveal based. Product UI previews remain readable because movement is low-amplitude and slow. Accordion interaction uses layout-safe grid-row interpolation rather than animating an unknown fixed height.

JavaScript is involved in class/state changes and hero text/device sequencing, as shown by dynamic data/classes and the Next.js client bundles. No third-party animation library could be verified from public resources; implementation should therefore be labeled custom CSS plus React state/observers. GSAP, Framer Motion, and similar libraries were not evidenced.

## Sticky/fixed/scroll behavior

- Navbar is fixed at the top (`z-index:50`).
- Mobile menu is fixed below the header (`z-index:40`).
- Anchor targets use `scroll-mt-24` to compensate for the fixed header.
- The social-proof strip is a continuous marquee.
- Section reveal classes indicate scroll-triggered observation; the exact IntersectionObserver thresholds are unknown because no source map was exposed.

## Reduced motion

The loaded CSS includes media rules collected in `raw-browser-audit.json`; however, runtime reduced-motion behavior was not separately emulated in this pass. Treat full parity under `prefers-reduced-motion` as unverified and test it explicitly before reproduction.
