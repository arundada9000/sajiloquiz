// Web Audio API Synthesizer
// Generates pleasant sounds using just code. No external files needed.

let audioCtx: AudioContext | null = null;
let isUnlocked = false;

// Lazily create and resume the AudioContext on the first user gesture.
// Browsers block audio until a user interaction has occurred.
function ensureAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) return null;
    audioCtx = new Ctor();
  }
  if (audioCtx.state === "suspended" && !isUnlocked) {
    audioCtx.resume().catch(() => {
      /* ignore resume failure until next gesture */
    });
  }
  return audioCtx;
}

// Unlock once on any user gesture so sounds work everywhere.
if (typeof window !== "undefined") {
  const unlock = () => {
    const ctx = audioCtx;
    if (ctx && ctx.state === "suspended") {
      ctx.resume().catch(() => {});
      isUnlocked = true;
    }
  };
  window.addEventListener("pointerdown", unlock, { once: true });
  window.addEventListener("keydown", unlock, { once: true });
  window.addEventListener("touchstart", unlock, { once: true });
}

// Sound preferences (will be set by config)
let soundPreferences = {
  masterEnabled: true,
  click: true,
  select: true,
  reveal: true,
  back: true,
  timerTick: true,
  timerEnd: true,
  success: true,
  error: true,
  warning: true,
  pass: true,
  fullscreen: true,
  snap: true,
};

export type SoundPreferences = typeof soundPreferences;

// Function to update preferences from config
export const setSoundPreferences = (prefs: Partial<SoundPreferences>) => {
  soundPreferences = { ...soundPreferences, ...prefs };
};

const playTone = (
  freq: number,
  type: OscillatorType,
  duration: number,
  delay = 0,
) => {
  const ctx = ensureAudioContext();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);

  gain.gain.setValueAtTime(0.1, ctx.currentTime + delay);
  gain.gain.exponentialRampToValueAtTime(
    0.001,
    ctx.currentTime + delay + duration,
  );

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(ctx.currentTime + delay);
  osc.stop(ctx.currentTime + delay + duration);
};

// Helper to check if sound should play
const shouldPlay = (soundType: keyof SoundPreferences) => {
  return soundPreferences.masterEnabled && soundPreferences[soundType];
};

// Haptic feedback via navigator.vibrate (mobile only). Design fallbacks to
// non-pattern form for browsers that only support a single duration.
function vibrate(pattern: number | number[]) {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch {
      /* haptics unsupported, ignore */
    }
  }
}

export const sounds = {
  click: () => {
    if (!shouldPlay("click")) return;
    vibrate(10);
    playTone(800, "sine", 0.1);
  },
  select: () => {
    if (!shouldPlay("select")) return;
    vibrate(15);
    playTone(400, "sine", 0.15);
    playTone(600, "sine", 0.15, 0.05);
  },
  reveal: () => {
    if (!shouldPlay("reveal")) return;
    vibrate(25);
    playTone(523.25, "triangle", 0.6);
    playTone(659.25, "triangle", 0.6, 0.1);
    playTone(783.99, "triangle", 0.8, 0.2);
  },
  back: () => {
    if (!shouldPlay("back")) return;
    vibrate(10);
    playTone(400, "sine", 0.2);
    playTone(300, "sine", 0.3, 0.1);
  },
  timerTick: () => {
    if (!shouldPlay("timerTick")) return;
    vibrate(5);
    playTone(1000, "sine", 0.05);
  },
  timerEnd: () => {
    if (!shouldPlay("timerEnd")) return;
    vibrate([50, 30, 50]);
    playTone(880, "square", 0.5);
    playTone(880, "square", 0.5, 0.6);
    playTone(880, "square", 0.5, 1.2);
  },
  success: () => {
    if (!shouldPlay("success")) return;
    vibrate(20);
    playTone(523.25, "sine", 0.2);
    playTone(659.25, "sine", 0.2, 0.1);
    playTone(783.99, "sine", 0.4, 0.2);
  },
  error: () => {
    if (!shouldPlay("error")) return;
    vibrate([30, 30, 30]);
    playTone(200, "sawtooth", 0.3);
    playTone(180, "sawtooth", 0.3, 0.15);
  },
  warning: () => {
    if (!shouldPlay("warning")) return;
    vibrate(20);
    playTone(600, "sine", 0.15);
    playTone(600, "sine", 0.15, 0.25);
  },
  pass: () => {
    if (!shouldPlay("pass")) return;
    vibrate(15);
    playTone(800, "sine", 0.1);
    playTone(600, "sine", 0.1, 0.05);
    playTone(400, "sine", 0.1, 0.1);
  },
  fullscreen: () => {
    if (!shouldPlay("fullscreen")) return;
    vibrate(10);
    playTone(400, "sine", 0.2);
    playTone(600, "sine", 0.3, 0.1);
  },
  snap: () => {
    if (!shouldPlay("snap")) return;
    vibrate([30, 20, 60]);
    // A quick two-part "snap": a sharp high click followed by a low thud.
    playTone(1400, "square", 0.06);
    playTone(200, "sine", 0.25, 0.03);
    playTone(90, "sine", 0.5, 0.06);
  },
};
