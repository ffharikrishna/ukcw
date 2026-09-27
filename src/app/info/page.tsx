import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { getHeadshots } from "@/lib/roblox";
import { site } from "@/lib/site";
import { leadership, robloxProfile, staffTeams } from "@/lib/team";
import s from "../subpage.module.css";
import t from "./info.module.css";

export const metadata: Metadata = {
  title: "Info",
  description: "How to join UKCW, who runs it, and the staff teams behind the server.",
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

export default async function InfoPage() {
  const headshots = await getHeadshots(leadership.map((l) => l.robloxId));

  return (
    <>
      <PageHeader eyebrow="Info" title="About UKCW">
        Who runs the server, the teams behind it, and how to get started.
      </PageHeader>

      {/* ---------------- Leadership ---------------- */}
      <section className={`section ${t.band}`} id="leadership">
        <div className="container">
          <span className="eyebrow">Leadership</span>
          <h2 className="section-title">Owner &amp; board of chairmen</h2>

          <ul className={t.leaders}>
            {leadership.map((l) => {
              const src = headshots[l.robloxId];
              return (
                <li key={l.robloxId}>
                  <a
                    href={robloxProfile(l.robloxId)}
                    className={t.leader}
                    data-owner={l.role === "Owner" || undefined}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <div className={t.portrait}>
                      {src ? (
                        <Image src={src} alt={`${l.name}'s Roblox avatar`} fill sizes="(max-width: 640px) 50vw, 280px" />
                      ) : (
                        <span className={t.initial} aria-hidden>
                          {l.name.replace(/[^a-z]/gi, "").charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className={t.leaderText}>
                      <span className={t.role}>{l.role}</span>
                      <h3>{l.name}</h3>
                      <span className={t.handle}>
                        @{l.username} <span className="arrow">↗</span>
                      </span>
                    </div>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ---------------- Staff teams ---------------- */}
      <section className="section" id="staff">
        <div className="container">
          <span className="eyebrow">Staff</span>
          <h2 className="section-title">The teams behind the server</h2>

          <ul className={t.teams}>
            {staffTeams.map((team) => (
              <li key={team.name} className={t.team}>
                <h3>{team.name}</h3>
                <p>{team.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------------- How to join ---------------- */}
      <section className={`section ${t.band}`} id="join">
        <div className={`container ${s.split}`}>
          <div className={s.splitIntro}>
            <span className="eyebrow">How to join</span>
            <h2 className="section-title">From Discord to your first call.</h2>
            <p className="lede">
              You don&rsquo;t need experience. Every department runs its own training, and there&rsquo;s always
              someone in the Discord who can help.
            </p>
            <div className={t.needs}>
              <h3>What you&rsquo;ll need</h3>
              <p>A Discord account and Roblox. That&rsquo;s it.</p>
            </div>
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
