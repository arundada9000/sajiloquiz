import { Link } from "react-router-dom";
import { useSeo } from "../utils/seo";
import { site } from "../config/site";
import { journalArticles, type JournalArticle } from "../data/journalArticles";
import SiteLayout from "../components/SiteLayout";

export default function JournalIndexPage() {
  useSeo({
    title: `${site.name} Journal | Notes on running better quizzes`,
    description:
      "Practical articles on building question sets, theming, keyboard shortcuts, scoring teams and running live quiz events with Sajilo Quiz.",
    path: "/journal",
    schema: {
      "@context": "https://schema.org",
      "@type": "Blog",
      name: `${site.name} Journal`,
      description:
        "Practical articles on running live quizzes with Sajilo Quiz.",
      url: `${site.url}/#/journal`,
      blogPost: journalArticles.map((a) => ({
        "@type": "BlogPosting",
        headline: a.title,
        datePublished: a.date,
        url: `${site.url}/#${a.path}`,
      })),
    },
  });

  return (
    <SiteLayout>
      <div className="p-6 grow text-[rgb(var(--text-primary))]">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
            <div className="glass-panel p-6 md:p-10 mb-2">
              <h1 className="text-3xl font-black mb-2 title-gradient">
                The {site.name} Journal
              </h1>
              <p className="text-[rgb(var(--text-secondary))] leading-relaxed">
                Practical notes on building question sets, theming the app, using
                keyboard shortcuts and running smooth live quiz events. Written
                for hosts, teachers and anyone running a school, college or family
                quiz night.
              </p>
            </div>

            {journalArticles.map((article) => (
              <JournalCard key={article.path} article={article} />
            ))}

            <div className="glass-panel p-6 text-center">
              <p className="text-sm text-[rgb(var(--text-secondary))]">
                New to the app? Start with the{" "}
                <Link to="/guide" className="text-[rgb(var(--color-primary))] hover:underline">
                  full user guide
                </Link>{" "}
                and the{" "}
                <Link to="/journal/data-format" className="text-[rgb(var(--color-primary))] hover:underline">
                  question JSON format
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}

function JournalCard({ article }: { article: JournalArticle }) {
  return (
    <Link
      to={article.path}
      className="glass-panel p-6 md:p-8 hover-lift block"
    >
      <span className="inline-block text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded-full tint-bg text-[rgb(var(--color-primary))] mb-3">
        {article.tag}
      </span>
      <h2 className="text-xl font-bold mb-2 text-[rgb(var(--text-primary))]">
        {article.title}
      </h2>
      <p className="text-sm text-[rgb(var(--text-secondary))] leading-relaxed mb-3">
        {article.description}
      </p>
      <span className="text-xs text-[rgb(var(--text-secondary))]">
        {article.date} &middot; {article.readTime} min read
      </span>
    </Link>
  );
}