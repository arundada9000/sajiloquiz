import { useState, useEffect, useCallback, useRef, memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useData, Question } from '../context/DataContext';
import { useQuiz } from '../context/QuizContext';
import { Trash2, Trophy, Target, ListChecks, Settings, Download, Maximize, Minimize, Check, Shuffle, Sparkles, Bookmark } from 'lucide-react';
import { sounds } from '../utils/sounds';
import ShortcutsModal from '../components/ShortcutsModal';
import { useDialog } from '../context/DialogContext';
import SiteLayout from '../components/SiteLayout';

// Type for the BeforeInstallPromptEvent (not available in default TS DOM lib)
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

type QuestionCardProps = {
  q: Question;
  isVisited: boolean;
  isMarked: boolean;
  isDusting: boolean;
  gridNumberFont: string;
  onNavigate: (id: number, isVisited: boolean, force?: boolean) => void;
};

// Module-scope QuestionCard so it is not re-created on every GridPage render.
const QuestionCard = memo(function QuestionCard({
  q,
  isVisited,
  isMarked,
  isDusting,
  gridNumberFont,
  onNavigate,
}: QuestionCardProps) {
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, scale: 0.8 }, show: { opacity: 1, scale: 1 } }}
      className="w-full"
    >
      <button
        type="button"
        aria-label={`Open question ${q.id}${isVisited ? ' (already answered, Alt+Click to reopen)' : ''}`}
        className={`
                aspect-square flex items-center justify-center rounded-xl font-bold w-full
                transition-all duration-300 border relative overflow-hidden cursor-pointer
                ${isDusting
                    ? 'cell-dusting'
                    : isVisited
                        ? 'cell-visited'
                        : 'bg-[var(--card-bg)] border-[var(--card-border)] text-[rgb(var(--text-primary))] backdrop-blur-md hover:bg-[var(--fill)] hover:border-[rgb(var(--color-primary))] hover:shadow-[0_0_20px_rgba(var(--color-primary),0.35)] hover:scale-105 shadow-sm'
                }
            `}
        style={{ fontSize: gridNumberFont }}
        onClick={(e) => {
          // Allow navigation if NOT visited OR if Alt key is held.
          if (!isVisited || e.altKey) {
            onNavigate(q.id, isVisited, e.altKey);
          }
        }}
        onMouseEnter={() => !isVisited && sounds.click()}
      >
        {isMarked && !isDusting && (
          <span className="cell-mark-badge" aria-hidden="true">
            <Bookmark size={11} fill="currentColor" />
          </span>
        )}
        {isVisited && !isDusting && (
          <span className="cell-visited-badge" aria-hidden="true">
            <Check size={14} strokeWidth={3.5} />
          </span>
        )}
        {!isVisited && (
          <span className="absolute inset-0 opacity-0 hover:opacity-10 pointer-events-none rounded-xl bg-[rgb(var(--color-primary))] transition-opacity" />
        )}
        <span className="relative z-10 drop-shadow-md">{q.id}</span>
      </button>
    </motion.div>
  );
});

export default function GridPage() {
    const { appConfig: config, allQuestions: questions, activeRounds, activeEnableRounds } = useData();
    const { visitedIds, markedIds, resetProgress } = useQuiz();
    const dialog = useDialog();
    const navigate = useNavigate();

    const totalQuestions = questions.length;
    const completedCount = visitedIds.length;
    const remainingCount = totalQuestions - completedCount;
    const unvisited = questions.filter(q => !visitedIds.includes(q.id));

    // Fullscreen State
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Shortcuts Modal State
    const [showShortcuts, setShowShortcuts] = useState(false);

    // Snap/dust animation state
    const [isSnapping, setIsSnapping] = useState(false);
    const snapTimer = useRef<number | null>(null);

    // Navigation handler passed to memoized cards; depends on navigate.
    const handleCardNavigate = useCallback((id: number, isVisited: boolean) => {
        if (!isVisited) sounds.select();
        else sounds.click();
        navigate(`/question/${id}`);
    }, [navigate]);

    // Snap: play a dust animation over visited cards, then clear progress.
    const handleSnap = useCallback(async () => {
        if (isSnapping) return;
        if (completedCount === 0) {
            dialog.toast('info', 'Nothing to snap yet', 'Answer a question first, then snap away the used ones.');
            return;
        }
        const ok = await dialog.confirm({
            title: 'The Snap',
            message: `Dust away ${completedCount} visited question${completedCount === 1 ? '' : 's'}? Only the unvisited questions will remain.`,
            confirmLabel: 'Snap',
            cancelLabel: 'Keep Them',
            danger: true,
        });
        if (!ok) return;
        sounds.snap();
        setIsSnapping(true);
        if (snapTimer.current) window.clearTimeout(snapTimer.current);
        snapTimer.current = window.setTimeout(() => {
            resetProgress();
            setIsSnapping(false);
            dialog.toast('success', 'Perfectly balanced', 'Visited questions returned to dust. Unvisited questions remain.');
        }, 1200);
    }, [isSnapping, completedCount, dialog, resetProgress]);

    // Clean up snap timer on unmount
    useEffect(() => {
        return () => {
            if (snapTimer.current) window.clearTimeout(snapTimer.current);
        };
    }, []);

    // Random question from the remaining (unvisited) pool.
    const handleRandom = useCallback(() => {
        if (unvisited.length === 0) {
            dialog.toast('info', 'No questions left', 'Every question has been visited. Snap to dust them and start fresh!');
            return;
        }
        const pick = unvisited[Math.floor(Math.random() * unvisited.length)];
        sounds.select();
        navigate(`/question/${pick.id}`);
    }, [unvisited, dialog, navigate]);

    // Fullscreen Toggle Handler
    const toggleFullscreen = useCallback(() => {
        sounds.fullscreen();
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().then(() => {
                setIsFullscreen(true);
            }).catch((err) => {
                console.error('Fullscreen error:', err);
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
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Fullscreen Toggle (F key)
            if (e.key.toLowerCase() === 'f') {
                toggleFullscreen();
            }

            // Prevent ESC from exiting fullscreen
            if (e.code === 'Escape' && isFullscreen) {
                e.preventDefault();
            }

            // Shortcuts Modal Toggle (? key)
            if (e.key === '?') {
                e.preventDefault();
                setShowShortcuts(prev => !prev);
            }

            // Skip snap/random shortcuts when a dialog or modal is open
            // (sheet-like overlays capture their own keys).
            if (showShortcuts) return;

            // Random unvisited question (R key)
            if (e.key.toLowerCase() === 'r' && !e.altKey && !e.metaKey && !e.ctrlKey) {
                e.preventDefault();
                void handleRandom();
            }

            // Snap / dust visited questions (X key)
            if (e.key.toLowerCase() === 'x' && !e.altKey && !e.metaKey && !e.ctrlKey) {
                e.preventDefault();
                void handleSnap();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [toggleFullscreen, isFullscreen, showShortcuts, handleRandom, handleSnap]);

    // --- PWA Install Logic ---
    const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);

    useEffect(() => {
        const handler = (e: Event) => {
            e.preventDefault();
            setInstallPrompt(e as BeforeInstallPromptEvent);
        };
        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstall = () => {
        if (!installPrompt) return;
        installPrompt.prompt();
        installPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                setInstallPrompt(null);
            }
        });
    };

    return (
        <SiteLayout>
            {/* Snap dust overlay */}
            {isSnapping && (
                <div className="fixed inset-0 z-[80] pointer-events-none overflow-hidden" aria-hidden="true">
                    <div className="snap-flash" />
                    <div className="snap-text">SNAP!</div>
                </div>
            )}

            {/* Fullscreen Toggle Button - Fixed Top Right */}
            <button
                onClick={toggleFullscreen}
                className="fixed top-20 right-4 z-50 p-3 rounded-full bg-[var(--material-regular)] backdrop-blur-md border border-[var(--separator)] text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))] hover:bg-[var(--fill)] transition-all group"
                title={isFullscreen ? 'Exit Fullscreen (F)' : 'Enter Fullscreen (F)'}
                aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
                {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
                <span className="absolute -bottom-8 right-0 text-xs bg-[var(--card-bg)] text-[rgb(var(--text-primary))] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-[var(--card-border)]">
                    Press F
                </span>
            </button>

            {/* Main Grid Content */}
            <div className="p-4 md:p-8 flex flex-col items-center grow w-full">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-6 md:mb-8 relative z-10"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-2 title-gradient">{config.appName}</h1>
                    <p className="text-[rgb(var(--text-secondary))] text-xs md:text-sm tracking-widest uppercase font-medium">Select a question to begin • <span className="opacity-60">Alt+Click to re-open visited • R Random • X Snap</span></p>
                </motion.div>

                {/* Stats Dashboard */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, ease: [0.22, 1, 0.36, 1], duration: 0.45 }}
                    className="w-full max-w-2xl mb-6 md:mb-10"
                >
                    <div className="glass-panel p-4 md:p-5">
                        {/* Progress bar */}
                        <div className="flex items-center justify-between mb-2.5">
                            <span className="uppercase font-bold text-[rgb(var(--text-secondary))]" style={{ fontSize: config.fonts.statsTitle }}>
                                Progress
                            </span>
                            <span className="font-bold text-[rgb(var(--color-primary))]" style={{ fontSize: config.fonts.statsTitle }}>
                                {totalQuestions === 0 ? 0 : Math.round((completedCount / totalQuestions) * 100)}%
                            </span>
                        </div>
                        <div className="w-full h-2.5 rounded-full overflow-hidden bg-[var(--fill)] border border-[var(--card-border)]">
                            <motion.div
                                className="h-full rounded-full bg-[rgb(var(--color-primary))]"
                                initial={{ width: 0 }}
                                animate={{ width: `${totalQuestions === 0 ? 0 : (completedCount / totalQuestions) * 100}%` }}
                                transition={{ delay: 0.35, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                            />
                        </div>

                        {/* Stat cells */}
                        <div className="mt-4 grid grid-cols-3 gap-3">
                            <div className="rounded-xl p-3 flex flex-col items-center gap-1 bg-[var(--fill)] border border-[var(--card-border)]">
                                <div className="p-2 rounded-full bg-[rgb(var(--color-primary))]/15 text-[rgb(var(--color-primary))]">
                                    <ListChecks className="w-4 h-4 md:w-5 md:h-5" />
                                </div>
                                <p className="font-bold text-[rgb(var(--text-primary))] leading-none" style={{ fontSize: config.fonts.statsValue }}>{completedCount}</p>
                                <p className="uppercase font-bold text-[rgb(var(--text-secondary))]" style={{ fontSize: config.fonts.statsTitle }}>Done</p>
                            </div>

                            <div className="rounded-xl p-3 flex flex-col items-center gap-1 bg-[var(--fill)] border border-[var(--card-border)]">
                                <div className="p-2 rounded-full bg-[rgb(var(--warning))]/15 text-[rgb(var(--warning))]">
                                    <Target className="w-4 h-4 md:w-5 md:h-5" />
                                </div>
                                <p className="font-bold text-[rgb(var(--text-primary))] leading-none" style={{ fontSize: config.fonts.statsValue }}>{remainingCount}</p>
                                <p className="uppercase font-bold text-[rgb(var(--text-secondary))]" style={{ fontSize: config.fonts.statsTitle }}>Left</p>
                            </div>

                            <div className="rounded-xl p-3 flex flex-col items-center gap-1 bg-[var(--fill)] border border-[var(--card-border)]">
                                <div className="p-2 rounded-full bg-[rgb(var(--success))]/15 text-[rgb(var(--success))]">
                                    <Trophy className="w-4 h-4 md:w-5 md:h-5" />
                                </div>
                                <p className="font-bold text-[rgb(var(--text-primary))] leading-none" style={{ fontSize: config.fonts.statsValue }}>{totalQuestions}</p>
                                <p className="uppercase font-bold text-[rgb(var(--text-secondary))]" style={{ fontSize: config.fonts.statsTitle }}>Total</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Helper to apply font size to Card */}
                {/* Note: We need to update QuestionCard to use style={{ fontSize: config.fonts.gridNumber }} */}

                {/* Logic for Rounds vs Standard Grid */}
                {activeEnableRounds ? (
                    <div className="w-full max-w-7xl flex flex-col gap-12">
                        {activeRounds.map((round, rIdx) => {
                            const roundQuestions = questions.filter(q => q.id >= round.range[0] && q.id <= round.range[1]);
                            if (roundQuestions.length === 0) return null;

                            return (
                                <motion.div
                                    key={rIdx}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: rIdx * 0.1 }}
                                    className="w-full"
                                >
                                    <h3
                                        className="font-bold mb-6 text-[rgb(var(--text-primary))] border-b-2 border-[rgb(var(--color-primary))] pb-2 inline-block px-4"
                                        style={{ fontSize: config.fonts.roundTitle }}
                                    >
                                        {round.title}
                                    </h3>
                                    <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2 md:gap-3">
                                        {roundQuestions.map((q) => (
                                            <QuestionCard
                                                key={q.id}
                                                q={q}
                                                isVisited={visitedIds.includes(q.id)}
                                                isMarked={markedIds.includes(q.id)}
                                                isDusting={isSnapping && visitedIds.includes(q.id)}
                                                gridNumberFont={config.fonts.gridNumber}
                                                onNavigate={handleCardNavigate}
                                            />
                                        ))}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                ) : (
                    <motion.div
                        className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2 md:gap-3 max-w-7xl w-full px-2 md:px-4"
                        initial="hidden"
                        animate="show"
                        variants={{
                            hidden: { opacity: 0 },
                            show: {
                                opacity: 1,
                                transition: {
                                    staggerChildren: 0.02
                                }
                            }
                        }}
                    >
                        {questions.map((q) => (
                            <QuestionCard
                                key={q.id}
                                q={q}
                                isVisited={visitedIds.includes(q.id)}
                                isMarked={markedIds.includes(q.id)}
                                isDusting={isSnapping && visitedIds.includes(q.id)}
                                gridNumberFont={config.fonts.gridNumber}
                                onNavigate={handleCardNavigate}
                            />
                        ))}
                    </motion.div>
                )}

                <div className="mt-12 flex flex-wrap justify-center gap-3 md:gap-4">
                    <Link to="/admin" className="btn-secondary flex items-center gap-2 text-sm px-3 py-2">
                        <Settings size={16} />
                        <span className="hidden sm:inline">Admin Panel</span>
                        <span className="sm:hidden">Admin</span>
                    </Link>
                    <motion.button
                        onClick={() => void handleRandom()}
                        className="btn-secondary flex items-center gap-2 text-sm px-3 py-2"
                        title="Open a random unvisited question (R)"
                    >
                        <Shuffle size={16} />
                        <span className="hidden sm:inline">Random</span>
                        <span className="sm:hidden">Random</span>
                    </motion.button>
                    <motion.button
                        onClick={() => void handleSnap()}
                        className="btn-secondary flex items-center gap-2 text-sm px-3 py-2 border-[rgb(var(--color-primary))]/0 text-[rgb(var(--danger))] hover:bg-[rgb(var(--danger))]/15 hover:text-[rgb(var(--danger))]"
                        title="Snap/purge all visited questions (X)"
                    >
                        <Sparkles size={16} />
                        <span className="hidden sm:inline">Snap</span>
                        <span className="sm:hidden">Snap</span>
                    </motion.button>
                    <motion.button
                        onClick={async () => {
                            sounds.select();
                            const ok = await dialog.confirm({
                                title: 'Reset Progress',
                                message: 'Clear the visited marks on all question cards?',
                                confirmLabel: 'Reset',
                                cancelLabel: 'Keep Marks',
                                danger: true,
                            });
                            if (ok) resetProgress();
                        }}
                        className="btn-secondary flex items-center gap-2 group border-[rgb(var(--color-primary))]/0 text-[rgb(var(--danger))] hover:bg-[rgb(var(--danger))]/15 hover:text-[rgb(var(--danger))] text-sm px-3 py-2"
                    >
                        <Trash2 size={16} />
                        <span className="hidden sm:inline">Reset Progress</span>
                        <span className="sm:hidden">Reset</span>
                    </motion.button>

                    {installPrompt && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            onClick={handleInstall}
                            className="btn-primary flex items-center gap-2 text-sm px-3 py-2"
                        >
                            <Download size={16} />
                            Install
                        </motion.button>
                    )}
                </div>
            </div>

            {/* Shortcuts Modal */}
            <ShortcutsModal
                isOpen={showShortcuts}
                onClose={() => setShowShortcuts(false)}
            />
        </SiteLayout>
    );
}
