import { useEffect, useState } from "react";
import { WifiOff, RefreshCw, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { site } from "../config/site";

const jokes = [
  "You seem to be off the grid. Literally.",
  "No signal. The quiz will wait for you.",
  "Seems the internet is having a tea break.",
  "Lost connection, but not your marbles.",
];

export default function Offline() {
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const goOnline = () => setOnline(true);
    window.addEventListener("online", goOnline);
    return () => window.removeEventListener("online", goOnline);
  }, []);

  if (online) {
    return null;
  }

  const joke = jokes[Math.floor(Math.random() * jokes.length)];

  return (
    <div className="min-h-screen flex items-center justify-center p-6 text-center text-[rgb(var(--text-primary))]">
      <div className="glass-panel p-8 md:p-14 max-w-md w-full">
        <div className="mx-auto w-16 h-16 rounded-3xl bg-[rgb(var(--warning))]/15 flex items-center justify-center mb-6">
          <WifiOff className="w-8 h-8 text-[rgb(var(--warning))]" />
        </div>
        <h1 className="text-2xl font-bold mb-2">You're offline</h1>
        <p className="text-[rgb(var(--text-secondary))] text-sm mb-4">
          {joke}
        </p>
        <p className="text-[rgb(var(--text-secondary))] text-sm mb-8">
          The good news: {site.name} works fully offline once loaded, so your
          saved questions and rounds are still right here.
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => window.location.reload()}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            <RefreshCw size={18} /> Try again
          </button>
          <Link to="/" className="btn-secondary w-full flex items-center justify-center gap-2">
            <Home size={16} /> Go to Grid
          </Link>
        </div>
      </div>
    </div>
  );
}
