# Sajilo Quiz App

A premium, interactive Quiz Application built for quizzes, competitions, and presentations. Designed with a futuristic aesthetic and robust offline capabilities.

## Features

- **Futuristic UI**: Glassmorphism, smooth animations (Framer Motion), and responsive design
- **Theme System**: 6 color schemes (Purple, Blue, Green, Red, Orange, Pink) with light/dark/auto modes
- **Sound Effects**: 11 interactive sounds with granular control (master toggle + individual controls)
- **Fullscreen Mode**: Press F to toggle fullscreen on any page
- **Keyboard Shortcuts**: Press ? to see all shortcuts - designed for power users
- **Admin Dashboard**: Manage questions, configure rounds, customize branding, and control themes/sounds
- **Quick Peek**: Press Q on any question to see an overview grid of all questions
- **Offline First**: All data stored locally (localStorage). Works without internet once loaded
- **Multimedia Support**: Embed images and audio with built-in compression
- **PWA Ready**: Installable as a native app on supported devices
- **Smart Shortcuts**: Comprehensive keyboard controls for efficient navigation
- **Round Logic**: Group questions into rounds (e.g., Rapid Fire, General) or use a standard grid

## Setup & Installation

### Option 1: Development
1. Clone the repo
2. Run `npm install`
3. Run `npm run dev` to start the local server

### Option 2: Live Preview
1. Run `npm run preview` to build and serve the production version locally

### Option 3: Install as App (PWA)
1. Open the app in a supported browser (Chrome, Edge)
2. Click the **"Install App"** button or use the browser's install icon in the address bar

---

## User Guide

### Navigation
- **Grid View**: Main hub. Click a number to open a question
- **Rounds**: If enabled, questions are grouped by round headers
- **Question View**: Displays the question. Spacebar to reveal answer
- **Back**: Press `ESC` or click Back to return to the grid
- **Fullscreen**: Press `F` anywhere to toggle fullscreen mode
- **Help**: Press `?` anywhere to see all keyboard shortcuts

### Keyboard Shortcuts

**Global Shortcuts**
| Key | Action |
| :--- | :--- |
| **F** | Toggle Fullscreen |
| **?** | Show/Hide Keyboard Shortcuts |

**Grid Page**
| Key | Action |
| :--- | :--- |
| **Alt + Click** | Re-open visited question |

**Question Page**
| Key | Action |
| :--- | :--- |
| **Space** | Reveal / Hide Answer |
| **Esc** | Back to Grid / Close Modal |
| **Q** | Open Quick Peek Overview |
| **T** | Start / Pause Timer |
| **R** | Reset Timer |
| **+** or **]** | Increase Text Size |
| **-** or **[** | Decrease Text Size |
| **0** | Reset Text Size |

---

## Admin Guide

Access the Admin Panel via the **Settings** button in the footer.

### 1. Question Manager
- **Add**: Create new questions. Assign to Rounds automatically or manually
- **Media**: Upload images or audio
  - *Images*: Auto-compressed to 800px JPEG
  - *Audio*: Auto-converted to Mono 16kHz WAV for small size
- **Edit/Delete**: Modify existing questions

### 2. General Settings
- **Branding**: Change App Name and Company Name
- **Timer**: Set default durations and auto-start behavior
- **Rounds**: Enable/Disable rounds. Define ranges (e.g., Round 1: Q1-10)

### 3. Appearance
- **Typography**: Adjust font sizes for different screens (Grid, Questions, Answers)

### 4. Theme
- **Display Mode**: Choose Light, Dark, or Auto (follows system preference)
- **Color Scheme**: Select from 6 color schemes with live preview
- **Instant Updates**: Changes apply immediately

### 5. Sounds
- **Master Control**: Enable/disable all sounds at once
- **Individual Toggles**: Control each of the 11 sound effects separately
- **Preview**: Test each sound before enabling

### 6. Backup & Restore
- **Export**: Download your entire quiz configuration as a `.json` file. **Do this often!**
- **Import**: Restore a backup (Drag & drop support)
- **Reset**: Wipe all local data and return to defaults
- **Storage**: Monitor browser capability (Limit is usually ~5MB)

---

## Customization

### Icons
Replace `public/icon.svg` and `public/pwa-192x192.png` with your own logo.

### Themes
Use the built-in theme system in Admin → Theme tab to customize without editing code.

### Advanced Customization
Modify `src/index.css` to change global styles or `src/utils/theme.ts` to add new color schemes.

---

## License
Built by Sajilo Digital. Free for personal and educational use.

