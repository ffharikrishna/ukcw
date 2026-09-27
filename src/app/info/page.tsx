import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { site } from "@/lib/site";
import s from "../subpage.module.css";

export const metadata: Metadata = {
  title: "Info",
  description: "Four steps from joining the UKCW Discord to your first call in an ER:LC session.",
};

type Step = {
  title: string;
  body: string;
  action?: { label: string; href: string; external?: boolean };
};

const steps: Step[] = [
  {
    title: "Join the Discord",
    body: "Everything runs through it: announcements, applications, support and the sessions channel.",
    action: { label: "Open the invite", href: site.discordInvite, external: true },
  },
  {
    title: "Verify and read the rules",
    body: "Link your Roblox account so staff can match you in-game, then go through the server rules and SOPs.",
  },
  {
    title: "Pick a department",
    body: "Some departments take you straight in, others run a short application and a training session first.",
    action: { label: "Browse departments", href: "/departments" },
  },
  {
    title: "Wait for a startup",
    body: `When a session opens, join the ER:LC private server with the code ${site.serverCode}. There are ${site.maxPlayers} slots, so get in early.`,
    action: { label: "Check server status", href: "/sessions" },
  },
];

export default function InfoPage() {
  return (
    <>
      <PageHeader eyebrow="Info" title="From Discord to your first call">
        You don&rsquo;t need experience. Every department runs its own training, and there&rsquo;s always someone in
        the Discord who can help.
      </PageHeader>

      <section className="section">
        <div className={`container ${s.split}`}>
          <div className={s.splitIntro}>
            <span className="eyebrow">Before you start</span>
            <h2 className="section-title">What you&rsquo;ll need.</h2>
            <p className="lede">
              A Roblox account, a copy of Emergency Response: Liberty County and a Discord account. That&rsquo;s it.
            </p>
          </div>

          <ol className={s.steps}>
            {steps.map((step, i) => (
              <li key={step.title}>
                <span className={s.stepNo}>{i + 1}</span>
                <div>
                  <h2>{step.title}</h2>
                  <p>{step.body}</p>
                  {step.action &&
                    (step.action.external ? (
                      <a href={step.action.href} className={s.stepAction} target="_blank" rel="noreferrer">
                        {step.action.label} <span className="arrow">→</span>
                      </a>
                    ) : (
                      <Link href={step.action.href} className={s.stepAction}>
                        {step.action.label} <span className="arrow">→</span>
                      </Link>
                    ))}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={s.next}>
        <div className={`container ${s.nextInner}`}>
          <div>
            <h2>Ready when you are.</h2>
            <p>The next startup is only ever a notification away.</p>
          </div>
          <div className={s.nextActions}>
            <a href={site.discordInvite} className="btn btn-primary" target="_blank" rel="noreferrer">
              Join the Discord <span className="arrow">→</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
