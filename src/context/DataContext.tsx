import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { config as defaultConfig } from '../data/config';
import { questions as defaultQuestions } from '../data/questions';
import { setSoundPreferences } from '../utils/sounds';
import { applyTheme } from '../utils/theme';

// Type definitions based on your existing data structures
export type Round = {
    title: string;
    range: [number, number];
};

export type Team = {
    id: string;
    name: string;
    score: number;
};

export type AppConfig = {
    appName: string;
    companyName: string;
    enableRounds: boolean;
    rounds: Round[];
    timer: {
        defaultDuration: number;
        passDuration: number;
        autoStartOnOpen: boolean;
        autoStartOnPass: boolean;
    };
    scoring: {
        correct: number;
        bonus: number;
        penalty: number;
    };
    theme: {
        mode: 'light' | 'dark' | 'auto';
        colorScheme: 'purple' | 'blue' | 'green' | 'red' | 'orange' | 'pink';
    };
    sounds: {
        masterEnabled: boolean;
        click: boolean;
        select: boolean;
        reveal: boolean;
        back: boolean;
        timerTick: boolean;
        timerEnd: boolean;
        success: boolean;
        error: boolean;
        warning: boolean;
        pass: boolean;
        fullscreen: boolean;
    };
    fonts: {
        gridNumber: string;
        statsTitle: string;
        statsValue: string;
        roundTitle: string;
        questionTitle: string;
        answerTitle: string;
        timerTime: string;
    };
};

export type Question = {
    id: number;
    text: string;
    answer: string;
    mediaType?: 'image' | 'audio'; // New: optional media type
    mediaUrl?: string; // New: fits URL or Base64 string
};

type DataContextType = {
    appConfig: AppConfig;
    allQuestions: Question[];
    updateConfig: (newConfig: Partial<AppConfig>) => void;
    updateQuestion: (updatedQ: Question) => void;
    editQuestion: (oldId: number, newQ: Question) => void;
    addQuestion: (newQ: Omit<Question, 'id'>, specificId?: number) => void;
    deleteQuestion: (id: number) => void;
    resetData: () => void;
    importData: (jsonData: string) => boolean;
    exportData: () => void;
    // Scoresheet additions
    teams: Team[];
    activeTeamId: string | null;
    addTeam: (name: string) => void;
    deleteTeam: (id: string) => void;
    updateScore: (teamId: string, delta: number) => void;
    setActiveTeam: (id: string | null) => void;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

const STORAGE_KEY_CONFIG = 'quiz_master_config_v1';
const STORAGE_KEY_QUESTIONS = 'quiz_master_questions_v1';
const STORAGE_KEY_TEAMS = 'quiz_master_teams_v1';
const STORAGE_KEY_ACTIVE_TEAM = 'quiz_master_active_team_v1';

export function DataProvider({ children }: { children: ReactNode }) {
    // Initialize Config
    const [appConfig, setAppConfig] = useState<AppConfig>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
            const loadedConfig = saved ? (JSON.parse(saved) as unknown as AppConfig) : (defaultConfig as unknown as AppConfig);
            // Sync sounds on initial load
            setSoundPreferences(loadedConfig.sounds);
            // Apply theme on initial load
            applyTheme(loadedConfig.theme);
            return loadedConfig;
        } catch (error) {
            console.error('Failed to load config from storage:', error);
            setSoundPreferences((defaultConfig as unknown as AppConfig).sounds);
            applyTheme((defaultConfig as unknown as AppConfig).theme);
            return defaultConfig as unknown as AppConfig;
        }
    });

    // Initialize Questions
    const [allQuestions, setAllQuestions] = useState<Question[]>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY_QUESTIONS);
            return saved ? JSON.parse(saved) : defaultQuestions;
        } catch (error) {
            console.error('Failed to load questions from storage:', error);
            return defaultQuestions;
        }
    });

    const [teams, setTeams] = useState<Team[]>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY_TEAMS);
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Failed to load teams from storage:', error);
            return [];
        }
    });

    const [activeTeamId, setActiveTeamId] = useState<string | null>(() => {
        try {
            return localStorage.getItem(STORAGE_KEY_ACTIVE_TEAM);
        } catch (error) {
            return null;
        }
    });

    // Persist changes
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(appConfig));
    }, [appConfig]);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY_QUESTIONS, JSON.stringify(allQuestions));
    }, [allQuestions]);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY_TEAMS, JSON.stringify(teams));
    }, [teams]);

    useEffect(() => {
        if (activeTeamId) localStorage.setItem(STORAGE_KEY_ACTIVE_TEAM, activeTeamId);
        else localStorage.removeItem(STORAGE_KEY_ACTIVE_TEAM);
    }, [activeTeamId]);

    const updateConfig = (newConfig: Partial<AppConfig>) => {
        setAppConfig(prev => {
            const updated = { ...prev, ...newConfig };
            // Sync sound preferences whenever config updates
            if (newConfig.sounds) {
                setSoundPreferences(newConfig.sounds);
            }
            // Apply theme whenever config updates
            if (newConfig.theme) {
                applyTheme(newConfig.theme);
            }
            return updated;
        });
    };

    const updateQuestion = (updatedQ: Question) => {
        setAllQuestions(prev => {
            // Check if ID is being changed and if it collides
            if (prev.some(q => q.id === updatedQ.id && q.text !== updatedQ.text && q.answer !== updatedQ.answer)) {
                // Determine if we are just updating the same question (same ID found) or moving to an occupied ID
                // Logic: filter out the *old* version of this question, then check for collision
                // Actually simpler: The UI should handle safe ID selection. 
                // Here we just replace or swap? Let's just map.
                // If the user manually changed ID to one that exists, we have a problem.
                // For now, assume UI provides a unique ID.
                return prev.map(q => q.id === updatedQ.id ? updatedQ : (
                    // If we are changing the ID of a question, we need to find it by its OLD ID? 
                    // The current signature doesn't support changing ID easily because we pass the *new* object.
                    // Let's rely on delete+add for ID changes in UI or simple mapping if ID is stable.
                    // Wait, if we want to change round, we MUST change ID.
                    // Let's simply replace the question with the matching ID.
                    q
                ));
            }
            // If we are updating content, simple map works.
            // If changing ID, we need the OLD id. 
            // Let's change the signature of updateQuestion to handle ID changes if needed, 
            // OR just use a simpler "save" that filters out the old one.
            // BETTER APPROACH: Add specific "editQuestion(oldId, newData)"
            return prev.map(q => q.id === updatedQ.id ? updatedQ : q);
        });
    };

    // Enhanced Add: Allow specific ID
    const addQuestion = (newQ: Omit<Question, 'id'>, specificId?: number) => {
        setAllQuestions(prev => {
            let nextId = specificId;
            if (!nextId) {
                nextId = prev.length > 0 ? Math.max(...prev.map(q => q.id)) + 1 : 1;
            }
            // Ensure uniqueness if specificId passed
            if (prev.some(q => q.id === nextId)) {
                // If taken, find next available after that point
                while (prev.some(q => q.id === nextId)) {
                    nextId = (nextId as number) + 1;
                }
            }
            return [...prev, { ...newQ, id: nextId as number }].sort((a, b) => a.id - b.id);
        });
    };

    const editQuestion = (oldId: number, newQ: Question) => {
        setAllQuestions(prev => {
            // Remove old, add new, resort
            const others = prev.filter(q => q.id !== oldId);
            // Verify if newQ.id collision
            if (others.some(q => q.id === newQ.id)) {
                alert(`ID ${newQ.id} is already taken!`);
                return prev;
            }
            return [...others, newQ].sort((a, b) => a.id - b.id);
        });
    }

    const deleteQuestion = (id: number) => {
        setAllQuestions(prev => prev.filter(q => q.id !== id));
    };

    const resetData = () => {
        if (confirm('Are you sure you want to reset ALL settings and questions to default? This cannot be undone.')) {
            setAppConfig(defaultConfig as unknown as AppConfig);
            setAllQuestions(defaultQuestions);
            localStorage.removeItem(STORAGE_KEY_CONFIG);
            localStorage.removeItem(STORAGE_KEY_QUESTIONS);
            window.location.reload();
        }
    };

    const importData = (jsonData: string): boolean => {
        try {
            const data = JSON.parse(jsonData);
            if (data.config && data.questions) {
                setAppConfig(data.config);
                setAllQuestions(data.questions);
                return true;
            }
            return false;
        } catch (e) {
            console.error("Import failed", e);
            return false;
        }
    };

    const exportData = () => {
        const data = {
            config: appConfig,
            questions: allQuestions,
            version: '1.0.0', // Optional versioning
            timestamp: new Date().toISOString()
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `sajilo_quiz_backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const addTeam = (name: string) => {
        const newTeam: Team = {
            id: Date.now().toString(),
            name,
            score: 0
        };
        setTeams(prev => [...prev, newTeam]);
    };

    const deleteTeam = (id: string) => {
        setTeams(prev => prev.filter(t => t.id !== id));
        if (activeTeamId === id) setActiveTeamId(null);
    };

    const updateScore = (teamId: string, delta: number) => {
        setTeams(prev => prev.map(t => t.id === teamId ? { ...t, score: t.score + delta } : t));
    };

    const setActiveTeam = (id: string | null) => {
        setActiveTeamId(id);
    };

    return (
        <DataContext.Provider value={{
            appConfig,
            allQuestions,
            updateConfig,
            updateQuestion,
            editQuestion,
            addQuestion,
            deleteQuestion,
            resetData,
            importData,
            exportData,
            teams,
            activeTeamId,
            addTeam,
            deleteTeam,
            updateScore,
            setActiveTeam
        }}>
            {children}
        </DataContext.Provider>
    );
};

export function useData() {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
}
