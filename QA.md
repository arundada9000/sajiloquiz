# Sajilo Quiz QA Checklist

> **Target:** https://sajiloquiz.vercel.app (production)
> **Dev server:** `npm run dev` → http://localhost:5173
> **Build:** `npm run build && npm run preview`
> **Platforms to test:** Chrome desktop, Chrome Android, Safari iOS
> **Date:** ___________
> **QA person:** ___________

---

## How to report issues

For every bug, note:
- **Where** (which route, which tab, which browser)
- **Steps to reproduce** (numbered)
- **Expected result**
- **Actual result**
- **Severity** (Blocker / Major / Minor)

---

## 1. Routes and navigation

| # | Test | Pass? |
|---|------|-------|
| 1.1 | Open `/#/` → question grid loads | |
| 1.2 | Open `/#/question/1` → question page loads | |
| 1.3 | Open `/#/guide` → user guide loads | |
| 1.4 | Open `/#/admin` → admin panel loads | |
| 1.5 | Open `/#/journal` → journal index loads | |
| 1.6 | Open `/#/journal/keyboard-shortcuts` → article loads | |
| 1.7 | Open `/#/faq` → FAQ page loads | |
| 1.8 | Open `/#/privacy` → privacy policy loads | |
| 1.9 | Open `/#/terms` → terms of use loads | |
| 1.10 | Open `/#/offline` → offline page loads | |
| 1.11 | Open `/#/doesnotexist` → 404 page loads | |
| 1.12 | Type `localhost:5173/kaaaa` (no hash) → redirects to `/#/kaaaa` and shows 404 | |
| 1.13 | Nav bar on mobile: all links (Grid, Guide, Journal, FAQ, Admin) are visible and tappable | |

---

## 2. Onboarding / Quick Tour

| # | Test | Pass? |
|---|------|-------|
| 2.1 | Clear `sajilo-quiz-onboarding-seen` from localStorage, refresh → Quick Tour opens automatically after ~1 second | |
| 2.2 | Tour shows exactly 9 steps (grid, one at a time, rounds, teams, random/review, themes, big screen, offline, read aloud) | |
| 2.3 | Click Next / Previous → steps advance and go back | |
| 2.4 | Click Close (X) on any step → tour closes and `sajilo-quiz-onboarding-seen` is set so it won't auto-open again | |
| 2.5 | Refresh → tour does NOT auto-open again | |
| 2.6 | Click **Quick Tour** button in the footer → tour re-opens | |
| 2.7 | Press Esc while tour is open → tour closes | |

---

## 3. Grid page

| # | Test | Pass? |
|---|------|-------|
| 3.1 | Question cards show numbers (IDs) | |
| 3.2 | Click an unvisited card → navigates to that question | |
| 3.3 | Click a visited card (checkmark badge) → stays on grid (does nothing unless Alt is held) | |
| 3.4 | Alt+Click a visited card → re-opens that question | |
| 3.5 | Hover an unvisited card → subtle highlight animation | |
| 3.6 | Progress bar updates as questions are visited | |
| 3.7 | Stats row shows Total, Visited, Remaining counts and percentage | |
| 3.8 | **Snap** button (X) → confirmation dialog → dust animation plays → visited cards disappear | |
| 3.9 | After snap, Remaining count drops to only unvisited | |
| 3.10 | **Restore** button appears after snap → all snapped cards return | |
| 3.11 | **Random** button (R) → jumps to a random unvisited question | |
| 3.12 | **Reset Progress** → all visited marks cleared, snapped cards restored | |
| 3.13 | **Install** button appears when PWA installable (desktop Chrome) | |
| 3.14 | Right-click a card → per-question context menu opens (Open, Mark/Unmark Visited, Mark for Review, Snap This Question, Restore from Dust) | |
| 3.15 | Right-click empty space → global context menu opens (Home, Guide, Journal, Admin, Actions, Appearance, Sounds, Advanced) | |
| 3.16 | Footer: Portfolio link, email, social icons (6), Install App button, Quick Tour button all present | |

---

## 4. Question page

| # | Test | Pass? |
|---|------|-------|
| 4.1 | Question text is displayed | |
| 4.2 | **Space** → answer reveals / hides | |
| 4.3 | Answer reveal stops the timer automatically | |
| 4.4 | **T** → timer starts / pauses | |
| 4.5 | **R** → timer resets to default duration | |
| 4.6 | Timer counts down and plays alarm sound at zero | |
| 4.7 | **Esc** → returns to grid | |
| 4.8 | **Q** → Quick Peek overview opens (grid of all questions) | |
| 4.9 | **M** → question marked / unmarked (amber badge appears/disappears) | |
| 4.10 | **+** or **]** → question text increases | |
| 4.11 | **-** or **[** → question text decreases | |
| 4.12 | **0** → text size resets | |
| 4.13 | **Read** button → browser speaks the question aloud | |
| 4.14 | After answer revealed + Read → browser speaks both question and answer | |
| 4.15 | Read again (or Stop) → speech stops | |
| 4.16 | Navigate to different question → any ongoing speech stops | |
| 4.17 | Pass button → timer resets to pass duration (shorter) | |
| 4.18 | Scoring buttons (Correct, Bonus, Penalty) award points to active team | |
| 4.19 | No active team selected → scoring buttons are disabled | |
| 4.20 | **Alt+Left/Right** arrows → previous/next question navigation | |
| 4.21 | Image attached to question → image loads on question page | |
| 4.22 | Audio attached to question → audio player appears and plays | |
| 4.23 | Quick Peek grid: click a question number → navigates to it | |

---

## 5. Keyboard shortcuts

Open `?` shortcut overlay and verify every listed shortcut works:

| Key | Expected action |
|-----|-----------------|
| `F` | Toggle fullscreen |
| `?` | Show / hide shortcuts modal |
| `S` | Toggle scoreboard sidebar |
| `Alt+Click` | Re-open visited question on grid |
| `R` | Random unvisited question |
| `X` | Snap visited questions |
| `Space` | Reveal / hide answer |
| `Esc` | Back to grid / close modal |
| `Q` | Quick Peek overview |
| `T` | Start / pause timer |
| `R` (question page) | Reset timer |
| `M` | Mark / unmark question |
| `Read` button | Read question aloud |
| `]` or `+` | Increase text size |
| `[` or `-` | Decrease text size |
| `0` | Reset text size |

---

## 6. Touch gestures (mobile / tablet)

| # | Test | Pass? |
|---|------|-------|
| 6.1 | Swipe left on question page → next question | |
| 6.2 | Swipe right → previous question | |
| 6.3 | Double-tap question text → reveal / hide answer | |
| 6.4 | Swipe up → toggle Quick Peek | |
| 6.5 | Long-press a grid card → per-question context menu | |

---

## 7. Theming

| # | Test | Pass? |
|---|------|-------|
| 7.1 | Admin → Theme: switch through all 11 schemes (Purple, Indigo, Blue, Teal, Green, Orange, Red, Pink, Cyan, Slate, Custom) | |
| 7.2 | Each scheme changes the whole app (background, cards, text, tint) | |
| 7.3 | Switch Light / Dark / Auto → all pages follow the mode | |
| 7.4 | Auto mode → follows device appearance setting | |
| 7.5 | Custom scheme: pick primary, secondary, accent colors → app uses them | |
| 7.6 | Every scheme is readable in both light and dark (4.5:1 contrast) | |

---

## 8. Appearance (Admin)

| # | Test | Pass? |
|---|------|-------|
| 8.1 | Change grid number font size → grid numbers change size | |
| 8.2 | Change question text font size → question page text changes | |
| 8.3 | Change answer text font size → answer text changes | |
| 8.4 | Change timer font size → timer display changes | |
| 8.5 | Change stats font size → stats row changes | |

---

## 9. Settings (Admin)

| # | Test | Pass? |
|---|------|-------|
| 9.1 | Change default timer duration (e.g. 20s) → new questions open with 20s | |
| 9.2 | Change pass duration (e.g. 10s) → Pass button adds 10s | |
| 9.3 | Toggle auto-start on open → timer starts automatically when question opens | |
| 9.4 | Toggle auto-start on pass → timer starts automatically after Pass | |
| 9.5 | Change scoring weights (correct/bonus/penalty) → scoring buttons use new values | |
| 9.6 | Change app name → header and tab title update | |
| 9.7 | Enable/disable rounds → grid groups questions under round headers | |
| 9.8 | Add/remove rounds with ID ranges → questions fall under correct rounds | |

---

## 10. Questions (Admin)

| # | Test | Pass? |
|---|------|-------|
| 10.1 | Add a new question (text + answer) → appears on grid | |
| 10.2 | Edit a question → changes reflected on grid and question page | |
| 10.3 | Delete a question → removed from grid | |
| 10.4 | Duplicate question ID → rejected with error | |
| 10.5 | Attach an image to a question → image compresses and loads | |
| 10.6 | Attach audio to a question → audio compresses and loads | |
| 10.7 | Remove media from a question → media gone | |

---

## 11. Batches (Admin)

| # | Test | Pass? |
|---|------|-------|
| 11.1 | Create a new batch → it becomes the active batch | |
| 11.2 | Switch between batches → grid updates to show active batch questions | |
| 11.3 | Double-click a batch pill → rename it | |
| 11.4 | Delete a batch (when >1 exists) → batch removed | |
| 11.5 | Last batch cannot be deleted | |
| 11.6 | Export a single batch → downloads JSON with only that batch | |
| 11.7 | New questions go into the active batch | |
| 11.8 | First launch seeds the company quiz + 3 sample batches | |
| 11.9 | Sample batches have distinct styles (rounds on/off, short/long questions) | |
| 11.10 | Delete a sample batch (when >1 exists) → stays deleted after refresh | |
| 11.11 | Reset questions (Reset to defaults) → company quiz + samples restored | |

---

## 12. Teams (Admin)

| # | Test | Pass? |
|---|------|-------|
| 12.1 | Add a team → appears in scoreboard | |
| 12.2 | Edit team name → name updates everywhere | |
| 12.3 | Delete a team → confirmation dialog → team removed | |
| 12.4 | Click a team in scoreboard → it becomes the active team | |
| 12.5 | Manual score adjustment → score changes | |

---

## 13. Sounds (Admin)

| # | Test | Pass? |
|---|------|-------|
| 13.1 | Master toggle OFF → all sounds stop | |
| 13.2 | Master toggle ON → sounds resume | |
| 13.3 | Toggle individual sound (Click, Select, Reveal, Back, Timer End, Success, Error, Warning, Pass, Fullscreen, Snap) → only that sound mutes/unmutes | |
| 13.4 | Preview button plays each sound | |

---

## 14. Backup and Restore

| # | Test | Pass? |
|---|------|-------|
| 14.1 | Export → downloads a `.json` file | |
| 14.2 | Import the exported file → all data restored (questions, teams, config) | |
| 14.3 | Export only active batch → JSON contains only that batch | |
| 14.4 | Import invalid JSON → error message shown | |
| 14.5 | Reset All Data → confirmation → all data wiped, defaults restored | |
| 14.6 | After reset, sample questions re-appear on grid | |

---

## 15. Scoreboard sidebar

| # | Test | Pass? |
|---|------|-------|
| 15.1 | **S** key → scoreboard slides in from right | |
| 15.2 | Click outside drawer → closes | |
| 15.3 | Active team highlighted | |
| 15.4 | Scores sort highest to lowest | |
| 15.5 | Manual +/- adjustment updates score | |
| 15.6 | On mobile: floating button at bottom-right opens scoreboard | |

---

## 16. PWA and offline

| # | Test | Pass? |
|---|------|-------|
| 16.1 | First load on `localhost:5173` → dev service worker registers (check DevTools > Application) | |
| 16.2 | Production (`sajiloquiz.vercel.app`) → production SW registers, 30 assets precached | |
| 16.3 | Disconnect internet (DevTools > Network > Offline) → app still loads and works | |
| 16.4 | Grid, questions, scoring, sounds, themes all work offline | |
| 16.5 | Desktop Chrome: Install App button or address-bar icon appears | |
| 16.6 | Click install → app installs and opens fullscreen (no browser bar) | |
| 16.7 | Installed app: shortcuts in OS app menu (Grid, Admin) | |
| 16.8 | Footer Install App button → triggers install prompt | |
| 16.9 | iOS Safari: Share > Add to Home Screen → app installs | |
| 16.10 | After install, open again → opens standalone, no URL bar | |
| 16.11 | Manifest: `display: standalone`, 4 icons (192, 512, 180, favicon), theme color matches scheme | |
| 16.12 | **S** opens scoreboard in installed app | |

---

## 17. SEO and meta

| # | Test | Pass? |
|---|------|-------|
| 17.1 | View page source on `/#/` → has `<title>`, Open Graph, Twitter card meta | |
| 17.2 | FAQ page source → `FAQPage` JSON-LD present | |
| 17.3 | Guide page source → `HowTo` JSON-LD present | |
| 17.4 | `robots.txt` present at `/robots.txt` | |
| 17.5 | `sitemap.xml` present, includes all routes | |
| 17.6 | PWA manifest linked in `<head>` | |

---

## 18. Responsive layout

| # | Test | Pass? |
|---|------|-------|
| 18.1 | Desktop (>1024px): grid shows 4+ columns, footer is horizontal | |
| 18.2 | Tablet (768–1024px): grid columns reduce, footer stacks | |
| 18.3 | Mobile (<640px): grid is 3–4 columns, footer stacks vertically, nav collapses | |
| 18.4 | Question page: text, timer, buttons all fit and are tappable | |
| 18.5 | Admin panel: tabs scroll horizontally on mobile | |
| 18.6 | Scoreboard: slides in as a full overlay on mobile | |
| 18.7 | Onboarding tour: text and buttons are readable on mobile | |

---

## 19. Error handling

| # | Test | Pass? |
|---|------|-------|
| 19.1 | Open `/#/question/99999` (non-existent ID) → error handled gracefully, not a blank screen | |
| 19.2 | Clear all IndexedDB data → app recreates defaults on next load | |
| 19.3 | Corrupt localStorage data → app still loads with defaults | |
| 19.4 | Update banner appears when new deployment detected (hard-refresh needed) | |

---

## 20. Data integrity

| # | Test | Pass? |
|---|------|-------|
| 20.1 | Add questions in Admin → refresh → questions persist | |
| 20.2 | Change theme → refresh → theme persists | |
| 20.3 | Change timer settings → refresh → settings persist | |
| 20.4 | Mark questions as visited → refresh → visited marks persist | |
| 20.5 | Mark questions for review → refresh → marks persist | |
| 20.6 | Award points → refresh → scores persist | |
| 20.7 | Create batch → refresh → batch persists | |
| 20.8 | Data lives in IndexedDB (check DevTools > Application > IndexedDB) | |

---

## 21. Performance

| # | Test | Pass? |
|---|------|-------|
| 21.1 | Grid page loads in under 2 seconds with 60 questions | |
| 21.2 | No visible layout shift on page transitions | |
| 21.3 | Images compress to ≤800px JPEG on upload | |
| 21.4 | Audio compresses to mono 16 kHz WAV on upload | |
| 21.5 | Admin, Guide, Journal, FAQ load lazily (check Network tab: no chunk >60 KB) | |

---

## 22. Content pages

| # | Test | Pass? |
|---|------|-------|
| 22.1 | FAQ page: 12 questions listed, each expandable | |
| 22.2 | FAQ answers are accurate (compare with actual app behavior) | |
| 22.3 | Guide page: all sections present (Getting started through Where to get help) | |
| 22.4 | Guide shortcuts table matches actual shortcuts | |
| 22.5 | Journal: 8 articles listed with tags and read times | |
| 22.6 | Journal articles load and render correctly | |
| 22.7 | Privacy policy page renders, has email link | |
| 22.8 | Terms page renders, has email link | |
| 22.9 | 404 page renders with link back to home | |
| 22.10 | Footer "Back to top" button scrolls to top | |

---

## Sign-off

| Area | Status | Notes |
|------|--------|-------|
| Routes | | |
| Onboarding | | |
| Grid | | |
| Question page | | |
| Shortcuts | | |
| Touch gestures | | |
| Theming | | |
| Appearance | | |
| Settings | | |
| Questions | | |
| Batches | | |
| Teams | | |
| Sounds | | |
| Backup/Restore | | |
| Scoreboard | | |
| PWA / Offline | | |
| SEO / Meta | | |
| Responsive | | |
| Error handling | | |
| Data integrity | | |
| Performance | | |
| Content pages | | |

**QA person:** ___________________
**Date:** ___________________
**Build tested:** ___________________
