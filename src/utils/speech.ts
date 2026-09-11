// Speech Synthesis helper for reading questions aloud.
// Uses the browser's SpeechSynthesis API - no network, fully offline.

let currentUtterance: SpeechSynthesisUtterance | null = null;

export function isSpeechSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

// Pick the best available English voice, preferring a clear en-US/en-GB voice.
function pickVoice(lang: string): SpeechSynthesisVoice | undefined {
  if (!isSpeechSupported()) return undefined;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return undefined;
  const preferred =
    voices.find((v) => v.lang.toLowerCase() === lang.toLowerCase()) ??
    voices.find((v) => v.lang.toLowerCase().replace("_", "-").startsWith("en")) ??
    voices[0];
  return preferred;
}

export function cancelSpeech(): void {
  if (!isSpeechSupported()) return;
  if (currentUtterance) {
    window.speechSynthesis.cancel();
    currentUtterance = null;
  }
}

export function isSpeaking(): boolean {
  return isSpeechSupported() && window.speechSynthesis.speaking;
}

// Speak text aloud. Returns true if speaking started.
export function speakText(
  text: string,
  options: { lang?: string; rate?: number; onEnd?: () => void } = {},
): boolean {
  const lang = options.lang ?? "en-US";
  if (!isSpeechSupported() || !text.trim()) return false;

  cancelSpeech();
  const utterance = new SpeechSynthesisUtterance(text.trim());
  utterance.lang = lang;
  utterance.rate = options.rate ?? 1;
  const voice = pickVoice(lang);
  if (voice) utterance.voice = voice;

  const finish = () => {
    currentUtterance = null;
    options.onEnd?.();
  };
  utterance.onend = finish;
  utterance.onerror = finish;

  currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
  return true;
}

// Some Chromium builds only load the voice list asynchronously.
if (isSpeechSupported()) {
  window.speechSynthesis.onvoiceschanged = () => {
    // no-op: fetch voices lazily inside pickVoice on each speak
  };
}