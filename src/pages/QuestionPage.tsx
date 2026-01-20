import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Eye, EyeOff, Timer, Play, Pause, RotateCcw, Plus, Minus, ArrowRight, Maximize, Minimize, LayoutGrid, X } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useQuiz } from '../context/QuizContext';
import { sounds } from '../utils/sounds';
import ShortcutsModal from '../components/ShortcutsModal';
import ContextMenu from '../components/ContextMenu';

export default function QuestionPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { appConfig: config, allQuestions: questions } = useData();
    const questionId = Number(id);
    const question = questions.find(q => q.id === questionId);

    // Determine Round Title
    let roundTitle = "";
    if (config.enableRounds) {
        const activeRound = config.rounds.find(r => questionId >= r.range[0] && questionId <= r.range[1]);
        if (activeRound) roundTitle = activeRound.title;
    }

    const [showAnswer, setShowAnswer] = useState(false);
    const { markAsVisited, visitedIds } = useQuiz();

    // Dynamic Font Scaling
    const [scale, setScale] = useState(1);

    // Fullscreen State
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Quick Peek State
    const [showQuickPeek, setShowQuickPeek] = useState(false);

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
        let interval: any = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(timeLeft => timeLeft - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            sounds.timerEnd();
        }
        return () => clearInterval(interval);
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
        navigate('/');
    }, [navigate]);

    const handleToggleAnswer = useCallback(() => {
        if (!showAnswer) {
            sounds.reveal();
            setIsActive(false); // Stop timer on reveal
        } else {
            sounds.click();
        }
        setShowAnswer(prev => !prev);
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

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Font Scaling
            if (e.key === ']' || e.key === '=' || e.key === '+') setScale(s => Math.min(s + 0.1, 3));
            if (e.key === '[' || e.key === '-') setScale(s => Math.max(s - 0.1, 0.5));
            if (e.key === '0') setScale(1);

            if (e.code === 'Space') {
                e.preventDefault();
                handleToggleAnswer();
            }

            // Escape key handling
            if (e.code === 'Escape') {
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
            if (e.key.toLowerCase() === 't') setIsActive(prev => !prev);
            if (e.key.toLowerCase() === 'r') {
                setTimeLeft(config.timer.defaultDuration);
                setIsActive(false);
            }

            // Fullscreen Toggle (F key)
            if (e.key.toLowerCase() === 'f') {
                toggleFullscreen();
            }

            // Quick Peek Toggle (Q key)
            if (e.key.toLowerCase() === 'q') {
                setShowQuickPeek(prev => !prev);
            }

            // Shortcuts Modal Toggle (? key)
            if (e.key === '?') {
                e.preventDefault();
                setShowShortcuts(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleBack, handleToggleAnswer, config.timer.defaultDuration, showQuickPeek, toggleFullscreen, isFullscreen]);

    // Context Menu Handler
    useEffect(() => {
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
            setContextMenu({ x: e.clientX, y: e.clientY });
        };
        document.addEventListener('contextmenu', handleContextMenu);
        return () => document.removeEventListener('contextmenu', handleContextMenu);
    }, []);


    if (!question) return null;

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden text-[rgb(var(--text-primary))]">
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] -z-10 pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

            <button
                onClick={toggleFullscreen}
                className="fixed top-4 right-4 z-50 p-3 rounded-xl bg-[var(--card-bg)] backdrop-blur-md border border-[var(--card-border)] text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))] hover:bg-white/10 transition-all group shadow-xl"
                title={isFullscreen ? 'Exit Fullscreen (F)' : 'Enter Fullscreen (F)'}
            >
                {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
                <span className="absolute -bottom-8 right-0 text-xs bg-black/80 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
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
                <div className="flex-1">
                    <div className="mb-8">
                        {/* Header Toolbar */}
                        <div className="flex items-center gap-3 mb-6">
                            <button onClick={handleBack} className="flex items-center gap-2 text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))] transition-colors group font-medium">
                                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back to Grid <span className="text-xs border border-[var(--card-border)] px-1 rounded mx-2 opacity-50 hidden md:inline">ESC</span>
                            </button>

                            {/* Quick Peek Button */}
                            <button
                                onClick={() => setShowQuickPeek(true)}
                                className="ml-auto flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--card-bg)] border border-[var(--card-border)] text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))] hover:bg-white/10 transition-all group"
                                title="Quick Peek All Questions (Q)"
                            >
                                <LayoutGrid size={16} />
                                <span className="hidden md:inline text-sm">Overview</span>
                                <span className="text-xs border border-[var(--card-border)] px-1 rounded opacity-50 hidden md:inline">Q</span>
                            </button>
                        </div>

                        {roundTitle && (
                            <div className="text-purple-400 text-sm font-bold uppercase tracking-widest mb-2 border-l-2 border-purple-500 pl-3">
                                {roundTitle}
                            </div>
                        )}

                        <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-sm mb-6 text-purple-300 border border-white/10 uppercase tracking-wider">
                            Question {question.id}
                        </span>
                    </div>

                    <div className="flex flex-col items-start gap-8 relative group/scale">
                        {/* Zoom Controls Overlay */}
                        <div className="absolute top-[-3rem] right-0 flex gap-1 bg-black/30 backdrop-blur-sm p-1 rounded-lg opacity-0 group-hover/scale:opacity-100 transition-opacity z-10 text-white">
                            <button onClick={() => setScale(s => Math.max(s - 0.1, 0.5))} className="p-1 hover:bg-white/10 rounded" title="Smaller [-]"><Minus size={14} /></button>
                            <span className="text-xs font-mono w-8 text-center pt-1">{Math.round(scale * 100)}%</span>
                            <button onClick={() => setScale(s => Math.min(s + 0.1, 3))} className="p-1 hover:bg-white/10 rounded" title="Larger [+]"><Plus size={14} /></button>
                            <button onClick={() => setScale(1)} className="p-1 hover:bg-white/10 rounded" title="Reset [0]"><RotateCcw size={14} /></button>
                        </div>

                        {/* Question Text & Media with Scale */}
                        <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', transition: 'transform 0.2s ease-out', width: '100%' }}>

                            {/* Media Display */}
                            {question.mediaType === 'image' && question.mediaUrl && (
                                <div className="mb-6 rounded-xl overflow-hidden border-2 border-white/10 shadow-2xl relative group/img">
                                    <img src={question.mediaUrl} alt="Question Attachment" className="max-h-[400px] w-auto object-contain bg-black/50" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity flex items-end p-4">
                                        <span className="text-sm font-mono text-gray-300">Image Reference</span>
                                    </div>
                                </div>
                            )}

                            {question.mediaType === 'audio' && question.mediaUrl && (
                                <div className="mb-6 p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center gap-4">
                                    <div className="p-3 bg-purple-500 rounded-full animate-pulse">
                                        <div className="w-6 h-6 border-b-2 border-white rounded-full animate-spin" />
                                        {/* Simple visualization icon placeholder */}
                                    </div>
                                    <audio controls src={question.mediaUrl} className="w-full h-10 opacity-80 hover:opacity-100 transition-opacity" />
                                </div>
                            )}

                            <h2 className="font-bold leading-tight mb-8" style={{ fontSize: config.fonts.questionTitle }}>
                                {question.text}
                            </h2>

                            <AnimatePresence mode="wait">
                                {showAnswer ? (
                                    <motion.div
                                        key="answer"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="w-full"
                                    >
                                        <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 w-full">
                                            <p className="text-sm text-emerald-500 uppercase tracking-widest mb-2 font-bold">Answer</p>
                                            <p className="font-medium text-[rgb(var(--text-primary))]" style={{ fontSize: config.fonts.answerTitle }}>
                                                {question.answer}
                                            </p>
                                        </div>
                                    </motion.div>
                                ) : null}
                            </AnimatePresence>
                        </div>

                        <button
                            onClick={handleToggleAnswer}
                            className={`btn-primary flex items-center gap-2 text-lg px-8 py-4 ${showAnswer ? 'bg-gray-700 hover:bg-gray-600 !shadow-none !background-none' : ''}`}
                            style={showAnswer ? { background: 'rgba(255,255,255,0.1)' } : {}}
                        >
                            {showAnswer ? <><EyeOff size={20} /> Hide Answer</> : <><Eye size={20} /> Reveal Answer</>}
                            <span className="text-xs border border-white/30 px-1 rounded ml-2 opacity-70 hidden md:inline">SPACE</span>
                        </button>
                    </div>
                </div>

                {/* Timer Panel */}
                <div className="w-full md:w-72 flex flex-col gap-4">
                    <div className={`p-6 rounded-2xl border flex flex-col items-center justify-center transition-colors duration-500 shadow-xl ${timeLeft === 0 ? 'bg-red-500/20 border-red-500/50 anim-pulse' : 'bg-[var(--card-bg)] border-[var(--card-border)]'}`}>

                        {/* Timer Header & Time */}
                        <div className="flex items-center gap-2 mb-2 text-[rgb(var(--text-secondary))]">
                            <Timer size={16} /> <span>Timer</span>
                        </div>
                        <div className={`font-mono font-bold mb-4 ${timeLeft <= 10 ? 'text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]' : 'text-[rgb(var(--text-primary))]'}`} style={{ fontSize: config.fonts.timerTime }}>
                            {timeLeft}s
                        </div>
                    </div>

                    {/* Adjuster */}
                    <div className="flex items-center gap-2 w-full mb-6 justify-center">
                        <button onClick={() => setTimeLeft(t => Math.max(0, t - 10))} className="p-2 hover:bg-white/10 rounded"><Minus size={16} /></button>
                        <button onClick={() => setTimeLeft(config.timer.defaultDuration)} className="text-xs uppercase tracking-wider opacity-50 hover:opacity-100">Reset</button>
                        <button onClick={() => setTimeLeft(t => t + 10)} className="p-2 hover:bg-white/10 rounded"><Plus size={16} /></button>
                    </div>

                    {/* Primary Controls */}
                    <div className="flex gap-2 w-full mb-3">
                        <button
                            onClick={() => { sounds.click(); setIsActive(!isActive); }}
                            className={`flex-1 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${isActive ? 'bg-amber-600/80 hover:bg-amber-600 text-white shadow-lg shadow-amber-900/40' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/40 hover:-translate-y-1'}`}
                        >
                            {isActive ? <><Pause size={18} /> Pause</> : <><Play size={18} /> Start</>}
                        </button>
                        <button onClick={() => { sounds.click(); setIsActive(false); setTimeLeft(config.timer.defaultDuration); }} className="p-3 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 border border-white/5">
                            <RotateCcw size={18} />
                        </button>
                    </div>

                    {/* Pass Button */}
                    <button
                        onClick={handlePass}
                        className="w-full py-2 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 text-indigo-300 rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                        <ArrowRight size={16} /> Pass (+{config.timer.passDuration}s)
                    </button>

                    <div className="text-[10px] text-gray-600 text-center font-mono mt-4">
                        [T] Timer • [R] Reset • [-/+] Zoom • [0] Reset Zoom • [F] Fullscreen • [Q] Overview
                    </div>

                </div>
            </motion.div >

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
                            className="relative z-10 w-[95vw] max-w-6xl max-h-[90vh] overflow-y-auto rounded-2xl bg-gray-900/95 border border-white/10 p-6 md:p-8"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Questions Overview</h2>
                                    <p className="text-gray-400 text-sm mt-1">Click any question to jump to it • Current: Q{questionId}</p>
                                </div>
                                <button
                                    onClick={() => setShowQuickPeek(false)}
                                    className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                                    title="Close (Esc)"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Questions Grid */}
                            <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2 md:gap-3">
                                {questions.map((q) => {
                                    const isVisited = visitedIds.includes(q.id);
                                    const isCurrent = q.id === questionId;
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
                                                    ? 'bg-purple-600 border-purple-400 text-white ring-2 ring-purple-400 ring-offset-2 ring-offset-gray-900'
                                                    : isVisited
                                                        ? 'bg-red-900/30 border-red-800/40 text-gray-500 cursor-not-allowed'
                                                        : 'bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-purple-500 hover:scale-105'
                                                }
                                            `}
                                        >
                                            {isVisited && !isCurrent && (
                                                <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
                                                    <div className="w-full h-[2px] bg-red-500/50 rotate-45 absolute" />
                                                    <div className="w-full h-[2px] bg-red-500/50 -rotate-45 absolute" />
                                                </div>
                                            )}
                                            <span className="relative z-10">{q.id}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Footer hint */}
                            <div className="mt-6 text-center text-xs text-gray-500">
                                Press <kbd className="px-1.5 py-0.5 bg-white/10 rounded border border-white/20">Q</kbd> or <kbd className="px-1.5 py-0.5 bg-white/10 rounded border border-white/20">Esc</kbd> to close
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Shortcuts Modal */}
            <ShortcutsModal
                isOpen={showShortcuts}
                onClose={() => setShowShortcuts(false)}
                currentPage="question"
            />
            {contextMenu && (
                <ContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    onClose={() => setContextMenu(null)}
                    pageType="question"
                    questionText={question?.text}
                    answerText={question?.answer}
                    onToggleAnswer={handleToggleAnswer}
                    onQuickPeek={() => setShowQuickPeek(true)}
                />
            )}
        </div >
    );
}
