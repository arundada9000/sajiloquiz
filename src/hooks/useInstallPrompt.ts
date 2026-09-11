import { useCallback, useEffect, useState } from "react";

// Chrome/Edge fire a beforeinstallprompt event when the PWA is installable.
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

export function useInstallPrompt() {
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [appInstalled, setAppInstalled] = useState(false);

  useEffect(() => {
    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setAppInstalled(true);
      setInstallPrompt(null);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const install = useCallback(() => {
    if (!installPrompt) return;
    installPrompt.prompt();
    installPrompt.userChoice.then((choice) => {
      if (choice.outcome === "accepted") {
        setAppInstalled(true);
      }
      setInstallPrompt(null);
    });
  }, [installPrompt]);

  return { canInstall: !!installPrompt, appInstalled, install };
}

// True when running as an installed app (standalone window).
export function useIsStandalone() {
  const [standalone, setStandalone] = useState(false);
  useEffect(() => {
    const update = () =>
      setStandalone(
        window.matchMedia("(display-mode: standalone)").matches ||
          // iOS Safari installed-to-home-screen detection
          (navigator as Navigator & { standalone?: boolean }).standalone ===
            true,
      );
    update();
    window.addEventListener("appinstalled", update);
    window.matchMedia("(display-mode: standalone)").addEventListener("change", update);
    return () => {
      window.removeEventListener("appinstalled", update);
      window.matchMedia("(display-mode: standalone)").removeEventListener("change", update);
    };
  }, []);
  return standalone;
}