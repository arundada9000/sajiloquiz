# Sajilo Quiz

A quiz app, offline-capable quiz application designed for hosting live events, competitions, and trivia nights. Built with **React**, **TypeScript**, and **Vite**, featuring a stunning glassmorphic UI and robust admin controls.

![Sajilo Quiz Demo](./public/icon.svg)

## ✨ Features

- **🏆 Interactive Grid**: 50+ question grid with visited states and round selection.
- **📱 Mobile Optimized**: Fully responsive Admin Panel and Game views.
- **⚡ Offline Ready**: Works 100% offline as a PWA (Progressive Web App).
- **🎨 Custom Branding**: Configurable titles, colors, and font sizes via Admin settings.
- **🔊 Sound FX**: Integrated sound effects for interactions, timers, and reveals.
- **⏱️ Smart Timer**: Built-in countdowns, pass timers, and auto-stop logic.
- **🎹 Keyboard Shortcuts**: Power-user controls for seamless hosting.
- **💾 Auto-Save**: All changes and progress persist automatically to local storage.
- **🔄 Data Management**: Export and Import full quiz configurations as JSON.

## 🚀 Quick Start

1.  **Install Dependencies**:

    ```bash
    npm install
    ```

2.  **Run Development Server**:

    ```bash
    npm run dev
    ```

3.  **Build for Production**:
    ```bash
    npm run build
    ```
    _The `dist` folder can be served statically or opened directly._

## ⌨️ Keyboard Shortcuts

| Key       | Action               | Context       |
| :-------- | :------------------- | :------------ |
| **Space** | Reveal / Hide Answer | Question Page |
| **ESC**   | Back to Grid         | Question Page |
| **T**     | Start / Pause Timer  | Question Page |
| **R**     | Reset Timer          | Question Page |
| **] / +** | Increase Text Size   | Question Page |
| **[ / -** | Decrease Text Size   | Question Page |
| **0**     | Reset Text Size      | Question Page |

## 🛠️ Admin Guide

Access the Admin Panel by clicking **"Admin Panel"** in the footer of the main grid.

1.  **Questions**: Add, Edit, or Delete questions. Assign them to Rounds for auto-ID generation.
2.  **Settings**: Configure App Name, Timer Defaults, and Round structures.
3.  **Appearance**: Fine-tune font sizes for different elements (Questions, Answers, Timer).
4.  **Backup**: Export your data before making big changes.

## 📦 Tech Stack

- **Framework**: React 18 + Vite
- **Language**: TypeScript
- **Styling**: TailwindCSS + Framer Motion
- **Icons**: Lucide React
- **Routers**: React Router v6

---

_Built with ❤️ for Sajilo Digital by CTO Arun Neupane_
