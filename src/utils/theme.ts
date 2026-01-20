// Theme utility to apply color schemes

export type ThemeConfig = {
    mode: 'light' | 'dark' | 'auto';
    colorScheme: 'purple' | 'blue' | 'green' | 'red' | 'orange' | 'pink';
};

// Color scheme definitions
const colorSchemes = {
    purple: {
        primary: '168, 85, 247',      // purple-500
        secondary: '147, 51, 234',   // purple-600
        accent: '126, 34, 206',      // purple-700
    },
    blue: {
        primary: '59, 130, 246',      // blue-500
        secondary: '37, 99, 235',     // blue-600
        accent: '29, 78, 216',        // blue-700
    },
    green: {
        primary: '34, 197, 94',       // green-500
        secondary: '22, 163, 74',     // green-600
        accent: '21, 128, 61',        // green-700
    },
    red: {
        primary: '239, 68, 68',       // red-500
        secondary: '220, 38, 38',     // red-600
        accent: '185, 28, 28',        // red-700
    },
    orange: {
        primary: '249, 115, 22',      // orange-500
        secondary: '234, 88, 12',     // orange-600
        accent: '194, 65, 12',        // orange-700
    },
    pink: {
        primary: '236, 72, 153',      // pink-500
        secondary: '219, 39, 119',    // pink-600
        accent: '190, 24, 93',        // pink-700
    },
};

export function applyTheme(theme: ThemeConfig) {
    const root = document.documentElement;

    // Apply color scheme
    const colors = colorSchemes[theme.colorScheme];
    root.style.setProperty('--color-primary', colors.primary);
    root.style.setProperty('--color-secondary', colors.secondary);
    root.style.setProperty('--color-accent', colors.accent);

    // Apply mode (light/dark/auto)
    if (theme.mode === 'auto') {
        // Check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        root.setAttribute('data-theme-mode', prefersDark ? 'dark' : 'light');
    } else {
        root.setAttribute('data-theme-mode', theme.mode);
    }

    // Update body background based on mode
    const isDark = root.getAttribute('data-theme-mode') === 'dark';
    if (isDark) {
        root.style.setProperty('--bg-base', '10, 10, 10');
        root.style.setProperty('--bg-elevated', '20, 20, 25');
        root.style.setProperty('--text-primary', '255, 255, 255');
        root.style.setProperty('--text-secondary', '156, 163, 175');
        root.style.setProperty('--card-bg', 'rgba(255, 255, 255, 0.05)');
        root.style.setProperty('--card-border', 'rgba(255, 255, 255, 0.1)');
    } else {
        root.style.setProperty('--bg-base', '248, 250, 252'); // Slate-50 tint
        root.style.setProperty('--bg-elevated', '255, 255, 255');
        root.style.setProperty('--text-primary', '15, 23, 42'); // Slate-900
        root.style.setProperty('--text-secondary', '71, 85, 105'); // Slate-600
        root.style.setProperty('--card-bg', 'rgba(255, 255, 255, 0.85)');
        root.style.setProperty('--card-border', `rgba(${colors.primary}, 0.1)`);
    }
}

// Listen for system theme changes when in auto mode
export function setupThemeListener(theme: ThemeConfig) {
    if (theme.mode === 'auto') {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', () => {
            applyTheme(theme);
        });
    }
}
