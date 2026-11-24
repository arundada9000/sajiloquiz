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
    try { await navigator.clipboard.writeText(content); setCopied(true); toast("success", "Copied to clipboard"); window.setTimeout(() => setCopied(false), 2000); }
    catch { toast("error", "Could not copy. Select the text manually."); }
  };
  return <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] overflow-hidden my-3"><div className="flex items-center justify-between px-4 py-2"><button onClick={handleCopy}>{copied ? <Check /> : <Copy />}{copied ? "Copied" : "Copy"}</button></div><pre>{content}</pre></div>;
}

export default function JournalArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const article = slug ? getJournalArticle(slug) : undefined;
  useSeo({ title: `${article ? article.title + " | " : ""}${site.name} Journal`, description: article?.description ?? "", path: article?.path ?? "/journal", type: "article" });
  if (!article) return <div>404</div>;
  const sectionVariants = {
    hidden: { opacity: 0, y: 16 },
    show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: 0.15 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } }),
  };
  return (
    <SiteLayout>
      <motion.article initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}>
        {article.sections.map((section, i) => (
          <motion.section key={section.heading} custom={i} variants={sectionVariants} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <h2>{section.heading}</h2>
            {section.body.map((p, pi) => <p key={pi}>{p}</p>)}
            {section.code && <CodeBlock label={section.code.label} content={section.code.content} />}
          </motion.section>
        ))}
      </motion.article>
    </SiteLayout>
  );
}
