import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { SessionPanel } from "@/components/SessionPanel";
import { site } from "@/lib/site";
import s from "../subpage.module.css";

export const metadata: Metadata = {
  title: "Sessions",
  description: "Live UKCW server status, player count and server code.",
};

const faq = [
  {
    q: "How do I join the server?",
    a: `Open Emergency Response: Liberty County, go to private servers and enter the code ${site.serverCode}.`,
  },
  {
    q: "Where are sessions announced?",
    a: "In the sessions channel on the Discord. The status panel on this page follows the same announcements, so the two always agree.",
  },
  {
    q: "The server is full. What now?",
    a: `There are ${site.maxPlayers} slots. Stay in the Discord: spaces open up as people leave, and the player count here updates every 30 seconds.`,
  },
  {
    q: "People are in-game but it says offline?",
    a: "The status only shows official sessions hosted by staff. Outside of those, the server may be open for training or testing.",
  },
];

export default function SessionsPage() {
  return (
    <>
      <PageHeader eyebrow="Sessions" title="Server status" aside={<SessionPanel />}>
        Sessions are hosted by staff and announced in the Discord. This page updates on its own, so you can leave it
        open.
      </PageHeader>

      <section className="section">
        <div className={`container ${s.split}`}>
          <div className={s.splitIntro}>
            <span className="eyebrow">Good to know</span>
            <h2 className="section-title">Before you load in.</h2>
          </div>
          <dl className={s.faq}>
            {faq.map((item) => (
              <div key={item.q}>
                <dt>{item.q}</dt>
                <dd>{item.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className={s.next}>
        <div className={`container ${s.nextInner}`}>
          <div>
            <h2>Never miss a startup.</h2>
            <p>Turn on notifications for the sessions channel.</p>
          </div>
          <div className={s.nextActions}>
            <a href={site.discordInvite} className="btn btn-primary" target="_blank" rel="noreferrer">
              Join the Discord <span className="arrow">→</span>
            </a>
            <Link href="/info" className="btn btn-ghost">
              Info
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
