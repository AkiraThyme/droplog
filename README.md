# DropLog

DropLog is an offline-first, mobile-first micro-journaling app built with Vue 3, Pinia, Dexie, and Capacitor.

## Highlights

- Tailwind CSS styling with a mobile-first UI
- 100% local data with IndexedDB (Dexie)
- Quick-drop bottom sheet UX
- Optimistic writes with graceful fallback
- Virtualized timeline for performance
- Derived local insights (mood frequency, entries/day)
- Ready for Capacitor Android/iOS deployment
- PWA-ready web build for Netlify

## Run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploy to Netlify (PWA)

1. Push this repository to GitHub/GitLab/Bitbucket.
2. In Netlify, create a new site from that repository.
3. Build settings are auto-detected from `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Deploy. Netlify serves the SPA fallback and PWA files (`manifest.webmanifest`, `sw.js`) automatically.

### Capacitor + PWA note

- Capacitor mobile apps use the same `dist` output (`webDir` in `capacitor.config.ts`).
- The hosted PWA is useful for quick web installs and sharing, while native builds remain available for app stores.
