import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import { site } from "../config/site";

export default function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen p-6 text-[rgb(var(--text-primary))]">
      <div className="max-w-3xl mx-auto glass-panel p-6 md:p-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-[rgb(var(--color-primary))] hover:underline mb-6"
        >
          <Home size={16} /> Back to Grid
        </Link>
        <h1 className="text-3xl font-black mb-1 title-gradient">{title}</h1>
        <p className="text-sm text-[rgb(var(--text-secondary))] mb-8">
          {site.name} by {site.companyName} &middot; Last updated: {updated}
        </p>
        <div className="space-y-6 text-sm leading-relaxed text-[rgb(var(--text-primary))]">
          {children}
        </div>
      </div>
    </div>
  );
}
