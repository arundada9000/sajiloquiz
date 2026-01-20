// Web Audio API Synthesizer
// Generates pleasant sounds using just code. No external files needed.

const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();

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

export const sounds = {
    click: () => {
        // Short high blip for hover/interactions
        playTone(800, 'sine', 0.1);
    },
    select: () => {
        // Selection sound
        playTone(400, 'sine', 0.15);
        playTone(600, 'sine', 0.15, 0.05);
    },
    reveal: () => {
        // "Ta-da" chord (C Major)
        playTone(523.25, 'triangle', 0.6); // C5
        playTone(659.25, 'triangle', 0.6, 0.1); // E5
        playTone(783.99, 'triangle', 0.8, 0.2); // G5
    },
    back: () => {
        // Navigating back sound (descending)
        playTone(400, 'sine', 0.2);
        playTone(300, 'sine', 0.3, 0.1);
    },
    timerTick: () => {
        // Gentle tick
        playTone(1000, 'sine', 0.05);
    },
    timerEnd: () => {
        // Alarm
        playTone(880, 'square', 0.5);
        playTone(880, 'square', 0.5, 0.6);
        playTone(880, 'square', 0.5, 1.2);
    }
};
