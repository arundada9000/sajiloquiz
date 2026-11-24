import React, { useState, useEffect, useRef } from 'react';
import {
    Home, Settings, Palette, Volume2, Download, RefreshCw,
    Maximize, Keyboard, Eye, Copy, Shuffle, Moon, Sun, Monitor,
    ChevronRight, CheckCircle2, Layout, MoreHorizontal,
    BookOpen, Layers, Bookmark, Undo2, Sparkles
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useData, downloadJson } from '../context/DataContext';
import { useQuiz } from '../context/QuizContext';
import { sounds } from '../utils/sounds';
import { motion, AnimatePresence } from 'framer-motion';

type MenuItem = {
    label?: string;
    icon?: React.ReactNode;
    action?: () => void;
    submenu?: MenuItem[];
    divider?: boolean;
    disabled?: boolean;
    active?: boolean;
    header?: boolean;
};

// Cell-specific menu: shown when right-clicking a single question card on the grid.
type CellMenuProps = {
    questionId: number;
    isVisited: boolean;
    isMarked: boolean;
    isDusted: boolean;
    onOpen: () => void;
    onToggleVisited: () => void;
    onToggleMark: () => void;
    onSnap: () => void;
    onRestore: () => void;
};

type Props = {
    x: number;
    y: number;
    onClose: () => void;
    pageType?: 'grid' | 'question' | 'general';
    questionText?: string;
    answerText?: string;
    onToggleAnswer?: () => void;
    onQuickPeek?: () => void;
    cell?: CellMenuProps;
};

export default function ContextMenu({
    x, y, onClose, pageType = 'general', questionText, answerText, onToggleAnswer, onQuickPeek, cell
}: Props) {
    const navigate = useNavigate();
    const location = useLocation();
    const { appConfig, updateConfig, allQuestions } = useData();
    const { visitedIds, dustedIds } = useQuiz();
    const menuRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x, y });
    const [submenuSide, setSubmenuSide] = useState<'right' | 'left'>('right');
    const [hoverPath, setHoverPath] = useState<string[]>([]);

    // Adjust position to prevent off-screen rendering
    useEffect(() => {
        if (menuRef.current) {
            const rect = menuRef.current.getBoundingClientRect();
            let newX = x;
            let newY = y;

            if (x + rect.width > window.innerWidth) {
                newX = x - rect.width;
            }
            if (y + rect.height > window.innerHeight) {
                newY = y - rect.height;
            }

            setPosition({ x: newX, y: newY });
            setSubmenuSide(newX + rect.width + 180 > window.innerWidth ? 'left' : 'right');
        }
    }, [x, y]);

    // Close on Esc or click outside
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        const handleClick = () => onClose();

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('click', handleClick);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('click', handleClick);
        };
    }, [onClose]);

    const handleAction = (action?: () => void) => {
        if (action) {
            action();
            sounds.click();
        }
        onClose();
    };

    const colorSchemes: MenuItem[] = [
        { label: 'Purple', icon: <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#af52de' }} />, action: () => updateConfig({ theme: { ...appConfig.theme, colorScheme: 'purple' } }), active: appConfig.theme.colorScheme === 'purple' },
        { label: 'Indigo', icon: <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#5856d6' }} />, action: () => updateConfig({ theme: { ...appConfig.theme, colorScheme: 'indigo' } }), active: appConfig.theme.colorScheme === 'indigo' },
        { label: 'Blue', icon: <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#007aff' }} />, action: () => updateConfig({ theme: { ...appConfig.theme, colorScheme: 'blue' } }), active: appConfig.theme.colorScheme === 'blue' },
        { label: 'Teal', icon: <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#30b0c7' }} />, action: () => updateConfig({ theme: { ...appConfig.theme, colorScheme: 'teal' } }), active: appConfig.theme.colorScheme === 'teal' },
        { label: 'Green', icon: <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#34c759' }} />, action: () => updateConfig({ theme: { ...appConfig.theme, colorScheme: 'green' } }), active: appConfig.theme.colorScheme === 'green' },
        { label: 'Orange', icon: <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ff9500' }} />, action: () => updateConfig({ theme: { ...appConfig.theme, colorScheme: 'orange' } }), active: appConfig.theme.colorScheme === 'orange' },
        { label: 'Red', icon: <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ff3b30' }} />, action: () => updateConfig({ theme: { ...appConfig.theme, colorScheme: 'red' } }), active: appConfig.theme.colorScheme === 'red' },
        { label: 'Pink', icon: <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ff2d55' }} />, action: () => updateConfig({ theme: { ...appConfig.theme, colorScheme: 'pink' } }), active: appConfig.theme.colorScheme === 'pink' },
        { label: 'Cyan', icon: <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#32ade6' }} />, action: () => updateConfig({ theme: { ...appConfig.theme, colorScheme: 'cyan' } }), active: appConfig.theme.colorScheme === 'cyan' },
        { label: 'Slate', icon: <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#8e8e93' }} />, action: () => updateConfig({ theme: { ...appConfig.theme, colorScheme: 'graphite' } }), active: appConfig.theme.colorScheme === 'graphite' },
    ];

    const menuItems: MenuItem[] = [
        ...(cell ? [
            { label: `Question ${cell.questionId}`, header: true },
            {
                label: 'Open Question',
                icon: <Eye size={16} />,
                action: cell.onOpen,
            },
            {
                label: cell.isVisited ? 'Unmark Visited' : 'Mark as Visited',
                icon: <CheckCircle2 size={16} />,
                action: cell.onToggleVisited,
                active: cell.isVisited,
            },
            {
                label: cell.isMarked ? 'Unmark for Review' : 'Mark for Review',
                icon: <Bookmark size={16} />,
                action: cell.onToggleMark,
                active: cell.isMarked,
            },
            cell.isDusted
                ? { label: 'Restore from Dust', icon: <Undo2 size={16} />, action: cell.onRestore }
                : { label: 'Snap This Question', icon: <Sparkles size={16} />, action: cell.onSnap },
            { divider: true },
        ] : []),
        { label: 'Go to Home', icon: <Home size={16} />, action: () => navigate('/'), disabled: location.pathname === '/' },
        { label: 'User Guide', icon: <BookOpen size={16} />, action: () => navigate('/guide'), disabled: location.pathname === '/guide' },
        { label: 'Journal', icon: <Layers size={16} />, action: () => navigate('/journal'), disabled: location.pathname.startsWith('/journal') },
        { label: 'Admin Panel', icon: <Settings size={16} />, action: () => navigate('/admin'), disabled: location.pathname === '/admin' },
        { divider: true },
        {
            label: 'Actions',
            icon: <Layout size={16} />,
            submenu: [
                {
                    label: 'Fullscreen',
                    icon: <Maximize size={14} />,
                    action: () => {
                        if (!document.fullscreenElement) document.documentElement.requestFullscreen();
                        else document.exitFullscreen();
                    }
                },
                {
                    label: 'Shortcuts',
                    icon: <Keyboard size={14} />,
                    action: () => window.dispatchEvent(new KeyboardEvent('keydown', { key: '?' }))
                },
                ...(pageType === 'grid' ? [{
                    label: 'Random Question (unvisited)',
                    icon: <Shuffle size={14} />,
                    action: () => {
                        const unvisited = allQuestions.filter(q => !visitedIds.includes(q.id) && !dustedIds.includes(q.id));
                        if (unvisited.length === 0) return;
                        const randomQ = unvisited[Math.floor(Math.random() * unvisited.length)];
                        navigate(`/question/${randomQ.id}`);
                    }
                }] : []),
                ...(pageType === 'question' ? [{
                    label: 'Quick Peek',
                    icon: <Eye size={14} />,
                    action: onQuickPeek
                }] : [])
            ]
        },
        {
            label: 'Appearance',
            icon: <Palette size={16} />,
            submenu: [
                {
                    label: 'Display Mode',
                    icon: appConfig.theme.mode === 'dark' ? <Moon size={14} /> : appConfig.theme.mode === 'light' ? <Sun size={14} /> : <Monitor size={14} />,
                    submenu: [
                        { label: 'Dark', icon: <Moon size={14} />, action: () => updateConfig({ theme: { ...appConfig.theme, mode: 'dark' } }), active: appConfig.theme.mode === 'dark' },
                        { label: 'Light', icon: <Sun size={14} />, action: () => updateConfig({ theme: { ...appConfig.theme, mode: 'light' } }), active: appConfig.theme.mode === 'light' },
                        { label: 'Auto', icon: <Monitor size={14} />, action: () => updateConfig({ theme: { ...appConfig.theme, mode: 'auto' } }), active: appConfig.theme.mode === 'auto' },
                    ]
                },
                { label: 'Color Scheme', icon: <Palette size={14} />, submenu: colorSchemes }
            ]
        },
        {
            label: 'Sounds',
            icon: <Volume2 size={16} />,
            submenu: [
                {
                    label: appConfig.sounds.masterEnabled ? 'Mute Sounds' : 'Unmute Sounds',
                    icon: <Volume2 size={14} />,
                    action: () => updateConfig({ sounds: { ...appConfig.sounds, masterEnabled: !appConfig.sounds.masterEnabled } })
                },
                { label: 'Sound Settings', icon: <Settings size={14} />, action: () => navigate('/admin?tab=sounds') }
            ]
        },
        ...(pageType === 'question' ? [
            { divider: true },
            {
                label: 'Question',
                icon: <ChevronRight size={16} />,
                submenu: [
                    { label: 'Copy Question', icon: <Copy size={14} />, action: () => { if (questionText) navigator.clipboard.writeText(questionText); }, disabled: !questionText },
                    { label: 'Copy Answer', icon: <Copy size={14} />, action: () => { if (answerText) navigator.clipboard.writeText(answerText); }, disabled: !answerText },
                    { label: 'Toggle Answer', icon: <Eye size={14} />, action: onToggleAnswer }
                ]
            }
        ] : []),
        { divider: true },
        {
            label: 'Advanced',
            icon: <MoreHorizontal size={16} />,
            submenu: [
                {
                    label: 'Backup Data',
                    icon: <Download size={14} />,
                    action: () => {
                        downloadJson(
                          { config: appConfig, questions: allQuestions },
                          `quiz-backup-${new Date().toISOString().split('T')[0]}.json`,
                        );
                    }
                },
                { label: 'Refresh App', icon: <RefreshCw size={14} />, action: () => window.location.reload() }
            ]
        }
    ];

    const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const clearHoverTimeout = () => {
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
            hoverTimeoutRef.current = null;
        }
    };

    const handleMouseEnter = (path: string[]) => {
        clearHoverTimeout();
        setHoverPath(path);
    };

    const handleMouseLeave = (level: number, currentItemPath: string[]) => {
        clearHoverTimeout();
        hoverTimeoutRef.current = setTimeout(() => {
            // Only clear if we're still on the same path or moving out entirely
            setHoverPath(prev => {
                if (prev.length > level && prev[level] === currentItemPath[level]) {
                    return currentItemPath.slice(0, level);
                }
                return prev;
            });
        }, 500); // Generous 500ms exit grace period
    };

    return (
        <AnimatePresence>
            <motion.div
                ref={menuRef}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="fixed z-[300] min-w-[190px] rounded-xl glass-panel border border-[var(--card-border)] shadow-2xl"
                style={{ left: `${position.x}px`, top: `${position.y}px` }}
                onContextMenu={(e) => e.preventDefault()}
                onClick={(e) => e.stopPropagation()}
                onMouseEnter={clearHoverTimeout}
                onMouseLeave={() => {
                    clearHoverTimeout();
                    hoverTimeoutRef.current = setTimeout(() => setHoverPath([]), 500);
                }}
            >
                <RenderItems
                    items={menuItems}
                    hoverPath={hoverPath}
                    submenuSide={submenuSide}
                    onAction={handleAction}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    clearHoverTimeout={clearHoverTimeout}
                />
            </motion.div>
        </AnimatePresence>
    );
}

// Separate component to prevent re-creation/flickering
function RenderItems({
    items,
    level = 0,
    parentPath = [],
    hoverPath,
    submenuSide,
    onAction,
    onMouseEnter,
    onMouseLeave,
    clearHoverTimeout
}: {
    items: MenuItem[],
    level?: number,
    parentPath?: string[],
    hoverPath: string[],
    submenuSide: 'right' | 'left',
    onAction: (action?: () => void) => void,
    onMouseEnter: (path: string[]) => void,
    onMouseLeave: (level: number, path: string[]) => void,
    clearHoverTimeout: () => void
}) {
    return (
        <div className="flex flex-col py-1.5" onMouseEnter={clearHoverTimeout}>
            {items.map((item, idx) => {
                if (item.divider) return <div key={idx} className="my-1.5 h-px bg-[var(--card-border)] mx-2" />;
                if (item.header) return (
                    <div key={idx} className="px-4 pt-1.5 pb-1 text-[10px] uppercase tracking-widest font-bold text-[rgb(var(--text-primary))] opacity-70">
                        {item.label}
                    </div>
                );

                const currentPath = [...parentPath, item.label || ''];
                const isHovered = hoverPath[level] === (item.label || '');
                const hasSubmenu = !!item.submenu;

                return (
                    <div
                        key={idx}
                        className="relative"
                        onMouseEnter={() => onMouseEnter(currentPath)}
                        onMouseLeave={() => onMouseLeave(level, currentPath)}
                    >
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                if (!hasSubmenu) onAction(item.action);
                            }}
                            disabled={item.disabled}
                            className={`w-full px-4 py-1.5 flex items-center justify-between gap-3 text-sm transition-colors ${item.disabled ? 'text-[rgb(var(--text-secondary))]/50' : 'text-[rgb(var(--text-secondary))] hover-tint hover:text-[rgb(var(--text-primary))]'
                                } ${isHovered && hasSubmenu ? 'tint-bg text-[rgb(var(--text-primary))]' : ''}`}
                        >
                            <div className="flex items-center gap-3">
                                {item.icon}
                                <span>{item.label}</span>
                            </div>
                            {item.active && <CheckCircle2 size={12} className="text-[rgb(var(--color-primary))]" />}
                            {hasSubmenu && <ChevronRight size={12} />}
                        </button>

                        <AnimatePresence>
                            {hasSubmenu && isHovered && (
                                <motion.div
                                    initial={{ opacity: 0, x: submenuSide === 'right' ? -5 : 5 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: submenuSide === 'right' ? -5 : 5 }}
                                    className={`absolute ${submenuSide === 'right' ? 'left-full ml-0.5' : 'right-full mr-0.5'} top-[-6px] min-w-[180px] rounded-xl glass-panel border border-[var(--card-border)] shadow-2xl z-[301]`}
                                    onMouseEnter={clearHoverTimeout}
                                >
                                    <RenderItems
                                        items={item.submenu!}
                                        level={level + 1}
                                        parentPath={currentPath}
                                        hoverPath={hoverPath}
                                        submenuSide={submenuSide}
                                        onAction={onAction}
                                        onMouseEnter={onMouseEnter}
                                        onMouseLeave={onMouseLeave}
                                        clearHoverTimeout={clearHoverTimeout}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                );
            })}
        </div>
    );
}
