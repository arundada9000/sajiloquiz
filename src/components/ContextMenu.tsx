import React, { useState, useEffect, useRef } from 'react';
import {
    Home, Settings, Palette, Volume2, Download, RefreshCw,
    Maximize, Keyboard, Eye, Copy, Shuffle, Moon, Sun, Monitor,
    ChevronRight, CheckCircle2, Layout, MoreHorizontal,
    Instagram, Facebook, Github, Youtube
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useData } from '../context/DataContext';
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
};

type Props = {
    x: number;
    y: number;
    onClose: () => void;
    pageType?: 'grid' | 'question';
    questionText?: string;
    answerText?: string;
    onToggleAnswer?: () => void;
    onQuickPeek?: () => void;
};

export default function ContextMenu({
    x, y, onClose, pageType, questionText, answerText, onToggleAnswer, onQuickPeek
}: Props) {
    const navigate = useNavigate();
    const location = useLocation();
    const { appConfig, updateConfig, allQuestions } = useData();
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
        { label: 'Purple', icon: <div className="w-3 h-3 rounded-full bg-purple-500" />, action: () => updateConfig({ theme: { ...appConfig.theme, colorScheme: 'purple' } }), active: appConfig.theme.colorScheme === 'purple' },
        { label: 'Blue', icon: <div className="w-3 h-3 rounded-full bg-blue-500" />, action: () => updateConfig({ theme: { ...appConfig.theme, colorScheme: 'blue' } }), active: appConfig.theme.colorScheme === 'blue' },
        { label: 'Green', icon: <div className="w-3 h-3 rounded-full bg-green-500" />, action: () => updateConfig({ theme: { ...appConfig.theme, colorScheme: 'green' } }), active: appConfig.theme.colorScheme === 'green' },
        { label: 'Red', icon: <div className="w-3 h-3 rounded-full bg-red-500" />, action: () => updateConfig({ theme: { ...appConfig.theme, colorScheme: 'red' } }), active: appConfig.theme.colorScheme === 'red' },
        { label: 'Orange', icon: <div className="w-3 h-3 rounded-full bg-orange-500" />, action: () => updateConfig({ theme: { ...appConfig.theme, colorScheme: 'orange' } }), active: appConfig.theme.colorScheme === 'orange' },
        { label: 'Pink', icon: <div className="w-3 h-3 rounded-full bg-pink-500" />, action: () => updateConfig({ theme: { ...appConfig.theme, colorScheme: 'pink' } }), active: appConfig.theme.colorScheme === 'pink' },
    ];

    const menuItems: MenuItem[] = [
        { label: 'Go to Home', icon: <Home size={16} />, action: () => navigate('/'), disabled: location.pathname === '/' },
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
                    label: 'Random Question',
                    icon: <Shuffle size={14} />,
                    action: () => {
                        const randomQ = allQuestions[Math.floor(Math.random() * allQuestions.length)];
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
                        const dataStr = JSON.stringify({ config: appConfig, questions: allQuestions }, null, 2);
                        const a = document.createElement('a');
                        a.href = URL.createObjectURL(new Blob([dataStr], { type: 'application/json' }));
                        a.download = `quiz-backup-${Date.now()}.json`;
                        a.click();
                    }
                },
                { label: 'Refresh App', icon: <RefreshCw size={14} />, action: () => window.location.reload() }
            ]
        }
    ];

    const RenderItems = ({ items, level = 0, parentPath = [] }: { items: MenuItem[], level?: number, parentPath?: string[] }) => (
        <div className="flex flex-col py-1.5">
            {items.map((item, idx) => {
                if (item.divider) return <div key={idx} className="my-1.5 h-px bg-white/10 mx-2" />;

                const currentPath = [...parentPath, item.label || ''];
                const isHovered = hoverPath[level] === (item.label || '');
                const hasSubmenu = !!item.submenu;

                return (
                    <div
                        key={idx}
                        className="relative"
                        onMouseEnter={() => {
                            const newPath = [...parentPath, item.label || ''];
                            setHoverPath(newPath);
                        }}
                    >
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                if (!hasSubmenu) handleAction(item.action);
                            }}
                            disabled={item.disabled}
                            className={`w-full px-4 py-1.5 flex items-center justify-between gap-3 text-sm transition-colors ${item.disabled ? 'text-gray-600' : 'text-gray-200 hover:bg-white/10 hover:text-white'
                                } ${isHovered && hasSubmenu ? 'bg-white/10 text-white' : ''}`}
                        >
                            <div className="flex items-center gap-3">
                                {item.icon}
                                <span>{item.label}</span>
                            </div>
                            {item.active && <CheckCircle2 size={12} className="text-purple-400" />}
                            {hasSubmenu && <ChevronRight size={12} />}
                        </button>

                        <AnimatePresence>
                            {hasSubmenu && isHovered && (
                                <motion.div
                                    initial={{ opacity: 0, x: submenuSide === 'right' ? -5 : 5 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: submenuSide === 'right' ? -5 : 5 }}
                                    className={`absolute ${submenuSide === 'right' ? 'left-full ml-0.5' : 'right-full mr-0.5'} top-[-6px] min-w-[180px] rounded-xl glass-panel border border-white/20 shadow-2xl z-[301]`}
                                    onMouseLeave={() => {
                                        // Only clear if mouse isn't moving to another item in the same level
                                    }}
                                >
                                    <RenderItems items={item.submenu!} level={level + 1} parentPath={currentPath} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                );
            })}
        </div>
    );

    return (
        <AnimatePresence>
            <motion.div
                ref={menuRef}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="fixed z-[300] min-w-[190px] rounded-xl glass-panel border border-white/20 shadow-2xl"
                style={{ left: `${position.x}px`, top: `${position.y}px` }}
                onContextMenu={(e) => e.preventDefault()}
                onClick={(e) => e.stopPropagation()}
                onMouseLeave={() => setHoverPath([])}
            >
                <RenderItems items={menuItems} />

                {/* Social Links Row */}
                <div className="flex items-center justify-around p-2 border-t border-white/10 bg-white/5 rounded-b-xl">
                    <SocialIcon icon={<Instagram size={14} />} href="https://www.instagram.com/sajilo_digital" />
                    <SocialIcon icon={<Facebook size={14} />} href="https://www.facebook.com/profile.php?id=61579846778258" />
                    <SocialIcon icon={<Github size={14} />} href="https://github.com/sajhilodigital" />
                    <SocialIcon icon={<Youtube size={14} />} href="https://www.youtube.com/@sajilo_digital" />
                </div>
            </motion.div>
        </AnimatePresence>
    );
}

function SocialIcon({ icon, href }: { icon: React.ReactNode, href: string }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
                e.stopPropagation();
                sounds.click();
            }}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all active:scale-95"
        >
            {icon}
        </a>
    );
}
