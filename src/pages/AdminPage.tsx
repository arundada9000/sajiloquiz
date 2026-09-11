import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  RotateCcw,
  Download,
  Upload,
  Plus,
  Trash2,
  Users,
  Edit2,
  Volume2,
  Moon,
  Sun,
  Monitor,
  Sparkles,
  Github,
  Mail,
  ExternalLink,
  User,
  ListChecks,
  SlidersHorizontal,
  Palette,
  HelpCircle,
  Settings,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useData, Question, AppConfig, Round, QuestionBatch } from "../context/DataContext";
import { config as defaultConfig } from "../data/config";
import { sounds } from "../utils/sounds";
import License from "../components/License";
import { ColorSchemeId } from "../utils/theme";
import { useDialog } from "../context/DialogContext";

export default function AdminPage() {
  const {
    appConfig,
    allQuestions,
    batches,
    activeBatchId,
    updateConfig,
    addQuestion,
    editQuestion,
    deleteQuestion,
    resetData,
    importData,
    exportData,
    createBatch,
    renameBatch,
    deleteBatch,
    setActiveBatch,
    importIntoBatch,
    exportBatch,
    activeRounds,
    activeEnableRounds,
    updateBatchRounds,
    setBatchEnableRounds,
    resetQuestions,
    resetTeams,
  } = useData();
  const dialog = useDialog();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<
    | "general"
    | "appearance"
    | "questions"
    | "theme"
    | "sounds"
    | "data"
    | "teams"
    | "help"
    | "about"
  >(() => {
    const tab = searchParams.get("tab");
    const validTabs: Array<"general" | "appearance" | "questions" | "theme" | "sounds" | "data" | "teams" | "help" | "about"> = [
      "general", "appearance", "questions", "theme", "sounds", "data", "teams", "help", "about",
    ];
    return validTabs.includes(tab as typeof validTabs[number])
      ? (tab as typeof validTabs[number])
      : "questions";
  });

  // --- Local State for Forms ---
  // We bind forms directly to config updates or keep local buffer if validaton needed
  // For simplicity in this v1, we will update directly or use simple local state for questions

  const runSectionReset = (which: ResettableTab) => {
    switch (which) {
      case "general":
        updateConfig({
          appName: defaultConfig.appName,
          companyName: defaultConfig.companyName,
          timer: defaultConfig.timer,
          scoring: defaultConfig.scoring,
        });
        break;
      case "appearance":
        updateConfig({ fonts: defaultConfig.fonts });
        break;
      case "theme":
        updateConfig({ theme: defaultConfig.theme });
        break;
      case "sounds":
        updateConfig({ sounds: defaultConfig.sounds });
        break;
      case "questions":
        resetQuestions();
        break;
      case "teams":
        resetTeams();
        break;
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 text-[rgb(var(--text-primary))] pb-32">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <Link
              to="/"
              className="p-2 hover:bg-[var(--fill)] rounded-full transition-colors text-[rgb(var(--text-primary))] hover:text-[rgb(var(--color-primary))]"
              title="Back to Grid"
            >
              <ArrowLeft />
            </Link>
            <div className="min-w-0">
              <h1 className="text-2xl md:text-3xl font-black title-gradient leading-tight">
                Admin Dashboard
              </h1>
              <p className="text-xs md:text-sm text-[rgb(var(--text-secondary))] truncate">
                Manage questions, rounds, teams and the look of your quiz
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/")}
            className="btn-primary flex items-center gap-2 text-sm px-4 py-2.5 whitespace-nowrap"
          >
            Launch Quiz
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          {/* Sidebar / Mobile Tabs */}
          <div className="w-full md:w-64 shrink-0 overflow-x-auto pb-2 md:pb-0 md:sticky md:top-8 md:self-start">
            <div className="flex md:flex-col gap-2 min-w-max">
              <TabButton
                id="questions"
                label="Questions"
                icon={ListChecks}
                active={activeTab}
                onClick={setActiveTab}
              />
              <TabButton
                id="general"
                label="Settings"
                icon={Settings}
                active={activeTab}
                onClick={setActiveTab}
              />
              <TabButton
                id="appearance"
                label="Appearance"
                icon={SlidersHorizontal}
                active={activeTab}
                onClick={setActiveTab}
              />
              <TabButton
                id="theme"
                label="Theme"
                icon={Palette}
                active={activeTab}
                onClick={setActiveTab}
              />
              <TabButton
                id="sounds"
                label="Sounds"
                icon={Volume2}
                active={activeTab}
                onClick={setActiveTab}
              />
              <TabButton
                id="data"
                label="Backup"
                icon={Download}
                active={activeTab}
                onClick={setActiveTab}
              />
              <TabButton
                id="teams"
                label="Teams"
                icon={Users}
                active={activeTab}
                onClick={setActiveTab}
              />
              <TabButton
                id="help"
                label="Help"
                icon={HelpCircle}
                active={activeTab}
                onClick={setActiveTab}
              />
              <TabButton
                id="about"
                label="About"
                icon={Sparkles}
                active={activeTab}
                onClick={setActiveTab}
              />
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 glass-panel p-4 md:p-8 min-h-[500px]">
            {activeTab !== "data" && activeTab !== "help" && activeTab !== "about" && (
              <SectionResetBar
                tab={activeTab}
                onReset={async (which) => {
                  const title = RESET_TITLES[which];
                  const ok = await dialog.confirm({
                    title: `Reset ${title}`,
                    message: `Reset the ${title.toLowerCase()} settings back to their defaults?`,
                    confirmLabel: "Reset",
                    cancelLabel: "Keep",
                    danger: true,
                  });
                  if (!ok) return;
                  runSectionReset(which);
                }}
              />
            )}
            {activeTab === "general" && (
              <GeneralSettings tabConfig={appConfig} onUpdate={updateConfig} />
            )}
            {activeTab === "appearance" && (
              <AppearanceSettings
                tabConfig={appConfig}
                onUpdate={updateConfig}
              />
            )}
            {activeTab === "theme" && (
              <ThemeSettings tabConfig={appConfig} onUpdate={updateConfig} />
            )}
            {activeTab === "sounds" && (
              <SoundSettings tabConfig={appConfig} onUpdate={updateConfig} />
            )}
            {activeTab === "questions" && (
              <QuestionManager
                questions={allQuestions}
                rounds={activeRounds}
                enableRounds={activeEnableRounds}
                batches={batches}
                activeBatchId={activeBatchId}
                onAdd={addQuestion}
                onEdit={editQuestion}
                onDelete={deleteQuestion}
                onCreateBatch={createBatch}
                onRenameBatch={renameBatch}
                onDeleteBatch={deleteBatch}
                onSetActiveBatch={setActiveBatch}
                onExportBatch={exportBatch}
                onImportIntoBatch={importIntoBatch}
                onUpdateRounds={updateBatchRounds}
                onSetEnableRounds={setBatchEnableRounds}
              />
            )}
            {activeTab === "data" && (
              <DataActions
                onReset={async () => {
                  const ok = await dialog.confirm({
                    title: "Factory Reset",
                    message:
                      "Reset ALL settings, questions, batches and teams to their defaults? This cannot be undone.",
                    confirmLabel: "Reset",
                    cancelLabel: "Keep Data",
                    danger: true,
                  });
                  if (ok) resetData();
                }}
                onImport={importData}
                onExport={exportData}
                config={appConfig}
                questions={allQuestions}
                batches={batches}
              />
            )}
            {activeTab === "teams" && <TeamManagement />}
            {activeTab === "help" && <HelpGuide />}
            {activeTab === "about" && <AboutCompany />}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Sub-Components ---

type TabId =
  | "general"
  | "appearance"
  | "questions"
  | "theme"
  | "sounds"
  | "data"
  | "teams"
  | "help"
  | "about";

type ResettableTab = Exclude<TabId, "data" | "help" | "about">;

const RESET_TITLES: Record<ResettableTab, string> = {
  general: "General Settings",
  appearance: "Appearance",
  questions: "Questions",
  theme: "Theme",
  sounds: "Sounds",
  teams: "Teams",
};

function SectionResetBar({
  tab,
  onReset,
}: {
  tab: ResettableTab;
  onReset: (tab: ResettableTab) => void;
}) {
  return (
    <div className="flex items-center justify-end mb-6 -mt-2">
      <button
        onClick={() => onReset(tab)}
        className="text-xs font-semibold px-3 py-1.5 rounded-full text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--danger))] hover:bg-[rgb(var(--danger))]/10 border border-[var(--card-border)] hover:border-[rgb(var(--danger))]/40 inline-flex items-center gap-1.5 transition-all"
      >
        <RotateCcw size={13} /> Reset {RESET_TITLES[tab]} to defaults
      </button>
    </div>
  );
}

function TabButton({
  id,
  label,
  icon: Icon,
  active,
  onClick,
}: {
  id: TabId;
  label: string;
  icon: LucideIcon;
  active: TabId;
  onClick: (id: TabId) => void;
}) {
  return (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap text-left w-full ${
        active === id
          ? "tint-bg text-[rgb(var(--color-primary))] shadow-sm"
          : "text-[rgb(var(--text-secondary))] hover:bg-[var(--fill)] hover:text-[rgb(var(--text-primary))]"
      }`}
    >
      <Icon size={18} className="shrink-0" />
      <span>{label}</span>
    </button>
  );
}

function GeneralSettings({
  tabConfig,
  onUpdate,
}: {
  tabConfig: AppConfig;
  onUpdate: (c: Partial<AppConfig>) => void;
}) {
  return (
    <div className="space-y-8 animate-fade-in">
      <SectionTitle title="Identity" />
      <div className="grid gap-4">
        <InputGroup
          label="App Name"
          value={tabConfig.appName}
          onChange={(v) => onUpdate({ appName: v })}
        />
        <InputGroup
          label="Company Name"
          value={tabConfig.companyName}
          onChange={(v) => onUpdate({ companyName: v })}
        />
      </div>

      <SectionTitle title="Timer Defaults" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputGroup
          type="number"
          label="Question Timer (seconds)"
          value={tabConfig.timer.defaultDuration}
          onChange={(v) =>
            onUpdate({
              timer: { ...tabConfig.timer, defaultDuration: Number(v) },
            })
          }
        />
        <InputGroup
          type="number"
          label="Pass Duration (seconds)"
          value={tabConfig.timer.passDuration}
          onChange={(v) =>
            onUpdate({ timer: { ...tabConfig.timer, passDuration: Number(v) } })
          }
        />
      </div>
      <div className="rounded-xl overflow-hidden bg-[var(--card-bg)] border border-[var(--card-border)] divide-y divide-[var(--separator)] shadow-sm">
        <Toggle
          label="Auto-start timer when question opens"
          checked={tabConfig.timer.autoStartOnOpen}
          onChange={(c) =>
            onUpdate({ timer: { ...tabConfig.timer, autoStartOnOpen: c } })
          }
        />
        <Toggle
          label="Auto-start timer after passing"
          checked={tabConfig.timer.autoStartOnPass}
          onChange={(c) =>
            onUpdate({ timer: { ...tabConfig.timer, autoStartOnPass: c } })
          }
        />
      </div>

      <SectionTitle title="Scoring Weights" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InputGroup
          type="number"
          label="Correct Answer (+)"
          value={tabConfig.scoring.correct}
          onChange={(v) =>
            onUpdate({
              scoring: { ...tabConfig.scoring, correct: Number(v) },
            })
          }
        />
        <InputGroup
          type="number"
          label="Bonus/Pass Answer (+)"
          value={tabConfig.scoring.bonus}
          onChange={(v) =>
            onUpdate({
              scoring: { ...tabConfig.scoring, bonus: Number(v) },
            })
          }
        />
        <InputGroup
          type="number"
          label="Penalty/Wrong Answer (-)"
          value={tabConfig.scoring.penalty}
          onChange={(v) =>
            onUpdate({
              scoring: { ...tabConfig.scoring, penalty: Number(v) },
            })
          }
        />
      </div>
    </div>
  );
}

function AppearanceSettings({
  tabConfig,
  onUpdate,
}: {
  tabConfig: AppConfig;
  onUpdate: (c: Partial<AppConfig>) => void;
}) {
  const updateFont = (key: keyof AppConfig["fonts"], val: string) => {
    onUpdate({ fonts: { ...tabConfig.fonts, [key]: val } });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <SectionTitle title="Font Sizes (Use px, rem, em)" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputGroup
          label="Main Grid Numbers"
          value={tabConfig.fonts.gridNumber}
          onChange={(v) => updateFont("gridNumber", v)}
        />
        <InputGroup
          label="Round Headers"
          value={tabConfig.fonts.roundTitle}
          onChange={(v) => updateFont("roundTitle", v)}
        />

        <InputGroup
          label="Question Text"
          value={tabConfig.fonts.questionTitle}
          onChange={(v) => updateFont("questionTitle", v)}
        />
        <InputGroup
          label="Answer Text"
          value={tabConfig.fonts.answerTitle}
          onChange={(v) => updateFont("answerTitle", v)}
        />

        <InputGroup
          label="Timer Display"
          value={tabConfig.fonts.timerTime}
          onChange={(v) => updateFont("timerTime", v)}
        />
        <InputGroup
          label="Stats Numbers"
          value={tabConfig.fonts.statsValue}
          onChange={(v) => updateFont("statsValue", v)}
        />
      </div>
    </div>
  );
}

function SoundSettings({
  tabConfig,
  onUpdate,
}: {
  tabConfig: AppConfig;
  onUpdate: (c: Partial<AppConfig>) => void;
}) {
  const updateSound = (key: keyof AppConfig["sounds"], val: boolean) => {
    onUpdate({ sounds: { ...tabConfig.sounds, [key]: val } });
  };

  const toggleAll = (enabled: boolean) => {
    const allSounds = { ...tabConfig.sounds };
    (Object.keys(allSounds) as Array<keyof typeof allSounds>).forEach(
      (key) => {
        allSounds[key] = enabled;
      },
    );
    onUpdate({ sounds: allSounds });
  };

  const soundsList: Array<{
    key: keyof AppConfig["sounds"];
    label: string;
    description: string;
  }> = [
      {
        key: "click",
        label: "Click",
        description: "Hover and interaction sounds",
      },
      { key: "select", label: "Select", description: "Question selection" },
      { key: "reveal", label: "Reveal", description: "Answer reveal chime" },
      { key: "back", label: "Back", description: "Navigation back" },
      { key: "timerEnd", label: "Timer End", description: "Timer alarm" },
      { key: "success", label: "Success", description: "Success actions" },
      { key: "error", label: "Error", description: "Error feedback" },
      { key: "warning", label: "Warning", description: "Warning alerts" },
      { key: "pass", label: "Pass", description: "Pass button" },
      {
        key: "fullscreen",
        label: "Fullscreen",
        description: "Fullscreen toggle",
      },
      {
        key: "snap",
        label: "Snap",
        description: "Snap/dust away visited questions",
      },
    ];

  return (
    <div className="space-y-8 animate-fade-in">
      <SectionTitle title="Sound Effects" />

      {/* Master Toggle */}
      <div className="p-6 rounded-lg bg-gradient-to-br from-[rgb(var(--color-primary))]/15 to-[rgb(var(--color-secondary))]/15 border border-[rgb(var(--color-primary))]/30">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-lg font-bold text-[rgb(var(--text-primary))] flex items-center gap-2">
              <Volume2 size={20} />
              Master Volume
            </h4>
            <p className="text-sm text-[rgb(var(--text-secondary))] mt-1">
              Enable or disable all sound effects globally
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => toggleAll(true)}
              className="px-4 py-2 bg-[rgb(var(--success))]/15 hover:bg-[rgb(var(--success))]/50 text-[rgb(var(--success))] rounded-lg font-bold text-sm transition-colors"
            >
              Enable All
            </button>
            <button
              onClick={() => toggleAll(false)}
              className="px-4 py-2 bg-[rgb(var(--danger))]/15 hover:bg-[rgb(var(--danger))]/50 text-[rgb(var(--danger))] rounded-lg font-bold text-sm transition-colors"
            >
              Disable All
            </button>
          </div>
        </div>
        <div className="rounded-xl overflow-hidden bg-[var(--card-bg)] border border-[var(--card-border)] divide-y divide-[var(--separator)] shadow-sm">
          <Toggle
            label="Master Sound Toggle"
            checked={tabConfig.sounds.masterEnabled}
            onChange={(c) => updateSound("masterEnabled", c)}
          />
        </div>
      </div>

      {/* Individual Sound Controls */}
      <div>
        <h4 className="text-sm uppercase tracking-wider text-[rgb(var(--text-secondary))] font-bold mb-3">
          Individual Sound Controls
        </h4>
        <div className="rounded-xl overflow-hidden bg-[var(--card-bg)] border border-[var(--card-border)] divide-y divide-[var(--separator)] shadow-sm">
          {soundsList.map((sound) => (
            <div
              key={sound.key}
              className="px-4 py-3 flex items-center justify-between gap-3 group transition-colors hover:bg-[var(--fill)]"
            >
              <div className="min-w-0">
                <p className="font-bold text-[rgb(var(--text-primary))] text-sm">{sound.label}</p>
                <p className="text-xs text-[rgb(var(--text-secondary))]">{sound.description}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    // Temporarily enable to preview even if disabled
                    const soundFunc = sounds[sound.key as keyof typeof sounds];
                    if (typeof soundFunc === "function") {
                      soundFunc();
                    }
                  }}
                  className="px-3 py-1.5 bg-[rgb(var(--color-primary))]/20 hover:bg-[rgb(var(--color-primary))]/40 text-[rgb(var(--color-primary))] rounded-lg text-sm font-medium transition-colors md:opacity-0 md:group-hover:opacity-100 flex items-center gap-1"
                  title="Preview Sound"
                >
                  <Volume2 size={14} /> Preview
                </button>
                <Toggle
                  label=""
                  checked={tabConfig.sounds[sound.key]}
                  onChange={(c) => updateSound(sound.key, c)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 rounded bg-[rgb(var(--color-primary))]/10 border border-[rgb(var(--color-primary))]/20 text-sm text-[rgb(var(--color-primary))]">
        <p>
          <strong>Tip:</strong> Sounds are generated using Web Audio API. No
          external files needed! Preview any sound to hear it.
        </p>
      </div>
    </div>
  );
}

function hexToRgb(hex: string): string {
  const value = hex.replace("#", "");
  const full =
    value.length === 3
      ? value
          .split("")
          .map((c) => c + c)
          .join("")
      : value;
  const int = parseInt(full, 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return `${r}, ${g}, ${b}`;
}

function rgbToHex(rgb: string): string {
  const parts = rgb
    .split(",")
    .map((p) => parseInt(p.trim(), 10))
    .filter((n) => !Number.isNaN(n));
  if (parts.length < 3) return "#a855f7";
  const toHex = (n: number) => Math.max(0, Math.min(255, n)).toString(16).padStart(2, "0");
  return `#${toHex(parts[0])}${toHex(parts[1])}${toHex(parts[2])}`;
}

function parseRgb(input: string, fallback: string): string {
  const parts = input
    .replace(/rgb\(|\)/g, "")
    .split(",")
    .map((p) => p.trim());
  const nums = parts
    .filter((p) => p !== "")
    .map((p) => parseInt(p, 10))
    .filter((n) => !Number.isNaN(n));
  if (nums.length >= 3) {
    return `${Math.max(0, Math.min(255, nums[0]))}, ${Math.max(
      0,
      Math.min(255, nums[1]),
    )}, ${Math.max(0, Math.min(255, nums[2]))}`;
  }
  return fallback;
}

function ThemeSettings({
  tabConfig,
  onUpdate,
}: {
  tabConfig: AppConfig;
  onUpdate: (c: Partial<AppConfig>) => void;
}) {
  const colorSchemes: Array<{
    id: ColorSchemeId;
    name: string;
    primary: string;
    secondary: string;
  }> = [
    { id: "purple", name: "Purple", primary: "#af52de", secondary: "#bf5af2" },
    { id: "indigo", name: "Indigo", primary: "#5856d6", secondary: "#5e5ce6" },
    { id: "blue", name: "Blue", primary: "#007aff", secondary: "#0a84ff" },
    { id: "teal", name: "Teal", primary: "#30b0c7", secondary: "#40c8e0" },
    { id: "green", name: "Green", primary: "#34c759", secondary: "#30d158" },
    { id: "orange", name: "Orange", primary: "#ff9500", secondary: "#ff9f0a" },
    { id: "red", name: "Red", primary: "#ff3b30", secondary: "#ff453a" },
    { id: "pink", name: "Pink", primary: "#ff2d55", secondary: "#ff375f" },
    { id: "cyan", name: "Cyan", primary: "#32ade6", secondary: "#64d2ff" },
    { id: "graphite", name: "Slate", primary: "#8e8e93", secondary: "#98989e" },
    { id: "custom", name: "Custom", primary: "#af52de", secondary: "#bf5af2" },
  ];

  // RGB helper for the custom palette preview.
  const customTint = tabConfig.theme.customTint || {
    primary: "168, 85, 247",
    secondary: "147, 51, 234",
    accent: "126, 34, 206",
  };

  const updateCustomColor = (
    field: "primary" | "secondary" | "accent",
    value: string,
  ) => {
    onUpdate({
      theme: {
        ...tabConfig.theme,
        colorScheme: "custom",
        customTint: { ...customTint, [field]: value },
      },
    });
  };

  const modes = [
    {
      id: "dark",
      name: "Dark",
      Icon: Moon,
      description: "Dark background, light text",
    },
    {
      id: "light",
      name: "Light",
      Icon: Sun,
      description: "Light background, dark text",
    },
    {
      id: "auto",
      name: "Auto",
      Icon: Monitor,
      description: "Follow system preference",
    },
  ] as const;

  return (
    <div className="space-y-8 animate-fade-in">
      <SectionTitle title="Theme Customization" />

      {/* Mode Selection */}
      <div>
        <h4 className="text-lg font-bold text-[rgb(var(--text-primary))] mb-4">Display Mode</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {modes.map((mode) => (
            <button
              key={mode.id}
              onClick={() =>
                onUpdate({ theme: { ...tabConfig.theme, mode: mode.id } })
              }
              className={`p-6 rounded-2xl border-2 transition-all ${tabConfig.theme.mode === mode.id
                ? "border-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary))]/15"
                : "border-[var(--card-border)] bg-[var(--card-bg)] hover:border-[rgb(var(--color-primary))]/40 hover:bg-[var(--fill)]"
                }`}
            >
              <mode.Icon className="w-12 h-12 mb-3 mx-auto text-[rgb(var(--color-primary))]" />
              <div className="font-bold text-[rgb(var(--text-primary))] mb-1">{mode.name}</div>
              <div className="text-sm text-[rgb(var(--text-secondary))]">{mode.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Color Scheme Selection */}
      <div>
        <h4 className="text-lg font-bold text-[rgb(var(--text-primary))] mb-4">Color Scheme</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {colorSchemes.map((scheme) => (
            <button
              key={scheme.id}
              onClick={() =>
                onUpdate({
                  theme: { ...tabConfig.theme, colorScheme: scheme.id },
                })
              }
              className={`p-6 rounded-2xl border-2 transition-all relative overflow-hidden ${tabConfig.theme.colorScheme === scheme.id
                ? "border-[rgb(var(--color-primary))] bg-[var(--card-bg)]"
                : "border-[var(--card-border)] bg-[var(--card-bg)] hover:border-[rgb(var(--color-primary))]/50 hover:bg-[var(--fill)]"
                }`}
            >
              <div className="flex gap-2 mb-3">
                <div
                  className="w-12 h-12 rounded-xl shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${scheme.primary}, ${scheme.secondary})`,
                  }}
                />
                <div className="flex flex-col gap-1 flex-1">
                  <div
                    className="h-5 rounded"
                    style={{ backgroundColor: scheme.primary }}
                  />
                  <div
                    className="h-5 rounded"
                    style={{ backgroundColor: scheme.secondary }}
                  />
                </div>
              </div>
              <div className="font-bold text-[rgb(var(--text-primary))] text-left">
                {scheme.name}
              </div>

              {tabConfig.theme.colorScheme === scheme.id && (
                <div className="absolute top-2 right-2 w-3 h-3 bg-[rgb(var(--success))] rounded-full border-2 border-white" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Palette Editor */}
      {tabConfig.theme.colorScheme === "custom" && (
        <div className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)]">
          <h4 className="text-base font-bold text-[rgb(var(--text-primary))] mb-4">
            Custom Palette
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(
              [
                ["primary", "Primary"],
                ["secondary", "Secondary"],
                ["accent", "Accent"],
              ] as const
            ).map(([field, label]) => (
              <div key={field} className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-wider text-[rgb(var(--text-secondary))] font-bold">
                  {label}
                </label>
                <input
                  type="color"
                  value={rgbToHex(customTint[field])}
                  onChange={(e) =>
                    updateCustomColor(field, hexToRgb(e.target.value))
                  }
                  className="w-full h-12 rounded-xl border border-[var(--card-border)] bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  value={`rgb(${customTint[field]})`}
                  onChange={(e) => updateCustomColor(field, parseRgb(e.target.value, customTint[field]))}
                  className="ios-input px-3 py-2 text-xs font-mono"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Live Preview Note */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-[rgb(var(--color-primary))]/15 to-[rgb(var(--color-secondary))]/15 border border-[rgb(var(--color-primary))]/30 text-sm text-[rgb(var(--text-primary))]">
        <p className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[rgb(var(--color-primary))]" />
          <strong>Live Preview:</strong> Changes apply instantly! Look around
          the app to see your theme in action.
        </p>
      </div>

      {/* Current Settings Summary */}
      <div className="p-4 rounded bg-[var(--card-bg)] border border-[var(--card-border)] shadow-sm">
        <h5 className="font-bold text-[rgb(var(--text-primary))] mb-2">
          Current Theme
        </h5>
        <div className="flex flex-wrap gap-3 text-sm">
          <div className="px-3 py-1 rounded-full bg-[var(--fill)] text-[rgb(var(--text-secondary))]">
            Mode:{" "}
            <span className="font-bold text-[rgb(var(--text-primary))]">
              {tabConfig.theme.mode}
            </span>
          </div>
          <div className="px-3 py-1 rounded-full bg-[var(--fill)] text-[rgb(var(--text-secondary))]">
            Scheme:{" "}
            <span className="font-bold text-[rgb(var(--text-primary))] capitalize">
              {tabConfig.theme.colorScheme}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuestionManager({
  questions,
  rounds,
  enableRounds,
  batches,
  activeBatchId,
  onAdd,
  onEdit,
  onDelete,
  onCreateBatch,
  onRenameBatch,
  onDeleteBatch,
  onSetActiveBatch,
  onExportBatch,
  onImportIntoBatch,
  onUpdateRounds,
  onSetEnableRounds,
}: {
  questions: Question[];
  rounds: Round[];
  enableRounds: boolean;
  batches: QuestionBatch[];
  activeBatchId: string | null;
  onAdd: (newQ: Omit<Question, "id">, specificId?: number) => void;
  onEdit: (oldId: number, newQ: Question) => void;
  onDelete: (id: number) => void;
  onCreateBatch: (name: string) => void;
  onRenameBatch: (id: string, name: string) => void;
  onDeleteBatch: (id: string) => void;
  onSetActiveBatch: (id: string) => void;
  onExportBatch: (id: string) => void;
  onImportIntoBatch: (jsonData: string, targetBatchId?: string) => boolean;
  onUpdateRounds: (id: string, rounds: Round[]) => void;
  onSetEnableRounds: (id: string, enabled: boolean) => void;
}) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Batch state
  const [newBatchName, setNewBatchName] = useState("");
  const [editingBatchId, setEditingBatchId] = useState<string | null>(null);
  const [editingBatchName, setEditingBatchName] = useState("");
  const [importTargetId, setImportTargetId] = useState<string | null>(null);
  const importInputRef = useRef<HTMLInputElement>(null);
  const dialog = useDialog();

  // Helper to find Round index for an ID
  const getRoundIdxForId = (id: number) => {
    if (!enableRounds) return -1;
    return rounds.findIndex((r) => id >= r.range[0] && id <= r.range[1]);
  };

  // Helper to find Round for an ID
  const getRoundForId = (id: number) => {
    if (!enableRounds) return null;
    return rounds.find((r) => id >= r.range[0] && id <= r.range[1]);
  };

  // Helper to get next available ID in a round
  const getNextIdInRound = (roundIdx: number) => {
    if (roundIdx === -1) return undefined;
    const round = rounds[roundIdx];
    if (!round) return undefined;

    let candidate = round.range[0];
    while (
      questions.some((q) => q.id === candidate) &&
      candidate <= round.range[1]
    ) {
      candidate++;
    }
    return candidate > round.range[1] ? undefined : candidate; // Return undefined if full
  };

  const handleRoundUpdate = (
    idx: number,
    field: keyof Round,
    value: string | [number, number],
  ) => {
    if (!activeBatchId) return;
    const next = [...rounds];
    if (field === "range") {
      next[idx] = { ...next[idx], range: value as [number, number] };
    } else {
      next[idx] = { ...next[idx], [field]: value as string };
    }
    onUpdateRounds(activeBatchId, next);
  };

  const addRound = () => {
    if (!activeBatchId) return;
    const lastRound = rounds[rounds.length - 1];
    const newStart = lastRound ? lastRound.range[1] + 1 : 1;
    const newRound: Round = {
      title: `Round ${rounds.length + 1}`,
      range: [newStart, newStart + 10],
    };
    onUpdateRounds(activeBatchId, [...rounds, newRound]);
  };

  const deleteRound = async (idx: number) => {
    if (!activeBatchId) return;
    const ok = await dialog.confirm({
      title: "Delete Round",
      message:
        "Delete this round? Questions in this range will remain but won't belong to a round.",
      confirmLabel: "Delete",
      cancelLabel: "Cancel",
      danger: true,
    });
    if (!ok) return;
    onUpdateRounds(activeBatchId, rounds.filter((_, i) => i !== idx));
  };

  const startEdit = (q: Question) => {
    setEditingId(q.id);
  };

  const saveEdit = (data: {
    id?: number;
    text: string;
    answer: string;
    mediaType?: "image" | "audio";
    mediaUrl?: string;
  }) => {
    if (data.id === undefined || !data.text || !data.answer) return;
    try {
      onEdit(data.id, {
        id: data.id,
        text: data.text,
        answer: data.answer,
        mediaType: data.mediaType,
        mediaUrl: data.mediaUrl,
      });
      setEditingId(null);
    } catch (err) {
      dialog.toast(
        "error",
        "Could not save question",
        err instanceof Error ? err.message : "An unexpected error occurred.",
      );
    }
  };

  const handleAdd = (form: {
    text: string;
    answer: string;
    mediaType?: "image" | "audio";
    mediaUrl?: string;
    roundIdx: number;
  }) => {
    if (!form.text || !form.answer) return;
    let specificId: number | undefined = undefined;
    if (enableRounds && form.roundIdx !== -1) {
      specificId = getNextIdInRound(form.roundIdx);
      if (!specificId) {
        dialog.toast(
          "warning",
          "That round is full",
          "Adjust the round range or pick another round.",
        );
        return;
      }
    }

    onAdd(
      {
        text: form.text,
        answer: form.answer,
        mediaType: form.mediaType,
        mediaUrl: form.mediaUrl,
      },
      specificId,
    );
    setIsAdding(false);
    setTimeout(() => window.scrollTo(0, document.body.scrollHeight), 100);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Batch Management */}
      <div className="p-4 md:p-5 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] shadow-sm">
        <div className="mb-3">
          <h4 className="text-sm font-bold text-[rgb(var(--text-primary))] uppercase tracking-wider flex items-center gap-2">
            <ListChecks size={16} className="text-[rgb(var(--color-primary))]" /> Question Batches
          </h4>
          <p className="text-xs text-[rgb(var(--text-secondary))] mt-1">
            Keep several question sets ready. The grid shows the active batch only.
          </p>
        </div>

        {/* Batch selector and controls */}
        <div className="flex flex-wrap gap-2 mb-3">
          {batches.map((batch) => (
            <div
              key={batch.id}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-sm transition-all ${
                activeBatchId === batch.id
                  ? "tint-bg border-[rgb(var(--color-primary))]/40 text-[rgb(var(--color-primary))] font-bold"
                  : "bg-[var(--card-bg)] border-[var(--card-border)] text-[rgb(var(--text-secondary))] hover:border-[rgb(var(--color-primary))]/30"
              }`}
            >
              {editingBatchId === batch.id ? (
                <input
                  type="text"
                  value={editingBatchName}
                  onChange={(e) => setEditingBatchName(e.target.value)}
                  onBlur={() => {
                    if (editingBatchName.trim()) {
                      onRenameBatch(batch.id, editingBatchName.trim());
                    }
                    setEditingBatchId(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      if (editingBatchName.trim()) {
                        onRenameBatch(batch.id, editingBatchName.trim());
                      }
                      setEditingBatchId(null);
                    }
                    if (e.key === "Escape") setEditingBatchId(null);
                  }}
                  className="bg-transparent border-b border-[rgb(var(--color-primary))] outline-none text-sm w-24"
                  autoFocus
                />
              ) : (
                <button
                  onClick={() => onSetActiveBatch(batch.id)}
                  onDoubleClick={() => {
                    setEditingBatchId(batch.id);
                    setEditingBatchName(batch.name);
                  }}
                  className="cursor-pointer"
                >
                  {batch.name}
                  <span className="ml-1 opacity-50">({batch.questions.length})</span>
                </button>
              )}
              <button
                onClick={() => onExportBatch(batch.id)}
                className="p-0.5 hover:bg-[var(--fill)] rounded text-[rgb(var(--text-secondary))]"
                title="Export batch"
              >
                <Download size={12} />
              </button>
              <button
                onClick={() => {
                  setImportTargetId(batch.id);
                  importInputRef.current?.click();
                }}
                className="p-0.5 hover:bg-[var(--fill)] rounded text-[rgb(var(--text-secondary))]"
                title="Import questions into this batch"
              >
                <Upload size={12} />
              </button>
              {batches.length > 1 && (
                <button
                  onClick={async () => {
                    const ok = await dialog.confirm({
                      title: "Delete Batch",
                      message: `Delete the batch "${batch.name}" and its ${batch.questions.length} questions?`,
                      confirmLabel: "Delete",
                      cancelLabel: "Keep Batch",
                      danger: true,
                    });
                    if (ok) onDeleteBatch(batch.id);
                  }}
                  className="p-0.5 hover:bg-[rgb(var(--danger))]/15 rounded text-[rgb(var(--danger))]"
                  title="Delete batch"
                >
                  <Trash2 size={12} />
                </button>
              )}
            </div>
          ))}

          {/* Create batch */}
          <div className="flex items-center gap-1">
            <input
              type="text"
              placeholder="New batch name..."
              value={newBatchName}
              onChange={(e) => setNewBatchName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && newBatchName.trim()) {
                  onCreateBatch(newBatchName.trim());
                  setNewBatchName("");
                }
              }}
              className="ios-input px-3 py-1.5 text-sm w-36"
            />
            <button
              onClick={() => {
                if (newBatchName.trim()) {
                  onCreateBatch(newBatchName.trim());
                  setNewBatchName("");
                }
              }}
              disabled={!newBatchName.trim()}
              className="px-2 py-1.5 bg-[rgb(var(--color-primary))] text-[rgb(var(--label-inverse))] rounded-lg text-sm font-bold disabled:opacity-40"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        <input
          ref={importInputRef}
          type="file"
          accept=".json"
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (file && importTargetId) {
              const text = await file.text();
              onImportIntoBatch(text, importTargetId);
            }
            setImportTargetId(null);
            e.target.value = "";
          }}
        />
      </div>

      {/* Rounds Configuration (per active batch) */}
      <SectionTitle title="Rounds Configuration" />
      <div className="rounded-xl overflow-hidden bg-[var(--card-bg)] border border-[var(--card-border)] divide-y divide-[var(--separator)] shadow-sm mb-3">
        <Toggle
          label="Enable Round Grouping"
          checked={enableRounds}
          onChange={(c) => activeBatchId && onSetEnableRounds(activeBatchId, c)}
        />
      </div>
      {enableRounds && (
        <button
          onClick={addRound}
          className="mb-4 text-sm px-3 py-1.5 bg-[rgb(var(--success))]/15 text-[rgb(var(--success))] rounded-lg hover:bg-[rgb(var(--success))]/40 flex items-center gap-1 font-bold transition-colors"
        >
          <Plus size={14} /> Add Round
        </button>
      )}

      {enableRounds && (
        <div className="space-y-4 mt-2">
          {rounds.map((round, idx) => (
            <div
              key={idx}
              className="p-4 rounded bg-[var(--card-bg)] border border-[var(--card-border)] flex flex-col gap-4 relative group shadow-sm"
            >
              <div className="flex justify-between items-start">
                <h4 className="text-sm font-bold text-[rgb(var(--text-secondary))]">
                  Round {idx + 1}
                </h4>
                <button
                  onClick={() => deleteRound(idx)}
                  className="p-1 text-[rgb(var(--danger))] hover:bg-[rgb(var(--danger))]/15 rounded md:opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputGroup
                  label="Title"
                  value={round.title}
                  onChange={(v) => handleRoundUpdate(idx, "title", v)}
                />
                <div className="flex gap-2">
                  <div className="flex-1">
                    <InputGroup
                      type="number"
                      label="Start ID"
                      value={round.range[0]}
                      onChange={(v) =>
                        handleRoundUpdate(idx, "range", [
                          Number(v),
                          round.range[1],
                        ])
                      }
                    />
                  </div>
                  <div className="flex-1">
                    <InputGroup
                      type="number"
                      label="End ID"
                      value={round.range[1]}
                      onChange={(v) =>
                        handleRoundUpdate(idx, "range", [
                          round.range[0],
                          Number(v),
                        ])
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Question List Header */}
      <div className="flex justify-between items-center">
        <SectionTitle title={`Questions (${questions.length})`} />
        <button
          onClick={() => setIsAdding(true)}
          className="btn-primary flex gap-2 items-center px-3 py-1.5 text-sm whitespace-nowrap"
        >
          <Plus size={16} /> Add New
        </button>
      </div>

      {isAdding && (
        <QuestionEditorForm
          title="New Question"
          initial={{}}
          initialRoundIdx={-1}
          rounds={rounds}
          enableRounds={enableRounds}
          submitLabel="Save Question"
          accent="success"
          onSubmit={handleAdd}
          onCancel={() => setIsAdding(false)}
        />
      )}

      <div className="space-y-2">
        {questions.map((q) => {
          const round = getRoundForId(q.id);
          return (
            <div
              key={q.id}
              className="p-3 md:p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] hover:border-[rgb(var(--color-primary))]/30 hover:shadow-sm transition-all flex flex-col md:flex-row gap-4 items-start group"
            >
              <div className="flex items-center gap-2 w-full md:w-auto">
                <div className="font-mono text-[rgb(var(--text-secondary))] w-8 shrink-0">
                  #{q.id}
                </div>
                {round && (
                  <div className="md:hidden text-xs px-2 py-0.5 rounded-full bg-[var(--fill)] text-[rgb(var(--text-secondary))]">
                    {round.title}
                  </div>
                )}
              </div>

              {editingId === q.id ? (
                <div className="flex-1 w-full">
                  <QuestionEditorForm
                    title={`Edit Question #${q.id}`}
                    initial={q}
                    initialRoundIdx={getRoundIdxForId(q.id)}
                    rounds={rounds}
                    enableRounds={enableRounds}
                    submitLabel="Save Changes"
                    accent="primary"
                    onSubmit={saveEdit}
                    onCancel={() => setEditingId(null)}
                  />
                </div>
              ) : (
                <>
                  <div className="flex-1 min-w-0 md:border-l md:border-[var(--separator)] md:pl-4">
                    <p className="font-medium text-[rgb(var(--text-primary))] mb-1 break-words">
                      {q.text}
                    </p>
                    <p className="text-xs md:text-sm text-[rgb(var(--text-secondary))] font-mono break-words">
                      Ans: {q.answer}
                    </p>
                    {round && (
                      <div className="hidden md:inline-block mt-2 text-xs px-2 py-0.5 rounded-full bg-[var(--card-bg)] text-[rgb(var(--text-secondary))] border border-[var(--card-border)]">
                        {round.title}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 self-end md:self-start opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => startEdit(q)}
                      className="p-2 hover:bg-[rgb(var(--color-primary))]/15 text-[rgb(var(--color-primary))] rounded"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={async () => {
                        const ok = await dialog.confirm({
                          title: "Delete Question",
                          message: `Delete question ${q.id}? This cannot be undone.`,
                          confirmLabel: "Delete",
                          cancelLabel: "Keep Question",
                          danger: true,
                        });
                        if (ok) onDelete(q.id);
                      }}
                      className="p-2 hover:bg-[rgb(var(--danger))]/15 text-[rgb(var(--danger))] rounded-lg"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function QuestionEditorForm({
  title,
  initial,
  initialRoundIdx,
  rounds,
  enableRounds,
  submitLabel,
  accent,
  onSubmit,
  onCancel,
}: {
  title: string;
  initial: Partial<Question>;
  initialRoundIdx: number;
  rounds: Round[];
  enableRounds: boolean;
  submitLabel: string;
  accent: "success" | "primary";
  onSubmit: (data: {
    id?: number;
    text: string;
    answer: string;
    mediaType?: "image" | "audio";
    mediaUrl?: string;
    roundIdx: number;
  }) => void;
  onCancel: () => void;
}) {
  const dialog = useDialog();
  const [form, setForm] = useState({
    text: initial.text ?? "",
    answer: initial.answer ?? "",
    mediaType: (initial.mediaType ?? "") as "" | "image" | "audio",
    mediaUrl: initial.mediaUrl ?? "",
    roundIdx: initialRoundIdx,
  });

  const accentText =
    accent === "success"
      ? "text-[rgb(var(--success))]"
      : "text-[rgb(var(--color-primary))]";
  const accentBorder =
    accent === "success"
      ? "border-[rgb(var(--success))]/30 bg-[rgb(var(--success))]/10"
      : "border-[rgb(var(--color-primary))]/30 bg-[rgb(var(--color-primary))]/10";

  const handleFile = async (file: File) => {
    try {
      if (form.mediaType === "audio") {
        const compressed = await compressAudio(file);
        setForm((p) => ({ ...p, mediaUrl: compressed }));
      } else if (form.mediaType === "image") {
        const compressed = await compressImage(file);
        setForm((p) => ({ ...p, mediaUrl: compressed }));
      }
    } catch (err) {
      dialog.toast("error", "Could not process file", "Please try another file.");
      console.error(err);
    }
  };

  const canSubmit = form.text.trim() !== "" && form.answer.trim() !== "";

  return (
    <div
      className={`p-4 md:p-5 mb-4 rounded-xl border animate-scale-in ${accentBorder}`}
    >
      <h4 className={`font-bold mb-3 flex items-center gap-2 ${accentText}`}>
        <Edit2 size={16} /> {title}
      </h4>
      <div className="space-y-3">
        {enableRounds && (
          <div>
            <label className="block text-xs uppercase font-bold text-[rgb(var(--text-secondary))] mb-1.5">
              Round
            </label>
            <select
              value={form.roundIdx}
              onChange={(e) =>
                setForm((p) => ({ ...p, roundIdx: Number(e.target.value) }))
              }
              className="w-full ios-input px-3 py-2"
            >
              <option value={-1}>Auto-Assign Round / ID</option>
              {rounds.map((r, idx) => (
                <option key={idx} value={idx}>
                  {r.title} ({r.range[0]}-{r.range[1]})
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-xs uppercase font-bold text-[rgb(var(--text-secondary))] mb-1.5">
            Question Text
          </label>
          <textarea
            placeholder="Type the question..."
            className="w-full ios-input px-3 py-2"
            rows={2}
            value={form.text}
            onChange={(e) => setForm((p) => ({ ...p, text: e.target.value }))}
          />
        </div>

        <div>
          <label className="block text-xs uppercase font-bold text-[rgb(var(--text-secondary))] mb-1.5">
            Answer
          </label>
          <input
            type="text"
            placeholder="Type the correct answer..."
            className="w-full ios-input px-3 py-2"
            value={form.answer}
            onChange={(e) => setForm((p) => ({ ...p, answer: e.target.value }))}
          />
        </div>

        {/* Media Inputs */}
        <div className="flex flex-col gap-2 p-3 rounded bg-[var(--fill)] border border-[var(--card-border)]">
          <label className="text-xs uppercase font-bold text-[rgb(var(--text-secondary))]">
            Attachment (Optional)
          </label>
          <div className="flex gap-2">
            <select
              className="ios-input px-2 py-2 text-sm"
              value={form.mediaType}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  mediaType: e.target.value as "" | "image" | "audio",
                  mediaUrl: e.target.value === "" ? "" : p.mediaUrl,
                }))
              }
            >
              <option value="">No Media</option>
              <option value="image">Image</option>
              <option value="audio">Audio</option>
            </select>

            {form.mediaType && (
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  placeholder={
                    form.mediaType === "image"
                      ? "Image URL or Path"
                      : "Audio URL or Path"
                  }
                  className="flex-1 ios-input px-3 py-2 text-sm"
                  value={form.mediaUrl}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, mediaUrl: e.target.value }))
                  }
                />
                <label className="cursor-pointer px-3 py-2 bg-[rgb(var(--color-primary))]/20 hover:bg-[rgb(var(--color-primary))]/40 text-[rgb(var(--color-primary))] rounded text-xs font-bold flex items-center gap-1 whitespace-nowrap">
                  <Upload size={14} /> Upload File
                  <input
                    type="file"
                    className="hidden"
                    accept={
                      form.mediaType === "image" ? "image/*" : "audio/*"
                    }
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) await handleFile(file);
                    }}
                  />
                </label>
              </div>
            )}
          </div>
          {form.mediaUrl && (
            <p className="text-[10px] text-[rgb(var(--text-secondary))] truncate">
              Source: {form.mediaUrl.substring(0, 50)}
              {form.mediaUrl.length > 50 ? "..." : ""}
            </p>
          )}
        </div>

        <div className="flex gap-2 justify-end pt-1">
          <button
            onClick={onCancel}
            className="px-3 py-1.5 text-sm text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))] rounded-lg hover:bg-[var(--fill)] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() =>
              onSubmit({
                id: initial.id,
                ...form,
                mediaType: form.mediaType === "" ? undefined : form.mediaType,
                mediaUrl: form.mediaUrl.trim() === "" ? undefined : form.mediaUrl,
              })
            }
            disabled={!canSubmit}
            className="px-4 py-1.5 bg-[rgb(var(--success))] text-white rounded-lg text-sm font-bold hover:opacity-90 disabled:opacity-40 transition-all"
          >
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function DataActions({
  onReset,
  onImport,
  onExport,
  config,
  questions,
  batches,
}: {
  onReset: () => void;
  onImport: (jsonData: string) => boolean;
  onExport: () => void;
  config: AppConfig;
  questions: Question[];
  batches: QuestionBatch[];
}) {
  const [fileName, setFileName] = useState("sajilo-quiz-data");
  const [showSample, setShowSample] = useState(false);
  const dialog = useDialog();

  const handleDownload = () => {
    const name = fileName.endsWith(".json") ? fileName : `${fileName}.json`;
    const data = {
      config,
      questions,
      ...(batches.length > 0 ? { batches } : {}),
      version: "2.0.0",
      timestamp: new Date().toISOString(),
    };
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", name);
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      if (evt.target?.result && typeof evt.target.result === "string") {
        const success = onImport(evt.target.result);
        if (success) {
          dialog.toast("success", "Data imported", "Your backup was restored successfully.");
        } else {
          dialog.toast(
            "error",
            "Import failed",
            "The file format does not look like a Sajilo Quiz backup.",
          );
        }
      }
    };
    reader.readAsText(file);
  };

  const SAMPLE_JSON = `{
  "config": {
    "appName": "My Quiz",
    "enableRounds": false,
    ...
  },
  "questions": [
    { "id": 1, "text": "What is 2+2?", "answer": "4" }
  ],
  "batches": [
    {
      "id": "1720000000000",
      "name": "Default",
      "createdAt": "2026-01-01T00:00:00.000Z",
      "questions": [],
      "enableRounds": true,
      "rounds": [
        { "title": "Round 1", "range": [1, 10] }
      ]
    }
  ]
}`;

  // Calculate Storage Usage (IndexedDB / browser-quota based)
  const [usage, setUsage] = useState({ used: 0, available: 0 });
  useEffect(() => {
    const calculateUsage = async () => {
      try {
        if (navigator.storage?.estimate) {
          const estimate = await navigator.storage.estimate();
          const used = estimate.usage ?? 0;
          const quota = estimate.quota ?? 0;
          setUsage({ used, available: quota });
        } else {
          setUsage({ used: 0, available: 0 });
        }
      } catch {
        setUsage({ used: 0, available: 0 });
      }
    };
    calculateUsage();
    const interval = setInterval(calculateUsage, 3000);
    return () => clearInterval(interval);
  }, []); // Re-run when data changes

  return (
    <div className="space-y-8 animate-fade-in">
      <SectionTitle title="Backup & Restore" />

      {/* Storage Indicator */}
      <div className="p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] shadow-sm">
        <div className="flex justify-between text-xs mb-2 text-[rgb(var(--text-secondary))] font-bold">
          <span className="uppercase tracking-wider">Browser Storage Used</span>
          <span>
            {usage.available > 0
              ? `${(usage.used / 1024 / 1024).toFixed(2)} MB used / ${(usage.available / 1024 / 1024).toFixed(0)} MB available`
              : (usage.used / 1024 / 1024).toFixed(2) + " MB used"}
          </span>
        </div>
        <div className="w-full bg-[var(--fill)] h-3 rounded-full overflow-hidden border border-[var(--card-border)]">
          <div
            className={`h-full transition-all duration-500 ${usage.available > 0 && usage.used / usage.available > 0.9 ? "bg-[rgb(var(--danger))]" : usage.available > 0 && usage.used / usage.available > 0.7 ? "bg-[rgb(var(--warning))]" : "bg-[rgb(var(--success))]"}`}
            style={{
              width: `${
                usage.available > 0
                  ? Math.min((usage.used / usage.available) * 100, 100)
                  : 0
              }%`,
            }}
          />
        </div>
        <p className="text-[10px] text-[rgb(var(--text-secondary))] mt-2">
          Data is saved in your browser's private IndexedDB storage. For large
          media, please put files in the <code>/public</code> folder and use
          relative paths.
        </p>
      </div>

      <div className="p-4 md:p-5 rounded-xl bg-[rgb(var(--color-primary))]/10 border border-[rgb(var(--color-primary))]/20">
        <h4 className="font-bold text-[rgb(var(--color-primary))] mb-4 flex items-center gap-2">
          <Download size={18} /> Export Data
        </h4>
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <InputGroup
              label="Filename"
              value={fileName}
              onChange={setFileName}
            />
          </div>
          <button
            onClick={onExport}
            className="w-full md:w-auto px-6 py-2.5 bg-[rgb(var(--success))] text-white hover:bg-[rgb(var(--success))] rounded font-bold transition-colors flex items-center justify-center gap-2"
          >
            <Download size={18} /> One-Click Backup
          </button>
          <button
            onClick={handleDownload}
            className="w-full md:w-auto px-6 py-2.5 bg-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-secondary))] text-[rgb(var(--label-inverse))] rounded font-bold transition-colors"
          >
            Download JSON
          </button>
        </div>
      </div>

      <div className="p-4 md:p-5 rounded-xl bg-[rgb(var(--color-primary))]/10 border border-[rgb(var(--color-primary))]/20">
        <h4 className="font-bold text-[rgb(var(--color-primary))] mb-4 flex items-center gap-2">
          <Upload size={18} /> Import Data
        </h4>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <label className="cursor-pointer px-4 py-2 bg-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-secondary))] text-[rgb(var(--label-inverse))] rounded font-bold text-sm transition-colors inline-flex items-center gap-2">
              <Upload size={16} /> Choose File
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            <button
              onClick={() => setShowSample(!showSample)}
              className="text-sm text-[rgb(var(--color-primary))] hover:text-[rgb(var(--text-primary))] underline"
            >
              {showSample ? "Hide Sample" : "Show Sample Format"}
            </button>
          </div>

          {showSample && (
            <div className="mt-2 p-3 bg-[var(--fill)] rounded border border-[var(--card-border)] text-xs font-mono text-[rgb(var(--text-secondary))] overflow-x-auto">
              <pre>{SAMPLE_JSON}</pre>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 rounded-xl bg-[rgb(var(--warning))]/10 border border-[rgb(var(--danger))]/20">
        <button
          onClick={onReset}
          className="w-full md:w-auto px-4 py-2 bg-[rgb(var(--danger))]/15 hover:bg-[rgb(var(--danger))]/40 text-[rgb(var(--danger))] rounded flex items-center justify-center gap-2 transition-colors"
        >
          <RotateCcw size={18} /> Factory Reset (Clear All Changes)
        </button>
      </div>
    </div>
  );
}

function HelpGuide() {
  return (
    <div className="space-y-8 animate-fade-in text-[rgb(var(--text-secondary))]">
      <SectionTitle title="Keyboard Shortcuts" />
      <p className="text-sm text-[rgb(var(--text-secondary))] mb-4">
        Press{" "}
        <kbd className="px-2 py-1 bg-[var(--card-bg)] rounded border border-[var(--card-border)] font-mono text-xs text-[rgb(var(--text-primary))]">
          ?
        </kbd>{" "}
        anywhere in the app to see all shortcuts
      </p>

      <div className="space-y-6">
        <div>
          <h4 className="text-sm uppercase tracking-wider text-[rgb(var(--color-primary))] font-bold mb-3">
            Global
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <ShortcutItem keyBind="F" action="Toggle Fullscreen" />
            <ShortcutItem keyBind="?" action="Show/Hide Shortcuts" />
          </div>
        </div>

        <div>
          <h4 className="text-sm uppercase tracking-wider text-[rgb(var(--color-primary))] font-bold mb-3">
            Grid Page
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <ShortcutItem
              keyBind="Alt + Click"
              action="Re-open Visited Question"
            />
            <ShortcutItem
              keyBind="Right-click"
              action="Per-question menu (mark/unmark, snap)"
            />
            <ShortcutItem keyBind="R" action="Random Unvisited Question" />
            <ShortcutItem keyBind="X" action="Snap Away Visited Questions" />
          </div>
        </div>

        <div>
          <h4 className="text-sm uppercase tracking-wider text-[rgb(var(--color-primary))] font-bold mb-3">
            Question Page
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <ShortcutItem keyBind="Space" action="Reveal / Hide Answer" />
            <ShortcutItem keyBind="Esc" action="Back to Grid / Close Modal" />
            <ShortcutItem keyBind="Q" action="Quick Peek Overview" />
            <ShortcutItem keyBind="T" action="Start / Pause Timer" />
            <ShortcutItem keyBind="R" action="Reset Timer" />
            <ShortcutItem keyBind="M" action="Mark / Unmark Question" />
            <ShortcutItem keyBind="Read" action="Speak Question Aloud" />
            <ShortcutItem keyBind="] or +" action="Increase Text Size" />
            <ShortcutItem keyBind="[ or -" action="Decrease Text Size" />
            <ShortcutItem keyBind="0" action="Reset Text Size" />
          </div>
        </div>
      </div>

      <SectionTitle title="Quick Tips" />
      <ul className="space-y-2 list-disc pl-5">
        <li>
          <strong className="text-[rgb(var(--text-primary))]">Theme:</strong>{" "}
          Customize your app's look in the Theme tab. Choose from 11 color
          schemes and light/dark modes.
        </li>
        <li>
          <strong className="text-[rgb(var(--text-primary))]">Sounds:</strong>{" "}
          Control all sound effects in the Sounds tab. Each sound can be toggled
          individually.
        </li>
        <li>
          <strong className="text-[rgb(var(--text-primary))]">Rounds:</strong>{" "}
          You can add logic for Rounds in the Settings tab. Assign questions to
          rounds to auto-generate IDs.
        </li>
        <li>
          <strong className="text-[rgb(var(--text-primary))]">Media:</strong>{" "}
          Images and Audio are auto-compressed. For large videos, use external
          links or the public folder.
        </li>
        <li>
          <strong className="text-[rgb(var(--text-primary))]">Install:</strong>{" "}
          Click 'Install App' on the main screen to install this quiz as a
          native application.
        </li>
        <li>
          <strong className="text-[rgb(var(--text-primary))]">
            Exporting:
          </strong>{" "}
          Always export your data ("Backup") before clearing browsing data or
          switching devices.
        </li>
        <li>
          <strong className="text-[rgb(var(--text-primary))]">Offline:</strong>{" "}
          This app works offline! You can disconnect from the internet after
          loading it.
        </li>
      </ul>
    </div>
  );
}

function AboutCompany() {
  return (
    <div className="space-y-8">
      {/* Brand */}
      <div className="text-center space-y-3">
        <img
          src="/company.png"
          alt="Sajilo Digital Logo"
          className="w-20 h-20 object-contain rounded-2xl p-2 bg-[var(--fill)] border border-[var(--card-border)] mx-auto"
        />
        <h2 className="text-3xl font-extrabold title-gradient italic tracking-tight">
          Sajilo Digital
        </h2>
        <p className="text-[rgb(var(--color-primary))] font-medium tracking-[0.2em] uppercase text-xs">
          Your Vision, Our Innovation
        </p>
        <p className="max-w-xl mx-auto text-[rgb(var(--text-secondary))] italic text-sm leading-relaxed">
          We build technologies that last forever. Sajilo Quiz is crafted with
          care for every host, in every corner of Nepal, and works fully
          offline with privacy at its core.
        </p>
      </div>

      {/* Maker credit */}
      <div className="p-6 rounded-xl glass-panel flex flex-col md:flex-row items-center gap-5">
        <div className="p-3 rounded-full bg-[rgb(var(--color-primary))]/20 border border-[rgb(var(--color-primary))]/30 shrink-0">
          <User size={28} className="text-[rgb(var(--color-primary))]" />
        </div>
        <div className="text-center md:text-left">
          <h3 className="text-xl font-bold text-[rgb(var(--text-primary))]">
            Arun Neupane
          </h3>
          <p className="text-[rgb(var(--color-primary))] font-bold uppercase tracking-wider text-[10px] mt-0.5 mb-2">
            Chief Technology Officer &amp; Lead Designer
          </p>
          <p className="text-[rgb(var(--text-secondary))] text-sm max-w-xl leading-relaxed">
            The architect behind Sajilo Quiz, blending aesthetic excellence with
            a high-performance, privacy-first app that runs entirely on-device.
          </p>
        </div>
      </div>

      {/* Contact */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <a
          href="https://sajilodigital.com.np"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2.5 rounded-xl bg-[rgb(var(--color-primary))]/10 border border-[rgb(var(--color-primary))]/30 hover:bg-[rgb(var(--color-primary))]/20 text-[rgb(var(--text-primary))] text-sm font-semibold inline-flex items-center gap-2 transition-all"
        >
          Visit Website
          <ExternalLink size={15} />
        </a>
        <a
          href="mailto:info@sajilodigital.com.np?subject=SajiloQuiz"
          className="px-4 py-2.5 rounded-xl bg-[var(--fill)] border border-[var(--card-border)] hover:border-[rgb(var(--color-primary))]/40 text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))] text-sm inline-flex items-center gap-2 transition-all"
        >
          <Mail size={15} />
          info@sajilodigital.com.np
        </a>
        <a
          href="https://github.com/sajhilodigital"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2.5 rounded-xl bg-[var(--fill)] border border-[var(--card-border)] hover:border-[rgb(var(--color-primary))]/40 text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))] transition-all inline-flex"
          aria-label="Sajilo Digital on GitHub"
        >
          <Github size={15} />
        </a>
      </div>

      {/* Legal */}
      <div className="pt-6 border-t border-[var(--separator)] text-center space-y-4">
        <div className="flex items-center justify-center gap-6 text-sm">
          <Link
            to="/privacy"
            className="text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--color-primary))] underline-offset-4 hover:underline transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            to="/terms"
            className="text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--color-primary))] underline-offset-4 hover:underline transition-colors"
          >
            Terms of Use
          </Link>
          <Link
            to="/"
            className="text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--color-primary))] underline-offset-4 hover:underline transition-colors"
          >
            Question Grid
          </Link>
        </div>
        <License />
      </div>
    </div>
  );
}

function ShortcutItem({
  keyBind,
  action,
}: {
  keyBind: string;
  action: string;
}) {
  return (
    <div className="flex items-center justify-between p-3 rounded bg-[var(--fill)] border border-[var(--card-border)]">
      <span className="font-mono text-[rgb(var(--color-primary))] bg-[var(--fill)] px-2 py-1 rounded text-sm">
        {keyBind}
      </span>
      <span className="text-sm font-medium">{action}</span>
    </div>
  );
}

// --- Generic UI Helpers ---

function SectionTitle({ title }: { title: string }) {
  return (
    <h3 className="text-lg font-bold text-[rgb(var(--text-primary))] mb-5 border-b border-[var(--separator)] pb-2.5">
      {title}
    </h3>
  );
}

function InputGroup({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs uppercase tracking-wider text-[rgb(var(--text-secondary))] font-bold">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="ios-input px-3 py-2"
      />
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (c: boolean) => void;
}) {
  return (
    <label
      className={`flex items-center gap-3 cursor-pointer select-none transition-colors ${
        label ? "px-4 py-3 justify-between hover:bg-[var(--fill)]" : ""
      }`}
    >
      {label && (
        <span className="text-sm text-[rgb(var(--text-primary))]">{label}</span>
      )}
      <span className="relative inline-flex shrink-0">
        <input
          type="checkbox"
          role="switch"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="ios-switch"
          aria-label={label || undefined}
        />
      </span>
    </label>
  );
}

// --- Helpers ---

const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        // Compress to JPEG at 0.7 quality
        const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

const compressAudio = async (file: File): Promise<string> => {
  // 1. Read File
  const arrayBuffer = await file.arrayBuffer();

  // 2. Decode Audio
  const audioCtx = new (
    window.AudioContext || (window as any).webkitAudioContext
  )();
  const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

  // 3. Offline Render to Mono @ 16kHz
  const TARGET_RATE = 16000;
  const offlineCtx = new OfflineAudioContext(
    1,
    audioBuffer.duration * TARGET_RATE,
    TARGET_RATE,
  );
  const source = offlineCtx.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(offlineCtx.destination);
  source.start();

  const renderedBuffer = await offlineCtx.startRendering();

  // 4. Encode to WAV
  const wavBlob = bufferToWav(renderedBuffer);

  // 5. Convert to Base64
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(wavBlob);
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
};

// Simple WAV Encoder
function bufferToWav(buffer: AudioBuffer) {
  const numOfChan = buffer.numberOfChannels;
  const length = buffer.length * numOfChan * 2 + 44;
  const outBuffer = new ArrayBuffer(length);
  const view = new DataView(outBuffer);
  const channels = [];
  let i;
  let sample;
  let offset = 0;
  let pos = 0;

  // write RIFF chunk descriptor
  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + buffer.length * numOfChan * 2, true);
  writeString(view, 8, "WAVE");

  // write fmt sub-chunk
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numOfChan, true);
  view.setUint32(24, buffer.sampleRate, true);
  view.setUint32(28, buffer.sampleRate * 2 * numOfChan, true);
  view.setUint16(32, numOfChan * 2, true);
  view.setUint16(34, 16, true);

  // write data sub-chunk
  writeString(view, 36, "data");
  view.setUint32(40, buffer.length * numOfChan * 2, true);

  // write interleaved data
  for (i = 0; i < buffer.numberOfChannels; i++)
    channels.push(buffer.getChannelData(i));

  offset = 44;
  while (pos < buffer.length) {
    for (i = 0; i < numOfChan; i++) {
      sample = Math.max(-1, Math.min(1, channels[i][pos]));
      sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0;
      view.setInt16(offset, sample, true);
      offset += 2;
    }
    pos++;
  }

  return new Blob([outBuffer], { type: "audio/wav" });

  function writeString(view: DataView, offset: number, string: string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }
}

function TeamManagement() {
  const { teams, addTeam, renameTeam, deleteTeam } = useData();
  const dialog = useDialog();
  const [newTeamName, setNewTeamName] = useState("");

  const handleAdd = () => {
    if (newTeamName.trim()) {
      addTeam(newTeamName.trim());
      setNewTeamName("");
    }
  };

  const handleRename = async (id: string, current: string) => {
    const name = await dialog.prompt({
      title: "Rename Team",
      label: "Team Name",
      initial: current,
      placeholder: "Enter team name...",
      confirmLabel: "Save",
      cancelLabel: "Cancel",
    });
    if (name && name.trim() && name.trim() !== current) {
      renameTeam(id, name.trim());
    }
  };

  const handleDelete = async (id: string, name: string) => {
    const ok = await dialog.confirm({
      title: "Delete Team",
      message: `Remove "${name}" from the scoreboard? This cannot be undone.`,
      confirmLabel: "Delete",
      cancelLabel: "Cancel",
      danger: true,
    });
    if (ok) deleteTeam(id);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <SectionTitle title="Manage Teams" />

      <div className="p-6 rounded-xl bg-[rgb(var(--color-primary))]/10 border border-[rgb(var(--color-primary))]/20">
        <h4 className="font-bold text-[rgb(var(--color-primary))] mb-4 flex items-center gap-2">
          <Users size={18} /> Add New Team
        </h4>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Enter team name..."
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              className="w-full ios-input px-4 py-2.5"
            />
          </div>
          <button
            onClick={handleAdd}
            disabled={!newTeamName.trim()}
            className="w-full sm:w-auto px-6 py-2.5 bg-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-secondary))] text-[rgb(var(--label-inverse))] disabled:opacity-50 disabled:cursor-not-allowed rounded font-bold transition-all flex items-center justify-center gap-2"
          >
            <Plus size={18} /> Add
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {teams.length === 0 ? (
          <div className="col-span-full py-12 text-center text-[rgb(var(--text-secondary))] opacity-50">
            No teams added yet. Add your first team above.
          </div>
        ) : (
          teams.map((team) => (
            <div
              key={team.id}
              className="p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] flex items-center justify-between group hover:border-[rgb(var(--color-primary))]/30 transition-all"
            >
              <div className="flex-1 min-w-0">
                <button
                  onClick={() => handleRename(team.id, team.name)}
                  className="w-full text-left group flex items-center gap-2 font-bold text-[rgb(var(--text-primary))] truncate"
                  title="Rename team"
                >
                  <span className="truncate">{team.name}</span>
                  <Edit2 size={14} className="opacity-0 group-hover:opacity-60 transition-opacity shrink-0 text-[rgb(var(--text-secondary))]" />
                </button>
                <p className="text-sm text-[rgb(var(--color-primary))] font-black tracking-wider mt-1">Score: {team.score}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleRename(team.id, team.name)}
                  className="p-2 text-[rgb(var(--text-secondary))] hover:bg-[rgb(var(--color-primary))]/10 hover:text-[rgb(var(--color-primary))] rounded-lg transition-colors"
                  title="Rename Team"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(team.id, team.name)}
                  className="p-2 text-[rgb(var(--danger))] hover:bg-[rgb(var(--danger))]/10 rounded-lg transition-colors"
                  title="Remove Team"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
