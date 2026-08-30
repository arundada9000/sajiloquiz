import { Link } from "react-router-dom";
import { Home, Compass, ArrowLeft } from "lucide-react";
import { useData } from "../context/DataContext";

const jokes = [
  "This page took a vacation. We can't blame it.",
  "Even our best quiz masters couldn't find this one.",
  "404: The answer to this page is not in any round.",
  "This question has been revealed as 'does not exist'.",
  "Somewhere out there, a correct answer is hiding. This isn't it.",
  "You found the one question we forgot to add. Nice work.",
];

function pickJoke(seed: number): string {
  return jokes[seed % jokes.length];
}

export default function NotFound() {
  const { appConfig } = useData();

  return (
    <div className="min-h-screen flex items-center justify-center p-6 text-center text-[rgb(var(--text-primary))]">
      <div className="glass-panel p-8 md:p-14 max-w-md w-full">
        <div className="mx-auto w-16 h-16 rounded-3xl bg-[rgb(var(--color-primary))]/15 flex items-center justify-center mb-6">
          <Compass className="w-8 h-8 text-[rgb(var(--color-primary))]" />
        </div>
        <div className="text-6xl font-black mb-2 title-gradient">404</div>
        <h1 className="text-xl font-bold mb-2">Page not found</h1>
        <p className="text-[rgb(var(--text-secondary))] text-sm mb-6">
          {pickJoke(appConfig.appName.length)}
        </p>
        <div className="flex flex-col gap-3">
          <Link to="/" className="btn-primary w-full flex items-center justify-center gap-2">
            <Home size={18} /> {appConfig.appName} Grid
          </Link>
          <Link to="/admin" className="btn-secondary w-full">
            <Compass size={16} /> Open Admin Panel
          </Link>
          <button
            onClick={() => window.history.back()}
            className="text-sm text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))] transition-colors flex items-center justify-center gap-1 mt-1"
          >
            <ArrowLeft size={14} /> Go back
          </button>
        </div>
      </div>
    </div>
  );
}
