# Public asset inventory

All URLs were loaded by the public homepage during the audit. Dimensions are intrinsic browser-reported sizes where available.

## Fonts

| Resource | Format | Purpose |
|---|---|---|
| `/_next/static/media/1bffadaabf893a1e-s.p.3-6t-g6q0vh0a.woff2` | WOFF2 | Inter family subset/weight resource |
| `/_next/static/media/83afe278b6a6bb3c-s.p.2bn3s6zvc0dyp.woff2` | WOFF2 | Inter/fallback subset/weight resource |

Exact weight-to-file mapping is unknown from the generated filenames alone. Computed text used weights 400, 500, 600 and 700.

## Brand and product assets

| URL | Format | Intrinsic size | Purpose |
|---|---|---:|---|
| `/assets/img/istabot-logo-blue.png` | PNG | 380×380 | Header/mobile brand mark |
| `/assets/icons/logo-solid.svg` | SVG | 40×40 | Product mark in UI previews |
| `/assets/icons/istabot-white.svg` | SVG | 23×29 | Inverse brand mark |
| `/assets/icons/istacoin.svg` | SVG | 515×515 | Coin/credit indicator; rendered at 18×18 in pricing |
| `/assets/img/eistatistik-logo.png` | PNG | 300×69 | Footer affiliation; rendered about 87×20 |
| `/icon.svg?...` | SVG | vector | Browser favicon |

## Statistical/product iconography

| URL | Intrinsic size | Observed purpose |
|---|---:|---|
| `/assets/icons/descriptive.svg` | 18×16 | Descriptive-analysis method |
| `/assets/icons/correlation.svg` | 20×20 | Correlation method |
| `/assets/icons/chisq.svg` | 20×23 | Chi-square method |
| `/assets/icons/dependent.svg` | 20×20 | Dependent-test method |
| `/assets/icons/single.svg` | 20×20 | Single-variable/test mode |
| `/assets/icons/multi.svg` | 20×20 | Multi-variable/test mode |
| `/assets/icons/r-logo.svg` | 54×36 | R analysis engine credibility |

Additional interface icons are inline SVG, including Lucide-style chevrons and common UI glyphs. Their source library cannot be conclusively inventoried from rendered markup alone, though the DOM includes `lucide` class names for at least the language chevron.

## Social-proof marks

| URL | Intrinsic size | Rendered desktop size |
|---|---:|---:|
| `/assets/universities/gazi.png` | 144×144 | 46×46 |
| `/assets/universities/ktu.png` | 321×144 | ~66.9×30 |
| `/assets/universities/atilim.png` | 234×144 | ~61.8×38 |
| `/assets/universities/inonu.png` | 311×144 | ~77.8×36 |
| `/assets/universities/ordu.png` | 144×144 | 46×46 |

The logos are duplicated in the DOM to create a seamless marquee. They are institution marks used as trust evidence, not decoration.

## Generated/inline visuals

Most dashboard screenshots, charts, comparison tables, pricing graphics, device mockups, shields, orbit systems, and report previews are HTML/CSS/SVG compositions rather than large raster screenshots. This is central to the visual language: product evidence remains sharp at all breakpoints and can be animated at the element level.

## Loaded bundles

- CSS: `/_next/static/chunks/0a-7m9etbthy5.css`, `3qkx-hbz-n6j0.css`, `0j60vk4kx18bc.css`.
- Multiple hashed Next.js/Turbopack JavaScript chunks drive client interaction.
- Google Tag Manager/Analytics resources are present but are not part of the design system.

The complete 182-entry resource-timing inventory, including transfer and decoded sizes when reported, is stored under `resources` in `raw-browser-audit.json`.
