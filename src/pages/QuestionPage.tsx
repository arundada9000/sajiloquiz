import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Eye, EyeOff, Timer, Play, Pause, RotateCcw, Plus, Minus, ArrowRight } from 'lucide-react';
import { questions } from '../data/questions';
import { config } from '../data/config';
import { useQuiz } from '../context/QuizContext';
import { sounds } from '../utils/sounds';

export default function QuestionPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const questionId = Number(id);
    const question = questions.find(q => q.id === questionId);

    // Determine Round Title
    let roundTitle = "";
    if (config.enableRounds) {
        const activeRound = config.rounds.find(r => questionId >= r.range[0] && questionId <= r.range[1]);
        if (activeRound) roundTitle = activeRound.title;
    }

    const [showAnswer, setShowAnswer] = useState(false);
    const { markAsVisited } = useQuiz();

    // Timer State
    const [timeLeft, setTimeLeft] = useState(config.timer.defaultDuration);
    const [isActive, setIsActive] = useState(config.timer.autoStartOnOpen); // Config: Auto-start on load

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


    const handleBack = useCallback(() => {
        sounds.back();
        navigate('/');
    }, [navigate]);

    const handleToggleAnswer = useCallback(() => {
        if (!showAnswer) {
            sounds.reveal();
        } else {
            sounds.click();
        }
        setShowAnswer(prev => !prev);
    }, [showAnswer]);

    const handlePass = useCallback(() => {
        sounds.click();
        setTimeLeft(config.timer.passDuration);
        if (config.timer.autoStartOnPass) {
            setIsActive(true);
        } else {
            setIsActive(false); // Stop if config says don't auto-start
        }
    }, []);

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space') {
                e.preventDefault();
                handleToggleAnswer();
            }
            if (e.code === 'Escape') {
                handleBack();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleBack, handleToggleAnswer]);


    if (!question) return null;

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden text-white">
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] -z-10 pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

            <motion.div
                className="max-w-5xl w-full glass-panel p-6 md:p-12 relative flex flex-col md:flex-row gap-8"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
            >
                {/* Main Question Content */}
                <div className="flex-1">
                    <div className="mb-8">
                        <button onClick={handleBack} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 group">
                            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back to Grid <span className="text-xs border border-gray-600 px-1 rounded mx-2 opacity-50 hidden md:inline">ESC</span>
                        </button>

                        {roundTitle && (
                            <div className="text-purple-400 text-sm font-bold uppercase tracking-widest mb-2 border-l-2 border-purple-500 pl-3">
                                {roundTitle}
                            </div>
                        )}

                        <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-sm mb-6 text-purple-300 border border-white/10 uppercase tracking-wider">
                            Question {question.id}
                        </span>
                        <h2 className="font-bold leading-tight mb-8" style={{ fontSize: config.fonts.questionTitle }}>
                            {question.text}
                        </h2>
                    </div>

                    <div className="flex flex-col items-start gap-8">
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
                                        <p className="text-sm text-emerald-400 uppercase tracking-widest mb-2 font-bold">Answer</p>
                                        <p className="font-medium text-emerald-100" style={{ fontSize: config.fonts.answerTitle }}>
                                            {question.answer}
                                        </p>
                                    </div>
                                </motion.div>
                            ) : null}
                        </AnimatePresence>

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
                    <div className={`p-6 rounded-2xl border flex flex-col items-center justify-center transition-colors duration-500 ${timeLeft === 0 ? 'bg-red-500/20 border-red-500/50 anim-pulse' : 'bg-black/20 border-white/10'}`}>

                        {/* Timer Header & Time */}
                        <div className="flex items-center gap-2 mb-2 text-gray-400">
                            <Timer size={16} /> <span>Timer</span>
                        </div>
                        <div className={`font-mono font-bold mb-4 ${timeLeft <= 10 ? 'text-red-400' : 'text-white'}`} style={{ fontSize: config.fonts.timerTime }}>
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

                </div>
            </motion.div >
        </div >
    );
}
