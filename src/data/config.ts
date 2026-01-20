export const config = {
  // --- BRANDING ---
  appName: "Sajilo Quiz",
  companyName: "Sajilo Digital",

  // --- ROUNDS CONFIGURATION ---
  // Set to true to group questions into rounds.
  enableRounds: true,

  // Define your rounds here. The range is inclusive [start, end].
  rounds: [
    { title: "Round 1: Rapid Fire", range: [1, 20] },
    { title: "Round 2: General Knowledge", range: [21, 40] },
    { title: "Round 3: Grand Finale", range: [41, 60] },
  ],

  // --- TIMER CONFIGURATION ---
  timer: {
    defaultDuration: 30, // seconds
    passDuration: 15,    // seconds added when "Pass" is clicked

    // Auto-start behavior
    autoStartOnOpen: false,  // Start timer automatically when question opens?
    autoStartOnPass: true,   // Start timer automatically when "Pass" is clicked?
  },

  // --- UI & FONTS CONFIGURATION ---
  // You can use standard CSS units (px, rem, em, %)
  fonts: {
    gridNumber: "1.25rem",   // Size of numbers in the main grid
    statsTitle: "0.75rem",   // Size of "Total/Left" labels
    statsValue: "1.5rem",    // Size of the big stats numbers

    roundTitle: "1.5rem",    // Size of Round Headers on Grid Page

    questionTitle: "3rem",   // Size of the big Question text
    answerTitle: "2rem",     // Size of the Answer text

    timerTime: "3.75rem",    // Size of the big Timer countdown
  }
};
