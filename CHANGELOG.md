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
