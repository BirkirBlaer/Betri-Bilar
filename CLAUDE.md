# Vibe coding

Next.js (App Router, `src/`), TypeScript, Tailwind CSS v4, shadcn/ui.

## Commands
- `npm run dev` – dev server at http://localhost:3000
- `npm run build` – production build
- `npm run lint` – ESLint

## UI components
- shadcn/ui: `npx shadcn@latest add button` → `src/components/ui`
- React Bits: `npx shadcn@latest add @react-bits/<Name>-TS-TW` (registry set in `components.json`)
- Magic UI: `npx shadcn@latest add @magicui/<name>`
- MCP servers (`.mcp.json`): `shadcn` (browse/install registry components incl. React Bits) and `magicuidesign-mcp`.

## Animation
GSAP (`gsap`, `@gsap/react`). In components: `"use client"`, `useGSAP()` from `@gsap/react` for setup/cleanup, register plugins once (`gsap.registerPlugin(useGSAP, ScrollTrigger)`). All GSAP plugins are free and included in the `gsap` package. Skills: `gsap-*` in `.claude/skills`.

## Design
Project skills in `.claude/skills`: `frontend-design`, `impeccable`, `ui-ux-pro-max`.
Use them for any UI work. Use `cn()` from `@/lib/utils` to merge classes.
