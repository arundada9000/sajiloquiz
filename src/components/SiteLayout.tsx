import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Home,
  Settings,
  BookOpen,
  Layers,
  Mail,
  Github,
  Heart,
  ArrowUpRight,
  ArrowUp,
  Linkedin,
  Youtube,
  Instagram,
  Facebook,
  Twitter,
  Globe,
  Download,
  Sparkles,
  PlayCircle,
} from "lucide-react";
import { site } from "../config/site";
import { useData } from "../context/DataContext";
import { useInstallPrompt } from "../hooks/useInstallPrompt";
import { useDialog } from "../context/DialogContext";
import type { SocialHandle } from "../config/site";

type NavItem = {
  to: string;
  label: string;
  icon: ReactNode;
  end?: boolean;
};

function NavLink({ to, label, icon, end }: NavItem) {
  const { pathname } = useLocation();
  const active = end ? pathname === to : pathname.startsWith(to);
  return (
    <Link
      to={to}
      className={`relative inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-semibold transition-all duration-300 group ${
        active
          ? "bg-[rgb(var(--color-primary))] text-[rgb(var(--label-inverse))] shadow-[0_2px_12px_rgba(var(--color-primary),0.35)]"
          : "text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))] hover:bg-[var(--fill)]"
      }`}
    >
      <span className={`transition-transform duration-300 ${active ? "" : "group-hover:scale-110"}`}>
        {icon}
      </span>
      <span className="hidden sm:inline">{label}</span>
    </Link>
  );
}

/* Footer link with animated underline reveal on hover */
function FooterLink({ to, children, external }: { to: string; children: ReactNode; external?: boolean }) {
  const cls =
    "relative inline-flex items-center gap-1.5 text-sm text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))] transition-colors duration-300 group/link px-2 py-1 rounded-lg -mx-2 hover-tint";
  const inner = (
    <>
      {children}
      <span className="inline-block -translate-x-1 opacity-0 group-hover/link:translate-x-0 group-hover/link:opacity-100 transition-all duration-300">
        <ArrowUpRight size={13} />
      </span>
    </>
  );
  if (external) {
    return (
      <a href={to} target="_blank" rel="noopener noreferrer" className={cls}>
        {inner}
      </a>
    );
  }
  return (
    <Link to={to} className={cls}>
      {inner}
    </Link>
  );
}

/* Footer column with staggered entrance */
const col = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.1 + i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function SiteLayout({ children }: { children: ReactNode }) {
  const { appConfig } = useData();
  const { pathname } = useLocation();
  const { canInstall, appInstalled, install } = useInstallPrompt();
  const dialog = useDialog();

  // Re-open the onboarding tour from the footer (Onboarding.tsx listens for it).
  const openTour = () => {
    window.dispatchEvent(new CustomEvent("sajilo:onboarding"));
  };

  const handleInstallClick = () => {
    if (canInstall) {
      install();
    } else {
      dialog.toast(
        "info",
        "Install Sajilo Quiz",
        appInstalled
          ? "Sajilo Quiz is already installed on this device."
          : "Use your browser menu - Install App / Add to Home Screen.",
      );
    }
  };

  const navItems: NavItem[] = [
    { to: "/", label: "Grid", icon: <Home size={16} />, end: true },
    { to: "/guide", label: "Guide", icon: <BookOpen size={16} /> },
    { to: "/journal", label: "Journal", icon: <Layers size={16} /> },
    { to: "/faq", label: "FAQ", icon: <PlayCircle size={16} /> },
    { to: "/admin", label: "Admin", icon: <Settings size={16} /> },
  ];

  return (
    <div className="min-h-screen flex flex-col text-[rgb(var(--text-primary))]">
      {/* Sticky top navigation */}
      <header className="sticky top-0 z-40 w-full">
        <div className="glass-panel !rounded-none border-x-0 border-t-0 backdrop-blur-xl">
          <div className="mx-auto max-w-7xl px-4 md:px-6 h-14 flex items-center justify-between gap-4">
            <Link
              to="/"
              className="flex items-center gap-2.5 group shrink-0"
              aria-label={`${site.name} home`}
            >
              <img
                src="/icons/logo-192.png"
                alt={site.name}
                className="w-9 h-9 rounded-xl object-contain shadow-[0_2px_8px_rgba(var(--color-primary),0.2)] group-hover:shadow-[0_2px_14px_rgba(var(--color-primary),0.4)] transition-shadow duration-300"
              />
              <span className="font-black text-lg title-gradient tracking-tight whitespace-nowrap">
                {appConfig.appName}
              </span>
            </Link>

            <nav className="flex items-center gap-1" aria-label="Primary">
              {navItems.map((item) => (
                <NavLink key={item.to} {...item} />
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Main content with page transition */}
      <motion.main
        key={pathname}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="flex-1 flex flex-col"
      >
        {children}
      </motion.main>

      {/* Rich footer with staggered entrance */}
      <footer className="relative border-t border-[var(--separator)] bg-[var(--fill)] backdrop-blur-md overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 md:px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <motion.div
            custom={0}
            variants={col}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-40px" }}
            className="space-y-3"
          >
            <div className="flex items-center gap-2.5">
              <img
                src="/icons/logo-192.png"
                alt={site.name}
                className="w-9 h-9 rounded-xl object-contain shadow-sm hover:shadow-[0_2px_14px_rgba(var(--color-primary),0.3)] transition-shadow duration-300"
              />
              <span className="font-black text-lg title-gradient">{site.name}</span>
            </div>
            <p className="text-sm text-[rgb(var(--text-secondary))] leading-relaxed">
              {site.tagline}
            </p>
            <p className="text-xs text-[rgb(var(--text-secondary))] opacity-70">
              {site.companyName} &middot; {site.companyAddress}
            </p>
          </motion.div>

          {/* Explore */}
          <motion.div
            custom={1}
            variants={col}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-40px" }}
            className="space-y-3"
          >
            <h3 className="text-xs uppercase tracking-widest font-bold text-[rgb(var(--color-primary))]">
              Explore
            </h3>
            <ul className="space-y-2.5 text-sm relative">
              <li><FooterLink to="/">Question Grid</FooterLink></li>
              <li><FooterLink to="/guide">User Guide</FooterLink></li>
              <li><FooterLink to="/journal">Journal</FooterLink></li>
              <li><FooterLink to="/faq">FAQ</FooterLink></li>
              <li>
                <button
                  onClick={openTour}
                  className="relative inline-flex items-center gap-1.5 text-sm text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))] transition-colors duration-300 group/link px-2 py-1 rounded-lg -mx-2 hover-tint"
                >
                  <Sparkles size={14} />
                  Quick Tour
                </button>
              </li>
            </ul>
          </motion.div>

          {/* Resources */}
          <motion.div
            custom={2}
            variants={col}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-40px" }}
            className="space-y-3"
          >
            <h3 className="text-xs uppercase tracking-widest font-bold text-[rgb(var(--color-primary))]">
              Resources
            </h3>
            <ul className="space-y-2.5 text-sm relative">
              <li><FooterLink to="/guide#shortcuts">Keyboard Shortcuts</FooterLink></li>
              <li><FooterLink to="/journal/data-format">Question JSON Format</FooterLink></li>
              <li><FooterLink to="/privacy">Privacy Policy</FooterLink></li>
              <li><FooterLink to="/terms">Terms of Use</FooterLink></li>
            </ul>
          </motion.div>

          {/* Connect */}
          <motion.div
            custom={3}
            variants={col}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-40px" }}
            className="space-y-3"
          >
            <h3 className="text-xs uppercase tracking-widest font-bold text-[rgb(var(--color-primary))]">
              Connect
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={site.author.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--color-primary))] transition-all duration-300 group/connect"
                >
                  <Globe size={15} className="transition-transform duration-300 group-hover/connect:-translate-y-0.5 group-hover/connect:scale-110" />
                  <span className="leading-tight">
                    Created by {site.author.name}
                    <ArrowUpRight size={12} className="inline -mt-1 opacity-0 -translate-x-1 group-hover/connect:opacity-100 group-hover/connect:translate-x-0 transition-all duration-300" />
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.author.email}`}
                  className="inline-flex items-center gap-2 text-sm text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--color-primary))] transition-all duration-300 group/connect"
                >
                  <Mail size={15} className="transition-transform duration-300 group-hover/connect:-translate-y-0.5 group-hover/connect:scale-110" />
                  <span className="leading-tight">{site.author.email}</span>
                </a>
              </li>
            </ul>

            {/* Install App button */}
            <div className="pt-1">
              <button
                onClick={handleInstallClick}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                  appInstalled
                    ? "border border-[rgb(var(--success))]/40 bg-[rgb(var(--success))]/10 text-[rgb(var(--success))]"
                    : "bg-[rgb(var(--color-primary))] text-[rgb(var(--label-inverse))] shadow-[0_2px_12px_rgba(var(--color-primary),0.35)] hover:shadow-[0_4px_20px_rgba(var(--color-primary),0.5)] hover:-translate-y-0.5"
                }`}
              >
                {appInstalled ? (
                  <>
                    <Sparkles size={15} /> Installed
                  </>
                ) : (
                  <>
                    <Download size={15} /> Install App
                  </>
                )}
              </button>
            </div>

            {/* All socials */}
            <div className="flex items-center gap-2 pt-1">
              {(Object.keys(site.author.socials) as SocialHandle[]).map((handle) => (
                <a
                  key={handle}
                  href={site.author.socials[handle]}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={handle === "x" ? "X (Twitter)" : handle.charAt(0).toUpperCase() + handle.slice(1)}
                  className="p-2 rounded-lg bg-[var(--card-bg)] border border-[var(--card-border)] text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--color-primary))] hover:border-[rgb(var(--color-primary))]/40 hover:shadow-[0_2px_10px_rgba(var(--color-primary),0.15)] transition-all duration-300"
                >
                  <SocialIcon handle={handle} />
                </a>
              ))}
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-[rgb(var(--text-secondary))]">
                  &copy; {new Date().getFullYear()} {site.author.name}
                </span>
                <Heart size={11} className="text-[rgb(var(--danger))] fill-[rgb(var(--danger))] animate-pulse" />
              </div>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="p-2 rounded-lg bg-[var(--card-bg)] border border-[var(--card-border)] text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--color-primary))] hover:border-[rgb(var(--color-primary))]/40 hover:shadow-[0_2px_10px_rgba(var(--color-primary),0.15)] transition-all duration-300"
                aria-label="Back to top"
              >
                <ArrowUp size={14} />
              </button>
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}

function SocialIcon({ handle }: { handle: SocialHandle }) {
  const cls = "w-[15px] h-[15px] flex items-center justify-center";
  switch (handle) {
    case "github":
      return <Github className={cls} />;
    case "linkedin":
      return <Linkedin className={cls} />;
    case "x":
      return <Twitter className={cls} />;
    case "youtube":
      return <Youtube className={cls} />;
    case "instagram":
      return <Instagram className={cls} />;
    case "facebook":
      return <Facebook className={cls} />;
    default:
      return null;
  }
}