# Mental Independence

A 30-day program for auditing installed beliefs and consciously constructing the operating logic you choose to keep.

**Live:** https://mental-independence-app.web.app

## What it is

Single-page React app. Four weeks of daily prompts (audit → interrogate → expose → install), reflection journaling, resistance ratings, and weekly integration days. State lives in `localStorage` only. No accounts, no backend, no analytics. Nothing leaves your device.

## Stack

- Vite + React 19
- Single-file component at [`src/App.jsx`](src/App.jsx)
- Firebase Hosting

## Develop

```sh
npm install
npm run dev          # http://127.0.0.1:5174
```

## Deploy

```sh
npm run build
firebase deploy --only hosting
```

Targets Firebase project `mental-independence-app`. Set in [`.firebaserc`](.firebaserc).
