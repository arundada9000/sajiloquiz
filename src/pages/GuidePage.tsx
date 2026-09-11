import { Link } from "react-router-dom";
import { useSeo } from "../utils/seo";
import { site } from "../config/site";
import SiteLayout from "../components/SiteLayout";

const guideSections: Array<{ title: string; body: string }> = [
  {
    title: "Getting started",
    body: "On your very first visit, the app opens a short Quick Tour that introduces the major features in nine steps. If you close it early or want to see it again, use the Quick Tour button in the footer. Sajilo Quiz is a live quiz presentation app that works completely offline once loaded. Open the Admin Panel to add your questions, rounds and teams, then project the question grid on the venue screen and reveal questions one by one while the sidebar keeps scores.",
  },
  {
    title: "Adding questions",
    body: "Go to Admin, then Questions. Click Add New to write a question and its answer. Questions support an optional image or audio attachment. Each question gets a number (ID) that shows on the grid. You can edit an ID to place a question inside a specific round.",
  },
  {
    title: "Organizing with batches",
    body: "Question batches let you keep several question sets in one place: a general round, a science round, a finals set and so on. The app starts with your company quiz plus three ready-made sample batches (Rapid-Fire Quickies, Grand Quiz Extravaganza and Deep-Dive Thinkers) that show off different round styles and question lengths. Delete any sample batch and it stays deleted. Create a batch, name it, and it becomes the active set. Every question you add goes into the active batch, and the grid shows only the active batch. Switch batches any time, or export one batch to share it with someone else.",
  },
  {
    title: "Running a live quiz",
    body: "Project the grid page on the big screen and press F for fullscreen. Click a numbered card to open its question. Press Space to reveal or hide the answer. The timer runs per question and can be started, paused or reset. Answered cards get a checkmark so you never ask the same question twice.",
  },
  {
    title: "Per-question context menu",
    body: "Right-click (or long-press) any question card on the grid to open a menu for just that question. From here you can open the question, mark it as visited or unmark it (useful when a question was marked as answered by mistake), add or remove a review bookmark, and snap just that one question to dust or restore it.",
  },
  {
    title: "Reading questions aloud",
    body: "Each question has a Read button next to the Mark button. Click it to have the browser speak the question aloud using speech synthesis - handy in classrooms or for players who prefer to hear the question. If the answer is already revealed, the read-out includes the answer too. Click Stop or tap Read again to interrupt. It works offline with no audio files.",
  },
  {
    title: "Snap and restore",
    body: "Press X to snap away all visited questions at once with a dust animation, leaving only the unvisited ones. The snapped cards disappear from the grid but are not deleted: use the Restore button to bring them back any time. Reset Progress clears visited marks and restores every snapped question in one go.",
  },
  {
    title: "Scoring and teams",
    body: "Add teams in Admin, then Teams. On the question page, pick the active team and award correct, bonus or penalty points with the three buttons. The sidebar scoreboard (press S on any page) shows the live leaderboard and lets you adjust a score by hand.",
  },
  {
    title: "Themes and appearance",
    body: "Sajilo Quiz ships with eleven color schemes: Purple, Indigo, Blue, Teal, Green, Orange, Red, Pink, Cyan, Slate and Custom. Every scheme uses the iOS system color language, so surfaces and text stay consistent while the tint family changes. Each scheme has a light and a dark variant. Pick display mode (Light, Dark or Auto) and a scheme in Admin, then Theme. Custom lets you set your own primary, secondary and accent colors. Font sizes for the grid, question, answer, timer and stats are editable in Admin, then Appearance.",
  },
  {
    title: "Data safety and backups",
    body: "Everything you create stays in your browser's local storage on your own device. Nothing is uploaded to a server. Use Admin, then Backup to export a JSON file of all data, and keep it somewhere safe before clearing browser data or switching devices. The same screen lets you restore from a backup file.",
  },
  {
    title: "Offline and install",
    body: "The app is a PWA. After loading it once, it works with no internet at all, which matters for venues with unreliable connections. On desktop or mobile, use the Install App button in the footer (or the Install button on the grid page) to add it to your home screen for a native-app-like experience. Questions, images, sounds and scores all live in your browser.",
  },
  {
    title: "Where to get help",
    body: "The in-app FAQ at /#/faq answers the most common questions about offline use, adding questions, scoring, installing and privacy. You can open it from the footer anytime.",
  },
];

const shortcutGroups: Array<{ category: string; items: Array<{ keys: string; action: string }> }> = [
  {
    category: "Global",
    items: [
      { keys: "F", action: "Toggle fullscreen" },
      { keys: "?", action: "Show or hide shortcuts" },
      { keys: "S", action: "Toggle the scoreboard" },
    ],
  },
  {
    category: "Grid page",
    items: [
      { keys: "Alt + Click", action: "Re-open a visited question" },
      { keys: "Right-click", action: "Open the per-question menu (mark/unmark visited, snap)" },
      { keys: "R", action: "Open a random unvisited question" },
      { keys: "X", action: "Snap away all visited questions" },
    ],
  },
  {
    category: "Question page",
    items: [
      { keys: "Space", action: "Reveal or hide answer" },
      { keys: "Esc", action: "Back to grid or close modal" },
      { keys: "Q", action: "Open questions overview" },
      { keys: "T", action: "Start or pause timer" },
      { keys: "R", action: "Reset timer" },
      { keys: "M", action: "Mark or unmark the question" },
      { keys: "Read", action: "Speak the question aloud (reads the answer once revealed)" },
      { keys: "] or +", action: "Increase text size" },
      { keys: "[ or -", action: "Decrease text size" },
      { keys: "0", action: "Reset text size" },
    ],
  },
];

export default function GuidePage() {
  useSeo({
    title: `${site.name} User Guide | How to run a live quiz`,
    description:
      "Step-by-step guide to using Sajilo Quiz: adding questions, organizing rounds and batches, running a live event, scoring teams, theming, backups and installing the offline app.",
    path: "/guide",
    type: "article",
    schema: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: "How to run a live quiz with Sajilo Quiz",
      description:
        "A practical guide to building question sets and running a live quiz event with Sajilo Quiz.",
      step: guideSections.map((s) => ({
        "@type": "HowToStep",
        name: s.title,
        text: s.body,
      })),
    },
  });

  return (
    <SiteLayout>
      <div className="p-6 grow text-[rgb(var(--text-primary))]">
        <div className="max-w-3xl mx-auto">


          <div className="glass-panel p-6 md:p-10">
            <h1 className="text-3xl font-black mb-2 title-gradient">
              {site.name} User Guide
            </h1>
            <p className="text-sm text-[rgb(var(--text-secondary))] mb-8">
              {site.name} by {site.companyName} &middot; Everything you need to
              run a live quiz
            </p>

            <div className="space-y-8 text-sm leading-relaxed">
              {guideSections.map((section) => (
                <section key={section.title}>
                  <h2 className="text-lg font-bold mb-2">{section.title}</h2>
                  <p className="text-[rgb(var(--text-secondary))]">{section.body}</p>
                </section>
              ))}

              {/* Keyboard shortcuts reference */}
              <section id="shortcuts">
                <h2 className="text-lg font-bold mb-2">Keyboard shortcuts</h2>
                {shortcutGroups.map((group) => (
                  <div key={group.category} className="mt-4">
                    <h3 className="text-sm uppercase tracking-wider text-[rgb(var(--color-primary))] font-bold mb-2">
                      {group.category}
                    </h3>
                    <div className="space-y-2">
                      {group.items.map((item) => (
                        <div
                          key={item.keys}
                          className="p-3 rounded-lg bg-[var(--fill)] border border-[var(--card-border)] flex items-center justify-between gap-3"
                        >
                          <span className="text-[rgb(var(--text-secondary))]">
                            {item.action}
                          </span>
                          <span className="kbd">{item.keys}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </section>

              <section>
                <h2 className="text-lg font-bold mb-2">Still have questions</h2>
                <p className="text-[rgb(var(--text-secondary))]">
                  The{" "}
                  <Link to="/faq" className="text-[rgb(var(--color-primary))] hover:underline">
                    FAQ
                  </Link>{" "}
                  covers the most common questions. For deeper reading, the
                  journal has articles on{" "}
                  <Link to="/journal/managing-question-batches" className="text-[rgb(var(--color-primary))] hover:underline">
                    question batches
                  </Link>
                  ,{" "}
                  <Link to="/journal/keyboard-shortcuts" className="text-[rgb(var(--color-primary))] hover:underline">
                    shortcuts
                  </Link>{" "}
                  and{" "}
                  <Link to="/journal/data-format" className="text-[rgb(var(--color-primary))] hover:underline">
                    the question JSON format
                  </Link>
                  . For anything else, reach the author at{" "}
                  <a
                    className="text-[rgb(var(--color-primary))] hover:underline"
                    href={`mailto:${site.author.email}`}
                  >
                    {site.author.email}
                  </a>
                  .
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}