import { createFileRoute, Link } from "@tanstack/react-router";

/**
 * Public privacy policy page (/privacy).
 *
 * Google Play requires a reachable privacy-policy URL for the listing. The policy
 * is deliberately short because the app genuinely collects nothing: no account,
 * no analytics, no ads, no network calls at runtime — learning progress lives
 * only in the browser's localStorage on the user's own device.
 */
const LAST_UPDATED = "June 21, 2026";
const CONTACT_EMAIL = "rakib.rahman@neuefische.de";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — DerDieDasso" },
      {
        name: "description",
        content:
          "DerDieDasso privacy policy: the app collects no personal data; learning progress stays on your device.",
      },
    ],
  }),
  component: PrivacyPage,
});

/** One titled section of the policy. */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6">
      <h2 className="text-lg font-bold text-foreground">{title}</h2>
      <div className="mt-2 space-y-2 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </section>
  );
}

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-5 py-8">
        <Link to="/" className="text-sm font-semibold text-primary hover:underline">
          ← Back to the app
        </Link>

        <h1 className="mt-4 text-3xl font-extrabold text-foreground">Privacy Policy</h1>
        <p className="mt-1 text-xs text-muted-foreground">Last updated: {LAST_UPDATED}</p>

        <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
          DerDieDasso (&ldquo;the app&rdquo;) is a free tool for learning German noun gender. We
          built it to respect your privacy: it works without an account and collects no personal
          information. This policy explains what that means in practice.
        </p>

        <Section title="Information we collect">
          <p>
            <strong className="text-foreground">None that identifies you.</strong> The app has no
            sign-up, login, or user profile. We do not ask for your name, email, location, or any
            other personal information, and we do not run analytics or tracking of any kind.
          </p>
        </Section>

        <Section title="Your learning progress stays on your device">
          <p>
            Your practice results, mastered scenes, and app preferences are stored only in your
            device&rsquo;s local browser storage (<code>localStorage</code>). This data never leaves
            your device — it is not sent to us or to anyone else. Clearing your browser/app storage
            erases it permanently.
          </p>
        </Section>

        <Section title="No advertising or third-party tracking">
          <p>
            The app shows no ads and embeds no advertising, analytics, or social-media tracking
            software. We do not sell or share any data, because we do not collect any.
          </p>
        </Section>

        <Section title="Speech feature">
          <p>
            To read German words aloud, the app uses your device&rsquo;s built-in text-to-speech
            (the browser&rsquo;s Web Speech API). This is handled entirely by your device or browser;
            the app sends no audio or text to us.
          </p>
        </Section>

        <Section title="Hosting logs">
          <p>
            Like virtually all websites, the app is served by a hosting provider that may
            automatically record standard technical information (such as IP address and browser
            type) in server logs for security and reliability. We do not use these logs to identify
            you or build a profile of you.
          </p>
        </Section>

        <Section title="Children">
          <p>
            The app is intended for a general audience and is not directed at children. We do not
            knowingly collect personal information from anyone, including children.
          </p>
        </Section>

        <Section title="Changes to this policy">
          <p>
            If this policy changes, we will update the date at the top of this page. Continued use of
            the app after a change means you accept the updated policy.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            Questions about this policy? Email us at{" "}
            <a className="font-semibold text-primary hover:underline" href={`mailto:${CONTACT_EMAIL}`}>
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </Section>
      </div>
    </div>
  );
}
