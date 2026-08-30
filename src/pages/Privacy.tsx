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

export default function Privacy() {
  const email = site.author.email;
  return (
    <LegalLayout title="Privacy Policy" updated="September 1, 2026">
      <p className="text-[rgb(var(--text-secondary))]">
        This page explains what {site.name} does and does not collect. The short
        version: this app is designed to work fully offline, and it takes your
        privacy seriously.
      </p>

      <Section title="1. Information stored on YOUR device">
        <p>
          {site.name} stores your questions, rounds, teams, scores and settings
          locally in your browser using your device's built-in storage
          (localStorage). This data stays on your device. We do not upload it to
          any server.
        </p>
      </Section>

      <Section title="2. What we do NOT collect">
        <p>
          We do not collect names, email addresses, phone numbers, payment
          details, browsing history or any personal data. There is no account
          system, no analytics that track you personally, and no advertising
          trackers in this app.
        </p>
      </Section>

      <Section title="3. Anonymous, aggregated technical data">
        <p>
          To make the app load fast and work reliably, the hosting platform may
          keep routine server (access) logs - for example, the pages you request
          and basic request timing. Where possible these are aggregated and
          anonymous, and are used only to keep the service running securely.
        </p>
      </Section>

      <Section title="4. Cookies">
        <p>
          The app itself does not use tracking cookies. It relies on local
          storage for your saved content. Third-party hosts or embeds may use
          cookies; you can clear them at any time from your browser settings.
        </p>
      </Section>

      <Section title="5. Children's privacy">
        <p>
          {site.name} is a tool for running quizzes and does not intentionally
          collect data from anyone, including children. No account or personal
          details are required to use it.
        </p>
      </Section>

      <Section title="6. Third-party links">
        <p>
          The app may link to external websites (such as our social pages).
          Those sites have their own privacy policies, and we are not
          responsible for their practices.
        </p>
      </Section>

      <Section title="7. Your control">
        <p>
          Because your data lives in your browser, you are always in control.
          You can export a JSON backup, clear all data from the Data tab in
          Admin, or clear this site's data from your browser at any time.
        </p>
      </Section>

      <Section title="8. Changes to this policy">
        <p>
          We may update this policy from time to time. The "Last updated" date
          above shows when it was last revised.
        </p>
      </Section>

      <Section title="9. Contact">
        <p>
          Questions about this policy? Reach out at{" "}
          <a className="text-[rgb(var(--color-primary))] hover:underline" href={`mailto:${email}`}>
            {email}
          </a>
          .
        </p>
      </Section>
    </LegalLayout>
  );
}
