/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: [
                    "-apple-system",
                    "BlinkMacSystemFont",
                    '"SF Pro Text"',
                    '"SF Pro Display"',
                    '"Segoe UI"',
                    "Roboto",
                    '"Helvetica Neue"',
                    "Arial",
                    "sans-serif",
                ],
                mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
            },
            borderRadius: {
                // iOS HIG corner radii
                "ios-sm": "10px",
                "ios": "12px",
                "ios-md": "16px",
                "ios-lg": "20px",
                cell: "14px",
            },
            colors: {
                tint: "rgb(var(--tint))",
            },
            keyframes: {
                timerPulse: {
                    "0%, 100%": { opacity: "1" },
                    "50%": { opacity: "0.55" },
                },
                spinSlow: {
                    to: { transform: "rotate(360deg)" },
                },
            },
            animation: {
                "timer-pulse": "timerPulse 1s ease-in-out infinite",
                "spin-slow": "spinSlow 2.5s linear infinite",
            },
        },
    },
    plugins: [],
}
