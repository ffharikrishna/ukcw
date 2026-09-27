"use client";

import { useCallback, useEffect, useState } from "react";
import { departments, featuredDepartments, type Department } from "@/lib/departments";
import { DepartmentDialog } from "./DepartmentDialog";
import { DepartmentLogo } from "./DepartmentLogo";
import s from "./Departments.module.css";

/**
 * Department list (/departments) or logo grid (home). Either one opens the
 * department popup, and the popup follows the URL hash so /departments#lfb
 * can be linked to directly.
 */
export function Departments({ variant }: { variant: "list" | "grid" }) {
  const [active, setActive] = useState<Department | null>(null);

  const open = useCallback((d: Department) => {
    setActive(d);
    history.replaceState(null, "", `#${d.slug}`);
  }, []);

  const close = useCallback(() => {
    setActive(null);
    history.replaceState(null, "", location.pathname + location.search);
  }, []);

  useEffect(() => {
    const fromHash = () => {
      const d = departments.find((x) => `#${x.slug}` === location.hash);
      if (d) setActive(d);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  return (
    <>
      {variant === "list" ? <List onOpen={open} /> : <Grid onOpen={open} />}
      <DepartmentDialog dept={active} onClose={close} />
    </>
  );
}

function List({ onOpen }: { onOpen: (d: Department) => void }) {
  const others = departments.filter((d) => !d.featured);
  return (
    <>
      <Rows items={featuredDepartments} onOpen={onOpen} />
      {others.length > 0 && (
        <>
          <div className={s.groupHead}>
            <h2>More departments</h2>
            <p>Details for these are on the way.</p>
          </div>
          <Rows items={others} onOpen={onOpen} />
        </>
      )}
    </>
  );
}

function Rows({ items, onOpen }: { items: Department[]; onOpen: (d: Department) => void }) {
  return (
    <ol className={s.list}>
      {items.map((d) => (
        <li key={d.slug} id={d.slug} className={s.row}>
          <div className={s.mark}>
            <DepartmentLogo dept={d} height={52} />
          </div>
          <div>
            <h2 className={s.name}>
              {/* Stretched over the whole row, so the row is the click target. */}
              <button type="button" className={s.rowButton} onClick={() => onOpen(d)} aria-haspopup="dialog">
                {d.name}
              </button>
            </h2>
            <span className={s.meta}>
              {d.abbr} · {d.division}
            </span>
            <p className={s.summary}>{d.summary}</p>
          </div>
          <div className={s.side}>
            {d.roles.length > 0 && (
              <ul className={s.roles} aria-label={`${d.abbr} roles`}>
                {d.roles.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            )}
            <span className={s.view} aria-hidden>
              View department <span className="arrow">→</span>
            </span>
          </div>
        </li>
      ))}
    </ol>
  );
}

function Grid({ onOpen }: { onOpen: (d: Department) => void }) {
  return (
    <ul className={s.grid}>
      {featuredDepartments.map((d) => (
        <li key={d.slug}>
          <button type="button" className={s.tile} onClick={() => onOpen(d)} aria-haspopup="dialog">
            <span className={s.tileMark}>
              <DepartmentLogo dept={d} height={48} />
            </span>
            <span className={s.tileName}>{d.name}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
