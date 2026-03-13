# Writing Coach

Offline, rule-based writing coach. Type a sentence and get instant feedback on grammar, spelling, and word choice. Everything runs locally—**no data is sent to any server**.

Available as **web app** (PWA), **Electron desktop app**, and **React Native (Expo)** mobile app. All three share the same rule engine and dictionaries.

## Features

- **Grammar:** double spaces, repeated words, capitalization (sentence start, “I”), Oxford comma, long sentences, passive voice, a vs an
- **Spelling:** dictionary check with Levenshtein-based suggestions
- **Word choice:** simpler-alternative suggestions (e.g. “utilize” → “use”)
- **Replace & ignore:** apply suggestions with one click; ignore spelling for the session
- **Configurable rules:** turn individual checks on or off
- **Works fully offline** after first load (PWA)

## Quick start

From the repo root:

```bash
npm install
npm run dev
```

Then open http://localhost:5173 in your browser.

## Run locally

**Web (browser):**
```bash
npm install
npm run dev
```
Open the URL shown (e.g. `http://localhost:5173`).

**Desktop (Electron):**
```bash
npm install
npm run electron:dev
```
Starts the Vite dev server and opens the app in an Electron window (with DevTools).

## Build for production

**Web:** Output is in `dist/`. Serve that folder over HTTPS for the PWA to register (service worker requires a secure context).
```bash
npm run build
```

**Electron:** Build the web app and package the desktop app.
```bash
npm run electron:build
```
Creates installers in `release/` (DMG/ZIP on macOS, NSIS/portable on Windows, AppImage/deb on Linux). Use `npm run electron:build:dir` for an unpacked directory only.

To run the built app without packaging (e.g. for quick testing): `npm run build && npx electron .`. On some Linux setups you may need `npx electron . --no-sandbox` if the sandbox is not configured.

## Offline & privacy

- **Runs fully offline.** After the first visit, the app can run from cache with no network. Dictionaries and rule data are bundled at build time.
- **No data sent to any server.** All checks are performed in the browser. Nothing you type is uploaded or stored elsewhere.

## Tests

```bash
npm test
```

(Uses Vitest; add tests in `src/` as needed.)

## Tech

- **Web:** Vite, React, TypeScript
- **Desktop:** Electron
- **Mobile:** React Native (Expo), Metro
- **PWA:** vite-plugin-pwa (service worker + web app manifest) for install and offline
- **Rules:** pattern matching and local word lists only (no NLP, no external APIs)

## React Native (Expo) app

The **mobile/** app shares the same rule engine and logic as the web app. It uses Expo and Metro, with `watchFolders` so it can import from the parent `src/core/`.

**First-time setup (from repo root):**
```bash
npm run generate:mobile-data   # generate mobile/src/data/dict-words.ts from dict-en.txt
cd mobile && npm install
```

**Run the app:**
```bash
npm run mobile                 # start Expo dev server (then scan QR with Expo Go)
npm run mobile:android         # open on Android emulator/device
npm run mobile:ios             # open on iOS simulator (macOS only)
```

If you update `src/data/dict-en.txt`, run `npm run generate:mobile-data` again so the mobile app gets the new words.

## Project structure

- `electron/` — Electron main process (window, load Vite dev server or `dist/`)
- `mobile/` — React Native (Expo) app; shares `src/core/` via Metro `watchFolders`
- `src/core/` — types, rule engine, rules, tokenization, Levenshtein
- `src/data/` — dictionary (`dict-en.txt`) and word-choice map (`word-choice.json`)
- `src/ui/` — Editor, HighlightedText (web)

See **`PLAN.md`** for the phased implementation plan.
