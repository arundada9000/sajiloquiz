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
import { idbGet, idbSet, idbDelete, idbClear } from "../utils/idb";

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
      | "cyan"
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
    snap: boolean;
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

export type QuestionBatch = {
  id: string;
  name: string;
  createdAt: string;
  questions: Question[];
  rounds?: Round[];
  enableRounds?: boolean;
};

type DataContextType = {
  appConfig: AppConfig;
  allQuestions: Question[];
  batches: QuestionBatch[];
  activeBatchId: string | null;
  activeRounds: Round[];
  activeEnableRounds: boolean;
  updateConfig: (newConfig: Partial<AppConfig>) => void;
  editQuestion: (oldId: number, newQ: Question) => void;
  addQuestion: (newQ: Omit<Question, "id">, specificId?: number) => void;
  deleteQuestion: (id: number) => void;
  resetData: () => void;
  resetQuestions: () => boolean;
  resetTeams: () => boolean;
  importData: (jsonData: string) => boolean;
  exportData: () => void;
  createBatch: (name: string) => void;
  renameBatch: (id: string, name: string) => void;
  deleteBatch: (id: string) => void;
  setActiveBatch: (id: string) => void;
  updateBatchRounds: (id: string, rounds: Round[]) => void;
  setBatchEnableRounds: (id: string, enabled: boolean) => void;
  importIntoBatch: (jsonData: string, targetBatchId?: string) => boolean;
  exportBatch: (id: string) => void;
  teams: Team[];
  activeTeamId: string | null;
  addTeam: (name: string) => void;
  renameTeam: (id: string, name: string) => void;
  deleteTeam: (id: string) => void;
  updateScore: (teamId: string, delta: number) => void;
  setActiveTeam: (id: string | null) => void;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

const STORAGE_KEY_CONFIG = "quiz_master_config_v1";
const STORAGE_KEY_QUESTIONS = "quiz_master_questions_v1";
const STORAGE_KEY_TEAMS = "quiz_master_teams_v1";
const STORAGE_KEY_ACTIVE_TEAM = "quiz_master_active_team_v1";
const STORAGE_KEY_BATCHES = "quiz_master_batches_v1";
const STORAGE_KEY_ACTIVE_BATCH = "quiz_master_active_batch_v1";

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

// JSON.parse that throws-safe upp to the caller to validate.
function safeParse(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// Read a legacy localStorage key as parsed JSON (used for one-time migration).
function legacyLocalRead(key: string): unknown {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? null : safeParse(raw);
  } catch {
    return null;
  }
}

// Read a legacy localStorage key as its raw string (active ids were stored
// as plain strings, not JSON, so JSON.parse would corrupt numeric ids).
function legacyLocalRaw(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

// Remove a legacy localStorage key after it has been migrated to IndexedDB.
function removeLegacy(key: string) {
  try {
    localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

function isQuestionBatchArray(value: unknown): value is QuestionBatch[] {
  return (
    Array.isArray(value) &&
    value.every(
      (b) =>
        !!b &&
        typeof b === "object" &&
        typeof (b as QuestionBatch).id === "string" &&
        typeof (b as QuestionBatch).name === "string" &&
        typeof (b as QuestionBatch).createdAt === "string" &&
        Array.isArray((b as QuestionBatch).questions),
    )
  );
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [appConfig, setAppConfig] = useState<AppConfig>(defaultConfig);
  const [flatQuestions, setFlatQuestions] = useState<Question[]>(defaultQuestions);
  const [teams, setTeams] = useState<Team[]>([]);
  const [activeTeamId, setActiveTeamId] = useState<string | null>(null);

  // Batch state
  const [batches, setBatches] = useState<QuestionBatch[]>([]);
  const [activeBatchId, setActiveBatchIdState] = useState<string | null>(null);
  // Gates children until IndexedDB has been read on first launch.
  const [isReady, setIsReady] = useState(false);

  // Load everything from IndexedDB once on mount. If IndexedDB is empty but
  // old localStorage data exists (pre-v3 builds), migrate it over and clear it.
  useEffect(() => {
    let cancelled = false;

    const hydrate = async () => {
      try {
        const entry = async (key: string) => {
          const raw = await idbGet(key);
          return raw === null ? null : safeParse(raw);
        };

        const [configRaw, questionsRaw, teamsRaw, batchesRaw, activeBatchRaw, activeTeamRaw] =
          await Promise.all([
            entry(STORAGE_KEY_CONFIG),
            entry(STORAGE_KEY_QUESTIONS),
            entry(STORAGE_KEY_TEAMS),
            entry(STORAGE_KEY_BATCHES),
            idbGet(STORAGE_KEY_ACTIVE_BATCH),
            idbGet(STORAGE_KEY_ACTIVE_TEAM),
          ]);

        if (cancelled) return;

        // Config (fall back to legacy localStorage, migrate it)
        if (configRaw && isAppConfig(configRaw)) {
          setAppConfig(configRaw);
        } else {
          const legacy = legacyLocalRead(STORAGE_KEY_CONFIG);
          if (legacy !== null && isAppConfig(legacy)) {
            setAppConfig(legacy);
            void idbSet(STORAGE_KEY_CONFIG, JSON.stringify(legacy));
          }
        }
        removeLegacy(STORAGE_KEY_CONFIG);

        // Questions (migrate legacy flat questions too)
        if (questionsRaw !== null && isQuestionArray(questionsRaw)) {
          setFlatQuestions(questionsRaw);
        } else {
          const legacy = legacyLocalRead(STORAGE_KEY_QUESTIONS);
          if (legacy !== null && isQuestionArray(legacy)) {
            setFlatQuestions(legacy);
            void idbSet(STORAGE_KEY_QUESTIONS, JSON.stringify(legacy));
          }
        }
        removeLegacy(STORAGE_KEY_QUESTIONS);

        // Teams
        if (teamsRaw !== null && isTeamArray(teamsRaw)) {
          setTeams(teamsRaw);
        } else {
          const legacy = legacyLocalRead(STORAGE_KEY_TEAMS);
          if (legacy !== null && isTeamArray(legacy)) {
            setTeams(legacy);
            void idbSet(STORAGE_KEY_TEAMS, JSON.stringify(legacy));
          }
        }
        removeLegacy(STORAGE_KEY_TEAMS);

        // Batches
        if (batchesRaw !== null && isQuestionBatchArray(batchesRaw)) {
          setBatches(batchesRaw);
        } else {
          const legacy = legacyLocalRead(STORAGE_KEY_BATCHES);
          if (legacy !== null && isQuestionBatchArray(legacy)) {
            setBatches(legacy);
            void idbSet(STORAGE_KEY_BATCHES, JSON.stringify(legacy));
          }
        }
        removeLegacy(STORAGE_KEY_BATCHES);

        // Active ids (pure strings, stored unquoted)
        if (typeof activeBatchRaw === "string") {
          setActiveBatchIdState(activeBatchRaw);
        } else {
          const legacyActiveBatch = legacyLocalRaw(STORAGE_KEY_ACTIVE_BATCH);
          if (legacyActiveBatch !== null) {
            setActiveBatchIdState(legacyActiveBatch);
            void idbSet(STORAGE_KEY_ACTIVE_BATCH, legacyActiveBatch);
          }
          removeLegacy(STORAGE_KEY_ACTIVE_BATCH);
        }

        if (typeof activeTeamRaw === "string") {
          setActiveTeamId(activeTeamRaw);
        } else {
          const legacyActiveTeam = legacyLocalRaw(STORAGE_KEY_ACTIVE_TEAM);
          if (legacyActiveTeam !== null) {
            setActiveTeamId(legacyActiveTeam);
            void idbSet(STORAGE_KEY_ACTIVE_TEAM, legacyActiveTeam);
          }
          removeLegacy(STORAGE_KEY_ACTIVE_TEAM);
        }
      } catch (error) {
        console.error("Failed to hydrate data from IndexedDB:", error);
      } finally {
        if (!cancelled) setIsReady(true);
      }
    };

    void hydrate();
    return () => {
      cancelled = true;
    };
  }, []);

  // Migration: if batches are empty but flat questions exist, create a default batch
  useEffect(() => {
    if (isReady && batches.length === 0 && flatQuestions.length > 0) {
      const defaultBatch: QuestionBatch = {
        id: Date.now().toString(),
        name: "Default",
        createdAt: new Date().toISOString(),
        questions: [...flatQuestions],
      };
      setBatches([defaultBatch]);
      setActiveBatchIdState(defaultBatch.id);
      void idbSet(STORAGE_KEY_BATCHES, JSON.stringify([defaultBatch]));
      void idbSet(STORAGE_KEY_ACTIVE_BATCH, defaultBatch.id);
    }
  }, [isReady]); // Run once hydration completes

  // Derived: when batches exist, allQuestions reads from the active batch.
  // When no batches exist (legacy), it falls back to the flat question list.
  const allQuestions = useMemo(() => {
    if (batches.length > 0) {
      const active = batches.find((b) => b.id === activeBatchId);
      return active ? active.questions : batches[0]?.questions ?? [];
    }
    return flatQuestions;
  }, [batches, activeBatchId, flatQuestions]);

  // Rounds belong to the active batch. Legacy batches fall back to the global
  // config rounds until the host saves their own per-batch rounds.
  const activeBatch = useMemo(
    () => batches.find((b) => b.id === activeBatchId) ?? batches[0],
    [batches, activeBatchId],
  );
  const activeRounds = useMemo(
    () => (activeBatch?.rounds && activeBatch.rounds.length > 0 ? activeBatch.rounds : appConfig.rounds),
    [activeBatch, appConfig.rounds],
  );
  const activeEnableRounds = useMemo(
    () => (activeBatch?.enableRounds ?? appConfig.enableRounds),
    [activeBatch, appConfig.enableRounds],
  );

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

  // Persist changes to IndexedDB (skip until hydration finishes on first load)
  useEffect(() => {
    if (!isReady) return;
    void idbSet(STORAGE_KEY_CONFIG, JSON.stringify(appConfig));
  }, [appConfig, isReady]);

  useEffect(() => {
    if (!isReady) return;
    void idbSet(STORAGE_KEY_QUESTIONS, JSON.stringify(flatQuestions));
  }, [flatQuestions, isReady]);

  useEffect(() => {
    if (!isReady) return;
    void idbSet(STORAGE_KEY_TEAMS, JSON.stringify(teams));
  }, [teams, isReady]);

  useEffect(() => {
    if (!isReady) return;
    if (activeTeamId) void idbSet(STORAGE_KEY_ACTIVE_TEAM, activeTeamId);
    else void idbDelete(STORAGE_KEY_ACTIVE_TEAM);
  }, [activeTeamId, isReady]);

  useEffect(() => {
    if (!isReady) return;
    void idbSet(STORAGE_KEY_BATCHES, JSON.stringify(batches));
  }, [batches, isReady]);

  useEffect(() => {
    if (!isReady) return;
    if (activeBatchId) void idbSet(STORAGE_KEY_ACTIVE_BATCH, activeBatchId);
    else void idbDelete(STORAGE_KEY_ACTIVE_BATCH);
  }, [activeBatchId, isReady]);

  const updateConfig = (newConfig: Partial<AppConfig>) => {
    setAppConfig((prev) => ({ ...prev, ...newConfig }));
  };

  const addQuestion = (newQ: Omit<Question, "id">, specificId?: number) => {
    const updater = (prev: Question[]) => {
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
    };

    if (batches.length > 0) {
      const batchId = activeBatchId ?? batches[0]?.id;
      if (!batchId) return;
      setBatches((prev) =>
        prev.map((b) =>
          b.id === batchId ? { ...b, questions: updater(b.questions) } : b,
        ),
      );
    } else {
      setFlatQuestions(updater);
    }
  };

  const editQuestion = (oldId: number, newQ: Question) => {
    const updater = (prev: Question[]) => {
      if (prev.some((q) => q.id === newQ.id && q.id !== oldId)) {
        throw new Error(`ID ${newQ.id} is already taken!`);
      }
      const others = prev.filter((q) => q.id !== oldId);
      return [...others, newQ].sort((a, b) => a.id - b.id);
    };

    if (batches.length > 0) {
      const batchId = activeBatchId ?? batches[0]?.id;
      if (!batchId) return;
      setBatches((prev) =>
        prev.map((b) =>
          b.id === batchId ? { ...b, questions: updater(b.questions) } : b,
        ),
      );
    } else {
      setFlatQuestions(updater);
    }
  };

  const deleteQuestion = (id: number) => {
    if (batches.length > 0) {
      const batchId = activeBatchId ?? batches[0]?.id;
      if (!batchId) return;
      setBatches((prev) =>
        prev.map((b) =>
          b.id === batchId
            ? { ...b, questions: b.questions.filter((q) => q.id !== id) }
            : b,
        ),
      );
    } else {
      setFlatQuestions((prev) => prev.filter((q) => q.id !== id));
    }
  };

  const resetData = () => {
    setAppConfig({ ...defaultConfig });
    setFlatQuestions([...defaultQuestions]);
    setBatches([]);
    setActiveBatchIdState(null);
    void idbClear();
    try {
      setSoundPreferences(defaultConfig.sounds);
      applyTheme(defaultConfig.theme);
    } catch (e) {
      console.error("Failed to re-apply theme:", e);
    }
  };

  const importData = (jsonData: string): boolean => {
    try {
      const data = JSON.parse(jsonData) as {
        config?: unknown;
        questions?: unknown;
        batches?: QuestionBatch[];
      };
      if (!data.config || !data.questions) return false;
      if (!isAppConfig(data.config)) return false;
      if (!isQuestionArray(data.questions)) return false;

      setAppConfig(data.config);
      setFlatQuestions(data.questions);

      if (data.batches && isQuestionBatchArray(data.batches)) {
        setBatches(data.batches);
        if (data.batches.length > 0) {
          setActiveBatchIdState(data.batches[0].id);
        }
      }

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
      batches: batches.length > 0 ? batches : undefined,
      version: "2.0.0",
      timestamp: new Date().toISOString(),
    };
    downloadJson(data, `sajilo_quiz_backup_${new Date().toISOString().split("T")[0]}.json`);
  };

  const resetQuestions = (): boolean => {
    setAppConfig((prev) => ({ ...prev, rounds: defaultConfig.rounds, enableRounds: defaultConfig.enableRounds }));
    setFlatQuestions([]);
    setBatches([]);
    setActiveBatchIdState(null);
    const defaultBatch: QuestionBatch = {
      id: Date.now().toString(),
      name: "Default",
      createdAt: new Date().toISOString(),
      questions: [...defaultQuestions],
    };
    setBatches([defaultBatch]);
    setActiveBatchIdState(defaultBatch.id);
    return true;
  };

  const resetTeams = (): boolean => {
    setTeams([]);
    setActiveTeamId(null);
    return true;
  };

  // --- Batch operations ---

  const createBatch = (name: string) => {
    const newBatch: QuestionBatch = {
      id: Date.now().toString(),
      name,
      createdAt: new Date().toISOString(),
      questions: [],
    };
    setBatches((prev) => [...prev, newBatch]);
    setActiveBatchIdState(newBatch.id);
  };

  const renameBatch = (id: string, name: string) => {
    setBatches((prev) =>
      prev.map((b) => (b.id === id ? { ...b, name } : b)),
    );
  };

  const deleteBatch = (id: string) => {
    setBatches((prev) => {
      const next = prev.filter((b) => b.id !== id);
      if (activeBatchId === id) {
        setActiveBatchIdState(next[0]?.id ?? null);
      }
      return next;
    });
  };

  const setActiveBatch = (id: string) => {
    setActiveBatchIdState(id);
  };

  const updateBatchRounds = (id: string, rounds: Round[]) => {
    if (batches.length === 0 || !id) return;
    setBatches((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, rounds, enableRounds: true } : b,
      ),
    );
  };

  const setBatchEnableRounds = (id: string, enabled: boolean) => {
    if (batches.length === 0 || !id) return;
    setBatches((prev) =>
      prev.map((b) => (b.id === id ? { ...b, enableRounds: enabled } : b)),
    );
  };

  const importIntoBatch = (jsonData: string, targetBatchId?: string): boolean => {
    try {
      const data = JSON.parse(jsonData) as {
        questions?: Question[];
        batch?: { name: string; questions: Question[] };
      };

      let questionsToImport: Question[] = [];
      let batchName = "Imported";

      if (data.batch && Array.isArray(data.batch.questions)) {
        questionsToImport = data.batch.questions;
        batchName = data.batch.name || batchName;
      } else if (data.questions && Array.isArray(data.questions)) {
        questionsToImport = data.questions;
      } else {
        return false;
      }

      const batchId = targetBatchId ?? activeBatchId ?? batches[0]?.id;
      if (!batchId) {
        // No batches exist yet, create one
        const newBatch: QuestionBatch = {
          id: Date.now().toString(),
          name: batchName,
          createdAt: new Date().toISOString(),
          questions: questionsToImport,
        };
        setBatches([newBatch]);
        setActiveBatchIdState(newBatch.id);
        return true;
      }

      setBatches((prev) =>
        prev.map((b) => {
          if (b.id !== batchId) return b;
          const existingIds = new Set(b.questions.map((q) => q.id));
          const newQuestions = questionsToImport.filter((q) => !existingIds.has(q.id));
          return { ...b, questions: [...b.questions, ...newQuestions].sort((a, b) => a.id - b.id) };
        }),
      );
      return true;
    } catch (e) {
      console.error("Import into batch failed", e);
      return false;
    }
  };

  const exportBatch = (id: string) => {
    const batch = batches.find((b) => b.id === id);
    if (!batch) return;
    downloadJson(
      { batch: { name: batch.name, questions: batch.questions } },
      `sajilo_quiz_batch_${batch.name.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.json`,
    );
  };

  const addTeam = (name: string) => {
    const newTeam: Team = {
      id: Date.now().toString(),
      name,
      score: 0,
    };
    setTeams((prev) => [...prev, newTeam]);
  };

  const renameTeam = (id: string, name: string) => {
    setTeams((prev) =>
      prev.map((t) => (t.id === id ? { ...t, name } : t)),
    );
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
      batches,
      activeBatchId,
      updateConfig,
      editQuestion,
      addQuestion,
      deleteQuestion,
      resetData,
      resetQuestions,
      resetTeams,
      importData,
      exportData,
      createBatch,
      renameBatch,
      deleteBatch,
      setActiveBatch,
      updateBatchRounds,
      setBatchEnableRounds,
      importIntoBatch,
      exportBatch,
      teams,
      activeTeamId,
      addTeam,
      renameTeam,
      deleteTeam,
      updateScore,
      setActiveTeam,
      activeRounds,
      activeEnableRounds,
    }),
    [
      appConfig,
      allQuestions,
      batches,
      activeBatchId,
      teams,
      activeTeamId,
      updateConfig,
      editQuestion,
      addQuestion,
      deleteQuestion,
      resetData,
      resetQuestions,
      resetTeams,
      importData,
      exportData,
      createBatch,
      renameBatch,
      deleteBatch,
      setActiveBatch,
      updateBatchRounds,
      setBatchEnableRounds,
      importIntoBatch,
      exportBatch,
      addTeam,
      renameTeam,
      deleteTeam,
      updateScore,
      setActiveTeam,
      activeRounds,
      activeEnableRounds,
    ],
  );

  return (
    <DataContext.Provider value={value}>
      {isReady ? children : null}
    </DataContext.Provider>
  );
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
