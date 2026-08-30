import { site } from "../config/site";
import LegalLayout from "../components/LegalLayout";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-bold mb-2">{title}</h2>
      <div className="space-y-2 text-[rgb(var(--text-secondary))]">{children}</div>
    </section>
  );
}

export default function Terms() {
  return (
    <LegalLayout title="Terms of Use" updated="September 1, 2026">
      <p className="text-[rgb(var(--text-secondary))]">
        By using {site.name}, you agree to these terms. Please read them - they
        are short and written in plain language.
      </p>

      <Section title="1. Acceptance of terms">
        <p>
          These Terms of Use ("Terms") govern your use of {site.name} (the
          "Service"), provided by {site.companyName} and its team. By accessing
          or using the Service, you agree to these Terms.
        </p>
      </Section>

      <Section title="2. What the Service is">
        <p>
          {site.name} is a free, offline-first quiz presentation tool for
          running live quizzes. It lets you create questions and rounds, project
          them on a screen, reveal answers, and keep team scores. It is built for
          educational, entertainment and fun purposes.
        </p>
      </Section>

      <Section title="3. Acceptable use">
        <p>
          You agree not to use the Service to create or share content that is
          unlawful, harmful, defamatory, hateful, or that infringes on the rights
          of others. You are responsible for the quiz content you create.
        </p>
      </Section>

      <Section title="4. Free of charge, as-is">
        <p>
          The Service is provided free of charge and "as is", without warranties
          of any kind, express or implied. To the fullest extent permitted by
          law, we disclaim all warranties, including fitness for a particular
          purpose. We are not liable for any damages arising from your use of the
          Service.
        </p>
      </Section>

      <Section title="5. Your data">
        <p>
          Your questions, rounds, teams and scores are stored locally on your own
          device. We do not host or control your data. You are responsible for
          backing it up (use the Export feature in the Data tab).
        </p>
      </Section>

      <Section title="6. Intellectual property">
        <p>
          The {site.name} app, its code, design, and branding are the property of{" "}
          {site.companyName} and are protected by copyright and other laws. This
          is proprietary software and may not be redistributed without written
          permission. Your own quiz content remains yours.
        </p>
      </Section>

      <Section title="7. Availability">
        <p>
          We aim to keep the Service available, but we may update, suspend, or
          discontinue it at any time with or without notice. We are not liable for
          any unavailability.
        </p>
      </Section>

      <Section title="8. Changes to these Terms">
        <p>
          We may revise these Terms at any time. Continued use of the Service
          after changes are posted means you accept the updated Terms.
        </p>
      </Section>

      <Section title="9. Governing law">
        <p>
          These Terms are governed by the laws of Nepal, without regard to its
          conflict-of-law provisions.
        </p>
      </Section>

      <Section title="10. Contact">
        <p>
          Questions about these Terms? Contact us at{" "}
          <a className="text-[rgb(var(--color-primary))] hover:underline" href={`mailto:${site.author.email}`}>
            {site.author.email}
          </a>
          {" "}or through our social channels.
        </p>
      </Section>
    </LegalLayout>
  );
}
