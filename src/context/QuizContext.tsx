import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const STORAGE_KEY = 'quiz-app-visited';
const MARKS_KEY = 'quiz-app-marked';

interface QuizContextType {
    visitedIds: number[];
    markAsVisited: (id: number) => void;
    resetProgress: () => void;
    markedIds: number[];
    toggleMark: (id: number) => void;
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
    };

    const toggleMark = (id: number) => {
        setMarkedIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    return (
        <QuizContext.Provider value={{ visitedIds, markAsVisited, resetProgress, markedIds, toggleMark }}>
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
