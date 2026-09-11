import { useCallback, useEffect, useReducer } from "react";

// Chrome/Edge fire a beforeinstallprompt event when the PWA is installable
// (HTTPS or localhost, manifest present, and a service worker with a fetch
// handler is active). The event can fire very early - right after the service
// worker claims the page - potentially before React mounts. We therefore
// capture it at module scope and only expose it via a tiny subscription.

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

let capturedPrompt: BeforeInstallPromptEvent | null = null;
let installed = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    capturedPrompt = e as BeforeInstallPromptEvent;
    emit();
  });
  window.addEventListener("appinstalled", () => {
    installed = true;
    capturedPrompt = null;
    emit();
  });
}

// iOS Safari never fires beforeinstallprompt; users install via
// Share > Add to Home Screen. Detect it so the UI can show the right guidance.
export function isIosSafari(): boolean {
  if (typeof navigator === "undefined" || typeof document === "undefined")
    return false;
  const ua = navigator.userAgent.toLowerCase();
  const isIos =
    ua.includes("iphone") ||
    ua.includes("ipad") ||
    ua.includes("ipod") ||
    // iPadOS 13+ reports a Mac UA; only real iPads have touch here.
    (ua.includes("macintosh") && "ontouchend" in document);
  return isIos;
}

export function useInstallPrompt() {
  // Re-render whenever the module-level install state changes.
  const [, forceUpdate] = useReducer((x: number) => x + 1, 0);

  useEffect(() => {
    listeners.add(forceUpdate);
    return () => {
      listeners.delete(forceUpdate);
    };
  }, []);

  const canInstall = capturedPrompt !== null;

  const install = useCallback(() => {
    const prompt = capturedPrompt;
    if (!prompt) return;
    prompt.prompt();
    prompt.userChoice.then((choice) => {
      if (choice.outcome === "accepted") {
        installed = true;
      }
      // Chrome only fires the event once per session; a dismissed prompt will
      // not re-fire until the next page load.
      capturedPrompt = null;
      emit();
    });
  }, []);

  return { canInstall, appInstalled: installed, install };
}

// True when running as an installed app (standalone window).
export function useIsStandalone() {
  const [, forceUpdate] = useReducer((x: number) => x + 1, 0);

  useEffect(() => {
    const update = () => forceUpdate();
    window.addEventListener("appinstalled", update);
    const mql = window.matchMedia("(display-mode: standalone)");
    mql.addEventListener("change", update);
    return () => {
      window.removeEventListener("appinstalled", update);
      mql.removeEventListener("change", update);
    };
  }, []);

  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true;

  return isStandalone;
}