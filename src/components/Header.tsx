"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav, site } from "@/lib/site";
import { StatusDot } from "./StatusDot";
import { useSession } from "./SessionProvider";
import s from "./Header.module.css";

export function Header() {
  const { session } = useSession();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu after navigating.
  useEffect(() => setOpen(false), [pathname]);

  const live = session.state === "active" || session.state === "full";
  const short =
    session.state === "offline"
      ? "Offline"
      : session.state === "vote"
        ? "Vote open"
        : session.players !== null
          ? `${session.players}/${session.maxPlayers}`
          : "Live";

  const isCurrent = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className={`${s.header} ${scrolled || open ? s.solid : ""}`}>
      <div className={`container ${s.inner}`}>
        <Link href="/" className={s.brand} aria-label={`${site.name} home`}>
          <Image src="/brand/logo.png" alt="" width={32} height={32} className={s.logo} priority />
          <span>{site.shortName}</span>
        </Link>

        <nav className={s.nav} aria-label="Primary">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} aria-current={isCurrent(item.href) ? "page" : undefined}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={s.actions}>
          <Link href="/sessions" className={s.status} title="Server status">
            <StatusDot state={session.state} />
            <span className={live ? s.statusLive : undefined}>{short}</span>
          </Link>
          <a href={site.discordInvite} className={`btn btn-primary btn-sm ${s.cta}`} target="_blank" rel="noreferrer">
            Join Discord
          </a>
          <button
            type="button"
            className={s.menuBtn}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="visually-hidden">{open ? "Close menu" : "Open menu"}</span>
            <span className={s.bars} data-open={open} aria-hidden />
          </button>
        </div>
      </div>

      <div id="mobile-nav" className={s.mobile} hidden={!open}>
        <div className="container">
          <Link href="/" aria-current={pathname === "/" ? "page" : undefined}>
            Home
          </Link>
          {nav.map((item) => (
            <Link key={item.href} href={item.href} aria-current={isCurrent(item.href) ? "page" : undefined}>
              {item.label}
            </Link>
          ))}
          <a href={site.discordInvite} className="btn btn-primary" target="_blank" rel="noreferrer">
            Join Discord
          </a>
        </div>
      </div>
    </header>
  );
}
