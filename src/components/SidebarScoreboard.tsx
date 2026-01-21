import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, X, Trophy, ChevronLeft } from "lucide-react";
import { useData } from "../context/DataContext";

export default function SidebarScoreboard() {
  const {
    appConfig: config,
    teams,
    activeTeamId,
    setActiveTeam,
    updateScore,
  } = useData();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = useCallback(() => setIsOpen((prev) => !prev), []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key.toLowerCase() === "s" &&
        !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName)
      ) {
        toggleDrawer();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleDrawer]);

  return (
    <>
      {/* Floating Toggle Button (visible when closed) */}
      {!isOpen && (
        <motion.button
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          onClick={toggleDrawer}
          className="fixed right-0 top-1/2 -translate-y-1/2 z-40 bg-[var(--card-bg)] border-l border-y border-[var(--card-border)] p-2 rounded-l-xl shadow-xl hover:bg-purple-500/10 transition-colors group hidden md:flex flex-col items-center gap-2"
        >
          <ChevronLeft
            className="text-[rgb(var(--text-secondary))] group-hover:text-purple-400"
            size={20}
          />
          <div className="[writing-mode:vertical-lr] uppercase tracking-widest text-[10px] font-bold text-[rgb(var(--text-secondary))] group-hover:text-purple-400">
            Scoreboard
          </div>
        </motion.button>
      )}

      {/* Mobile Toggle (bottom left) */}
      <button
        onClick={toggleDrawer}
        className="fixed bottom-6 right-6 z-40 md:hidden w-12 h-12 rounded-full bg-purple-600 text-white shadow-2xl flex items-center justify-center active:scale-95 transition-transform"
      >
        <Trophy size={24} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleDrawer}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[50]"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-[350px] bg-[var(--card-bg)] border-l border-[var(--card-border)] z-[60] shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-[var(--card-border)] flex items-center justify-between bg-black/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
                    <Trophy size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-[rgb(var(--text-primary))]">
                    Leaderboard
                  </h2>
                </div>
                <button
                  onClick={toggleDrawer}
                  className="p-2 hover:bg-white/5 rounded-full transition-colors text-[rgb(var(--text-secondary))]"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Team List */}
              <div
                className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar"
                style={{ maxHeight: "calc(100vh - 180px)" }}
              >
                {teams.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-40">
                    <Users size={40} className="mb-4" />
                    <p className="text-sm font-bold uppercase tracking-widest text-[rgb(var(--text-secondary))]">
                      No Teams Found
                    </p>
                    <p className="text-xs mt-2 text-[rgb(var(--text-secondary))]">
                      Add teams in Admin → Teams
                    </p>
                  </div>
                ) : (
                  teams
                    .sort((a, b) => b.score - a.score)
                    .map((team) => (
                      <motion.div
                        layout
                        key={team.id}
                        onClick={() => setActiveTeam(team.id)}
                        className={`relative group p-4 rounded-xl border transition-all cursor-pointer overflow-hidden ${activeTeamId === team.id
                            ? "bg-purple-500/10 border-purple-500/40 shadow-lg shadow-purple-500/5 ring-1 ring-purple-500/20"
                            : "bg-[var(--card-bg)] border-[var(--card-border)] hover:border-purple-500/30 hover:bg-purple-500/[0.02]"
                          }`}
                      >
                        {/* Selection Indicator */}
                        {activeTeamId === team.id && (
                          <div className="absolute top-0 left-0 w-1 h-full bg-purple-500" />
                        )}

                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2 min-w-0">
                            <h3 className="font-bold text-[rgb(var(--text-primary))] truncate text-sm">
                              {team.name}
                            </h3>
                          </div>
                          <div className="text-xl font-black title-gradient">
                            {team.score}
                          </div>
                        </div>

                        {/* Manual Quick Controls */}
                        <div className="flex items-center gap-1.5 mt-2">
                          <ScoreButton
                            onClick={(e) => {
                              e.stopPropagation();
                              updateScore(team.id, config.scoring.correct);
                            }}
                            label={`+${config.scoring.correct}`}
                            color="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white"
                          />
                          <ScoreButton
                            onClick={(e) => {
                              e.stopPropagation();
                              updateScore(team.id, config.scoring.bonus);
                            }}
                            label={`+${config.scoring.bonus}`}
                            color="bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 hover:bg-blue-500 hover:text-white"
                          />
                          <ScoreButton
                            onClick={(e) => {
                              e.stopPropagation();
                              updateScore(team.id, config.scoring.penalty);
                            }}
                            label={
                              config.scoring.penalty > 0
                                ? `+${config.scoring.penalty}`
                                : config.scoring.penalty.toString()
                            }
                            color="bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white"
                          />
                        </div>
                      </motion.div>
                    ))
                )}
              </div>

              {/* Footer / Stats */}
              <div className="p-6 bg-black/10 border-t border-[var(--card-border)] space-y-4">
                <div className="flex justify-between items-center text-xs text-[rgb(var(--text-secondary))] font-bold uppercase tracking-widest">
                  <span>Total Teams</span>
                  <span>{teams.length}</span>
                </div>
                <div className="text-[10px] text-gray-500 leading-relaxed">
                  Tip: Press{" "}
                  <kbd className="bg-white/5 px-1.5 py-0.5 rounded border border-white/10">
                    S
                  </kbd>{" "}
                  to toggle this scoreboard anywhere. Click a team to set as
                  "Active" for auto-scoring.
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function ScoreButton({
  onClick,
  label,
  color,
}: {
  onClick: (e: any) => void;
  label: string;
  color: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-2 py-1 rounded text-[10px] font-bold hover:brightness-125 transition-all active:scale-90 ${color}`}
    >
      {label}
    </button>
  );
}
