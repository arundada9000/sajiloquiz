import { ReactNode } from "react";
import { motion } from "framer-motion";
import { site } from "../config/site";
import SiteLayout from "./SiteLayout";

const sectionVariant = {
  hidden: { opacity: 0, y: 14 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.2 + i * 0.04, duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <SiteLayout>
      <div className="p-6 grow text-[rgb(var(--text-primary))]">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="glass-panel p-6 md:p-10"
          >
            <h1 className="text-3xl font-black mb-1 title-gradient">{title}</h1>
            <p className="text-sm text-[rgb(var(--text-secondary))] mb-8">
              {site.name} by {site.companyName} &middot; Last updated: {updated}
            </p>
            <motion.div
              className="space-y-6 text-sm leading-relaxed text-[rgb(var(--text-primary))]"
              initial="hidden"
              animate="show"
            >
              {Array.isArray(children)
                ? children.map((child, i) => (
                    <motion.div key={i} custom={i} variants={sectionVariant}>
                      {child}
                    </motion.div>
                  ))
                : <motion.div custom={0} variants={sectionVariant}>{children}</motion.div>
              }
            </motion.div>
          </motion.div>
        </div>
      </div>
    </SiteLayout>
  );
}