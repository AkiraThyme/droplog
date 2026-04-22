# DropLog

DropLog is an offline-first, mobile-first micro-journaling app built with Vue 3, Pinia, Dexie, and Capacitor.

## Highlights

- 100% local data with IndexedDB (Dexie)
- Quick-drop bottom sheet UX
- Optimistic writes with graceful fallback
- Virtualized timeline for performance
- Derived local insights (mood frequency, entries/day)
- Ready for Capacitor Android/iOS deployment
- Utility-first styling with Tailwind CSS component layers

## Styling approach

Tailwind CSS is used as the default styling system for production speed, consistency, and mobile-first iteration.

If you later need design-system scale, consider one of these upgrades:
- **UnoCSS** for even lighter utility generation
- **CSS variables + Tailwind tokens** for dynamic theming packs
- **Headless UI + Tailwind** for richer accessible primitives

## Run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
