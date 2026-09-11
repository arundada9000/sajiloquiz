# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/) and this
project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added
- iOS HIG design system: every color scheme is now a complete, distinct theme
  (own background, card surface, text, tint, status colors, glass and shadows)
  with light and dark variants.
- Nine named themes plus a custom palette editor with automatic contrast.
- Remove decorative gradients across backgrounds, buttons and titles for a
  cleaner iOS surface look.
- Improved grid visited-cell affordance (checkmark badge + sheen).
- Mark for review: bookmark any question (M key or button) for ambiguity
  spotting; amber badge on grid and overview cells.
- Random question: jump to a random unvisited question (R key or button).
- Thanos snap: dust away all visited questions with an animation and a new
  "Snap" sound (X key or button).
- Editable team names in the admin Teams tab.
- Confirmation dialogs for deleting teams and awarding/penalizing team points.
- Per-question context menu: right-click a grid card to open, mark/unmark
  visited, mark for review, or snap/restore that single question.
- Snap restore: snapped (dusted) questions can be brought back individually or
  all at once from the grid.
- Read aloud: speech synthesis reads the current question (and the answer once
  revealed) from the question page.
- Welcome onboarding: a nine-step Quick Tour introduces grid, rounds, scoring,
  random/snap, themes, shortcuts, offline install and read-aloud. Auto-shows on
  first visit and is always reachable from the footer.
- PWA install button in the footer (shared install-prompt hook, reused by the
  install button on the grid).
- In-app FAQ page at /#/faq with accordion UI; FAQPage JSON-LD now generated
  from the FAQ data module.
- Footer now links the author's portfolio and all personal socials
  (GitHub, LinkedIn, X, YouTube, Instagram, Facebook).
- Sample question batches: new installs start with the company quiz plus three
  ready-made sets (Rapid-Fire Quickies, Grand Quiz Extravaganza and Deep-Dive
  Thinkers) that show off different round styles and question lengths. They are
  seeded once - hosts can delete them and they stay deleted.

### Fixed
- PWA install prompt not appearing in development: the service worker is now
  served during `vite dev` (`devOptions.enabled`) and the install-prompt event
  is captured at module load instead of after mount, so the footer and grid
  install buttons reliably offer install and give accurate fallback hints.
  The generated `dev-dist` folder is gitignored.

### Changed
- Docs synced with the app: guide shortcuts section gets the correct `#shortcuts`
  anchor and a Read entry, FAQ references the guide's Getting started section,
  journal articles describe the per-question context menu and footer install
  button, and the Admin quick tips mention the footer install location.

## [1.2.0] - 2026-08-31

### Added
- 404, offline, privacy and terms pages with legal layout.
- Error boundary and loading fallback.
- Lazy-loaded admin panel route.
- Central site configuration module (`src/config/site.ts`).
- Open Graph / Twitter meta tags, AEO and geo meta, JSON-LD structured data.
- Generated `robots.txt` and `sitemap.xml` at build time.
- PWA manifest shortcuts, categories, orientation and app icons.

### Changed
- Offline-first service worker navigation fallback.
- License upgraded to a strict proprietary license (written permission
  required for any use).
- Content-security-friendly runtime caching for images.

## [1.1.0] - 2026-08-30

### Added
- Swipe gestures (left/right + double-tap) in the question view.
- Keyboard and gesture shortcuts modal.
- iOS-styled checkboxes, radios, switches and inputs.
- Theme customization panel with mode and scheme selection.

### Fixed
- Broken `lint` script (now `tsc --noEmit`).

## [1.0.0] - 2025-01-01

### Added
- Initial release of the quiz presentation app.
