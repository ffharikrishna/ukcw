"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { Department } from "@/lib/departments";
import { site } from "@/lib/site";
import { DepartmentLogo } from "./DepartmentLogo";
import s from "./DepartmentDialog.module.css";

const GALLERY_SLOTS = 3;

export function DepartmentDialog({ dept, onClose }: { dept: Department | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (dept && !dialog.open) dialog.showModal();
    if (!dept && dialog.open) dialog.close();
    // Start at the top when switching between departments.
    dialog.querySelector(`.${s.body}`)?.scrollTo({ top: 0 });
  }, [dept]);

  return (
    <dialog
      ref={ref}
      className={s.dialog}
      aria-labelledby="dept-title"
      onClose={onClose}
      // Clicks on the backdrop land on the <dialog> itself; content clicks land on children.
      onClick={(e) => e.target === e.currentTarget && ref.current?.close()}
    >
      {dept && (
        <div className={s.body}>
          <button type="button" className={s.close} onClick={() => ref.current?.close()} aria-label="Close">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>

          <header className={s.head}>
            <div>
              <h2 id="dept-title" className={s.title}>
                {dept.name}
              </h2>
              <span className={s.meta}>
                {dept.abbr} · {dept.division}
              </span>
            </div>
            <div className={s.mark}>
              <DepartmentLogo dept={dept} height={56} />
            </div>
          </header>

          <div className={s.about}>
            {dept.about.length > 0 ? (
              dept.about.map((p) => <p key={p.slice(0, 24)}>{p}</p>)
            ) : (
              <p>More details about {dept.name} are coming soon.</p>
            )}
          </div>

          <div className={s.gallery}>
            {Array.from({ length: GALLERY_SLOTS }, (_, i) => {
              const img = dept.gallery[i];
              return (
                <figure key={i} className={s.shot}>
                  {img ? (
                    <Image src={img.src} alt={img.alt} fill sizes="(max-width: 720px) 100vw, 560px" />
                  ) : (
                    <div className={s.placeholder}>
                      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
                        <path
                          d="M4 7.5h3l1.5-2h7L17 7.5h3v11H4z M12 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.4"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span>Screenshot coming soon</span>
                    </div>
                  )}
                </figure>
              );
            })}
          </div>

          {dept.units.length > 0 && (
            <section className={s.units} aria-labelledby="dept-units">
              <h3 id="dept-units">Units &amp; services</h3>
              <ul>
                {dept.units.map((u) => (
                  <li key={u.name}>
                    <div className={s.unitHead}>
                      {u.code && <span className={s.code}>{u.code}</span>}
                      <span className={s.unitName}>{u.name}</span>
                    </div>
                    {u.description && <p>{u.description}</p>}
                    {(u.callsign || u.access) && (
                      <dl className={s.unitMeta}>
                        {u.callsign && (
                          <div>
                            <dt>Callsign</dt>
                            <dd className={s.callsign}>{u.callsign}</dd>
                          </div>
                        )}
                        {u.access && (
                          <div>
                            <dt>Access</dt>
                            <dd>{u.access}</dd>
                          </div>
                        )}
                      </dl>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {dept.joining && (
            <section className={s.joining}>
              <h3>{dept.joining.question}</h3>
              <p>{dept.joining.answer}</p>
            </section>
          )}

          <footer className={s.foot}>
            <p>Applications and training for {dept.abbr} run through the Discord.</p>
            <a href={site.discordInvite} className="btn btn-primary btn-sm" target="_blank" rel="noreferrer">
              Apply in the Discord <span className="arrow">→</span>
            </a>
          </footer>
        </div>
      )}
    </dialog>
  );
}
