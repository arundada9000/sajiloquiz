export type JournalArticle = {
  slug: string;
  path: string;
  title: string;
  description: string;
  tag: string;
  date: string;
  readTime: number;
  sections: Array<{
    heading: string;
    body: string[];
    code?: { label: string; content: string };
  }>;
};

export const journalArticles: JournalArticle[] = [
  {
    slug: "keyboard-shortcuts",
    path: "/journal/keyboard-shortcuts",
    title: "Every keyboard shortcut and gesture in Sajilo Quiz",
    description:
      "The complete reference for keyboard shortcuts and touch gestures, organized by page, so you can run the app at full speed.",
    tag: "Reference",
    date: "Sep 2026",
    readTime: 3,
    sections: [
      {
        heading: "Why shortcuts matter",
        body: [
          "A live quiz moves fast. Reaching for the mouse or hunting for a button breaks the rhythm. Every shortcut below maps to a real action in the app, and most have a sound and a haptic tick so you always know they fired.",
        ],
      },
      {
        heading: "Global shortcuts",
        body: [
          "F toggles fullscreen, which is the first thing you press when the grid goes on the projector. Press ? anytime to open the shortcuts overlay in the app. S toggles the team scoreboard drawer from any page.",
        ],
      },
      {
        heading: "On the grid page",
        body: [
          "Click any numbered card to open its question. Alt+Click re-opens a question you already answered, which is handy for a tiebreak or a retake. Right-click opens the quick actions menu with random question, admin and backup options.",
        ],
      },
      {
        heading: "On the question page",
        body: [
          "Space reveals or hides the answer, and stopping the timer on reveal is automatic by design. Esc goes back to the grid (or closes an open modal first). Q opens the questions overview so you can jump to any question number. T starts and pauses the timer, R resets it to the full default. The square bracket keys and plus and minus resize the question text for the back row of a busy hall, and 0 resets the size.",
        ],
      },
      {
        heading: "Touch gestures",
        body: [
          "On a tablet or phone, swipe left or right to move to the next or previous question. Double-tap the question area reveals or hides the answer. On the grid, double-tap opens a question and right-long-press opens the quick actions menu.",
        ],
      },
    ],
  },
  {
    slug: "theming-and-customization",
    path: "/journal/theming-and-customization",
    title: "Theming: eleven iOS color schemes and full typography control",
    description:
      "How theming works in Sajilo Quiz, which schemes exist, and how to build your own with the custom palette.",
    tag: "Design",
    date: "Sep 2026",
    readTime: 4,
    sections: [
      {
        heading: "A theme is more than a color",
        body: [
          "Each scheme in Sajilo Quiz is a complete look: background, card surfaces, text tones, tint, status colors and glass effects all move together. That is why switching from Purple to Blue changes the whole app, not just one accent.",
        ],
      },
      {
        heading: "The eleven schemes",
        body: [
          "Purple, Indigo, Blue, Teal, Green, Orange, Red, Pink, Cyan and Slate each follow the iOS system color language and have a light and a dark variant tuned for contrast. The Custom scheme takes your own primary, secondary and accent colors and builds a coherent light or dark surfaces story around them automatically.",
        ],
      },
      {
        heading: "Display modes",
        body: [
          "Choose Light, Dark or Auto. Auto follows the device appearance setting, which is great when the app is projected from a laptop while the host reads it on a phone. Every scheme is fully readable in all three modes.",
        ],
      },
      {
        heading: "Typography",
        body: [
          "The Appearance tab exposes font sizes for grid numbers, round headers, question text, answer text, timer display and stats. Sizes accept any CSS unit, so you can use px for the grid and rem for the big question text.",
        ],
      },
      {
        heading: "Accessible by default",
        body: [
          "Every theme keeps at least 4.5:1 contrast between primary text and background. Focus rings follow the active tint, and all animations respect the reduced motion preference.",
        ],
      },
    ],
  },
  {
    slug: "managing-question-batches",
    path: "/journal/managing-question-batches",
    title: "Question batches: organize multiple quiz sets",
    description:
      "Batches let you keep several question sets ready at once and switch between them without export and import gymnastics.",
    tag: "Workflow",
    date: "Sep 2026",
    readTime: 4,
    sections: [
      {
        heading: "What batches solve",
        body: [
          "Before batches, hosting two events meant exporting one set of questions and importing another. Question batches fix that by keeping several named sets side by side. The grid always shows the active batch, and switching takes one click.",
        ],
      },
      {
        heading: "Creating a batch",
        body: [
          "Open Admin, then Questions. Type a name in the New batch box and press Enter. The batch is created and becomes active, so new questions land inside it. Existing questions from an older version of the app are moved into a batch called Default automatically on first launch.",
        ],
      },
      {
        heading: "Switching and editing",
        body: [
          "Each batch appears as a pill above the question list. Click a pill to make it the active batch. Double-click a pill to rename it. The delete button appears when more than one batch exists so your last batch is protected.",
        ],
      },
      {
        heading: "Import and export",
        body: [
          "A batch can be exported alone, producing a small JSON file that only contains that set. That file can be shared with another host and imported straight into their active batch. Full backups still include every batch.",
        ],
      },
      {
        heading: "A clean workflow",
        body: [
          "Keep one batch per event or per round theme. Before an event, activate that batch, project the grid, and let the host run it. No rebuilding, no re-importing, and no risk of mixing questions from two events.",
        ],
      },
    ],
  },
  {
    slug: "running-a-live-quiz",
    path: "/journal/running-a-live-quiz",
    title: "Running a live quiz: a host's playbook",
    description:
      "A step-by-step checklist for running a school, college or family quiz night with Sajilo Quiz, from setup to the final whistle.",
    tag: "Guide",
    date: "Sep 2026",
    readTime: 5,
    sections: [
      {
        heading: "Before the event",
        body: [
          "Add all questions and rounds in the Admin panel. Assign IDs so questions sit inside the right rounds. Create a batch per event so sets never mix. Build the team list ahead of time. Export a backup and keep it on a second device.",
        ],
      },
      {
        heading: "Venue setup",
        body: [
          "Load the app while you still have internet, then everything runs offline. The venue projector gets the grid page in fullscreen. The host can follow on a phone in the same room; scores and question state are per device, so the host's phone is optional.",
        ],
      },
      {
        heading: "Starting the quiz",
        body: [
          "Reset progress on the grid to clear any previous session's visit marks. Confirm the active batch is the right one. Check the timer default in Settings: 30 seconds suits most questions, 15 for a rapid fire round.",
        ],
      },
      {
        heading: "During the rounds",
        body: [
          "Click a card, read the question out loud, and start the timer. Space reveals the answer, and the reveal stops the timer automatically. Award points to the active team with the correct, bonus and penalty buttons. The scoreboard (press S) keeps the live leaderboard on screen.",
        ],
      },
      {
        heading: "Tie breaks",
        body: [
          "Open a visited question with Alt+Click when you need a tiebreak question that was already answered, or keep one spare question in the batch that you never reveal during the main rounds.",
        ],
      },
    ],
  },
  {
    slug: "offline-and-pwa",
    path: "/journal/offline-and-pwa",
    title: "Why Sajilo Quiz works with zero internet",
    description:
      "The offline-first design, how to install the app as a PWA, and why your data never leaves the device.",
    tag: "PWA",
    date: "Sep 2026",
    readTime: 4,
    sections: [
      {
        heading: "Offline first by design",
        body: [
          "Venue internet fails at the worst moment, so Sajilo Quiz loads once and then runs entirely from the browser cache. After the first visit, questions, media, themes and sounds all work with the network switched off.",
        ],
      },
      {
        heading: "Installing the app",
        body: [
          "On desktop, use the Install button on the grid page or the install icon in the address bar. On mobile, use Add to Home Screen from the browser menu. The installed app opens fullscreen without a browser bar, just like a native app.",
        ],
      },
      {
        heading: "A true PWA",
        body: [
          "The app registers a service worker, ships an app manifest with icons, and supports the beforeinstallprompt flow on Chromium. Shortcuts to the grid and the admin panel are exposed in the installed app menu.",
        ],
      },
      {
        heading: "Data stays local",
        body: [
          "Your questions, teams, scores and settings live in the browser's local storage on your own device. There is no account, no server upload and no tracking. Export a JSON backup for safety, and restore it on any fresh device.",
        ],
      },
      {
        heading: "Media limits",
        body: [
          "Local storage has a practical limit (a few megabytes per origin). Images and audio are compressed on upload, but very large files are better placed in the public folder and referenced by relative path.",
        ],
      },
    ],
  },
  {
    slug: "scoring-and-teams",
    path: "/journal/scoring-and-teams",
    title: "Scoring and teams: a fair points system",
    description:
      "How team scoring works in Sajilo Quiz, how the weights are configured, and how the active team auto-award flow keeps the game moving.",
    tag: "Scoring",
    date: "Sep 2026",
    readTime: 3,
    sections: [
      {
        heading: "Setting the weights",
        body: [
          "The Scoring Weights in Admin, Settings control the three award buttons: correct, bonus and penalty. A common setup is 10 for correct, 5 for bonus and -2 for a wrong answer. Penalty can be zero or a positive number if you prefer only rewards.",
        ],
      },
      {
        heading: "The active team",
        body: [
          "On the question page, pick the team that should receive points. The three buttons then award points to that team in one tap, which matters when a host's hands are on the keyboard and the projector is on the wall. With no active team, the buttons are disabled.",
        ],
      },
      {
        heading: "The scoreboard",
        body: [
          "Press S from any page to slide the scoreboard in from the right. It sorts teams by score, shows the active team with a tinted card, and lets you adjust a score by hand. Clicking a team in the drawer makes it the active team.",
        ],
      },
      {
        heading: "Fairness tips",
        body: [
          "Reveal the answer before awarding points, so teams cannot tell who picked up a bonus. Use the active team switch before each question starts. For a rapid fire round with a tight clock, keep a second device on the scoreboard so teams can watch the leaderboard live.",
        ],
      },
    ],
  },
{
    slug: "timers-and-pacing",
    path: "/journal/timers-and-pacing",
    title: "Timers and pacing: tuning the countdown for every round",
    description:
      "A deep dive into the timer engine: defaults, pass timing, auto-start behavior, and how to pick the right countdown for the room.",
    tag: "Timing",
    date: "Sep 2026",
    readTime: 4,
    sections: [
      {
        heading: "The timer is per question",
        body: [
          "Every question on the grid opens with its own countdown. The duration starts at the default you set, you can reset it mid-question, and revealing the answer stops the clock automatically. Nothing about one question leaks into the next.",
        ],
      },
      {
        heading: "Defaults that change with the mode",
        body: [
          "The Settings timer controls two durations. defaultDuration is for a normal question. passDuration is the shorter allowance used after a question has been passed and comes back, or during a rapid warning. A 30-second default with a 10-second pass is a common, fair rhythm.",
        ],
      },
      {
        heading: "Auto-start behavior",
        body: [
          "autoStartOnOpen starts the timer the instant a question opens, which keeps a fast round honest but can rush a slow reader. autoStartOnPass only kicks in when a question is passed. Turning both off puts the host in full control of when the clock starts, ideal for dramatic reveals.",
        ],
      },
      {
        heading: "Pacing tips by round type",
        body: [
          "Rapid fire: 10 to 15 seconds, auto-start on, answers short. General round: 20 to 30 seconds, host starts the clock, half the usual reveal bonus. Finals: 45 to 60 seconds, no pass timer, teams get a minute of consultation. Change the defaults between rounds and the players feel it.",
        ],
      },
      {
        heading: "The audible beats",
        body: [
          "The tick sound marks each second in the last stretch and the end sound announces time. Both respect the master sound toggle. For a tense final round, tick on; for a quiet reading round, tick off.",
        ],
      },
      {
        heading: "Not a real-time referee",
        body: [
          "The timer is a guide for the host, not an authoritative judge. A question open on a phone and the same one projected can drift. Use one device as the timekeeper and keep penalties human and relaxed.",
        ],
      },
    ],
  },
  {
    slug: "media-in-questions",
    path: "/journal/media-in-questions",
    title: "Adding images and audio to questions",
    description:
      "How media works in Sajilo Quiz: attaching an image or audio clip to a question, storage limits, and where to put big files.",
    tag: "Media",
    date: "Sep 2026",
    readTime: 4,
    sections: [
      {
        heading: "Two supported media types",
        body: [
          "A question can carry one attachment: an image (photo, diagram, emoji strip) or an audio clip (the classic out-of-tune rendition of a song that teams must name). The media appears on the question page above the question text.",
        ],
      },
      {
        heading: "Attaching in Admin",
        body: [
          "In the question editor, the image option opens a file picker and the audio option records or picks a sound. Both compress the file and store it in the question. A small preview shows what teams will see.",
        ],
      },
      {
        heading: "The storage trade-off",
        body: [
          "Everything lives in the browser's local storage, which browsers cap at a few megabytes per origin. Compressed thumbnails and short clips fit easily. Very large videos or long audio should be exported to the public folder and referenced by relative path instead of embedded.",
        ],
      },
      {
        heading: "Media and rounds",
        body: [
          "Picture rounds and listen-and-answer rounds shine on a projector. Keep the reveal of the media separate from the answer: show the image, let teams think, then press Space for the answer. On the grid, tip media questions with a tiny icon so the host knows what is coming.",
        ],
      },
      {
        heading: "Backups carry media",
        body: [
          "Because attachments are stored inside the question data, a full backup includes them. Export before cleaning the browser or switching devices, and restore on the new machine to get every image and clip back.",
        ],
      },
    ],
  },
  {
    slug: "backup-and-restore",
    path: "/journal/backup-and-restore",
    title: "Backup and restore: never lose a question set again",
    description:
      "What a Sajilo Quiz backup contains, how to schedule exports, and how to restore on a fresh device in under a minute.",
    tag: "Safety",
    date: "Sep 2026",
    readTime: 3,
    sections: [
      {
        heading: "Everything in one file",
        body: [
          "A backup is a single JSON object that holds every batch and all questions, teams, scores and settings. Export it once and you have a perfect photograph of the app, restorable on this device or any other.",
        ],
      },
      {
        heading: "Exporting in Admin",
        body: [
          "Open Admin, then Backup. The Export button downloads the JSON file to your downloads folder. The same screen can also export only the active batch when you want to share a single set with another host.",
        ],
      },
      {
        heading: "Restoring",
        body: [
          "Copy the JSON into the import box (or pick the file), choose a target batch if you only want questions, and confirm. Matching structure is preserved, and anything unreadable is reported before the import completes.",
        ],
      },
      {
        heading: "A simple safety habit",
        body: [
          "Keep a backup from the moment your questions are ready, update it after every editing session, and store it on a second device or cloud drive. A venue laptop with a full question set and no backup is a risk that plays out at the worst time.",
        ],
      },
      {
        heading: "Restore for offline events",
        body: [
          "Restoring on a second device gives you a pre-loaded spare. If the main machine dies mid-event, the spare is already showing the same grid with the same questions, and the host keeps going with a two-minute handoff.",
        ],
      },
    ],
  },
  {
    slug: "data-format",
      path: "/journal/data-format",
      title: "The Sajilo Quiz data format: JSON you can hand to an AI",
      description:
        "The complete JSON schema Sajilo Quiz uses for questions, batches, teams and settings, with a copy-paste example and a ready-to-use AI prompt.",
      tag: "Reference",
      date: "Sep 2026",
      readTime: 6,
      sections: [
        {
          heading: "One format, three nested parts",
          body: [
            "A Sajilo Quiz backup is a JSON object with three top-level keys: config, questions and teams. Config holds settings, themes and rounds. Questions is an array of question objects. Teams is an array of scoreboard entries. The same object is what you export from Admin, and it is what the import box expects.",
          ],
        },
        {
          heading: "What a question looks like",
          body: [
            "Each question needs four fields: id (a unique number), text, answer and an optional mediaType plus mediaUrl pair. Media can be image or audio. Ids do not need to be contiguous, but they must be unique within a batch. Batches wrap questions so you can keep several sets ready at once.",
          ],
        },
        {
          heading: "Copy-paste example",
          body: [
            "This is a complete, valid backup: one batch named Sample with three questions and a config. Change the fields, paste the whole object into the import box in Admin, and the grid is ready in a second.",
          ],
          code: {
            label: "sample-backup.json",
            content: [
              "{",
              '  "batches": [',
              "    {",
              '      "id": "batch-sample",',
              '      "name": "Sample",',
              '      "createdAt": "2026-09-01",',
              '      "questions": [',
              "        {",
              '          "id": 1,',
              '          "text": "What is the tallest mountain on Earth?",',
              '          "answer": "Mount Everest"',
              "        },",
              "        {",
              '          "id": 2,',
              '          "text": "Which planet is known as the Red Planet?",',
              '          "answer": "Mars"',
              "        },",
              "        {",
              '          "id": 3,',
              '          "text": "How many sides does a hexagon have?",',
              '          "answer": "Six"',
              "        }",
              "      ]",
              "    }",
              "  ]",
              "}",
            ].join("\n"),
          },
        },
        {
          heading: "The AI prompt",
          body: [
            "Generate a quiz with an AI, then copy the JSON below into it. Replace the angled placeholders, paste the AI output into the import box, pick a batch to receive it, and the questions appear on the grid.",
          ],
          code: {
            label: "ai-prompt.txt",
            content: [
              "You are a quiz question writer. Produce a JSON array of 60 questions in the exact format below. Only valid JSON, no commentary, no markdown fences.",
              "",
              'Each item must have: "id" (number starting at 1, unique), "text" (the question), "answer" (the correct answer), and optionally "mediaType" ("image" or "audio") with "mediaUrl".',
              "",
              "Topic: {TOPIC}",
              "Difficulty: {EASY, MEDIUM, or HARD}",
              "Number of questions: {NUMBER}",
              "",
              "[",
              "  {",
              '    "id": 1,',
              '    "text": "Example question?",',
              '    "answer": "Example answer"',
              "  }",
              "]",
            ].join("\n"),
          },
        },
        {
          heading: "Teams and settings",
          body: [
            "Teams is simply an array with id, name and score. The active team and active batch are stored separately. Config mirrors the Settings panel, including timer defaults, scoring weights, the color scheme, sound toggles and font sizes. You can import only questions or a full backup.",
          ],
        },
        {
          heading: "Validation and import",
          body: [
            "The import box validates structure, keeps questions that pass checks, and reports which lines it could not read. Imported questions land in the active batch (or the one you pick). Use a second device and the same backup file to pre-load a fresh machine before an event.",
          ],
        },
      ],
    },
];

export function getJournalArticle(slug: string): JournalArticle | undefined {
  return journalArticles.find((a) => a.slug === slug);
}