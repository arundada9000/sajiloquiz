// Web Audio API Synthesizer
// Generates pleasant sounds using just code. No external files needed.

const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();

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
};

// Function to update preferences from config
export const setSoundPreferences = (prefs: Partial<typeof soundPreferences>) => {
    soundPreferences = { ...soundPreferences, ...prefs };
};

// Function to get current preferences
export const getSoundPreferences = () => soundPreferences;

const playTone = (freq: number, type: OscillatorType, duration: number, delay = 0) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime + delay);

    gain.gain.setValueAtTime(0.1, audioCtx.currentTime + delay);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + delay + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(audioCtx.currentTime + delay);
    osc.stop(audioCtx.currentTime + delay + duration);
};

// Helper to check if sound should play
const shouldPlay = (soundType: keyof typeof soundPreferences) => {
    return soundPreferences.masterEnabled && soundPreferences[soundType];
};

export const sounds = {
    click: () => {
        if (!shouldPlay('click')) return;
        // Short high blip for hover/interactions
        playTone(800, 'sine', 0.1);
    },
    select: () => {
        if (!shouldPlay('select')) return;
        // Selection sound
        playTone(400, 'sine', 0.15);
        playTone(600, 'sine', 0.15, 0.05);
    },
    reveal: () => {
        if (!shouldPlay('reveal')) return;
        // "Ta-da" chord (C Major)
        playTone(523.25, 'triangle', 0.6); // C5
        playTone(659.25, 'triangle', 0.6, 0.1); // E5
        playTone(783.99, 'triangle', 0.8, 0.2); // G5
    },
    back: () => {
        if (!shouldPlay('back')) return;
        // Navigating back sound (descending)
        playTone(400, 'sine', 0.2);
        playTone(300, 'sine', 0.3, 0.1);
    },
    timerTick: () => {
        if (!shouldPlay('timerTick')) return;
        // Gentle tick
        playTone(1000, 'sine', 0.05);
    },
    timerEnd: () => {
        if (!shouldPlay('timerEnd')) return;
        // Alarm
        playTone(880, 'square', 0.5);
        playTone(880, 'square', 0.5, 0.6);
        playTone(880, 'square', 0.5, 1.2);
    },
    success: () => {
        if (!shouldPlay('success')) return;
        // Happy ascending chime
        playTone(523.25, 'sine', 0.2); // C
        playTone(659.25, 'sine', 0.2, 0.1); // E
        playTone(783.99, 'sine', 0.4, 0.2); // G
    },
    error: () => {
        if (!shouldPlay('error')) return;
        // Dissonant warning
        playTone(200, 'sawtooth', 0.3);
        playTone(180, 'sawtooth', 0.3, 0.15);
    },
    warning: () => {
        if (!shouldPlay('warning')) return;
        // Double beep
        playTone(600, 'sine', 0.15);
        playTone(600, 'sine', 0.15, 0.25);
    },
    pass: () => {
        if (!shouldPlay('pass')) return;
        // Quick swish
        playTone(800, 'sine', 0.1);
        playTone(600, 'sine', 0.1, 0.05);
        playTone(400, 'sine', 0.1, 0.1);
    },
    fullscreen: () => {
        if (!shouldPlay('fullscreen')) return;
        // Expanding/contracting sound
        playTone(400, 'sine', 0.2);
        playTone(600, 'sine', 0.3, 0.1);
    }
};
