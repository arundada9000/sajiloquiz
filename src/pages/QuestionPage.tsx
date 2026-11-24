import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Timer,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Minus,
  ArrowRight,
  Maximize,
  Minimize,
  LayoutGrid,
  X,
  Users,
  ChevronDown,
  Check,
  Bookmark,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useData } from "../context/DataContext";
import { useQuiz } from "../context/QuizContext";
import { sounds } from "../utils/sounds";
import ShortcutsModal from "../components/ShortcutsModal";
import { setQuestionMenuData } from "../utils/contextMenuStore";
import { useDialog } from "../context/DialogContext";
import { speakText, cancelSpeech, isSpeechSupported } from "../utils/speech";

export default function QuestionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { appConfig: config, allQuestions: questions, activeRounds, activeEnableRounds } = useData();
  const questionId = Number(id);
  const question = questions.find((q) => q.id === questionId);

  // Determine Round Title
  let roundTitle = "";
  if (activeEnableRounds) {
    const activeRound = activeRounds.find(
      (r) => questionId >= r.range[0] && questionId <= r.range[1],
    );
    if (activeRound) roundTitle = activeRound.title;
  }

  const [showAnswer, setShowAnswer] = useState(false);
  const { markAsVisited, visitedIds, markedIds, toggleMark, dustedIds } = useQuiz();
  const isMarked = markedIds.includes(questionId);

  // Dynamic Font Scaling
  const MIN_SCALE = 0.5;
  const MAX_SCALE = 3;
  const SCALE_STEP = 0.1;
  const TIMER_ADJUST_STEP = 10;
  const [scale, setScale] = useState(1);

  // Fullscreen State
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Quick Peek State
  const [showQuickPeek, setShowQuickPeek] = useState(false);

  // Text-to-speech State
  const [isSpeakingQ, setIsSpeakingQ] = useState(false);

  // Shortcuts Modal State
  const [showShortcuts, setShowShortcuts] = useState(false);

  // Fullscreen Toggle Handler
  const toggleFullscreen = useCallback(() => {
    sounds.fullscreen();
    if (!document.fullscreenElement) {
      document.documentElement
        .requestFullscreen()
        .then(() => {
          setIsFullscreen(true);
        })
        .catch((err) => {
          console.error("Fullscreen error:", err);
        });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  }, []);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Timer State
  const [timeLeft, setTimeLeft] = useState(config.timer.defaultDuration);
  const [isActive, setIsActive] = useState(config.timer.autoStartOnOpen);

  useEffect(() => {
    // Reset state when question changes
    setShowAnswer(false);
    setScale(1);
    setTimeLeft(config.timer.defaultDuration);
    setIsActive(config.timer.autoStartOnOpen);
  }, [questionId, config.timer.defaultDuration, config.timer.autoStartOnOpen]);

  // Timer Logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((timeLeft) => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      sounds.timerEnd();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  // Effect to sync visited state
  useEffect(() => {
    if (question) {
      markAsVisited(question.id);
    }
  }, [question, markAsVisited]);

  // Handlers
  const handleBack = useCallback(() => {
    sounds.back();
    navigate("/");
  }, [navigate]);

  const handleToggleAnswer = useCallback(() => {
    if (!showAnswer) {
      sounds.reveal();
      setIsActive(false); // Stop timer on reveal
    } else {
      sounds.click();
    }
    setShowAnswer((prev) => !prev);
  }, [showAnswer]);

  const handlePass = useCallback(() => {
    sounds.pass();
    setTimeLeft(config.timer.passDuration);
    if (config.timer.autoStartOnPass) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [config.timer.passDuration, config.timer.autoStartOnPass]);

  // Read the question (and answer, if revealed) aloud using speech synthesis.
  const handleReadAloud = useCallback(() => {
    if (!question || !isSpeechSupported()) return;
    if (isSpeakingQ) {
      cancelSpeech();
      setIsSpeakingQ(false);
      return;
    }
    const text = showAnswer
      ? `Question ${question.id}. ${question.text}. Answer. ${question.answer}`
      : `Question ${question.id}. ${question.text}`;
    sounds.click();
    if (speakText(text, { onEnd: () => setIsSpeakingQ(false) })) {
      setIsSpeakingQ(true);
    }
  }, [question, showAnswer, isSpeakingQ]);

  // Stop speech when navigating away or changing question.
  useEffect(() => {
    cancelSpeech();
    setIsSpeakingQ(false);
  }, [questionId]);

  useEffect(() => {
    return () => {
      cancelSpeech();
    };
  }, []);

  // Previous / next question navigation (used by swipe + context menu).
  const goAdjacent = useCallback(
    (dir: 1 | -1) => {
      const sorted = [...questions].sort((a, b) => a.id - b.id);
      const idx = sorted.findIndex((q) => q.id === questionId);
      if (idx === -1) return;
      const target = sorted[idx + dir];
      if (!target) return;
      sounds.select();
      navigate(`/question/${target.id}`);
    },
    [questions, questionId, navigate],
  );

  // Touch swipe gestures on the question area.
  useEffect(() => {
    const main = document.getElementById("question-swipe-area");
    if (!main) return;
    let startX = 0;
    let startY = 0;
    let startT = 0;

    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      startX = t.clientX;
      startY = t.clientY;
      startT = Date.now();
    };

    const onTouchEnd = (e: TouchEvent) => {
      const t = e.changedTouches[0];
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;
      const dt = Date.now() - startT;
      const absX = Math.abs(dx);
      const absY = Math.abs(dy);

      // Tap: short, low movement (double-tap handled by click event via onDoubleClick).
      if (absX < 10 && absY < 10 && dt < 400) return;

      // Swipe threshold: ignore tiny or mostly-vertical drags.
      if (absX < 50 || absX < absY) return;

      if (dx < 0) goAdjacent(1); // swipe left -> next
      else goAdjacent(-1); // swipe right -> previous
    };

    main.addEventListener("touchstart", onTouchStart, { passive: true });
    main.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      main.removeEventListener("touchstart", onTouchStart);
      main.removeEventListener("touchend", onTouchEnd);
    };
  }, [goAdjacent]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Font Scaling
      if (e.key === "]" || e.key === "=" || e.key === "+")
        setScale((s) => Math.min(s + SCALE_STEP, MAX_SCALE));
      if (e.key === "[" || e.key === "-")
        setScale((s) => Math.max(s - SCALE_STEP, MIN_SCALE));
      if (e.key === "0") setScale(1);

      if (e.code === "Space") {
        e.preventDefault();
        handleToggleAnswer();
      }

      // Escape key handling
      if (e.code === "Escape") {
        // If quick peek modal is open, close it first (don't do anything else)
        if (showQuickPeek) {
          e.preventDefault();
          setShowQuickPeek(false);
          return; // Stop here, don't process further
        }

        // If in fullscreen, prevent ESC from doing anything (don't exit fullscreen, don't navigate)
        if (isFullscreen) {
          e.preventDefault();
          return;
        }

        // Normal mode: Escape goes back
        handleBack();
      }

      // Timer Shortcuts
      if (e.key.toLowerCase() === "t") setIsActive((prev) => !prev);
      if (e.key.toLowerCase() === "r") {
        setTimeLeft(config.timer.defaultDuration);
        setIsActive(false);
      }

      // Fullscreen Toggle (F key)
      if (e.key.toLowerCase() === "f") {
        toggleFullscreen();
      }

      // Quick Peek Toggle (Q key)
      if (e.key.toLowerCase() === "q") {
        setShowQuickPeek((prev) => !prev);
      }

      // Mark/Bookmark Toggle (M key)
      if (e.key.toLowerCase() === "m" && !e.altKey && !e.metaKey && !e.ctrlKey) {
        toggleMark(questionId);
      }

      // Shortcuts Modal Toggle (? key)
      if (e.key === "?") {
        e.preventDefault();
        setShowShortcuts((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    handleBack,
    handleToggleAnswer,
    config.timer.defaultDuration,
    showQuickPeek,
    toggleFullscreen,
    isFullscreen,
    toggleMark,
    questionId,
  ]);

  // Register page-specific data for the global context menu.
  useEffect(() => {
    if (question) {
      setQuestionMenuData({
        questionText: question.text,
        answerText: question.answer,
        onToggleAnswer: handleToggleAnswer,
        onQuickPeek: () => setShowQuickPeek(true),
      });
    }
    return () => setQuestionMenuData({});
  }, [question, handleToggleAnswer]);

  if (!question) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center text-[rgb(var(--text-primary))]">
        <div className="glass-panel p-8 md:p-12 max-w-md w-full">
          <div className="text-5xl font-black mb-4 title-gradient">404</div>
          <h1 className="text-xl font-bold mb-2">Question not found</h1>
          <p className="text-[rgb(var(--text-secondary))] text-sm mb-6">
            The question you are looking for does not exist or has been removed.
          </p>
          <button
            onClick={handleBack}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            <ArrowLeft size={18} /> Back to Grid
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden text-[rgb(var(--text-primary))]">
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[rgba(var(--color-primary),0.2)] rounded-full blur-[100px] -z-10 pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-[rgba(var(--success),0.1)] rounded-full blur-[100px] -z-10 pointer-events-none" />

      <button
        onClick={toggleFullscreen}
        className="fixed top-4 right-4 z-50 p-3 rounded-full bg-[var(--card-bg)] backdrop-blur-md border border-[var(--card-border)] text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))] hover:bg-[var(--fill)] transition-all group shadow-xl"
        title={isFullscreen ? "Exit Fullscreen (F)" : "Enter Fullscreen (F)"}
        aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
      >
        {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
                <span className="absolute -bottom-8 right-0 text-xs bg-[var(--card-bg)] text-[rgb(var(--text-primary))] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-[var(--card-border)]">
          Press F
        </span>
      </button>

      <motion.div
        className="max-w-5xl w-full glass-panel p-6 md:p-12 relative flex flex-col md:flex-row gap-8"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Main Question Content */}
        <div
          id="question-swipe-area"
          className="flex-1 touch-pan-y"
          onDoubleClick={(e) => {
            const target = e.target as HTMLElement;
            if (target.closest("button, a, input, textarea, kbd")) return;
            handleToggleAnswer();
          }}
        >
          <div className="mb-8">
            {/* Header Toolbar */}
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))] transition-colors group font-medium"
                aria-label="Back to grid"
              >
                <ArrowLeft
                  size={20}
                  className="group-hover:-translate-x-1 transition-transform"
                />{" "}
                Back to Grid{" "}
                <span className="text-xs border border-[var(--card-border)] px-1 rounded mx-2 opacity-50 hidden md:inline">
                  ESC
                </span>
              </button>

              {/* Quick Peek Button */}
              <button
                onClick={() => setShowQuickPeek(true)}
                className="ml-auto flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--card-bg)] border border-[var(--card-border)] text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))] hover:bg-[var(--fill)] transition-all group"
                title="Quick Peek All Questions (Q)"
                aria-label="Open questions overview"
              >
                <LayoutGrid size={16} />
                <span className="hidden md:inline text-sm">Overview</span>
                <span className="text-xs border border-[var(--card-border)] px-1 rounded opacity-50 hidden md:inline">
                  Q
                </span>
              </button>

              {/* Read Aloud Button */}
              {isSpeechSupported() && (
                <button
                  onClick={handleReadAloud}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all group ${
                    isSpeakingQ
                      ? "bg-[rgb(var(--color-primary))]/20 border-[rgb(var(--color-primary))]/50 text-[rgb(var(--color-primary))] anim-pulse"
                      : "bg-[var(--card-bg)] border-[var(--card-border)] text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))] hover:bg-[var(--fill)]"
                  }`}
                  title={isSpeakingQ ? "Stop reading aloud" : "Read question aloud"}
                  aria-label={
                    isSpeakingQ ? "Stop reading question aloud" : "Read question aloud"
                  }
                >
                  {isSpeakingQ ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  <span className="hidden md:inline text-sm">
                    {isSpeakingQ ? "Stop" : "Read"}
                  </span>
                </button>
              )}

              {/* Mark/Bookmark Toggle Button */}
              <button
                onClick={() => {
                  toggleMark(questionId);
                  sounds.click();
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all group ${
                  isMarked
                    ? "bg-[rgb(var(--warning))]/15 border-[rgb(var(--warning))]/40 text-[rgb(var(--warning))]"
                    : "bg-[var(--card-bg)] border-[var(--card-border)] text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))] hover:bg-[var(--fill)]"
                }`}
                title={`${isMarked ? "Unmark" : "Mark"} for review (M)`}
                aria-label={isMarked ? "Remove mark (M)" : "Mark question (M)"}
              >
                <Bookmark
                  size={16}
                  fill={isMarked ? "currentColor" : "none"}
                />
                <span className="hidden md:inline text-sm">
                  {isMarked ? "Marked" : "Mark"}
                </span>
                <span className="text-xs border border-[var(--card-border)] px-1 rounded opacity-50 hidden md:inline">
                  M
                </span>
              </button>
            </div>

            {roundTitle && (
              <div className="text-[rgb(var(--color-primary))] text-sm font-bold uppercase tracking-widest mb-2 border-l-2 border-[rgb(var(--color-primary))] pl-3">
                {roundTitle}
              </div>
            )}

            <span className="inline-block px-3 py-1 rounded-full bg-[var(--fill)] text-sm mb-6 text-[rgb(var(--color-primary))] border border-[var(--card-border)] uppercase tracking-wider">
              Question {question.id}
            </span>
          </div>

          <div className="flex flex-col items-start gap-8 relative group/scale">
            {/* Zoom Controls Overlay */}
            <div className="absolute top-[-3rem] right-0 flex gap-1 bg-[var(--card-bg)]/80 backdrop-blur-sm p-1 rounded-lg opacity-0 group-hover/scale:opacity-100 transition-opacity z-10 text-[rgb(var(--text-primary))] border border-[var(--card-border)]">
              <button
                onClick={() => setScale((s) => Math.max(s - SCALE_STEP, MIN_SCALE))}
                className="p-1 hover:bg-[var(--fill)] rounded"
                title="Smaller [-]"
                aria-label="Decrease text size"
              >
                <Minus size={14} />
              </button>
              <span className="text-xs font-mono w-8 text-center pt-1">
                {Math.round(scale * 100)}%
              </span>
              <button
                onClick={() => setScale((s) => Math.min(s + SCALE_STEP, MAX_SCALE))}
                className="p-1 hover:bg-[var(--fill)] rounded"
                title="Larger [+]"
                aria-label="Increase text size"
              >
                <Plus size={14} />
              </button>
              <button
                onClick={() => setScale(1)}
                className="p-1 hover:bg-[var(--fill)] rounded"
                title="Reset [0]"
                aria-label="Reset text size"
              >
                <RotateCcw size={14} />
              </button>
            </div>

            {/* Question Text & Media with Scale */}
            <div
              style={{
                transform: `scale(${scale})`,
                transformOrigin: "top left",
                transition: "transform 0.2s ease-out",
                width: "100%",
              }}
            >
              {/* Media Display */}
              {question.mediaType === "image" && question.mediaUrl && (
                <div className="mb-6 rounded-xl overflow-hidden border-2 border-[var(--card-border)] shadow-2xl relative group/img">
                  <img
                    src={question.mediaUrl}
                    alt="Question attachment image"
                    className="max-h-[400px] w-auto object-contain bg-[var(--fill)]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-sm font-mono text-[rgb(var(--text-secondary))]">
                      Image Reference
                    </span>
                  </div>
                </div>
              )}

              {question.mediaType === "audio" && question.mediaUrl && (
                <div className="mb-6 p-4 rounded-xl bg-[rgb(var(--color-primary))]/10 border border-[rgb(var(--color-primary))]/30 flex items-center gap-4">
                  <div className="flex gap-1 items-end h-8 px-3 py-2 bg-[rgb(var(--color-primary))] rounded-full">
                    <span className="w-1 rounded-full bg-[rgb(var(--label-inverse))] animate-pulse" style={{ height: "40%" }} />
                    <span className="w-1 rounded-full bg-[rgb(var(--label-inverse))] animate-pulse" style={{ height: "80%", animationDelay: "0.15s" }} />
                    <span className="w-1 rounded-full bg-[rgb(var(--label-inverse))] animate-pulse" style={{ height: "60%", animationDelay: "0.3s" }} />
                    <span className="w-1 rounded-full bg-[rgb(var(--label-inverse))] animate-pulse" style={{ height: "90%", animationDelay: "0.45s" }} />
                  </div>
                  <audio
                    controls
                    src={question.mediaUrl}
                    className="w-full h-10 opacity-80 hover:opacity-100 transition-opacity"
                  />
                </div>
              )}

              <h2
                className="font-bold leading-tight mb-8"
                style={{ fontSize: config.fonts.questionTitle }}
              >
                {question.text}
              </h2>

              <AnimatePresence mode="wait">
                {showAnswer ? (
                  <motion.div
                    key="answer"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="w-full"
                  >
                    <div className="p-8 rounded-2xl bg-[rgb(var(--success))]/10 border border-[rgb(var(--success))]/25 w-full">
                      <p className="text-sm text-[rgb(var(--success))] uppercase tracking-widest mb-2 font-bold">
                        Answer
                      </p>
                      <p
                        className="font-medium text-[rgb(var(--text-primary))]"
                        style={{ fontSize: config.fonts.answerTitle }}
                      >
                        {question.answer}
                      </p>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>

            <button
              onClick={handleToggleAnswer}
              className={`btn-primary flex items-center gap-2 text-lg px-8 py-4 ${showAnswer ? "" : ""}`}
              style={
                showAnswer
                  ? { background: "rgba(var(--label-inverse), 0.1)", boxShadow: "none" }
                  : undefined
              }
              aria-pressed={showAnswer}
            >
              {showAnswer ? (
                <>
                  <EyeOff size={20} /> Hide Answer
                </>
              ) : (
                <>
                  <Eye size={20} /> Reveal Answer
                </>
              )}
              <span className="kbd ml-2 opacity-70 hidden md:inline">
                SPACE
              </span>
            </button>

            <QuickScorePanel />
          </div>
        </div>

        {/* Timer Panel */}
        <div className="w-full md:w-72 flex flex-col gap-4">
          <div
            className={`p-6 rounded-2xl border flex flex-col items-center justify-center transition-colors duration-500 shadow-xl ${timeLeft === 0 ? "bg-[rgb(var(--danger))]/15 border-[rgb(var(--danger))]/50 anim-pulse" : "bg-[var(--card-bg)] border-[var(--card-border)]"}`}
          >
            {/* Timer Header & Time */}
            <div className="flex items-center gap-2 mb-2 text-[rgb(var(--text-secondary))]">
              <Timer size={16} /> <span>Timer</span>
            </div>
            <div
              className={`font-mono font-bold mb-4 ${timeLeft <= 10 ? "text-[rgb(var(--danger))] shadow-[0_0_20px_rgba(var(--danger),0.2)]" : "text-[rgb(var(--text-primary))]"}`}
              style={{ fontSize: config.fonts.timerTime }}
            >
              {timeLeft}s
            </div>
          </div>

          {/* Adjuster */}
          <div className="flex items-center gap-2 w-full mb-6 justify-center">
            <button
              onClick={() => setTimeLeft((t) => Math.max(0, t - TIMER_ADJUST_STEP))}
              className="p-2 hover:bg-[var(--fill)] rounded"
              aria-label="Decrease timer by 10 seconds"
            >
              <Minus size={16} />
            </button>
            <button
              onClick={() => setTimeLeft(config.timer.defaultDuration)}
              className="text-xs uppercase tracking-wider opacity-50 hover:opacity-100"
            >
              Reset
            </button>
            <button
              onClick={() => setTimeLeft((t) => t + TIMER_ADJUST_STEP)}
              className="p-2 hover:bg-[var(--fill)] rounded"
              aria-label="Increase timer by 10 seconds"
            >
              <Plus size={16} />
            </button>
          </div>

          {/* Primary Controls */}
          <div className="flex gap-2 w-full mb-3">
            <button
              onClick={() => {
                sounds.click();
                setIsActive(!isActive);
              }}
              className={`flex-1 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${isActive ? "bg-[rgb(var(--warning))]/80 hover:bg-[rgb(var(--warning))] text-white shadow-lg shadow-[rgb(var(--warning))]/40" : "bg-[rgb(var(--success))] hover:bg-[rgb(var(--success))] text-white shadow-lg shadow-[rgb(var(--success))]/40 hover:-translate-y-1"}`}
            >
              {isActive ? (
                <>
                  <Pause size={18} /> Pause
                </>
              ) : (
                <>
                  <Play size={18} /> Start
                </>
              )}
            </button>
            <button
              onClick={() => {
                sounds.click();
                setIsActive(false);
                setTimeLeft(config.timer.defaultDuration);
              }}
              className="p-3 bg-[var(--fill)] hover:bg-[var(--fill)] rounded-lg text-[rgb(var(--text-secondary))] border border-[var(--card-border)]"
            >
              <RotateCcw size={18} />
            </button>
          </div>

          {/* Pass Button */}
          <button
            onClick={handlePass}
            className="w-full py-2 bg-[rgb(var(--color-primary))]/20 hover:bg-[rgb(var(--color-primary))]/30 border border-[rgb(var(--color-primary))]/30 text-[rgb(var(--color-primary))] rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <ArrowRight size={16} /> Pass (+{config.timer.passDuration}s)
          </button>

          <div className="text-[10px] text-[rgb(var(--text-secondary))] text-center font-mono mt-4">
            [T] Timer • [R] Reset • [-/+] Zoom • [0] Reset Zoom • [F] Fullscreen
            • [Q] Overview
          </div>
        </div>
      </motion.div>

      {/* Quick Peek Modal */}
      <AnimatePresence>
        {showQuickPeek && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
              onClick={() => setShowQuickPeek(false)}
            />

            {/* Modal Content */}
            <motion.div
              className="relative z-10 w-[95vw] max-w-6xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[var(--bg-elevated)] border border-[var(--card-border)] p-6 md:p-8 shadow-2xl glass-panel"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-[rgb(var(--text-primary))]">
                    Questions Overview
                  </h2>
                  <p className="text-[rgb(var(--text-secondary))] text-sm mt-1">
                    Click any question to jump to it • Current: Q{questionId}
                  </p>
                </div>
                <button
                  onClick={() => setShowQuickPeek(false)}
                  className="p-2 rounded-lg bg-[var(--card-bg)] border border-[var(--card-border)] text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))] hover:bg-[rgb(var(--color-primary))]/10 transition-all"
                  title="Close (Esc)"
                  aria-label="Close overview"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Questions Grid */}
              <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2 md:gap-3">
                {questions.filter(q => !dustedIds.includes(q.id)).map((q) => {
                  const isVisited = visitedIds.includes(q.id);
                  const isCurrent = q.id === questionId;
                  const isMarked = markedIds.includes(q.id);
                  return (
                    <button
                      key={q.id}
                      onClick={(e) => {
                        // Prevent navigation to visited questions unless Alt is held
                        if (isVisited && !isCurrent && !e.altKey) {
                          return;
                        }
                        sounds.select();
                        setShowQuickPeek(false);
                        navigate(`/question/${q.id}`);
                      }}
                      className={`
                                                aspect-square flex items-center justify-center rounded-xl font-bold text-lg
                                                transition-all duration-200 border relative overflow-hidden
                                                ${isCurrent
                          ? "bg-[rgb(var(--color-primary))] border-[rgb(var(--color-primary))] text-[rgb(var(--label-inverse))] ring-2 ring-[rgb(var(--color-primary))] ring-offset-2 ring-offset-[rgb(var(--bg-elevated))]"
                          : isVisited
                            ? "cell-visited cursor-not-allowed"
                            : "bg-[var(--card-bg)] border-[var(--card-border)] text-[rgb(var(--text-primary))] hover:bg-[rgb(var(--color-primary))]/10 hover:border-[rgb(var(--color-primary))]/50 hover:scale-105"
                        }
                                            `}
                      title={isMarked ? `Question ${q.id} (marked for review)` : undefined}
                    >
                      {isMarked && (
                        <span className="cell-mark-badge" aria-hidden="true">
                          <Bookmark size={10} fill="currentColor" />
                        </span>
                      )}
                      {isVisited && !isCurrent && (
                        <span className="cell-visited-badge" aria-hidden="true">
                          <Check size={12} strokeWidth={3.5} />
                        </span>
                      )}
                      <span className="relative z-10">{q.id}</span>
                    </button>
                  );
                })}
              </div>

              {/* Footer hint */}
              <div className="mt-6 text-center text-xs text-[rgb(var(--text-secondary))]">
                Press{" "}
                <kbd className="px-1.5 py-0.5 bg-[var(--card-bg)] rounded border border-[var(--card-border)]">
                  Q
                </kbd>{" "}
                or{" "}
                <kbd className="px-1.5 py-0.5 bg-[var(--card-bg)] rounded border border-[var(--card-border)]">
                  Esc
                </kbd>{" "}
                to close
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Shortcuts Modal */}
      <ShortcutsModal
        isOpen={showShortcuts}
        onClose={() => setShowShortcuts(false)}
      />
    </div>
  );
}

function QuickScorePanel() {
  const {
    appConfig: config,
    teams,
    activeTeamId,
    setActiveTeam,
    updateScore,
  } = useData();
  const dialog = useDialog();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const activeTeam = teams.find((t) => t.id === activeTeamId);

  if (teams.length === 0) return null;

  const scoring = config.scoring || { correct: 10, bonus: 5, penalty: -2 };

  const confirmAward = async (value: number, danger: boolean) => {
    if (!activeTeamId || !activeTeam) return;
    const sign = value > 0 ? "+" : "";
    const ok = await dialog.confirm({
      title: `Award ${sign}${value} to ${activeTeam.name}?`,
      message: `${sign}${value} points to ${activeTeam.name} (currently ${activeTeam.score})`,
      confirmLabel: "Award",
      cancelLabel: "Cancel",
      danger,
    });
    if (ok) {
      updateScore(activeTeamId, value);
      sounds.click();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 w-full p-5 rounded-2xl bg-[rgb(var(--color-primary))]/5 border border-[rgb(var(--color-primary))]/10 flex flex-col md:flex-row items-center gap-6"
    >
      <div className="relative flex-1 min-w-0 w-full">
        <p className="text-[10px] uppercase tracking-widest text-[rgb(var(--color-primary))] font-bold mb-1.5 ml-1">
          Assign Points To
        </p>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] hover:border-[rgb(var(--color-primary))]/50 transition-all text-left shadow-lg group"
        >
          <div className="flex items-center gap-3 truncate">
            <div className="p-1.5 rounded-lg bg-[rgb(var(--color-primary))]/20 text-[rgb(var(--color-primary))]">
              <Users size={18} />
            </div>
            <span className="font-bold text-[rgb(var(--text-primary))] truncate">
              {activeTeam ? activeTeam.name : "Select a team..."}
            </span>
          </div>
          <ChevronDown
            size={18}
            className={`text-[rgb(var(--color-primary))] transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : "rotate-0"}`}
          />
        </button>

        <AnimatePresence>
          {isDropdownOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[110] overlay"
                onClick={() => setIsDropdownOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="absolute left-0 right-0 bottom-full mb-3 bg-[var(--card-bg)] border border-[rgb(var(--color-primary))]/30 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[120] overflow-hidden"
              >
                <div className="max-h-[250px] overflow-y-auto custom-scrollbar p-1.5">
                  <div className="px-3 py-2 text-[10px] uppercase tracking-wider text-[rgb(var(--color-primary))] font-black opacity-80 border-b border-[rgb(var(--color-primary))]/10 mb-1">
                    Select Active Team
                  </div>
                  {teams.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setActiveTeam(t.id);
                        setIsDropdownOpen(false);
                        sounds.click();
                      }}
                      className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all ${activeTeamId === t.id
                        ? "bg-[rgb(var(--color-primary))] text-[rgb(var(--label-inverse))] shadow-lg shadow-[rgb(var(--color-primary))]/20"
                        : "hover:bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))]"
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        {activeTeamId === t.id && (
                          <div className="w-1.5 h-1.5 rounded-full bg-[rgb(var(--label-inverse))] animate-pulse" />
                        )}
                        <span className="font-bold truncate">{t.name}</span>
                      </div>
                      <span
                        className={`text-xs font-mono ${activeTeamId === t.id ? "text-[rgb(var(--label-inverse))]/80" : "opacity-60"}`}
                      >
                        {t.score} pts
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto">
        <ScoreActionButton
          label={
            scoring.correct > 0
              ? `+${scoring.correct}`
              : scoring.correct.toString()
          }
          sub="Correct"
          color="bg-[rgb(var(--success))]/10 text-[rgb(var(--success))] border border-[rgb(var(--success))]/25 hover:bg-[rgb(var(--success))] hover:text-white"
          disabled={!activeTeamId}
          onClick={() => confirmAward(scoring.correct, false)}
        />
        <ScoreActionButton
          label={
            scoring.bonus > 0 ? `+${scoring.bonus}` : scoring.bonus.toString()
          }
          sub="Bonus"
          color="bg-[rgb(var(--color-primary))]/15 text-[rgb(var(--color-primary))] border border-[rgb(var(--color-primary))]/25 hover:bg-[rgb(var(--color-primary))] hover:text-[rgb(var(--label-inverse))]"
          disabled={!activeTeamId}
          onClick={() => confirmAward(scoring.bonus, false)}
        />
        <ScoreActionButton
          label={
            scoring.penalty > 0
              ? `+${scoring.penalty}`
              : scoring.penalty.toString()
          }
          sub="Wrong"
          color="bg-[rgb(var(--danger))]/15 text-[rgb(var(--danger))] border border-[rgb(var(--danger))]/25 hover:bg-[rgb(var(--danger))] hover:text-white"
          disabled={!activeTeamId}
          onClick={() => confirmAward(scoring.penalty, true)}
        />
      </div>
    </motion.div>
  );
}

function ScoreActionButton({
  label,
  sub,
  color,
  disabled,
  onClick,
}: {
  label: string;
  sub: string;
  color: string;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`flex-1 md:flex-none flex flex-col items-center justify-center min-w-[80px] p-3 rounded-xl border transition-all active:scale-95 disabled:opacity-30 disabled:grayscale ${color}`}
    >
      <span className="font-black text-lg leading-none">{label}</span>
      <span className="text-[10px] uppercase font-bold tracking-tighter opacity-80 mt-1">
        {sub}
      </span>
    </button>
  );
}
