import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, Check, Copy } from "lucide-react";
import { motion } from "framer-motion";
import { useSeo } from "../utils/seo";
import { site } from "../config/site";
import { getJournalArticle } from "../data/journalArticles";
import { useDialog } from "../context/DialogContext";
import SiteLayout from "../components/SiteLayout";

function CodeBlock({ label, content }: { label: string; content: string }) {
  const { toast } = useDialog();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast("success", "Copied to clipboard");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast("error", "Could not copy. Select the text manually.");
    }
  };

  return (
    <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] overflow-hidden my-3">
      <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--card-border)]">
        <span className="text-xs font-semibold text-[rgb(var(--text-secondary))] font-mono">
          {label}
        </span>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg tint-bg text-[rgb(var(--color-primary))] hover:brightness-110 active:scale-95 transition-all"
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="p-4 text-xs leading-relaxed font-mono overflow-x-auto text-[rgb(var(--text-primary))]">
        {content}
      </pre>
    </div>
  );
}

export default function JournalArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const article = slug ? getJournalArticle(slug) : undefined;

  useSeo({
    title: `${article ? article.title + " | " : ""}${site.name} Journal`,
    description:
      article?.description ??
      "A practical article about running quizzes with Sajilo Quiz.",
    path: article?.path ?? "/journal",
    type: "article",
    schema: article
      ? {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: article.title,
          description: article.description,
          datePublished: article.date,
          author: {
            "@type": "Person",
            name: site.author.name,
            url: site.author.url,
          },
          publisher: {
            "@type": "Organization",
            name: site.companyName,
          },
          mainEntityOfPage: `${site.url}/#${article.path}`,
        }
      : undefined,
  });

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div className="glass-panel p-8 max-w-md w-full">
          <h1 className="text-2xl font-black mb-2 title-gradient">404</h1>
          <p className="text-[rgb(var(--text-secondary))] text-sm mb-6">
            That journal article does not exist.
          </p>
          <Link to="/journal" className="btn-primary inline-flex items-center gap-2">
            <ArrowLeft size={16} /> All Articles
          </Link>
        </div>
      </div>
    );
  }

  const sectionVariants = {
    hidden: { opacity: 0, y: 16 },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.15 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    }),
  };

  return (
    <SiteLayout>
      <div className="p-6 grow text-[rgb(var(--text-primary))]">
        <div className="max-w-3xl mx-auto">
          <motion.article
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="glass-panel p-6 md:p-10"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="inline-block text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded-full tint-bg text-[rgb(var(--color-primary))] mb-4"
            >
              {article.tag}
            </motion.span>
            <h1 className="text-3xl font-black mb-2 title-gradient">
              {article.title}
            </h1>
            <p className="text-xs text-[rgb(var(--text-secondary))] mb-8">
              {article.date} &middot; {article.readTime} min read &middot; By{" "}
              {site.author.name}
            </p>

            <div className="space-y-8 text-sm leading-relaxed">
              {article.sections.map((section, i) => (
                <motion.section
                  key={section.heading}
                  custom={i}
                  variants={sectionVariants}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-20px" }}
                >
                  <h2 className="text-lg font-bold mb-2 text-[rgb(var(--text-primary))]">
                    {section.heading}
                  </h2>
                  {section.body.map((p, pi) => (
                    <p key={pi} className="text-[rgb(var(--text-secondary))] mb-2">
                      {p}
                    </p>
                  ))}
                  {section.code && (
                    <CodeBlock label={section.code.label} content={section.code.content} />
                  )}
                </motion.section>
              ))}
            </div>
          </motion.article>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="mt-6 text-center text-sm"
          >
            <Link
              to="/journal"
              className="text-[rgb(var(--color-primary))] hover:underline inline-flex items-center gap-2"
            >
              <ArrowLeft size={16} /> Back to all articles
            </Link>
          </motion.div>
        </div>
      </div>
    </SiteLayout>
  );
}