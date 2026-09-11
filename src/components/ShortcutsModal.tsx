import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { X, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Entry = {
    keys: string[];
    description: string;
    category: string;
    kind?: 'key' | 'gesture';
};

const entries: Entry[] = [
    // Global
    { keys: ['F'], description: 'Toggle Fullscreen', category: 'Global' },
    { keys: ['?'], description: 'Show / Hide Shortcuts & Gestures', category: 'Global' },

    // Grid Page
    { keys: ['Alt', 'Click'], description: 'Re-open a visited question', category: 'Grid Page' },
    { keys: ['Double-click'], description: 'Open a question from the grid', category: 'Grid Page', kind: 'gesture' },
    { keys: ['Right-click'], description: 'Open quick actions menu', category: 'Grid Page', kind: 'gesture' },
    { keys: ['R'], description: 'Open a random unvisited question', category: 'Grid Page' },
    { keys: ['X'], description: 'Snap away all visited questions', category: 'Grid Page' },

    // Question Page
    { keys: ['Space'], description: 'Reveal / Hide Answer', category: 'Question Page' },
    { keys: ['Esc'], description: 'Back to Grid / Close Modal', category: 'Question Page' },
    { keys: ['Q'], description: 'Open Quick Peek Overview', category: 'Question Page' },
    { keys: ['T'], description: 'Start / Pause Timer', category: 'Question Page' },
    { keys: ['R'], description: 'Reset Timer', category: 'Question Page' },
    { keys: ['M'], description: 'Mark / Unmark Question', category: 'Question Page' },
    { keys: ['+', ']'], description: 'Increase Text Size', category: 'Question Page' },
    { keys: ['-', '['], description: 'Decrease Text Size', category: 'Question Page' },
    { keys: ['0'], description: 'Reset Text Size', category: 'Question Page' },
    { keys: ['Swipe left / right'], description: 'Previous / next question', category: 'Question Page', kind: 'gesture' },
    { keys: ['Swipe up'], description: 'Toggle Quick Peek', category: 'Question Page', kind: 'gesture' },
    { keys: ['Double-tap'], description: 'Reveal / Hide answer', category: 'Question Page', kind: 'gesture' },
];

type Props = {
    isOpen: boolean;
    onClose: () => void;
};

export default function ShortcutsModal({ isOpen, onClose }: Props) {
    const closeRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (isOpen) {
            closeRef.current?.focus();
        }
    }, [isOpen]);

    const categories = Array.from(new Set(entries.map(e => e.category)));

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[200] flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Keyboard shortcuts and gestures"
                >
                    <div
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    <motion.div
                        className="relative z-10 w-[95vw] max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl glass-panel p-6 md:p-8"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-bold text-[rgb(var(--text-primary))]">
                                    Shortcuts &amp; Gestures
                                </h2>
                                <p className="text-[rgb(var(--text-secondary))] text-sm mt-1">
                                    Keyboard shortcuts on desktop, swipe gestures on touch devices
                                </p>
                            </div>
                            <button
                                ref={closeRef}
                                onClick={onClose}
                                className="p-2 rounded-lg bg-[var(--fill)] border border-[var(--card-border)] text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))] hover:bg-[rgb(var(--color-primary))]/15 transition-all"
                                title="Close (Esc)"
                                aria-label="Close shortcuts"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-6">
                            {categories.map(category => (
                                <div key={category}>
                                    <h3 className="text-sm uppercase tracking-wider text-[rgb(var(--color-primary))] font-bold mb-3">
                                        {category}
                                    </h3>
                                    <div className="space-y-2">
                                        {entries
                                            .filter(e => e.category === category)
                                            .map((entry, idx) => (
                                                <div
                                                    key={idx}
                                                    className="p-3 rounded-lg bg-[var(--fill)] border border-[var(--card-border)] hover:border-[rgb(var(--color-primary))]/40 transition-colors flex items-center justify-between gap-3"
                                                >
                                                    <span className="text-[rgb(var(--text-primary))] font-medium text-sm">
                                                        {entry.description}
                                                    </span>
                                                    <div className="flex gap-1 flex-wrap justify-end">
                                                        {entry.keys.map((key, keyIdx) => (
                                                            <kbd
                                                                key={keyIdx}
                                                                className={`px-2.5 py-1 bg-gradient-to-b from-[rgb(var(--color-primary))]/20 to-transparent border border-[rgb(var(--color-primary))]/30 rounded text-xs font-mono text-[rgb(var(--color-primary))] shadow-lg min-w-[2rem] text-center`}
                                                            >
                                                                {key}
                                                            </kbd>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 pt-4 border-t border-[var(--separator)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[rgb(var(--text-secondary))]">
                            <span>
                                Press <kbd className="px-2 py-1 bg-[var(--fill)] rounded border border-[var(--card-border)]">Esc</kbd> or{' '}
                                <kbd className="px-2 py-1 bg-[var(--fill)] rounded border border-[var(--card-border)]">?</kbd> to close
                            </span>
                            <Link
                                to="/guide#shortcuts"
                                onClick={onClose}
                                className="inline-flex items-center gap-1.5 text-[rgb(var(--color-primary))] font-medium hover:underline"
                            >
                                <BookOpen size={14} />
                                Full guide
                            </Link>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
