import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useRef,
  ReactNode,
} from "react";
import { config as defaultConfig } from "../data/config";
import { questions as defaultQuestions } from "../data/questions";
import { setSoundPreferences } from "../utils/sounds";
import { applyTheme, setupThemeListener } from "../utils/theme";

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
    mode: "light" | "dark" | "auto";
    colorScheme:
      | "purple"
      | "indigo"
      | "blue"
      | "teal"
      | "green"
      | "orange"
      | "red"
      | "pink"
      | "graphite"
      | "custom";
    // Custom tint as RGB triplets, used when colorScheme is "custom".
    customTint?: {
      primary: string;
      secondary: string;
      accent: string;
    };
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
  mediaType?: "image" | "audio";
  mediaUrl?: string;
};

type DataContextType = {
  appConfig: AppConfig;
  allQuestions: Question[];
  updateConfig: (newConfig: Partial<AppConfig>) => void;
  editQuestion: (oldId: number, newQ: Question) => void;
  addQuestion: (newQ: Omit<Question, "id">, specificId?: number) => void;
  deleteQuestion: (id: number) => void;
  resetData: () => void;
  importData: (jsonData: string) => boolean;
  exportData: () => void;
  teams: Team[];
  activeTeamId: string | null;
  addTeam: (name: string) => void;
  deleteTeam: (id: string) => void;
  updateScore: (teamId: string, delta: number) => void;
  setActiveTeam: (id: string | null) => void;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

const STORAGE_KEY_CONFIG = "quiz_master_config_v1";
const STORAGE_KEY_QUESTIONS = "quiz_master_questions_v1";
const STORAGE_KEY_TEAMS = "quiz_master_teams_v1";
const STORAGE_KEY_ACTIVE_TEAM = "quiz_master_active_team_v1";

// Validate that parsed data looks like an AppConfig before trusting it.
function isAppConfig(value: unknown): value is AppConfig {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.appName === "string" &&
    typeof v.companyName === "string" &&
    typeof v.enableRounds === "boolean" &&
    Array.isArray(v.rounds) &&
    !!v.timer &&
    !!v.scoring &&
    !!v.theme &&
    !!v.sounds &&
    !!v.fonts
  );
}

// Validate question array structure.
function isQuestionArray(value: unknown): value is Question[] {
  return (
    Array.isArray(value) &&
    value.every(
      (q) =>
        !!q &&
        typeof q === "object" &&
        typeof (q as Question).id === "number" &&
        typeof (q as Question).text === "string" &&
        typeof (q as Question).answer === "string",
    )
  );
}

// Validate team array structure.
function isTeamArray(value: unknown): value is Team[] {
  return (
    Array.isArray(value) &&
    value.every(
      (t) =>
        !!t &&
        typeof (t as Team).id === "string" &&
        typeof (t as Team).name === "string" &&
        typeof (t as Team).score === "number",
    )
  );
}

function loadConfig(): AppConfig {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
    if (saved) {
      const parsed: unknown = JSON.parse(saved);
      if (isAppConfig(parsed)) return parsed;
    }
  } catch (error) {
    console.error("Failed to load config from storage:", error);
  }
  return defaultConfig;
}

function loadQuestions(): Question[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_QUESTIONS);
    if (saved) {
      const parsed: unknown = JSON.parse(saved);
      if (isQuestionArray(parsed)) return parsed;
    }
  } catch (error) {
    console.error("Failed to load questions from storage:", error);
  }
  return defaultQuestions;
}

function loadTeams(): Team[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_TEAMS);
    if (saved) {
      const parsed: unknown = JSON.parse(saved);
      if (isTeamArray(parsed)) return parsed;
    }
  } catch (error) {
    console.error("Failed to load teams from storage:", error);
  }
  return [];
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [appConfig, setAppConfig] = useState<AppConfig>(loadConfig);
  const [allQuestions, setAllQuestions] = useState<Question[]>(loadQuestions);
  const [teams, setTeams] = useState<Team[]>(loadTeams);
  const [activeTeamId, setActiveTeamId] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_ACTIVE_TEAM);
    } catch {
      return null;
    }
  });

  // Keep a ref so side effects can read the latest config without re-rendering.
  const configRef = useRef(appConfig);
  configRef.current = appConfig;

  // Apply theme and sounds on mount and whenever config changes.
  useEffect(() => {
    applyTheme(appConfig.theme);
    setSoundPreferences(appConfig.sounds);
  }, [appConfig]);

  // Follow the system theme automatically when mode is "auto".
  useEffect(() => {
    const listener = setupThemeListener(appConfig.theme);
    return listener;
  }, [appConfig.theme]);

  // Persist changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(appConfig));
    } catch (error) {
      console.error("Failed to persist config (storage may be full):", error);
    }
  }, [appConfig]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_QUESTIONS, JSON.stringify(allQuestions));
    } catch (error) {
      console.error("Failed to persist questions (storage may be full):", error);
    }
  }, [allQuestions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TEAMS, JSON.stringify(teams));
    } catch (error) {
      console.error("Failed to persist teams (storage may be full):", error);
    }
  }, [teams]);

  useEffect(() => {
    try {
      if (activeTeamId)
        localStorage.setItem(STORAGE_KEY_ACTIVE_TEAM, activeTeamId);
      else localStorage.removeItem(STORAGE_KEY_ACTIVE_TEAM);
    } catch (error) {
      console.error("Failed to persist active team:", error);
    }
  }, [activeTeamId]);

  const updateConfig = (newConfig: Partial<AppConfig>) => {
    setAppConfig((prev) => ({ ...prev, ...newConfig }));
  };

  const addQuestion = (newQ: Omit<Question, "id">, specificId?: number) => {
    setAllQuestions((prev) => {
      let nextId = specificId;
      if (!nextId) {
        nextId = prev.length > 0 ? Math.max(...prev.map((q) => q.id)) + 1 : 1;
      }
      while (prev.some((q) => q.id === nextId)) {
        nextId = (nextId as number) + 1;
      }
      return [...prev, { ...newQ, id: nextId as number }].sort(
        (a, b) => a.id - b.id,
      );
    });
  };

  const editQuestion = (oldId: number, newQ: Question) => {
    // Check for ID collision before mutating state (no side effects in updater).
    if (allQuestions.some((q) => q.id === newQ.id && q.id !== oldId)) {
      throw new Error(`ID ${newQ.id} is already taken!`);
    }
    setAllQuestions((prev) => {
      const others = prev.filter((q) => q.id !== oldId);
      return [...others, newQ].sort((a, b) => a.id - b.id);
    });
  };

  const deleteQuestion = (id: number) => {
    setAllQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const resetData = () => {
    if (
      confirm(
        "Are you sure you want to reset ALL settings and questions to default? This cannot be undone.",
      )
    ) {
      setAppConfig({ ...defaultConfig });
      setAllQuestions([...defaultQuestions]);
      localStorage.removeItem(STORAGE_KEY_CONFIG);
      localStorage.removeItem(STORAGE_KEY_QUESTIONS);
      try {
        setSoundPreferences(defaultConfig.sounds);
        applyTheme(defaultConfig.theme);
      } catch (e) {
        console.error("Failed to re-apply theme:", e);
      }
    }
  };

  const importData = (jsonData: string): boolean => {
    try {
      const data = JSON.parse(jsonData) as {
        config?: unknown;
        questions?: unknown;
      };
      if (!data.config || !data.questions) return false;
      if (!isAppConfig(data.config)) return false;
      if (!isQuestionArray(data.questions)) return false;

      setAppConfig(data.config);
      setAllQuestions(data.questions);
      // Re-apply theme and sounds so imported settings take effect immediately.
      setSoundPreferences(data.config.sounds);
      applyTheme(data.config.theme);
      return true;
    } catch (e) {
      console.error("Import failed", e);
      return false;
    }
  };

  const exportData = () => {
    const data = {
      config: appConfig,
      questions: allQuestions,
      version: "1.0.0",
      timestamp: new Date().toISOString(),
    };
    downloadJson(data, `sajilo_quiz_backup_${new Date().toISOString().split("T")[0]}.json`);
  };

  const addTeam = (name: string) => {
    const newTeam: Team = {
      id: Date.now().toString(),
      name,
      score: 0,
    };
    setTeams((prev) => [...prev, newTeam]);
  };

  const deleteTeam = (id: string) => {
    setTeams((prev) => prev.filter((t) => t.id !== id));
    if (activeTeamId === id) setActiveTeamId(null);
  };

  const updateScore = (teamId: string, delta: number) => {
    setTeams((prev) =>
      prev.map((t) => (t.id === teamId ? { ...t, score: t.score + delta } : t)),
    );
  };

  const setActiveTeam = (id: string | null) => {
    setActiveTeamId(id);
  };

  const value = useMemo<DataContextType>(
    () => ({
      appConfig,
      allQuestions,
      updateConfig,
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
      setActiveTeam,
    }),
    [
      appConfig,
      allQuestions,
      teams,
      activeTeamId,
      updateConfig,
      editQuestion,
      addQuestion,
      deleteQuestion,
      resetData,
      importData,
      exportData,
      addTeam,
      deleteTeam,
      updateScore,
      setActiveTeam,
    ],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}

// Shared JSON download helper (used by context menu and backup).
export function downloadJson(data: unknown, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
