# Writing Coach — Mobile (Expo)

React Native app that shares the same rule engine as the web and Electron apps. Uses Expo and Metro; imports from the parent repo’s `src/core/`.

See the **root [README.md](../README.md)** for full project docs, offline/privacy notes, and the implementation plan.

## Setup

From the **repo root** (one time):

```bash
npm run generate:mobile-data
cd mobile && npm install
```

## Run

From the **repo root**:

```bash
npm run mobile           # Expo dev server (scan QR with Expo Go)
npm run mobile:android   # Android
npm run mobile:ios       # iOS (macOS only)
```

Or from this directory:

```bash
npm start
npx expo start --android
npx expo start --ios
```

## After changing the dictionary

If you update `../src/data/dict-en.txt`, from the repo root run:

```bash
npm run generate:mobile-data
```

This regenerates `src/data/dict-words.ts`.
