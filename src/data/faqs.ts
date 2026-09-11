// Shared FAQ content. Used by the FAQ page AND the FAQPage JSON-LD injected at
// build time (see vite.config.ts) so the page and structured data never drift.

export type FaqItem = {
  question: string;
  answer: string;
};

export const faqItems: FaqItem[] = [
  {
    question: "Does Sajilo Quiz need an internet connection?",
    answer:
      "No. It is an installable Progressive Web App. Once loaded, the whole quiz, including your questions, images and sounds, runs offline. That is exactly why it was built: quiz venues often have unreliable internet.",
  },
  {
    question: "How do I add my own questions?",
    answer:
      "Open the Admin Panel (the gear icon at the top or the Admin link in the footer). There you can create questions and rounds, attach images and audio, and everything is saved right in your browser on your device.",
  },
  {
    question: "What are rounds and batches?",
    answer:
      "Rounds let you group questions into named sections with their own titles - perfect for themed quiz nights like General, Science or Sports. Batches are reusable question groups you can add to any event. Both are managed from the Admin Panel.",
  },
  {
    question: "How does scoring work?",
    answer:
      "Create teams in the Admin Panel, then use the Assign Points panel on each question screen to award correct, bonus or penalty points. Scores update live in the sidebar scoreboard, which stays visible while you present.",
  },
  {
    question: "How do I read a question aloud?",
    answer:
      "Every question has a Read button that speaks the question text using speech synthesis. If the answer is already revealed, it reads the answer too. It works fully offline with no audio files needed.",
  },
  {
    question: "What do Random, Snap and Mark do?",
    answer:
      "Random (R) jumps you to a random unvisited question, great when the floor picks the category. Snap (X) snaps finished questions out of the grid to keep the screen clean, and you can restore them anytime. Mark (M) flags a question for later review.",
  },
  {
    question: "Is my quiz data uploaded anywhere?",
    answer:
      "No. Questions, scores and settings live in your browser's localStorage on your own device. Nothing you create is sent to a server. You can export a backup JSON from the Admin Panel and import it on another device.",
  },
  {
    question: "Can I restyle the whole app?",
    answer:
      "Yes. The Admin Panel includes eleven hand-tuned color schemes plus a fully custom palette, custom fonts and sizes, and toggleable sound effects and haptics. The entire look is managed in the Appearance and Settings tabs.",
  },
  {
    question: "Is Sajilo Quiz free?",
    answer:
      "Yes, completely free. It was built for real quiz competitions and is shared so anyone can run a smooth quiz event with it.",
  },
  {
    question: "How do I install it as an app?",
    answer:
      "Look for the Install App button in the footer, then follow the prompt your browser shows. On phones you can use the browser's Install App or Add to Home Screen option. Installed, it opens fullscreen like a native app and works offline.",
  },
  {
    question: "How do I see all keyboard shortcuts?",
    answer:
      "Press ? anywhere to open the shortcut list, or check the Keyboard Shortcuts section of the user guide. Hosts can drive the whole quiz from the keyboard when projecting on a big screen.",
  },
  {
    question: "How do I get started quickly?",
    answer:
      "Press the Quick Tour button in the footer for a short walkthrough of the major features, follow the Step-by-Step Quick Start section of the guide, or just open the grid and click the first question card.",
  },
];