import Image from "next/image";
import Link from "next/link";
import { Departments } from "@/components/Departments";
import { SessionPanel } from "@/components/SessionPanel";
import { Waves } from "@/components/Waves";
import { departments } from "@/lib/departments";
import { getCommunity } from "@/lib/discord";
import { site } from "@/lib/site";
import s from "./page.module.css";

const fmt = new Intl.NumberFormat("en-GB");

export default async function Home() {
  const community = await getCommunity();

  return (
    <>
      {/* ---------------- Hero ---------------- */}
      <section className={s.hero}>
        <div className={s.glow} aria-hidden />
        <div className={`container ${s.heroGrid}`}>
          <div>
            <span className="eyebrow">Emergency Response: Liberty County · UK roleplay</span>
            <h1 className={s.title}>
              <span>Canary</span>
              <span>Wharf</span>
              <span className={s.titleAccent}>Roleplay</span>
            </h1>
            <p className={s.heroLede}>
              A British emergency services community on ER:LC. Structured sessions, proper chains of command and eight
              departments working the same streets, from a Met response car to an RNLI crew on the Thames.
            </p>
            <div className={s.heroActions}>
              <a href={site.discordInvite} className="btn btn-primary" target="_blank" rel="noreferrer">
                Join the Discord <span className="arrow">→</span>
              </a>
              <Link href="/departments" className="btn btn-ghost">
                See departments
              </Link>
            </div>
          </div>

          <SessionPanel />
        </div>

        <Waves className={s.waves} />
      </section>

      {/* ---------------- Figures ---------------- */}
      <section className={s.figures} aria-label="Community in numbers">
        <div className={`container ${s.figuresGrid}`}>
          <div>
            <span className={s.figure}>{fmt.format(community.members)}</span>
            <span className={s.figureLabel}>Discord members</span>
          </div>
          <div>
            <span className={s.figure}>{community.online !== null ? fmt.format(community.online) : "—"}</span>
            <span className={s.figureLabel}>Online in Discord now</span>
          </div>
          <div>
            <span className={s.figure}>{departments.length}</span>
            <span className={s.figureLabel}>Departments</span>
          </div>
          <div>
            <span className={s.figure}>{site.maxPlayers}</span>
            <span className={s.figureLabel}>Players per session</span>
          </div>
        </div>
      </section>

      {/* ---------------- Departments ---------------- */}
      <section className="section">
        <div className="container">
          <div className={s.sectionHead}>
            <div>
              <span className="eyebrow">Departments</span>
              <h2 className="section-title">Eight services. One city to keep running.</h2>
            </div>
            <Link href="/departments" className={s.more}>
              All departments <span className="arrow">→</span>
            </Link>
          </div>
          <Departments variant="grid" />
        </div>
      </section>

      {/* ---------------- Onward links ---------------- */}
      <section className={s.onward}>
        <div className={`container ${s.onwardGrid}`}>
          <Link href="/sessions" className={s.onwardCard}>
            <span className="eyebrow">Sessions</span>
            <h2>Server status</h2>
            <p>Whether a session is running, how many players are in, and the server code.</p>
            <span className={s.onwardArrow}>
              Read more <span className="arrow">→</span>
            </span>
          </Link>
          <Link href="/info" className={s.onwardCard}>
            <span className="eyebrow">Info</span>
            <h2>From Discord to your first call</h2>
            <p>Four steps, no experience needed. Every department runs its own training.</p>
            <span className={s.onwardArrow}>
              Get started <span className="arrow">→</span>
            </span>
          </Link>
        </div>
      </section>

      {/* ---------------- Community CTA ---------------- */}
      <section className={s.cta}>
        <div className="container">
          <div className={s.ctaGrid}>
            <figure className={s.ctaMedia}>
              <Image
                src="/brand/members-4300.webp"
                alt="Thanks for 4,300 members, over a collage of in-game screenshots"
                width={1598}
                height={899}
                sizes="(max-width: 900px) 100vw, 600px"
              />
            </figure>
            <div>
              <h2 className="section-title">{fmt.format(community.members)} members and counting.</h2>
              <p className="lede">
                Come and see what a proper session looks like. The next startup is only ever a notification away.
              </p>
              <a href={site.discordInvite} className={`btn btn-primary ${s.ctaBtn}`} target="_blank" rel="noreferrer">
                Join the Discord <span className="arrow">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
