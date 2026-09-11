import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const STORAGE_KEY = 'quiz-app-visited';
const MARKS_KEY = 'quiz-app-marked';
const DUSTED_KEY = 'quiz-app-dusted';

interface QuizContextType {
    visitedIds: number[];
    markAsVisited: (id: number) => void;
    resetProgress: () => void;
    markedIds: number[];
    toggleMark: (id: number) => void;
    dustedIds: number[];
    dustVisited: () => void;
    restoreDusted: () => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export function QuizProvider({ children }: { children: ReactNode }) {
    // Initialize lazily to avoid race conditions and ensure we catch existing data
    const [visitedIds, setVisitedIds] = useState<number[]>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error("Failed to parse history", e);
            return [];
        }
    });

    // Sync to localStorage whenever state changes
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(visitedIds));
    }, [visitedIds]);

    // Bookmarks/marks for questions to revisit (e.g. ambiguity). Persisted
    // separately so resetting progress does not clear them.
    const [markedIds, setMarkedIds] = useState<number[]>(() => {
        try {
            const saved = localStorage.getItem(MARKS_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error("Failed to parse marks", e);
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem(MARKS_KEY, JSON.stringify(markedIds));
    }, [markedIds]);

    // Questions that were "snapped" away (dusted out of the grid). They stay
    // hidden until restored, so only unvisited questions remain visible.
    const [dustedIds, setDustedIds] = useState<number[]>(() => {
        try {
            const saved = localStorage.getItem(DUSTED_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error("Failed to parse dusted", e);
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem(DUSTED_KEY, JSON.stringify(dustedIds));
    }, [dustedIds]);

    const markAsVisited = (id: number) => {
        setVisitedIds(prev => {
            if (!prev.includes(id)) {
                return [...prev, id];
            }
            return prev;
        });
    };

    const resetProgress = () => {
        setVisitedIds([]);
        localStorage.removeItem(STORAGE_KEY);
        setDustedIds([]);
        localStorage.removeItem(DUSTED_KEY);
    };

    const toggleMark = (id: number) => {
        setMarkedIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const dustVisited = () => {
        setDustedIds(prev => Array.from(new Set([...prev, ...visitedIds])));
    };

    const restoreDusted = () => {
        setDustedIds([]);
        localStorage.removeItem(DUSTED_KEY);
    };

    return (
        <QuizContext.Provider value={{ visitedIds, markAsVisited, resetProgress, markedIds, toggleMark, dustedIds, dustVisited, restoreDusted }}>
            {children}
        </QuizContext.Provider>
    );
}

export function useQuiz() {
    const context = useContext(QuizContext);
    if (context === undefined) {
        throw new Error('useQuiz must be used within a QuizProvider');
    }
    return context;
}
