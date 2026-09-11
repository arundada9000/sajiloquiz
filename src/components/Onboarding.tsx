import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  LayoutGrid,
  Timer,
  Users,
  Sparkles,
  Shuffle,
  Palette,
  Keyboard,
  Download,
  ListOrdered,
  Volume2,
} from "lucide-react";
import { useData } from "../context/DataContext";
import { Link } from "react-router-dom";

type OnboardingStep = {
  icon: typeof LayoutGrid;
  title: string;
  text: string;
  points: string[];
  key: string;
};

const STORAGE_KEY = "sajilo-quiz-onboarding-seen";

const steps: OnboardingStep[] = [
  {
    key: "grid",
    icon: LayoutGrid,
    title: "The question grid",
    text: "Your quiz is a grid of question cards. Every card you open lights up as visited, so you always know which questions are done and which are left.",
    points: [
      "Click a card to open the question",
      "Alt+Click re-opens a visited question",
      "Right-click a card for quick actions",
      "Mark questions for review with M",
    ],
  },
  {
    key: "question",
    icon: Timer,
    title: "One question at a time",
    text: "Each question gets the full spotlight: big readable text, a live countdown timer, and one clean Reveal button for the answer.",
    points: [
      "Space reveals the answer",
      "+ and - zoom the text size",
      "F goes fullscreen for the big screen",
      "T starts/pauses the timer",
    ],
  },
  {
    key: "rounds",
    icon: ListOrdered,
    title: "Rounds and batches",
    text: "Group questions into named rounds with their own titles, or reuse themed batches of questions whenever you need them.",
    points: [
      "Create unlimited rounds",
      "Batches are reusable question groups",
      "The current round shows above each question",
    ],
  },
  {
    key: "scoring",
    icon: Users,
    title: "Teams and live scoring",
    text: "Keep score as you go. Create teams, pick the one that answered, and award points right from the question screen.",
    points: [
      "Award correct, bonus and penalty points",
      "Scores update live in the sidebar",
      "Everything stays on your device",
    ],
  },
  {
    key: "random",
    icon: Shuffle,
    title: "Random and review",
    text: "Not sure which question to pick next? Let the app choose a random one for you, or snap questions away once a round is finished.",
    points: [
      "R jumps to a random unvisited question",
      "X snaps finished questions out of the grid",
      "Restore snapped questions anytime",
      "M marks a question for later review",
    ],
  },
  {
    key: "themes",
    icon: Palette,
    title: "Make it yours",
    text: "Sajilo Quiz ships with eleven hand-tuned color schemes, custom fonts, sound effects and haptics. Brand a whole quiz night in seconds.",
    points: [
      "Eleven built-in themes plus a custom palette",
      "Choose your own fonts and sizes",
      "Default question data with over 200 ready questions",
    ],
  },
  {
    key: "shortcuts",
    icon: Keyboard,
    title: "Built for the big screen",
    text: "Every action has a keyboard shortcut, so the host never has to fumble with a mouse in front of an audience.",
    points: [
      "Press ? anytime to see the full shortcut list",
      "Fullscreen projection ready",
      "Swipe between questions on touch devices",
    ],
  },
  {
    key: "offline",
    icon: Download,
    title: "Works offline, really",
    text: "Sajilo Quiz is a Progressive Web App. Once you open it, everything - questions, images, sounds and scores - lives on your device.",
    points: [
      "Install it like a native app (button below)",
      "Perfect for venues with patchy internet",
      "Your data never leaves your browser",
    ],
  },
  {
    key: "read",
    icon: Volume2,
    title: "Read questions aloud",
    text: "New in this version: the host can read a question aloud with built-in speech synthesis - handy for players who prefer to hear the question.",
    points: [
      "Read button on every question",
      "Reads the answer too once revealed",
      "Fully offline, no audio files needed",
    ],
  },
];

export default function Onboarding() {
  const { appConfig } = useData();
  const [isOpen, setIsOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [hasSeen, setHasSeen] = useState(false);
  const [dismissedEver, setDismissedEver] = useState(false);

  const open = useCallback(() => {
    setIndex(0);
    setIsOpen(true);
    setDismissedEver(true);
  }, []);

  const close = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* storage unavailable */
    }
    setHasSeen(true);
    setIsOpen(false);
  }, []);

  const finish = useCallback(() => {
    close();
  }, [close]);

  // Auto-show on first visit, after a short delay so the grid paints first.
  useEffect(() => {
    if (hasSeen || dismissedEver) return;
    let mounted = true;
    try {
      if (localStorage.getItem(STORAGE_KEY)) {
        setHasSeen(true);
        return;
      }
    } catch {
      /* storage unavailable */
    }
    const id = window.setTimeout(() => {
      if (mounted && !localStorage.getItem(STORAGE_KEY)) {
        open();
      }
    }, 700);
    return () => {
      mounted = false;
      window.clearTimeout(id);
    };
  }, [open, hasSeen, dismissedEver]);

  // Re-open via the footer "Quick Tour" button.
  useEffect(() => {
    const onEvent = () => open();
    window.addEventListener("sajilo:onboarding", onEvent);
    return () => window.removeEventListener("sajilo:onboarding", onEvent);
  }, [open]);

  // Lock body scroll while open.
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const step = steps[index];
  const isLast = index === steps.length - 1;

  const goNext = () => {
    if (isLast) {
      finish();
      return;
    }
    setIndex((i) => i + 1);
  };

  const goPrev = () => {
    if (index === 0) return;
    setIndex((i) => i - 1);
  };

  // Keyboard navigation for the tour.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "Enter") goNext();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, index, goPrev, goNext, close, finish]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[95] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 overlay animate-fade-in"
            onClick={close}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Welcome tour"
            className="relative z-10 glass-panel rounded-2xl w-full max-w-lg animate-scale-in overflow-hidden"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-5">
              <span className="text-xs uppercase tracking-widest font-black text-[rgb(var(--color-primary))]">
                {appConfig.appName} Tour
              </span>
              <button
                onClick={close}
                className="p-1.5 rounded-lg text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))] hover:bg-[var(--fill)] transition-colors"
                aria-label="Close tour"
              >
                <X size={18} />
              </button>
            </div>

            {/* Step content */}
            <div className="px-6 py-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step.key}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-12 h-12 rounded-2xl bg-[rgb(var(--color-primary))]/15 text-[rgb(var(--color-primary))] flex items-center justify-center mb-4">
                    <step.icon size={24} />
                  </div>
                  <h2 className="text-xl font-black mb-2 text-[rgb(var(--text-primary))]">
                    {step.title}
                  </h2>
                  <p className="text-sm text-[rgb(var(--text-secondary))] leading-relaxed mb-4">
                    {step.text}
                  </p>
                  <ul className="space-y-1.5">
                    {step.points.map((p) => (
                      <li
                        key={p}
                        className="flex items-start gap-2 text-sm text-[rgb(var(--text-primary))]"
                      >
                        <Sparkles
                          size={13}
                          className="mt-0.5 shrink-0 text-[rgb(var(--color-primary))]"
                        />
                        {p}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between gap-3 px-6 pb-6">
              <div className="flex items-center gap-1.5">
                {steps.map((s, i) => (
                  <span
                    key={s.key}
                    className={`h-1.5 rounded-full transition-all ${
                      i === index
                        ? "w-6 bg-[rgb(var(--color-primary))]"
                        : "w-1.5 bg-[var(--separator)]"
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                {index > 0 && (
                  <button
                    onClick={goPrev}
                    className="p-2 rounded-lg text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))] hover:bg-[var(--fill)] transition-colors"
                    aria-label="Previous step"
                  >
                    <ChevronLeft size={18} />
                  </button>
                )}
                <button
                  onClick={goNext}
                  className="btn-primary flex items-center gap-2 px-5 py-2.5 text-sm"
                >
                  {isLast ? "Start the quiz" : "Next"}
                  {isLast ? <Play size={16} /> : <ChevronRight size={16} />}
                </button>
              </div>
            </div>

            {/* Helpful links */}
            <div className="px-6 pb-5 pt-1 flex items-center justify-center gap-4 text-xs text-[rgb(var(--text-secondary))]">
              <Link
                to="/guide"
                onClick={close}
                className="hover:text-[rgb(var(--color-primary))] transition-colors"
              >
                Read the full guide
              </Link>
              <span className="opacity-40">|</span>
              <Link
                to="/faq"
                onClick={close}
                className="hover:text-[rgb(var(--color-primary))] transition-colors"
              >
                FAQ
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}