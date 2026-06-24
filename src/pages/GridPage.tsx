import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';
import { useQuiz } from '../context/QuizContext';
import { Trash2, Trophy, Target, ListChecks, Settings, Download, Maximize, Minimize } from 'lucide-react';
import { sounds } from '../utils/sounds';
import ShortcutsModal from '../components/ShortcutsModal';
import ContextMenu from '../components/ContextMenu';

export default function GridPage() {
    const { appConfig: config, allQuestions: questions } = useData();
    const { visitedIds, resetProgress } = useQuiz();
    const navigate = useNavigate();

    const totalQuestions = questions.length;
    const completedCount = visitedIds.length;
    const remainingCount = totalQuestions - completedCount;

    // Fullscreen State
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Shortcuts Modal State
    const [showShortcuts, setShowShortcuts] = useState(false);

    // Context Menu State
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

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
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [toggleFullscreen, isFullscreen]);

    // Context Menu Handler
    useEffect(() => {
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
            setContextMenu({ x: e.clientX, y: e.clientY });
        };
        document.addEventListener('contextmenu', handleContextMenu);
        return () => document.removeEventListener('contextmenu', handleContextMenu);
    }, []);

    // Simple Helper Component for Question Cards
    const QuestionCard = ({ q }: { q: typeof questions[0] }) => {
        const isVisited = visitedIds.includes(q.id);
        return (
            <motion.div
                variants={{ hidden: { opacity: 0, scale: 0.8 }, show: { opacity: 1, scale: 1 } }}
                className="w-full"
            >
                <div
                    className={`
                aspect-square flex items-center justify-center rounded-xl font-bold w-full
                transition-all duration-300 border relative overflow-hidden group cursor-pointer
                ${isVisited
                            ? 'bg-red-900/40 border-red-800/50 text-gray-500 cursor-not-allowed grayscale-[0.8]'
                            : 'bg-[var(--card-bg)] border-[var(--card-border)] text-[rgb(var(--text-primary))] backdrop-blur-md hover:bg-white/20 hover:border-purple-500 hover:shadow-[0_0_20px_rgba(168,85,247,0.6)] hover:scale-105 shadow-xl'
                        }
            `}
                    style={{ fontSize: config.fonts.gridNumber }}
                    onClick={(e) => {
                        // Allow navigation if NOT visited OR if Alt key is held
                        if (!isVisited || e.altKey) {
                            e.preventDefault(); // Stop any default behavior
                            if (isVisited) sounds.click();
                            else sounds.select();
                            navigate(`/question/${q.id}`);
                        }
                    }}
                    onMouseEnter={() => !isVisited && sounds.click()}
                >
                    {!isVisited && (
                        <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 via-transparent to-transparent opacity-50" />
                    )}
                    {isVisited && (
                        <div className="absolute inset-0 flex items-center justify-center opacity-30 select-none pointer-events-none">
                            <div className="w-full h-[2px] bg-red-500/50 rotate-45 absolute" />
                            <div className="w-full h-[2px] bg-red-500/50 -rotate-45 absolute" />
                        </div>
                    )}
                    <span className="relative z-10 drop-shadow-md">{q.id}</span>
                </div>
            </motion.div>
        );
    };

    // --- PWA Install Logic ---
    const [installPrompt, setInstallPrompt] = useState<any>(null);

    useEffect(() => {
        const handler = (e: any) => {
            e.preventDefault();
            setInstallPrompt(e);
        };
        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstall = () => {
        if (!installPrompt) return;
        installPrompt.prompt();
        installPrompt.userChoice.then((choiceResult: any) => {
            if (choiceResult.outcome === 'accepted') {
                setInstallPrompt(null);
            }
        });
    };

    return (
        <>
            {/* Fullscreen Toggle Button - Fixed Top Right */}
            <button
                onClick={toggleFullscreen}
                className="fixed top-4 right-4 z-50 p-3 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all group"
                title={isFullscreen ? 'Exit Fullscreen (F)' : 'Enter Fullscreen (F)'}
            >
                {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
                <span className="absolute -bottom-8 right-0 text-xs bg-black/80 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Press F
                </span>
            </button>

            {/* Main Grid Content */}
            <div className="min-h-screen p-4 md:p-8 flex flex-col items-center">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-6 md:mb-8 relative z-10"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-2 title-gradient">{config.appName}</h1>
                    <p className="text-[rgb(var(--text-secondary))] text-xs md:text-sm tracking-widest uppercase font-medium">Select a question to begin • <span className="opacity-60">Alt+Click to re-open visited</span></p>
                </motion.div>

                {/* Stats Dashboard */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-wrap justify-center gap-2 md:gap-8 mb-6 md:mb-10 w-full max-w-4xl"
                >
                    {/* ... Stats blocks ... */}
                    <div className="glass-panel p-3 md:px-6 md:py-4 flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 min-w-[100px] md:min-w-[160px]">
                        {/* ... Icon ... */}
                        <div className="p-2 md:p-3 rounded-full bg-purple-500/20 text-purple-300">
                            <Trophy className="w-4 h-4 md:w-6 md:h-6" />
                        </div>
                        <div className="text-center md:text-left">
                            <p className="uppercase font-bold text-[rgb(var(--text-secondary))]" style={{ fontSize: config.fonts.statsTitle }}>Total</p>
                            <p className="font-bold text-[rgb(var(--text-primary))] leading-none" style={{ fontSize: config.fonts.statsValue }}>{totalQuestions}</p>
                        </div>
                    </div>

                    <div className="glass-panel p-3 md:px-6 md:py-4 flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 min-w-[100px] md:min-w-[160px]">
                        {/* ... Icon ... */}
                        <div className="p-2 md:p-3 rounded-full bg-emerald-500/20 text-emerald-300">
                            <Target className="w-4 h-4 md:w-6 md:h-6" />
                        </div>
                        <div className="text-center md:text-left">
                            <p className="uppercase font-bold text-[rgb(var(--text-secondary))]" style={{ fontSize: config.fonts.statsTitle }}>Left</p>
                            <p className="font-bold text-[rgb(var(--text-primary))] leading-none" style={{ fontSize: config.fonts.statsValue }}>{remainingCount}</p>
                        </div>
                    </div>

                    <div className="glass-panel p-3 md:px-6 md:py-4 flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 min-w-[100px] md:min-w-[160px]">
                        {/* ... Icon ... */}
                        <div className="p-2 md:p-3 rounded-full bg-blue-500/20 text-blue-300">
                            <ListChecks className="w-4 h-4 md:w-6 md:h-6" />
                        </div>
                        <div className="text-center md:text-left">
                            <p className="uppercase font-bold text-[rgb(var(--text-secondary))]" style={{ fontSize: config.fonts.statsTitle }}>Done</p>
                            <p className="font-bold text-[rgb(var(--text-primary))] leading-none" style={{ fontSize: config.fonts.statsValue }}>{completedCount}</p>
                        </div>
                    </div>
                </motion.div>

                {/* Helper to apply font size to Card */}
                {/* Note: We need to update QuestionCard to use style={{ fontSize: config.fonts.gridNumber }} */}

                {/* Logic for Rounds vs Standard Grid */}
                {config.enableRounds ? (
                    <div className="w-full max-w-7xl flex flex-col gap-12">
                        {config.rounds.map((round, rIdx) => {
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
                                        className="font-bold mb-6 text-[rgb(var(--text-primary))] border-b-2 border-purple-500/50 pb-2 inline-block px-4"
                                        style={{ fontSize: config.fonts.roundTitle }}
                                    >
                                        {round.title}
                                    </h3>
                                    <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2 md:gap-3">
                                        {roundQuestions.map((q) => (
                                            <QuestionCard key={q.id} q={q} />
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
                            <QuestionCard key={q.id} q={q} />
                        ))}
                    </motion.div>
                )}

                <div className="mt-12 flex flex-wrap justify-center gap-3 md:gap-4">
                    <Link to="/admin" className="btn-secondary flex items-center gap-2 border-white/10 text-gray-400 hover:text-white hover:bg-white/10 text-sm px-3 py-2">
                        <Settings size={16} />
                        <span className="hidden sm:inline">Admin Panel</span>
                        <span className="sm:hidden">Admin</span>
                    </Link>
                    <motion.button
                        onClick={() => {
                            sounds.select();
                            if (confirm('Are you sure you want to reset all progress?')) {
                                resetProgress();
                            }
                        }}
                        className="btn-secondary flex items-center gap-2 group border-red-500/30 text-red-400 hover:bg-red-950/30 hover:text-red-300 text-sm px-3 py-2"
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
                            className="btn-primary flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/50 text-sm px-3 py-2"
                        >
                            <Download size={16} />
                            Install
                        </motion.button>
                    )}
                </div>

                {/* About / guide content */}
                <section className="mt-16 max-w-3xl mx-auto text-left bg-white/[0.03] border border-white/10 rounded-2xl p-6 md:p-8">
                    <h2 className="text-xl font-bold text-white mb-3">What is Sajilo Quiz?</h2>
                    <p className="text-gray-400 leading-relaxed mb-4">
                        Sajilo Quiz is a free quiz presentation app for running live events: school and college
                        competitions, office game nights, and classroom reviews. You build your questions and rounds
                        in the admin panel, project the question grid on a big screen, and reveal questions one by
                        one while the sidebar keeps team scores. It was built for real quiz competitions in Nepal,
                        where venue internet can fail at the worst moment, so the whole app works completely offline
                        once loaded.
                    </p>

                    <h2 className="text-xl font-bold text-white mb-3 mt-8">How to run a quiz with it</h2>
                    <ul className="text-gray-400 leading-relaxed mb-4 list-disc pl-5 space-y-2">
                        <li>Open the <strong className="text-gray-200">Admin Panel</strong> and add your questions, rounds, and any images or audio.</li>
                        <li>Project this grid page on the venue screen. Press F for fullscreen.</li>
                        <li>Click a numbered card to reveal its question. Answered cards are marked so you never repeat one.</li>
                        <li>Keep scores in the team scoreboard sidebar as the rounds progress.</li>
                        <li>Press ? anytime to see all keyboard shortcuts, and use Reset Progress to start a fresh session.</li>
                    </ul>

                    <h2 className="text-xl font-bold text-white mb-3 mt-8">Frequently asked questions</h2>
                    <div className="space-y-4 text-gray-400 leading-relaxed">
                        <div>
                            <h3 className="font-semibold text-gray-200">Does it need internet during the event?</h3>
                            <p>No. Install it (or just load it once) and everything, including your media, runs offline. That is the whole point of the app.</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-200">Where is my quiz data stored?</h3>
                            <p>On your own device, in your browser's local storage. Nothing you create is uploaded to any server.</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-200">Can I use images and sound?</h3>
                            <p>Yes. Questions support multimedia, and the app has built-in sound effects for reveals and results.</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-200">Is it really free?</h3>
                            <p>Yes. It began as a tool for events I helped run, and it is shared so anyone can use it.</p>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="mt-10 pb-6 text-center text-sm text-gray-500">
                    <p className="mb-2">
                        <a href="/privacy.html" className="text-gray-400 hover:text-white underline-offset-4 hover:underline mx-2">Privacy Policy</a>
                        <a href="/contact.html" className="text-gray-400 hover:text-white underline-offset-4 hover:underline mx-2">Contact</a>
                        <a href="https://github.com/arundada9000/sajiloquiz" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white underline-offset-4 hover:underline mx-2">Source Code</a>
                    </p>
                    <p>
                        &copy; {new Date().getFullYear()}{' '}
                        <a href="https://arunneupane.netlify.app/" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300">Arun Neupane</a>
                        {' '}| Reach me anytime:{' '}
                        <a href="mailto:arunneupane0000@gmail.com" className="text-emerald-400 hover:text-emerald-300">arunneupane0000@gmail.com</a>
                    </p>
                </footer>
            </div>
            {/* Shortcuts Modal */}
            <ShortcutsModal
                isOpen={showShortcuts}
                onClose={() => setShowShortcuts(false)}
                currentPage="grid"
            />
            {contextMenu && (
                <ContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    onClose={() => setContextMenu(null)}
                    pageType="grid"
                />
            )}
        </>
    );
}
