# Project: Mental Independence — 30-Day Program

## Overview
A public-facing React web app for a structured 30-day belief-audit and identity-rebuild program. Single-file React component (`mental-independence-30.jsx`), no backend, localStorage persistence. Goal: deploy as a standalone website.

## Source File
**Start here:** `mental-independence-30.jsx` — the complete app in one file. Read it before doing anything.

Key internals:
- `WEEKS[]` — 4 week configs with titles, accents, logic copy
- `DAYS[]` — 30 day objects with `prompt`, `depth`, `action`, `isIntegration`
- `STORAGE_KEY = "mind-independence-v2"` — localStorage key for all user state
- `loadData()` / `saveData()` — localStorage read/write with try/catch
- `ResistanceSelector` — 1–5 resistance rating component per day
- `WeeklyInsight` — pattern analysis shown on integration days (7, 14, 21, 30)
- `AboutView` — full framework explainer, 7 sections, credits Prof Jiang Academy
- Four nav views: `today`, `calendar`, `weeks`, `about`

## Task: Deploy as a Public Website

### Stack to use
- **Vite + React** — `npm create vite@latest mental-independence -- --template react`
- **No additional libraries required** — app uses only React core hooks
- **No backend** — localStorage only, no auth, no database

### Steps
1. Scaffold: `npm create vite@latest mental-independence -- --template react`
2. Replace `src/App.jsx` contents with `mental-independence-30.jsx`
3. Clean `src/App.css` and `src/index.css` — app is fully self-styled, remove conflicting resets
4. In `index.html`: set `<title>Mental Independence — 30-Day Program</title>` and add meta description
5. Verify dev build works: `npm run dev`
6. Production build: `npm run build` — outputs to `dist/`

### Deployment target options (pick one, preference order)
- **Vercel** — `npx vercel` from project root, zero config for Vite
- **Netlify** — drag `dist/` folder into Netlify UI, or `netlify deploy --prod --dir=dist`
- **GitHub Pages** — add `vite.config.js` base path if deploying to a subpath

### index.html meta tags to add
```html
<meta name="description" content="A 30-day program for auditing installed beliefs and consciously constructing the identity you choose to keep.">
<meta property="og:title" content="Mental Independence — 30-Day Program">
<meta property="og:description" content="30 days. 4 phases. Daily prompts, reflection tracking, resistance ratings. Free and private — nothing leaves your device.">
```

### vite.config.js (only needed for GitHub Pages subpath)
```js
export default { base: '/mental-independence/' }
```

## Architecture Decisions
- **Single JSX file**: deliberate — easy to hand off, audit, and redeploy. Don't split into components unless the user explicitly asks.
- **localStorage only**: no accounts, no server, no analytics. This is a feature — the About tab calls it out explicitly ("nothing leaves your device"). Don't add a backend without explicit instruction.
- **No external component libraries**: Tailwind/shadcn not used. All styling is inline with a design system baked in (dark editorial, Playfair Display + IBM Plex Mono, gold accent #C9A84C). Preserve this.
- **Google Fonts via CDN**: loaded in a `<style>` tag inside the component via `@import url(...)`. Works in the artifact environment. In Vite, move this to `index.html` `<head>` for performance.

## Dead Ends — Do Not Retry
- **window.storage**: the original version used `window.storage` (Anthropic artifact persistent storage API). This does NOT exist outside claude.ai. Already converted to `localStorage`. Do not revert.
- **form tags**: React artifacts don't support HTML `<form>`. App uses `onClick`/`onChange` handlers throughout. Keep this pattern.

## Known Issues / Out of Scope for This Session
- No cross-device sync — localStorage is device-local. A user who switches devices starts fresh. Acceptable for v1.
- No user accounts or progress sharing. Out of scope unless explicitly asked.
- Google Fonts `@import` is inside the component's `<style>` tag. Works but not optimal. Move to `index.html` if performance matters.
- No PWA / offline support. Out of scope.
- No analytics. Do not add without explicit instruction — privacy is a stated value of this app.

## Verification
After `npm run dev`:
- [ ] App loads on localhost with dark background, "Mental Independence" header
- [ ] Day 1 prompt visible in TODAY view
- [ ] Resistance selector (1–5) clickable and persists on page refresh
- [ ] Reflection textarea auto-saves (check localStorage in DevTools → Application → Local Storage)
- [ ] ABOUT tab loads with full framework explainer text
- [ ] ALL DAYS calendar shows all 30 days across 4 weeks
- [ ] OVERVIEW tab shows resistance chart (empty until days are rated)
- [ ] Marking a day complete toggles correctly and updates progress bar

## Scope Boundary for This Session
**Build and deploy the app as described. Do not:**
- Add authentication or user accounts
- Modify the 30-day content (prompts, depth copy, action items)
- Add analytics or tracking
- Restructure into multiple component files
- Change the visual design or color palette

If the user asks for any of the above, confirm before proceeding.
