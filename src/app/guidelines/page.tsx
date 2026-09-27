import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { guidelineGroups } from "@/lib/guidelines";
import { site } from "@/lib/site";
import sub from "../subpage.module.css";
import s from "./guidelines.module.css";

export const metadata: Metadata = {
  title: "Guidelines",
  description: "UKCW server guidelines, grouped by the punishment each one carries.",
};

export default function GuidelinesPage() {
  const total = guidelineGroups.reduce((n, g) => n + g.rules.length, 0);

  return (
    <>
      <PageHeader eyebrow="Guidelines" title="Guidelines">
        {total} rules, grouped by the punishment they carry. Know them before you load in.
      </PageHeader>

      <section className="section">
        <div className={`container ${s.groups}`}>
          {guidelineGroups.map((g) => (
            <article key={g.slug} id={g.slug} className={s.group} aria-labelledby={`${g.slug}-title`}>
              <header className={s.head}>
                <div>
                  <h2 id={`${g.slug}-title`}>{g.title}</h2>
                  <p>{g.description}</p>
                </div>
                <div className={s.side}>
                  <ol className={s.steps} aria-label="Possible punishments">
                    {g.punishments.map((p) => (
                      <li key={p} className={s.step} data-punishment={p.toLowerCase()}>
                        {p}
                      </li>
                    ))}
                  </ol>
                  <span className={s.count}>{g.rules.length} rules</span>
                </div>
              </header>

              <ul className={s.rules}>
                {g.rules.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className={sub.next}>
        <div className={`container ${sub.nextInner}`}>
          <div>
            <h2>Not sure about a rule?</h2>
            <p>Ask a member of staff in the Discord before you act on it.</p>
          </div>
          <div className={sub.nextActions}>
            <a href={site.discordInvite} className="btn btn-primary" target="_blank" rel="noreferrer">
              Join the Discord <span className="arrow">→</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
