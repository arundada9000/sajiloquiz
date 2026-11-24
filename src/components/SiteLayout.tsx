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
import { useInstallPrompt, isIosSafari } from "../hooks/useInstallPrompt";
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

function FooterLink({ to, children, external }: { to: string; children: ReactNode; external?: boolean }) {
  const cls =
    "relative inline-flex items-center gap-1.5 text-sm text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))] transition-colors duration-300 group/link px-2 py-1 rounded-lg -mx-2";
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
      <a href={to} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>
    );
  }
  return <Link to={to} className={cls}>{inner}</Link>;
}

const col = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.1 + i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

export default function SiteLayout({ children }: { children: ReactNode }) {
  const { appConfig } = useData();
  const { pathname } = useLocation();
  const { canInstall, appInstalled, install } = useInstallPrompt();
  const dialog = useDialog();

  const openTour = () => {
    window.dispatchEvent(new CustomEvent("sajilo:onboarding"));
  };

  const handleInstallClick = () => {
    if (canInstall) {
      install();
      return;
    }
    if (appInstalled) {
      dialog.toast("info", "Install Sajilo Quiz", "Sajilo Quiz is already installed on this device.");
    } else if (isIosSafari()) {
      dialog.toast("info", "Install Sajilo Quiz", "Tap the Share button in Safari, then choose Add to Home Screen.");
    } else {
      dialog.toast("info", "Install Sajilo Quiz", "Installation is ready on Chrome, Edge or the installed app.");
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
      <header className="sticky top-0 z-40 w-full">
        <div className="glass-panel !rounded-none border-x-0 border-t-0 backdrop-blur-xl">
          <div className="mx-auto max-w-7xl px-4 md:px-6 h-14 flex items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-2.5 group shrink-0" aria-label={`${site.name} home`}>
              <img src="/icons/logo-192.png" alt={site.name} className="w-9 h-9 rounded-xl object-contain" />
              <span className="font-black text-lg title-gradient tracking-tight whitespace-nowrap">{appConfig.appName}</span>
            </Link>
            <nav className="flex items-center gap-1" aria-label="Primary">
              {navItems.map((item) => <NavLink key={item.to} {...item} />)}
            </nav>
          </div>
        </div>
      </header>

      <motion.main
        key={pathname}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        className="flex-1 flex flex-col"
      >
        {children}
      </motion.main>

      <footer className="relative border-t border-[var(--separator)] bg-[var(--fill)] backdrop-blur-md overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 md:px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <motion.div custom={0} variants={col} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-40px" }} className="space-y-3">
            <div className="flex items-center gap-2.5"><img src="/icons/logo-192.png" alt={site.name} className="w-9 h-9 rounded-xl" /><span className="font-black text-lg title-gradient">{site.name}</span></div>
            <p className="text-sm text-[rgb(var(--text-secondary))]">{site.tagline}</p>
          </motion.div>
          <motion.div custom={1} variants={col} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-40px" }} className="space-y-3">
            <h3 className="text-xs uppercase tracking-widest font-bold text-[rgb(var(--color-primary))]">Explore</h3>
            <ul className="space-y-2.5 text-sm"><li><FooterLink to="/">Question Grid</FooterLink></li><li><FooterLink to="/guide">User Guide</FooterLink></li><li><FooterLink to="/journal">Journal</FooterLink></li><li><FooterLink to="/faq">FAQ</FooterLink></li></ul>
          </motion.div>
          <motion.div custom={2} variants={col} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-40px" }} className="space-y-3">
            <h3 className="text-xs uppercase tracking-widest font-bold text-[rgb(var(--color-primary))]">Resources</h3>
            <ul className="space-y-2.5 text-sm"><li><FooterLink to="/privacy">Privacy Policy</FooterLink></li><li><FooterLink to="/terms">Terms of Use</FooterLink></li></ul>
          </motion.div>
          <motion.div custom={3} variants={col} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-40px" }} className="space-y-3">
            <h3 className="text-xs uppercase tracking-widest font-bold text-[rgb(var(--color-primary))]">Connect</h3>
            <a href={`mailto:${site.author.email}`} className="text-sm">{site.author.email}</a>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}

function SocialIcon({ handle }: { handle: SocialHandle }) {
  const cls = "w-[15px] h-[15px] flex items-center justify-center";
  switch (handle) {
    case "github": return <Github className={cls} />;
    case "linkedin": return <Linkedin className={cls} />;
    case "x": return <Twitter className={cls} />;
    case "youtube": return <Youtube className={cls} />;
    case "instagram": return <Instagram className={cls} />;
    case "facebook": return <Facebook className={cls} />;
    default: return null;
  }
}
