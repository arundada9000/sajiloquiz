# Sajilo Quiz App 🚀

A premium, interactive Quiz Application built for standard quizzes, competitions, and presentations. Designed with a futuristic aesthetic and robust offline capabilities.

## ✨ Features

- **Futuristic UI**: Glassmorphism, smooth animations (Framer Motion), and responsive design.
- **Admin Dashboard**: Manage questions, configure rounds, and customize branding directly from the app.
- **Offline First**: All data is stored locally (`localStorage`). Works without internet once loaded.
- **Multimedia Support**: Embed images and audio. Built-in compression for efficient storage.
- **PWA Ready**: Installable as a native app on specific devices.
- **Smart Shortcuts**: Keyboard controls for power users.
- **Round Logic**: Group questions into rounds (e.g., Rapid Fire, General) or use a standard grid.

## 🛠️ Setup & Installation

### Option 1: Development
1. Clone the repo.
2. Run `npm install`.
3. Run `npm run dev` to start the local server.

### Option 2: Live Preview
1. Run `npm run preview` to build and serve the production version locally.

### Option 3: Install as App (PWA)
1. Open the app in a supported browser (Chrome, Edge).
2. Click the **"Install App"** button (next to Reset Progress) or use the browser's install icon in the address bar.

---

## 🎮 User Guide

### Navigation
- **Grid View**: Main hub. Click a number to open a question.
- **Rounds**: If enabled, questions are grouped by round headers.
- **Question View**: Displays the question. Spacebar to reveal answer.
- **Back**: Press `ESC` or click Back to return to the grid.

### Keyboard Shortcuts
| Key | Action |
| :--- | :--- |
| **Space** | Reveal / Hide Answer |
| **ESC** | Back to Grid / Close Modal |
| **T** | Start / Pause Timer |
| **R** | Reset Timer |
| **[** or **-** | Decrease Text Size |
| **]** or **+** | Increase Text Size |
| **0** | Reset Text Size |
| **Alt + Click**| Force re-open a visited question |

---

## 🛡️ Admin Guide

Access the Admin Panel via the **Settings** button in the footer.

### 1. Question Manager
- **Add**: Create new questions. Assign to Rounds automatically or manually.
- **Media**: Upload images or audio. 
  - *Images*: Auto-compressed to 800px JPEG.
  - *Audio*: Auto-converted to Mono 16kHz WAV for small size.
- **Edit/Delete**: Modify existing questions.

### 2. General Settings
- **Branding**: Change App Name and Company Name.
- **Timer**: Set default durations and auto-start behavior.
- **Rounds**: Enable/Disable rounds. Define ranges (e.g., Round 1: Q1-10).

### 3. Appearance
- **Typography**: Adjust font sizes for different screens (Grid, Questions, Answers).

### 4. Backup & Restore
- **Export**: Download your entire quiz configuration as a `.json` file. **Do this often!**
- **Import**: Restore a backup (Drag & drop support).
- **Reset**: Wipe all local data and return to defaults.
- **Storage**: Monitor browser capability (Limit is usually ~5MB).

---

## 🎨 Customization

### Icons
Replace `public/icon.svg` and `public/pwa-192x192.png` etc. with your own logo.

### Colors
Modify `src/index.css` to change the global color variables and gradients.

---

### 📝 License
Built by Sajilo Digital. Free for personal and educational use.
