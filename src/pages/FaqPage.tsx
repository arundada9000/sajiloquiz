import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import { useSeo } from "../utils/seo";
import { site } from "../config/site";
import SiteLayout from "../components/SiteLayout";
import { faqItems } from "../data/faqs";

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useSeo({
    title: `${site.name} FAQ | Frequently asked questions`,
    description:
      "Answers to common questions about Sajilo Quiz: offline usage, adding questions and rounds, scoring teams, installing the app, themes, sounds and more.",
    path: "/faq",
    schema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqItems.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    },
  });

  return (
    <SiteLayout>
      <div className="p-6 grow text-[rgb(var(--text-primary))]">
        <div className="max-w-3xl mx-auto">
          <div className="glass-panel p-6 md:p-10 mb-6">
            <div className="flex items-start gap-4">
              <div className="hidden sm:flex w-12 h-12 rounded-2xl bg-[rgb(var(--color-primary))]/15 text-[rgb(var(--color-primary))] items-center justify-center shrink-0">
                <HelpCircle size={24} />
              </div>
              <div>
                <h1 className="text-3xl font-black mb-2 title-gradient">
                  Frequently Asked Questions
                </h1>
                <p className="text-[rgb(var(--text-secondary))] leading-relaxed">
                  Everything hosts and teachers ask before running a quiz event
                  with {site.name}. Missed something? The{" "}
                  <Link
                    to="/guide"
                    className="text-[rgb(var(--color-primary))] hover:underline"
                  >
                    user guide
                  </Link>{" "}
                  has the full details.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {faqItems.map((faq, i) => {
              const open = openIndex === i;
              return (
                <div
                  key={faq.question}
                  className={`glass-panel overflow-hidden transition-all ${
                    open
                      ? "border-[rgb(var(--color-primary))]/30"
                      : "hover:border-[rgb(var(--color-primary))]/20"
                  }`}
                >
                  <button
                    onClick={() => setOpenIndex(open ? null : i)}
                    className="w-full flex items-center justify-between gap-4 px-5 md:px-6 py-4 text-left"
                    aria-expanded={open}
                  >
                    <span className="font-bold text-[rgb(var(--text-primary))] text-sm md:text-base">
                      {faq.question}
                    </span>
                    <ChevronDown
                      size={18}
                      className={`shrink-0 text-[rgb(var(--color-primary))] transition-transform duration-300 ${
                        open ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        key="answer"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 md:px-6 pb-5 text-sm text-[rgb(var(--text-secondary))] leading-relaxed">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          <div className="glass-panel p-6 text-center mt-6">
            <p className="text-sm text-[rgb(var(--text-secondary))]">
              New to the app? Take the{" "}
              <button
                onClick={() =>
                  window.dispatchEvent(new CustomEvent("sajilo:onboarding"))
                }
                className="text-[rgb(var(--color-primary))] hover:underline font-semibold"
              >
                Quick Tour
              </button>{" "}
              or start with the{" "}
              <Link
                to="/guide"
                className="text-[rgb(var(--color-primary))] hover:underline font-semibold"
              >
                user guide
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}