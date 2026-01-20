import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Shortcut = {
    keys: string[];
    description: string;
    category: string;
};

const shortcuts: Shortcut[] = [
    // Global
    { keys: ['F'], description: 'Toggle Fullscreen', category: 'Global' },
    { keys: ['?'], description: 'Show/Hide Keyboard Shortcuts', category: 'Global' },

    // Grid Page
    { keys: ['Alt', 'Click'], description: 'Re-open visited question', category: 'Grid Page' },

    // Question Page
    { keys: ['Space'], description: 'Reveal / Hide Answer', category: 'Question Page' },
    { keys: ['Esc'], description: 'Back to Grid / Close Modal', category: 'Question Page' },
    { keys: ['Q'], description: 'Open Quick Peek Overview', category: 'Question Page' },
    { keys: ['T'], description: 'Start / Pause Timer', category: 'Question Page' },
    { keys: ['R'], description: 'Reset Timer', category: 'Question Page' },
    { keys: ['+', ']'], description: 'Increase Text Size', category: 'Question Page' },
    { keys: ['-', '['], description: 'Decrease Text Size', category: 'Question Page' },
    { keys: ['0'], description: 'Reset Text Size', category: 'Question Page' },
];

type Props = {
    isOpen: boolean;
    onClose: () => void;
    currentPage?: 'grid' | 'question';
};

export default function ShortcutsModal({ isOpen, onClose }: Props) {
    // Group shortcuts by category
    const categories = Array.from(new Set(shortcuts.map(s => s.category)));

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[200] flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Modal Content */}
                    <motion.div
                        className="relative z-10 w-[95vw] max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl glass-panel p-6 md:p-8"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-bold text-white">
                                    Keyboard Shortcuts
                                </h2>
                                <p className="text-gray-400 text-sm mt-1">
                                    All keyboard shortcuts for quick navigation and control
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                                title="Close (Esc)"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Shortcuts List by Category */}
                        <div className="space-y-6">
                            {categories.map(category => (
                                <div key={category}>
                                    <h3 className="text-sm uppercase tracking-wider text-purple-400 font-bold mb-3">
                                        {category}
                                    </h3>
                                    <div className="space-y-2">
                                        {shortcuts
                                            .filter(s => s.category === category)
                                            .map((shortcut, idx) => (
                                                <div
                                                    key={idx}
                                                    className="p-3 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-colors flex items-center justify-between"
                                                >
                                                    <span className="text-gray-200 font-medium text-sm">
                                                        {shortcut.description}
                                                    </span>
                                                    <div className="flex gap-1">
                                                        {shortcut.keys.map((key, keyIdx) => (
                                                            <kbd
                                                                key={keyIdx}
                                                                className="px-2.5 py-1 bg-gradient-to-b from-white/10 to-white/5 border border-white/20 rounded text-xs font-mono text-purple-300 shadow-lg min-w-[2rem] text-center"
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

                        {/* Footer */}
                        <div className="mt-6 pt-4 border-t border-white/10 text-center text-xs text-gray-500">
                            Press <kbd className="px-2 py-1 bg-white/10 rounded border border-white/20">Esc</kbd> or{' '}
                            <kbd className="px-2 py-1 bg-white/10 rounded border border-white/20">?</kbd> to close
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
