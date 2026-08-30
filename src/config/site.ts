// ---------------------------------------------------------------------------
// Central site configuration. Change the values in this single file to rebrand
// or repoint the app. Nothing else should hardcode these values at runtime.
// ---------------------------------------------------------------------------

export const site = {
  // Canonical base URL. Swap this when you host the app somewhere else.
  // No trailing slash. Example: "https://example.com"
  url: "https://sajiloquiz.vercel.app",

  name: "Sajilo Quiz",
  shortName: "Sajilo Quiz",
  tagline: "Live quiz for schools, colleges, offices and your family now",
  description:
    "Sajilo Quiz is a free, offline-first quiz presentation app for running live events. Build questions and rounds, project the grid on a big screen, reveal answers one by one, and keep team scores in the sidebar. Works fully offline once loaded.",

  companyName: "Sajilo Digital",
  companyUrl: "https://sajilodigital.com.np",
  companyAddress: "Horizon Chowk, Butwal-11 Rupandehi, Nepal",
  companyLocale: "en_NP",
  companyRegion: "NP-RA",

  author: {
    name: "Arun Neupane",
    url: "https://arunneupane.netlify.app",
    email: "arunneupane0000@gmail.com",
    phone: "+9779842977207",
  },

  social: {
    instagram: "https://www.instagram.com/sajilo_digital",
    facebook: "https://www.facebook.com/profile.php?id=61579846778258",
    github: "https://github.com/sajhilodigital",
    githubRepo: "https://github.com/arundada9000/sajiloquiz",
    youtube: "https://www.youtube.com/@sajilo_digital",
  },

  // Default theme colors used for the PWA manifest and meta theme-color.
  manifest: {
    themeColor: "#a855f7",
    backgroundColor: "#0a0a0f",
  },
} as const;

// PWA install shortcuts shown in the browser "Install app" menu (Chromium).
export const pwaShortcuts: Array<{
  name: string;
  short_name: string;
  description: string;
  url: string;
  icons?: { src: string; sizes: string; type: string; purpose: string };
}> = [
  {
    name: "Open Question Grid",
    short_name: "Grid",
    description: "Open the question grid",
    url: "/#/",
  },
  {
    name: "Admin Dashboard",
    short_name: "Admin",
    description: "Manage questions, rounds and teams",
    url: "/#/admin",
  },
  {
    name: "Leaderboard",
    short_name: "Scores",
    description: "Open the team scoreboard",
    url: "/#/",
  },
];
