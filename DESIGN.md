---
version: alpha
name: Maldivas Tech Precision Engineering
description: Official design system specification for Maldivas Tech (maldivastech.dev) — B2B engineering consultancy, SaaS ecosystem, and interactive Academy.
colors:
  primary: "#22B5F2"
  primary-dark-mode: "#22B5F2"
  primary-light-mode: "#0166BB"
  primary-deep: "#01458F"
  primary-bright: "#5FE3FF"
  gold-signal: "#F5B544"
  gold-light-mode: "#B45309"
  emerald-success: "#10B981"
  bg-dark: "#070A12"
  bg-soft-dark: "#0C111D"
  surface-dark: "#101725"
  surface-2-dark: "#161F31"
  fg-dark: "#EEF3FA"
  fg-muted-dark: "#97A6BD"
  fg-dim-dark: "#6B7A93"
  bg-light: "#F8FAFC"
  bg-soft-light: "#FFFFFF"
  surface-light: "#F1F5F9"
  surface-2-light: "#E2E8F0"
  fg-light: "#0F172A"
  fg-muted-light: "#475569"
  fg-dim-light: "#64748B"
  error: "#EF4444"
typography:
  headline-display:
    fontFamily: Plus Jakarta Sans
    fontSize: 68px
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: -0.028em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 44px
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: -0.022em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: -0.015em
  headline-compact:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Geist
    fontSize: 20px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0em
  body-md:
    fontFamily: Geist
    fontSize: 16.5px
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: 0em
  body-sm:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: 0em
  label-lg:
    fontFamily: Geist
    fontSize: 15px
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: 0em
  label-md:
    fontFamily: Geist
    fontSize: 13px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: 0.04em
  label-sm:
    fontFamily: Geist
    fontSize: 11.5px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: 0.08em
  mono-data:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: 0em
  mono-code:
    fontFamily: JetBrains Mono
    fontSize: 13.5px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0em
rounded:
  none: 0px
  sm: 10px
  md: 14px
  lg: 20px
  xl: 24px
  full: 999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  2xl: 80px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    rounded: "{rounded.sm}"
    padding: 14px
  card-surface:
    backgroundColor: "{colors.surface-dark}"
    rounded: "{rounded.lg}"
    padding: 28px
  station-banner:
    backgroundColor: "{colors.surface-dark}"
    rounded: "{rounded.md}"
    padding: 24px
---

# Maldivas Tech Design System

## Overview
Visual language for **Maldivas Tech** (`https://www.maldivastech.dev`) combining **Precision Engineering** and **Editorial Authority**. Built to convert B2B decision-makers (LinkedIn/Google/AI citations), SaaS operators (MiseOn, MercadinhoSys, SelectSys Jobs, MySuperStore), and Academy students without cognitive overload.

## Colors
- **Primary Electric Cyan (`#22B5F2` dark / `#0166BB` light):** Main interactive accent, CTAs, active tabs, and engineering highlights.
- **Signal Gold (`#F5B544` dark / `#B45309` light):** Strategic emphasis for executive headlines, studio CTAs, and verified hardware/deploy signals.
- **Obsidian Navy (`#070A12` → `#101725`) / Crisp Slate (`#F8FAFC` → `#FFFFFF`):** Tinted dark and light surfaces ensuring WCAG AA (>= 4.5:1) contrast across both modes.
- **Zero-Purple Lock:** Purple, violet, and indigo hex codes (`#6D28D9`, `#A855F7`, `#8B5CF6`, etc.) are strictly forbidden across components, SVG charts, and print/PDF exports.

## Typography
A three-family system loaded via `next/font/google` with `font-display: swap`:
1. **`Plus Jakarta Sans` (`--font-display`):** Open-aperture geometric display face for `h1`–`h4` headings.
2. **`Geist` (`--font-sans`):** Engineered UI and long-form reading sans-serif for body copy (`16.5px`, `line-height: 1.65`, `max-width: 65ch`), forms, navigation, and course lessons.
3. **`JetBrains Mono` (`--font-mono`):** Technical badges, tabular figures (`tabular-nums`), ROI/margin math, terminal simulators, and code blocks.

### Hard Tracking Rules
- Never apply negative tracking in fixed `px` (such as `letter-spacing: -2.8px`) on global HTML heading tags.
- Large display headings (`>= 36px`) use proportional `em` tracking (`-0.025em` to `-0.028em`).
- Compact headings (`<= 28px`) such as `.ide-station-title` use `-0.01em` or `0em` and `max-width: none` so adjacent words never collapse.

## Layout
- Container max width: `1280px` (`--maxw`), centered with `24px` horizontal gutter.
- Executive Homepage Funnel: **6 focused sections** replacing redundant vertical blocks, featuring an above-the-fold Intent Router and a unified tabbed Workbench (AI Diagnostic Architect, B2B ROI Simulator, Free Tools & Image Studio).
- Route-aware WebGL (`ThreeBackground`): high-presence interactive point-cloud terrain on marketing pages, automatically transitioning into **Deep Focus Mode** (`uOpacity` reduced by 75% + central reading corridor attenuation) inside `/cursos`, `/admin`, `/entrar`, `/perfil`, and `/trilha`.

## Elevation & Depth
- Prefer crisp hairline borders (`1px solid var(--line-strong)`) and surface tone stepping (`--bg` → `--bg-soft` → `--surface` → `--surface-2`) over heavy black drop shadows.
- Interactive cards use GPU-composited cursor spotlights (`--mx`, `--my`) and `transform: translateY(-4px)`.

## Shapes
- Outer containers/cards: `20px` (`--radius`).
- Nested panels, inputs, and primary buttons: `10px–14px` (`--radius-sm`).
- Status pills and filter chips: `999px` pill with minimum touch height `>= 44px` on primary interactive controls.

## Components
- **Interactive States:** Every interactive control implements hover shift, `:active` tactile feedback (`scale(0.98)`), visible `:focus-visible` ring (`2px solid var(--accent)`), skeleton loading states, and empty/error feedback.
- **Product Showcase:** Toggleable between `[Visão de Negócio & ROI]` and `[Raio-X de Arquitetura & Stack]` to serve both business owners and CTOs without text walls.
- **AI Agent Surfaces:** Integrated server-side Gemini agents across Portfolio Concierge, Diagnostic Architect, and Socratic Course Tutor with deterministic fallbacks.

## Do's and Don'ts
- **Do** keep body paragraphs under `65ch` and use sentence case for clarity.
- **Do** preserve full dark/light theme parity across every new component.
- **Don't** leak global `h1` width (`16ch`) or pixel-based negative tracking into inner UI/arena headers.
- **Don't** duplicate tool showcases on the same route or use purple/violet accents anywhere in UI or generated PDFs.

