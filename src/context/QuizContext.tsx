import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const STORAGE_KEY = 'quiz-app-visited';

interface QuizContextType {
    visitedIds: number[];
    markAsVisited: (id: number) => void;
    resetProgress: () => void;
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

    return (
        <QuizContext.Provider value={{ visitedIds, markAsVisited, resetProgress }}>
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
