<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Design system — do not deviate

This project has a fixed design system documented in [design.md](design.md). It captures the
existing, source-of-truth patterns (profile dropdown, order-detail layout, payment section,
legal/agreement modal, tokens, app shell, icon system).

**Before any UI, component, layout, CSS, or `globals.css` change you MUST read [design.md](design.md)
and stay within it.** Reuse the documented classes/components; use the `:root` tokens; do not
introduce new visual languages, new class systems, or parallel components. If a genuinely new
pattern is required, add it to design.md first, then implement it so doc and code stay in sync.
