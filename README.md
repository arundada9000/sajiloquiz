# Sajilo Quiz

A free, offline-first quiz presentation app for running live events. Build questions and rounds, project a question grid on the big screen, reveal answers one by one, and keep team scores in the sidebar. It works fully offline once loaded.

> The venue Wi-Fi will fail. You'll be ready.
>
> Built for quiz nights where the internet is the one thing that never shows up.
>
> No internet? No problem. That is the whole point.

---

## Quick Links

- **Live app:** https://sajiloquiz.vercel.app
- **Source:** https://github.com/arundada9000/sajiloquiz
- **Issues:** Open an issue or email the author (below)

---

## Screenshots

**Desktop - Question Grid**

![Question grid on desktop](docs/screenshots/grid-desktop.png)

**Mobile - Question Grid**

![Question grid on mobile](docs/screenshots/grid-mobile.png)

**Desktop - Admin Dashboard**

![Admin dashboard on desktop](docs/screenshots/admin-desktop.png)

---

## Features

- **Offline first:** installable PWA. Everything, including your questions, images and sounds, runs with no internet.
- **Theme system:** 10 color schemes (Purple, Indigo, Blue, Teal, Green, Orange, Red, Pink, Graphite and a Custom palette) with Light, Dark and Auto modes.
- **Sound effects:** a set of Web Audio generated sounds with a master toggle and individual controls.
- **Fullscreen:** press F to toggle fullscreen on any page.
- **Keyboard shortcuts and gestures:** press ? to see the full list. Touch devices get swipe and double-tap gestures.
- **Admin dashboard:** manage questions, configure rounds, brand the app, control themes and sounds, and back up your data.
- **Quick Peek:** press Q on any question for an overview grid of every question.
- **Rounds:** group questions into rounds (Rapid Fire, General, etc.) or use a standard grid.
- **Multimedia:** embed images (auto-compressed to 800px JPEG) and audio (auto-converted to mono 16 kHz WAV).
- **Team scoreboard:** the sidebar tracks team scores as you call answers.
- **SEO / AEO / Geo ready:** structured data, Open Graph, Twitter cards and geo metadata driven by one config file.

---

## Setup and Installation

### Option 1: Development

```bash
npm install
npm run dev
```

### Option 2: Production build and local preview

```bash
npm run build
npm run preview
```

### Option 3: Install as an app (PWA)

1. Open the app in a supported browser (Chrome, Edge, or Safari).
2. Click the install button, or use the browser address-bar install icon.
3. Launch it from your home screen or taskbar like a native app.

---

## User Guide

### Navigation

- **Grid view:** the main hub. Click a question number to open it.
- **Rounds:** with rounds enabled, questions appear grouped under round headers.
- **Question view:** shows the question and timer. Spacebar reveals the answer.
- **Back:** press ESC or the Back button to return to the grid.
- **Fullscreen:** press F anywhere.
- **Help:** press ? anywhere for shortcuts and gestures.

### Keyboard Shortcuts

**Global**

| Key | Action |
| :--- | :--- |
| **F** | Toggle fullscreen |
| **?** | Show / hide shortcuts and gestures |

**Grid page**

| Key | Action |
| :--- | :--- |
| **Alt + Click** | Re-open a visited question |
| **Double-click** | Open a question from the grid |
| **Right-click** | Open the quick actions menu |

**Question page**

| Key | Action |
| :--- | :--- |
| **Space** | Reveal / hide answer |
| **Esc** | Back to grid / close modal |
| **Q** | Open quick peek overview |
| **T** | Start / pause timer |
| **R** | Reset timer |
| **+** / **]** | Increase text size |
| **-** / **[** | Decrease text size |
| **0** | Reset text size |

### Touch Gestures (mobile)

| Gesture | Action |
| :--- | :--- |
| **Swipe left** | Go to the next question |
| **Swipe right** | Go to the previous question |
| **Double-tap** | Reveal / hide the answer |
| **Swipe up** | Toggle quick peek |
| **Right tap (long press)** | Open the quick actions menu |

---

## Admin Guide

Open the Admin Panel from the Settings button in the footer.

### 1. Question Manager

- **Add:** create new questions, assigned to rounds automatically or manually.
- **Media:** upload images (auto-compressed to 800px JPEG) or audio (auto-converted to mono 16 kHz WAV).
- **Edit / Delete:** modify or remove existing questions. Duplicate IDs are rejected to keep data safe.

### 2. General Settings

- **Branding:** change the app name and company name.
- **Timer:** set default durations and auto-start behavior.
- **Rounds:** enable/disable rounds and define ranges (e.g. Round 1: Q1-10).

### 3. Appearance

- **Typography:** adjust font sizes for the grid, questions and answers.

### 4. Theme

- **Display mode:** Light, Dark, or Auto (follows the system).
- **Color scheme:** 10 schemes including a fully custom palette with a color picker. Changes apply instantly.

### 5. Sounds

- **Master control:** enable or disable all sounds at once.
- **Individual toggles:** control each sound separately.
- **Preview:** test a sound before enabling it.

### 6. Backup and Restore

- **Export:** download the whole quiz configuration as a .json file. Do this often.
- **Import:** restore a backup (drag and drop support).
- **Reset:** wipe all local data and return to defaults.
- **Storage:** monitor browser capability (the limit is usually around 5 MB).

---

## Legal and Support Pages

- **Privacy Policy:** in-app at the /#/privacy route.
- **Terms of Use:** in-app at the /#/terms route.
- Links to both are in the footer of the grid and the About tab of Admin.

---

## Customization

### Central site configuration

All branding, URLs, social links, geo metadata and PWA settings live in one file:

```
src/config/site.ts
```

Edit it to rebrand or repoint the app. On the next build, the meta tags, Open Graph, Twitter cards, structured data (JSON-LD), robots.txt, sitemap.xml, PWA manifest, shortcuts and page content all update automatically. Nothing else needs to change.

### Icons

Replace the files in `public/` (favicon.png, 192x192.png, 512x512.png, 180x180.png) with your own logo.

### Themes

Use the built-in theme system in Admin, Theme tab, to restyle without touching code.

### Advanced

- Global styles: `src/index.css`
- Color schemes: `src/utils/theme.ts`
- Tailwind theme: `tailwind.config.js`

---

## Tech Stack

- React 18 + TypeScript
- Vite 5
- Tailwind CSS 3
- React Router 6
- Framer Motion
- vite-plugin-pwa (service worker)

---

## Project Structure

```
quiz/
|-- docs/screenshots/     # README screenshots
|-- public/               # static assets, icons, og-image
|-- src/
|   |-- components/       # UI components (modals, error boundary, etc.)
|   |-- config/           # site.ts (single source of branding/URLs)
|   |-- context/          # data + quiz state management
|   |-- data/             # default config and sample questions
|   |-- pages/            # Grid, Question, Admin, Privacy, Terms, Offline
|   |-- utils/            # theme, sounds
|   |-- App.tsx           # routes
|   |-- main.tsx          # entry
|-- index.html            # meta + structured data (injected at build)
|-- vite.config.ts        # build config, PWA, SEO injection
```

---

## License

Proprietary. Not free for use. Every use requires written permission from the author or company. See [LICENSE](LICENSE) for the full terms.

---

## Author

**Arun Neupane** (CTO, Sajilo Digital)

- Website: https://arunneupane.netlify.app
- Email: arunneupane0000@gmail.com
- Phone: +977 9842977207
- Instagram: https://www.instagram.com/sajilo_digital
- Facebook: https://www.facebook.com/profile.php?id=61579846778258
- GitHub: https://github.com/sajhilodigital
- YouTube: https://www.youtube.com/@sajilo_digital

---

## Team

| Role | Name |
| :--- | :--- |
| Chairperson | Pramod Chaudhary |
| CEO | Bal Gobind Chaudhary |
| CTO | Arun Neupane |
| QA | Sunil Paudyal |
| Frontend Developer | Bijay Kumar Chaudhary |
| Video Editor | Aashish GM |

---

Built by Arun Neupane - (c) 2026 All Rights Reserved
