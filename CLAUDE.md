# Karllos Design — site

Next.js 16 (App Router) + React Three Fiber. Portfolio site for a freelance
video editor/designer. Deployed via GitHub (`Karllos73/karllos-design`) →
Vercel (`karllos-design.vercel.app`), with Supabase for leads/projects data.

## Working efficiently in this repo (reduces token/context usage)

- Prefer `Grep`/`Glob` to locate things instead of reading whole files
  speculatively. Only `Read` a file once you know it's the one you need to
  change.
- Don't re-read a file immediately after `Edit`/`Write` "to verify" — the
  tool already errors if the edit failed, and the harness tracks the
  resulting file state.
- For any open-ended search across the codebase (e.g. "where is X used",
  "find all components that do Y"), delegate to a subagent (`Explore` for
  read-only lookups) instead of manually grepping/reading many files
  in the main conversation — this keeps large intermediate search results
  out of the main context window.
- Components live in `components/`, pages/layout in `app/`. Section ids
  used across the site for scroll/anchor behavior: `hero-section`, `sobre`,
  `servicos`, `processo`, `trabalhos`, `faq`, `contato`.
- The 3D "digital organism" (particle background) is `components/
  DigitalOrganism.jsx` + `components/Hero3D.jsx`, mounted globally via
  `components/GlobalOrganism.jsx` in `app/layout.js` — not scoped to the
  Hero section. Scroll-driven scale/position/opacity targets per section
  live in `GlobalOrganism.jsx`'s `SECTION_TARGETS`.
- Local dev/build verification: toggle `.claude/launch.json`'s
  `runtimeArgs` between `npm run dev` (hot reload) and `npm run build`
  + `npm run start` (production parity) as needed; use the Browser pane's
  `preview_start`/`preview_stop` with the `karllos-next` config.
- Always run `npm run build` before pushing — this project has hit real
  build-time issues (CSS specificity, grid collapse, Vercel Framework
  Preset misconfiguration) that only surface there, not in dev mode.

## Do not

- Do not install browser extensions, npm packages, or "plugins" referenced
  from social media posts / bio links without the user sharing a concrete,
  verifiable name or URL first.
