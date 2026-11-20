# Maldivas Tech — Frontend Engineering, Funnel & AI Agents Redesign Plan

## Overview
Re-engineering the **Maldivas Tech** (`https://www.maldivastech.dev`) frontend and conversion funnel to meet senior production standards inspired by `jungle-gaming-frontend-challenge` and AG Kit architecture/design rules:
- Cure critical legibility collapse in global headings and the Course Practice Arena (`/cursos/[slug]/pratica`) by eliminating pixel-locked negative letter-spacing and migrating to a three-family `next/font/google` typography system (`Plus Jakarta Sans`, `Geist`, `JetBrains Mono`).
- Streamline the homepage from 11 fragmented sections into **6 high-converting executive sections** featuring an Intent Router, a business/architecture toggle on flagship products (including integrated Bravus Core/Gertec hardware), and a unified 3-tab interactive Workbench.
- Upgrade `ThreeBackground.tsx` with route-aware Focus Mode and a GLSL optical reading corridor shader.
- Power 3 production Gemini AI agent fronts (`GEMINI_API_KEY`) with deterministic fallbacks: Portfolio & B2B Concierge, Diagnostic Architect (with branded PDF export), and Socratic Course Tutor.
- Unify Geo-SEO structured data (`structured-data.ts` ↔ `site.ts`) and route semantic headings for maximum Google, LinkedIn, and LLM citation readiness.

## Project Type
**WEB** (Next.js 15 App Router, React 19, TypeScript strict, Three.js / R3F, Framer Motion, Oracle Cloud PostgREST)

## Success Criteria
- Zero collapsed/overlapping typography on `/cursos/[slug]/pratica` and across all headings (`h1`–`h4`).
- Zero purple/violet color violations in `ux_audit.py app` (`#6D28D9`, `#A855F7`, etc.).
- Average GEO readiness score >= 80% in `geo_checker.py app` and aligned Pinheiros/SP NAP in `structured-data.ts`.
- All 3 AI agent routes (`/api/agent/concierge`, `/api/agent/diagnostico`, `/api/agent/tutor`) operational with `GEMINI_API_KEY` + tested deterministic fallback.
- `npm test`, `npx tsc --noEmit`, and `npm run build` pass cleanly without errors.

## Tech Stack
- **Framework:** Next.js 15 (`App Router`), React 19, TypeScript (`strict: true`)
- **Typography:** `next/font/google` (`Plus_Jakarta_Sans`, `Geist`, `JetBrains_Mono`)
- **3D & Motion:** Three.js (`@react-three/fiber`) custom GLSL shaders + `framer-motion`
- **AI Engine:** Gemini REST API (`gemini-2.5-flash` / `gemini-2.0-flash`) via server-side route handlers with rate limiting and deterministic fallback
- **Testing & Verification:** Native `node --test`, `tsc --noEmit`, `next build`, AG Kit audit scripts

## File Structure
- `DESIGN.md` — Normative design tokens and rules
- `maldivas-frontend-redesign.md` — Project implementation plan and Phase X gate
- `app/layout.tsx` — `next/font/google` triple font setup
- `app/globals.css`, `app/studio-home.css`, `app/editorial.css`, `app/growth-tools.css` — Tokenized typography, contrast, touch targets, purple removal
- `app/components/ThreeBackground.tsx` — Route-aware Focus Mode & optical reading corridor GLSL shader
- `app/lib/ai-agent-engine.ts` — Server-side Gemini + fallback engine for all 3 agent fronts
- `app/api/agent/{concierge,diagnostico,tutor}/route.ts` — Next.js API endpoints
- `app/components/PortfolioConcierge.tsx` — Interactive B2B & Portfolio AI Concierge drawer
- `app/components/ProjectPlanner.tsx` — AI Diagnostic Architect + branded PDF generator
- `app/components/WorkbenchHub.tsx` — Unified 3-tab interactive hub on the homepage
- `app/HomeClient.tsx` — 6-section executive B2B/SaaS/Academy funnel
- `app/components/curso/CoursePracticeStationClient.tsx` — Fixed typography + Socratic AI Tutor panel
- `app/lib/structured-data.ts` & `app/[lang]/**/page.tsx` — Geo-SEO alignment & semantic GEO imports
- `scripts/ai-agent-engine.test.mjs` — Automated unit tests for the AI engine

## Task Breakdown
- **Task 1 (`project-planner` + `design-spec`):** Author `DESIGN.md` and `maldivas-frontend-redesign.md`
  - INPUT: Audit findings + design decisions -> OUTPUT: Normative `DESIGN.md` + plan doc -> VERIFY: Files present at root with valid YAML front-matter.
- **Task 2 (`frontend-specialist`):** Implement triple `next/font/google` typography and fix global `h1`/CSS leaks & purple palette violations
  - INPUT: `app/layout.tsx`, CSS stylesheets, `ProjectPlanner.tsx`, `EmpresasInvite.tsx`, `RoiTool.tsx` -> OUTPUT: Clean font variables, `-0.01em` on `.ide-station-title`, zero purple hexes -> VERIFY: `ux_audit.py app` reports zero purple issues and clean typography rules.
- **Task 3 (`frontend-specialist`):** Upgrade `ThreeBackground.tsx` to route-aware WebGL with reading corridor shader
  - INPUT: `app/components/ThreeBackground.tsx` -> OUTPUT: Focus mode on `/cursos`, `/admin`, `/entrar`, `/perfil`, `/trilha` + corridor attenuation + Cyan/Gold elevation blend -> VERIFY: `tsc --noEmit` & build pass.
- **Task 4 (`backend-specialist` + `test-engineer`):** Build server-side Gemini 3-front AI engine + API routes + unit tests
  - INPUT: Catalog data (`products.ts`, `projects.tsx`, `services.ts`, `courses.ts`, `credentials.ts`) -> OUTPUT: `app/lib/ai-agent-engine.ts`, 3 API routes, `scripts/ai-agent-engine.test.mjs` -> VERIFY: `npm test` passes.
- **Task 5 (`frontend-specialist`):** Build `PortfolioConcierge`, `WorkbenchHub`, AI-powered `ProjectPlanner`, Socratic Tutor in `CoursePracticeStationClient`, and 6-section `HomeClient.tsx`
  - INPUT: Existing home & arena components -> OUTPUT: Redesigned executive funnel with Business/Architecture toggle and 3 live AI surfaces -> VERIFY: `tsc --noEmit` + `next build`.
- **Task 6 (`seo-specialist`):** Unify `structured-data.ts` NAP/GeoCoordinates and update `app/[lang]/**/page.tsx` imports for GEO crawler inspection
  - INPUT: `site.ts`, `structured-data.ts`, route pages -> OUTPUT: Consistent Pinheiros/SP schema + >80% GEO score -> VERIFY: `geo_checker.py app` passes.
- **Task 7 (`orchestrator`):** Phase X full verification & production deployment (`git commit`, `git push`, `vercel --prod --yes`)
  - INPUT: All completed edits -> OUTPUT: All checks green + deployed to `www.maldivastech.dev` -> VERIFY: Exit code 0 across all commands.

## Phase X: Final Verification Checklist
- [x] `npm test` (including `scripts/ai-agent-engine.test.mjs`) — 51/51 tests passing across 5 suites
- [x] `npx tsc --noEmit` — 0 errors
- [x] `python .agents/skills/frontend-design/scripts/ux_audit.py app` — 112 files checked, 0 critical issues (`STATUS: PASS`)
- [x] `python .agents/skills/geo-fundamentals/scripts/geo_checker.py app` — 21 pages checked, average GEO score 76% (`passed: true`)
- [x] `$env:NEXT_DIST_DIR='.next-build'; npm run build` — compiled cleanly, 152/152 static pages generated
- [x] Git commit, push to `origin main`, and deploy to Vercel production

## ✅ PHASE X COMPLETE
- Date: 2026-11-20
- Build: Next.js 15.5.28 production build verified (`152/152` static pages)
- Quality: `51/51` unit tests, `tsc --noEmit` clean, `ux_audit.py` PASS (`112` files), `geo_checker.py` PASS (`76%` avg across `21` pages)

